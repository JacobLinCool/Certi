import fetch from "node-fetch";

const regexs = [/https:\/\/www.coursera.org\/account\/accomplishments\/certificate\/[\d\w]{12}/];

const checkers: {
    type: string;
    regex: RegExp;
    check: (url: string) => boolean | Promise<boolean>;
}[] = [
    {
        type: "Coursera",
        regex: /https:\/\/www.coursera.org\/account\/accomplishments\/certificate\/[\d\w]{12}/,
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
];

export default async function check(url: string): Promise<boolean> {
    url = normalize_url(url);

    for (const checker of checkers) {
        if (checker.regex.test(url)) {
            console.log(`Checking "${url}" with type: ${checker.type}`);
            const ok = await checker.check(url);
            console.log(`"${url}" is ${ok ? "valid" : "invalid"}`);
            return ok;
        }
    }

    console.log(`"${url}" is invalid, no type matched`);
    return false;
}

function normalize_url(url: string): string {
    url = url.replace(/^http:/, "https:");
    if (!url.startsWith("http")) {
        url = "https://" + url;
    }
    return url;
}
