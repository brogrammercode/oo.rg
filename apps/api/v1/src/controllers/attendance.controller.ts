import { Request, Response } from "express";
import { Attendance } from "../models/attendance.model.js";
import asyncHandler from "../middlewares/async-handler.js";
import { sendSuccess } from "../utils/response.js";
import { HttpStatus } from "../constants/http-status.js";

class AttendanceController {
    createAttendance = asyncHandler(async (req: Request, res: Response) => {
        const { orgId, employeeId } = req.params;
        const { date, status, checkIn, checkOut } = req.body;
        let duration = 0;
        if (checkOut) {
            const start = new Date(checkIn).getTime();
            const end = new Date(checkOut).getTime();
            duration = Math.max(0, Math.floor((end - start) / 1000));
        }
        const attendance = await Attendance.create({ org: orgId, employee: employeeId, date, status, checkIn, checkOut, duration });
        sendSuccess(res, { attendance }, "Attendance created successfully", HttpStatus.CREATED);
    });

    getAllAttendance = asyncHandler(async (req: Request, res: Response) => {
        const { orgId } = req.params;
        const attendance = await Attendance.find({ org: orgId })
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
        sendSuccess(res, { attendance }, "Attendance retrieved successfully", HttpStatus.OK);
    });

    getAttendance = asyncHandler(async (req: Request, res: Response) => {
        const { employeeId } = req.params;
        const attendance = await Attendance.find({ employee: employeeId })
            .sort({ date: -1 })
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
        sendSuccess(res, { attendance }, "Attendance retrieved successfully", HttpStatus.OK);
    });

    updateAttendance = asyncHandler(async (req: Request, res: Response) => {
        const { attendanceId } = req.params;
        const { date, status, checkIn, checkOut } = req.body;

        let duration = 0;
        if (checkOut) {
            const start = new Date(checkIn).getTime();
            const end = new Date(checkOut).getTime();
            duration = Math.max(0, Math.floor((end - start) / 1000));
        }
        const attendance = await Attendance.findByIdAndUpdate(
            attendanceId,
            { date, status, checkIn, checkOut, duration },
            { new: true }
        );

        sendSuccess(res, { attendance }, "Attendance updated successfully", HttpStatus.OK);
    });

    deleteAttendance = asyncHandler(async (req: Request, res: Response) => {
        const { attendanceId } = req.params;
        const attendance = await Attendance.findByIdAndDelete(attendanceId);
        sendSuccess(res, { attendance }, "Attendance deleted successfully", HttpStatus.OK);
    });

}

export default AttendanceController;