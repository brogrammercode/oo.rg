export interface User {
    _id: string;
    name?: string;
    email?: string;
    password?: string;
    image?: string;
    phone?: string;
    bio?: string;
    country?: string;
    state?: string;
    city?: string;
    zip?: string;
    address?: string;
    createdAt?: Date;
    updatedAt?: Date;
}