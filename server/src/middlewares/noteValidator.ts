import { Request, Response, NextFunction } from 'express';
import { INote } from '../models/noteModel';
import { Types } from 'mongoose';
import { AppError } from './errorHandler';

// Validates Notes ensuring they fit the INote interface
export async function noteValidator(req: Request, res: Response, next: NextFunction) {
    try {
        if (!req.body?.note) return next();

        const note: INote = req.body.note as INote;

        if (!Types.ObjectId.isValid(note.uid)) {
            throw new AppError("Invalid uid provided!", 404);
        }

        const validNote: INote = {
            title: note.title,
            contents: note.contents,
            uid: note.uid
        }
        req.body.note = validNote;
        next();
    } catch (error) {
        next(error)
    }
};
