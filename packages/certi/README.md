# Certi

An configurable URL shortener for Certificates (and other things).

This is the core library part of Certi. If you just want to run a server, try [certi-cli](https://www.npmjs.com/package/certi-cli).

You can also try the demo on [`cert.deta.dev`](https://cert.deta.dev/) or [`certi.jacob.workers.dev`](https://certi.jacob.workers.dev/).

## Usage

Simply start with the default configs:

```ts
import { Certi } from "certi";

main();

async function main() {
    // create Certi instance in memory-store mode
    const certi = new Certi();

    // auto-check with Coursera for the existence of the certificate
    const result = await certi.create({ cert: "https://www.coursera.org/account/accomplishments/certificate/RZU3FVL3SWJ4" });

    if (result.success) {
        console.log(result.url);
    } else {
        console.error(result.error);
    }
}
```
