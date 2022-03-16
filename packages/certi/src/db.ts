import { Item } from "./types";

const _database: Record<string, Item> = {};

export const db = {
    async insert(key: string, item: Item) {
        if (_database[key]) {
            throw new Error("key exists");
        }
        _database[key] = item;
    },
    async get(key: string) {
        return _database[key];
    },
    async delete(key: string) {
        delete _database[key];
    },
};

export default db;
