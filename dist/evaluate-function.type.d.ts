/**
 * from https://stackoverflow.com/a/58547161
 * THANK YOU
 */
declare type Cons<H, T extends readonly any[]> = ((head: H, ...tail: T) => void) extends ((...cons: infer R) => void) ? R : never;
export declare type Push<T extends readonly any[], V> = T extends any ? Cons<void, T> extends infer U ? {
    [K in keyof U]: K extends keyof T ? T[K] : V;
} : never : never;
export declare function evals<T, K extends any[], R>(fn: (...args: Push<K, T>) => R, ...args: K): Promise<R>;
export {};
