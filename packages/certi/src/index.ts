import { check } from "./check";
import { BASE, ERROR } from "./constants";
import { db } from "./db";
import { CertiOptions, Checker, Store } from "./types";
import { hash, random_string } from "./utils";

/**
 * An URL Shortener
 */
export class Certi {
    public base: string;
    public store: Store;
    public checker: Checker;

    constructor({ base = BASE, store = db, checker = check }: CertiOptions = {}) {
        this.base = base;
        this.store = store;
        this.checker = checker;
    }

    public set_base(base: string): this {
        this.base = base;
        return this;
    }

    public set_database(db: Store): this {
        this.store = db;
        return this;
    }

    public set_checker(checker: Checker): this {
        this.checker = checker;
        return this;
    }

    public async create({ cert, prefix = "" }: { cert: string; prefix?: string }) {
        if ((await check(cert)) === false) {
            return { success: false, error: ERROR.INVALID_CERT_URL };
        }
        prefix = (prefix || "").trim();
        const del_code = random_string(6);
        const key = await hash(cert);
        const item = { prefix, key, cert, del_code, created: Date.now() };
        const url = `${this.base}${prefix}${key}`;

        try {
            await this.store.insert(prefix + key, item);
        } catch (err) {
            return { success: false, error: ERROR.EXISTS, url };
        }

        return { success: true, item, url };
    }

    public async delete({ key, del_code }: { key: string; del_code: string }) {
        const item = await this.store.get(key);

        if (!item) {
            return { success: false, error: ERROR.NO_ITEM };
        }

        if (item.del_code !== del_code) {
            return { success: false, error: ERROR.WRONG_DEL_CODE };
        }

        await this.store.delete(key);
        return { success: true, item };
    }

    public async get(key: string) {
        return await this.store.get(key);
    }
}

export default Certi;
export * from "./db";
export * from "./check";
export * from "./utils";
export * from "./types";
export * from "./constants";
