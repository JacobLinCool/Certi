import { Item, Store } from "./types";

/**
 * In-memory key-value store.
 */
export class MemoryStore implements Store {
    private database: Record<string, Item> = {};

    async insert(key: string, item: Item) {
        if (this.database[key]) {
            throw new Error("key exists");
        }
        this.database[key] = item;
    }

    async get(key: string) {
        return this.database[key];
    }

    async delete(key: string) {
        delete this.database[key];
    }
}

export const db = new MemoryStore();
