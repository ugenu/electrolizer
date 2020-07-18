/**
 * This is where type definitions for electron will be copied over for typescript typings
 * It appears that loading electron in the capacity for testing for which browser bus causes issues
 * Truthfully we need only a few methods for the BrowserWindow, BrowserView, and <webview>
 */

 import { WebContents, Cookie } from "electron";

export namespace ElectronShims {
  export interface WebContentsLike extends Electron.WebContents {

  }

  export interface BrowserWindowViewLike {
    webContents: WebContentsLike
  }

  export interface WebviewTagLike extends WebContentsLike {}

  export interface Cookie extends Electron.Cookie {}
}