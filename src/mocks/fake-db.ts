import { openDB } from "idb";

export class FakeBackendService {
    private readonly dbPromise = openDB("fake-db", 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains("users")) {
                db.createObjectStore("users", { keyPath: "id", autoIncrement: true });
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

    async getOne(table: string, id: number) {
        const db = await this.dbPromise;
        await this.checkTableExists(table);
        const item = await db.get(table, id);
        return item ? { ...item } : null;
    }

    async getAll(table: string) {
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

    async handleRequest(url: string, method: string, body?: any) {
        if (!url.startsWith("/api/")) {
            throw new Error("Invalid API endpoint");
        }

        url = url.replace("/api", "");

        if (url === "/users" && method === "GET") {
            return this.getAll("users");
        }
        if (url === "/users" && method === "POST" && body) {
            return this.createOne("users", body);
        }
        if (url.startsWith("/api/users/") && method === "GET") {
            const userId = Number(url.split("/").pop());
            return this.getOne("users", userId);
        }
        if (url === "/login" && method === "POST" && body) {
            const { username, password } = body;
            const users = await this.getAll("users");
            const user = users.find(u => u.username === username && u.password === password);
            if (user) {
                const responseUSer = { ...user };
                delete responseUSer.password;
                return responseUSer;
            }
            throw new Error("Invalid credentials");
        }

        throw new Error("Not Found");
    }
}