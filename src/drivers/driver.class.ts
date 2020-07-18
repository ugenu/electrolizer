import { ElectronShims } from '../shims/electron-shims';
import { OperatorFunctions } from '../operator-functions.interface';
import { Push } from '../evaluate-function.type';
import { execute, inject } from '../javascript.template';
import { ElectrolizerType } from '../electrolizer.class';
import { delay } from '../utils/delay.function';
import { promises } from 'fs';
import { Cookies } from './cookies.class';

export class Driver<T extends ElectronShims.BrowserWindowViewLike | ElectronShims.WebviewTagLike> implements OperatorFunctions<void> {

  cookies = new Cookies(this.webContents);

  private headers: Record<string, string> = {};

  constructor(protected bus: T, protected busType: ElectrolizerType){}

  get webContents(): ElectronShims.WebContentsLike {
    switch(this.busType){
      case ElectrolizerType.webview:
        //@ts-ignore
        return (this.bus as ElectronShims.WebviewTagLike)
    }

    return (this.bus as ElectronShims.BrowserWindowViewLike).webContents;
  }

  
  private async _inject(fn: string): Promise<void> {
    let _args = Array.prototype.slice.call(arguments).slice(1).map(argument => {
      return { argument: JSON.stringify(argument) }
    });

    let stringFn = String(fn);
    let source = inject({fn: stringFn, args: _args });

    return await this.webContents.executeJavaScript(source, true);
  }

  
  private async evaluate_now<T, K extends any[], R>(fn: (...args: Push<K, T>) => R, ...args: K): Promise<R> {
    let _args = Array.prototype.slice.call(arguments).slice(1).map(argument => {
      return { argument: JSON.stringify(argument) }
    });

    let stringFn = String(fn);
    let source = execute({fn: stringFn, args: _args });

    return await this.webContents.executeJavaScript(source, true);
  }

  
  async goto(url: string, headers?: Record<string, string>): Promise<void> {
    if(!url){ throw new Error('url must be defined'); }

    let extraHeaders: string = "";
    let httpReferrer: string = "";

    let usingHeaders: Record<string, string> = {
      ...this.headers,
      ...headers,
    };

    for(let header in usingHeaders){
      if(header.toLowerCase() === 'referer'){
        httpReferrer = usingHeaders[header];
        continue;
      }

      extraHeaders += header + ': ' + usingHeaders[header] + "\n"
    }

    await this.webContents.loadURL(url, {
      extraHeaders,
      httpReferrer
    });
  }

  
  async back(): Promise<void> {
    this.webContents.goBack();
  }

  async forward(): Promise<void> {
    this.webContents.goForward();
  }

  async refresh(): Promise<void> {
    this.webContents.reload();
  }

  async click(selector: string): Promise<void> {
    return this.evaluate_now((selector) => {
      //@ts-ignore
      document.activeElement.blur()
      var element = document.querySelector(selector)
      if (!element) {
        throw new Error('Unable to find element by selector: ' + selector)
      }
      var bounding = element.getBoundingClientRect()
      var event = new MouseEvent('click', {
        //@ts-ignore
        view: document.window,
        bubbles: true,
        cancelable: true,
        clientX: bounding.left + bounding.width / 2,
        clientY: bounding.top + bounding.height / 2
      });

      element.dispatchEvent(event);
    }, selector);
  }

  async mousedown(selector: string): Promise<void> {
    await this.evaluate_now((selector) => {
      let element = document.querySelector(selector)
      if (!element) {
        throw new Error('Unable to find element by selector: ' + selector)
      }

      let bounding = element.getBoundingClientRect();

      let event = new MouseEvent('mousedown', {
        //@ts-ignore
        view: document.window,
        bubbles: true,
        cancelable: true,
        clientX: bounding.left + bounding.width / 2,
        clientY: bounding.top + bounding.height / 2
      });
      
      //@ts-ignore
      element.dispatchEvent(event)
    }, selector);
  }

  
  async exists(selctor: string): Promise<boolean> {
    return await this.evaluate_now((selector) => {
      let element = document.querySelector(selector);
      return element ? true : false;
    }, selctor);
  }

