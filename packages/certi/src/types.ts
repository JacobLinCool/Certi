export interface CertiOptions {
    base?: string;
    store?: Store;
    checker?: Checker;
    keygen?: (url: string) => Promise<string>;
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

export type CheckerEntry = {
    type: string;
    regex: RegExp;
    check: (url: string) => boolean | Promise<boolean>;
};

export type Checker = (url: string, checkers?: CheckerEntry[]) => Promise<boolean> | boolean;
