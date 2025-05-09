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
import { noteValidator } from "../middlewares/noteValidator";

const NoteRouter: Router = Router()

NoteRouter.use(authHandler);
NoteRouter.use(noteValidator);

NoteRouter.get('/', GetAllNotesHandler)
NoteRouter.get('/:id', GetNoteHandler)
NoteRouter.post('/', CreateNoteHandler)
NoteRouter.delete('/:id', DeleteNoteHandler)
NoteRouter.put('/', UpdateNoteHandler)
NoteRouter.put('/move', MoveNoteHandler)

export { NoteRouter };
