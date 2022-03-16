export const BASE = "http://localhost/";
export const HASH_SALT = "certi";
export const RANDOM_DICT = "0123456789abcdefghijklmnopqrstuvwxyz";

export const ERROR = {
    EXISTS: "Already Exists",
    INVALID_CERT_URL: "Invalid Certificate URL",
    NO_ITEM: "No Item",
    WRONG_DEL_CODE: "Wrong Delete Code",
    MISSING_PARAM(name = "") {
        return "Missing Parameter" + (name ? `: ${name}` : "");
    },
    INVALID_PARAM(name = "", msg = "") {
        return "Invalid Parameter" + (name ? `: ${name}` : "") + (msg ? ` | ${msg}` : "");
    },
} as const;
