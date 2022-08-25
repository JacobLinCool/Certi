import { Item, Store } from "certi";

export function create_store(kv: KVNamespace) {
    const store: Store = {
        async insert(key: string, item: Item) {
            if (await kv.get(key)) {
                throw new Error("Item already exists.");
            }
            await kv.put(key, JSON.stringify(item));
        },
        async delete(key: string) {
            await kv.delete(key);
        },
        async get(key: string) {
            const item = await kv.get(key);
            return item ? JSON.parse(item) : null;
        },
    };

    return store;
}
