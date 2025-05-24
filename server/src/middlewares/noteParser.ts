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

export async function noteParser(req: Request, res: Response, next: NextFunction) {
    req.note = req.body?.note;
    next()
}
