import express from "express";
import check from "./checker";
import store from "./store";

const app = express();

app.get("/", (req, res) => {
    res.json({
        create: "/create?cert=<certificate_url>&prefix=<prefix>",
        delete: "/delete?key=<key>&del_code=<delete_code>",
        notice: "The length of the prefix must be between 0 and 16 characters.",
    });
});

app.get("/create", async (req, res) => {
    const { cert, prefix } = req.query;
    if (!cert) {
        res.status(400).json({ error: "Missing parameter: cert" });
        return;
    }
    if (typeof prefix === "string" && prefix.length > 16) {
        res.status(400).json({
            error: "The length of the prefix must be between 0 and 16 characters.",
        });
        return;
    }
    if (typeof cert === "string" && (await check(cert))) {
        res.json(await store.create({ cert, prefix: prefix?.toString() || "" }));
    } else {
        res.status(400).json({ error: "Invalid parameter: cert" });
    }
});

app.get("/delete", async (req, res) => {
    const { key, del_code } = req.query;
    if (!key) {
        res.status(400).json({ error: "Missing parameter: key" });
        return;
    }
    if (!del_code) {
        res.status(400).json({ error: "Missing parameter: del_code" });
        return;
    }
    res.json(await store.delete({ key: key.toString(), del_code: del_code.toString() }));
});

app.get("/:key", async (req, res) => {
    const { key } = req.params;
    if (!key) {
        res.status(400).json({ error: "Missing parameter: key" });
        return;
    }
    const item = await store.get(key);
    if (!item) {
        res.status(404).json({ error: "No Item" });
        return;
    }
    res.redirect(item.cert);
});

export default app;
