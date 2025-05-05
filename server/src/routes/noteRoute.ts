import { Router } from "express";
import { authHandler } from "../middlewares/authorization";
import {
    CreateNoteHandler,
    DeleteNoteHandler,
    GetAllNotesHandler,
    GetNoteHandler,
    UpdateNoteHandler
} from "../controllers/noteController";
import { noteValidator } from "../middlewares/noteValidator";

const NoteRouter: Router = Router()

NoteRouter.use(authHandler);
NoteRouter.use(noteValidator)

NoteRouter.get('/api/note', GetAllNotesHandler)
NoteRouter.get('/api/note/:id', GetNoteHandler)
NoteRouter.post('/api/note', CreateNoteHandler)
NoteRouter.delete('/api/note/:id', DeleteNoteHandler)
NoteRouter.put('/api/note', UpdateNoteHandler)

export { NoteRouter };
