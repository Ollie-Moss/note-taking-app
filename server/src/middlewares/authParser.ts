import { Request, Response, NextFunction } from "express";

declare module "express-serve-static-core" {
    interface Request {
        email?: string,
        password?: string
        name?: string
    }
}

export async function authParser(req: Request, res: Response, next: NextFunction) {
    req.email = req.body?.email;
    req.password = req.body?.password;
    req.name = req.body?.name;
    next()
}
