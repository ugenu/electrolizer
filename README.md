# @ugenu.io/electrolizer - Automate a BrowserWindow, BrowserView, or &lt;webview&gt; tag

Automate browser interactions just like [Nightmare](https://github.com/segmentio/nightmare), but with an existing BrowserWindow, BrowserView, or &lt;webview&gt; tag

## Why?
Having faced the difficulty of trying to integrate a Nightmare instance inside a running Electron application, it was time something had to be done. 

While Nightmare is an absolute treasure and we thank the team for developing and supporting it, there were a few issues that we attempted to address while making this project.

- the Nightmare object leverages Promise functionality, while not actually creating a promise. 
- Nightmare uses an old Electron version which clashes with modern versions if you are trying to integrate them both. Hacks / workarounds can be frustrating. 
- Nightmare uses a preload script to communicate with the main process and renderer. While not likely, a cunning developer looking to thwart bots, can nullify the window.__nightmare object or the IPC send function.

## What makes Electrolizer different?
With a Nightmare process, you start the interaction queue by calling `.then()`. With electrolizer, you call `.run()`. Exceptions to this rule are when you are returning a value or response, eg. `.evaluate()`, `.exists(selector)`, `.html()`. In these cases, the queue is ran and then the value is returned. We find this to be a better fit for everyday use, and also lets us be consice with TypeScript typings.

### Example
Nightmare example:
```js
nightmare
  .goto('https://duckduckgo.com')
  .type('#search_form_input_homepage', 'github nightmare')
  .click('#search_button_homepage')
  .wait('#r1-0 a.result__a')
  .evaluate(() => document.querySelector('#r1-0 a.result__a').href)
  .end()
  .then(console.log)
  .catch(error => {
    console.error('Search failed:', error)
  })
```

Electrolizer sample:
```ts
let response = await electrolizer
  .goto('https://duckduckgo.com')
  .type('#search_form_input_homepage', 'github nightmare')
  .click('#search_button_homepage')
  .wait('#r1-0 a.result__a')
  .evaluate(() => document.querySelector('#r1-0 a.result__a').href)
```

Electrolizer sample with `.run()`:
```ts
  await electrolizer
    .goto('https://www.startpage.com/')
    .wait('#query')
    .type('#query', 'butter')
    .click('.search-form__button')
    .wait('.w-gl--default .w-gl__result')
    /** any other actions, maybe click next page */
    .run();
```

## Usage
First, you must instantiate your browser `bus`, be it a BrowserWindow, BrowserView, or &lt;webview&gt; tag.

```ts
  let bus = new BrowserWindow({...options});
  let electrolizer = new Electrolizer(bus);
```

And now you're ready to automate! Refer to [Nightmare docs](https://github.com/segmentio/nightmare) for general use, keeping in mind we use `.run()` to perform the queue. Don't worry, these docs will be updated to include the interaction methods here.

## Events
You handle 'em! Since you have control over the `bus`, you can hook onto any event that you desire.
| Bus Type                  | Events Documentation                                                                       |
|---------------------------|--------------------------------------------------------------------------------------------|
| BrowserWindow.webContents | [webContents Events](https://www.electronjs.org/docs/api/web-contents#instance-events)     |
| BrowserView.webContents   | [webContents Events](  https://www.electronjs.org/docs/api/web-contents#instance-events  ) |
| &lt;webview&gt;           | [DOM-Events](https://www.electronjs.org/docs/api/webview-tag#dom-events)                   |

## Tests
Electrolizer was tested with a BrowserWindow, and utilizing the same suite of tests that Nightmare does. 
***Still a work in progress***

## Security
The architecture of Electrolizer does not require any preload scripts or anything that jeopardizes the general security that [Electron uses by default](https://github.com/electron/electron/blob/master/docs/tutorial/security.md). Still, it is wise to follow best practices and your best judgement. Electron is a powerful tool in the hands of hackers, but not if we all work together!

## Special Thanks
- [Nightmare](https://github.com/segmentio/nightmare) - an invaluable source of inspiration and quality code
- [@jest-runner/electron](https://github.com/facebook-atom/jest-electron-runner) - for making sane testing possible