"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Driver = void 0;

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _electron = require("electron");

var _javascript = require("../javascript.template");

var _electrolizer = require("../electrolizer.class");

var _delay = require("../utils/delay.function");

var _fs = require("fs");

var _cookies = require("./cookies.class");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

class Driver {
  constructor(bus) {
    this.bus = bus;
    (0, _defineProperty2.default)(this, "cookies", new _cookies.Cookies(this.webContents));
    (0, _defineProperty2.default)(this, "headers", {});
    (0, _defineProperty2.default)(this, "loginEventListener", () => {});
  }

  get busType() {
    try {
      var instanceOfTest = this.bus instanceof _electron.BrowserView;
    } catch (error) {
      return _electrolizer.ElectrolizerType.webview;
    }

    if (this.bus instanceof _electron.BrowserView) {
      return _electrolizer.ElectrolizerType.browserView;
    }

    if (this.bus instanceof _electron.BrowserWindow) {
      return _electrolizer.ElectrolizerType.browserWindow;
    }

    return _electrolizer.ElectrolizerType.webview;
  }

  get webContents() {
    switch (this.busType) {
      case _electrolizer.ElectrolizerType.webview:
        //@ts-ignore
        return this.bus;
    }

    return this.bus.webContents;
  }

  _inject(fn) {
    var _arguments = arguments,
        _this = this;

    return (0, _asyncToGenerator2.default)(function* () {
      var _args = Array.prototype.slice.call(_arguments).slice(1).map(argument => {
        return {
          argument: JSON.stringify(argument)
        };
      });

      var stringFn = String(fn);
      var source = (0, _javascript.inject)({
        fn: stringFn,
        args: _args
      });
      return yield _this.webContents.executeJavaScript(source, true);
    })();
  }

