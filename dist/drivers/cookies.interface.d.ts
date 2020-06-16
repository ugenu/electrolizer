export interface Cookies<T> {
    get(name: string): Promise<Electron.Cookie[]>;
    get(filter: Electron.Filter): Promise<Electron.Cookie[]>;
    set(name: string, value: string): T;
    set(cookie: Electron.Cookie): T;
    clear(name: string): T;
    clear(): T;
    clearAll(): T;
}
