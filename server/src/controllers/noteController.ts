import { Request, Response, NextFunction } from "express";
import { AppError } from "../middlewares/errorHandler";
import { noteService } from "../services/services";
import { Types } from "mongoose";

// ----- API Route Handlers ------

// Move a note before or after another note or note
export async function MoveNoteHandler(req: Request, res: Response, next: NextFunction) {
    try {
        console.log("PATCH 'api/note/move'")

        // Validate and log query params
        if (!req.query.noteId) throw new AppError("noteId query paramter is required!", 400)
        console.log(`param noteId: ${req.query.noteId}`)
        if (!req.query.targetId) throw new AppError("targetId query parameter is required!", 400)
        console.log(`param targetId: ${req.query.targetId}`)
        if (!req.query.position) throw new AppError("position query parameter is required!", 400)
        console.log(`param position: ${req.query.position}`)
        if (!(req.query.position == 'before' || req.query.position == 'after')) throw new AppError("position query must be either 'before' or 'after'!", 400)

        console.log("Attempting Move")
        // Attempt Move
        const note = await noteService.move(req.query.noteId.toString(), req.query.targetId.toString(), req.query.position)

        if (!note) throw new AppError("Note not found!", 404);

        console.log("Note moved!")
        console.log("Status: 200 OK");
        res.status(200).send({ message: "Note moved!", note: note });
    } catch (error) {
        console.log("Something went wrong while moving!")
        next(error)
    }

}

// Create a new note
export async function CreateNoteHandler(req: Request, res: Response, next: NextFunction) {
    try {
        console.log("POST 'api/note'")
        if (!req.note) throw new AppError("Note is required!", 400);
        console.log("note: ", req.note)

        // validate the note
        const result = noteService.validate(req.note);
        if (!result.passed) throw new AppError(result.message || "Invalid note provided!", 400);

        console.log("Creating note...")
        const note = await noteService.create(req.note)
        console.log("Note created!")
        console.log("Status: 200 OK");
        res.status(200).send({ message: "Note created!", note: note });
    } catch (error) {
        next(error)
    }
}

// Get all notes with optionally filter by root and preview flag
export async function GetAllNotesHandler(req: Request, res: Response, next: NextFunction) {
    try {
        console.log(`GET 'api/note'`)

        if (req.query.preview !== undefined
            && typeof req.query.preview === "boolean") throw new AppError("preview query parameter must be type boolean!", 400)
        console.log(`param preview: ${req.query.preview || "Not provided"}`)
        if (req.query.grouped !== undefined
            && typeof req.query.grouped === "boolean") throw new AppError("withChildren query parameter must be type boolean!", 400)
        console.log(`param grouped: ${req.query.grouped || "not provided"}`)
        if (req.query.groupId !== undefined
            && !Types.ObjectId.isValid(req.params.groupId)) throw new AppError("groupId query parameter must be a valid id!", 400)
        console.log(`param grouped: ${req.query.groupId || "not provided"}`)

        console.log("Retrieving notes...")
        let notes = await noteService.findNotes({
            parentId: req.params.grouped ? null : req.params.groupId ?? undefined,
            preview: req.query.preview ? true : false,
        });

        if (!notes) throw new AppError("Notes not found!", 404)
        console.log("Notes found: ", notes);
        console.log("Status: 200 OK");
        res.status(200).json({ notes: notes });
    } catch (error) {
        next(error)
    }
}

// Get a single note by ID
export async function GetNoteHandler(req: Request, res: Response, next: NextFunction) {
    try {
        console.log(`GET 'api/note/${req.params.id}'`)

        if (!Types.ObjectId.isValid(req.params.id)) throw new AppError("Note not found!", 404)

        console.log("Retrieving note...")
        const note = await noteService.findById(req.params.id)
        if (!note) throw new AppError("Note not found!", 404)

        console.log("Note found: ", note);
        console.log("Status: 200 OK");
        res.status(200).json({ note: note });
    } catch (error) {
        next(error)
    }
}

// Update an existing note
export async function UpdateNoteHandler(req: Request, res: Response, next: NextFunction) {
    try {
        console.log(`PATCH 'api/note'`)
        if (!req.note) throw new AppError("Note is required!", 400);
        console.log("note: ", req.note)

        // validate the note
        const result = noteService.validate(req.note);
        if (!result.passed) throw new AppError(result.message || "Invalid note provided!", 400);

        console.log("Updating note...")
        const note = await noteService.update(req.note._id.toString(), req.note)

        if (!note) throw new AppError("Note not found!", 404)

        console.log("Note updated!: ", note);
        console.log("Status: 200 OK");
        res.status(200).json({ message: "Note updated!", note: note });
    } catch (error) {
        next(error)
    }
}

// Delete a note by ID
export async function DeleteNoteHandler(req: Request, res: Response, next: NextFunction) {
    try {
        console.log(`DELETE 'api/note/${req.params.id}'`)
        if (!Types.ObjectId.isValid(req.params.id)) throw new AppError("Note not found!", 404);

        console.log("Deleting note...")
        const note = await noteService.delete(req.params.id)

        console.log("Note deleted!: ", note);
        console.log("Status: 200 OK");
        res.status(200).json({ message: "Note deleted!", note: note });
    } catch (error) {
        next(error)
    }
}
