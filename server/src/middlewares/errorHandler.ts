import { Request, Response, NextFunction } from 'express';

// Custom error to be used in route handlers
// Can be thrown in route handlers to trigger the error handler
export class AppError extends Error {
    status: number;
    constructor(message: string, status: number) {
        super(message)
        this.status = status;
    }
}

export function errorHandler(err: AppError, req: Request, res: Response, next: NextFunction) {
    // Log the error
    console.error(err);

    // Log status
    console.log(`Status: ${err.status || 500} ${err.message || 'Internal Server Error'} `);
    // Send status
    // Defaults to 500 Internal Server Error
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
    });
};
