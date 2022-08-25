export interface CertiOptions {
    base?: string;
    store?: Store;
    checker?: Checker;
}

export interface Item {
    prefix: string;
    key: string;
    cert: string;
    del_code: string;
    created: number;
}

export interface Store {
    insert(key: string, item: Item): Promise<void> | void;
    get(key: string): Promise<Item | null> | Item | null;
    delete(key: string): Promise<void> | void;
}

export type Checker = (url: string) => Promise<boolean> | boolean;
