import { HttpStatus, HttpStatusCode } from "../constants/http-status.js";

export class AppError extends Error {
    constructor(
        public statusCode: HttpStatusCode,
        public message: string,
        public isOperational: boolean = true
    ) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        Error.captureStackTrace(this);
    }
}

export class NotFoundError extends AppError {
    constructor(message: string = 'Resource not found') {
        super(HttpStatus.NOT_FOUND, message);
    }
}

export class BadRequestError extends AppError {
    constructor(message: string = 'Bad request') {
        super(HttpStatus.BAD_REQUEST, message);
    }
}

export class ValidationError extends AppError {
    constructor(message: string = 'Validation failed') {
        super(HttpStatus.UNPROCESSABLE_ENTITY, message);
    }
}

export class UnauthorizedError extends AppError {
    constructor(message: string = 'Unauthorized access') {
        super(HttpStatus.UNAUTHORIZED, message);
    }
}

export class ForbiddenError extends AppError {
    constructor(message: string = 'Access forbidden') {
        super(HttpStatus.FORBIDDEN, message);
    }
}

export class ConflictError extends AppError {
    constructor(message: string = 'Resource already exists') {
        super(HttpStatus.CONFLICT, message);
    }
}

export class InternalError extends AppError {
    constructor(message: string = 'Internal server error') {
        super(HttpStatus.INTERNAL_SERVER_ERROR, message, false);
    }
}
