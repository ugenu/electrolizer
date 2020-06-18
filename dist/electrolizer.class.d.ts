import { BrowserView, BrowserWindow, WebviewTag } from 'electron';
import { OperatorFunctions } from './operator-functions.interface';
import { WebviewTagDriver, BrowserViewDriver, BrowserWindowDriver } from './drivers';
import { Push } from './evaluate-function.type';
import { Cookies } from './drivers/cookies.interface';
export declare enum ElectrolizerType {
    webview = "webview",
    browserView = "browserView",
    browserWindow = "browserWindow"
}
export declare class Electrolizer<T extends WebviewTag | BrowserView | BrowserWindow> implements OperatorFunctions<Electrolizer<T>> {
    protected bus: T;
    interactionReady: boolean;
    queue: (() => Promise<any>)[];
    driver: WebviewTagDriver | BrowserWindowDriver | BrowserViewDriver;
    constructor(bus: T);
    cookies: Cookies<Electrolizer<T>>;
    private setupDriver;
    get busType(): ElectrolizerType;
    private _queue;
    goto(url: string, headers?: Record<string, string>): Electrolizer<T>;
    back(): Electrolizer<T>;
    forward(): Electrolizer<T>;
    refresh(): Electrolizer<T>;
    click(selector: string): Electrolizer<T>;
    mousedown(selector: string): Electrolizer<T>;
    mouseup(selector: string): Electrolizer<T>;
    mouseover(selector: string): Electrolizer<T>;
    mouseout(selector: string): Electrolizer<T>;
    type(selector: string, text?: string): Electrolizer<T>;
    insert(selector: string, text?: string): Electrolizer<T>;
    check(selector: string): Electrolizer<T>;
    uncheck(selector: string): Electrolizer<T>;
    select(selector: string, option?: string): Electrolizer<T>;
    scrollTo(top: number, left: number): Electrolizer<T>;
    viewport(width: number, height: number): Electrolizer<T>;
    inject(type: 'js' | 'css', file: string): Electrolizer<T>;
    exists(selector: string): Promise<boolean>;
    html(): Promise<string>;
    evaluate<T, K extends any[], R>(fn: (...args: Push<K, T>) => R, ...args: K): Promise<R>;
    wait(ms: number): Electrolizer<T>;
    wait(selector: string, delay?: number): Electrolizer<T>;
    wait<R, K extends any[]>(fn: (...args: Push<K, R>) => boolean | Promise<boolean>, ...args: K): Electrolizer<T>;
    header(header: string, value: string): Electrolizer<T>;
    authentication(username: string, password: string): Electrolizer<T>;
    useragent(useragent: string): Electrolizer<T>;
    run(): Promise<void>;
    end(): Promise<void>;
}
export default Electrolizer;
