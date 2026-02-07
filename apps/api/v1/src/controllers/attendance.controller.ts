import { Request, Response } from "express";
import asyncHandler from "../middlewares/async-handler.js";
import { HttpStatus } from "../constants/http-status.js";
import { sendSuccess } from "../utils/response.js";
import { Attendance, Break, BreakType, ShiftType } from "../models/attendance.model.js";

class AttendanceController {

    /// utils
    private readonly employeePopulate = {
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
    };

    private readonly shiftTypePopulate = {
        path: "shiftType",
        select: "name description start end lateGrace lateFinePerMin overtimePricePerMin"
    };

    private readonly breaksPopulate = {
        path: "breaks",
        select: "type start end duration status",
        populate: {
            path: "type",
            select: "name description duration"
        }
    };

    private readonly breakTypePopulate = {
        path: "type",
        select: "name description duration"
    };

    private calculateDuration(start: Date, end: Date): number {
        const startTime = new Date(start).getTime();
        const endTime = new Date(end).getTime();
        return Math.max(0, Math.floor((endTime - startTime) / 1000));
    }

    private async calculateFees(shiftTypeId: string, checkIn?: Date, checkOut?: Date) {
        let lateFee = 0;
        let overtimeFee = 0;
        let lateFinePerMin = 0;
        let lateGrace = 0;
        let overtimePricePerMin = 0;

        if (shiftTypeId) {
            const shift = await ShiftType.findById(shiftTypeId);
            if (shift) {
                lateFinePerMin = shift.lateFinePerMin;
                lateGrace = shift.lateGrace;
                overtimePricePerMin = shift.overtimePricePerMin;

                if (checkIn) {
                    const late = Math.max(0, new Date(checkIn).getTime() - shift.start.getTime() - lateGrace);
                    if (late > 0) {
                        lateFee = Math.floor((late / 60000) * lateFinePerMin);
                    }
                }

                if (checkOut) {
                    const overtime = Math.max(0, new Date(checkOut).getTime() - shift.end.getTime());
                    if (overtime > 0) {
                        overtimeFee = Math.floor((overtime / 60000) * overtimePricePerMin);
                    }
                }
            }
        }

        return { lateFee, overtimeFee, lateFinePerMin, lateGrace, overtimePricePerMin };
    }

    /// SHIFT TYPE
    createShiftType = asyncHandler(async (req: Request, res: Response) => {
        const { orgId } = req.params;
        const { name, description, start, end, lateGrace, lateFinePerMin, overtimePricePerMin } = req.body;
        const shiftType = await ShiftType.create({ org: orgId, name, description, start, end, lateGrace, lateFinePerMin, overtimePricePerMin });
        sendSuccess(res, { shiftType }, "Shift type created successfully", HttpStatus.CREATED);
    });

    getAllShiftTypes = asyncHandler(async (req: Request, res: Response) => {
        const { orgId } = req.params;
        const shiftTypes = await ShiftType.find({ org: orgId }).populate({ path: "org", select: "name" });
        sendSuccess(res, { shiftTypes }, "Shift type retrieved successfully", HttpStatus.OK);
    });

    getShiftType = asyncHandler(async (req: Request, res: Response) => {
        const { shiftTypeId } = req.params;
        const shiftType = await ShiftType.findById(shiftTypeId).populate({ path: "org", select: "name" });
        sendSuccess(res, { shiftType }, "Shift type retrieved successfully", HttpStatus.OK);
    });

    updateShiftType = asyncHandler(async (req: Request, res: Response) => {
        const { shiftTypeId } = req.params;
        const { name, description, start, end, lateGrace, lateFinePerMin, overtimePricePerMin } = req.body;
        const shiftType = await ShiftType.findByIdAndUpdate(shiftTypeId, { name, description, start, end, lateGrace, lateFinePerMin, overtimePricePerMin }, { new: true });
        sendSuccess(res, { shiftType }, "Shift type updated successfully", HttpStatus.OK);
    });

