import { Request, Response, NextFunction } from "express";
import { AppError } from "./errorHandler";
import { INote, Note, NoteModel } from "../models/noteModel";
import { Document, Types } from "mongoose";
import { noteService } from "../services/services";

declare module "express-serve-static-core" {
    interface Request {
        note: Note;
    }
}

export async function noteValidator(req: Request, res: Response, next: NextFunction) {
    // Requires note
    noteService.setUser(req.user._id.toString())
    if (req.method == "POST" || req.method == "PATCH") {
        if (!req.body?.note) return next(new AppError("Note is required!", 400));

        if (!Types.ObjectId.isValid(req.body.note._id)) req.body.note._id = new Types.ObjectId()
        const updates = { ...req.body.note, uid: req.user._id };

        const note = await NoteModel.findById(updates._id);
        note?.set(updates)
        note?.validate(Object.keys(updates)).catch((err: Error) => {
            return next(new AppError(err.message, 400))
        })
        // discards changes
        const freshNote = await NoteModel.findById(updates._id);

        req.note = req.body.note;
    }
    next()
}