  evaluate_now(fn) {
    var _arguments2 = arguments,
        _this2 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      for (var _len = _arguments2.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = _arguments2[_key];
      }

      var _args = Array.prototype.slice.call(_arguments2).slice(1).map(argument => {
        return {
          argument: JSON.stringify(argument)
        };
      });

      var stringFn = String(fn);
      var source = (0, _javascript.execute)({
        fn: stringFn,
        args: _args
      });
      return yield _this2.webContents.executeJavaScript(source, true);
    })();
  }

  goto(url, headers) {
    var _this3 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      if (!url) {
        throw new Error('url must be defined');
      }

      var extraHeaders = "";
      var httpReferrer = "";

      var usingHeaders = _objectSpread(_objectSpread({}, _this3.headers), headers);

      for (var header in usingHeaders) {
        if (header.toLowerCase() === 'referer') {
          httpReferrer = usingHeaders[header];
          continue;
        }

        extraHeaders += header + ': ' + usingHeaders[header] + "\n";
      }

      yield _this3.webContents.loadURL(url, {
        extraHeaders,
        httpReferrer
      });
    })();
  }

  back() {
    var _this4 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      _this4.webContents.goBack();
    })();
  }

  forward() {
    var _this5 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      _this5.webContents.goForward();
    })();
  }

  refresh() {
    var _this6 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      _this6.webContents.reload();
    })();
  }

  click(selector) {
    var _this7 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      return _this7.evaluate_now(selector => {
        //@ts-ignore
        document.activeElement.blur();
        var element = document.querySelector(selector);

        if (!element) {
          throw new Error('Unable to find element by selector: ' + selector);
        }

        var bounding = element.getBoundingClientRect();
        var event = new MouseEvent('click', {
          //@ts-ignore
          view: document.window,
          bubbles: true,
          cancelable: true,
          clientX: bounding.left + bounding.width / 2,
          clientY: bounding.top + bounding.height / 2
        });
        element.dispatchEvent(event);
      }, selector);
    })();
  }

  mousedown(selector) {
    var _this8 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      yield _this8.evaluate_now(selector => {
        var element = document.querySelector(selector);

        if (!element) {
          throw new Error('Unable to find element by selector: ' + selector);
        }

        var bounding = element.getBoundingClientRect();
        var event = new MouseEvent('mousedown', {
          //@ts-ignore
          view: document.window,
          bubbles: true,
          cancelable: true,
          clientX: bounding.left + bounding.width / 2,
          clientY: bounding.top + bounding.height / 2
        }); //@ts-ignore

        element.dispatchEvent(event);
      }, selector);
    })();
  }

  exists(selctor) {
    var _this9 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      return yield _this9.evaluate_now(selector => {
        var element = document.querySelector(selector);
        return element ? true : false;
      }, selctor);
    })();
  }

  mouseup(selector) {
    var _this10 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      yield _this10.evaluate_now(selector => {
        var element = document.querySelector(selector);

        if (!element) {
          throw new Error('Unable to find element by selector: ' + selector);
        }

        var bounding = element.getBoundingClientRect();
        var event = new MouseEvent('mouseup', {
          //@ts-ignore
          view: document.window,
          bubbles: true,
          cancelable: true,
          clientX: bounding.left + bounding.width / 2,
          clientY: bounding.top + bounding.height / 2
        }); //@ts-ignore

        element.dispatchEvent(event);
      }, selector);
    })();
  }

  mouseover(selector) {
    var _this11 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      yield _this11.evaluate_now(selector => {
        var element = document.querySelector(selector);

        if (!element) {
          throw new Error('Unable to find element by selector: ' + selector);
        }

        var bounding = element.getBoundingClientRect();
        var event = new MouseEvent('mouseover', {
          //@ts-ignore
          view: document.window,
          bubbles: true,
          cancelable: true,
          clientX: bounding.left + bounding.width / 2,
          clientY: bounding.top + bounding.height / 2
        }); //@ts-ignore

        element.dispatchEvent(event);
      }, selector);
    })();
  }

  mouseout(selector) {
    var _this12 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      yield _this12.evaluate_now(selector => {
        var element = document.querySelector(selector);

        if (!element) {
          throw new Error('Unable to find element by selector: ' + selector);
        }

        var event = document.createEvent('MouseEvent'); //@ts-ignore

        event.initMouseEvent('mouseout', true, true);
        element.dispatchEvent(event);
      }, selector);
    })();
  }

  focus(selector) {
    var _this13 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      return _this13.evaluate_now(selector => {
        //@ts-ignore
        document.querySelector(selector).focus();
      }, selector);
    })();
  }

  blur(selector) {
    var _this14 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      return _this14.evaluate_now(selector => {
        //@ts-ignore
        var element = document.querySelector(selector);

        if (element) {
          //@ts-ignore
          element.blur();
        }
      }, selector);
    })();
  }

  type(selector, text) {
    var _this15 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      var chars = String(text).split('');
      var typeInterval = 250;
      yield _this15.focus(selector);

      for (var char of chars) {
        _this15.webContents.sendInputEvent({
          type: 'keyDown',
          //@ts-ignore
          keyCode: char
        });

        _this15.webContents.sendInputEvent({
          type: 'char',
          //@ts-ignore
          keyCode: char
        });

        _this15.webContents.sendInputEvent({
          type: 'keyUp',
          //@ts-ignore
          keyCode: char
        });

        yield (0, _delay.delay)(typeInterval);
      }

      yield _this15.blur(selector);
    })();
  }

  insert(selector, text) {
    var _this16 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      return yield _this16.evaluate_now((selector, text) => {
        //@ts-ignore
        document.activeElement.blur();
        var element = document.querySelector(selector);

        if (!element) {
          throw new Error('Unable to find element by selector: ' + selector);
        } //@ts-ignore


        element.value = text ? text : '';
      }, selector, text);
    })();
  }

  check(selector) {
    var _this17 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      yield _this17.evaluate_now(selector => {
        var element = document.querySelector(selector);

        if (!element) {
          throw new Error('Unable to find element by selector: ' + selector);
        }

        var event = document.createEvent('HTMLEvents');
        element.checked = true;
        event.initEvent('change', true, true);
        element.dispatchEvent(event);
      }, selector);
    })();
  }

  uncheck(selector) {
    var _this18 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      _this18.evaluate_now(selector => {
        var element = document.querySelector(selector);

        if (!element) {
          throw new Error('Unable to find element by selector: ' + selector);
        }

        var event = document.createEvent('HTMLEvents');
        element.checked = false;
        event.initEvent('change', true, true);
        element.dispatchEvent(event);
      }, selector);
    })();
  }

  select(selector, option) {
    var _this19 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      _this19.evaluate_now(selector => {
        var element = document.querySelector(selector);

        if (!element) {
          throw new Error('Unable to find element by selector: ' + selector);
        }

        var event = document.createEvent('HTMLEvents');
        element.value = option ? option : '';
        event.initEvent('change', true, true);
        element.dispatchEvent(event);
      }, selector);
    })();
  }

  scrollTo(top, left) {
    var _this20 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      yield _this20.evaluate_now((top, left) => {
        window.scrollTo({
          top,
          left
        });
      }, top, left);
    })();
  }

  html() {
    var _this21 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      return _this21.evaluate_now(() => {
        return document.documentElement.outerHTML;
      });
    })();
  }

  viewport(width, height) {
    var _this22 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      switch (_this22.busType) {
        case _electrolizer.ElectrolizerType.webview:
          return;

        case _electrolizer.ElectrolizerType.browserView:
          var bvbux = _this22.bus; //@ts-ignore

          var bounds = bvbux.getBounds();
          bvbux.setBounds(_objectSpread(_objectSpread({}, bounds), {}, {
            width,
            height
          }));
          return;

        case _electrolizer.ElectrolizerType.browserWindow:
          _this22.bus.setSize(width, height);

          return;
      }
    })();
  }

  inject(type, file) {
    var _this23 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      var contents = yield _fs.promises.readFile(file, {
        encoding: 'utf-8'
      });

      switch (type) {
        case 'js':
          yield _this23._inject(contents);
          break;

        case 'css':
          _this23.webContents.insertCSS(contents);

          break;
      }
    })();
  }

  evaluate(fn) {
    var _arguments3 = arguments,
        _this24 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      for (var _len2 = _arguments3.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = _arguments3[_key2];
      }

      return _this24.evaluate_now(fn, ...args);
    })();
  }

  retry(fn, timeout, softTimeout) {
    var error = undefined;
    var running = true;

    var runner = /*#__PURE__*/function () {
      var _ref = (0, _asyncToGenerator2.default)(function* () {
        setTimeout(() => {
          running = false;
          error = new Error('timed out');
        }, softTimeout ? softTimeout : timeout);

        while (running) {
          try {
            var result = yield fn();

            if (result) {
              running = false;
            }
          } catch (_error) {
            running = false;
            error = _error;
          }
        }

        if (error) {
          if (!softTimeout) {
            throw error;
          }
        }
      });

      return function runner() {
        return _ref.apply(this, arguments);
      };
    }();

    return runner;
  }

  wait() {
    var _arguments4 = arguments,
        _this25 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      var block;
      var errorTimeout = 30000;

      switch (typeof _arguments4[0]) {
        case "number":
          block = _delay.delay.bind(null, _arguments4[0]);
          break;

        case "string":
          block = _this25.retry(() => _this25.exists(_arguments4[0]), errorTimeout, _arguments4[1]);
          break;

        case "function":
          //@ts-ignore
          block = _this25.retry(() => _this25.evaluate.apply(_this25, _arguments4), errorTimeout);

        default:
          block = /*#__PURE__*/function () {
            var _ref2 = (0, _asyncToGenerator2.default)(function* () {});

            return function block() {
              return _ref2.apply(this, arguments);
            };
          }();

          break;
      }

      yield block();
    })();
  }

  url() {
    var _this26 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      return _this26.webContents.getURL();
    })();
  }

  path() {
    var _this27 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      return yield _this27.evaluate_now(() => document.location.pathname);
    })();
  }

  title() {
    var _this28 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      return yield _this28.evaluate_now(() => document.title);
    })();
  }

  pdf(options) {
    var _this29 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      var opt = _objectSpread({
        marginsType: 0,
        printBackground: true,
        printSelectionOnly: false,
        landscape: false
      }, options);

      return yield _this29.webContents.printToPDF(opt);
    })();
  }

  screenshot(rect, options) {
    var _this30 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      var capture = yield _this30.webContents.capturePage(rect);
      return capture.toPNG(options);
    })();
  }

  header(header, value) {
    var _this31 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      if (typeof header === "string" && typeof value !== "undefined") {
        _this31.headers[header] = value;
      } else {
        _this31.headers = {};
      }
    })();
  }

  useragent(useragent) {
    var _this32 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      _this32.webContents.setUserAgent(useragent);
    })();
  }

  authentication(username, password) {
    var _this33 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      var attempts = 0;
      var currentURL = "";

      _this33.webContents.removeListener('login', _this33.loginEventListener);

      return yield new Promise((resolve, reject) => {
        _this33.loginEventListener = (event, request, authInfo, callback) => {
          if (currentURL !== request.url) {
            attempts = 1;
          }

          if (attempts >= 4) {
            // need to handle error;
            _this33.webContents.removeListener('login', _this33.loginEventListener);

            return callback(username, password);
          }

          return callback(username, password);
        };

        _this33.webContents.on('login', _this33.loginEventListener);

        return resolve();
      });
    })();
  }

}

