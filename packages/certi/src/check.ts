import fetch from "node-fetch";
import { CheckerEntry } from "./types";
import { normalize_url } from "./utils";

export const certi_checkers: CheckerEntry[] = [
    {
        type: "Coursera Course Certificate",
        regex: /^https:\/\/www.coursera.org\/account\/accomplishments\/certificate\/[\d\w]{12}$/,
        check: async (url: string) => {
            const code = url.match(
                /https:\/\/www.coursera.org\/account\/accomplishments\/certificate\/([\d\w]{12})/,
            )?.[1];
            if (!code) {
                return false;
            }
            const res = await fetch(
                `https://www.coursera.org/api/certificate.v1/?q=byVerifyCode&verifyCode=${code}&fields=verifyCode`,
            );
            const json = await res.json();
            return json.elements.length > 0;
        },
    },
    {
        type: "Coursera Specialization Certificate",
        regex: /^https:\/\/www.coursera.org\/account\/accomplishments\/specialization\/certificate\/[\d\w]{12}$/,
        check: async (url: string) => {
            const code = url.match(
                /https:\/\/www.coursera.org\/account\/accomplishments\/specialization\/certificate\/([\d\w]{12})/,
            )?.[1];
            if (!code) {
                return false;
            }
            const res = await fetch(
                `https://www.coursera.org/api/certificate.v1/?q=byVerifyCode&verifyCode=${code}&fields=verifyCode`,
            );
            const json = await res.json();
            return json.elements.length > 0;
        },
    },
];

export async function check(url: string, checkers = certi_checkers): Promise<boolean> {
    url = normalize_url(url);
    const verbose = process.env.VERBOSE;

    verbose && console.time(`Check ${url}`);
    for (const checker of checkers) {
        if (checker.regex.test(url)) {
            verbose && console.log(`Checking "${url}" with type: ${checker.type}`);
            const ok = await checker.check(url);
            verbose && console.log(`"${url}" is ${ok ? "valid" : "invalid"}`);
            verbose && console.timeEnd(`Check ${url}`);
            return ok;
        }
    }

    verbose && console.log(`"${url}" is invalid, no type matched`);
    verbose && console.timeEnd(`Check ${url}`);
    return false;
}

export default check;
