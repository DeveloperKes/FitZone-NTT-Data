import { FakeBackendService } from "./fake-db";
import { categoriesSeeder, courseScheduleSeeder, coursesSeeder, headquartersSeeder, usersSeeder } from "./seeders";

export async function setupFakeBackend() {
    const fakeBackend = new FakeBackendService();
    await fakeBackend.seedDatabase([
        { table: "users", data: usersSeeder },
        { table: "courses", data: coursesSeeder },
        { table: "categories", data: categoriesSeeder },
        { table: "headquarters", data: headquartersSeeder },
        { table: "schedules", data: courseScheduleSeeder },
        { table: "cart", data: [] },
        { table: "membership", data: [] },
        { table: "plans", data: [] },
    ]);
    return fakeBackend;
}