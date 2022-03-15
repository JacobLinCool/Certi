import fetch from "node-fetch";

const regexs = [/https:\/\/www.coursera.org\/account\/accomplishments\/certificate\/[\d\w]{12}/];

export default async function check(url: string): Promise<boolean> {
    url = normalize_url(url);
    console.log(`Checking "${url}"...`);

    if (!regexs.some((regex) => regex.test(url))) {
        return false;
    }

    console.log(`Fetching "${url}"...`);

    const res = await fetch(url);
    if (res.status !== 200) {
        return false;
    }

    console.log(`"${url}" is valid!`);

    return true;
}

function normalize_url(url: string): string {
    url = url.replace(/^http:/, "https:");
    if (!url.startsWith("http")) {
        url = "https://" + url;
    }
    return url;
}
