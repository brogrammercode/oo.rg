import { Router } from "express";
import AuthController from "../controllers/auth.controller.js";

class AuthRoutes {
    public router: Router;
    private authController: AuthController;

    constructor() {
        this.router = Router();
        this.authController = new AuthController();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post("/register", this.authController.register);
        this.router.post("/login", this.authController.login);
    }
}

const authRoutes = new AuthRoutes();
export default authRoutes.router;