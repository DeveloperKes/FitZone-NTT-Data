import { openDB } from "idb";
import { Category, Course, CoursePayload, CourseSchedule, DayOfWeek, Headquarters, ResponseData, ScheduleShift, User, UserProduct, UserProductPayload } from "../app/shared/interfaces";
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
            if (!db.objectStoreNames.contains("user-products")) {
                db.createObjectStore("user-products", { keyPath: "id", autoIncrement: true });
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
            if (url.startsWith("/users/product") && method === "GET") {
                const userId = Number(url.split("/").pop());

                const userProducts = await this.getByFilters("user-products", { userId: [userId] }) as Partial<UserProductPayload & UserProduct>[];

                const response: UserProduct[] = await Promise.all(userProducts.map(async (up) => {
                    if (up.productId) {
                        const product = await this.getOne("courses", up.productId) as Partial<Course & CoursePayload>;
                        if (product) {
                            const headquarters = await this.getAll("headquarters") as Headquarters[];
                            const categories = await this.getAll("categories") as Category[];
                            const schedules = await this.getAll("schedules") as CourseSchedule[];
                            return {
                                id: up.id,
                                product: {
                                    ...product,
                                    category: categories.find(c => c.id == product.categoryId),
                                    headquarters: headquarters.find(h => h.id === product.headquartersId),
                                    schedule: schedules.filter(s => s.courseId === product.id),
                                    owner: true
                                },
                                quantity: userProducts.reduce(
                                    (acc, i) => i.productId == product.id ? acc + 1 : acc,
                                    0
                                ),
                                token: up.token
                            } as UserProduct;
                        }
                        return {} as UserProduct;
                    }
                    return {} as UserProduct;
                }));
                return this.buildResponse(200, response, "Ok")
            }
            if (url === "/users/product" && method === "POST" && body) {
                const { products } = body as { products: UserProductPayload[] };
                if (products) {
                    const response: UserProduct[] = [];
                    products.forEach(async (product) => {
                        const up = await this.createOne("user-products", product);
                        const headquarters = await this.getAll("headquarters") as Headquarters[];
                        const categories = await this.getAll("categories") as Category[];
                        const schedules = await this.getAll("schedules") as CourseSchedule[];
                        const course = await this.getOne("courses", product.productId) as Partial<Course & CoursePayload>;
                        const userProducts = await this.getByFilters("user-products", { userId: [product.userId] }) as Partial<UserProductPayload & UserProduct>[];

                        if (course) {
                            response.push({
                                id: up.id,
                                product: {
                                    ...(course as Course),
                                    id: course.id as number,
                                    category: categories.find(c => c.id == course.categoryId) ?? ({} as Category),
                                    headquarters: headquarters.find(h => h.id === course.headquartersId) ?? ({} as Headquarters),
                                    schedule: schedules.filter(s => s.courseId === course.id) ?? [],
                                    owner: true
                                },
                                quantity: userProducts.reduce(
                                    (acc, i) => i.productId == course.id ? acc + 1 : acc,
                                    0
                                ),
                                token: up.token
                            } as UserProduct)
                        }
                    })
                    return this.buildResponse(201, response, "Associations Created")
                }
                return this.buildResponse(400, [], "Products not defined", new Error("Products not defined"))
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
                const headquarters = await this.getAll("headquarters") as Headquarters[];
                const categories = await this.getAll("categories") as Category[];
                const schedules = await this.getAll("schedules") as CourseSchedule[];
                const data = (await this.getAll("courses")).map((item: Partial<Course & CoursePayload>) => {
                    return {
                        ...item,
                        category: categories.find(c => c.id == item.categoryId),
                        headquarters: headquarters.find(h => h.id === item.headquartersId),
                        schedules: schedules.filter(s => s.courseId === item.id)
                    }
                });
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
        const response = {
            message: message ?? "OK",
            code,
            data: data ?? null,
            error: error ?? null
        };
        if (error) throw response;
        return response;
    }
}