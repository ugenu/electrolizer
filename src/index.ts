import { BrowserWindow, BrowserView, WebviewTag } from 'electron'

export { Electrolizer, Electrolizer as default } from './electrolizer.class'
export type ElectrolizerBus = BrowserWindow | BrowserView | WebviewTag