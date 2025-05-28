import { GroupModel } from "../models/groupModel";
import { NoteModel } from "../models/noteModel";
import { UserModel } from "../models/userModel";
import { UserService } from "./userService";
import { GroupService } from "./groupService";
import { NoteService } from "./noteService";

// Create and export services
export const noteService = new NoteService(NoteModel)
export const groupService = new GroupService(GroupModel);
export const userService = new UserService(UserModel);
