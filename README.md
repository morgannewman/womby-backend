# Womby Backend

## API Overview

This backend is an Node/Express application that primarily exists to allow the Womby frontend to persist data.

## Account Creation

Users can only be created with a localStrategy.

### POST `/api/users`

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
  id,
  firstName,
  lastName,
  email
}
```

Returns a 422 response when fields are missing. Returns a 400 response when an email already exists.

## Authentication

Users can autheticate using either their email/password or with JWTs on subsequent API calls.

### POST `/api/login`

```js
// req.body
{
  email: String
  password: String
}
// res.body
{
  authToken: String // 7d expiration
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

## CRUD Endpoints

All other `/api` endpoints supports standard CRUD operations.

Three document types are supported: Notes, Folders, and Tags.

Notes use the following schema:

```js
{
  title: { type: String, required: true },
  content: String,
  folderId: {type: ObjectId, ref: 'Folder'},
  tags: [...{ type: ObjectId, ref: 'Tag' }]
}
```

Folders use the following schema:

```js
{
  name: { type: String, required: true },
  parent: { type: ObjectId, ref: 'Folder', optional: true }
}
```

Tags use the following schema:

```js
{
  name: { type: String, required: true }
}
```

### GET `/api/:docType`

All documents can be retrieved with their GET `/api/:docType` endpoint.

All responses will return an array of objects.

Notes support optional query parameters:

```js
// req.query
{
  searchTerm: { type: String },
  folderId: { type: ObjectId },
  tagId: { type: ObjectId }
}

// res.body
[...notes] // sorted descending by updatedAt timestamp
```

### GET `/api/:type/:id`

Single documents can be retrieved by passing their ID as a request parameter. Successful requests will return an object.

Invalid IDs will return 400 responses. Non-existant IDs will return 404 responses.

### POST `/api/:type`

