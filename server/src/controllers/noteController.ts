import { Request, Response, NextFunction } from "express";
import { AppError } from "../middlewares/errorHandler";
import { noteService } from "../services/services";

// ----- API Route Handlers ------

export async function MoveNoteHandler(req: Request, res: Response, next: NextFunction) {
    try {
        const note = await noteService.move(req.note._id.toString(), req.body.beforeId)
        res.status(200).send({ message: "Note moved!", note: note });
        if (!note) {
            res.status(404).json({ message: "Note not found!" })
            return;
        }
    } catch (error) {
        next(error)
    }
}

export async function CreateNoteHandler(req: Request, res: Response, next: NextFunction) {
    try {
        const note = await noteService.create(req.note)
        res.status(200).send({ message: "Note created!", note: note });
    } catch (error) {
        next(error)
    }
}

export async function GetAllNotesHandler(req: Request, res: Response, next: NextFunction) {
    try {
        let notes = await noteService.findNotes({
            parentId: req.params.grouped ? null : req.params.groupId ?? undefined,
            preview: req.query.preview ? true : false,
        });
        res.status(200).send({
            notes: notes,
        });
    } catch (error) {
        next(error)
    }
}

export async function GetNoteHandler(req: Request, res: Response, next: NextFunction) {
    try {
        if (!req.params.id) {
            throw new AppError("Id is required!", 404)
        }
        const note = await noteService.findById(req.params.id)
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
        const note = await noteService.update(req.note._id.toString(), req.note)
        if (!note) {
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
        if (!req.params.id) {
            throw new AppError("Id is required!", 404)
        }
        const note = await noteService.delete(req.params.id)
        if (!note) {
            res.status(404).json({ message: "Note not found!" })
            return;
        }
        res.status(200).json({ message: "Note deleted!", note: note });
    } catch (error) {
        next(error)
    }
}
