import { WebContents } from "electron";
import { Cookies as ICookies } from './cookies.interface';
export declare class Cookies implements ICookies<Promise<void>> {
    protected webContents: WebContents;
    constructor(webContents: WebContents);
    get(name: string | Electron.Filter): Promise<Electron.Cookie[]>;
    set(name: string, value: string): Promise<void>;
    set(cookie: Electron.Cookie): Promise<void>;
    clear(name?: string): Promise<void>;
    clearAll(): Promise<void>;
}
