import { User } from "../../app/shared/interfaces";

export const usersSeeder: Omit<User, 'id'>[] = [
    {
        email: "admin@admin.com",
        fullname: "Admin User",
        username: "admin",
        password: "Admin123",
    }
]