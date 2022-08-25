import { Item, Store } from "certi";
import { mapping } from "file-mapping";

export function create_store(path: string): Store {
    const database = mapping<Record<string, Item | undefined>>(path, {});

    const store: Store = {
        async insert(key: string, item: Item) {
            if (database[key]) {
                throw new Error(`Key ${key} already exists`);
            }
            database[key] = item;
        },
        async delete(key: string) {
            if (!database[key]) {
                throw new Error(`Key ${key} does not exist`);
            }
            delete database[key];
        },
        async get(key: string) {
            const item = database[key];
            return item ? item : null;
        },
    };

    return store;
}
