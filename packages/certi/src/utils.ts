import crypto from "node:crypto";
import { HASH_SALT, RANDOM_DICT } from "./constants";

export function random_string(len: number, dict = RANDOM_DICT): string {
    let str = "";
    for (let i = 0; i < len; i++) {
        str += dict[Math.floor(Math.random() * dict.length)];
    }
    return str;
}

export function hash(str: string, salt = HASH_SALT): string {
    const hex = crypto
        .createHash("sha256")
        .update(salt + str)
        .digest("hex");

    const base36_even = [...BigInt("0x" + hex).toString(36)].filter((_, i) => i % 2 === 0);

    return base36_even.slice(6, 12).join("");
}

export function normalize_url(url: string): string {
    url = url.replace(/^http:/, "https:");
    if (!url.startsWith("http")) {
        url = "https://" + url;
    }
    return url;
}
