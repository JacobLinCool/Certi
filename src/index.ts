import express from "express";
import check from "./checker";
import { ERROR } from "./constants";
import store from "./store";

const app = express();

app.get("/", (req, res) => {
    res.json({
        create: "/create?cert=<certificate_url>&prefix=<prefix>",
        delete: "/delete?key=<key>&del_code=<delete_code>",
        notice: "The length of the prefix must be between 0 and 16 characters.",
        see: "https://github.com/JacobLinCool/Certi",
    });
});

app.get("/create", async (req, res) => {
    const { cert, prefix } = req.query;
    if (!cert) {
        res.status(400).json({ error: ERROR.MISSING_PARAM("cert") });
        return;
    }
    if (typeof prefix === "string" && prefix.length > 16) {
        res.status(400).json({
            error: ERROR.INVALID_PARAM(
                "prefix",
                "The length of the prefix must be between 0 and 16 characters.",
            ),
        });
        return;
    }
    if (typeof cert === "string" && (await check(cert))) {
        res.json(await store.create({ cert, prefix: prefix?.toString() || "" }));
    } else {
        res.status(400).json({ error: ERROR.INVALID_CERT_URL });
    }
});

app.get("/delete", async (req, res) => {
    const { key, del_code } = req.query;
    if (!key) {
        res.status(400).json({ error: ERROR.MISSING_PARAM("key") });
        return;
    }
    if (!del_code) {
        res.status(400).json({ error: ERROR.MISSING_PARAM("del_code") });
        return;
    }
    res.json(await store.delete({ key: key.toString(), del_code: del_code.toString() }));
});

app.get("/:key", async (req, res) => {
    const { key } = req.params;
    if (!key) {
        res.status(400).json({ error: ERROR.MISSING_PARAM("key") });
        return;
    }
    const item = await store.get(key);
    if (!item) {
        res.status(404).json({ error: ERROR.NO_ITEM });
        return;
    }
    res.redirect(item.cert);
});

export default app;
