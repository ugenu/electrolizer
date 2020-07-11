import { BrowserView, BrowserWindow, WebviewTag, WebContents } from 'electron';
import { OperatorFunctions } from './operator-functions.interface';
import { WebviewTagDriver, BrowserViewDriver, BrowserWindowDriver } from './drivers';
import { Push } from './evaluate-function.type';
import { Cookies } from './drivers/cookies.interface';

export enum ElectrolizerType {
  webview = 'webview',
  browserView = 'browserView',
  browserWindow = 'browserWindow'
}


export class Electrolizer<T extends WebviewTag | BrowserView | BrowserWindow> implements OperatorFunctions<Electrolizer<T>> {

  interactionReady: boolean = false;

  queue: (() => Promise<any>)[] = [];

  driver!: WebviewTagDriver | BrowserWindowDriver | BrowserViewDriver;

  constructor(protected bus: T){
    this.setupDriver();
  }

  cookies: Cookies<Electrolizer<T>> = {
    clearAll: () => { 
      this._queue( () => this.driver.cookies.clearAll() );
      return this;
    },
    get: (arg: any) => {
      return this.driver.cookies.get(arg)
    },
    set: (name: string | Electron.Cookie, value?: string) => {
      //@ts-ignore
      this._queue(() => this.driver.cookies.set(name, value));
      return this;
    },
    clear: (name?: string) => {
      this._queue(() => this.driver.cookies.clear(name));
      return this;
    },
  }

  
  private setupDriver(){
    switch(this.busType){
      case ElectrolizerType.webview:
        this.driver = new WebviewTagDriver(this.bus as WebviewTag);
      break;
      
      case ElectrolizerType.browserWindow:
        this.driver = new BrowserWindowDriver(this.bus as BrowserWindow);
      break;

      case ElectrolizerType.browserView:
        this.driver = new BrowserViewDriver(this.bus as BrowserView);
        break;
    }
  }

  
  get busType(): ElectrolizerType {
    try {
      let instanceOfTest = this.bus instanceof BrowserView;
    } catch(error){
      return ElectrolizerType.webview;
    }

    if(this.bus instanceof BrowserView){
      return ElectrolizerType.browserView;
    }

    if(this.bus instanceof BrowserWindow){
      return ElectrolizerType.browserWindow;
    }

    return ElectrolizerType.webview;
  }
  
  private _queue(fn: () => Promise<any>){
    this.queue.push(fn);
  }

  goto(url: string, headers?: Record<string, string>): Electrolizer<T> {
    this._queue(this.driver.goto.bind(this.driver, url, headers));
    return this;
  }

  back(): Electrolizer<T> {
    this._queue(this.driver.back.bind(this.driver));
    return this;
  }

  forward(): Electrolizer<T> {
    this._queue(this.driver.forward.bind(this.driver));
    return this;
  }

  refresh(): Electrolizer<T> {
    this._queue(this.driver.refresh.bind(this.driver));
    return this;
  }

  click(selector: string): Electrolizer<T> {
    this._queue(this.driver.click.bind(this.driver, selector));
    return this;
  }

  mousedown(selector: string): Electrolizer<T> {
    this._queue(this.driver.mousedown.bind(this.driver, selector));
    return this;
  }

  mouseup(selector: string): Electrolizer<T> {
    this._queue(this.driver.mouseup.bind(this.driver, selector));
    return this;
  }

  mouseover(selector: string): Electrolizer<T> {
    this._queue(this.driver.mouseover.bind(this.driver, selector));
    return this;
  }

  mouseout(selector: string): Electrolizer<T> {
    this._queue(this.driver.mouseout.bind(this.driver, selector));
    return this;
  }

  type(selector: string, text?: string): Electrolizer<T> {
    this._queue(this.driver.type.bind(this.driver, selector, text));
    return this;
  }

  insert(selector: string, text?: string): Electrolizer<T> {
    this._queue(this.driver.insert.bind(this.driver, selector, text));
    return this;
  }

  check(selector: string): Electrolizer<T> {
    this._queue(this.driver.check.bind(this.driver, selector));
    return this;
  }

  uncheck(selector: string): Electrolizer<T> {
    this._queue(this.driver.uncheck.bind(this.driver, selector));
    return this;
  }

  select(selector: string, option?: string): Electrolizer<T> {
    this._queue(this.driver.select.bind(this.driver, selector, option));
    return this;
  }

  scrollTo(top: number, left: number): Electrolizer<T> {
    this._queue(this.driver.scrollTo.bind(this.driver, top, left));
    return this;
  }

  viewport(width: number, height: number): Electrolizer<T> {
    this._queue(this.driver.viewport.bind(this.driver, width, height));
    return this;
  }

  inject(type: 'js' | 'css', file: string): Electrolizer<T> {
    this._queue(this.driver.inject.bind(this.driver, type, file));
    return this;
  }

  async exists(selector: string): Promise<boolean> {
    await this.run();
    return await this.driver.exists(selector);
  }

  async html(): Promise<string> {
    await this.run();
    return await this.driver.html();
  }

  async evaluate<T, K extends any[], R>(fn: (...args: Push<K, T>) => R, ...args: K): Promise<R> {
    await this.run();
    return this.driver.evaluate(fn, ...args);
  }

  wait(ms: number): Electrolizer<T>
  wait(selector: string, delay?: number): Electrolizer<T>
  wait<R, K extends any[]>(fn: (...args: Push<K, R>) => boolean | Promise<boolean> , ...args: K): Electrolizer<T>
  wait(): Electrolizer<T> {
    //@ts-ignore
    this._queue(() => this.driver.wait.apply(this.driver, arguments));
    return this;
  }

  header(header: string, value: string): Electrolizer<T> {
    return this;
  }

  authentication(username: string, password: string): Electrolizer<T> {
    this._queue(this.driver.authentication.bind(this.driver, username, password));
    return this;
  }

  useragent(useragent: string): Electrolizer<T> {
    this._queue(this.driver.useragent.bind(this.driver, useragent));
    return this;
  }

  async run(): Promise<void> {
    for(let block of this.queue){
      await block();
    }

    this.queue = [];
  }

  async end(): Promise<void> {
    this.run();
  }
}

export default Electrolizer;