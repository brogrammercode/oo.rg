import type { Employee, Org } from "./org";

export interface Attendance {
    _id: string;
    org?: Org;
    employee?: Employee;
    date?: Date;
    status?: string;
    checkIn?: Date;
    checkOut?: Date;
    duration?: number;
    createdAt?: Date;
    updatedAt?: Date;
}