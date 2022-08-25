import Certi, { ERROR, Store } from "certi";
import { Router } from "itty-router";
import append from "./headers";

const base = "https://certi.jacob.workers.dev/";

const router = Router<Request>();

router.get("/", async () => {
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

    return new Response(json, { headers: append(new Headers(), "json") });
});

router.get("/create", async (req, store: Store) => {
    const { cert, prefix } = req.query as { cert?: string; prefix?: string };
    if (!cert) {
        return new Response(JSON.stringify({ error: ERROR.MISSING_PARAM("cert") }, null, 4), {
            status: 404,
            headers: append(new Headers(), "json"),
        });
    }

    const certi = new Certi({ base, store });
    const result = await certi.create({ cert, prefix });
    return new Response(JSON.stringify(result, null, 4), {
        status: result.success ? 200 : 400,
        headers: append(new Headers(), "json"),
    });
});

router.get("/delete", async (req, store: Store) => {
    const { key, del_code } = req.query as { key?: string; del_code?: string };
    if (!key) {
        return new Response(JSON.stringify({ error: ERROR.MISSING_PARAM("key") }, null, 4), {
            status: 404,
            headers: append(new Headers(), "json"),
        });
    }
    if (!del_code) {
        return new Response(JSON.stringify({ error: ERROR.MISSING_PARAM("del_code") }, null, 4), {
            status: 404,
            headers: append(new Headers(), "json"),
        });
    }

    const certi = new Certi({ base, store });
    const result = await certi.delete({ key, del_code });
    return new Response(JSON.stringify(result, null, 4), {
        status: result.success ? 200 : 400,
        headers: append(new Headers(), "json"),
    });
});

router.get("/:key", async (req, store: Store) => {
    const { key } = req.params as { key?: string };
    if (!key) {
        return new Response(JSON.stringify({ error: ERROR.MISSING_PARAM("key") }, null, 4), {
            status: 404,
            headers: append(new Headers(), "json"),
        });
    }
    const item = await store.get(key);
    if (!item) {
        return new Response(JSON.stringify({ error: ERROR.NO_ITEM }, null, 4), {
            status: 404,
            headers: append(new Headers(), "json"),
        });
    }

    return Response.redirect(item.cert, 301);
});

export default router;
