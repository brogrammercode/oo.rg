import { Router } from "express";
import AttendanceController from "../controllers/attendance.controller.js";

class AttendanceRoutes {
    public router: Router;
    private attendanceController: AttendanceController;

    constructor() {
        this.router = Router();
        this.attendanceController = new AttendanceController();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get("/org/:orgId", this.attendanceController.getAllAttendance);
        this.router.get("/employee/:employeeId", this.attendanceController.getMyAttendance);
        this.router.get("/:attendanceId", this.attendanceController.getAttendance);
        this.router.post("/:orgId", this.attendanceController.createAttendance);
        this.router.put("/:attendanceId", this.attendanceController.updateAttendance);
        this.router.delete("/:attendanceId", this.attendanceController.deleteAttendance);

        this.router.get("/:orgId/shift-type", this.attendanceController.getAllShiftTypes);
        this.router.get("/:orgId/shift-type/:shiftTypeId", this.attendanceController.getShiftType);
        this.router.post("/:orgId/shift-type", this.attendanceController.createShiftType);
        this.router.put("/:orgId/shift-type/:shiftTypeId", this.attendanceController.updateShiftType);
        this.router.delete("/:orgId/shift-type/:shiftTypeId", this.attendanceController.deleteShiftType);

        this.router.get("/:orgId/break-type", this.attendanceController.getAllBreakTypes);
        this.router.get("/:orgId/break-type/:breakTypeId", this.attendanceController.getBreakType);
        this.router.post("/:orgId/break-type", this.attendanceController.createBreakType);
        this.router.put("/:orgId/break-type/:breakTypeId", this.attendanceController.updateBreakType);
        this.router.delete("/:orgId/break-type/:breakTypeId", this.attendanceController.deleteBreakType);

        this.router.get("/:attendanceId/break", this.attendanceController.getAllBreaks);
        this.router.get("/:attendanceId/break/:breakId", this.attendanceController.getBreak);
        this.router.post("/:orgId/:employeeId/:attendanceId/break", this.attendanceController.createBreak);
        this.router.put("/:attendanceId/break/:breakId", this.attendanceController.updateBreak);
        this.router.delete("/:attendanceId/break/:breakId", this.attendanceController.deleteBreak);
    }
}

const attendanceRoutes = new AttendanceRoutes();
export default attendanceRoutes.router;