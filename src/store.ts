import { Deta } from "deta";
import { BASE, ERROR } from "./constants";
import { hash, random_string } from "./utils";

const deta = process.env.DETA_PROJ_KEY ? Deta(process.env.DETA_PROJ_KEY) : Deta();
const db = deta.Base("certi-store");

export default {
    async create({ cert, prefix = "" }: { cert: string; prefix: string }) {
        const del_code = random_string(6);
        const key = [...hash(cert)]
            .filter((_, i) => i % 2 === 0)
            .join("")
            .slice(6, 12);
        const item = { prefix, key, cert, del_code, created: Date.now() };
        const url = `${BASE}${prefix}${key}`;
        try {
            await db.insert(item, prefix + key);
        } catch (err) {
            return { success: false, error: ERROR.EXISTS, url };
        }
        return { success: true, item, url };
    },
    async delete({ key, del_code }: { key: string; del_code: string }) {
        const item = await db.get(key);
        if (!item) {
            return { success: false, error: ERROR.NO_ITEM };
        }
        if (item.del_code === del_code) {
            await db.delete(key);
            return { success: true, item };
        }
        return { success: false, error: ERROR.WRONG_DEL_CODE };
    },
    async get(key: string) {
        return (await db.get(key)) as {
            prefix: string;
            key: string;
            cert: string;
            del_code: string;
            created: number;
        } | null;
    },
};
