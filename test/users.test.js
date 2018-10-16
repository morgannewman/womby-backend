const app = require('../server');
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const { TEST_MONGODB_URI } = require('../config');

const User = require('../models/user');

const expect = chai.expect;

chai.use(chaiHttp);

describe('Noteful API - Users', function () {
  const email = 'exampleuser@test.com';
  const password = 'examplePass';
  const firstName = 'Example';
  const lastName = 'User'

  before(function () {
    return mongoose.connect(TEST_MONGODB_URI)
      .then(() => mongoose.connection.db.dropDatabase());
  });

  beforeEach(function () {
    return User.createIndexes();
  });

  afterEach(function () {
    return mongoose.connection.db.dropDatabase();
  });

  after(function () {
    return mongoose.disconnect();
  });

  const req = (method, endpoint = '/') => {
    method = method.toLowerCase();
    return chai.request(app)[method]('/api/users' + endpoint);
  };
  
  describe('/api/users', function () {
    describe('POST', function () {
      it('Should create a new user', function () {
        const testUser = { email, password, firstName, lastName };
        let res;
        return req('post')
          .send(testUser)
          .then(_res => {
            res = _res;
            expect(res).to.have.status(201);
            expect(res.body).to.be.an('object');
            expect(res.body).to.include.keys('id', 'email', 'firstName', 'lastName');

            expect(res.body.id).to.exist;
            expect(res.body.email).to.equal(testUser.email);
            expect(res.body.firstName).to.equal(testUser.firstName);
            expect(res.body.lastName).to.equal(testUser.lastName);

            return User.findOne({ email });
          })
          .then(user => {
            expect(user).to.exist;
            expect(user.id).to.equal(res.body.id);
            expect(user.firstName).to.equal(testUser.firstName);
            expect(user.lastName).to.equal(testUser.lastName);
            return user.validatePassword(password);
          })
          .then(isValid => {
            expect(isValid).to.be.true;
          });
      });
      it('Should reject users with missing email', function () {
        const testUser = { password, firstName, lastName };
        return req('post')
          .send(testUser)
          .then(res => {
            expect(res).to.have.status(422);
          });
      });
      
      it('Should reject users with missing password', () => {
        const testUser = { firstName, lastName, email };
        return req('post')
          .send(testUser)
          .then(res => {
            expect(res).to.have.status(422);
          });
      });

      it('Should reject users with non-string email', () => {
        const testUser = { firstName, lastName, password, email: {hello: 'world'} };
        return req('post')
          .send(testUser)
          .then(res => {
            expect(res).to.have.status(400);
          });
      });

      it('Should reject users with non-string password', () => {
        const testUser = { firstName, lastName, email, password: {hello: 'world'} };
        return req('post')
          .send(testUser)
          .then(res => {
            expect(res).to.have.status(400);
          });
      });

      it('Should reject users with non-trimmed email', () => {
        const testUser = { firstName, lastName, password, email: ' userHere@test.com ' };
        return req('post')
          .send(testUser)
          .then(res => {
            expect(res).to.have.status(400);
          });
      });

      it('Should reject users with non-trimmed password', () => {
        const testUser = { firstName, lastName, email, password: ' hello!' };
        return req('post')
          .send(testUser)
          .then(res => {
            expect(res).to.have.status(400);
          });
      });

      it('Should reject users with empty email', () => {
        const testUser = { firstName, lastName, email: '', password };
        return req('post')
          .send(testUser)
          .then(res => {
            expect(res).to.have.status(400);
          });
      });

      it('Should reject users with password less than 8 characters', () => {
        const testUser = { firstName, lastName, email, password: '1234567' };
        return req('post')
          .send(testUser)
          .then(res => {
            expect(res).to.have.status(400);
          });
      });

      it('Should reject users with password greater than 72 characters', () => {
        const testUser = { firstName, lastName, email, password: 'hfjhfksdjhdfjkdfsjkhfdhskjfdkjsjkhfdhfdjksdjfkdskjfhkvbfskhvbjfhksjvbhfkekshbvsehvbfhesui4wrhbiubesbvgrukseyrnhrsyhruvhsksrebyseuvbryksvbryesukvbresyrksbukrsyvebrysvbyreusvyrksyervkusbrkvuse' };
        return req('post')
          .send(testUser)
          .then(res => {
            expect(res).to.have.status(400);
          });
      });

      it('Should reject users with duplicate email', () => {
        const testUser = { firstName, lastName, email, password };
        return req('post').send(testUser)
          .then(() => req('post').send(testUser))
          .then(res => expect(res).to.have.status(400));
      });

      it('Should trim firstName', () => {
        const testUser = { firstName: ' Morgan  ', lastName: ' Freeman  ', email, password };
        return req('post').send(testUser)
          .then(res => {
            expect(res.body.firstName).to.equal('Morgan');
            expect(res.body.lastName).to.equal('Freeman');
          });
      });

    });
  });
});