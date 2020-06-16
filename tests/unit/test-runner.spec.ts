import assert from 'assert';
import { BrowserWindow } from 'electron';

describe("something", () => {
  it('should have a window', async () => {
    let window = new BrowserWindow({
      x: 0,
      y: 0,
      width: 1000,
      height: 1000,
      show: true
    });

    await window.loadURL('https://google.com');
    console.log(window.webContents.getURL());
  });
});