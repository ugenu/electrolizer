# @ugenu.io/electrolizer - Automate a BrowserWindow, BrowserView, or <webview> tag

Automate browser interactions just like [Nightmare](https://github.com/segmentio/nightmare), but with an existing BrowserWindow, BrowserView, or <webview> tag. Written in TypeScript for your convenience!

* [Why](#why)
* [What makes Electrolizer different?](#what-makes)
  * [Example](#example-1)
* [Usage](#usage)
* [Detailed Docs](#detailed-docs)
* [Events](#events)
* [Security](#security)
* [Special Thanks](#special-thanks)
* [License](#license)

## Why?
Having faced the difficulty of trying to integrate a Nightmare instance inside a running Electron application, it was time something had to be done. 

While Nightmare is an absolute treasure and we thank the team for developing and supporting it, there were a few issues that we attempted to address while making this project.

- the Nightmare object leverages Promise functionality, while not actually creating a promise. 
- Nightmare uses an old Electron version which clashes with modern versions if you are trying to integrate them both. Hacks / workarounds can be frustrating. 
- Nightmare uses a preload script to communicate with the main process and renderer. While not likely, a cunning developer looking to thwart bots, can nullify the window.__nightmare object or the IPC send function.

## What makes Electrolizer different?
With a Nightmare process, you start the interaction queue by calling `.then()`. With electrolizer, you call `.run()`. Exceptions to this rule are when you are returning a value or response, eg. `.evaluate()`, `.exists(selector)`, `.html()`, .etc. In these cases, the queue is ran and then the value is returned. We find this to be a better fit for everyday use, and also lets us be consice with TypeScript typings.

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

console.log(response);
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
First, you must instantiate your browser `bus`, be it a BrowserWindow, BrowserView, or <webview> tag.

```ts
  let bus = new BrowserWindow({...options});
  let electrolizer = new Electrolizer(bus);
```

And now you're ready to automate! Refer to [Nightmare docs](https://github.com/segmentio/nightmare) for general use, keeping in mind we use `.run()` to perform the queue. 

## Detailed Docs
We humbly thank [Nightmare](https://github.com/segmentio/nightmare) for providing the documentation listed here.

#### .goto(url[, headers]): Electrolizer

Loads the page at `url`. Optionally, a `headers` hash can be supplied to set headers on the `goto` request.

If the page load fails, Electrolizer will throw an error that contains the following:

* `message`: A string describing the type of error
* `code`: The underlying error code describing what went wrong. Note this is NOT the HTTP status code. For possible values, see https://code.google.com/p/chromium/codesearch#chromium/src/net/base/net_error_list.h
* `details`: A string with additional details about the error. This may be null or an empty string.
* `url`: The URL that failed to load

Note that any valid response from a server is considered “successful.” That means things like 404 “not found” errors are successful results for `goto`. Only things that would cause no page to appear in the browser window, such as no server responding at the given address, the server hanging up in the middle of a response, or invalid URLs, are errors.


#### .back(): Electrolizer

Goes back to the previous page.

#### .forward(): Electrolizer

Goes forward to the next page.

#### .refresh(): Electrolizer

Refreshes the current page.

#### .click(selector): Electrolizer

Clicks the `selector` element once.

#### .mousedown(selector): Electrolizer

Mousedowns the `selector` element once.

#### .mouseup(selector): Electrolizer

Mouseups the `selector` element once.

#### .mouseover(selector): Electrolizer

Mouseovers the `selector` element once.

#### .mouseout(selector): Electrolizer

Mouseout the `selector` element once.

#### .type(selector[, text]): Electrolizer

Enters the `text` provided into the `selector` element. Empty or falsey values provided for `text` will clear the selector's value.

`.type()` mimics a user typing in a textbox and will emit the proper keyboard events.

Key presses can also be fired using Unicode values with `.type()`. For example, if you wanted to fire an enter key press, you would write `.type('body', '\u000d')`.

> If you don't need the keyboard events, consider using `.insert()` instead as it will be faster and more robust.

#### .insert(selector[, text]): Electrolizer

Similar to `.type()`, `.insert()` enters the `text` provided into the `selector` element. Empty or falsey values provided for `text` will clear the selector's value.

`.insert()` is faster than `.type()` but does not trigger the keyboard events.

#### .check(selector): Electrolizer

Checks the `selector` checkbox element.

#### .uncheck(selector): Electrolizer

Unchecks the `selector` checkbox element.

#### .select(selector, option): Electrolizer

Changes the `selector` dropdown element to the option with attribute [value=`option`]

#### .scrollTo(top, left): Electrolizer

Scrolls the page to desired position. `top` and `left` are always relative to the top left corner of the document.

#### .viewport(width, height): Electrolizer

Sets the viewport size.

#### .inject(type, file): Electrolizer

Injects a local `file` onto the current page. The file `type` must be either `js` or `css`.

#### .evaluate(fn[, arg1, arg2,...]) : Promise<any>

Invokes `fn` on the page with `arg1, arg2,...`. All the `args` are optional. On completion it returns the return value of `fn`. Useful for extracting information from the page. Here's an example:

```js
const selector = 'h1'
let h1Text = await electrolizer
  .evaluate(selector => {
    // now we're executing inside the browser scope.
    return document.querySelector(selector).innerText
  }, selector) // <-- that's how you pass parameters from Node scope to browser scope
```

The evaluate function must be either synchronous or async/Promise. Callback functions are not supported at this time.

***Important***: Evaluating inside the page runs the queue, or any interactions you have called before the function is evaluated inside the page. Do NOT call `.run()` if you are going to use `.evaluate()`.


#### .wait(ms): Electrolizer

Waits for `ms` milliseconds e.g. `.wait(5000)`.

#### .wait(selector): Electrolizer

Waits until the element `selector` is present e.g. `.wait('#pay-button')`.

#### .wait(fn[, arg1, arg2,...]): Electrolizer

Waits until the `fn` evaluated on the page with `arg1, arg2,...` returns `true`. All the `args` are optional. See `.evaluate()` for usage.

#### .header(header, value): Electrolizer

Adds a header override for all HTTP requests. If `header` is undefined, the header overrides will be reset.

### Extract from the Page

#### .exists(selector): Promise<boolean>

Returns whether the selector exists or not on the page.

***Important***: Calling this function will run the queue and then return the Promise that will resolve the result. Do NOT call `.run()` after calling `.exists()`

#### .visible(selector): Promise<boolean>

Returns whether the selector is visible or not.

***Important***: Calling this function will run the queue and then return the Promise that will resolve the result. Do NOT call `.run()` after calling `.visible()`

#### .screenshot(clip?: Electron.Rectangle, options?: Electron.toPNGOptions): Promise<Buffer>

Takes a screenshot of the current page. Useful for debugging. Always returns the buffer of the PNG.

[Electron.Rectangle](https://www.electronjs.org/docs/api/structures/rectangle)
[Electron.toPNGOptions](https://www.electronjs.org/docs/api/native-image#imagetopngoptions)

***Important***: Calling this function will run the queue and then return the Promise that will resolve the result. Do NOT call `.run()` after calling `.screenshot()`


#### .html(): Promise<string>

Returns the current html of the webpage.

***Important***: Calling this function will run the queue and then return the Promise that will resolve the result. Do NOT call `.run()` after calling `.html()`

#### .pdf(options?: Electron.PrintToPDFOptions): Promise<Buffer>

Generates a pdf of the current page and returns that as a buffer.

[Electron.PrintToPDFOptions](https://www.electronjs.org/docs/api/web-contents#contentsprinttopdfoptions)

***Important***: Calling this function will run the queue and then return the Promise that will resolve the result. Do NOT call `.run()` after calling `.pdf()`

#### .title(): Promise<string>

Returns the title of the current page.

***Important***: Calling this function will run the queue and then return the Promise that will resolve the result. Do NOT call `.run()` after calling `.title()`

#### .url(): Promise<string>

Returns the url of the current page.

***Important***: Calling this function will run the queue and then return the Promise that will resolve the result. Do NOT call `.run()` after calling `.url()`

#### .path(): Promise<string>

Returns the path name of the current page.

***Important***: Calling this function will run the queue and then return the Promise that will resolve the result. Do NOT call `.run()` after calling `.path()`

### Cookies

[Electron.Cookie](https://www.electronjs.org/docs/api/structures/cookie)

#### .cookies.get(name): Promise<Electron.Cookie[]>

Gets a cookie by it's `name`. The url will be the current url.

#### .cookies.get(query: Electron.Filter): Promise<Electron.Cookie[]>

Queries multiple cookies with the `query` object. If a `query.name` is set, it will return the first cookie it finds with that name, otherwise it will query for an array of cookies. If no `query.url` is set, it will use the current url. Here's an example:

[Electron.Filter](https://www.electronjs.org/docs/api/cookies#cookiesgetfilter)

```js
// get all google cookies that are secure
// and have the path `/query`
let cookies = await electrolizer
  .goto('http://google.com')
  .cookies.get({
    path: '/query',
    secure: true
  })
```

Available properties are documented here: https://github.com/atom/electron/blob/master/docs/api/session.md#sescookiesgetdetails-callback

#### .cookies.get(): Promise<Electron.Cookie[]>

Gets all the cookies for the current url. If you'd like get all cookies for all urls, use: `.get({ url: null })`.

#### .cookies.set(name, value): Electrolizer

Sets a cookie's `name` and `value`. This is the most basic form, and the url will be the current url.

#### .cookies.set(cookie): Electrolizer

Sets a `cookie`. If `cookie.url` is not set, it will set the cookie on the current url. Here's an example:

```js
electrolizer
  .goto('http://google.com')
  .cookies.set({
    name: 'token',
    value: 'some token',
    path: '/query',
    secure: true
  })
  .run()
```

Available properties are documented here: https://github.com/atom/electron/blob/master/docs/api/session.md#sescookiessetdetails-callback

#### .cookies.set(cookies): Electrolizer

Sets multiple cookies at once. `cookies` is an array of `cookie` objects. Take a look at the `.cookies.set(cookie)` documentation above for a better idea of what `cookie` should look like.

#### .cookies.clear([name]): Electrolizer

Clears a cookie for the current domain. If `name` is not specified, all cookies for the current domain will be cleared.

```js
electrolizer
  .goto('http://google.com')
  .cookies.clear('SomeCookieName')
  // ... other actions ...
  .run()
```

#### .cookies.clearAll(): Electrolizer

Clears all cookies for all domains.

```js
electrolizer
  .goto('http://google.com')
  .cookies.clearAll()
  // ... other actions ...
  .run()
```

## Events
You handle 'em! Since you have control over the `bus`, you can hook onto any event that you desire.

| Bus Type                  | Events Documentation                                                                       |
|---------------------------|--------------------------------------------------------------------------------------------|
| BrowserWindow.webContents | [webContents Events](https://www.electronjs.org/docs/api/web-contents#instance-events)     |
| BrowserView.webContents   | [webContents Events](  https://www.electronjs.org/docs/api/web-contents#instance-events  ) |
| <webview>           | [DOM-Events](https://www.electronjs.org/docs/api/webview-tag#dom-events)                   |

## Tests
Electrolizer was tested with a BrowserWindow, and utilizing the same suite of tests that Nightmare does. 
***Still a work in progress***

## Security
The architecture of Electrolizer does not require any preload scripts or anything that jeopardizes the general security that [Electron uses by default](https://github.com/electron/electron/blob/master/docs/tutorial/security.md). Still, it is wise to follow best practices and your best judgement. Electron is a powerful tool in the hands of hackers, but not if we all work together!

## Special Thanks
- [Nightmare](https://github.com/segmentio/nightmare) - an invaluable source of inspiration and quality code
- [@jest-runner/electron](https://github.com/facebook-atom/jest-electron-runner) - for making sane testing possible

## License
```
WWWWWW||WWWWWW
 W W W||W W W
      ||
    ( OO )__________
     /  |           \
    /o o|    MIT     \
    \___/||_||__||_|| *
         || ||  || ||
        _||_|| _||_||
       (__|__|(__|__|
```

Copyright (c) 2020 ugenu.io

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
