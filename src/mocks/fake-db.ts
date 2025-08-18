import { openDB } from "idb";
import { DayOfWeek, ResponseData, ScheduleShift, User } from "../app/shared/interfaces";
export class FakeBackendService {
    private readonly dbPromise = openDB("fake-db", 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains("users")) {
                const store = db.createObjectStore("users", { keyPath: "id", autoIncrement: true });
                store.createIndex("username", "username", { unique: true });
            }
            if (!db.objectStoreNames.contains("courses")) {
                const store = db.createObjectStore("courses", { keyPath: "id", autoIncrement: true });
                store.createIndex("title", "title");
                store.createIndex("duration", "duration");
                store.createIndex("level", "level");
                store.createIndex("category", "categoryId");
                store.createIndex("headquarters", "headquartersId");
            }
            if (!db.objectStoreNames.contains("categories")) {
                db.createObjectStore("categories", { keyPath: "id", autoIncrement: true });
            }
            if (!db.objectStoreNames.contains("headquarters")) {
                db.createObjectStore("headquarters", { keyPath: "id", autoIncrement: true });
            }
            if (!db.objectStoreNames.contains("schedules")) {
                db.createObjectStore("schedules", { keyPath: "id", autoIncrement: true });
            }
            if (!db.objectStoreNames.contains("cart")) {
                db.createObjectStore("cart", { keyPath: "id", autoIncrement: true });
            }
            if (!db.objectStoreNames.contains("membership")) {
                db.createObjectStore("membership", { keyPath: "id", autoIncrement: true });
            }
            if (!db.objectStoreNames.contains("plans")) {
                db.createObjectStore("plans", { keyPath: "id", autoIncrement: true });
            }
        }
    });

    private async checkTableExists(table: string) {
        return this.dbPromise.then(db => {
            if (!db.objectStoreNames.contains(table)) {
                throw new Error(`Table ${table} does not exist`);
            }
        });
    }

    async getOne(table: string, id: number): Promise<Record<string, any> | null> {
        const db = await this.dbPromise;
        await this.checkTableExists(table);
        const item = await db.get(table, id);
        return item ? { ...item } : null
    }

    async getOneBy(table: string, key: string, value: any, onlyData = false): Promise<Record<string, any> | null> {
        const db = await this.dbPromise;
        await this.checkTableExists(table);
        const item = await db.getFromIndex(table, key, value);
        return item ? { ...item } : null;
    }

    async getAll(table: string, onlyData = false): Promise<any[]> {
        const db = await this.dbPromise;
        await this.checkTableExists(table);
        const items = await db.getAll(table);
        return items.map(item => ({ ...item }));
    }

    async createOne(table: string, data: any) {
        const db = await this.dbPromise;
        await this.checkTableExists(table);
        const id = await db.add(table, data);
        return { ...data, id };
    }

    async getByFilters(table: string, filters: Record<string, any[]>) {
        const db = await this.dbPromise;
        await this.checkTableExists(table);

        const tx = db.transaction(table, 'readonly');
        const store = tx.objectStore(table);

        let cursor = await store.openCursor();
        const results: any[] = [];

        Object.keys(filters).forEach((key) => {
            if (filters[key].length == 0) delete filters[key];
        })

        while (cursor) {
            const item = cursor.value;

            const match = Object.keys(filters).every(key => {
                if (!item[key] && filters[key].length <= 0) return true;

                if (filters[key].includes(item[key])) return true;
                return false;
            });


            if (match) results.push(item);

            cursor = await cursor.continue();
        }

        return results;
    }

    async handleRequest(url: string, method: string, body?: any): Promise<ResponseData<any>> {
        try {
            if (!url.startsWith("/api/")) {
                throw new Error("Invalid API endpoint");
            }

            url = url.replace("/api", "");

            if (url === "/users" && method === "GET") {
                const data = await this.getAll("users")
                return this.buildResponse(200, data, "Ok");
            }
            if (url === "/users" && method === "POST" && body) {
                const user = await this.createOne("users", body);
                return this.buildResponse(201, user, "User created")
            }
            if (url.startsWith("/api/users/") && method === "GET") {
                const userId = Number(url.split("/").pop());
                const user = await this.getOne("users", userId);
                return this.buildResponse(user ? 200 : 404, user ?? null, user ? "Ok" : "User not found");
            }
            if (url === "/login" && method === "POST" && body) {
                const { username, password } = body;
                const user = await this.getOneBy("users", "username", username) as User;

                if (user && user.password === password) {
                    const responseUser = { ...user };
                    delete responseUser.password;
                    return this.buildResponse(200, responseUser, "Ok");
                }
                return this.buildResponse(400, null, "Invalid credentials", new Error("Invalid credentials"))
            }
            if (url === "/courses" && method === "GET") {
                const data = await this.getAll("courses");
                return this.buildResponse(200, data, "Ok");
            }

            if (url === "/headquarters" && method === "GET") {
                const data = await this.getAll("headquarters");
                return this.buildResponse(200, data, "Ok");
            }
            if (url === "/categories" && method === "GET") {
                const data = await this.getAll("categories");
                return this.buildResponse(200, data, "Ok");
            }

            if (url.startsWith("/courses/filter") && method === "POST") {
                const { filters } = body as { filters: Record<string, any[]> };
                if (!filters) return this.buildResponse(400, null, "Not filters defined", new Error("Not filter Error"));

                if (filters["schedule"]) {
                    const { dayOfWeek, shift } = filters["schedule"] as unknown as { dayOfWeek: DayOfWeek[], shift: ScheduleShift[] };
                    if (dayOfWeek.length > 0 || shift.length > 0) {
                        const schedules = await this.getByFilters("schedules", {
                            dayOfWeek, shift
                        })
                        filters['id'] = schedules.map(item => item.courseId);
                    }
                    delete filters['schedule'];
                }

                const data = await this.getByFilters("courses", filters);

                return this.buildResponse(200, data, "Ok")
            }
            return this.buildResponse(404, null, "URL Not Found", new Error("URL Not Found"))
        } catch (error) {
            console.error("HTTP Error:", error);
            return this.buildResponse(500, null, "Internal Server Error", error);
        }

    }

    async resetDatabase() {
        const db = await this.dbPromise;
        const tx = db.transaction(db.objectStoreNames, "readwrite");
        for (const storeName of db.objectStoreNames) {
            tx.objectStore(storeName).clear();
        }
        await tx.done;
        console.log("Database reset complete");
    }

    async seedDatabase(seeders: { table: string; data: any[] }[]) {
        const db = await this.dbPromise;
        const tx = db.transaction(db.objectStoreNames, "readwrite");
        for (const { table, data } of seeders) {
            if (!db.objectStoreNames.contains(table)) {
                db.createObjectStore(table, { keyPath: "id", autoIncrement: true });
            }
            const store = tx.objectStore(table);
            if (await store.count() == 0) {
                for (const item of data) {
                    await store.add(item);
                }
            }
        }
        await tx.done;
        console.info("Database seeding complete 🌱");
    }

    async close() {
        const db = await this.dbPromise;
        db.close();
    }

    private buildResponse(code: number, data?: any, message?: string, error?: any): ResponseData<any> {
        return {
            message: message ?? "OK",
            code,
            data: data ?? null,
            error: error ?? null
        }
    }
}