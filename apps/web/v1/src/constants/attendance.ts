export const AttendanceStatus = {
    PRESENT: "PRESENT",
    ABSENT: "ABSENT",
    LATE: "LATE",
    HOLIDAY: "HOLIDAY",
    LEAVE: "LEAVE",
    OVERTIME: "OVERTIME"
} as const;

export type AttendanceStatus = (typeof AttendanceStatus)[keyof typeof AttendanceStatus];

