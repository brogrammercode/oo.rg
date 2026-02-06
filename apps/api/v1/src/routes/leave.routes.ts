import { Router } from "express";
import LeaveController from "../controllers/leave.controller.js";

class LeaveRoutes {
    public router: Router;
    private leaveController: LeaveController;

    constructor() {
        this.router = Router();
        this.leaveController = new LeaveController();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get("/org/:orgId", this.leaveController.getAllLeaves);
        this.router.get("/employee/:employeeId", this.leaveController.getMyLeave);
        this.router.get("/:leaveId", this.leaveController.getLeave);
        this.router.post("/:orgId", this.leaveController.createLeave);
        this.router.put("/:leaveId", this.leaveController.updateLeave);
        this.router.delete("/:leaveId", this.leaveController.deleteLeave);

        this.router.get("/:orgId/leave-type", this.leaveController.getAllLeaveTypes);
        this.router.get("/:orgId/leave-type/:leaveTypeId", this.leaveController.getLeaveType);
        this.router.post("/:orgId/leave-type", this.leaveController.createLeaveType);
        this.router.put("/:orgId/leave-type/:leaveTypeId", this.leaveController.updateLeaveType);
        this.router.delete("/:orgId/leave-type/:leaveTypeId", this.leaveController.deleteLeaveType);
    }
}

const leaveRoutes = new LeaveRoutes();
export default leaveRoutes.router;