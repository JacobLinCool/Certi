#!/usr/bin/env node
import path from "node:path";
import Certi from "certi";
import { tunnel } from "cloudflared";
import { program } from "commander";
import { create_server } from "./server";
import { create_store } from "./store";

program
    .option("-p, --port <port>", "Port to listen on", Number, 80)
    .option("-b, --base <base>", "Base url to use", String, "http://localhost/")
    .option("-e, --expose", "Expose the server on the network")
    .option("-s, --store <store>", "Store to use", String, "./certi.json")
    .option("-v, --verbose", "Verbose output")
    .action(async (opt) => {
        if (opt.verbose) {
            process.env.VERBOSE = "true";
        }

        const store = create_store(path.resolve(opt.store));
        const certi = new Certi({ base: opt.base, store });
        const server = create_server(certi);
        server.listen(opt.port, () => console.log(`Listening on port ${opt.port}`));

        if (opt.expose) {
            const t = tunnel({ "--url": `http://localhost:${opt.port}` });
            const url = await t.url;
            console.log("Creating secure tunnel ...");
            const conns = await Promise.all(t.connections);
            console.log(`Exposed on ${url}`);
            console.log(`Through ${conns.map((c) => `${c.ip} (${c.location})`).join(", ")}`);

            process.on("SIGINT", () => {
                t.stop();
                process.exit();
            });
        }
    });

program.parse();
