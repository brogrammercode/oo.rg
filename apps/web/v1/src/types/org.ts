import type { User } from "./user";

export interface Org {
    _id: string;
    name: string;
    description?: string;
    logo?: string;
    owner?: User;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface Employee {
    _id: string;
    user: User;
    org: Org;
    post: Post;
    roles: Role[];
    joined_at: Date;
    resigned_at?: Date;
    status: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface Role {
    _id: string;
    name: string;
    description?: string;
    color?: string;
    org: Org;
    permissions: string[];
    createdAt?: Date;
    updatedAt?: Date;
}

export interface Post {
    _id: string;
    name: string;
    description?: string;
    color?: string;
    logo?: string;
    department: Department;
    org: Org;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface Department {
    _id: string;
    name: string;
    description?: string;
    color?: string;
    logo?: string;
    org: Org;
    createdAt?: Date;
    updatedAt?: Date;
}
