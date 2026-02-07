export const AttendanceStatus = {
    PRESENT: "PRESENT",
    ABSENT: "ABSENT",
    LATE: "LATE",
    HOLIDAY: "HOLIDAY",
    LEAVE: "LEAVE",
    BREAK: "BREAK",
    OVERTIME: "OVERTIME",
    REQUESTED: "REQUESTED",
    CANCELLED: "CANCELLED",
    REJECTED: "REJECTED",
    APPROVED: "APPROVED",
} as const;

export const BreakStatus = {
    PENDING: "PENDING",
    APPROVED: "APPROVED",
    REJECTED: "REJECTED",
} as const;

export type AttendanceStatus = (typeof AttendanceStatus)[keyof typeof AttendanceStatus];
export type BreakStatus = (typeof BreakStatus)[keyof typeof BreakStatus];

