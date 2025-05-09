import { Request, Response, NextFunction } from "express";
import { AppError } from "./errorHandler";
import { Note, NoteModel } from "../models/noteModel";
import { Types } from "mongoose";

declare module "express-serve-static-core" {
    interface Request {
        note: Note;
    }
}

export async function noteValidator(req: Request, res: Response, next: NextFunction) {
    // Requires note id
    if (req.method == "GET" || req.method == "DELETE") {
        const id: Types.ObjectId = new Types.ObjectId(req.params.id);

        if (!Types.ObjectId.isValid(id)) {
            return next(new AppError("Could not find note with provided id!", 404))
        }

        req.id = id;
        next();
    }

    // Requires note
    if (req.method == "POST" || req.method == "PUT") {
        if (!req.body?.note) return next(new AppError("Note is required!", 400));

        const note = new NoteModel({ ...req.body.note, uid: req.user._id });

        await note.validate().catch((err: Error) => {
            return next(new AppError(err.message, 400))
        })

        req.note = req.body.note;
        next()
    }
}
