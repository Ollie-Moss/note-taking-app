# Note Taking App
Fullstack application, for taking notes.

![Screenshot of the note taking app.](/notes-app.png)
# Quickstart
- Open the client and server directories in the terminal.
- Run `npm install` to install required dependencies.
- In the server directory create a `.env` file.
- Add a `ATLAS_URI` variable containing a mongodb connection string.
- Add a `JWT_SECRET` variable containing a secure JWT secret key.
- Optionally add a `PORT` variable to set the servers port. The frontend defaults to `localhost:5000` to interact with the backend.
- Run `npm run dev` in both the client and server terminals to start the application.
- Open `localhost:3000` to view the application.

# API Documentation
The following documents all the API routes, their functionality along with any options they may feature
## Table of Contents

- [Authentication](#authentication)
  - [Login](#login)
  - [Signup](#signup)
- [User](#user)
  - [Get Current User](#get-current-user)
- [Notes](#notes)
  - [Get All Notes](#get-all-notes)
  - [Get Note by ID](#get-note-by-id)
  - [Create Note](#create-note)
  - [Update Note](#update-note)
  - [Delete Note](#delete-note)
  - [Move Note](#move-note)
- [Groups](#groups)
  - [Get All Groups](#get-all-groups)
  - [Get Group by ID](#get-group-by-id)
  - [Create Group](#create-group)
  - [Update Group](#update-group)
  - [Delete Group](#delete-group)
  - [Move Group](#move-group)
- [Error Responses](#error-responses)
- [Authentication](#authentication-1)

---

## Authentication

### Login
```http
POST /api/auth/login
```

Login with email and password to receive a JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Logged in!",
  "token": "jwt_token_here",
  "user": {
    "_id": "user_id",
    "name": "User Name",
    "email": "user@example.com"
  }
}
```

**Status Codes:**
- `200` - Success
- `400` - Missing email or password
- `401` - Invalid credentials

---

### Signup
```http
POST /api/auth/signup
```

Create a new user account and receive a JWT token.

**Request Body:**
```json
{
  "name": "User Name",
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Signed up!",
  "token": "jwt_token_here",
  "user": {
    "_id": "user_id",
    "name": "User Name",
    "email": "user@example.com"
  }
}
```

**Status Codes:**
- `200` - Success
- `400` - Missing required fields

---

## User

### Get Current User
```http
GET /api/user
```

Get authenticated user's data. Requires authentication.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "message": "Authenticated!",
  "user": {
    "_id": "user_id",
    "name": "User Name",
    "email": "user@example.com"
  }
}
```

**Status Codes:**
- `200` - Success
- `401` - No user found/unauthorized

---

## Notes

### Get All Notes
```http
GET /api/note
```

Retrieve all notes with optional filtering.

**Query Parameters:**
- `preview` (boolean, optional) - Return preview version of notes
- `grouped` (boolean, optional) - Filter by grouped status
- `groupId` (string, optional) - Filter by specific group ID (must be valid ObjectId)

**Response:**
```json
{
  "notes": [
    {
      "_id": "note_id",
      "title": "Note Title",
      "content": "Note content",
      "uid": "user_id"
    }
  ]
}
```

**Status Codes:**
- `200` - Success
- `400` - Invalid query parameters
- `404` - Notes not found

---

### Get Note by ID
```http
GET /api/note/:id
```

Retrieve a specific note by its ID.

**Parameters:**
- `id` (string) - Note ID (must be valid ObjectId)

**Response:**
```json
{
  "note": {
    "_id": "note_id",
    "title": "Note Title",
    "content": "Note content",
    "uid": "user_id"
  }
}
```

**Status Codes:**
- `200` - Success
- `404` - Note not found

---

### Create Note
```http
POST /api/note
```

Create a new note. Requires authentication.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "title": "Note Title",
  "content": "Note content"
}
```

**Response:**
```json
{
  "message": "Note created!",
  "note": {
    "_id": "note_id",
    "title": "Note Title",
    "content": "Note content",
    "uid": "user_id"
  }
}
```

**Status Codes:**
- `200` - Success
- `400` - Invalid note data
- `401` - Unauthorized

---

### Update Note
```http
PATCH /api/note
```

Update an existing note. Requires authentication.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "_id": "note_id",
  "title": "Updated Title",
  "content": "Updated content"
}
```

**Response:**
```json
{
  "message": "Note updated!",
  "note": {
    "_id": "note_id",
    "title": "Updated Title",
    "content": "Updated content",
    "uid": "user_id"
  }
}
```

**Status Codes:**
- `200` - Success
- `400` - Invalid note data
- `404` - Note not found

---

### Delete Note
```http
DELETE /api/note/:id
```

Delete a note by its ID.

**Parameters:**
- `id` (string) - Note ID (must be valid ObjectId)

**Response:**
```json
{
  "message": "Note deleted!",
  "note": {
    "_id": "note_id",
    "title": "Deleted Note Title",
    "content": "Deleted note content"
  }
}
```

**Status Codes:**
- `200` - Success
- `404` - Note not found

---

### Move Note
```http
PATCH /api/note/move
```

Move a note before or after another note/group.

**Query Parameters:**
- `noteId` (string, required) - ID of note to move
- `targetId` (string, required) - ID of target note/group
- `position` (string, required) - Either "before" or "after"

**Response:**
```json
{
  "message": "Note moved!",
  "note": {
    "_id": "note_id",
    "title": "Note Title",
    "content": "Note content"
  }
}
```

**Status Codes:**
- `200` - Success
- `400` - Missing or invalid query parameters
- `404` - Note not found

---

## Groups

### Get All Groups
```http
GET /api/group
```

Retrieve all groups with optional filtering and population.

**Query Parameters:**
- `root` (boolean, optional) - Filter root groups only
- `withNotes` (boolean, optional) - Include associated notes
- `withChildren` (boolean, optional) - Include child groups

**Response:**
```json
{
  "groups": [
    {
      "_id": "group_id",
      "name": "Group Name",
      "uid": "user_id"
    }
  ]
}
```

**Status Codes:**
- `200` - Success
- `400` - Invalid query parameters

---

### Get Group by ID
```http
GET /api/group/:id
```

Retrieve a specific group by its ID.

**Parameters:**
- `id` (string) - Group ID (must be valid ObjectId)

**Query Parameters:**
- `withNotes` (boolean, optional) - Include associated notes
- `withChildren` (boolean, optional) - Include child groups

**Response:**
```json
{
  "group": {
    "_id": "group_id",
    "name": "Group Name",
    "uid": "user_id"
  }
}
```

**Status Codes:**
- `200` - Success
- `400` - Invalid query parameters
- `404` - Group not found

---

### Create Group
```http
POST /api/group
```

Create a new group. Requires authentication.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "name": "Group Name"
}
```

**Response:**
```json
{
  "message": "Group created!",
  "group": {
    "_id": "group_id",
    "name": "Group Name",
    "uid": "user_id"
  }
}
```

**Status Codes:**
- `200` - Success
- `400` - Invalid group data
- `401` - Unauthorized

---

### Update Group
```http
PATCH /api/group
```

Update an existing group. Requires authentication.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "_id": "group_id",
  "name": "Updated Group Name"
}
```

**Response:**
```json
{
  "message": "Group updated!",
  "group": {
    "_id": "group_id",
    "name": "Updated Group Name",
    "uid": "user_id"
  }
}
```

**Status Codes:**
- `200` - Success
- `400` - Invalid group data
- `404` - Group not found

---

### Delete Group
```http
DELETE /api/group/:id
```

Delete a group by its ID.

**Parameters:**
- `id` (string) - Group ID (must be valid ObjectId)

**Response:**
```json
{
  "message": "Group deleted!",
  "group": {
    "_id": "group_id",
    "name": "Deleted Group Name"
  }
}
```

**Status Codes:**
- `200` - Success
- `404` - Group not found

---

### Move Group
```http
PATCH /api/group/move
```

Move a group before or after another note/group.

**Query Parameters:**
- `groupId` (string, required) - ID of group to move
- `targetId` (string, required) - ID of target note/group
- `position` (string, required) - Either "before" or "after"

**Response:**
```json
{
  "message": "Group moved!",
  "group": {
    "_id": "group_id",
    "name": "Group Name"
  }
}
```

**Status Codes:**
- `200` - Success
- `400` - Missing or invalid query parameters
- `404` - Group not found

---

## Error Responses

All endpoints may return these common error responses:

**400 Bad Request:**
```json
{
  "error": "Error message describing what went wrong"
}
```

**401 Unauthorized:**
```json
{
  "error": "Authentication required or invalid credentials"
}
```

**404 Not Found:**
```json
{
  "error": "Resource not found"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Internal server error message"
}
```

---

## Authentication

Most endpoints require authentication via JWT token. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

Obtain tokens through the `/api/auth/login` or `/api/auth/signup` endpoints.
