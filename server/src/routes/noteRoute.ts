import { Router } from "express";
import { authHandler } from "../middlewares/authorization";
import {
    CreateNoteHandler,
    DeleteNoteHandler,
    GetAllNotesHandler,
    GetNoteHandler,
    MoveNoteHandler,
    UpdateNoteHandler
} from "../controllers/noteController";
import { noteParser } from "../middlewares/noteParser";

const NoteRouter: Router = Router()

// Apply user authentication to all note routes
NoteRouter.use(authHandler);
NoteRouter.use(noteParser);

// GET all notes (optionally filtered or grouped)
NoteRouter.get('/', GetAllNotesHandler)
// GET a specific note by ID
NoteRouter.get('/:id', GetNoteHandler)
// POST a new note
NoteRouter.post('/', CreateNoteHandler)
// DELETE a note by ID
NoteRouter.delete('/:id', DeleteNoteHandler)
// PATCH to update note details
NoteRouter.patch('/', UpdateNoteHandler)
// PATCH to move a note
NoteRouter.patch('/move', MoveNoteHandler)

// Export router for use in the main app
export { NoteRouter };
