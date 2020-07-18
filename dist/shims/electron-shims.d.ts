/**
 * This is where type definitions for electron will be copied over for typescript typings
 * It appears that loading electron in the capacity for testing for which browser bus causes issues
 * Truthfully we need only a few methods for the BrowserWindow, BrowserView, and <webview>
 */
export declare namespace ElectronShims {
    interface WebContentsLike extends Electron.WebContents {
    }
    interface BrowserWindowViewLike {
        webContents: WebContentsLike;
    }
    interface WebviewTagLike extends Electron.WebviewTag {
    }
    interface Cookie extends Electron.Cookie {
    }
}
