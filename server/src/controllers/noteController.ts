import { Request, Response, NextFunction } from "express";
import { Note, INote } from "../models/noteModel";
import { Types } from "mongoose";
import { AppError } from "../middlewares/errorHandler";
import { AppendNote, DeleteNote, GetNote, GetUsersNotes, InsertNoteBetweenNotes, MoveNoteBetween, MoveNoteToLast, UpdateNote } from "./noteDataAccess";

// ----- API Route Handlers ------

export async function MoveNoteHandler(req: Request, res: Response, next: NextFunction) {
    if (req.body.beforeId && req.body.afterId) {
        const afterId: Types.ObjectId = new Types.ObjectId(req.body.afterId as string)
        const beforeId: Types.ObjectId = new Types.ObjectId(req.body.beforeId as string)

        const note: Note | null =
            await MoveNoteBetween(req.note.uid, req.note._id, beforeId, afterId);

        res.status(200).send({ message: "Note moved!", note: note });
        return
    }

    const note: Note | null = await MoveNoteToLast(req.note.uid, req.note._id);
    res.status(200).send({ message: "Note moved!", note: note });
}

export async function CreateNoteHandler(req: Request, res: Response, next: NextFunction) {
    try {
        if (req.body.beforeId && req.body.afterId) {
            const afterId: Types.ObjectId = new Types.ObjectId(req.body.afterId as string)
            const beforeId: Types.ObjectId = new Types.ObjectId(req.body.beforeId as string)

            const note: Note | null =
                await InsertNoteBetweenNotes(req.note, beforeId, afterId);

            res.status(200).send({ message: "Note created!", note: note });
        }

        const note: Note | null = await AppendNote(req.note);

        res.status(200).send({ message: "Note created!", note: note });
    } catch (error) {
        next(error)
    }
}

export async function GetAllNotesHandler(req: Request, res: Response, next: NextFunction) {
    try {
        //req.query.preview
        let notes: Note[] = await GetUsersNotes(req.user._id);
        res.status(200).send({ notes });
    } catch (error) {
        next(error)
    }
}

export async function GetNoteHandler(req: Request, res: Response, next: NextFunction) {
    try {
        const id: Types.ObjectId = new Types.ObjectId(req.params.id);
        if (!Types.ObjectId.isValid(id) || !req.params.id) {
            throw new AppError("Could not find note with provided id!", 404)
        }

        let note: Note | null = await GetNote(req.user._id, id);
        if (!note) {
            res.status(404).json({ message: "Note not found!" })
            return;
        }
        res.status(200).json({ note: note });
    } catch (error) {
        next(error)
    }
}

export async function UpdateNoteHandler(req: Request, res: Response, next: NextFunction) {
    try {
        const note: INote | null = await UpdateNote(req.note);
        if (note === null) {
            res.status(404).json({ message: "Note not found!" })
            return;
        }
        res.status(200).json({ message: "Note updated!", note: note });
    } catch (error) {
        next(error)
    }
}

export async function DeleteNoteHandler(req: Request, res: Response, next: NextFunction) {
    try {
        const id: Types.ObjectId = new Types.ObjectId(req.params.id);
        if (!Types.ObjectId.isValid(id) || !req.params.id) {
            throw new AppError("Could not find note with provided id!", 404)
        }

        const note: Note | null = await DeleteNote(req.user._id, id);
        if (!note) {
            res.status(404).json({ message: "Note not found!" })
            return;
        }
        res.status(200).json({ message: "Note deleted!", note: note });
    } catch (error) {
        next(error)
    }
}