    deleteShiftType = asyncHandler(async (req: Request, res: Response) => {
        const { shiftTypeId } = req.params;
        const shiftType = await ShiftType.findByIdAndDelete(shiftTypeId);
        sendSuccess(res, { shiftType }, "Shift type deleted successfully", HttpStatus.OK);
    });

    /// BREAK TYPE
    createBreakType = asyncHandler(async (req: Request, res: Response) => {
        const { orgId } = req.params;
        const { name, description, duration } = req.body;
        const breakType = await BreakType.create({ org: orgId, name, description, duration });
        sendSuccess(res, { breakType }, "Break type created successfully", HttpStatus.CREATED);
    });

    getAllBreakTypes = asyncHandler(async (req: Request, res: Response) => {
        const { orgId } = req.params;
        const breakTypes = await BreakType.find({ org: orgId }).populate({ path: "org", select: "name" });
        sendSuccess(res, { breakTypes }, "Break type retrieved successfully", HttpStatus.OK);
    });

    getBreakType = asyncHandler(async (req: Request, res: Response) => {
        const { breakTypeId } = req.params;
        const breakType = await BreakType.findById(breakTypeId).populate({ path: "org", select: "name" });
        sendSuccess(res, { breakType }, "Break type retrieved successfully", HttpStatus.OK);
    });

    updateBreakType = asyncHandler(async (req: Request, res: Response) => {
        const { breakTypeId } = req.params;
        const { name, description, duration } = req.body;
        const breakType = await BreakType.findByIdAndUpdate(breakTypeId, { name, description, duration }, { new: true });
        sendSuccess(res, { breakType }, "Break type updated successfully", HttpStatus.OK);
    });

    deleteBreakType = asyncHandler(async (req: Request, res: Response) => {
        const { breakTypeId } = req.params;
        const breakType = await BreakType.findByIdAndDelete(breakTypeId);
        sendSuccess(res, { breakType }, "Break type deleted successfully", HttpStatus.OK);
    });

    /// BREAK
    createBreak = asyncHandler(async (req: Request, res: Response) => {
        const { orgId, employeeId, attendanceId } = req.params;
        const { type, start, end, status } = req.body;
        const duration = end ? this.calculateDuration(start, end) : 0;
        const breakRecord = await Break.create({ org: orgId, employee: employeeId, attendance: attendanceId, type, start, end, duration, status });
        const updateData: any = { $push: { breaks: breakRecord._id } };
        if (!end) {
            updateData.status = 'BREAK';
        }
        const attendance = await Attendance.findByIdAndUpdate(attendanceId, updateData, { new: true });
        sendSuccess(res, { break: breakRecord, attendance }, "Break created successfully", HttpStatus.CREATED);
    });

    getAllBreaks = asyncHandler(async (req: Request, res: Response) => {
        const { attendanceId } = req.params;
        const breaks = await Break.find({ attendance: attendanceId })
            .populate(this.breakTypePopulate)
            .populate(this.employeePopulate);
        sendSuccess(res, { breaks }, "Break retrieved successfully", HttpStatus.OK);
    });

    getBreak = asyncHandler(async (req: Request, res: Response) => {
        const { breakId } = req.params;
        const breakRecord = await Break.findById(breakId)
            .populate(this.breakTypePopulate)
            .populate(this.employeePopulate);
        sendSuccess(res, { break: breakRecord }, "Break retrieved successfully", HttpStatus.OK);
    });

