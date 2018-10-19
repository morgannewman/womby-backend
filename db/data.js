// seed data for multiple users
// User #1 = "Ms Green" is related to odd number _id
// User #2 = "Mr Yellow" is related to even number _id

const notes = [
  {
    _id: '111111111111111111111101',
    title: '5 life lessons learned from dogs',
    userId: '000000000000000000000001',
    document: {
      document: {
        nodes: [
          {
            object: 'block',
            type: 'paragraph',
            nodes: [
              {
                object: 'text',
                leaves: [
                  {
                    text: 'This is the text for 5 life lessons learned from dogs'
                  }
                ]
              }
            ]
          }
        ]
      }
    }
  },
  {
    _id: '111111111111111111111103',
    title: 'What the government doesn\'t want you to know about dogs',
    folderId: '222222222222222222222201',
    userId: '000000000000000000000001',
    document: {
      document: {
        nodes: [
          {
            object: 'block',
            type: 'paragraph',
            nodes: [
              {
                object: 'text',
                leaves: [
                  {
                    text: 'This is the text for What the government doesn\'t want you to know about dogs'
                  }
                ]
              }
            ]
          }
        ]
      }
    }
  },
  {
    _id: '111111111111111111111105',
    title: 'The most boring article about dogs you\'ll ever read',
    tags: ['333333333333333333333305', '333333333333333333333307'],
    userId: '000000000000000000000001',
    document: {
      document: {
        nodes: [
          {
            object: 'block',
            type: 'paragraph',
            nodes: [
              {
                object: 'text',
                leaves: [
                  {
                    text: 'This is the text for The most boring article about dogs you\'ll ever read'
                  }
                ]
              }
            ]
          }
        ]
      }
    }
  },
  {
    _id: '111111111111111111111107',
    title: '7 things lady gaga has in common with dogs',
    folderId: '222222222222222222222203',
    tags: ['333333333333333333333301', '333333333333333333333303', '333333333333333333333305'],
    userId: '000000000000000000000001',
    document: {
      document: {
        nodes: [
          {
            object: 'block',
            type: 'paragraph',
            nodes: [
              {
                object: 'text',
                leaves: [
                  {
                    text: 'This is the text for 7 things lady gaga has in common with dogs'
                  }
                ]
              }
            ]
          }
        ]
      }
    }
  },
  {
    _id: '111111111111111111111109',
    title: 'The most incredible article about dogs you\'ll ever read',
    userId: '000000000000000000000001',
    document: {
      document: {
        nodes: [
          {
            object: 'block',
            type: 'paragraph',
            nodes: [
              {
                object: 'text',
                leaves: [
                  {
                    text: 'This is the text for The most incredible article about dogs you\'ll ever read'
                  }
                ]
              }
            ]
          }
        ]
      }
    }
  },
  {
    _id: '111111111111111111111102',
    title: 'One weird trick to train your dog',
    folderId: '222222222222222222222204',
    userId: '000000000000000000000002',
    document: {
      document: {
        nodes: [
          {
            object: 'block',
            type: 'paragraph',
            nodes: [
              {
                object: 'text',
                leaves: [
                  {
                    text: 'This is the text for One weird trick to train your dog'
                  }
                ]
              }
            ]
          }
        ]
      }
    }
  },
  {
    _id: '111111111111111111111104',
    title: '10 ways dogs can help you live to 100',
    folderId: '222222222222222222222206',
    userId: '000000000000000000000002',
    document: {
      document: {
        nodes: [
          {
            object: 'block',
            type: 'paragraph',
            nodes: [
              {
                object: 'text',
                leaves: [
                  {
                    text: 'This is the text for 10 ways dogs can help you live to 100'
                  }
                ]
              }
            ]
          }
        ]
      }
    }
  },
  {
    _id: '111111111111111111111106',
    title: '9 reasons you can blame the recession on dogs',
    tags: ['333333333333333333333302'],
    userId: '000000000000000000000002',
    document: {
      document: {
        nodes: [
          {
            object: 'block',
            type: 'paragraph',
            nodes: [
              {
                object: 'text',
                leaves: [
                  {
                    text: 'This is the text for 9 reasons you can blame the recession on dogs'
                  }
                ]
              }
            ]
          }
        ]
      }
    }
  },
  {
    _id: '111111111111111111111108',
    title: '10 ways marketers are making you addicted to dogs',
    folderId: '222222222222222222222202',
    tags: ['333333333333333333333302', '333333333333333333333306', '333333333333333333333308'],
    userId: '000000000000000000000002',
    document: {
      document: {
        nodes: [
          {
            object: 'block',
            type: 'paragraph',
            nodes: [
              {
                object: 'text',
                leaves: [
                  {
                    text: 'This is the text for 10 ways marketers are making you addicted to dogs'
                  }
                ]
              }
            ]
          }
        ]
      }
    }

  },
];

const folders = [
  {
    _id: '222222222222222222222201',
    name: 'Archive',
    userId: '000000000000000000000001'
  },
  {
    _id: '222222222222222222222203',
    name: 'Drafts',
    userId: '000000000000000000000001'
  },
  {
    _id: '222222222222222222222205',
    name: 'Personal',
    userId: '000000000000000000000001'
  },
  {
    _id: '111111111111111111111107',
    name: 'Work',
    userId: '000000000000000000000001'
  },

  {
    _id: '222222222222222222222202',
    name: 'Archive',
    userId: '000000000000000000000002'
  },
  {
    _id: '222222222222222222222204',
    name: 'Important',
    userId: '000000000000000000000002'
  },
  {
    _id: '222222222222222222222206',
    name: 'Personal',
    userId: '000000000000000000000002'
  },
  {
    _id: '222222222222222222222208',
    name: 'Work-In-Progress',
    userId: '000000000000000000000002'
  }
];

const tags = [
  {
    _id: '333333333333333333333301',
    name: 'Foo',
    userId: '000000000000000000000001'
  },
  {
    _id: '333333333333333333333303',
    name: 'Bar',
    userId: '000000000000000000000001'
  },
  {
    _id: '333333333333333333333305',
    name: 'Baz',
    userId: '000000000000000000000001'
  },
  {
    _id: '333333333333333333333307',
    name: 'Qux',
    userId: '000000000000000000000001'
  },

  {
    _id: '333333333333333333333302',
    name: 'Waldo',
    userId: '000000000000000000000002'
  },
  {
    _id: '333333333333333333333304',
    name: 'Thud',
    userId: '000000000000000000000002'
  },
  {
    _id: '333333333333333333333306',
    name: 'Wobble',
    userId: '000000000000000000000002'
  },
  {
    _id: '333333333333333333333308',
    name: 'Boop',
    userId: '000000000000000000000002'
  }
];

const users = [
  {
    _id: '000000000000000000000001',
    firstName: 'Timothy',
    lastName: 'green',
    email: 'msgreen@test.com',
    password: '$2a$10$QJCIX42iD5QMxLRgHHBJre2rH6c6nI24UysmSYtkmeFv6X8uS1kgi'
  },
  {
    _id: '000000000000000000000002',
    firstName: 'Todd',
    lastName: 'Yellow',
    email: 'mryellow@test.com',
    password: '$2a$10$QJCIX42iD5QMxLRgHHBJre2rH6c6nI24UysmSYtkmeFv6X8uS1kgi'
  }
];

module.exports = { folders, notes, tags, users };