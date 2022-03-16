import { Certi, ERROR } from "../";

describe("Certi", () => {
    it("should create a new Certi instance with default options", () => {
        const certi = new Certi();
        expect(certi.base).toBe("http://localhost/");
        expect(certi.store).toBeDefined();
    });

    it("should create a new Certi instance with custom options", () => {
        const certi = new Certi({
            base: "https://example.com/",
            store: {
                get: jest.fn(),
                insert: jest.fn(),
                delete: jest.fn(),
            },
        });
        expect(certi.base).toBe("https://example.com/");
        expect(certi.store).toBeDefined();
    });

    it("should be able to create new item", async () => {
        const certi = new Certi();
        const item = await certi.create({
            cert: "https://www.coursera.org/account/accomplishments/certificate/RZU3FVL3SWJ4",
        });
        expect(item.success).toBe(true);
        expect(item.item).toBeDefined();
        expect(item.url).toBeDefined();
    });

    it("should be able to block url", async () => {
        const certi = new Certi();
        const item = await certi.create({
            cert: "https://www.google.com/",
        });
        expect(item.success).toBe(false);
        expect(item.error).toBe(ERROR.INVALID_CERT_URL);
    });

    it("should be able to block not exists certificate", async () => {
        const certi = new Certi();
        const item = await certi.create({
            cert: "https://www.coursera.org/account/accomplishments/certificate/ABCDEFGHIJKL",
        });
        expect(item.success).toBe(false);
        expect(item.error).toBe(ERROR.INVALID_CERT_URL);
    });
});
