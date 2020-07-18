import { ElectronShims } from '../shims/electron-shims';
import { Cookies as ICookies } from './cookies.interface';
export declare class Cookies implements ICookies<Promise<void>> {
    protected webContents: ElectronShims.WebContentsLike;
    constructor(webContents: ElectronShims.WebContentsLike);
    get(): Promise<Electron.Cookie[]>;
    get(name: string): Promise<Electron.Cookie[]>;
    get(filter: Electron.Filter): Promise<Electron.Cookie[]>;
    set(name: string, value: string): Promise<void>;
    set(cookie: Electron.Cookie): Promise<void>;
    clear(name?: string): Promise<void>;
    clearAll(): Promise<void>;
}
