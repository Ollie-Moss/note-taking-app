import { Router } from "express";
import { authHandler } from "../middlewares/authorization";
import { groupValidator } from "../middlewares/groupValidator";
import {
    CreateGroupHandler,
    DeleteGroupHandler,
    GetAllGroupsHandler,
    GetGroupHandler,
    MoveGroupHandler,
    UpdateGroupHandler
} from "../controllers/groupController";

const GroupRouter: Router = Router()

GroupRouter.use(authHandler);
GroupRouter.use(groupValidator);

GroupRouter.get('/', GetAllGroupsHandler)
GroupRouter.get('/:id', GetGroupHandler)
GroupRouter.post('/', CreateGroupHandler)
GroupRouter.delete('/:id', DeleteGroupHandler)
GroupRouter.put('/', UpdateGroupHandler)
GroupRouter.put('/move', MoveGroupHandler)

export { GroupRouter };