    updateBreak = asyncHandler(async (req: Request, res: Response) => {
        const { breakId } = req.params;
        const { type, start, end, status } = req.body;

        const existingBreak = await Break.findById(breakId);
        if (!existingBreak) {
            return sendSuccess(res, {}, "Break not found", HttpStatus.NOT_FOUND);
        }

        const finalStart = start || existingBreak.start;
        const finalEnd = end || existingBreak.end;
        const duration = (finalStart && finalEnd) ? this.calculateDuration(finalStart, finalEnd) : 0;

        const updateData: any = {};
        if (type !== undefined) updateData.type = type;
        if (start !== undefined) updateData.start = start;
        if (end !== undefined) updateData.end = end;
        if (status !== undefined) updateData.status = status;
        updateData.duration = duration;

        const breakRecord = await Break.findByIdAndUpdate(breakId, updateData, { new: true }).populate(this.breakTypePopulate);

        if (end && !existingBreak.end) {
            const attendance = await Attendance.findById(existingBreak.attendance);
            if (attendance && attendance.status === 'BREAK') {
                const activeBreaks = await Break.find({
                    attendance: existingBreak.attendance,
                    _id: { $ne: breakId },
                    end: null
                });
                if (activeBreaks.length === 0) {
                    await Attendance.findByIdAndUpdate(existingBreak.attendance, { status: 'PRESENT' });
                }
            }
        }

        sendSuccess(res, { break: breakRecord }, "Break updated successfully", HttpStatus.OK);
    });

    deleteBreak = asyncHandler(async (req: Request, res: Response) => {
        const { breakId } = req.params;
        const breakRecord = await Break.findByIdAndDelete(breakId);
        sendSuccess(res, { break: breakRecord }, "Break deleted successfully", HttpStatus.OK);
    });

    /// ATTENDANCE
    createAttendance = asyncHandler(async (req: Request, res: Response) => {
        const { orgId } = req.params;
        const { employee, date, status, checkIn, checkOut, notes, breaks, shiftType } = req.body;
        const duration = checkOut ? this.calculateDuration(checkIn, checkOut) : 0;
        const fees = await this.calculateFees(shiftType, checkIn, checkOut);
        const attendance = await Attendance.create({ org: orgId, employee, date, status, checkIn, checkOut, duration, notes, breaks, shiftType, ...fees });
        sendSuccess(res, { attendance }, "Attendance created successfully", HttpStatus.CREATED);
    });

    getAllAttendance = asyncHandler(async (req: Request, res: Response) => {
        const { orgId } = req.params;
        const attendance = await Attendance.find({ org: orgId })
            .populate(this.shiftTypePopulate)
            .populate(this.breaksPopulate)
            .populate(this.employeePopulate);
        sendSuccess(res, { attendance }, "Attendance retrieved successfully", HttpStatus.OK);
    });

    getMyAttendance = asyncHandler(async (req: Request, res: Response) => {
        const { employeeId } = req.params;
        const attendance = await Attendance.find({ employee: employeeId })
            .populate(this.shiftTypePopulate)
            .populate(this.breaksPopulate)
            .populate(this.employeePopulate);
        sendSuccess(res, { attendance }, "Attendance retrieved successfully", HttpStatus.OK);
    });

    getAttendance = asyncHandler(async (req: Request, res: Response) => {
        const { attendanceId } = req.params;
        const attendance = await Attendance.findById(attendanceId)
            .populate(this.shiftTypePopulate)
            .populate(this.breaksPopulate)
            .populate(this.employeePopulate);
        sendSuccess(res, { attendance }, "Attendance retrieved successfully", HttpStatus.OK);
    });

    updateAttendance = asyncHandler(async (req: Request, res: Response) => {
        const { attendanceId } = req.params;
        const { date, status, checkIn, checkOut, notes, breaks, shiftType } = req.body;
        const duration = checkOut ? this.calculateDuration(checkIn, checkOut) : 0;
        const fees = await this.calculateFees(shiftType, checkIn, checkOut);
        const attendance = await Attendance.findByIdAndUpdate(attendanceId, { date, status, checkIn, checkOut, duration, notes, breaks, shiftType, ...fees }, { new: true });
        sendSuccess(res, { attendance }, "Attendance updated successfully", HttpStatus.OK);
    });

    deleteAttendance = asyncHandler(async (req: Request, res: Response) => {
        const { attendanceId } = req.params;
        const attendance = await Attendance.findByIdAndDelete(attendanceId);
        sendSuccess(res, { attendance }, "Attendance deleted successfully", HttpStatus.OK);
    });

}

export default AttendanceController;