import { WebContents } from "electron";
import { Cookies as ICookies } from './cookies.interface';

export class Cookies implements ICookies<Promise<void>> {
  constructor(protected webContents: WebContents){}

  async get(): Promise<Electron.Cookie[]>
  async get(name: string): Promise<Electron.Cookie[]>;
  async get(filter: Electron.Filter): Promise<Electron.Cookie[]>;
  async get(): Promise<Electron.Cookie[]> {
    let arg = arguments[0];

    let filter: Electron.Filter = {};

    if(typeof arg === "string"){
      filter.name = arg;
    }
    
    filter.url = this.webContents.getURL();

    if(typeof arg === "object") {
      filter = arg;
    }

    return await this.webContents.session.cookies.get(filter);
  }

  async set(name: string, value: string): Promise<void>
  async set(cookie: Electron.Cookie): Promise<void>
  async set(): Promise<void> {

    let details: Electron.Details = {
      url: this.webContents.getURL()
    };

    if(typeof arguments[0] === "string"){
      details.name = arguments[0];
      details.value = arguments[1] ? arguments[1] : undefined;
    } else {
      details = {
        ...arguments[0]
      }
    }

    await this.webContents.session.cookies.set(details);
  }

  async clear(name?: string): Promise<void> {
    let details: Electron.Details = {
      url: this.webContents.getURL(),
      name
    };

    let cookies = await this.get(details);

    for(let cookie of cookies) {
      await this.webContents.session.cookies.remove(details.url, cookie.name);
    }
  }

  async clearAll(): Promise<void> {
    this.webContents.session.clearStorageData({
      storages: ['cookies']
    });
  }
}