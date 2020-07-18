import { ElectronShims } from './shims/electron-shims';

export { Electrolizer, Electrolizer as default } from './electrolizer.class'
export type ElectrolizerBus = ElectronShims.BrowserWindowViewLike | ElectronShims.WebviewTagLike