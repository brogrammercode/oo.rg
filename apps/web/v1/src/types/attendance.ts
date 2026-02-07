import type { Employee, Org } from "./org";

export interface Attendance {
    _id: string;
    org?: Org;
    employee?: Employee;
    date?: Date;
    status?: string;
    checkIn?: Date;
    checkOut?: Date;
    notes?: string;
    breaks?: Break[];
    shiftType?: ShiftType;
    lateFinePerMin?: number;
    lateGrace?: number;
    lateFee?: number;
    overtimePricePerMin?: number;
    overtimeFee?: number;
    duration?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface Break {
    _id: string;
    org?: Org;
    employee?: Employee;
    attendance?: Attendance;
    type?: BreakType;
    start?: Date;
    end?: Date;
    duration?: number;
    status?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface BreakType {
    _id: string;
    org?: Org;
    name?: string;
    description?: string;
    duration?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ShiftType {
    _id: string;
    org?: Org;
    name?: string;
    description?: string;
    start?: Date;
    end?: Date;
    lateGrace?: number;
    lateFinePerMin?: number;
    overtimePricePerMin?: number;
    createdAt?: Date;
    updatedAt?: Date;
}