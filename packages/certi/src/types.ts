export interface CertiOptions {
    base?: string;
    store?: Store;
}

export interface Item {
    prefix: string;
    key: string;
    cert: string;
    del_code: string;
    created: number;
}

export interface Store {
    insert(key: string, item: Item): Promise<void>;
    get(key: string): Promise<Item | null>;
    delete(key: string): Promise<void>;
}
