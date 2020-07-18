"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Driver = void 0;

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _javascript = require("../javascript.template");

var _electrolizer = require("../electrolizer.class");

var _delay = require("../utils/delay.function");

var _fs = require("fs");

var _cookies = require("./cookies.class");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

class Driver {
  constructor(bus, busType) {
    this.bus = bus;
    this.busType = busType;
    (0, _defineProperty2.default)(this, "cookies", new _cookies.Cookies(this.webContents));
    (0, _defineProperty2.default)(this, "headers", {});
    (0, _defineProperty2.default)(this, "loginEventListener", () => {});
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

          var bounds = bvbux.getBounds(); //@ts-ignore

          bvbux.setBounds(_objectSpread(_objectSpread({}, bounds), {}, {
            width,
            height
          }));
          return;

        case _electrolizer.ElectrolizerType.browserWindow:
          //@ts-ignore
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9kcml2ZXJzL2RyaXZlci5jbGFzcy50cyJdLCJuYW1lcyI6WyJEcml2ZXIiLCJjb25zdHJ1Y3RvciIsImJ1cyIsImJ1c1R5cGUiLCJDb29raWVzIiwid2ViQ29udGVudHMiLCJFbGVjdHJvbGl6ZXJUeXBlIiwid2VidmlldyIsIl9pbmplY3QiLCJmbiIsIl9hcmdzIiwiQXJyYXkiLCJwcm90b3R5cGUiLCJzbGljZSIsImNhbGwiLCJhcmd1bWVudHMiLCJtYXAiLCJhcmd1bWVudCIsIkpTT04iLCJzdHJpbmdpZnkiLCJzdHJpbmdGbiIsIlN0cmluZyIsInNvdXJjZSIsImFyZ3MiLCJleGVjdXRlSmF2YVNjcmlwdCIsImV2YWx1YXRlX25vdyIsImdvdG8iLCJ1cmwiLCJoZWFkZXJzIiwiRXJyb3IiLCJleHRyYUhlYWRlcnMiLCJodHRwUmVmZXJyZXIiLCJ1c2luZ0hlYWRlcnMiLCJoZWFkZXIiLCJ0b0xvd2VyQ2FzZSIsImxvYWRVUkwiLCJiYWNrIiwiZ29CYWNrIiwiZm9yd2FyZCIsImdvRm9yd2FyZCIsInJlZnJlc2giLCJyZWxvYWQiLCJjbGljayIsInNlbGVjdG9yIiwiZG9jdW1lbnQiLCJhY3RpdmVFbGVtZW50IiwiYmx1ciIsImVsZW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwiYm91bmRpbmciLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJldmVudCIsIk1vdXNlRXZlbnQiLCJ2aWV3Iiwid2luZG93IiwiYnViYmxlcyIsImNhbmNlbGFibGUiLCJjbGllbnRYIiwibGVmdCIsIndpZHRoIiwiY2xpZW50WSIsInRvcCIsImhlaWdodCIsImRpc3BhdGNoRXZlbnQiLCJtb3VzZWRvd24iLCJleGlzdHMiLCJzZWxjdG9yIiwibW91c2V1cCIsIm1vdXNlb3ZlciIsIm1vdXNlb3V0IiwiY3JlYXRlRXZlbnQiLCJpbml0TW91c2VFdmVudCIsImZvY3VzIiwidHlwZSIsInRleHQiLCJjaGFycyIsInNwbGl0IiwidHlwZUludGVydmFsIiwiY2hhciIsInNlbmRJbnB1dEV2ZW50Iiwia2V5Q29kZSIsImluc2VydCIsInZhbHVlIiwiY2hlY2siLCJjaGVja2VkIiwiaW5pdEV2ZW50IiwidW5jaGVjayIsInNlbGVjdCIsIm9wdGlvbiIsInNjcm9sbFRvIiwiaHRtbCIsImRvY3VtZW50RWxlbWVudCIsIm91dGVySFRNTCIsInZpZXdwb3J0IiwiYnJvd3NlclZpZXciLCJidmJ1eCIsImJvdW5kcyIsImdldEJvdW5kcyIsInNldEJvdW5kcyIsImJyb3dzZXJXaW5kb3ciLCJzZXRTaXplIiwiaW5qZWN0IiwiZmlsZSIsImNvbnRlbnRzIiwicHJvbWlzZXMiLCJyZWFkRmlsZSIsImVuY29kaW5nIiwiaW5zZXJ0Q1NTIiwiZXZhbHVhdGUiLCJyZXRyeSIsInRpbWVvdXQiLCJzb2Z0VGltZW91dCIsImVycm9yIiwidW5kZWZpbmVkIiwicnVubmluZyIsInJ1bm5lciIsInNldFRpbWVvdXQiLCJyZXN1bHQiLCJfZXJyb3IiLCJ3YWl0IiwiYmxvY2siLCJlcnJvclRpbWVvdXQiLCJkZWxheSIsImJpbmQiLCJhcHBseSIsImdldFVSTCIsInBhdGgiLCJsb2NhdGlvbiIsInBhdGhuYW1lIiwidGl0bGUiLCJwZGYiLCJvcHRpb25zIiwib3B0IiwibWFyZ2luc1R5cGUiLCJwcmludEJhY2tncm91bmQiLCJwcmludFNlbGVjdGlvbk9ubHkiLCJsYW5kc2NhcGUiLCJwcmludFRvUERGIiwic2NyZWVuc2hvdCIsInJlY3QiLCJjYXB0dXJlIiwiY2FwdHVyZVBhZ2UiLCJ0b1BORyIsInVzZXJhZ2VudCIsInNldFVzZXJBZ2VudCIsImF1dGhlbnRpY2F0aW9uIiwidXNlcm5hbWUiLCJwYXNzd29yZCIsImF0dGVtcHRzIiwiY3VycmVudFVSTCIsInJlbW92ZUxpc3RlbmVyIiwibG9naW5FdmVudExpc3RlbmVyIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJyZXF1ZXN0IiwiYXV0aEluZm8iLCJjYWxsYmFjayIsIm9uIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FB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TCxDQUFpQjJJLFlBQWpCLENBQThCRCxTQUE5QjtBQURnRDtBQUVqRDs7QUFJS0UsRUFBQUEsY0FBTixDQUFxQkMsUUFBckIsRUFBdUNDLFFBQXZDLEVBQXdEO0FBQUE7O0FBQUE7QUFDdEQsVUFBSUMsUUFBUSxHQUFHLENBQWY7QUFDQSxVQUFJQyxVQUFVLEdBQUcsRUFBakI7O0FBRUEsTUFBQSxPQUFJLENBQUNoSixXQUFMLENBQWlCaUosY0FBakIsQ0FBZ0MsT0FBaEMsRUFBeUMsT0FBSSxDQUFDQyxrQkFBOUM7O0FBRUEsbUJBQWEsSUFBSUMsT0FBSixDQUFrQixDQUFDQyxPQUFELEVBQVVDLE1BQVYsS0FBcUI7QUFDbEQsUUFBQSxPQUFJLENBQUNILGtCQUFMLEdBQTBCLENBQUNwRyxLQUFELEVBQVF3RyxPQUFSLEVBQWlCQyxRQUFqQixFQUEyQkMsUUFBM0IsS0FBd0M7QUFDaEUsY0FBR1IsVUFBVSxLQUFLTSxPQUFPLENBQUNoSSxHQUExQixFQUE4QjtBQUM1QnlILFlBQUFBLFFBQVEsR0FBRyxDQUFYO0FBQ0Q7O0FBRUQsY0FBR0EsUUFBUSxJQUFJLENBQWYsRUFBaUI7QUFDZjtBQUNBLFlBQUEsT0FBSSxDQUFDL0ksV0FBTCxDQUFpQmlKLGNBQWpCLENBQWdDLE9BQWhDLEVBQXlDLE9BQUksQ0FBQ0Msa0JBQTlDOztBQUNBLG1CQUFPTSxRQUFRLENBQUNYLFFBQUQsRUFBV0MsUUFBWCxDQUFmO0FBQ0Q7O0FBRUQsaUJBQU9VLFFBQVEsQ0FBQ1gsUUFBRCxFQUFXQyxRQUFYLENBQWY7QUFDRCxTQVpEOztBQWNBLFFBQUEsT0FBSSxDQUFDOUksV0FBTCxDQUFpQnlKLEVBQWpCLENBQW9CLE9BQXBCLEVBQTZCLE9BQUksQ0FBQ1Asa0JBQWxDOztBQUVBLGVBQU9FLE9BQU8sRUFBZDtBQUNELE9BbEJZLENBQWI7QUFOc0Q7QUF5QnZEOztBQWhla0kiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFbGVjdHJvblNoaW1zIH0gZnJvbSAnLi4vc2hpbXMvZWxlY3Ryb24tc2hpbXMnO1xuaW1wb3J0IHsgT3BlcmF0b3JGdW5jdGlvbnMgfSBmcm9tICcuLi9vcGVyYXRvci1mdW5jdGlvbnMuaW50ZXJmYWNlJztcbmltcG9ydCB7IFB1c2ggfSBmcm9tICcuLi9ldmFsdWF0ZS1mdW5jdGlvbi50eXBlJztcbmltcG9ydCB7IGV4ZWN1dGUsIGluamVjdCB9IGZyb20gJy4uL2phdmFzY3JpcHQudGVtcGxhdGUnO1xuaW1wb3J0IHsgRWxlY3Ryb2xpemVyVHlwZSB9IGZyb20gJy4uL2VsZWN0cm9saXplci5jbGFzcyc7XG5pbXBvcnQgeyBkZWxheSB9IGZyb20gJy4uL3V0aWxzL2RlbGF5LmZ1bmN0aW9uJztcbmltcG9ydCB7IHByb21pc2VzIH0gZnJvbSAnZnMnO1xuaW1wb3J0IHsgQ29va2llcyB9IGZyb20gJy4vY29va2llcy5jbGFzcyc7XG5cbmV4cG9ydCBjbGFzcyBEcml2ZXI8VCBleHRlbmRzIEVsZWN0cm9uU2hpbXMuQnJvd3NlcldpbmRvd1ZpZXdMaWtlIHwgRWxlY3Ryb25TaGltcy5XZWJ2aWV3VGFnTGlrZT4gaW1wbGVtZW50cyBPcGVyYXRvckZ1bmN0aW9uczx2b2lkPiB7XG5cbiAgY29va2llcyA9IG5ldyBDb29raWVzKHRoaXMud2ViQ29udGVudHMpO1xuXG4gIHByaXZhdGUgaGVhZGVyczogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHt9O1xuXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBidXM6IFQsIHByb3RlY3RlZCBidXNUeXBlOiBFbGVjdHJvbGl6ZXJUeXBlKXt9XG5cbiAgZ2V0IHdlYkNvbnRlbnRzKCk6IEVsZWN0cm9uU2hpbXMuV2ViQ29udGVudHNMaWtlIHtcbiAgICBzd2l0Y2godGhpcy5idXNUeXBlKXtcbiAgICAgIGNhc2UgRWxlY3Ryb2xpemVyVHlwZS53ZWJ2aWV3OlxuICAgICAgICAvL0B0cy1pZ25vcmVcbiAgICAgICAgcmV0dXJuICh0aGlzLmJ1cyBhcyBFbGVjdHJvblNoaW1zLldlYnZpZXdUYWdMaWtlKVxuICAgIH1cblxuICAgIHJldHVybiAodGhpcy5idXMgYXMgRWxlY3Ryb25TaGltcy5Ccm93c2VyV2luZG93Vmlld0xpa2UpLndlYkNvbnRlbnRzO1xuICB9XG5cbiAgXG4gIHByaXZhdGUgYXN5bmMgX2luamVjdChmbjogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgbGV0IF9hcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKS5zbGljZSgxKS5tYXAoYXJndW1lbnQgPT4ge1xuICAgICAgcmV0dXJuIHsgYXJndW1lbnQ6IEpTT04uc3RyaW5naWZ5KGFyZ3VtZW50KSB9XG4gICAgfSk7XG5cbiAgICBsZXQgc3RyaW5nRm4gPSBTdHJpbmcoZm4pO1xuICAgIGxldCBzb3VyY2UgPSBpbmplY3Qoe2ZuOiBzdHJpbmdGbiwgYXJnczogX2FyZ3MgfSk7XG5cbiAgICByZXR1cm4gYXdhaXQgdGhpcy53ZWJDb250ZW50cy5leGVjdXRlSmF2YVNjcmlwdChzb3VyY2UsIHRydWUpO1xuICB9XG5cbiAgXG4gIHByaXZhdGUgYXN5bmMgZXZhbHVhdGVfbm93PFQsIEsgZXh0ZW5kcyBhbnlbXSwgUj4oZm46ICguLi5hcmdzOiBQdXNoPEssIFQ+KSA9PiBSLCAuLi5hcmdzOiBLKTogUHJvbWlzZTxSPiB7XG4gICAgbGV0IF9hcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKS5zbGljZSgxKS5tYXAoYXJndW1lbnQgPT4ge1xuICAgICAgcmV0dXJuIHsgYXJndW1lbnQ6IEpTT04uc3RyaW5naWZ5KGFyZ3VtZW50KSB9XG4gICAgfSk7XG5cbiAgICBsZXQgc3RyaW5nRm4gPSBTdHJpbmcoZm4pO1xuICAgIGxldCBzb3VyY2UgPSBleGVjdXRlKHtmbjogc3RyaW5nRm4sIGFyZ3M6IF9hcmdzIH0pO1xuXG4gICAgcmV0dXJuIGF3YWl0IHRoaXMud2ViQ29udGVudHMuZXhlY3V0ZUphdmFTY3JpcHQoc291cmNlLCB0cnVlKTtcbiAgfVxuXG4gIFxuICBhc3luYyBnb3RvKHVybDogc3RyaW5nLCBoZWFkZXJzPzogUmVjb3JkPHN0cmluZywgc3RyaW5nPik6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmKCF1cmwpeyB0aHJvdyBuZXcgRXJyb3IoJ3VybCBtdXN0IGJlIGRlZmluZWQnKTsgfVxuXG4gICAgbGV0IGV4dHJhSGVhZGVyczogc3RyaW5nID0gXCJcIjtcbiAgICBsZXQgaHR0cFJlZmVycmVyOiBzdHJpbmcgPSBcIlwiO1xuXG4gICAgbGV0IHVzaW5nSGVhZGVyczogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtcbiAgICAgIC4uLnRoaXMuaGVhZGVycyxcbiAgICAgIC4uLmhlYWRlcnMsXG4gICAgfTtcblxuICAgIGZvcihsZXQgaGVhZGVyIGluIHVzaW5nSGVhZGVycyl7XG4gICAgICBpZihoZWFkZXIudG9Mb3dlckNhc2UoKSA9PT0gJ3JlZmVyZXInKXtcbiAgICAgICAgaHR0cFJlZmVycmVyID0gdXNpbmdIZWFkZXJzW2hlYWRlcl07XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBleHRyYUhlYWRlcnMgKz0gaGVhZGVyICsgJzogJyArIHVzaW5nSGVhZGVyc1toZWFkZXJdICsgXCJcXG5cIlxuICAgIH1cblxuICAgIGF3YWl0IHRoaXMud2ViQ29udGVudHMubG9hZFVSTCh1cmwsIHtcbiAgICAgIGV4dHJhSGVhZGVycyxcbiAgICAgIGh0dHBSZWZlcnJlclxuICAgIH0pO1xuICB9XG5cbiAgXG4gIGFzeW5jIGJhY2soKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgdGhpcy53ZWJDb250ZW50cy5nb0JhY2soKTtcbiAgfVxuXG4gIGFzeW5jIGZvcndhcmQoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgdGhpcy53ZWJDb250ZW50cy5nb0ZvcndhcmQoKTtcbiAgfVxuXG4gIGFzeW5jIHJlZnJlc2goKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgdGhpcy53ZWJDb250ZW50cy5yZWxvYWQoKTtcbiAgfVxuXG4gIGFzeW5jIGNsaWNrKHNlbGVjdG9yOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gdGhpcy5ldmFsdWF0ZV9ub3coKHNlbGVjdG9yKSA9PiB7XG4gICAgICAvL0B0cy1pZ25vcmVcbiAgICAgIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQuYmx1cigpXG4gICAgICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpXG4gICAgICBpZiAoIWVsZW1lbnQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmFibGUgdG8gZmluZCBlbGVtZW50IGJ5IHNlbGVjdG9yOiAnICsgc2VsZWN0b3IpXG4gICAgICB9XG4gICAgICB2YXIgYm91bmRpbmcgPSBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgICB2YXIgZXZlbnQgPSBuZXcgTW91c2VFdmVudCgnY2xpY2snLCB7XG4gICAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgICB2aWV3OiBkb2N1bWVudC53aW5kb3csXG4gICAgICAgIGJ1YmJsZXM6IHRydWUsXG4gICAgICAgIGNhbmNlbGFibGU6IHRydWUsXG4gICAgICAgIGNsaWVudFg6IGJvdW5kaW5nLmxlZnQgKyBib3VuZGluZy53aWR0aCAvIDIsXG4gICAgICAgIGNsaWVudFk6IGJvdW5kaW5nLnRvcCArIGJvdW5kaW5nLmhlaWdodCAvIDJcbiAgICAgIH0pO1xuXG4gICAgICBlbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuICAgIH0sIHNlbGVjdG9yKTtcbiAgfVxuXG4gIGFzeW5jIG1vdXNlZG93bihzZWxlY3Rvcjogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgYXdhaXQgdGhpcy5ldmFsdWF0ZV9ub3coKHNlbGVjdG9yKSA9PiB7XG4gICAgICBsZXQgZWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpXG4gICAgICBpZiAoIWVsZW1lbnQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmFibGUgdG8gZmluZCBlbGVtZW50IGJ5IHNlbGVjdG9yOiAnICsgc2VsZWN0b3IpXG4gICAgICB9XG5cbiAgICAgIGxldCBib3VuZGluZyA9IGVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cbiAgICAgIGxldCBldmVudCA9IG5ldyBNb3VzZUV2ZW50KCdtb3VzZWRvd24nLCB7XG4gICAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgICB2aWV3OiBkb2N1bWVudC53aW5kb3csXG4gICAgICAgIGJ1YmJsZXM6IHRydWUsXG4gICAgICAgIGNhbmNlbGFibGU6IHRydWUsXG4gICAgICAgIGNsaWVudFg6IGJvdW5kaW5nLmxlZnQgKyBib3VuZGluZy53aWR0aCAvIDIsXG4gICAgICAgIGNsaWVudFk6IGJvdW5kaW5nLnRvcCArIGJvdW5kaW5nLmhlaWdodCAvIDJcbiAgICAgIH0pO1xuICAgICAgXG4gICAgICAvL0B0cy1pZ25vcmVcbiAgICAgIGVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudClcbiAgICB9LCBzZWxlY3Rvcik7XG4gIH1cblxuICBcbiAgYXN5bmMgZXhpc3RzKHNlbGN0b3I6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHJldHVybiBhd2FpdCB0aGlzLmV2YWx1YXRlX25vdygoc2VsZWN0b3IpID0+IHtcbiAgICAgIGxldCBlbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7XG4gICAgICByZXR1cm4gZWxlbWVudCA/IHRydWUgOiBmYWxzZTtcbiAgICB9LCBzZWxjdG9yKTtcbiAgfVxuXG4gIGFzeW5jIG1vdXNldXAoc2VsZWN0b3I6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAgIGF3YWl0IHRoaXMuZXZhbHVhdGVfbm93KChzZWxlY3RvcikgPT4ge1xuICAgICAgbGV0IGVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKVxuICAgICAgaWYgKCFlbGVtZW50KSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignVW5hYmxlIHRvIGZpbmQgZWxlbWVudCBieSBzZWxlY3RvcjogJyArIHNlbGVjdG9yKVxuICAgICAgfVxuXG4gICAgICBsZXQgYm91bmRpbmcgPSBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgICBsZXQgZXZlbnQgPSBuZXcgTW91c2VFdmVudCgnbW91c2V1cCcsIHtcbiAgICAgICAgLy9AdHMtaWdub3JlXG4gICAgICAgIHZpZXc6IGRvY3VtZW50LndpbmRvdyxcbiAgICAgICAgYnViYmxlczogdHJ1ZSxcbiAgICAgICAgY2FuY2VsYWJsZTogdHJ1ZSxcbiAgICAgICAgY2xpZW50WDogYm91bmRpbmcubGVmdCArIGJvdW5kaW5nLndpZHRoIC8gMixcbiAgICAgICAgY2xpZW50WTogYm91bmRpbmcudG9wICsgYm91bmRpbmcuaGVpZ2h0IC8gMlxuICAgICAgfSk7XG4gICAgICBcbiAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgZWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KVxuICAgIH0sIHNlbGVjdG9yKTtcbiAgfVxuICBcbiAgYXN5bmMgbW91c2VvdmVyKHNlbGVjdG9yOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBhd2FpdCB0aGlzLmV2YWx1YXRlX25vdygoc2VsZWN0b3IpID0+IHtcbiAgICAgIGxldCBlbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3RvcilcbiAgICAgIGlmICghZWxlbWVudCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1VuYWJsZSB0byBmaW5kIGVsZW1lbnQgYnkgc2VsZWN0b3I6ICcgKyBzZWxlY3RvcilcbiAgICAgIH1cblxuICAgICAgbGV0IGJvdW5kaW5nID0gZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICAgICAgbGV0IGV2ZW50ID0gbmV3IE1vdXNlRXZlbnQoJ21vdXNlb3ZlcicsIHtcbiAgICAgICAgLy9AdHMtaWdub3JlXG4gICAgICAgIHZpZXc6IGRvY3VtZW50LndpbmRvdyxcbiAgICAgICAgYnViYmxlczogdHJ1ZSxcbiAgICAgICAgY2FuY2VsYWJsZTogdHJ1ZSxcbiAgICAgICAgY2xpZW50WDogYm91bmRpbmcubGVmdCArIGJvdW5kaW5nLndpZHRoIC8gMixcbiAgICAgICAgY2xpZW50WTogYm91bmRpbmcudG9wICsgYm91bmRpbmcuaGVpZ2h0IC8gMlxuICAgICAgfSk7XG4gICAgICBcbiAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgZWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KVxuICAgIH0sIHNlbGVjdG9yKTtcbiAgfVxuXG4gIGFzeW5jIG1vdXNlb3V0KHNlbGVjdG9yOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBhd2FpdCB0aGlzLmV2YWx1YXRlX25vdygoc2VsZWN0b3IpID0+IHtcbiAgICAgIGxldCBlbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3RvcilcbiAgICAgIGlmICghZWxlbWVudCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1VuYWJsZSB0byBmaW5kIGVsZW1lbnQgYnkgc2VsZWN0b3I6ICcgKyBzZWxlY3RvcilcbiAgICAgIH1cbiAgICAgIGxldCBldmVudCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdNb3VzZUV2ZW50JylcbiAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgZXZlbnQuaW5pdE1vdXNlRXZlbnQoJ21vdXNlb3V0JywgdHJ1ZSwgdHJ1ZSlcbiAgICAgIGVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudClcbiAgICB9LCBzZWxlY3Rvcik7XG4gIH1cblxuICBhc3luYyBmb2N1cyhzZWxlY3Rvcjogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIHRoaXMuZXZhbHVhdGVfbm93KChzZWxlY3RvcikgPT4ge1xuICAgICAgLy9AdHMtaWdub3JlXG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKS5mb2N1cygpO1xuICAgIH0sIHNlbGVjdG9yKTtcbiAgfVxuXG4gIGFzeW5jIGJsdXIoc2VsZWN0b3I6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiB0aGlzLmV2YWx1YXRlX25vdygoc2VsZWN0b3IpID0+IHtcbiAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgdmFyIGVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKVxuICAgICAgaWYgKGVsZW1lbnQpIHtcbiAgICAgICAgLy9AdHMtaWdub3JlXG4gICAgICAgIGVsZW1lbnQuYmx1cigpXG4gICAgICB9XG4gICAgfSwgc2VsZWN0b3IpO1xuICB9XG5cbiAgYXN5bmMgdHlwZShzZWxlY3Rvcjogc3RyaW5nLCB0ZXh0Pzogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgbGV0IGNoYXJzID0gU3RyaW5nKHRleHQpLnNwbGl0KCcnKTtcblxuICAgIGxldCB0eXBlSW50ZXJ2YWwgPSAyNTA7XG5cbiAgICBhd2FpdCB0aGlzLmZvY3VzKHNlbGVjdG9yKTtcblxuICAgIGZvcihsZXQgY2hhciBvZiBjaGFycyl7XG4gICAgICB0aGlzLndlYkNvbnRlbnRzLnNlbmRJbnB1dEV2ZW50KHtcbiAgICAgICAgdHlwZTogJ2tleURvd24nLFxuICAgICAgICAvL0B0cy1pZ25vcmVcbiAgICAgICAga2V5Q29kZTogY2hhcixcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLndlYkNvbnRlbnRzLnNlbmRJbnB1dEV2ZW50KHtcbiAgICAgICAgdHlwZTogJ2NoYXInLFxuICAgICAgICAvL0B0cy1pZ25vcmVcbiAgICAgICAga2V5Q29kZTogY2hhcixcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLndlYkNvbnRlbnRzLnNlbmRJbnB1dEV2ZW50KHtcbiAgICAgICAgdHlwZTogJ2tleVVwJyxcbiAgICAgICAgLy9AdHMtaWdub3JlXG4gICAgICAgIGtleUNvZGU6IGNoYXIsXG4gICAgICB9KTtcblxuICAgICAgYXdhaXQgZGVsYXkodHlwZUludGVydmFsKTtcbiAgICB9XG5cbiAgICBhd2FpdCB0aGlzLmJsdXIoc2VsZWN0b3IpO1xuICB9XG5cbiAgXG4gIGFzeW5jIGluc2VydChzZWxlY3Rvcjogc3RyaW5nLCB0ZXh0Pzogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuZXZhbHVhdGVfbm93KChzZWxlY3RvciwgdGV4dCkgPT4ge1xuICAgICAgLy9AdHMtaWdub3JlXG4gICAgICBkb2N1bWVudC5hY3RpdmVFbGVtZW50LmJsdXIoKVxuICAgICAgbGV0IGVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcblxuICAgICAgaWYgKCFlbGVtZW50KSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignVW5hYmxlIHRvIGZpbmQgZWxlbWVudCBieSBzZWxlY3RvcjogJyArIHNlbGVjdG9yKVxuICAgICAgfVxuICAgICAgLy9AdHMtaWdub3JlXG4gICAgICBlbGVtZW50LnZhbHVlID0gdGV4dCA/IHRleHQgOiAnJztcbiAgICB9LCBzZWxlY3RvciwgdGV4dCk7XG4gIH1cblxuICBcbiAgYXN5bmMgY2hlY2soc2VsZWN0b3I6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAgIGF3YWl0IHRoaXMuZXZhbHVhdGVfbm93KChzZWxlY3RvcikgPT4ge1xuICAgICAgbGV0IGVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcblxuICAgICAgaWYgKCFlbGVtZW50KSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignVW5hYmxlIHRvIGZpbmQgZWxlbWVudCBieSBzZWxlY3RvcjogJyArIHNlbGVjdG9yKVxuICAgICAgfVxuXG4gICAgICBsZXQgZXZlbnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnSFRNTEV2ZW50cycpO1xuICAgICAgKGVsZW1lbnQgYXMgSFRNTElucHV0RWxlbWVudCkuY2hlY2tlZCA9IHRydWU7XG4gICAgICBldmVudC5pbml0RXZlbnQoJ2NoYW5nZScsIHRydWUsIHRydWUpO1xuICAgICAgZWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcbiAgICB9LCBzZWxlY3Rvcik7XG4gIH1cblxuICBcbiAgYXN5bmMgdW5jaGVjayhzZWxlY3Rvcjogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgdGhpcy5ldmFsdWF0ZV9ub3coKHNlbGVjdG9yKSA9PiB7XG4gICAgICBsZXQgZWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xuICAgICAgaWYgKCFlbGVtZW50KSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignVW5hYmxlIHRvIGZpbmQgZWxlbWVudCBieSBzZWxlY3RvcjogJyArIHNlbGVjdG9yKVxuICAgICAgfVxuICAgICAgbGV0IGV2ZW50ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0hUTUxFdmVudHMnKTtcbiAgICAgIChlbGVtZW50IGFzIEhUTUxJbnB1dEVsZW1lbnQpLmNoZWNrZWQgPSBmYWxzZTtcbiAgICAgIGV2ZW50LmluaXRFdmVudCgnY2hhbmdlJywgdHJ1ZSwgdHJ1ZSk7XG4gICAgICBlbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuICAgIH0sIHNlbGVjdG9yKTtcbiAgfVxuXG5cbiAgYXN5bmMgc2VsZWN0KHNlbGVjdG9yOiBzdHJpbmcsIG9wdGlvbj86IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAgIHRoaXMuZXZhbHVhdGVfbm93KChzZWxlY3RvcikgPT4ge1xuICAgICAgbGV0IGVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcbiAgICAgIGlmICghZWxlbWVudCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1VuYWJsZSB0byBmaW5kIGVsZW1lbnQgYnkgc2VsZWN0b3I6ICcgKyBzZWxlY3RvcilcbiAgICAgIH1cbiAgICAgIGxldCBldmVudCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdIVE1MRXZlbnRzJyk7XG4gICAgICAoZWxlbWVudCBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZSA9IG9wdGlvbiA/IG9wdGlvbiA6ICcnO1xuICAgICAgZXZlbnQuaW5pdEV2ZW50KCdjaGFuZ2UnLCB0cnVlLCB0cnVlKTtcbiAgICAgIGVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XG4gICAgfSwgc2VsZWN0b3IpO1xuICB9XG5cbiAgYXN5bmMgc2Nyb2xsVG8odG9wOiBudW1iZXIsIGxlZnQ6IG51bWJlcik6IFByb21pc2U8dm9pZD4ge1xuICAgIGF3YWl0IHRoaXMuZXZhbHVhdGVfbm93KCh0b3AsIGxlZnQpID0+IHtcbiAgICAgIHdpbmRvdy5zY3JvbGxUbyh7IHRvcCwgbGVmdCB9KTtcbiAgICB9LCB0b3AsIGxlZnQpO1xuICB9XG5cbiAgYXN5bmMgaHRtbCgpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIHJldHVybiB0aGlzLmV2YWx1YXRlX25vdygoKSA9PiB7XG4gICAgICByZXR1cm4gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50Lm91dGVySFRNTFxuICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgdmlld3BvcnQod2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBzd2l0Y2godGhpcy5idXNUeXBlKXtcbiAgICAgIGNhc2UgRWxlY3Ryb2xpemVyVHlwZS53ZWJ2aWV3OlxuICAgICAgICByZXR1cm47XG4gICAgICBjYXNlIEVsZWN0cm9saXplclR5cGUuYnJvd3NlclZpZXc6XG4gICAgICAgIGxldCBidmJ1eCA9IHRoaXMuYnVzIGFzIEVsZWN0cm9uU2hpbXMuQnJvd3NlcldpbmRvd1ZpZXdMaWtlO1xuICAgICAgICAvL0B0cy1pZ25vcmVcbiAgICAgICAgbGV0IGJvdW5kcyA9IGJ2YnV4LmdldEJvdW5kcygpIGFzIEVsZWN0cm9uLlJlY3RhbmdsZTtcbiAgICAgICAgLy9AdHMtaWdub3JlXG4gICAgICAgIGJ2YnV4LnNldEJvdW5kcyh7XG4gICAgICAgICAgLi4uYm91bmRzLFxuICAgICAgICAgIHdpZHRoLFxuICAgICAgICAgIGhlaWdodFxuICAgICAgICB9KVxuICAgICAgICByZXR1cm47XG4gICAgICBjYXNlIEVsZWN0cm9saXplclR5cGUuYnJvd3NlcldpbmRvdzpcbiAgICAgICAgLy9AdHMtaWdub3JlXG4gICAgICAgICh0aGlzLmJ1cyBhcyAoRWxlY3Ryb25TaGltcy5Ccm93c2VyV2luZG93Vmlld0xpa2UpKS5zZXRTaXplKHdpZHRoLCBoZWlnaHQpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgaW5qZWN0KHR5cGU6ICdqcycgfCAnY3NzJywgZmlsZTogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgbGV0IGNvbnRlbnRzID0gYXdhaXQgcHJvbWlzZXMucmVhZEZpbGUoZmlsZSwgeyBlbmNvZGluZzogJ3V0Zi04JyB9KSBhcyBzdHJpbmc7XG4gICAgc3dpdGNoKHR5cGUpe1xuICAgICAgY2FzZSAnanMnOlxuICAgICAgICBhd2FpdCB0aGlzLl9pbmplY3QoY29udGVudHMpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2Nzcyc6XG4gICAgICAgIHRoaXMud2ViQ29udGVudHMuaW5zZXJ0Q1NTKGNvbnRlbnRzKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgZXZhbHVhdGU8VCwgSyBleHRlbmRzIGFueVtdLCBSPihmbjogKC4uLmFyZ3M6IFB1c2g8SywgVD4pID0+IFIsIC4uLmFyZ3M6IEspOiBQcm9taXNlPFI+IHtcbiAgICByZXR1cm4gdGhpcy5ldmFsdWF0ZV9ub3coZm4sIC4uLmFyZ3MpO1xuICB9XG4gIFxuICBwcml2YXRlIHJldHJ5KGZuOiAoKSA9PiBQcm9taXNlPEJvb2xlYW4+LCB0aW1lb3V0OiBudW1iZXIsIHNvZnRUaW1lb3V0PzogbnVtYmVyKTogKCkgPT4gUHJvbWlzZTx2b2lkPiB7XG4gICAgbGV0IGVycm9yOiBFcnJvciB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcbiAgICBsZXQgcnVubmluZzogYm9vbGVhbiA9IHRydWU7XG5cbiAgICBsZXQgcnVubmVyID0gYXN5bmMgKCkgPT4ge1xuXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHsgXG4gICAgICAgIHJ1bm5pbmcgPSBmYWxzZTsgXG4gICAgICAgIGVycm9yID0gbmV3IEVycm9yKCd0aW1lZCBvdXQnKTtcbiAgICAgIH0sIHNvZnRUaW1lb3V0ID8gc29mdFRpbWVvdXQgOiB0aW1lb3V0KTtcblxuICAgICAgd2hpbGUocnVubmluZyl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgbGV0IHJlc3VsdCA9IGF3YWl0IGZuKCk7XG4gICAgICAgICAgXG4gICAgICAgICAgaWYocmVzdWx0KXsgcnVubmluZyA9IGZhbHNlOyB9XG4gIFxuICAgICAgICB9IGNhdGNoIChfZXJyb3Ipe1xuICAgICAgICAgIHJ1bm5pbmcgPSBmYWxzZTtcbiAgICAgICAgICBlcnJvciA9IF9lcnJvcjtcbiAgICAgICAgfVxuICAgICAgfVxuICBcbiAgICAgIGlmKGVycm9yKXtcbiAgICAgICAgaWYoIXNvZnRUaW1lb3V0KXtcbiAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICByZXR1cm4gcnVubmVyO1xuICB9XG5cbiAgYXN5bmMgd2FpdChtczogbnVtYmVyKTogUHJvbWlzZTx2b2lkPlxuICBhc3luYyB3YWl0KHNlbGVjdG9yOiBzdHJpbmcsIG1zRGVsYXk/OiBudW1iZXIpOiBQcm9taXNlPHZvaWQ+IFxuICBhc3luYyB3YWl0PFQsIEsgZXh0ZW5kcyBhbnlbXT4oZm46ICguLi5hcmdzOiBQdXNoPEssIFQ+KSA9PiBib29sZWFuICB8IFByb21pc2U8Ym9vbGVhbj4sIC4uLmFyZ3M6IEspOiBQcm9taXNlPHZvaWQ+XG4gIGFzeW5jIHdhaXQoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgbGV0IGJsb2NrOiAoKSA9PiBQcm9taXNlPHZvaWQ+O1xuXG4gICAgbGV0IGVycm9yVGltZW91dCA9IDMwMDAwO1xuXG4gICAgc3dpdGNoKHR5cGVvZiBhcmd1bWVudHNbMF0pe1xuICAgICAgY2FzZSBcIm51bWJlclwiOlxuICAgICAgICBibG9jayA9IGRlbGF5LmJpbmQobnVsbCwgYXJndW1lbnRzWzBdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwic3RyaW5nXCI6XG4gICAgICAgIGJsb2NrID0gdGhpcy5yZXRyeSgoKSA9PiB0aGlzLmV4aXN0cyhhcmd1bWVudHNbMF0pLCBlcnJvclRpbWVvdXQsIGFyZ3VtZW50c1sxXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcImZ1bmN0aW9uXCI6XG4gICAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgICBibG9jayA9IHRoaXMucmV0cnkoKCkgPT4gdGhpcy5ldmFsdWF0ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpLCBlcnJvclRpbWVvdXQpO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgYmxvY2sgPSBhc3luYyAoKSA9PiB7fTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgYXdhaXQgYmxvY2soKTtcbiAgfVxuXG4gIGFzeW5jIHVybCgpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIHJldHVybiB0aGlzLndlYkNvbnRlbnRzLmdldFVSTCgpO1xuICB9XG5cbiAgYXN5bmMgcGF0aCgpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIHJldHVybiBhd2FpdCB0aGlzLmV2YWx1YXRlX25vdygoKSA9PiBkb2N1bWVudC5sb2NhdGlvbi5wYXRobmFtZSk7XG4gIH1cblxuICBhc3luYyB0aXRsZSgpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIHJldHVybiBhd2FpdCB0aGlzLmV2YWx1YXRlX25vdygoKSA9PiBkb2N1bWVudC50aXRsZSk7XG4gIH1cblxuICBhc3luYyBwZGYob3B0aW9ucz86IEVsZWN0cm9uLlByaW50VG9QREZPcHRpb25zKTogUHJvbWlzZTxCdWZmZXI+IHtcbiAgICBsZXQgb3B0OiBFbGVjdHJvbi5QcmludFRvUERGT3B0aW9ucyA9IHtcbiAgICAgIG1hcmdpbnNUeXBlOiAwLFxuICAgICAgcHJpbnRCYWNrZ3JvdW5kOiB0cnVlLFxuICAgICAgcHJpbnRTZWxlY3Rpb25Pbmx5OiBmYWxzZSxcbiAgICAgIGxhbmRzY2FwZTogZmFsc2UsXG4gICAgICAuLi5vcHRpb25zLFxuICAgIH07XG5cbiAgICByZXR1cm4gYXdhaXQgdGhpcy53ZWJDb250ZW50cy5wcmludFRvUERGKG9wdCk7XG4gIH1cblxuICBhc3luYyBzY3JlZW5zaG90KHJlY3Q/OiBFbGVjdHJvbi5SZWN0YW5nbGUsIG9wdGlvbnM/OiBFbGVjdHJvbi5Ub1BOR09wdGlvbnMpOiBQcm9taXNlPEJ1ZmZlcj4ge1xuICAgIGxldCBjYXB0dXJlID0gYXdhaXQgdGhpcy53ZWJDb250ZW50cy5jYXB0dXJlUGFnZShyZWN0KTtcbiAgICByZXR1cm4gY2FwdHVyZS50b1BORyhvcHRpb25zKTtcbiAgfVxuICBcbiAgYXN5bmMgaGVhZGVyKGhlYWRlcj86IHN0cmluZywgdmFsdWU/OiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBpZih0eXBlb2YgaGVhZGVyID09PSBcInN0cmluZ1wiICYmIHR5cGVvZiB2YWx1ZSAhPT0gXCJ1bmRlZmluZWRcIil7XG4gICAgICB0aGlzLmhlYWRlcnNbaGVhZGVyXSA9IHZhbHVlO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmhlYWRlcnMgPSB7fTtcbiAgICB9XG4gIH1cblxuICBhc3luYyB1c2VyYWdlbnQodXNlcmFnZW50OiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICB0aGlzLndlYkNvbnRlbnRzLnNldFVzZXJBZ2VudCh1c2VyYWdlbnQpO1xuICB9XG4gIFxuICBwcml2YXRlIGxvZ2luRXZlbnRMaXN0ZW5lciA6IChldmVudDogRWxlY3Ryb24uRXZlbnQsIHJlcXVlc3Q6IEVsZWN0cm9uLlJlcXVlc3QsIGF1dGhJbmZvOiBFbGVjdHJvbi5BdXRoSW5mbywgY2FsbGJhY2s6ICh1c2VybmFtZTogc3RyaW5nLCBwYXNzd29yZDogc3RyaW5nKSA9PiB2b2lkKSA9PiB2b2lkID0gKCkgPT4ge31cblxuICBhc3luYyBhdXRoZW50aWNhdGlvbih1c2VybmFtZTogc3RyaW5nLCBwYXNzd29yZDogc3RyaW5nKXtcbiAgICBsZXQgYXR0ZW1wdHMgPSAwO1xuICAgIGxldCBjdXJyZW50VVJMID0gXCJcIjtcblxuICAgIHRoaXMud2ViQ29udGVudHMucmVtb3ZlTGlzdGVuZXIoJ2xvZ2luJywgdGhpcy5sb2dpbkV2ZW50TGlzdGVuZXIpO1xuXG4gICAgcmV0dXJuIGF3YWl0IG5ldyBQcm9taXNlPHZvaWQ+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHRoaXMubG9naW5FdmVudExpc3RlbmVyID0gKGV2ZW50LCByZXF1ZXN0LCBhdXRoSW5mbywgY2FsbGJhY2spID0+IHtcbiAgICAgICAgaWYoY3VycmVudFVSTCAhPT0gcmVxdWVzdC51cmwpe1xuICAgICAgICAgIGF0dGVtcHRzID0gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKGF0dGVtcHRzID49IDQpe1xuICAgICAgICAgIC8vIG5lZWQgdG8gaGFuZGxlIGVycm9yO1xuICAgICAgICAgIHRoaXMud2ViQ29udGVudHMucmVtb3ZlTGlzdGVuZXIoJ2xvZ2luJywgdGhpcy5sb2dpbkV2ZW50TGlzdGVuZXIpO1xuICAgICAgICAgIHJldHVybiBjYWxsYmFjayh1c2VybmFtZSwgcGFzc3dvcmQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGNhbGxiYWNrKHVzZXJuYW1lLCBwYXNzd29yZCk7XG4gICAgICB9O1xuXG4gICAgICB0aGlzLndlYkNvbnRlbnRzLm9uKCdsb2dpbicsIHRoaXMubG9naW5FdmVudExpc3RlbmVyKTtcblxuICAgICAgcmV0dXJuIHJlc29sdmUoKTtcbiAgICB9KTtcbiAgfVxufSJdfQ==