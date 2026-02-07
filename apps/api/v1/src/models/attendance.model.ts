import mongoose from "mongoose";
import { AttendanceStatus, BreakStatus } from "../constants/attendance.js";

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
        enum: [AttendanceStatus.PRESENT, AttendanceStatus.ABSENT, AttendanceStatus.LATE, AttendanceStatus.HOLIDAY, AttendanceStatus.LEAVE, AttendanceStatus.BREAK, AttendanceStatus.OVERTIME, AttendanceStatus.REQUESTED, AttendanceStatus.CANCELLED, AttendanceStatus.REJECTED, AttendanceStatus.APPROVED],
        default: AttendanceStatus.PRESENT
    },
    checkIn: {
        type: Date
    },
    checkOut: {
        type: Date
    },
    notes: {
        type: String
    },
    breaks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "breaks"
    }],
    shiftType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "shift_types"
    },
    lateFinePerMin: {
        type: Number,
        default: 0
    },
    lateGrace: {
        type: Number,
        default: 0
    },
    lateFee: {
        type: Number,
        default: 0
    },
    overtimePricePerMin: {
        type: Number,
        default: 0
    },
    overtimeFee: {
        type: Number,
        default: 0
    },
}, { timestamps: true });

const breakSchema = new mongoose.Schema({
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
    attendance: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "attendances",
        required: true
    },
    type: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "break_types",
    },
    start: {
        type: Date,
    },
    end: {
        type: Date
    },
    duration: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: [BreakStatus.PENDING, BreakStatus.APPROVED, BreakStatus.REJECTED],
        default: BreakStatus.PENDING
    }
}, { timestamps: true });

const breakTypeSchema = new mongoose.Schema({
    org: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "orgs",
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    duration: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

const shiftTypeSchema = new mongoose.Schema({
    org: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "orgs",
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    start: {
        type: Date,
    },
    end: {
        type: Date
    },
    lateGrace: {
        type: Number,
        default: 0
    },
    lateFinePerMin: {
        type: Number,
        default: 0
    },
    overtimePricePerMin: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

const Attendance = mongoose.model("attendances", attendanceSchema);
const Break = mongoose.model("breaks", breakSchema);
const BreakType = mongoose.model("break_types", breakTypeSchema);
const ShiftType = mongoose.model("shift_types", shiftTypeSchema);
export { Attendance, Break, BreakType, ShiftType };