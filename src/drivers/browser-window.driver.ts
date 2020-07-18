import { Driver } from "./driver.class";
import { ElectronShims } from '../shims/electron-shims';

export default class BrowserWindowDriver extends Driver<ElectronShims.BrowserWindowViewLike> {}