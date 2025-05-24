import { GroupModel } from "../models/groupModel";
import { NoteModel } from "../models/noteModel";
import { GroupService } from "./groupService";
import { NoteService } from "./noteService";

// Create and export services
export const noteService = new NoteService(NoteModel)
export const groupService = new GroupService(GroupModel);
