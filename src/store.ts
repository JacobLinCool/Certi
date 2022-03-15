import crypto from "crypto";
import { Deta } from "deta";

const base = "https://certi.jacoblin.cool/";
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
        const url = `${base}${prefix}${key}`;
        try {
            await db.insert(item, prefix + key);
        } catch (err) {
            return { success: false, error: "Already Exists", url };
        }
        return { success: true, item, url };
    },
    async delete({ key, del_code }: { key: string; del_code: string }) {
        const item = await db.get(key);
        if (!item) {
            return { success: false, error: "No Item" };
        }
        if (item.del_code === del_code) {
            await db.delete(key);
            return { success: true, item };
        }
        return { success: false, error: "Wrong del_code" };
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

function random_string(len: number) {
    const chars = "0123456789abcdefghijklmnopqrstuvwxyz" as const;
    let str = "";
    for (let i = 0; i < len; i++) {
        str += chars[Math.floor(Math.random() * chars.length)];
    }
    return str;
}

function hash(str: string, salt = "certi") {
    return crypto
        .createHash("sha256")
        .update(salt + str)
        .digest("hex");
}
