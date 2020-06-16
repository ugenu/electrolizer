import assert from 'assert'
import { LoadSpectron, Application } from '../helpers/load-spectron-app';

describe("Spectron Test", () => {
  let app: Application;

  beforeAll(async () => {
    app = await LoadSpectron();
  }, 20000);

  describe("simple test", () => {
    it('should work', async () => {
      await app.browserWindow.loadURL('https://www.npmjs.com/package/electron/v/6.1.12');
      await app.browserWindow.loadURL('https://github.com/nklayman/vue-cli-plugin-electron-builder/issues');
      console.log(await app.browserWindow.webContents.getURL());
    });
  });
});