  async mouseup(selector: string): Promise<void> {
    await this.evaluate_now((selector) => {
      let element = document.querySelector(selector)
      if (!element) {
        throw new Error('Unable to find element by selector: ' + selector)
      }

      let bounding = element.getBoundingClientRect();

      let event = new MouseEvent('mouseup', {
        //@ts-ignore
        view: document.window,
        bubbles: true,
        cancelable: true,
        clientX: bounding.left + bounding.width / 2,
        clientY: bounding.top + bounding.height / 2
      });
      
      //@ts-ignore
      element.dispatchEvent(event)
    }, selector);
  }
  
  async mouseover(selector: string): Promise<void> {
    await this.evaluate_now((selector) => {
      let element = document.querySelector(selector)
      if (!element) {
        throw new Error('Unable to find element by selector: ' + selector)
      }

      let bounding = element.getBoundingClientRect();

      let event = new MouseEvent('mouseover', {
        //@ts-ignore
        view: document.window,
        bubbles: true,
        cancelable: true,
        clientX: bounding.left + bounding.width / 2,
        clientY: bounding.top + bounding.height / 2
      });
      
      //@ts-ignore
      element.dispatchEvent(event)
    }, selector);
  }

  async mouseout(selector: string): Promise<void> {
    await this.evaluate_now((selector) => {
      let element = document.querySelector(selector)
      if (!element) {
        throw new Error('Unable to find element by selector: ' + selector)
      }
      let event = document.createEvent('MouseEvent')
      //@ts-ignore
      event.initMouseEvent('mouseout', true, true)
      element.dispatchEvent(event)
    }, selector);
  }

  async focus(selector: string): Promise<void> {
    return this.evaluate_now((selector) => {
      //@ts-ignore
      document.querySelector(selector).focus();
    }, selector);
  }

  async blur(selector: string): Promise<void> {
    return this.evaluate_now((selector) => {
      //@ts-ignore
      var element = document.querySelector(selector)
      if (element) {
        //@ts-ignore
        element.blur()
      }
    }, selector);
  }

  async type(selector: string, text?: string): Promise<void> {
    let chars = String(text).split('');

    let typeInterval = 250;

    await this.focus(selector);

    for(let char of chars){
      this.webContents.sendInputEvent({
        type: 'keyDown',
        //@ts-ignore
        keyCode: char,
      });

      this.webContents.sendInputEvent({
        type: 'char',
        //@ts-ignore
        keyCode: char,
      });

      this.webContents.sendInputEvent({
        type: 'keyUp',
        //@ts-ignore
        keyCode: char,
      });

      await delay(typeInterval);
    }

    await this.blur(selector);
  }

  
  async insert(selector: string, text?: string): Promise<void> {
    return await this.evaluate_now((selector, text) => {
      //@ts-ignore
      document.activeElement.blur()
      let element = document.querySelector(selector);

      if (!element) {
        throw new Error('Unable to find element by selector: ' + selector)
      }
      //@ts-ignore
      element.value = text ? text : '';
    }, selector, text);
  }

  
  async check(selector: string): Promise<void> {
    await this.evaluate_now((selector) => {
      let element = document.querySelector(selector);

      if (!element) {
        throw new Error('Unable to find element by selector: ' + selector)
      }

      let event = document.createEvent('HTMLEvents');
      (element as HTMLInputElement).checked = true;
      event.initEvent('change', true, true);
      element.dispatchEvent(event);
    }, selector);
  }

  
  async uncheck(selector: string): Promise<void> {
    this.evaluate_now((selector) => {
      let element = document.querySelector(selector);
      if (!element) {
        throw new Error('Unable to find element by selector: ' + selector)
      }
      let event = document.createEvent('HTMLEvents');
      (element as HTMLInputElement).checked = false;
      event.initEvent('change', true, true);
      element.dispatchEvent(event);
    }, selector);
  }


  async select(selector: string, option?: string): Promise<void> {
    this.evaluate_now((selector) => {
      let element = document.querySelector(selector);
      if (!element) {
        throw new Error('Unable to find element by selector: ' + selector)
      }
      let event = document.createEvent('HTMLEvents');
      (element as HTMLInputElement).value = option ? option : '';
      event.initEvent('change', true, true);
      element.dispatchEvent(event);
    }, selector);
  }

  async scrollTo(top: number, left: number): Promise<void> {
    await this.evaluate_now((top, left) => {
      window.scrollTo({ top, left });
    }, top, left);
  }

  async html(): Promise<string> {
    return this.evaluate_now(() => {
      return document.documentElement.outerHTML
    });
  }

