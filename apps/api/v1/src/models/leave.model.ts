import mongoose from "mongoose";
import { LeaveStatus } from "../constants/leave.js";

const leaveSchema = new mongoose.Schema(
    {
        org: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "orgs",
        },
        employee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "employees",
        },
        type: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "leave_types",
        },
        startDate: { type: Date },
        endDate: { type: Date },
        reason: { type: String },
        status: {
            type: String,
            enum: [
                LeaveStatus.PENDING,
                LeaveStatus.APPROVED,
                LeaveStatus.REJECTED,
                LeaveStatus.CANCELLED,
                LeaveStatus.COMPLETED,
                LeaveStatus.ACTIVE,
                LeaveStatus.INACTIVE,
            ],
            default: LeaveStatus.PENDING,
        },
    },
    { timestamps: true },
);

const leaveTypeSchema = new mongoose.Schema(
    {
        org: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "orgs",
        },
        name: { type: String },
        description: { type: String },
        color: { type: String },
        maxPerMonth: { type: Number },
        maxPerYear: { type: Number },
        isPaid: { type: Boolean },
    },
    { timestamps: true },
);

const Leave = mongoose.model("leaves", leaveSchema);
const LeaveType = mongoose.model("leave_types", leaveTypeSchema);
export { Leave, LeaveType };
