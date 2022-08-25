import router from "./router";
import { create_store } from "./store"

export default {
    async fetch(request: Request, environment: { kv: KVNamespace }, context: ExecutionContext): Promise<Response> {
        try {
            return await router.handle(request, create_store(environment.kv));
        } catch (err) {
            console.error(err);
            return new Response((<Error>err).message, { status: 500, headers: { "Content-Type": "text/plain" } });
        }
    },
    async scheduled(controller: ScheduledController, environment: unknown, context: ExecutionContext): Promise<void> {
        // await dosomething();
    },
};
