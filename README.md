# Quickstart
- Open the client and server directories in the terminal
- Run `npm install` to install required dependencies
- In the server directory create a `.env` file
- Add a `ATLAS_URI` variable containing a mongodb connection string
- Run `npm run dev` in both the client and server terminals to start the application
- Open `localhost:3000` to view the application

# API
The following documents all the API routes, their functionality along with any options they may feature
## Table of Contents

- [Groups](#groups)
  - [GET '/api/group'](#get-apigroup)
  - [GET '/api/group/:id'](#get-apigroupid)
  - [POST '/api/group'](#post-apigroup)
  - [PATCH '/api/group'](#patch-apigroup)
  - [PUT '/api/group/move'](#put-apigroupmove)
  - [DELETE '/api/group'](#delete-apigroup)

- [Notes](#notes)
  - [GET '/api/note'](#get-apinote)
  - [GET '/api/note/:id'](#get-apinoteid)
  - [POST '/api/note'](#post-apinote)
  - [PATCH '/api/note'](#patch-apinote)
  - [PUT '/api/note/move'](#put-apinotemove)
  - [DELETE '/api/note/:id'](#delete-apinoteid)

## Groups
### GET ‘/api/group’

Gets all a user's groups

**Queries:**

- ‘root’ - returns a list of groups with no parent
- ‘withNotes’ - returns any contained note’s ids attached to the ‘notes’ field
- ‘withChildren’ - returns any nested group’s ids attached to the ‘children’ field

### GET ‘/api/group/:id’

Gets user’s group with the corresponding id

**Queries:**

- ‘withNotes’ - returns any contained note’s ids attached to the ‘notes’ field
- ‘withChildren’ - returns any nested group’s ids attached to the ‘children’ field

### POST ‘/api/group’

Create a new group

### PATCH ‘/api/group’

Updates any present fields in the request (requires _id to be present)

### PUT ‘/api/group/move’

Moves a group to a specified position. The position is detirmined using the beforeId parameter. If not provided it is moved to the first position, if provided it is moved to the position after the note with the corresponding id.

**Body parameters:**

- ‘beforeId’ - The id of group to be before

### DELETE ‘/api/group’

Delete a group, contained notes will also be deleted

---

## Notes

### GET ‘/api/note’

Gets all a user’s notes

**Queries:**

- ‘preview’ - returned notes are previews
- ‘grouped’ - returns all notes that are not contained in a group

### GET ‘/api/note/:id’

Gets a user’s note with the corresponding id

### POST ‘/api/note’

Creates a new note

### PATCH ‘/api/note’

Updates any present fields in the request

### PUT ‘/api/note/move’

Moves a note to a specified position. The position is calculated between two notes if queries are provided otherwise it is moved to the end.

**Queries:**

- ‘beforeId’ - The id of note to be before

### DELETE ‘/api/note/:id’

Deletes a note
