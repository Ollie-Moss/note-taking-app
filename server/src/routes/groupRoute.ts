import { Router } from "express";
import { authHandler } from "../middlewares/authorization";
import { groupParser } from "../middlewares/groupParser";
import {
    CreateGroupHandler,
    DeleteGroupHandler,
    GetAllGroupsHandler,
    GetGroupHandler,
    MoveGroupHandler,
    UpdateGroupHandler
} from "../controllers/groupController";

const GroupRouter: Router = Router()

// Apply authentication middleware to all group routes
GroupRouter.use(authHandler);
GroupRouter.use(groupParser);

// -- HTTP Methods --

// GET all groups (optionally filtered)
GroupRouter.get('/', GetAllGroupsHandler)
// GET a specific group by ID
GroupRouter.get('/:id', GetGroupHandler)
// POST a new group
GroupRouter.post('/', CreateGroupHandler)
// DELETE a group by ID
GroupRouter.delete('/:id', DeleteGroupHandler)
// PATCH to update a group's details
GroupRouter.patch('/', UpdateGroupHandler)
// PATCH to move a group
GroupRouter.patch('/move', MoveGroupHandler)

// Export router for use in app
export { GroupRouter };
