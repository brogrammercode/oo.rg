import type { Employee, Org } from "./org";

export interface LeaveType {
    _id: string;
    name?: string;
    description?: string;
    color?: string;
    maxPerMonth?: number;
    maxPerYear?: number;
    isPaid?: boolean;
    org?: Org;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface Leave {
    _id: string;
    org?: Org;
    employee?: Employee;
    type?: LeaveType;
    startDate?: Date;
    endDate?: Date;
    reason?: string;
    status?: string;
    createdAt?: Date;
    updatedAt?: Date;
}