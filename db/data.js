// seed data for multiple users
// User #1 = "Ms Green" is related to odd number _id
// User #2 = "Mr Yellow" is related to even number _id

const notes = [
  {
    _id: '111111111111111111111101',
    title: '5 life lessons learned from cats',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    userId: '000000000000000000000001'
  },
  {
    _id: '111111111111111111111103',
    title: 'What the government doesn\'t want you to know about cats',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    folderId: '222222222222222222222201',
    userId: '000000000000000000000001'
  },
  {
    _id: '111111111111111111111105',
    title: 'The most boring article about cats you\'ll ever read',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    tags: ['333333333333333333333305', '333333333333333333333307'],
    userId: '000000000000000000000001'
  },
  {
    _id: '111111111111111111111107',
    title: '7 things lady gaga has in common with cats',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    folderId: '222222222222222222222203',
    tags: ['333333333333333333333301', '333333333333333333333303', '333333333333333333333305'],
    userId: '000000000000000000000001'
  },
  {
    _id: '111111111111111111111109',
    title: 'The most incredible article about cats you\'ll ever read',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    userId: '000000000000000000000001'
  },
  {
    _id: '111111111111111111111102',
    title: 'One weird trick to train your dog',
    content: 'Posuere sollicitudin aliquam ultrices sagittis orci a. Feugiat sed lectus vestibulum mattis ullamcorper velit. Odio pellentesque diam volutpat commodo sed egestas egestas fringilla. Velit egestas dui id ornare arcu odio. Molestie at elementum eu facilisis sed odio morbi. Tempor nec feugiat nisl pretium. At tempor commodo ullamcorper a lacus. Egestas dui id ornare arcu odio. Id cursus metus aliquam eleifend. Vitae sapien pellentesque habitant morbi tristique. Dis parturient montes nascetur ridiculus. Egestas egestas fringilla phasellus faucibus scelerisque eleifend. Aliquam faucibus purus in massa tempor nec feugiat nisl.',
    folderId: '222222222222222222222204',
    userId: '000000000000000000000002'
  },
  {
    _id: '111111111111111111111104',
    title: '10 ways dogs can help you live to 100',
    content: 'Posuere sollicitudin aliquam ultrices sagittis orci a. Feugiat sed lectus vestibulum mattis ullamcorper velit. Odio pellentesque diam volutpat commodo sed egestas egestas fringilla. Velit egestas dui id ornare arcu odio. Molestie at elementum eu facilisis sed odio morbi. Tempor nec feugiat nisl pretium. At tempor commodo ullamcorper a lacus. Egestas dui id ornare arcu odio. Id cursus metus aliquam eleifend. Vitae sapien pellentesque habitant morbi tristique. Dis parturient montes nascetur ridiculus. Egestas egestas fringilla phasellus faucibus scelerisque eleifend. Aliquam faucibus purus in massa tempor nec feugiat nisl.',
    folderId: '222222222222222222222206',
    userId: '000000000000000000000002'
  },
  {
    _id: '111111111111111111111106',
    title: '9 reasons you can blame the recession on dogs',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    tags: ['333333333333333333333302'],
    userId: '000000000000000000000002'
  },
  {
    _id: '111111111111111111111108',
    title: '10 ways marketers are making you addicted to dogs',
    content: 'Posuere sollicitudin aliquam ultrices sagittis orci a. Feugiat sed lectus vestibulum mattis ullamcorper velit. Odio pellentesque diam volutpat commodo sed egestas egestas fringilla. Velit egestas dui id ornare arcu odio. Molestie at elementum eu facilisis sed odio morbi. Tempor nec feugiat nisl pretium. At tempor commodo ullamcorper a lacus. Egestas dui id ornare arcu odio. Id cursus metus aliquam eleifend. Vitae sapien pellentesque habitant morbi tristique. Dis parturient montes nascetur ridiculus. Egestas egestas fringilla phasellus faucibus scelerisque eleifend. Aliquam faucibus purus in massa tempor nec feugiat nisl.',
    folderId: '222222222222222222222202',
    tags: ['333333333333333333333302', '333333333333333333333306', '333333333333333333333308'],
    userId: '000000000000000000000002'
  }
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