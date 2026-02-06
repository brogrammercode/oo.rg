import asyncHandler from "../middlewares/async-handler.js";
import User from "../models/user.model.js";
import { Request, Response } from "express";
import { BadRequestError, ConflictError, NotFoundError, UnauthorizedError } from "../utils/error.js";
import hashService from "../infra/security/hash.js";
import jwtService from "../infra/security/jwt.js";
import { sendSuccess } from "../utils/response.js";
import { HttpStatus } from "../constants/http-status.js";
import { Messages } from "../constants/messages.js";

class AuthController {
    register = asyncHandler(async (req: Request, res: Response) => {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            throw new BadRequestError(Messages.INVALID_CREDENTIALS);
        }
        const userExists = await User.findOne({ email });
        if (userExists) {
            throw new ConflictError(Messages.ALREADY_EXISTS);
        }
        const hashPassword = await hashService.hash(password);
        const user = await User.create({ name, email, password: hashPassword });
        const token = jwtService.generateAccessToken({
            userId: user._id.toString(),
            email: user.email,
        });
        sendSuccess(res, { user, token }, "User created successfully", HttpStatus.CREATED);
    })

    login = asyncHandler(async (req: Request, res: Response) => {
        const { email, password } = req.body;
        if (!email || !password) {
            throw new BadRequestError(Messages.INVALID_CREDENTIALS);
        }
        const user = await User.findOne({ email });
        if (!user) {
            throw new NotFoundError(Messages.NOT_FOUND);
        }
        const isPasswordValid = await hashService.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedError(Messages.INVALID_CREDENTIALS);
        }
        const token = jwtService.generateAccessToken({
            userId: user._id.toString(),
            email: user.email,
        });
        sendSuccess(res, { user, token }, "User logged in successfully", HttpStatus.OK);
    })
}

export default AuthController;