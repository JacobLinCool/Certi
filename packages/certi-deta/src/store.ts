import { Item, Store } from "certi";
import { Deta } from "deta";
import { DetaType } from "deta/dist/types/types/basic";

const deta = process.env.DETA_PROJ_KEY ? Deta(process.env.DETA_PROJ_KEY) : Deta();
const db = deta.Base("certi-store");

const store: Store = {
    async insert(key: string, item: Item) {
        await db.insert(item as unknown as DetaType, key);
    },
    async delete(key: string) {
        await db.delete(key);
    },
    async get(key: string) {
        const item = await db.get(key);
        return item ? (item as unknown as Item) : null;
    },
};

export default store;
