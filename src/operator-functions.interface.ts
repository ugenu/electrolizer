import { Cookies } from "./drivers/cookies.interface";

export interface OperatorFunctions<T> {
  goto(url: string, headers?: Record<string, string>): T;
  back(): T;
  forward(): T;
  refresh(): T;
  click(selector: string): T;
  mousedown(selector: string): T;
  mouseup(selector: string): T;
  mouseover(selector: string): T;
  mouseout(selector: string): T;
  type(selector: string, text?: string): T;
  insert(selector: string, text?: string): T;
  check(selector: string): T;
  uncheck(selector: string): T;
  select(selector: string, option?: string): T;
  scrollTo(top: number, left: number): T;
  viewport(width: number, height: number): T;
  inject(type: 'js' | 'css', file: string): T;
  evaluate<K>(fn: () => K, ...args: any[]): Promise<K>;
  wait(ms: number): T;
  wait(selector: string, ms?: number): T;
  wait(fn: () => boolean, ...args: any[]): T;
  header(header: string, value: string): T;
  html(): Promise<string>;
  exists(selector: string): Promise<boolean>;
  authentication(username: string, password: string): T;
  useragent(useragent: string): T;
  
  cookies: Cookies<T>
}