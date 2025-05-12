import { Request, Response, NextFunction } from "express";
import { AppError } from "./errorHandler";
import { Note, NoteModel } from "../models/noteModel";
import { Types } from "mongoose";
import { noteService } from "../services/services";

declare module "express-serve-static-core" {
    interface Request {
        note: Note;
    }
}

export async function noteValidator(req: Request, res: Response, next: NextFunction) {
    // Requires note
    noteService.setUser(req.user._id.toString())
    if (req.method == "POST" || req.method == "PUT") {
        if (!req.body?.note) return next(new AppError("Note is required!", 400));


        if (!Types.ObjectId.isValid(req.body.note._id)) req.body.note._id = new Types.ObjectId()
        const note = new NoteModel({ ...req.body.note, uid: req.user._id });

        await note.validate().catch((err: Error) => {
            return next(new AppError(err.message, 400))
        })

        req.note = req.body.note;
    }
    next()
}