  async viewport(width: number, height: number): Promise<void> {
    switch(this.busType){
      case ElectrolizerType.webview:
        return;
      case ElectrolizerType.browserView:
        let bvbux = this.bus as ElectronShims.BrowserWindowViewLike;
        //@ts-ignore
        let bounds = bvbux.getBounds() as Electron.Rectangle;
        //@ts-ignore
        bvbux.setBounds({
          ...bounds,
          width,
          height
        })
        return;
      case ElectrolizerType.browserWindow:
        //@ts-ignore
        (this.bus as (ElectronShims.BrowserWindowViewLike)).setSize(width, height);
        return;
    }
  }

  async inject(type: 'js' | 'css', file: string): Promise<void> {
    let contents = await promises.readFile(file, { encoding: 'utf-8' }) as string;
    switch(type){
      case 'js':
        await this._inject(contents);
        break;
      case 'css':
        this.webContents.insertCSS(contents);
        break;
    }
  }

  async evaluate<T, K extends any[], R>(fn: (...args: Push<K, T>) => R, ...args: K): Promise<R> {
    return this.evaluate_now(fn, ...args);
  }
  
  private retry(fn: () => Promise<Boolean>, timeout: number, softTimeout?: number): () => Promise<void> {
    let error: Error | undefined = undefined;
    let running: boolean = true;

    let runner = async () => {

      setTimeout(() => { 
        running = false; 
        error = new Error('timed out');
      }, softTimeout ? softTimeout : timeout);

      while(running){
        try {
          let result = await fn();
          
          if(result){ running = false; }
  
        } catch (_error){
          running = false;
          error = _error;
        }
      }
  
      if(error){
        if(!softTimeout){
          throw error;
        }
      }
    };

    return runner;
  }

  async wait(ms: number): Promise<void>
  async wait(selector: string, msDelay?: number): Promise<void> 
  async wait<T, K extends any[]>(fn: (...args: Push<K, T>) => boolean  | Promise<boolean>, ...args: K): Promise<void>
  async wait(): Promise<void> {
    let block: () => Promise<void>;

    let errorTimeout = 30000;

    switch(typeof arguments[0]){
      case "number":
        block = delay.bind(null, arguments[0]);
        break;
      case "string":
        block = this.retry(() => this.exists(arguments[0]), errorTimeout, arguments[1]);
        break;
      case "function":
        //@ts-ignore
        block = this.retry(() => this.evaluate.apply(this, arguments), errorTimeout);
      default:
        block = async () => {};
        break;
    }

    await block();
  }

  async url(): Promise<string> {
    return this.webContents.getURL();
  }

  async path(): Promise<string> {
    return await this.evaluate_now(() => document.location.pathname);
  }

  async title(): Promise<string> {
    return await this.evaluate_now(() => document.title);
  }

  async pdf(options?: Electron.PrintToPDFOptions): Promise<Buffer> {
    let opt: Electron.PrintToPDFOptions = {
      marginsType: 0,
      printBackground: true,
      printSelectionOnly: false,
      landscape: false,
      ...options,
    };

    return await this.webContents.printToPDF(opt);
  }

  async screenshot(rect?: Electron.Rectangle, options?: Electron.ToPNGOptions): Promise<Buffer> {
    let capture = await this.webContents.capturePage(rect);
    return capture.toPNG(options);
  }
  
  async header(header?: string, value?: string): Promise<void> {
    if(typeof header === "string" && typeof value !== "undefined"){
      this.headers[header] = value;
    } else {
      this.headers = {};
    }
  }

  async useragent(useragent: string): Promise<void> {
    this.webContents.setUserAgent(useragent);
  }
  
  private loginEventListener : (event: Electron.Event, request: Electron.Request, authInfo: Electron.AuthInfo, callback: (username: string, password: string) => void) => void = () => {}

  async authentication(username: string, password: string){
    let attempts = 0;
    let currentURL = "";

    this.webContents.removeListener('login', this.loginEventListener);

    return await new Promise<void>((resolve, reject) => {
      this.loginEventListener = (event, request, authInfo, callback) => {
        if(currentURL !== request.url){
          attempts = 1;
        }

        if(attempts >= 4){
          // need to handle error;
          this.webContents.removeListener('login', this.loginEventListener);
          return callback(username, password);
        }

        return callback(username, password);
      };

      this.webContents.on('login', this.loginEventListener);

      return resolve();
    });
  }
}