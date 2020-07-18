import { Driver } from "./driver.class";
import { ElectronShims } from '../shims/electron-shims';

export default class BrowserViewDriver extends Driver<ElectronShims.BrowserWindowViewLike> {}