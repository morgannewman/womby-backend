const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
// jwt
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

const app = require('../server');
const { TEST_MONGODB_URI } = require('../config');

const Folder = require('../models/folder');
const { folders } = require('../db/data');
const User = require('../models/user');
const { users } = require('../db/data');


const expect = chai.expect;
chai.use(chaiHttp);

describe('Folder Router Tests', () => {
  before(function() {
    return mongoose
      .connect(
        TEST_MONGODB_URI,
        { useNewUrlParser: true }
      )
      .then(() => mongoose.connection.db.dropDatabase());
  });

  let token;
  let user;
  beforeEach(function() {
    return Promise.all(users.map(user => User.hashPassword(user.password)))
      .then(digests => {
        users.forEach((user, i) => (user.password = digests[i]));
        return Promise.all([
          User.insertMany(users),
          Folder.insertMany(folders),
          Folder.createIndexes()
        ]);
      })
      .then(([users]) => {
        user = users[0];
        token = jwt.sign({ user }, JWT_SECRET, { subject: user.email });
      });
  });

  afterEach(function() {
    return mongoose.connection.db.dropDatabase();
  });

  after(function() {
    return mongoose.disconnect();
  });

  const req = (method, endpoint) => {
    method = method.toLowerCase();
    return chai
      .request(app)[method]('/api/folders' + endpoint)
      .set('Authorization', `Bearer ${token}`);
  };

  const validateFields = (res, expectedFields) => {
    const response = res.body;
    if (typeof response === 'object') {
      if (Array.isArray(response)) {
        for (const item of response) {
          expect(item).to.have.keys(expectedFields);
        }
      } else expect(response).to.have.keys(expectedFields);
    }
  };
  const expectedFields = ['id', 'name', 'createdAt', 'updatedAt'];

  describe('GET /api/folders', function() {
    it('should respond with all folders', () => {
      // 1) Call the database **and** the API
      // 2) Wait for both promises to resolve using `Promise.all`
      return (
        Promise.all([Folder.find({ userId: user.id }), req('get', '/')])
          // 3) then compare database results to API response
          .then(([data, res]) => {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            expect(res.body).to.be.a('array');
            expect(res.body).to.have.length(data.length);
            validateFields(res, expectedFields);
          })
      );
    });

    it('should sort folders by name', () => {
      return req('get', '/').then(dbRes => {
        expect(dbRes.body.map(item => item.name)).to.eql([
          'Archive',
          'Drafts',
          'Personal',
          'Work'
        ]);
      });
    });
  });

  describe('GET /api/folders/:id', function() {
    it('should return correct folder by the `id` parameter', function() {
      let data;
      // 1) First, call the database
      return Folder.findOne({ userId: user.id })
        .then(_data => {
          data = _data;
          // 2) then call the API with the ID
          return req('get', `/${data.id}`);
        })
        .then(res => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;

          expect(res.body).to.be.an('object');
          validateFields(res, expectedFields);

          // 3) then compare database results to API response
          expect(res.body.id).to.equal(data.id);
          expect(res.body.name).to.equal(data.name);
          expect(new Date(res.body.createdAt)).to.eql(data.createdAt);
          expect(new Date(res.body.updatedAt)).to.eql(data.updatedAt);
        });
    });

    it('should return the expected fields', () => {
      // 1) First, call the database
      let data;
      return Folder.findOne({ userId: user.id })
        .then(_data => {
          data = _data;
          // 2) then call the API with the ID
          return req('get', `/${data.id}`);
        })
        .then(res => {
          validateFields(res, expectedFields);
        });
    });

    it('should make sure the `id` parameter is a valid ID', () => {
      return req('get', '/INVALIDIDHERE').then(res => {
        expect(res).to.have.status(400);
      });
    });

    it('should 404 if the ID is valid but does not exist in the database', () => {
      return req('get', '/faaaaaaaaaaaaaaaaaaaaaaa').then(res => {
        expect(res).to.have.status(404);
      });
    });
  });

  describe('POST /api/folders', function() {
    const newItem = {
      name: 'TestFolder'
    };

    it('should create and return a new item when provided valid data', function() {
      let res;
      // 1) First, call the API
      return (
        req('post', '/')
          .send(newItem)
          .then(function(_res) {
            res = _res;
            expect(res).to.have.status(201);
            expect(res).to.have.header('location');
            expect(res).to.be.json;
            expect(res.body).to.be.a('object');
            validateFields(res, expectedFields);
            // 2) then call the database
            return Folder.findOne({ _id: res.body.id, userId: user.id });
          })
          // 3) then compare the API response to the database results
          .then(data => {
            expect(res.body.id).to.equal(data.id);
          })
      );
    });

    it('should return an object with the expected fields', () => {
      return req('post', '/')
        .send(newItem)
        .then(res => {
          expect(res.body).to.be.an('object');
          validateFields(res, expectedFields);
        });
    });

    it('should catch duplicate key errors', () => {
      let item;
      return Folder.findOne({ userId: user.id })
        .then(_data => {
          item = _data;
          return req('post', '/')
            .send({ name: item.name });
        })
        .then(res => {
          expect(res).to.have.status(400);
        });
    });

    it('should return a valid location header with new ID', () => {
      req('post', '/')
        .send(newItem)
        .then(res => {
          expect(res).to.have.header(
            'Location',
            /\/api\/folders\/[0-9a-fA-F]{24}/
          );
        });
    });
  });

  describe('PUT /api/folders/:id', () => {
    it('should update a folder by an `id`', () => {
      let item;
      return Folder.findOne({ userId: user.id })
        .then(res => {
          item = res;
          return req('put', '/' + item.id)
            .send({
              id: item.id,
              name: 'testFolder'
            });
        })
        .then(res => {
          validateFields(res, expectedFields);
          expect(res.body.id).to.equal(item.id);
          expect(res.body.name).to.equal('testFolder');
        });
    });

    it('should require a valid id', () => {
      return req('put', '/INVALIDIDHERE')
        .send({
          id: 'INVALIDIDHERE',
          title: 'HEllo!',
          content: 'hello world!'
        })
        .then(res => {
          expect(res).to.have.status(400);
        });
    });

    it('should 404 if the id is valid but does not exist in the database', () => {
      return req('put', '/990111111111111111111101')
        .send({
          id: '990111111111111111111101',
          name: 'Hello',
        })
        .then(res => {
          expect(res).to.have.status(404);
        });
    });

    it('should require an id in request body', () => {
      return req('put', '/000000000000000000000000')
        .send({
          name: 'Test'
        })
        .then(res => {
          expect(res).to.have.status(400);
        });
    });

    it('should require a matching id in both the request query and body', () => {
      return req('put', '/faaaaaaaaaaaaaaaaaaaaaaa')
        .send({
          id: '222222222222222222222201',
          name: 'Hello'
        })
        .then(res => {
          expect(res).to.have.status(400);
        });
    });
  });

  describe('DELETE /api/folders/:id', () => {
    it('should delete a folder by an `id`', () => {
      return Folder.findOne({ userId: user.id })
        .then(res => req('delete', `/${res.id}`))
        .then(res => {
          expect(res).to.have.status(204);
        });
    });
  

    it('should require a valid id', () => {
      return req('delete', '/00000').then(res => {
        expect(res).to.have.status(400);
      });
    });

    it('should 404 if the id is valid but does not exist in the database', () => {
      return req('delete', '/faaaaaaaaaaaaaaaaaaaaaaa').then(res => {
        expect(res).to.have.status(404);
      });
    });

    it('should remove corresponding folderId references after deleting folder', () => {
      return req('delete', '111111111111111111111100')
        .then(res => {
          return chai.request(app).get('/api/notes/').set('Authorization', `Bearer ${token}`);
        })
        .then(res => {
          const notesInFolder = res.body.filter(
            note => note.folderId === 111111111111111111111100
          );
          expect(notesInFolder.length).to.equal(0);
        });
    });
  });
});
