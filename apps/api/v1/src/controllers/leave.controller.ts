import { Request, Response } from "express";
import asyncHandler from "../middlewares/async-handler.js";
import { HttpStatus } from "../constants/http-status.js";
import { sendSuccess } from "../utils/response.js";
import { Leave, LeaveType } from "../models/leave.model.js";

class LeaveController {

    createLeaveType = asyncHandler(async (req: Request, res: Response) => {
        const { orgId } = req.params;
        const { name, description, color, maxPerMonth, maxPerYear, isPaid } = req.body;
        const leaveType = await LeaveType.create({ org: orgId, name, description, color, maxPerMonth, maxPerYear, isPaid });
        sendSuccess(res, { leaveType }, "Leave type created successfully", HttpStatus.CREATED);
    });

    getAllLeaveTypes = asyncHandler(async (req: Request, res: Response) => {
        const { orgId } = req.params;
        const leaveTypes = await LeaveType.find({ org: orgId }).populate({ path: "org", select: "name" });
        sendSuccess(res, { leaveTypes }, "Leave type retrieved successfully", HttpStatus.OK);
    });

    getLeaveType = asyncHandler(async (req: Request, res: Response) => {
        const { leaveTypeId } = req.params;
        const leaveType = await LeaveType.findById(leaveTypeId).populate({ path: "org", select: "name" });
        sendSuccess(res, { leaveType }, "Leave type retrieved successfully", HttpStatus.OK);
    });

    updateLeaveType = asyncHandler(async (req: Request, res: Response) => {
        const { leaveTypeId } = req.params;
        const { name, description, color, maxPerMonth, maxPerYear, isPaid } = req.body;
        const leaveType = await LeaveType.findByIdAndUpdate(leaveTypeId, { name, description, color, maxPerMonth, maxPerYear, isPaid }, { new: true });
        sendSuccess(res, { leaveType }, "Leave type updated successfully", HttpStatus.OK);
    });

    deleteLeaveType = asyncHandler(async (req: Request, res: Response) => {
        const { leaveTypeId } = req.params;
        const leaveType = await LeaveType.findByIdAndDelete(leaveTypeId);
        sendSuccess(res, { leaveType }, "Leave type deleted successfully", HttpStatus.OK);
    });

    /// leave

    createLeave = asyncHandler(async (req: Request, res: Response) => {
        const { orgId } = req.params;
        const { employee, type, startDate, endDate, reason, status } = req.body;
        const leave = await Leave.create({ org: orgId, employee, type, startDate, endDate, reason, status });
        sendSuccess(res, { leave }, "Leave created successfully", HttpStatus.CREATED);
    });

    getAllLeaves = asyncHandler(async (req: Request, res: Response) => {
        const { orgId } = req.params;
        const leave = await Leave.find({ org: orgId })
            .populate({
                path: "type",
                select: "name description isPaid"
            })
            .populate({
                path: "employee",
                populate: [
                    { path: "org", select: "name" },
                    { path: "user", select: "name email" },
                    { path: "roles", select: "name permissions" },
                    {
                        path: "post",
                        select: "name department logo",
                        populate: {
                            path: "department",
                            select: "name description color"
                        }
                    }
                ]
            });
        sendSuccess(res, { leave }, "Leave retrieved successfully", HttpStatus.OK);
    });

    getMyLeave = asyncHandler(async (req: Request, res: Response) => {
        const { employeeId } = req.params;
        const leave = await Leave.find({ employee: employeeId })
            .populate({
                path: "type",
                select: "name description isPaid"
            })
            .populate({
                path: "employee",
                populate: [
                    { path: "org", select: "name" },
                    { path: "user", select: "name email" },
                    { path: "roles", select: "name permissions" },
                    {
                        path: "post",
                        select: "name department logo",
                        populate: {
                            path: "department",
                            select: "name description color"
                        }
                    }
                ]
            });
        sendSuccess(res, { leave }, "Leave retrieved successfully", HttpStatus.OK);
    });

    getLeave = asyncHandler(async (req: Request, res: Response) => {
        const { leaveId } = req.params;
        const leave = await Leave.findById(leaveId)
            .populate({
                path: "type",
                select: "name description isPaid"
            })
            .populate({
                path: "employee",
                populate: [
                    { path: "org", select: "name" },
                    { path: "user", select: "name email" },
                    { path: "roles", select: "name permissions" },
                    {
                        path: "post",
                        select: "name department logo",
                        populate: {
                            path: "department",
                            select: "name description color"
                        }
                    }
                ]
            });
        sendSuccess(res, { leave }, "Leave retrieved successfully", HttpStatus.OK);
    });

    updateLeave = asyncHandler(async (req: Request, res: Response) => {
        const { leaveId } = req.params;
        const { type, startDate, endDate, reason, status } = req.body;
        const leave = await Leave.findByIdAndUpdate(leaveId, { type, startDate, endDate, reason, status }, { new: true });
        sendSuccess(res, { leave }, "Leave updated successfully", HttpStatus.OK);
    });

    deleteLeave = asyncHandler(async (req: Request, res: Response) => {
        const { leaveId } = req.params;
        const leave = await Leave.findByIdAndDelete(leaveId);
        sendSuccess(res, { leave }, "Leave deleted successfully", HttpStatus.OK);
    });

}

export default LeaveController;
