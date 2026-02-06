import mongoose from "mongoose";
import { AttendanceStatus } from "../constants/attendance.js";

const attendanceSchema = new mongoose.Schema({
    org: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "orgs",
        required: true
    },
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "employees",
        required: true
    },
    date: {
        type: Date,
    },
    duration: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: [AttendanceStatus.PRESENT, AttendanceStatus.ABSENT, AttendanceStatus.LATE, AttendanceStatus.HOLIDAY, AttendanceStatus.LEAVE, AttendanceStatus.OVERTIME],
        default: AttendanceStatus.PRESENT
    },
    checkIn: {
        type: Date
    },
    checkOut: {
        type: Date
    }
}, { timestamps: true });

const Attendance = mongoose.model("attendances", attendanceSchema);
export { Attendance };