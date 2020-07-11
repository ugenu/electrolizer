export interface Cookies<T> {
    /**
     * Get all the cookies for the current url
     */
    get(): Promise<Electron.Cookie[]>;
    /**
     * Get all the cookies for the url by their name
     * @param name
     */
    get(name: string): Promise<Electron.Cookie[]>;
    /**
     * Get all the cookies that satisfy the filter request
     * @param filter
     */
    get(filter: Electron.Filter): Promise<Electron.Cookie[]>;
    /**
     * Set a cookie with name to a value
     * @param name
     * @param value
     */
    set(name: string, value: string): T;
    /**
     * Set a cookie by passing the Electron.Cookie object
     * @param cookie
     */
    set(cookie: Electron.Cookie): T;
    /**
     * Clear cookies on the current url by their name
     * @param name
     */
    clear(name: string): T;
    /**
     * clear all cookies at the current url
     */
    clear(): T;
    /**
     * Clear all the cookies
     */
    clearAll(): T;
}
