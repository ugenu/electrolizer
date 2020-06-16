import { Application, AppConstructorOptions } from 'spectron';
import electronPath from 'electron';
import electronLoader from './electron-loader';
import { writeFile } from 'fs';
import { join } from 'path';

export async function LoadSpectron(options?: AppConstructorOptions): Promise<Application> {
  let app: Application;
  let appOptions: AppConstructorOptions = {
    ...options,
    //@ts-ignore
    path: electronPath,
    args: [
      electronLoader
    ]
  };

  app = new Application(appOptions);

  await app.start();

  await app.client.waitUntilWindowLoaded();

  if(!app.browserWindow.webContents){
    app.browserWindow.webContents = app.webContents;
  }

  return app;
}

export {
  Application
}