import { Router } from "express";
import AttendanceController from "../controllers/attendance.controller.js";
import authenticate from "../middlewares/auth.middleware.js";

class AttendanceRoutes {
    public router: Router;
    private attendanceController: AttendanceController;
    constructor() {
        this.router = Router();
        this.attendanceController = new AttendanceController();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post("/:orgId/employee/:employeeId", authenticate, this.attendanceController.createAttendance);
        this.router.get("/:orgId", authenticate, this.attendanceController.getAllAttendance);
        this.router.get("/employee/:employeeId", authenticate, this.attendanceController.getAttendance);
        this.router.put("/:attendanceId", authenticate, this.attendanceController.updateAttendance);
        this.router.delete("/:attendanceId", authenticate, this.attendanceController.deleteAttendance);
    }
}

const attendanceRoutes = new AttendanceRoutes();
export default attendanceRoutes.router;