exports.Driver = Driver;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9kcml2ZXJzL2RyaXZlci5jbGFzcy50cyJdLCJuYW1lcyI6WyJEcml2ZXIiLCJjb25zdHJ1Y3RvciIsImJ1cyIsIkNvb2tpZXMiLCJ3ZWJDb250ZW50cyIsImJ1c1R5cGUiLCJpbnN0YW5jZU9mVGVzdCIsIkJyb3dzZXJWaWV3IiwiZXJyb3IiLCJFbGVjdHJvbGl6ZXJUeXBlIiwid2VidmlldyIsImJyb3dzZXJWaWV3IiwiQnJvd3NlcldpbmRvdyIsImJyb3dzZXJXaW5kb3ciLCJfaW5qZWN0IiwiZm4iLCJfYXJncyIsIkFycmF5IiwicHJvdG90eXBlIiwic2xpY2UiLCJjYWxsIiwiYXJndW1lbnRzIiwibWFwIiwiYXJndW1lbnQiLCJKU09OIiwic3RyaW5naWZ5Iiwic3RyaW5nRm4iLCJTdHJpbmciLCJzb3VyY2UiLCJhcmdzIiwiZXhlY3V0ZUphdmFTY3JpcHQiLCJldmFsdWF0ZV9ub3ciLCJnb3RvIiwidXJsIiwiaGVhZGVycyIsIkVycm9yIiwiZXh0cmFIZWFkZXJzIiwiaHR0cFJlZmVycmVyIiwidXNpbmdIZWFkZXJzIiwiaGVhZGVyIiwidG9Mb3dlckNhc2UiLCJsb2FkVVJMIiwiYmFjayIsImdvQmFjayIsImZvcndhcmQiLCJnb0ZvcndhcmQiLCJyZWZyZXNoIiwicmVsb2FkIiwiY2xpY2siLCJzZWxlY3RvciIsImRvY3VtZW50IiwiYWN0aXZlRWxlbWVudCIsImJsdXIiLCJlbGVtZW50IiwicXVlcnlTZWxlY3RvciIsImJvdW5kaW5nIiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwiZXZlbnQiLCJNb3VzZUV2ZW50IiwidmlldyIsIndpbmRvdyIsImJ1YmJsZXMiLCJjYW5jZWxhYmxlIiwiY2xpZW50WCIsImxlZnQiLCJ3aWR0aCIsImNsaWVudFkiLCJ0b3AiLCJoZWlnaHQiLCJkaXNwYXRjaEV2ZW50IiwibW91c2Vkb3duIiwiZXhpc3RzIiwic2VsY3RvciIsIm1vdXNldXAiLCJtb3VzZW92ZXIiLCJtb3VzZW91dCIsImNyZWF0ZUV2ZW50IiwiaW5pdE1vdXNlRXZlbnQiLCJmb2N1cyIsInR5cGUiLCJ0ZXh0IiwiY2hhcnMiLCJzcGxpdCIsInR5cGVJbnRlcnZhbCIsImNoYXIiLCJzZW5kSW5wdXRFdmVudCIsImtleUNvZGUiLCJpbnNlcnQiLCJ2YWx1ZSIsImNoZWNrIiwiY2hlY2tlZCIsImluaXRFdmVudCIsInVuY2hlY2siLCJzZWxlY3QiLCJvcHRpb24iLCJzY3JvbGxUbyIsImh0bWwiLCJkb2N1bWVudEVsZW1lbnQiLCJvdXRlckhUTUwiLCJ2aWV3cG9ydCIsImJ2YnV4IiwiYm91bmRzIiwiZ2V0Qm91bmRzIiwic2V0Qm91bmRzIiwic2V0U2l6ZSIsImluamVjdCIsImZpbGUiLCJjb250ZW50cyIsInByb21pc2VzIiwicmVhZEZpbGUiLCJlbmNvZGluZyIsImluc2VydENTUyIsImV2YWx1YXRlIiwicmV0cnkiLCJ0aW1lb3V0Iiwic29mdFRpbWVvdXQiLCJ1bmRlZmluZWQiLCJydW5uaW5nIiwicnVubmVyIiwic2V0VGltZW91dCIsInJlc3VsdCIsIl9lcnJvciIsIndhaXQiLCJibG9jayIsImVycm9yVGltZW91dCIsImRlbGF5IiwiYmluZCIsImFwcGx5IiwiZ2V0VVJMIiwicGF0aCIsImxvY2F0aW9uIiwicGF0aG5hbWUiLCJ0aXRsZSIsInBkZiIsIm9wdGlvbnMiLCJvcHQiLCJtYXJnaW5zVHlwZSIsInByaW50QmFja2dyb3VuZCIsInByaW50U2VsZWN0aW9uT25seSIsImxhbmRzY2FwZSIsInByaW50VG9QREYiLCJzY3JlZW5zaG90IiwicmVjdCIsImNhcHR1cmUiLCJjYXB0dXJlUGFnZSIsInRvUE5HIiwidXNlcmFnZW50Iiwic2V0VXNlckFnZW50IiwiYXV0aGVudGljYXRpb24iLCJ1c2VybmFtZSIsInBhc3N3b3JkIiwiYXR0ZW1wdHMiLCJjdXJyZW50VVJMIiwicmVtb3ZlTGlzdGVuZXIiLCJsb2dpbkV2ZW50TGlzdGVuZXIiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsInJlcXVlc3QiLCJhdXRoSW5m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LFFBQVEsQ0FBQ1gsUUFBRCxFQUFXQyxRQUFYLENBQWY7QUFDRDs7QUFFRCxpQkFBT1UsUUFBUSxDQUFDWCxRQUFELEVBQVdDLFFBQVgsQ0FBZjtBQUNELFNBWkQ7O0FBY0EsUUFBQSxPQUFJLENBQUNsSixXQUFMLENBQWlCNkosRUFBakIsQ0FBb0IsT0FBcEIsRUFBNkIsT0FBSSxDQUFDUCxrQkFBbEM7O0FBRUEsZUFBT0UsT0FBTyxFQUFkO0FBQ0QsT0FsQlksQ0FBYjtBQU5zRDtBQXlCdkQ7O0FBbGZ3RyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEJyb3dzZXJWaWV3LCBCcm93c2VyV2luZG93LCBXZWJ2aWV3VGFnLCBXZWJDb250ZW50cyB9IGZyb20gJ2VsZWN0cm9uJztcbmltcG9ydCB7IE9wZXJhdG9yRnVuY3Rpb25zIH0gZnJvbSAnLi4vb3BlcmF0b3ItZnVuY3Rpb25zLmludGVyZmFjZSc7XG5pbXBvcnQgeyBQdXNoIH0gZnJvbSAnLi4vZXZhbHVhdGUtZnVuY3Rpb24udHlwZSc7XG5pbXBvcnQgeyBleGVjdXRlLCBpbmplY3QgfSBmcm9tICcuLi9qYXZhc2NyaXB0LnRlbXBsYXRlJztcbmltcG9ydCB7IEVsZWN0cm9saXplclR5cGUgfSBmcm9tICcuLi9lbGVjdHJvbGl6ZXIuY2xhc3MnO1xuaW1wb3J0IHsgZGVsYXkgfSBmcm9tICcuLi91dGlscy9kZWxheS5mdW5jdGlvbic7XG5pbXBvcnQgeyBwcm9taXNlcyB9IGZyb20gJ2ZzJztcbmltcG9ydCB7IENvb2tpZXMgfSBmcm9tICcuL2Nvb2tpZXMuY2xhc3MnO1xuXG5leHBvcnQgY2xhc3MgRHJpdmVyPFQgZXh0ZW5kcyBXZWJ2aWV3VGFnIHwgQnJvd3NlclZpZXcgfCBCcm93c2VyV2luZG93PiBpbXBsZW1lbnRzIE9wZXJhdG9yRnVuY3Rpb25zPHZvaWQ+IHtcblxuICBjb29raWVzID0gbmV3IENvb2tpZXModGhpcy53ZWJDb250ZW50cyk7XG5cbiAgcHJpdmF0ZSBoZWFkZXJzOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge307XG5cbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIGJ1czogVCl7fVxuXG4gXG4gIGdldCBidXNUeXBlKCk6IEVsZWN0cm9saXplclR5cGUge1xuICAgIHRyeSB7XG4gICAgICBsZXQgaW5zdGFuY2VPZlRlc3QgPSB0aGlzLmJ1cyBpbnN0YW5jZW9mIEJyb3dzZXJWaWV3O1xuICAgIH0gY2F0Y2goZXJyb3Ipe1xuICAgICAgcmV0dXJuIEVsZWN0cm9saXplclR5cGUud2VidmlldztcbiAgICB9XG5cbiAgICBpZih0aGlzLmJ1cyBpbnN0YW5jZW9mIEJyb3dzZXJWaWV3KXtcbiAgICAgIHJldHVybiBFbGVjdHJvbGl6ZXJUeXBlLmJyb3dzZXJWaWV3O1xuICAgIH1cblxuICAgIGlmKHRoaXMuYnVzIGluc3RhbmNlb2YgQnJvd3NlcldpbmRvdyl7XG4gICAgICByZXR1cm4gRWxlY3Ryb2xpemVyVHlwZS5icm93c2VyV2luZG93O1xuICAgIH1cblxuICAgIHJldHVybiBFbGVjdHJvbGl6ZXJUeXBlLndlYnZpZXc7XG4gIH1cblxuICBcbiAgZ2V0IHdlYkNvbnRlbnRzKCk6IFdlYkNvbnRlbnRzIHtcbiAgICBzd2l0Y2godGhpcy5idXNUeXBlKXtcbiAgICAgIGNhc2UgRWxlY3Ryb2xpemVyVHlwZS53ZWJ2aWV3OlxuICAgICAgICAvL0B0cy1pZ25vcmVcbiAgICAgICAgcmV0dXJuICh0aGlzLmJ1cyBhcyBXZWJ2aWV3VGFnKVxuICAgIH1cblxuICAgIHJldHVybiAodGhpcy5idXMgYXMgQnJvd3NlcldpbmRvdykud2ViQ29udGVudHM7XG4gIH1cblxuICBcbiAgcHJpdmF0ZSBhc3luYyBfaW5qZWN0KGZuOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBsZXQgX2FyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpLnNsaWNlKDEpLm1hcChhcmd1bWVudCA9PiB7XG4gICAgICByZXR1cm4geyBhcmd1bWVudDogSlNPTi5zdHJpbmdpZnkoYXJndW1lbnQpIH1cbiAgICB9KTtcblxuICAgIGxldCBzdHJpbmdGbiA9IFN0cmluZyhmbik7XG4gICAgbGV0IHNvdXJjZSA9IGluamVjdCh7Zm46IHN0cmluZ0ZuLCBhcmdzOiBfYXJncyB9KTtcblxuICAgIHJldHVybiBhd2FpdCB0aGlzLndlYkNvbnRlbnRzLmV4ZWN1dGVKYXZhU2NyaXB0KHNvdXJjZSwgdHJ1ZSk7XG4gIH1cblxuICBcbiAgcHJpdmF0ZSBhc3luYyBldmFsdWF0ZV9ub3c8VCwgSyBleHRlbmRzIGFueVtdLCBSPihmbjogKC4uLmFyZ3M6IFB1c2g8SywgVD4pID0+IFIsIC4uLmFyZ3M6IEspOiBQcm9taXNlPFI+IHtcbiAgICBsZXQgX2FyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpLnNsaWNlKDEpLm1hcChhcmd1bWVudCA9PiB7XG4gICAgICByZXR1cm4geyBhcmd1bWVudDogSlNPTi5zdHJpbmdpZnkoYXJndW1lbnQpIH1cbiAgICB9KTtcblxuICAgIGxldCBzdHJpbmdGbiA9IFN0cmluZyhmbik7XG4gICAgbGV0IHNvdXJjZSA9IGV4ZWN1dGUoe2ZuOiBzdHJpbmdGbiwgYXJnczogX2FyZ3MgfSk7XG5cbiAgICByZXR1cm4gYXdhaXQgdGhpcy53ZWJDb250ZW50cy5leGVjdXRlSmF2YVNjcmlwdChzb3VyY2UsIHRydWUpO1xuICB9XG5cbiAgXG4gIGFzeW5jIGdvdG8odXJsOiBzdHJpbmcsIGhlYWRlcnM/OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+KTogUHJvbWlzZTx2b2lkPiB7XG4gICAgaWYoIXVybCl7IHRocm93IG5ldyBFcnJvcigndXJsIG11c3QgYmUgZGVmaW5lZCcpOyB9XG5cbiAgICBsZXQgZXh0cmFIZWFkZXJzOiBzdHJpbmcgPSBcIlwiO1xuICAgIGxldCBodHRwUmVmZXJyZXI6IHN0cmluZyA9IFwiXCI7XG5cbiAgICBsZXQgdXNpbmdIZWFkZXJzOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge1xuICAgICAgLi4udGhpcy5oZWFkZXJzLFxuICAgICAgLi4uaGVhZGVycyxcbiAgICB9O1xuXG4gICAgZm9yKGxldCBoZWFkZXIgaW4gdXNpbmdIZWFkZXJzKXtcbiAgICAgIGlmKGhlYWRlci50b0xvd2VyQ2FzZSgpID09PSAncmVmZXJlcicpe1xuICAgICAgICBodHRwUmVmZXJyZXIgPSB1c2luZ0hlYWRlcnNbaGVhZGVyXTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGV4dHJhSGVhZGVycyArPSBoZWFkZXIgKyAnOiAnICsgdXNpbmdIZWFkZXJzW2hlYWRlcl0gKyBcIlxcblwiXG4gICAgfVxuXG4gICAgYXdhaXQgdGhpcy53ZWJDb250ZW50cy5sb2FkVVJMKHVybCwge1xuICAgICAgZXh0cmFIZWFkZXJzLFxuICAgICAgaHR0cFJlZmVycmVyXG4gICAgfSk7XG4gIH1cblxuICBcbiAgYXN5bmMgYmFjaygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICB0aGlzLndlYkNvbnRlbnRzLmdvQmFjaygpO1xuICB9XG5cbiAgYXN5bmMgZm9yd2FyZCgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICB0aGlzLndlYkNvbnRlbnRzLmdvRm9yd2FyZCgpO1xuICB9XG5cbiAgYXN5bmMgcmVmcmVzaCgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICB0aGlzLndlYkNvbnRlbnRzLnJlbG9hZCgpO1xuICB9XG5cbiAgYXN5bmMgY2xpY2soc2VsZWN0b3I6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiB0aGlzLmV2YWx1YXRlX25vdygoc2VsZWN0b3IpID0+IHtcbiAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgZG9jdW1lbnQuYWN0aXZlRWxlbWVudC5ibHVyKClcbiAgICAgIHZhciBlbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3RvcilcbiAgICAgIGlmICghZWxlbWVudCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1VuYWJsZSB0byBmaW5kIGVsZW1lbnQgYnkgc2VsZWN0b3I6ICcgKyBzZWxlY3RvcilcbiAgICAgIH1cbiAgICAgIHZhciBib3VuZGluZyA9IGVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICAgIHZhciBldmVudCA9IG5ldyBNb3VzZUV2ZW50KCdjbGljaycsIHtcbiAgICAgICAgLy9AdHMtaWdub3JlXG4gICAgICAgIHZpZXc6IGRvY3VtZW50LndpbmRvdyxcbiAgICAgICAgYnViYmxlczogdHJ1ZSxcbiAgICAgICAgY2FuY2VsYWJsZTogdHJ1ZSxcbiAgICAgICAgY2xpZW50WDogYm91bmRpbmcubGVmdCArIGJvdW5kaW5nLndpZHRoIC8gMixcbiAgICAgICAgY2xpZW50WTogYm91bmRpbmcudG9wICsgYm91bmRpbmcuaGVpZ2h0IC8gMlxuICAgICAgfSk7XG5cbiAgICAgIGVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XG4gICAgfSwgc2VsZWN0b3IpO1xuICB9XG5cbiAgYXN5bmMgbW91c2Vkb3duKHNlbGVjdG9yOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBhd2FpdCB0aGlzLmV2YWx1YXRlX25vdygoc2VsZWN0b3IpID0+IHtcbiAgICAgIGxldCBlbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3RvcilcbiAgICAgIGlmICghZWxlbWVudCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1VuYWJsZSB0byBmaW5kIGVsZW1lbnQgYnkgc2VsZWN0b3I6ICcgKyBzZWxlY3RvcilcbiAgICAgIH1cblxuICAgICAgbGV0IGJvdW5kaW5nID0gZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICAgICAgbGV0IGV2ZW50ID0gbmV3IE1vdXNlRXZlbnQoJ21vdXNlZG93bicsIHtcbiAgICAgICAgLy9AdHMtaWdub3JlXG4gICAgICAgIHZpZXc6IGRvY3VtZW50LndpbmRvdyxcbiAgICAgICAgYnViYmxlczogdHJ1ZSxcbiAgICAgICAgY2FuY2VsYWJsZTogdHJ1ZSxcbiAgICAgICAgY2xpZW50WDogYm91bmRpbmcubGVmdCArIGJvdW5kaW5nLndpZHRoIC8gMixcbiAgICAgICAgY2xpZW50WTogYm91bmRpbmcudG9wICsgYm91bmRpbmcuaGVpZ2h0IC8gMlxuICAgICAgfSk7XG4gICAgICBcbiAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgZWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KVxuICAgIH0sIHNlbGVjdG9yKTtcbiAgfVxuXG4gIFxuICBhc3luYyBleGlzdHMoc2VsY3Rvcjogc3RyaW5nKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuZXZhbHVhdGVfbm93KChzZWxlY3RvcikgPT4ge1xuICAgICAgbGV0IGVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcbiAgICAgIHJldHVybiBlbGVtZW50ID8gdHJ1ZSA6IGZhbHNlO1xuICAgIH0sIHNlbGN0b3IpO1xuICB9XG5cbiAgYXN5bmMgbW91c2V1cChzZWxlY3Rvcjogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgYXdhaXQgdGhpcy5ldmFsdWF0ZV9ub3coKHNlbGVjdG9yKSA9PiB7XG4gICAgICBsZXQgZWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpXG4gICAgICBpZiAoIWVsZW1lbnQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmFibGUgdG8gZmluZCBlbGVtZW50IGJ5IHNlbGVjdG9yOiAnICsgc2VsZWN0b3IpXG4gICAgICB9XG5cbiAgICAgIGxldCBib3VuZGluZyA9IGVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cbiAgICAgIGxldCBldmVudCA9IG5ldyBNb3VzZUV2ZW50KCdtb3VzZXVwJywge1xuICAgICAgICAvL0B0cy1pZ25vcmVcbiAgICAgICAgdmlldzogZG9jdW1lbnQud2luZG93LFxuICAgICAgICBidWJibGVzOiB0cnVlLFxuICAgICAgICBjYW5jZWxhYmxlOiB0cnVlLFxuICAgICAgICBjbGllbnRYOiBib3VuZGluZy5sZWZ0ICsgYm91bmRpbmcud2lkdGggLyAyLFxuICAgICAgICBjbGllbnRZOiBib3VuZGluZy50b3AgKyBib3VuZGluZy5oZWlnaHQgLyAyXG4gICAgICB9KTtcbiAgICAgIFxuICAgICAgLy9AdHMtaWdub3JlXG4gICAgICBlbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpXG4gICAgfSwgc2VsZWN0b3IpO1xuICB9XG4gIFxuICBhc3luYyBtb3VzZW92ZXIoc2VsZWN0b3I6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAgIGF3YWl0IHRoaXMuZXZhbHVhdGVfbm93KChzZWxlY3RvcikgPT4ge1xuICAgICAgbGV0IGVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKVxuICAgICAgaWYgKCFlbGVtZW50KSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignVW5hYmxlIHRvIGZpbmQgZWxlbWVudCBieSBzZWxlY3RvcjogJyArIHNlbGVjdG9yKVxuICAgICAgfVxuXG4gICAgICBsZXQgYm91bmRpbmcgPSBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgICBsZXQgZXZlbnQgPSBuZXcgTW91c2VFdmVudCgnbW91c2VvdmVyJywge1xuICAgICAgICAvL0B0cy1pZ25vcmVcbiAgICAgICAgdmlldzogZG9jdW1lbnQud2luZG93LFxuICAgICAgICBidWJibGVzOiB0cnVlLFxuICAgICAgICBjYW5jZWxhYmxlOiB0cnVlLFxuICAgICAgICBjbGllbnRYOiBib3VuZGluZy5sZWZ0ICsgYm91bmRpbmcud2lkdGggLyAyLFxuICAgICAgICBjbGllbnRZOiBib3VuZGluZy50b3AgKyBib3VuZGluZy5oZWlnaHQgLyAyXG4gICAgICB9KTtcbiAgICAgIFxuICAgICAgLy9AdHMtaWdub3JlXG4gICAgICBlbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpXG4gICAgfSwgc2VsZWN0b3IpO1xuICB9XG5cbiAgYXN5bmMgbW91c2VvdXQoc2VsZWN0b3I6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAgIGF3YWl0IHRoaXMuZXZhbHVhdGVfbm93KChzZWxlY3RvcikgPT4ge1xuICAgICAgbGV0IGVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKVxuICAgICAgaWYgKCFlbGVtZW50KSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignVW5hYmxlIHRvIGZpbmQgZWxlbWVudCBieSBzZWxlY3RvcjogJyArIHNlbGVjdG9yKVxuICAgICAgfVxuICAgICAgbGV0IGV2ZW50ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ01vdXNlRXZlbnQnKVxuICAgICAgLy9AdHMtaWdub3JlXG4gICAgICBldmVudC5pbml0TW91c2VFdmVudCgnbW91c2VvdXQnLCB0cnVlLCB0cnVlKVxuICAgICAgZWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KVxuICAgIH0sIHNlbGVjdG9yKTtcbiAgfVxuXG4gIGFzeW5jIGZvY3VzKHNlbGVjdG9yOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gdGhpcy5ldmFsdWF0ZV9ub3coKHNlbGVjdG9yKSA9PiB7XG4gICAgICAvL0B0cy1pZ25vcmVcbiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpLmZvY3VzKCk7XG4gICAgfSwgc2VsZWN0b3IpO1xuICB9XG5cbiAgYXN5bmMgYmx1cihzZWxlY3Rvcjogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIHRoaXMuZXZhbHVhdGVfbm93KChzZWxlY3RvcikgPT4ge1xuICAgICAgLy9AdHMtaWdub3JlXG4gICAgICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpXG4gICAgICBpZiAoZWxlbWVudCkge1xuICAgICAgICAvL0B0cy1pZ25vcmVcbiAgICAgICAgZWxlbWVudC5ibHVyKClcbiAgICAgIH1cbiAgICB9LCBzZWxlY3Rvcik7XG4gIH1cblxuICBhc3luYyB0eXBlKHNlbGVjdG9yOiBzdHJpbmcsIHRleHQ/OiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBsZXQgY2hhcnMgPSBTdHJpbmcodGV4dCkuc3BsaXQoJycpO1xuXG4gICAgbGV0IHR5cGVJbnRlcnZhbCA9IDI1MDtcblxuICAgIGF3YWl0IHRoaXMuZm9jdXMoc2VsZWN0b3IpO1xuXG4gICAgZm9yKGxldCBjaGFyIG9mIGNoYXJzKXtcbiAgICAgIHRoaXMud2ViQ29udGVudHMuc2VuZElucHV0RXZlbnQoe1xuICAgICAgICB0eXBlOiAna2V5RG93bicsXG4gICAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgICBrZXlDb2RlOiBjaGFyLFxuICAgICAgfSk7XG5cbiAgICAgIHRoaXMud2ViQ29udGVudHMuc2VuZElucHV0RXZlbnQoe1xuICAgICAgICB0eXBlOiAnY2hhcicsXG4gICAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgICBrZXlDb2RlOiBjaGFyLFxuICAgICAgfSk7XG5cbiAgICAgIHRoaXMud2ViQ29udGVudHMuc2VuZElucHV0RXZlbnQoe1xuICAgICAgICB0eXBlOiAna2V5VXAnLFxuICAgICAgICAvL0B0cy1pZ25vcmVcbiAgICAgICAga2V5Q29kZTogY2hhcixcbiAgICAgIH0pO1xuXG4gICAgICBhd2FpdCBkZWxheSh0eXBlSW50ZXJ2YWwpO1xuICAgIH1cblxuICAgIGF3YWl0IHRoaXMuYmx1cihzZWxlY3Rvcik7XG4gIH1cblxuICBcbiAgYXN5bmMgaW5zZXJ0KHNlbGVjdG9yOiBzdHJpbmcsIHRleHQ/OiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gYXdhaXQgdGhpcy5ldmFsdWF0ZV9ub3coKHNlbGVjdG9yLCB0ZXh0KSA9PiB7XG4gICAgICAvL0B0cy1pZ25vcmVcbiAgICAgIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQuYmx1cigpXG4gICAgICBsZXQgZWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xuXG4gICAgICBpZiAoIWVsZW1lbnQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmFibGUgdG8gZmluZCBlbGVtZW50IGJ5IHNlbGVjdG9yOiAnICsgc2VsZWN0b3IpXG4gICAgICB9XG4gICAgICAvL0B0cy1pZ25vcmVcbiAgICAgIGVsZW1lbnQudmFsdWUgPSB0ZXh0ID8gdGV4dCA6ICcnO1xuICAgIH0sIHNlbGVjdG9yLCB0ZXh0KTtcbiAgfVxuXG4gIFxuICBhc3luYyBjaGVjayhzZWxlY3Rvcjogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgYXdhaXQgdGhpcy5ldmFsdWF0ZV9ub3coKHNlbGVjdG9yKSA9PiB7XG4gICAgICBsZXQgZWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xuXG4gICAgICBpZiAoIWVsZW1lbnQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmFibGUgdG8gZmluZCBlbGVtZW50IGJ5IHNlbGVjdG9yOiAnICsgc2VsZWN0b3IpXG4gICAgICB9XG5cbiAgICAgIGxldCBldmVudCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdIVE1MRXZlbnRzJyk7XG4gICAgICAoZWxlbWVudCBhcyBIVE1MSW5wdXRFbGVtZW50KS5jaGVja2VkID0gdHJ1ZTtcbiAgICAgIGV2ZW50LmluaXRFdmVudCgnY2hhbmdlJywgdHJ1ZSwgdHJ1ZSk7XG4gICAgICBlbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuICAgIH0sIHNlbGVjdG9yKTtcbiAgfVxuXG4gIFxuICBhc3luYyB1bmNoZWNrKHNlbGVjdG9yOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICB0aGlzLmV2YWx1YXRlX25vdygoc2VsZWN0b3IpID0+IHtcbiAgICAgIGxldCBlbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7XG4gICAgICBpZiAoIWVsZW1lbnQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmFibGUgdG8gZmluZCBlbGVtZW50IGJ5IHNlbGVjdG9yOiAnICsgc2VsZWN0b3IpXG4gICAgICB9XG4gICAgICBsZXQgZXZlbnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnSFRNTEV2ZW50cycpO1xuICAgICAgKGVsZW1lbnQgYXMgSFRNTElucHV0RWxlbWVudCkuY2hlY2tlZCA9IGZhbHNlO1xuICAgICAgZXZlbnQuaW5pdEV2ZW50KCdjaGFuZ2UnLCB0cnVlLCB0cnVlKTtcbiAgICAgIGVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XG4gICAgfSwgc2VsZWN0b3IpO1xuICB9XG5cblxuICBhc3luYyBzZWxlY3Qoc2VsZWN0b3I6IHN0cmluZywgb3B0aW9uPzogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgdGhpcy5ldmFsdWF0ZV9ub3coKHNlbGVjdG9yKSA9PiB7XG4gICAgICBsZXQgZWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xuICAgICAgaWYgKCFlbGVtZW50KSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignVW5hYmxlIHRvIGZpbmQgZWxlbWVudCBieSBzZWxlY3RvcjogJyArIHNlbGVjdG9yKVxuICAgICAgfVxuICAgICAgbGV0IGV2ZW50ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0hUTUxFdmVudHMnKTtcbiAgICAgIChlbGVtZW50IGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlID0gb3B0aW9uID8gb3B0aW9uIDogJyc7XG4gICAgICBldmVudC5pbml0RXZlbnQoJ2NoYW5nZScsIHRydWUsIHRydWUpO1xuICAgICAgZWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcbiAgICB9LCBzZWxlY3Rvcik7XG4gIH1cblxuICBhc3luYyBzY3JvbGxUbyh0b3A6IG51bWJlciwgbGVmdDogbnVtYmVyKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgYXdhaXQgdGhpcy5ldmFsdWF0ZV9ub3coKHRvcCwgbGVmdCkgPT4ge1xuICAgICAgd2luZG93LnNjcm9sbFRvKHsgdG9wLCBsZWZ0IH0pO1xuICAgIH0sIHRvcCwgbGVmdCk7XG4gIH1cblxuICBhc3luYyBodG1sKCk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgcmV0dXJuIHRoaXMuZXZhbHVhdGVfbm93KCgpID0+IHtcbiAgICAgIHJldHVybiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQub3V0ZXJIVE1MXG4gICAgfSk7XG4gIH1cblxuICBhc3luYyB2aWV3cG9ydCh3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlcik6IFByb21pc2U8dm9pZD4ge1xuICAgIHN3aXRjaCh0aGlzLmJ1c1R5cGUpe1xuICAgICAgY2FzZSBFbGVjdHJvbGl6ZXJUeXBlLndlYnZpZXc6XG4gICAgICAgIHJldHVybjtcbiAgICAgIGNhc2UgRWxlY3Ryb2xpemVyVHlwZS5icm93c2VyVmlldzpcbiAgICAgICAgbGV0IGJ2YnV4OiBCcm93c2VyVmlldyA9IHRoaXMuYnVzIGFzIEJyb3dzZXJWaWV3O1xuICAgICAgICAvL0B0cy1pZ25vcmVcbiAgICAgICAgbGV0IGJvdW5kcyA9IGJ2YnV4LmdldEJvdW5kcygpIGFzIEVsZWN0cm9uLlJlY3RhbmdsZTtcbiAgICAgICAgYnZidXguc2V0Qm91bmRzKHtcbiAgICAgICAgICAuLi5ib3VuZHMsXG4gICAgICAgICAgd2lkdGgsXG4gICAgICAgICAgaGVpZ2h0XG4gICAgICAgIH0pXG4gICAgICAgIHJldHVybjtcbiAgICAgIGNhc2UgRWxlY3Ryb2xpemVyVHlwZS5icm93c2VyV2luZG93OlxuICAgICAgICAodGhpcy5idXMgYXMgKEJyb3dzZXJXaW5kb3cpKS5zZXRTaXplKHdpZHRoLCBoZWlnaHQpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgaW5qZWN0KHR5cGU6ICdqcycgfCAnY3NzJywgZmlsZTogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgbGV0IGNvbnRlbnRzID0gYXdhaXQgcHJvbWlzZXMucmVhZEZpbGUoZmlsZSwgeyBlbmNvZGluZzogJ3V0Zi04JyB9KSBhcyBzdHJpbmc7XG4gICAgc3dpdGNoKHR5cGUpe1xuICAgICAgY2FzZSAnanMnOlxuICAgICAgICBhd2FpdCB0aGlzLl9pbmplY3QoY29udGVudHMpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2Nzcyc6XG4gICAgICAgIHRoaXMud2ViQ29udGVudHMuaW5zZXJ0Q1NTKGNvbnRlbnRzKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgZXZhbHVhdGU8VCwgSyBleHRlbmRzIGFueVtdLCBSPihmbjogKC4uLmFyZ3M6IFB1c2g8SywgVD4pID0+IFIsIC4uLmFyZ3M6IEspOiBQcm9taXNlPFI+IHtcbiAgICByZXR1cm4gdGhpcy5ldmFsdWF0ZV9ub3coZm4sIC4uLmFyZ3MpO1xuICB9XG4gIFxuICBwcml2YXRlIHJldHJ5KGZuOiAoKSA9PiBQcm9taXNlPEJvb2xlYW4+LCB0aW1lb3V0OiBudW1iZXIsIHNvZnRUaW1lb3V0PzogbnVtYmVyKTogKCkgPT4gUHJvbWlzZTx2b2lkPiB7XG4gICAgbGV0IGVycm9yOiBFcnJvciB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcbiAgICBsZXQgcnVubmluZzogYm9vbGVhbiA9IHRydWU7XG5cbiAgICBsZXQgcnVubmVyID0gYXN5bmMgKCkgPT4ge1xuXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHsgXG4gICAgICAgIHJ1bm5pbmcgPSBmYWxzZTsgXG4gICAgICAgIGVycm9yID0gbmV3IEVycm9yKCd0aW1lZCBvdXQnKTtcbiAgICAgIH0sIHNvZnRUaW1lb3V0ID8gc29mdFRpbWVvdXQgOiB0aW1lb3V0KTtcblxuICAgICAgd2hpbGUocnVubmluZyl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgbGV0IHJlc3VsdCA9IGF3YWl0IGZuKCk7XG4gICAgICAgICAgXG4gICAgICAgICAgaWYocmVzdWx0KXsgcnVubmluZyA9IGZhbHNlOyB9XG4gIFxuICAgICAgICB9IGNhdGNoIChfZXJyb3Ipe1xuICAgICAgICAgIHJ1bm5pbmcgPSBmYWxzZTtcbiAgICAgICAgICBlcnJvciA9IF9lcnJvcjtcbiAgICAgICAgfVxuICAgICAgfVxuICBcbiAgICAgIGlmKGVycm9yKXtcbiAgICAgICAgaWYoIXNvZnRUaW1lb3V0KXtcbiAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICByZXR1cm4gcnVubmVyO1xuICB9XG5cbiAgYXN5bmMgd2FpdChtczogbnVtYmVyKTogUHJvbWlzZTx2b2lkPlxuICBhc3luYyB3YWl0KHNlbGVjdG9yOiBzdHJpbmcsIG1zRGVsYXk/OiBudW1iZXIpOiBQcm9taXNlPHZvaWQ+IFxuICBhc3luYyB3YWl0PFQsIEsgZXh0ZW5kcyBhbnlbXT4oZm46ICguLi5hcmdzOiBQdXNoPEssIFQ+KSA9PiBib29sZWFuICB8IFByb21pc2U8Ym9vbGVhbj4sIC4uLmFyZ3M6IEspOiBQcm9taXNlPHZvaWQ+XG4gIGFzeW5jIHdhaXQoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgbGV0IGJsb2NrOiAoKSA9PiBQcm9taXNlPHZvaWQ+O1xuXG4gICAgbGV0IGVycm9yVGltZW91dCA9IDMwMDAwO1xuXG4gICAgc3dpdGNoKHR5cGVvZiBhcmd1bWVudHNbMF0pe1xuICAgICAgY2FzZSBcIm51bWJlclwiOlxuICAgICAgICBibG9jayA9IGRlbGF5LmJpbmQobnVsbCwgYXJndW1lbnRzWzBdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwic3RyaW5nXCI6XG4gICAgICAgIGJsb2NrID0gdGhpcy5yZXRyeSgoKSA9PiB0aGlzLmV4aXN0cyhhcmd1bWVudHNbMF0pLCBlcnJvclRpbWVvdXQsIGFyZ3VtZW50c1sxXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcImZ1bmN0aW9uXCI6XG4gICAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgICBibG9jayA9IHRoaXMucmV0cnkoKCkgPT4gdGhpcy5ldmFsdWF0ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpLCBlcnJvclRpbWVvdXQpO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgYmxvY2sgPSBhc3luYyAoKSA9PiB7fTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgYXdhaXQgYmxvY2soKTtcbiAgfVxuXG4gIGFzeW5jIHVybCgpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIHJldHVybiB0aGlzLndlYkNvbnRlbnRzLmdldFVSTCgpO1xuICB9XG5cbiAgYXN5bmMgcGF0aCgpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIHJldHVybiBhd2FpdCB0aGlzLmV2YWx1YXRlX25vdygoKSA9PiBkb2N1bWVudC5sb2NhdGlvbi5wYXRobmFtZSk7XG4gIH1cblxuICBhc3luYyB0aXRsZSgpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIHJldHVybiBhd2FpdCB0aGlzLmV2YWx1YXRlX25vdygoKSA9PiBkb2N1bWVudC50aXRsZSk7XG4gIH1cblxuICBhc3luYyBwZGYob3B0aW9ucz86IEVsZWN0cm9uLlByaW50VG9QREZPcHRpb25zKTogUHJvbWlzZTxCdWZmZXI+IHtcbiAgICBsZXQgb3B0OiBFbGVjdHJvbi5QcmludFRvUERGT3B0aW9ucyA9IHtcbiAgICAgIG1hcmdpbnNUeXBlOiAwLFxuICAgICAgcHJpbnRCYWNrZ3JvdW5kOiB0cnVlLFxuICAgICAgcHJpbnRTZWxlY3Rpb25Pbmx5OiBmYWxzZSxcbiAgICAgIGxhbmRzY2FwZTogZmFsc2UsXG4gICAgICAuLi5vcHRpb25zLFxuICAgIH07XG5cbiAgICByZXR1cm4gYXdhaXQgdGhpcy53ZWJDb250ZW50cy5wcmludFRvUERGKG9wdCk7XG4gIH1cblxuICBhc3luYyBzY3JlZW5zaG90KHJlY3Q/OiBFbGVjdHJvbi5SZWN0YW5nbGUsIG9wdGlvbnM/OiBFbGVjdHJvbi5Ub1BOR09wdGlvbnMpOiBQcm9taXNlPEJ1ZmZlcj4ge1xuICAgIGxldCBjYXB0dXJlID0gYXdhaXQgdGhpcy53ZWJDb250ZW50cy5jYXB0dXJlUGFnZShyZWN0KTtcbiAgICByZXR1cm4gY2FwdHVyZS50b1BORyhvcHRpb25zKTtcbiAgfVxuICBcbiAgYXN5bmMgaGVhZGVyKGhlYWRlcj86IHN0cmluZywgdmFsdWU/OiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBpZih0eXBlb2YgaGVhZGVyID09PSBcInN0cmluZ1wiICYmIHR5cGVvZiB2YWx1ZSAhPT0gXCJ1bmRlZmluZWRcIil7XG4gICAgICB0aGlzLmhlYWRlcnNbaGVhZGVyXSA9IHZhbHVlO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmhlYWRlcnMgPSB7fTtcbiAgICB9XG4gIH1cblxuICBhc3luYyB1c2VyYWdlbnQodXNlcmFnZW50OiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICB0aGlzLndlYkNvbnRlbnRzLnNldFVzZXJBZ2VudCh1c2VyYWdlbnQpO1xuICB9XG4gIFxuICBwcml2YXRlIGxvZ2luRXZlbnRMaXN0ZW5lciA6IChldmVudDogRWxlY3Ryb24uRXZlbnQsIHJlcXVlc3Q6IEVsZWN0cm9uLlJlcXVlc3QsIGF1dGhJbmZvOiBFbGVjdHJvbi5BdXRoSW5mbywgY2FsbGJhY2s6ICh1c2VybmFtZTogc3RyaW5nLCBwYXNzd29yZDogc3RyaW5nKSA9PiB2b2lkKSA9PiB2b2lkID0gKCkgPT4ge31cblxuICBhc3luYyBhdXRoZW50aWNhdGlvbih1c2VybmFtZTogc3RyaW5nLCBwYXNzd29yZDogc3RyaW5nKXtcbiAgICBsZXQgYXR0ZW1wdHMgPSAwO1xuICAgIGxldCBjdXJyZW50VVJMID0gXCJcIjtcblxuICAgIHRoaXMud2ViQ29udGVudHMucmVtb3ZlTGlzdGVuZXIoJ2xvZ2luJywgdGhpcy5sb2dpbkV2ZW50TGlzdGVuZXIpO1xuXG4gICAgcmV0dXJuIGF3YWl0IG5ldyBQcm9taXNlPHZvaWQ+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHRoaXMubG9naW5FdmVudExpc3RlbmVyID0gKGV2ZW50LCByZXF1ZXN0LCBhdXRoSW5mbywgY2FsbGJhY2spID0+IHtcbiAgICAgICAgaWYoY3VycmVudFVSTCAhPT0gcmVxdWVzdC51cmwpe1xuICAgICAgICAgIGF0dGVtcHRzID0gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKGF0dGVtcHRzID49IDQpe1xuICAgICAgICAgIC8vIG5lZWQgdG8gaGFuZGxlIGVycm9yO1xuICAgICAgICAgIHRoaXMud2ViQ29udGVudHMucmVtb3ZlTGlzdGVuZXIoJ2xvZ2luJywgdGhpcy5sb2dpbkV2ZW50TGlzdGVuZXIpO1xuICAgICAgICAgIHJldHVybiBjYWxsYmFjayh1c2VybmFtZSwgcGFzc3dvcmQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGNhbGxiYWNrKHVzZXJuYW1lLCBwYXNzd29yZCk7XG4gICAgICB9O1xuXG4gICAgICB0aGlzLndlYkNvbnRlbnRzLm9uKCdsb2dpbicsIHRoaXMubG9naW5FdmVudExpc3RlbmVyKTtcblxuICAgICAgcmV0dXJuIHJlc29sdmUoKTtcbiAgICB9KTtcbiAgfVxufSJdfQ==