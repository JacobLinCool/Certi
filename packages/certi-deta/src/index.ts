import { Certi, ERROR } from "certi";
import express from "express";
import store from "./store";

const app = express();
const certi = new Certi({ base: "https://certi.jacoblin.cool/", store });

app.get("/", (req, res) => {
    const json = JSON.stringify(
        {
            create: "/create?cert=<certificate_url>&prefix=<prefix>",
            delete: "/delete?key=<key>&del_code=<delete_code>",
            notice: "The length of the prefix must be between 0 and 16 characters.",
            see: "https://github.com/JacobLinCool/Certi",
        },
        null,
        4,
    );
    res.send(json);
});

app.get("/create", async (req, res) => {
    const { cert, prefix } = req.query as { cert?: string; prefix?: string };
    if (!cert) {
        res.status(400).json({ success: false, error: ERROR.MISSING_PARAM("cert") });
        return;
    }
    const result = await certi.create({ cert, prefix });
    res.status(result.success ? 200 : 400).json(result);
});

app.get("/delete", async (req, res) => {
    const { key, del_code } = req.query as { key?: string; del_code?: string };
    if (!key) {
        res.status(400).json({ success: false, error: ERROR.MISSING_PARAM("key") });
        return;
    }
    if (!del_code) {
        res.status(400).json({ success: false, error: ERROR.MISSING_PARAM("del_code") });
        return;
    }
    const result = await certi.delete({ key, del_code });
    res.status(result.success ? 200 : 400).json(result);
});

app.get("/:key", async (req, res) => {
    const { key } = req.params as { key?: string };
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
