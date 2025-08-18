import { Course } from "./Course";

export interface UserProduct {
    id: number;
    product: Course;
    quantity: number;
    token: string;
}

export interface UserProductPayload {
    userId: number;
    productId: number;
    token: string;
}