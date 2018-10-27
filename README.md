# Womby Backend [![Build Status](https://travis-ci.org/morgannewman/womby-backend.svg?branch=master)](https://travis-ci.org/morgannewman/womby-backend)

This is the backend to Womby, a delightful little notetaking application. <a href="https://github.com/morgannewman/womby">Go check it out!</a>

This Node/Express application exposes a RESTful API to manage user authentication and data persistence. It interfaces with a MongoDB server, which is hosted on AWS through MongoDB Atlas.

## Engineering Highlights

- Extensive validation middleware in place to protect data integrity from accidental or malicious corruption
- Data models for all collections to protect data integrity
- Access-control restriction via JWT token user authentication

## Table of Contents

### I. [API Overview](#API-Overview)

### II. [Authentication Model](#Authentication-Model)

### III. [Data Models](#Data-Models)

> #### i. [Users Model](#Users-Model)
>
> #### ii. [Notes Model](#Notes-Model)
>
> #### iii. [Tags Model](#Tags-Model)
>
> #### iv. [Folders Model](#Folders-Model)

## API Overview

```text
/api
.
├── /auth
│   └── POST
│       ├── /login
│       └── /users
├── /users
│   └── POST
│       └── /login
├── /notes
│   ├── GET
│   │   ├── /
│   │   └── /:id
│   ├── POST
│   │   └── /
│   ├── PUT
│   │   └── /:id
│   └── DELETE
│       └── /:id
├── /tags
│   ├── GET
│   │   ├── /
│   │   └── /:id
│   ├── POST
│   │   └── /
│   ├── PUT
│   │   └── /:id
│   └── DELETE
│       └── /:id
└── /folders
    ├── GET
    │   ├── /
    │   └── /:id
    ├── POST
    │   └── /
    ├── PUT
    │   └── /:id
    └── DELETE
        └── /:id
```

## Authentication Model

Users can autheticate using either their email/password or with JWTs on subsequent API calls.

### POST `/api/login`

```js
// req.body
{
  email: String;
  password: String;
}

// res.body
{
  authToken: String; // 7d expiration
}
```

### POST `/api/refresh`

```js
// req.header
Authorization: Bearer ${token} // valid for 7d

// res.body
{
  authToken: ${token}
}
```

## Data Models

All requests are access-controlled by authentication tokens. Requests must be submitted with the header:

`Authorization: Bearer ${token}`

Any requests that do not conform to the relevant data model (e.g. a request without a required id field) return a `400` error.

Any `GET` / `PUT` / `DELETE` requests to non-existent items return a `404` error.

### Users Model

Users can only be created with their email and password.

- Returns a 422 response when fields are missing.
- Returns a 400 response when the submitted email already exists.

#### POST /api/users

```js
// req.body
{
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}

// res.header
location: "/api/users/:id"

// res.body
{
  firstName,
  lastName,
  email
}
```

### Notes Model

Notes are created with the following model:

```js
{
  id: { type: id }
  title: { type: String },
  folderId: { type: id, ref: 'Folder' },
  tags: [{ type: id, ref: 'Tag' }],
  document: {}
}
```

- Notes created without a title are automatically given the title `Untitled note`.
- Notes sreated without a document automatically return an empty document model corresponding to SlateJS's data model.

### Folders Model

Folders are created using the following model:

```js
{
  name: { type: String, required: true },
  parent: { type: id, ref: 'Folder' }
}
```

The parent property can be used to construct n-ary trees for nesting folders.

### Tags Model

Tags are created with the following model:

```js
{
  name: { type: String, required: true }
}
```
