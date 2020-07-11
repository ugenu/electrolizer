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

      yield _this3.webContents.loadURL(url);
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
    return (0, _asyncToGenerator2.default)(function* () {})();
  }

  exists(selctor) {
    var _this8 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      return yield _this8.evaluate_now(selector => {
        var element = document.querySelector(selector);
        return element ? true : false;
      }, selctor);
    })();
  }

  mouseup(selector) {
    return (0, _asyncToGenerator2.default)(function* () {})();
  }

  mouseover(selector) {
    return (0, _asyncToGenerator2.default)(function* () {})();
  }

  mouseout(selector) {
    var _this9 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      yield _this9.evaluate_now(selector => {
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
    var _this10 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      return _this10.evaluate_now(selector => {
        //@ts-ignore
        document.querySelector(selector).focus();
      }, selector);
    })();
  }

  blur(selector) {
    var _this11 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      return _this11.evaluate_now(selector => {
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
    var _this12 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      var chars = String(text).split('');
      var typeInterval = 250;
      yield _this12.focus(selector);

      for (var char of chars) {
        _this12.webContents.sendInputEvent({
          type: 'keyDown',
          //@ts-ignore
          keyCode: char
        });

        _this12.webContents.sendInputEvent({
          type: 'char',
          //@ts-ignore
          keyCode: char
        });

        _this12.webContents.sendInputEvent({
          type: 'keyUp',
          //@ts-ignore
          keyCode: char
        });

        yield (0, _delay.delay)(typeInterval);
      }

      yield _this12.blur(selector);
    })();
  }

  insert(selector, text) {
    var _this13 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      return yield _this13.evaluate_now((selector, text) => {
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
    var _this14 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      yield _this14.evaluate_now(selector => {
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
    var _this15 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      _this15.evaluate_now(selector => {
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
    var _this16 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      _this16.evaluate_now(selector => {
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
    var _this17 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      yield _this17.evaluate_now((top, left) => {
        window.scrollTo({
          top,
          left
        });
      }, top, left);
    })();
  }

  html() {
    var _this18 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      return _this18.evaluate_now(() => {
        return document.documentElement.outerHTML;
      });
    })();
  }

  viewport(width, height) {
    var _this19 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      switch (_this19.busType) {
        case _electrolizer.ElectrolizerType.webview:
          return;

        case _electrolizer.ElectrolizerType.browserView:
          var bvbux = _this19.bus; //@ts-ignore

          var bounds = bvbux.getBounds();
          bvbux.setBounds(_objectSpread(_objectSpread({}, bounds), {}, {
            width,
            height
          }));
          return;

        case _electrolizer.ElectrolizerType.browserWindow:
          _this19.bus.setSize(width, height);

          return;
      }
    })();
  }

  inject(type, file) {
    var _this20 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      var contents = yield _fs.promises.readFile(file, {
        encoding: 'utf-8'
      });

      switch (type) {
        case 'js':
          yield _this20._inject(contents);
          break;

        case 'css':
          _this20.webContents.insertCSS(contents);

          break;
      }
    })();
  }

  evaluate(fn) {
    var _arguments3 = arguments,
        _this21 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      for (var _len2 = _arguments3.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = _arguments3[_key2];
      }

      return _this21.evaluate_now(fn, ...args);
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
        _this22 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      var block;
      var errorTimeout = 30000;

      switch (typeof _arguments4[0]) {
        case "number":
          block = _delay.delay.bind(null, _arguments4[0]);
          break;

        case "string":
          block = _this22.retry(() => _this22.exists(_arguments4[0]), errorTimeout, _arguments4[1]);
          break;

        case "function":
          //@ts-ignore
          block = _this22.retry(() => _this22.evaluate.apply(_this22, _arguments4), errorTimeout);

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

  header(header, value) {
    return (0, _asyncToGenerator2.default)(function* () {})();
  }

  useragent(useragent) {
    var _this23 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      _this23.webContents.setUserAgent(useragent);
    })();
  }

  authentication(username, password) {
    var _this24 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      var attempts = 0;
      var currentURL = "";

      _this24.webContents.removeListener('login', _this24.loginEventListener);

      return yield new Promise((resolve, reject) => {
        _this24.loginEventListener = (event, request, authInfo, callback) => {
          if (currentURL !== request.url) {
            attempts = 1;
          }

          if (attempts >= 4) {
            // need to handle error;
            _this24.webContents.removeListener('login', _this24.loginEventListener);

            return callback(username, password);
          }

          return callback(username, password);
        };

        _this24.webContents.on('login', _this24.loginEventListener);

        return resolve();
      });
    })();
  }

}

exports.Driver = Driver;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9kcml2ZXJzL2RyaXZlci5jbGFzcy50cyJdLCJuYW1lcyI6WyJEcml2ZXIiLCJjb25zdHJ1Y3RvciIsImJ1cyIsIkNvb2tpZXMiLCJ3ZWJDb250ZW50cyIsImJ1c1R5cGUiLCJpbnN0YW5jZU9mVGVzdCIsIkJyb3dzZXJWaWV3IiwiZXJyb3IiLCJFbGVjdHJvbGl6ZXJUeXBlIiwid2VidmlldyIsImJyb3dzZXJWaWV3IiwiQnJvd3NlcldpbmRvdyIsImJyb3dzZXJXaW5kb3ciLCJfaW5qZWN0IiwiZm4iLCJfYXJncyIsIkFycmF5IiwicHJvdG90eXBlIiwic2xpY2UiLCJjYWxsIiwiYXJndW1lbnRzIiwibWFwIiwiYXJndW1lbnQiLCJKU09OIiwic3RyaW5naWZ5Iiwic3RyaW5nRm4iLCJTdHJpbmciLCJzb3VyY2UiLCJhcmdzIiwiZXhlY3V0ZUphdmFTY3JpcHQiLCJldmFsdWF0ZV9ub3ciLCJnb3RvIiwidXJsIiwiaGVhZGVycyIsIkVycm9yIiwibG9hZFVSTCIsImJhY2siLCJnb0JhY2siLCJmb3J3YXJkIiwiZ29Gb3J3YXJkIiwicmVmcmVzaCIsInJlbG9hZCIsImNsaWNrIiwic2VsZWN0b3IiLCJkb2N1bWVudCIsImFjdGl2ZUVsZW1lbnQiLCJibHVyIiwiZWxlbWVudCIsInF1ZXJ5U2VsZWN0b3IiLCJib3VuZGluZyIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsImV2ZW50IiwiTW91c2VFdmVudCIsInZpZXciLCJ3aW5kb3ciLCJidWJibGVzIiwiY2FuY2VsYWJsZSIsImNsaWVudFgiLCJsZWZ0Iiwid2lkdGgiLCJjbGllbnRZIiwidG9wIiwiaGVpZ2h0IiwiZGlzcGF0Y2hFdmVudCIsIm1vdXNlZG93biIsImV4aXN0cyIsInNlbGN0b3IiLCJtb3VzZXVwIiwibW91c2VvdmVyIiwibW91c2VvdXQiLCJjcmVhdGVFdmVudCIsImluaXRNb3VzZUV2ZW50IiwiZm9jdXMiLCJ0eXBlIiwidGV4dCIsImNoYXJzIiwic3BsaXQiLCJ0eXBlSW50ZXJ2YWwiLCJjaGFyIiwic2VuZElucHV0RXZlbnQiLCJrZXlDb2RlIiwiaW5zZXJ0IiwidmFsdWUiLCJjaGVjayIsImNoZWNrZWQiLCJpbml0RXZlbnQiLCJ1bmNoZWNrIiwic2VsZWN0Iiwib3B0aW9uIiwic2Nyb2xsVG8iLCJodG1sIiwiZG9jdW1lbnRFbGVtZW50Iiwib3V0ZXJIVE1MIiwidmlld3BvcnQiLCJidmJ1eCIsImJvdW5kcyIsImdldEJvdW5kcyIsInNldEJvdW5kcyIsInNldFNpemUiLCJpbmplY3QiLCJmaWxlIiwiY29udGVudHMiLCJwcm9taXNlcyIsInJlYWRGaWxlIiwiZW5jb2RpbmciLCJpbnNlcnRDU1MiLCJldmFsdWF0ZSIsInJldHJ5IiwidGltZW91dCIsInNvZnRUaW1lb3V0IiwidW5kZWZpbmVkIiwicnVubmluZyIsInJ1bm5lciIsInNldFRpbWVvdXQiLCJyZXN1bHQiLCJfZXJyb3IiLCJ3YWl0IiwiYmxvY2siLCJlcnJvclRpbWVvdXQiLCJkZWxheSIsImJpbmQiLCJhcHBseSIsImhlYWRlciIsInVzZXJhZ2VudCIsInNldFVzZXJBZ2VudCIsImF1dGhlbnRpY2F0aW9uIiwidXNlcm5hbWUiLCJwYXNzd29yZCIsImF0dGVtcHRzIiwiY3VycmVudFVSTCIsInJlbW92ZUxpc3RlbmVyIiwibG9naW5FdmVudExpc3RlbmVyIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJyZXF1ZXN0IiwiYXV0aEluZm8iLCJjYWxsYmFjayIsIm9uIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7O0FBR0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7OztBQUVPLE1BQU1BLE1BQU4sQ0FBb0c7QUFJekdDLEVBQUFBLFdBQVcsQ0FBV0MsR0FBWCxFQUFrQjtBQUFBLFNBQVBBLEdBQU8sR0FBUEEsR0FBTztBQUFBLG1EQUZuQixJQUFJQyxnQkFBSixDQUFZLEtBQUtDLFdBQWpCLENBRW1CO0FBQUEsOERBeVdrSixNQUFNLENBQUUsQ0F6VzFKO0FBQUU7O0FBRy9CLE1BQUlDLE9BQUosR0FBZ0M7QUFDOUIsUUFBSTtBQUNGLFVBQUlDLGNBQWMsR0FBRyxLQUFLSixHQUFMLFlBQW9CSyxxQkFBekM7QUFDRCxLQUZELENBRUUsT0FBTUMsS0FBTixFQUFZO0FBQ1osYUFBT0MsK0JBQWlCQyxPQUF4QjtBQUNEOztBQUVELFFBQUcsS0FBS1IsR0FBTCxZQUFvQksscUJBQXZCLEVBQW1DO0FBQ2pDLGFBQU9FLCtCQUFpQkUsV0FBeEI7QUFDRDs7QUFFRCxRQUFHLEtBQUtULEdBQUwsWUFBb0JVLHVCQUF2QixFQUFxQztBQUNuQyxhQUFPSCwrQkFBaUJJLGFBQXhCO0FBQ0Q7O0FBRUQsV0FBT0osK0JBQWlCQyxPQUF4QjtBQUNEOztBQUdELE1BQUlOLFdBQUosR0FBK0I7QUFDN0IsWUFBTyxLQUFLQyxPQUFaO0FBQ0UsV0FBS0ksK0JBQWlCQyxPQUF0QjtBQUNFO0FBQ0EsZUFBUSxLQUFLUixHQUFiO0FBSEo7O0FBTUEsV0FBUSxLQUFLQSxHQUFOLENBQTRCRSxXQUFuQztBQUNEOztBQUdhVSxFQUFBQSxPQUFkLENBQXNCQyxFQUF0QixFQUFpRDtBQUFBO0FBQUE7O0FBQUE7QUFDL0MsVUFBSUMsS0FBSyxHQUFHQyxLQUFLLENBQUNDLFNBQU4sQ0FBZ0JDLEtBQWhCLENBQXNCQyxJQUF0QixDQUEyQkMsVUFBM0IsRUFBc0NGLEtBQXRDLENBQTRDLENBQTVDLEVBQStDRyxHQUEvQyxDQUFtREMsUUFBUSxJQUFJO0FBQ3pFLGVBQU87QUFBRUEsVUFBQUEsUUFBUSxFQUFFQyxJQUFJLENBQUNDLFNBQUwsQ0FBZUYsUUFBZjtBQUFaLFNBQVA7QUFDRCxPQUZXLENBQVo7O0FBSUEsVUFBSUcsUUFBUSxHQUFHQyxNQUFNLENBQUNaLEVBQUQsQ0FBckI7QUFDQSxVQUFJYSxNQUFNLEdBQUcsd0JBQU87QUFBQ2IsUUFBQUEsRUFBRSxFQUFFVyxRQUFMO0FBQWVHLFFBQUFBLElBQUksRUFBRWI7QUFBckIsT0FBUCxDQUFiO0FBRUEsbUJBQWEsS0FBSSxDQUFDWixXQUFMLENBQWlCMEIsaUJBQWpCLENBQW1DRixNQUFuQyxFQUEyQyxJQUEzQyxDQUFiO0FBUitDO0FBU2hEOztBQUdhRyxFQUFBQSxZQUFkLENBQWtEaEIsRUFBbEQsRUFBMEc7QUFBQTtBQUFBOztBQUFBO0FBQUEsMENBQXJCYyxJQUFxQjtBQUFyQkEsUUFBQUEsSUFBcUI7QUFBQTs7QUFDeEcsVUFBSWIsS0FBSyxHQUFHQyxLQUFLLENBQUNDLFNBQU4sQ0FBZ0JDLEtBQWhCLENBQXNCQyxJQUF0QixDQUEyQkMsV0FBM0IsRUFBc0NGLEtBQXRDLENBQTRDLENBQTVDLEVBQStDRyxHQUEvQyxDQUFtREMsUUFBUSxJQUFJO0FBQ3pFLGVBQU87QUFBRUEsVUFBQUEsUUFBUSxFQUFFQyxJQUFJLENBQUNDLFNBQUwsQ0FBZUYsUUFBZjtBQUFaLFNBQVA7QUFDRCxPQUZXLENBQVo7O0FBSUEsVUFBSUcsUUFBUSxHQUFHQyxNQUFNLENBQUNaLEVBQUQsQ0FBckI7QUFDQSxVQUFJYSxNQUFNLEdBQUcseUJBQVE7QUFBQ2IsUUFBQUEsRUFBRSxFQUFFVyxRQUFMO0FBQWVHLFFBQUFBLElBQUksRUFBRWI7QUFBckIsT0FBUixDQUFiO0FBRUEsbUJBQWEsTUFBSSxDQUFDWixXQUFMLENBQWlCMEIsaUJBQWpCLENBQW1DRixNQUFuQyxFQUEyQyxJQUEzQyxDQUFiO0FBUndHO0FBU3pHOztBQUdLSSxFQUFBQSxJQUFOLENBQVdDLEdBQVgsRUFBd0JDLE9BQXhCLEVBQXlFO0FBQUE7O0FBQUE7QUFDdkUsVUFBRyxDQUFDRCxHQUFKLEVBQVE7QUFBRSxjQUFNLElBQUlFLEtBQUosQ0FBVSxxQkFBVixDQUFOO0FBQXlDOztBQUNuRCxZQUFNLE1BQUksQ0FBQy9CLFdBQUwsQ0FBaUJnQyxPQUFqQixDQUF5QkgsR0FBekIsQ0FBTjtBQUZ1RTtBQUd4RTs7QUFHS0ksRUFBQUEsSUFBTixHQUE0QjtBQUFBOztBQUFBO0FBQzFCLE1BQUEsTUFBSSxDQUFDakMsV0FBTCxDQUFpQmtDLE1BQWpCO0FBRDBCO0FBRTNCOztBQUVLQyxFQUFBQSxPQUFOLEdBQStCO0FBQUE7O0FBQUE7QUFDN0IsTUFBQSxNQUFJLENBQUNuQyxXQUFMLENBQWlCb0MsU0FBakI7QUFENkI7QUFFOUI7O0FBRUtDLEVBQUFBLE9BQU4sR0FBK0I7QUFBQTs7QUFBQTtBQUM3QixNQUFBLE1BQUksQ0FBQ3JDLFdBQUwsQ0FBaUJzQyxNQUFqQjtBQUQ2QjtBQUU5Qjs7QUFFS0MsRUFBQUEsS0FBTixDQUFZQyxRQUFaLEVBQTZDO0FBQUE7O0FBQUE7QUFDM0MsYUFBTyxNQUFJLENBQUNiLFlBQUwsQ0FBbUJhLFFBQUQsSUFBYztBQUNyQztBQUNBQyxRQUFBQSxRQUFRLENBQUNDLGFBQVQsQ0FBdUJDLElBQXZCO0FBQ0EsWUFBSUMsT0FBTyxHQUFHSCxRQUFRLENBQUNJLGFBQVQsQ0FBdUJMLFFBQXZCLENBQWQ7O0FBQ0EsWUFBSSxDQUFDSSxPQUFMLEVBQWM7QUFDWixnQkFBTSxJQUFJYixLQUFKLENBQVUseUNBQXlDUyxRQUFuRCxDQUFOO0FBQ0Q7O0FBQ0QsWUFBSU0sUUFBUSxHQUFHRixPQUFPLENBQUNHLHFCQUFSLEVBQWY7QUFDQSxZQUFJQyxLQUFLLEdBQUcsSUFBSUMsVUFBSixDQUFlLE9BQWYsRUFBd0I7QUFDbEM7QUFDQUMsVUFBQUEsSUFBSSxFQUFFVCxRQUFRLENBQUNVLE1BRm1CO0FBR2xDQyxVQUFBQSxPQUFPLEVBQUUsSUFIeUI7QUFJbENDLFVBQUFBLFVBQVUsRUFBRSxJQUpzQjtBQUtsQ0MsVUFBQUEsT0FBTyxFQUFFUixRQUFRLENBQUNTLElBQVQsR0FBZ0JULFFBQVEsQ0FBQ1UsS0FBVCxHQUFpQixDQUxSO0FBTWxDQyxVQUFBQSxPQUFPLEVBQUVYLFFBQVEsQ0FBQ1ksR0FBVCxHQUFlWixRQUFRLENBQUNhLE1BQVQsR0FBa0I7QUFOUixTQUF4QixDQUFaO0FBU0FmLFFBQUFBLE9BQU8sQ0FBQ2dCLGFBQVIsQ0FBc0JaLEtBQXRCO0FBQ0QsT0FsQk0sRUFrQkpSLFFBbEJJLENBQVA7QUFEMkM7QUFvQjVDOztBQUVLcUIsRUFBQUEsU0FBTixDQUFnQnJCLFFBQWhCLEVBQWlEO0FBQUE7QUFFaEQ7O0FBR0tzQixFQUFBQSxNQUFOLENBQWFDLE9BQWIsRUFBZ0Q7QUFBQTs7QUFBQTtBQUM5QyxtQkFBYSxNQUFJLENBQUNwQyxZQUFMLENBQW1CYSxRQUFELElBQWM7QUFDM0MsWUFBSUksT0FBTyxHQUFHSCxRQUFRLENBQUNJLGFBQVQsQ0FBdUJMLFFBQXZCLENBQWQ7QUFDQSxlQUFPSSxPQUFPLEdBQUcsSUFBSCxHQUFVLEtBQXhCO0FBQ0QsT0FIWSxFQUdWbUIsT0FIVSxDQUFiO0FBRDhDO0FBSy9DOztBQUlLQyxFQUFBQSxPQUFOLENBQWN4QixRQUFkLEVBQStDO0FBQUE7QUFFOUM7O0FBRUt5QixFQUFBQSxTQUFOLENBQWdCekIsUUFBaEIsRUFBaUQ7QUFBQTtBQUVoRDs7QUFHSzBCLEVBQUFBLFFBQU4sQ0FBZTFCLFFBQWYsRUFBZ0Q7QUFBQTs7QUFBQTtBQUM5QyxZQUFNLE1BQUksQ0FBQ2IsWUFBTCxDQUFtQmEsUUFBRCxJQUFjO0FBQ3BDLFlBQUlJLE9BQU8sR0FBR0gsUUFBUSxDQUFDSSxhQUFULENBQXVCTCxRQUF2QixDQUFkOztBQUNBLFlBQUksQ0FBQ0ksT0FBTCxFQUFjO0FBQ1osZ0JBQU0sSUFBSWIsS0FBSixDQUFVLHlDQUF5Q1MsUUFBbkQsQ0FBTjtBQUNEOztBQUNELFlBQUlRLEtBQUssR0FBR1AsUUFBUSxDQUFDMEIsV0FBVCxDQUFxQixZQUFyQixDQUFaLENBTG9DLENBTXBDOztBQUNBbkIsUUFBQUEsS0FBSyxDQUFDb0IsY0FBTixDQUFxQixVQUFyQixFQUFpQyxJQUFqQyxFQUF1QyxJQUF2QztBQUNBeEIsUUFBQUEsT0FBTyxDQUFDZ0IsYUFBUixDQUFzQlosS0FBdEI7QUFDRCxPQVRLLEVBU0hSLFFBVEcsQ0FBTjtBQUQ4QztBQVcvQzs7QUFHSzZCLEVBQUFBLEtBQU4sQ0FBWTdCLFFBQVosRUFBNkM7QUFBQTs7QUFBQTtBQUMzQyxhQUFPLE9BQUksQ0FBQ2IsWUFBTCxDQUFtQmEsUUFBRCxJQUFjO0FBQ3JDO0FBQ0FDLFFBQUFBLFFBQVEsQ0FBQ0ksYUFBVCxDQUF1QkwsUUFBdkIsRUFBaUM2QixLQUFqQztBQUNELE9BSE0sRUFHSjdCLFFBSEksQ0FBUDtBQUQyQztBQUs1Qzs7QUFHS0csRUFBQUEsSUFBTixDQUFXSCxRQUFYLEVBQTRDO0FBQUE7O0FBQUE7QUFDMUMsYUFBTyxPQUFJLENBQUNiLFlBQUwsQ0FBbUJhLFFBQUQsSUFBYztBQUNyQztBQUNBLFlBQUlJLE9BQU8sR0FBR0gsUUFBUSxDQUFDSSxhQUFULENBQXVCTCxRQUF2QixDQUFkOztBQUNBLFlBQUlJLE9BQUosRUFBYTtBQUNYO0FBQ0FBLFVBQUFBLE9BQU8sQ0FBQ0QsSUFBUjtBQUNEO0FBQ0YsT0FQTSxFQU9KSCxRQVBJLENBQVA7QUFEMEM7QUFTM0M7O0FBR0s4QixFQUFBQSxJQUFOLENBQVc5QixRQUFYLEVBQTZCK0IsSUFBN0IsRUFBMkQ7QUFBQTs7QUFBQTtBQUN6RCxVQUFJQyxLQUFLLEdBQUdqRCxNQUFNLENBQUNnRCxJQUFELENBQU4sQ0FBYUUsS0FBYixDQUFtQixFQUFuQixDQUFaO0FBRUEsVUFBSUMsWUFBWSxHQUFHLEdBQW5CO0FBRUEsWUFBTSxPQUFJLENBQUNMLEtBQUwsQ0FBVzdCLFFBQVgsQ0FBTjs7QUFFQSxXQUFJLElBQUltQyxJQUFSLElBQWdCSCxLQUFoQixFQUFzQjtBQUNwQixRQUFBLE9BQUksQ0FBQ3hFLFdBQUwsQ0FBaUI0RSxjQUFqQixDQUFnQztBQUM5Qk4sVUFBQUEsSUFBSSxFQUFFLFNBRHdCO0FBRTlCO0FBQ0FPLFVBQUFBLE9BQU8sRUFBRUY7QUFIcUIsU0FBaEM7O0FBTUEsUUFBQSxPQUFJLENBQUMzRSxXQUFMLENBQWlCNEUsY0FBakIsQ0FBZ0M7QUFDOUJOLFVBQUFBLElBQUksRUFBRSxNQUR3QjtBQUU5QjtBQUNBTyxVQUFBQSxPQUFPLEVBQUVGO0FBSHFCLFNBQWhDOztBQU1BLFFBQUEsT0FBSSxDQUFDM0UsV0FBTCxDQUFpQjRFLGNBQWpCLENBQWdDO0FBQzlCTixVQUFBQSxJQUFJLEVBQUUsT0FEd0I7QUFFOUI7QUFDQU8sVUFBQUEsT0FBTyxFQUFFRjtBQUhxQixTQUFoQzs7QUFNQSxjQUFNLGtCQUFNRCxZQUFOLENBQU47QUFDRDs7QUFFRCxZQUFNLE9BQUksQ0FBQy9CLElBQUwsQ0FBVUgsUUFBVixDQUFOO0FBN0J5RDtBQThCMUQ7O0FBR0tzQyxFQUFBQSxNQUFOLENBQWF0QyxRQUFiLEVBQStCK0IsSUFBL0IsRUFBNkQ7QUFBQTs7QUFBQTtBQUMzRCxtQkFBYSxPQUFJLENBQUM1QyxZQUFMLENBQWtCLENBQUNhLFFBQUQsRUFBVytCLElBQVgsS0FBb0I7QUFDakQ7QUFDQTlCLFFBQUFBLFFBQVEsQ0FBQ0MsYUFBVCxDQUF1QkMsSUFBdkI7QUFDQSxZQUFJQyxPQUFPLEdBQUdILFFBQVEsQ0FBQ0ksYUFBVCxDQUF1QkwsUUFBdkIsQ0FBZDs7QUFFQSxZQUFJLENBQUNJLE9BQUwsRUFBYztBQUNaLGdCQUFNLElBQUliLEtBQUosQ0FBVSx5Q0FBeUNTLFFBQW5ELENBQU47QUFDRCxTQVBnRCxDQVFqRDs7O0FBQ0FJLFFBQUFBLE9BQU8sQ0FBQ21DLEtBQVIsR0FBZ0JSLElBQUksR0FBR0EsSUFBSCxHQUFVLEVBQTlCO0FBQ0QsT0FWWSxFQVVWL0IsUUFWVSxFQVVBK0IsSUFWQSxDQUFiO0FBRDJEO0FBWTVEOztBQUdLUyxFQUFBQSxLQUFOLENBQVl4QyxRQUFaLEVBQTZDO0FBQUE7O0FBQUE7QUFDM0MsWUFBTSxPQUFJLENBQUNiLFlBQUwsQ0FBbUJhLFFBQUQsSUFBYztBQUNwQyxZQUFJSSxPQUFPLEdBQUdILFFBQVEsQ0FBQ0ksYUFBVCxDQUF1QkwsUUFBdkIsQ0FBZDs7QUFFQSxZQUFJLENBQUNJLE9BQUwsRUFBYztBQUNaLGdCQUFNLElBQUliLEtBQUosQ0FBVSx5Q0FBeUNTLFFBQW5ELENBQU47QUFDRDs7QUFFRCxZQUFJUSxLQUFLLEdBQUdQLFFBQVEsQ0FBQzBCLFdBQVQsQ0FBcUIsWUFBckIsQ0FBWjtBQUNDdkIsUUFBQUEsT0FBRCxDQUE4QnFDLE9BQTlCLEdBQXdDLElBQXhDO0FBQ0FqQyxRQUFBQSxLQUFLLENBQUNrQyxTQUFOLENBQWdCLFFBQWhCLEVBQTBCLElBQTFCLEVBQWdDLElBQWhDO0FBQ0F0QyxRQUFBQSxPQUFPLENBQUNnQixhQUFSLENBQXNCWixLQUF0QjtBQUNELE9BWEssRUFXSFIsUUFYRyxDQUFOO0FBRDJDO0FBYTVDOztBQUdLMkMsRUFBQUEsT0FBTixDQUFjM0MsUUFBZCxFQUErQztBQUFBOztBQUFBO0FBQzdDLE1BQUEsT0FBSSxDQUFDYixZQUFMLENBQW1CYSxRQUFELElBQWM7QUFDOUIsWUFBSUksT0FBTyxHQUFHSCxRQUFRLENBQUNJLGFBQVQsQ0FBdUJMLFFBQXZCLENBQWQ7O0FBQ0EsWUFBSSxDQUFDSSxPQUFMLEVBQWM7QUFDWixnQkFBTSxJQUFJYixLQUFKLENBQVUseUNBQXlDUyxRQUFuRCxDQUFOO0FBQ0Q7O0FBQ0QsWUFBSVEsS0FBSyxHQUFHUCxRQUFRLENBQUMwQixXQUFULENBQXFCLFlBQXJCLENBQVo7QUFDQ3ZCLFFBQUFBLE9BQUQsQ0FBOEJxQyxPQUE5QixHQUF3QyxLQUF4QztBQUNBakMsUUFBQUEsS0FBSyxDQUFDa0MsU0FBTixDQUFnQixRQUFoQixFQUEwQixJQUExQixFQUFnQyxJQUFoQztBQUNBdEMsUUFBQUEsT0FBTyxDQUFDZ0IsYUFBUixDQUFzQlosS0FBdEI7QUFDRCxPQVRELEVBU0dSLFFBVEg7QUFENkM7QUFXOUM7O0FBR0s0QyxFQUFBQSxNQUFOLENBQWE1QyxRQUFiLEVBQStCNkMsTUFBL0IsRUFBK0Q7QUFBQTs7QUFBQTtBQUM3RCxNQUFBLE9BQUksQ0FBQzFELFlBQUwsQ0FBbUJhLFFBQUQsSUFBYztBQUM5QixZQUFJSSxPQUFPLEdBQUdILFFBQVEsQ0FBQ0ksYUFBVCxDQUF1QkwsUUFBdkIsQ0FBZDs7QUFDQSxZQUFJLENBQUNJLE9BQUwsRUFBYztBQUNaLGdCQUFNLElBQUliLEtBQUosQ0FBVSx5Q0FBeUNTLFFBQW5ELENBQU47QUFDRDs7QUFDRCxZQUFJUSxLQUFLLEdBQUdQLFFBQVEsQ0FBQzBCLFdBQVQsQ0FBcUIsWUFBckIsQ0FBWjtBQUNDdkIsUUFBQUEsT0FBRCxDQUE4Qm1DLEtBQTlCLEdBQXNDTSxNQUFNLEdBQUdBLE1BQUgsR0FBWSxFQUF4RDtBQUNBckMsUUFBQUEsS0FBSyxDQUFDa0MsU0FBTixDQUFnQixRQUFoQixFQUEwQixJQUExQixFQUFnQyxJQUFoQztBQUNBdEMsUUFBQUEsT0FBTyxDQUFDZ0IsYUFBUixDQUFzQlosS0FBdEI7QUFDRCxPQVRELEVBU0dSLFFBVEg7QUFENkQ7QUFXOUQ7O0FBRUs4QyxFQUFBQSxRQUFOLENBQWU1QixHQUFmLEVBQTRCSCxJQUE1QixFQUF5RDtBQUFBOztBQUFBO0FBQ3ZELFlBQU0sT0FBSSxDQUFDNUIsWUFBTCxDQUFrQixDQUFDK0IsR0FBRCxFQUFNSCxJQUFOLEtBQWU7QUFDckNKLFFBQUFBLE1BQU0sQ0FBQ21DLFFBQVAsQ0FBZ0I7QUFBRTVCLFVBQUFBLEdBQUY7QUFBT0gsVUFBQUE7QUFBUCxTQUFoQjtBQUNELE9BRkssRUFFSEcsR0FGRyxFQUVFSCxJQUZGLENBQU47QUFEdUQ7QUFJeEQ7O0FBRUtnQyxFQUFBQSxJQUFOLEdBQThCO0FBQUE7O0FBQUE7QUFDNUIsYUFBTyxPQUFJLENBQUM1RCxZQUFMLENBQWtCLE1BQU07QUFDN0IsZUFBT2MsUUFBUSxDQUFDK0MsZUFBVCxDQUF5QkMsU0FBaEM7QUFDRCxPQUZNLENBQVA7QUFENEI7QUFJN0I7O0FBRUtDLEVBQUFBLFFBQU4sQ0FBZWxDLEtBQWYsRUFBOEJHLE1BQTlCLEVBQTZEO0FBQUE7O0FBQUE7QUFDM0QsY0FBTyxPQUFJLENBQUMxRCxPQUFaO0FBQ0UsYUFBS0ksK0JBQWlCQyxPQUF0QjtBQUNFOztBQUNGLGFBQUtELCtCQUFpQkUsV0FBdEI7QUFDRSxjQUFJb0YsS0FBa0IsR0FBRyxPQUFJLENBQUM3RixHQUE5QixDQURGLENBRUU7O0FBQ0EsY0FBSThGLE1BQU0sR0FBR0QsS0FBSyxDQUFDRSxTQUFOLEVBQWI7QUFDQUYsVUFBQUEsS0FBSyxDQUFDRyxTQUFOLGlDQUNLRixNQURMO0FBRUVwQyxZQUFBQSxLQUZGO0FBR0VHLFlBQUFBO0FBSEY7QUFLQTs7QUFDRixhQUFLdEQsK0JBQWlCSSxhQUF0QjtBQUNHLFVBQUEsT0FBSSxDQUFDWCxHQUFOLENBQThCaUcsT0FBOUIsQ0FBc0N2QyxLQUF0QyxFQUE2Q0csTUFBN0M7O0FBQ0E7QUFmSjtBQUQyRDtBQWtCNUQ7O0FBRUtxQyxFQUFBQSxNQUFOLENBQWExQixJQUFiLEVBQWlDMkIsSUFBakMsRUFBOEQ7QUFBQTs7QUFBQTtBQUM1RCxVQUFJQyxRQUFRLFNBQVNDLGFBQVNDLFFBQVQsQ0FBa0JILElBQWxCLEVBQXdCO0FBQUVJLFFBQUFBLFFBQVEsRUFBRTtBQUFaLE9BQXhCLENBQXJCOztBQUNBLGNBQU8vQixJQUFQO0FBQ0UsYUFBSyxJQUFMO0FBQ0UsZ0JBQU0sT0FBSSxDQUFDNUQsT0FBTCxDQUFhd0YsUUFBYixDQUFOO0FBQ0E7O0FBQ0YsYUFBSyxLQUFMO0FBQ0UsVUFBQSxPQUFJLENBQUNsRyxXQUFMLENBQWlCc0csU0FBakIsQ0FBMkJKLFFBQTNCOztBQUNBO0FBTko7QUFGNEQ7QUFVN0Q7O0FBRUtLLEVBQUFBLFFBQU4sQ0FBc0M1RixFQUF0QyxFQUE4RjtBQUFBO0FBQUE7O0FBQUE7QUFBQSwyQ0FBckJjLElBQXFCO0FBQXJCQSxRQUFBQSxJQUFxQjtBQUFBOztBQUM1RixhQUFPLE9BQUksQ0FBQ0UsWUFBTCxDQUFrQmhCLEVBQWxCLEVBQXNCLEdBQUdjLElBQXpCLENBQVA7QUFENEY7QUFFN0Y7O0FBRU8rRSxFQUFBQSxLQUFSLENBQWM3RixFQUFkLEVBQTBDOEYsT0FBMUMsRUFBMkRDLFdBQTNELEVBQXNHO0FBQ3BHLFFBQUl0RyxLQUF3QixHQUFHdUcsU0FBL0I7QUFDQSxRQUFJQyxPQUFnQixHQUFHLElBQXZCOztBQUVBLFFBQUlDLE1BQU07QUFBQSxpREFBRyxhQUFZO0FBRXZCQyxRQUFBQSxVQUFVLENBQUMsTUFBTTtBQUNmRixVQUFBQSxPQUFPLEdBQUcsS0FBVjtBQUNBeEcsVUFBQUEsS0FBSyxHQUFHLElBQUkyQixLQUFKLENBQVUsV0FBVixDQUFSO0FBQ0QsU0FIUyxFQUdQMkUsV0FBVyxHQUFHQSxXQUFILEdBQWlCRCxPQUhyQixDQUFWOztBQUtBLGVBQU1HLE9BQU4sRUFBYztBQUNaLGNBQUk7QUFDRixnQkFBSUcsTUFBTSxTQUFTcEcsRUFBRSxFQUFyQjs7QUFFQSxnQkFBR29HLE1BQUgsRUFBVTtBQUFFSCxjQUFBQSxPQUFPLEdBQUcsS0FBVjtBQUFrQjtBQUUvQixXQUxELENBS0UsT0FBT0ksTUFBUCxFQUFjO0FBQ2RKLFlBQUFBLE9BQU8sR0FBRyxLQUFWO0FBQ0F4RyxZQUFBQSxLQUFLLEdBQUc0RyxNQUFSO0FBQ0Q7QUFDRjs7QUFFRCxZQUFHNUcsS0FBSCxFQUFTO0FBQ1AsY0FBRyxDQUFDc0csV0FBSixFQUFnQjtBQUNkLGtCQUFNdEcsS0FBTjtBQUNEO0FBQ0Y7QUFDRixPQXhCUzs7QUFBQSxzQkFBTnlHLE1BQU07QUFBQTtBQUFBO0FBQUEsT0FBVjs7QUEwQkEsV0FBT0EsTUFBUDtBQUNEOztBQUtLSSxFQUFBQSxJQUFOLEdBQTRCO0FBQUE7QUFBQTs7QUFBQTtBQUMxQixVQUFJQyxLQUFKO0FBRUEsVUFBSUMsWUFBWSxHQUFHLEtBQW5COztBQUVBLGNBQU8sT0FBT2xHLFdBQVMsQ0FBQyxDQUFELENBQXZCO0FBQ0UsYUFBSyxRQUFMO0FBQ0VpRyxVQUFBQSxLQUFLLEdBQUdFLGFBQU1DLElBQU4sQ0FBVyxJQUFYLEVBQWlCcEcsV0FBUyxDQUFDLENBQUQsQ0FBMUIsQ0FBUjtBQUNBOztBQUNGLGFBQUssUUFBTDtBQUNFaUcsVUFBQUEsS0FBSyxHQUFHLE9BQUksQ0FBQ1YsS0FBTCxDQUFXLE1BQU0sT0FBSSxDQUFDMUMsTUFBTCxDQUFZN0MsV0FBUyxDQUFDLENBQUQsQ0FBckIsQ0FBakIsRUFBNENrRyxZQUE1QyxFQUEwRGxHLFdBQVMsQ0FBQyxDQUFELENBQW5FLENBQVI7QUFDQTs7QUFDRixhQUFLLFVBQUw7QUFDRTtBQUNBaUcsVUFBQUEsS0FBSyxHQUFHLE9BQUksQ0FBQ1YsS0FBTCxDQUFXLE1BQU0sT0FBSSxDQUFDRCxRQUFMLENBQWNlLEtBQWQsQ0FBb0IsT0FBcEIsRUFBMEJyRyxXQUExQixDQUFqQixFQUF1RGtHLFlBQXZELENBQVI7O0FBQ0Y7QUFDRUQsVUFBQUEsS0FBSztBQUFBLHdEQUFHLGFBQVksQ0FBRSxDQUFqQjs7QUFBQTtBQUFBO0FBQUE7QUFBQSxhQUFMOztBQUNBO0FBWko7O0FBZUEsWUFBTUEsS0FBSyxFQUFYO0FBcEIwQjtBQXFCM0I7O0FBR0tLLEVBQUFBLE1BQU4sQ0FBYUEsTUFBYixFQUE2QnhDLEtBQTdCLEVBQTJEO0FBQUE7QUFFMUQ7O0FBRUt5QyxFQUFBQSxTQUFOLENBQWdCQSxTQUFoQixFQUFrRDtBQUFBOztBQUFBO0FBQ2hELE1BQUEsT0FBSSxDQUFDeEgsV0FBTCxDQUFpQnlILFlBQWpCLENBQThCRCxTQUE5QjtBQURnRDtBQUVqRDs7QUFJS0UsRUFBQUEsY0FBTixDQUFxQkMsUUFBckIsRUFBdUNDLFFBQXZDLEVBQXdEO0FBQUE7O0FBQUE7QUFDdEQsVUFBSUMsUUFBUSxHQUFHLENBQWY7QUFDQSxVQUFJQyxVQUFVLEdBQUcsRUFBakI7O0FBRUEsTUFBQSxPQUFJLENBQUM5SCxXQUFMLENBQWlCK0gsY0FBakIsQ0FBZ0MsT0FBaEMsRUFBeUMsT0FBSSxDQUFDQyxrQkFBOUM7O0FBRUEsbUJBQWEsSUFBSUMsT0FBSixDQUFrQixDQUFDQyxPQUFELEVBQVVDLE1BQVYsS0FBcUI7QUFDbEQsUUFBQSxPQUFJLENBQUNILGtCQUFMLEdBQTBCLENBQUNoRixLQUFELEVBQVFvRixPQUFSLEVBQWlCQyxRQUFqQixFQUEyQkMsUUFBM0IsS0FBd0M7QUFDaEUsY0FBR1IsVUFBVSxLQUFLTSxPQUFPLENBQUN2RyxHQUExQixFQUE4QjtBQUM1QmdHLFlBQUFBLFFBQVEsR0FBRyxDQUFYO0FBQ0Q7O0FBRUQsY0FBR0EsUUFBUSxJQUFJLENBQWYsRUFBaUI7QUFDZjtBQUNBLFlBQUEsT0FBSSxDQUFDN0gsV0FBTCxDQUFpQitILGNBQWpCLENBQWdDLE9BQWhDLEVBQXlDLE9BQUksQ0FBQ0Msa0JBQTlDOztBQUNBLG1CQUFPTSxRQUFRLENBQUNYLFFBQUQsRUFBV0MsUUFBWCxDQUFmO0FBQ0Q7O0FBRUQsaUJBQU9VLFFBQVEsQ0FBQ1gsUUFBRCxFQUFXQyxRQUFYLENBQWY7QUFDRCxTQVpEOztBQWNBLFFBQUEsT0FBSSxDQUFDNUgsV0FBTCxDQUFpQnVJLEVBQWpCLENBQW9CLE9BQXBCLEVBQTZCLE9BQUksQ0FBQ1Asa0JBQWxDOztBQUVBLGVBQU9FLE9BQU8sRUFBZDtBQUNELE9BbEJZLENBQWI7QUFOc0Q7QUF5QnZEOztBQXhZd0ciLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBCcm93c2VyVmlldywgQnJvd3NlcldpbmRvdywgV2Vidmlld1RhZywgV2ViQ29udGVudHMgfSBmcm9tICdlbGVjdHJvbic7XG5pbXBvcnQgeyBPcGVyYXRvckZ1bmN0aW9ucyB9IGZyb20gJy4uL29wZXJhdG9yLWZ1bmN0aW9ucy5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgUHVzaCB9IGZyb20gJy4uL2V2YWx1YXRlLWZ1bmN0aW9uLnR5cGUnO1xuaW1wb3J0IHsgZXhlY3V0ZSwgaW5qZWN0IH0gZnJvbSAnLi4vamF2YXNjcmlwdC50ZW1wbGF0ZSc7XG5pbXBvcnQgeyBFbGVjdHJvbGl6ZXJUeXBlIH0gZnJvbSAnLi4vZWxlY3Ryb2xpemVyLmNsYXNzJztcbmltcG9ydCB7IGRlbGF5IH0gZnJvbSAnLi4vdXRpbHMvZGVsYXkuZnVuY3Rpb24nO1xuaW1wb3J0IHsgcHJvbWlzZXMgfSBmcm9tICdmcyc7XG5pbXBvcnQgeyBDb29raWVzIH0gZnJvbSAnLi9jb29raWVzLmNsYXNzJztcblxuZXhwb3J0IGNsYXNzIERyaXZlcjxUIGV4dGVuZHMgV2Vidmlld1RhZyB8IEJyb3dzZXJWaWV3IHwgQnJvd3NlcldpbmRvdz4gaW1wbGVtZW50cyBPcGVyYXRvckZ1bmN0aW9uczx2b2lkPiB7XG5cbiAgY29va2llcyA9IG5ldyBDb29raWVzKHRoaXMud2ViQ29udGVudHMpO1xuXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBidXM6IFQpe31cblxuIFxuICBnZXQgYnVzVHlwZSgpOiBFbGVjdHJvbGl6ZXJUeXBlIHtcbiAgICB0cnkge1xuICAgICAgbGV0IGluc3RhbmNlT2ZUZXN0ID0gdGhpcy5idXMgaW5zdGFuY2VvZiBCcm93c2VyVmlldztcbiAgICB9IGNhdGNoKGVycm9yKXtcbiAgICAgIHJldHVybiBFbGVjdHJvbGl6ZXJUeXBlLndlYnZpZXc7XG4gICAgfVxuXG4gICAgaWYodGhpcy5idXMgaW5zdGFuY2VvZiBCcm93c2VyVmlldyl7XG4gICAgICByZXR1cm4gRWxlY3Ryb2xpemVyVHlwZS5icm93c2VyVmlldztcbiAgICB9XG5cbiAgICBpZih0aGlzLmJ1cyBpbnN0YW5jZW9mIEJyb3dzZXJXaW5kb3cpe1xuICAgICAgcmV0dXJuIEVsZWN0cm9saXplclR5cGUuYnJvd3NlcldpbmRvdztcbiAgICB9XG5cbiAgICByZXR1cm4gRWxlY3Ryb2xpemVyVHlwZS53ZWJ2aWV3O1xuICB9XG5cbiAgXG4gIGdldCB3ZWJDb250ZW50cygpOiBXZWJDb250ZW50cyB7XG4gICAgc3dpdGNoKHRoaXMuYnVzVHlwZSl7XG4gICAgICBjYXNlIEVsZWN0cm9saXplclR5cGUud2VidmlldzpcbiAgICAgICAgLy9AdHMtaWdub3JlXG4gICAgICAgIHJldHVybiAodGhpcy5idXMgYXMgV2Vidmlld1RhZylcbiAgICB9XG5cbiAgICByZXR1cm4gKHRoaXMuYnVzIGFzIEJyb3dzZXJXaW5kb3cpLndlYkNvbnRlbnRzO1xuICB9XG5cbiAgXG4gIHByaXZhdGUgYXN5bmMgX2luamVjdChmbjogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgbGV0IF9hcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKS5zbGljZSgxKS5tYXAoYXJndW1lbnQgPT4ge1xuICAgICAgcmV0dXJuIHsgYXJndW1lbnQ6IEpTT04uc3RyaW5naWZ5KGFyZ3VtZW50KSB9XG4gICAgfSk7XG5cbiAgICBsZXQgc3RyaW5nRm4gPSBTdHJpbmcoZm4pO1xuICAgIGxldCBzb3VyY2UgPSBpbmplY3Qoe2ZuOiBzdHJpbmdGbiwgYXJnczogX2FyZ3MgfSk7XG5cbiAgICByZXR1cm4gYXdhaXQgdGhpcy53ZWJDb250ZW50cy5leGVjdXRlSmF2YVNjcmlwdChzb3VyY2UsIHRydWUpO1xuICB9XG5cbiAgXG4gIHByaXZhdGUgYXN5bmMgZXZhbHVhdGVfbm93PFQsIEsgZXh0ZW5kcyBhbnlbXSwgUj4oZm46ICguLi5hcmdzOiBQdXNoPEssIFQ+KSA9PiBSLCAuLi5hcmdzOiBLKTogUHJvbWlzZTxSPiB7XG4gICAgbGV0IF9hcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKS5zbGljZSgxKS5tYXAoYXJndW1lbnQgPT4ge1xuICAgICAgcmV0dXJuIHsgYXJndW1lbnQ6IEpTT04uc3RyaW5naWZ5KGFyZ3VtZW50KSB9XG4gICAgfSk7XG5cbiAgICBsZXQgc3RyaW5nRm4gPSBTdHJpbmcoZm4pO1xuICAgIGxldCBzb3VyY2UgPSBleGVjdXRlKHtmbjogc3RyaW5nRm4sIGFyZ3M6IF9hcmdzIH0pO1xuXG4gICAgcmV0dXJuIGF3YWl0IHRoaXMud2ViQ29udGVudHMuZXhlY3V0ZUphdmFTY3JpcHQoc291cmNlLCB0cnVlKTtcbiAgfVxuXG4gIFxuICBhc3luYyBnb3RvKHVybDogc3RyaW5nLCBoZWFkZXJzPzogUmVjb3JkPHN0cmluZywgc3RyaW5nPik6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmKCF1cmwpeyB0aHJvdyBuZXcgRXJyb3IoJ3VybCBtdXN0IGJlIGRlZmluZWQnKTsgfVxuICAgIGF3YWl0IHRoaXMud2ViQ29udGVudHMubG9hZFVSTCh1cmwpO1xuICB9XG5cbiAgXG4gIGFzeW5jIGJhY2soKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgdGhpcy53ZWJDb250ZW50cy5nb0JhY2soKTtcbiAgfVxuXG4gIGFzeW5jIGZvcndhcmQoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgdGhpcy53ZWJDb250ZW50cy5nb0ZvcndhcmQoKTtcbiAgfVxuXG4gIGFzeW5jIHJlZnJlc2goKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgdGhpcy53ZWJDb250ZW50cy5yZWxvYWQoKTtcbiAgfVxuXG4gIGFzeW5jIGNsaWNrKHNlbGVjdG9yOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gdGhpcy5ldmFsdWF0ZV9ub3coKHNlbGVjdG9yKSA9PiB7XG4gICAgICAvL0B0cy1pZ25vcmVcbiAgICAgIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQuYmx1cigpXG4gICAgICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpXG4gICAgICBpZiAoIWVsZW1lbnQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmFibGUgdG8gZmluZCBlbGVtZW50IGJ5IHNlbGVjdG9yOiAnICsgc2VsZWN0b3IpXG4gICAgICB9XG4gICAgICB2YXIgYm91bmRpbmcgPSBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgICB2YXIgZXZlbnQgPSBuZXcgTW91c2VFdmVudCgnY2xpY2snLCB7XG4gICAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgICB2aWV3OiBkb2N1bWVudC53aW5kb3csXG4gICAgICAgIGJ1YmJsZXM6IHRydWUsXG4gICAgICAgIGNhbmNlbGFibGU6IHRydWUsXG4gICAgICAgIGNsaWVudFg6IGJvdW5kaW5nLmxlZnQgKyBib3VuZGluZy53aWR0aCAvIDIsXG4gICAgICAgIGNsaWVudFk6IGJvdW5kaW5nLnRvcCArIGJvdW5kaW5nLmhlaWdodCAvIDJcbiAgICAgIH0pO1xuXG4gICAgICBlbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuICAgIH0sIHNlbGVjdG9yKTtcbiAgfVxuXG4gIGFzeW5jIG1vdXNlZG93bihzZWxlY3Rvcjogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG5cbiAgfVxuXG4gIFxuICBhc3luYyBleGlzdHMoc2VsY3Rvcjogc3RyaW5nKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuZXZhbHVhdGVfbm93KChzZWxlY3RvcikgPT4ge1xuICAgICAgbGV0IGVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcbiAgICAgIHJldHVybiBlbGVtZW50ID8gdHJ1ZSA6IGZhbHNlO1xuICAgIH0sIHNlbGN0b3IpO1xuICB9XG5cbiAgXG4gIFxuICBhc3luYyBtb3VzZXVwKHNlbGVjdG9yOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcblxuICB9XG4gIFxuICBhc3luYyBtb3VzZW92ZXIoc2VsZWN0b3I6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuXG4gIH1cblxuICBcbiAgYXN5bmMgbW91c2VvdXQoc2VsZWN0b3I6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAgIGF3YWl0IHRoaXMuZXZhbHVhdGVfbm93KChzZWxlY3RvcikgPT4ge1xuICAgICAgbGV0IGVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKVxuICAgICAgaWYgKCFlbGVtZW50KSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignVW5hYmxlIHRvIGZpbmQgZWxlbWVudCBieSBzZWxlY3RvcjogJyArIHNlbGVjdG9yKVxuICAgICAgfVxuICAgICAgbGV0IGV2ZW50ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ01vdXNlRXZlbnQnKVxuICAgICAgLy9AdHMtaWdub3JlXG4gICAgICBldmVudC5pbml0TW91c2VFdmVudCgnbW91c2VvdXQnLCB0cnVlLCB0cnVlKVxuICAgICAgZWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KVxuICAgIH0sIHNlbGVjdG9yKTtcbiAgfVxuXG4gIFxuICBhc3luYyBmb2N1cyhzZWxlY3Rvcjogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIHRoaXMuZXZhbHVhdGVfbm93KChzZWxlY3RvcikgPT4ge1xuICAgICAgLy9AdHMtaWdub3JlXG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKS5mb2N1cygpO1xuICAgIH0sIHNlbGVjdG9yKTtcbiAgfVxuXG4gIFxuICBhc3luYyBibHVyKHNlbGVjdG9yOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gdGhpcy5ldmFsdWF0ZV9ub3coKHNlbGVjdG9yKSA9PiB7XG4gICAgICAvL0B0cy1pZ25vcmVcbiAgICAgIHZhciBlbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3RvcilcbiAgICAgIGlmIChlbGVtZW50KSB7XG4gICAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgICBlbGVtZW50LmJsdXIoKVxuICAgICAgfVxuICAgIH0sIHNlbGVjdG9yKTtcbiAgfVxuXG4gIFxuICBhc3luYyB0eXBlKHNlbGVjdG9yOiBzdHJpbmcsIHRleHQ/OiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBsZXQgY2hhcnMgPSBTdHJpbmcodGV4dCkuc3BsaXQoJycpO1xuXG4gICAgbGV0IHR5cGVJbnRlcnZhbCA9IDI1MDtcblxuICAgIGF3YWl0IHRoaXMuZm9jdXMoc2VsZWN0b3IpO1xuXG4gICAgZm9yKGxldCBjaGFyIG9mIGNoYXJzKXtcbiAgICAgIHRoaXMud2ViQ29udGVudHMuc2VuZElucHV0RXZlbnQoe1xuICAgICAgICB0eXBlOiAna2V5RG93bicsXG4gICAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgICBrZXlDb2RlOiBjaGFyLFxuICAgICAgfSk7XG5cbiAgICAgIHRoaXMud2ViQ29udGVudHMuc2VuZElucHV0RXZlbnQoe1xuICAgICAgICB0eXBlOiAnY2hhcicsXG4gICAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgICBrZXlDb2RlOiBjaGFyLFxuICAgICAgfSk7XG5cbiAgICAgIHRoaXMud2ViQ29udGVudHMuc2VuZElucHV0RXZlbnQoe1xuICAgICAgICB0eXBlOiAna2V5VXAnLFxuICAgICAgICAvL0B0cy1pZ25vcmVcbiAgICAgICAga2V5Q29kZTogY2hhcixcbiAgICAgIH0pO1xuXG4gICAgICBhd2FpdCBkZWxheSh0eXBlSW50ZXJ2YWwpO1xuICAgIH1cblxuICAgIGF3YWl0IHRoaXMuYmx1cihzZWxlY3Rvcik7XG4gIH1cblxuICBcbiAgYXN5bmMgaW5zZXJ0KHNlbGVjdG9yOiBzdHJpbmcsIHRleHQ/OiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gYXdhaXQgdGhpcy5ldmFsdWF0ZV9ub3coKHNlbGVjdG9yLCB0ZXh0KSA9PiB7XG4gICAgICAvL0B0cy1pZ25vcmVcbiAgICAgIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQuYmx1cigpXG4gICAgICBsZXQgZWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xuXG4gICAgICBpZiAoIWVsZW1lbnQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmFibGUgdG8gZmluZCBlbGVtZW50IGJ5IHNlbGVjdG9yOiAnICsgc2VsZWN0b3IpXG4gICAgICB9XG4gICAgICAvL0B0cy1pZ25vcmVcbiAgICAgIGVsZW1lbnQudmFsdWUgPSB0ZXh0ID8gdGV4dCA6ICcnO1xuICAgIH0sIHNlbGVjdG9yLCB0ZXh0KTtcbiAgfVxuXG4gIFxuICBhc3luYyBjaGVjayhzZWxlY3Rvcjogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgYXdhaXQgdGhpcy5ldmFsdWF0ZV9ub3coKHNlbGVjdG9yKSA9PiB7XG4gICAgICBsZXQgZWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xuXG4gICAgICBpZiAoIWVsZW1lbnQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmFibGUgdG8gZmluZCBlbGVtZW50IGJ5IHNlbGVjdG9yOiAnICsgc2VsZWN0b3IpXG4gICAgICB9XG5cbiAgICAgIGxldCBldmVudCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdIVE1MRXZlbnRzJyk7XG4gICAgICAoZWxlbWVudCBhcyBIVE1MSW5wdXRFbGVtZW50KS5jaGVja2VkID0gdHJ1ZTtcbiAgICAgIGV2ZW50LmluaXRFdmVudCgnY2hhbmdlJywgdHJ1ZSwgdHJ1ZSk7XG4gICAgICBlbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuICAgIH0sIHNlbGVjdG9yKTtcbiAgfVxuXG4gIFxuICBhc3luYyB1bmNoZWNrKHNlbGVjdG9yOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICB0aGlzLmV2YWx1YXRlX25vdygoc2VsZWN0b3IpID0+IHtcbiAgICAgIGxldCBlbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7XG4gICAgICBpZiAoIWVsZW1lbnQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmFibGUgdG8gZmluZCBlbGVtZW50IGJ5IHNlbGVjdG9yOiAnICsgc2VsZWN0b3IpXG4gICAgICB9XG4gICAgICBsZXQgZXZlbnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnSFRNTEV2ZW50cycpO1xuICAgICAgKGVsZW1lbnQgYXMgSFRNTElucHV0RWxlbWVudCkuY2hlY2tlZCA9IGZhbHNlO1xuICAgICAgZXZlbnQuaW5pdEV2ZW50KCdjaGFuZ2UnLCB0cnVlLCB0cnVlKTtcbiAgICAgIGVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XG4gICAgfSwgc2VsZWN0b3IpO1xuICB9XG5cblxuICBhc3luYyBzZWxlY3Qoc2VsZWN0b3I6IHN0cmluZywgb3B0aW9uPzogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgdGhpcy5ldmFsdWF0ZV9ub3coKHNlbGVjdG9yKSA9PiB7XG4gICAgICBsZXQgZWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xuICAgICAgaWYgKCFlbGVtZW50KSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignVW5hYmxlIHRvIGZpbmQgZWxlbWVudCBieSBzZWxlY3RvcjogJyArIHNlbGVjdG9yKVxuICAgICAgfVxuICAgICAgbGV0IGV2ZW50ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0hUTUxFdmVudHMnKTtcbiAgICAgIChlbGVtZW50IGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlID0gb3B0aW9uID8gb3B0aW9uIDogJyc7XG4gICAgICBldmVudC5pbml0RXZlbnQoJ2NoYW5nZScsIHRydWUsIHRydWUpO1xuICAgICAgZWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcbiAgICB9LCBzZWxlY3Rvcik7XG4gIH1cblxuICBhc3luYyBzY3JvbGxUbyh0b3A6IG51bWJlciwgbGVmdDogbnVtYmVyKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgYXdhaXQgdGhpcy5ldmFsdWF0ZV9ub3coKHRvcCwgbGVmdCkgPT4ge1xuICAgICAgd2luZG93LnNjcm9sbFRvKHsgdG9wLCBsZWZ0IH0pO1xuICAgIH0sIHRvcCwgbGVmdCk7XG4gIH1cblxuICBhc3luYyBodG1sKCk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgcmV0dXJuIHRoaXMuZXZhbHVhdGVfbm93KCgpID0+IHtcbiAgICAgIHJldHVybiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQub3V0ZXJIVE1MXG4gICAgfSk7XG4gIH1cblxuICBhc3luYyB2aWV3cG9ydCh3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlcik6IFByb21pc2U8dm9pZD4ge1xuICAgIHN3aXRjaCh0aGlzLmJ1c1R5cGUpe1xuICAgICAgY2FzZSBFbGVjdHJvbGl6ZXJUeXBlLndlYnZpZXc6XG4gICAgICAgIHJldHVybjtcbiAgICAgIGNhc2UgRWxlY3Ryb2xpemVyVHlwZS5icm93c2VyVmlldzpcbiAgICAgICAgbGV0IGJ2YnV4OiBCcm93c2VyVmlldyA9IHRoaXMuYnVzIGFzIEJyb3dzZXJWaWV3O1xuICAgICAgICAvL0B0cy1pZ25vcmVcbiAgICAgICAgbGV0IGJvdW5kcyA9IGJ2YnV4LmdldEJvdW5kcygpIGFzIEVsZWN0cm9uLlJlY3RhbmdsZTtcbiAgICAgICAgYnZidXguc2V0Qm91bmRzKHtcbiAgICAgICAgICAuLi5ib3VuZHMsXG4gICAgICAgICAgd2lkdGgsXG4gICAgICAgICAgaGVpZ2h0XG4gICAgICAgIH0pXG4gICAgICAgIHJldHVybjtcbiAgICAgIGNhc2UgRWxlY3Ryb2xpemVyVHlwZS5icm93c2VyV2luZG93OlxuICAgICAgICAodGhpcy5idXMgYXMgKEJyb3dzZXJXaW5kb3cpKS5zZXRTaXplKHdpZHRoLCBoZWlnaHQpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgaW5qZWN0KHR5cGU6ICdqcycgfCAnY3NzJywgZmlsZTogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgbGV0IGNvbnRlbnRzID0gYXdhaXQgcHJvbWlzZXMucmVhZEZpbGUoZmlsZSwgeyBlbmNvZGluZzogJ3V0Zi04JyB9KSBhcyBzdHJpbmc7XG4gICAgc3dpdGNoKHR5cGUpe1xuICAgICAgY2FzZSAnanMnOlxuICAgICAgICBhd2FpdCB0aGlzLl9pbmplY3QoY29udGVudHMpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2Nzcyc6XG4gICAgICAgIHRoaXMud2ViQ29udGVudHMuaW5zZXJ0Q1NTKGNvbnRlbnRzKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgZXZhbHVhdGU8VCwgSyBleHRlbmRzIGFueVtdLCBSPihmbjogKC4uLmFyZ3M6IFB1c2g8SywgVD4pID0+IFIsIC4uLmFyZ3M6IEspOiBQcm9taXNlPFI+IHtcbiAgICByZXR1cm4gdGhpcy5ldmFsdWF0ZV9ub3coZm4sIC4uLmFyZ3MpO1xuICB9XG4gIFxuICBwcml2YXRlIHJldHJ5KGZuOiAoKSA9PiBQcm9taXNlPEJvb2xlYW4+LCB0aW1lb3V0OiBudW1iZXIsIHNvZnRUaW1lb3V0PzogbnVtYmVyKTogKCkgPT4gUHJvbWlzZTx2b2lkPiB7XG4gICAgbGV0IGVycm9yOiBFcnJvciB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcbiAgICBsZXQgcnVubmluZzogYm9vbGVhbiA9IHRydWU7XG5cbiAgICBsZXQgcnVubmVyID0gYXN5bmMgKCkgPT4ge1xuXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHsgXG4gICAgICAgIHJ1bm5pbmcgPSBmYWxzZTsgXG4gICAgICAgIGVycm9yID0gbmV3IEVycm9yKCd0aW1lZCBvdXQnKTtcbiAgICAgIH0sIHNvZnRUaW1lb3V0ID8gc29mdFRpbWVvdXQgOiB0aW1lb3V0KTtcblxuICAgICAgd2hpbGUocnVubmluZyl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgbGV0IHJlc3VsdCA9IGF3YWl0IGZuKCk7XG4gICAgICAgICAgXG4gICAgICAgICAgaWYocmVzdWx0KXsgcnVubmluZyA9IGZhbHNlOyB9XG4gIFxuICAgICAgICB9IGNhdGNoIChfZXJyb3Ipe1xuICAgICAgICAgIHJ1bm5pbmcgPSBmYWxzZTtcbiAgICAgICAgICBlcnJvciA9IF9lcnJvcjtcbiAgICAgICAgfVxuICAgICAgfVxuICBcbiAgICAgIGlmKGVycm9yKXtcbiAgICAgICAgaWYoIXNvZnRUaW1lb3V0KXtcbiAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICByZXR1cm4gcnVubmVyO1xuICB9XG5cbiAgYXN5bmMgd2FpdChtczogbnVtYmVyKTogUHJvbWlzZTx2b2lkPlxuICBhc3luYyB3YWl0KHNlbGVjdG9yOiBzdHJpbmcsIG1zRGVsYXk/OiBudW1iZXIpOiBQcm9taXNlPHZvaWQ+IFxuICBhc3luYyB3YWl0PFQsIEsgZXh0ZW5kcyBhbnlbXT4oZm46ICguLi5hcmdzOiBQdXNoPEssIFQ+KSA9PiBib29sZWFuICB8IFByb21pc2U8Ym9vbGVhbj4sIC4uLmFyZ3M6IEspOiBQcm9taXNlPHZvaWQ+XG4gIGFzeW5jIHdhaXQoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgbGV0IGJsb2NrOiAoKSA9PiBQcm9taXNlPHZvaWQ+O1xuXG4gICAgbGV0IGVycm9yVGltZW91dCA9IDMwMDAwO1xuXG4gICAgc3dpdGNoKHR5cGVvZiBhcmd1bWVudHNbMF0pe1xuICAgICAgY2FzZSBcIm51bWJlclwiOlxuICAgICAgICBibG9jayA9IGRlbGF5LmJpbmQobnVsbCwgYXJndW1lbnRzWzBdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwic3RyaW5nXCI6XG4gICAgICAgIGJsb2NrID0gdGhpcy5yZXRyeSgoKSA9PiB0aGlzLmV4aXN0cyhhcmd1bWVudHNbMF0pLCBlcnJvclRpbWVvdXQsIGFyZ3VtZW50c1sxXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcImZ1bmN0aW9uXCI6XG4gICAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgICBibG9jayA9IHRoaXMucmV0cnkoKCkgPT4gdGhpcy5ldmFsdWF0ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpLCBlcnJvclRpbWVvdXQpO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgYmxvY2sgPSBhc3luYyAoKSA9PiB7fTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgYXdhaXQgYmxvY2soKTtcbiAgfVxuXG4gIFxuICBhc3luYyBoZWFkZXIoaGVhZGVyOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcblxuICB9XG5cbiAgYXN5bmMgdXNlcmFnZW50KHVzZXJhZ2VudDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgdGhpcy53ZWJDb250ZW50cy5zZXRVc2VyQWdlbnQodXNlcmFnZW50KTtcbiAgfVxuICBcbiAgcHJpdmF0ZSBsb2dpbkV2ZW50TGlzdGVuZXIgOiAoZXZlbnQ6IEVsZWN0cm9uLkV2ZW50LCByZXF1ZXN0OiBFbGVjdHJvbi5SZXF1ZXN0LCBhdXRoSW5mbzogRWxlY3Ryb24uQXV0aEluZm8sIGNhbGxiYWNrOiAodXNlcm5hbWU6IHN0cmluZywgcGFzc3dvcmQ6IHN0cmluZykgPT4gdm9pZCkgPT4gdm9pZCA9ICgpID0+IHt9XG5cbiAgYXN5bmMgYXV0aGVudGljYXRpb24odXNlcm5hbWU6IHN0cmluZywgcGFzc3dvcmQ6IHN0cmluZyl7XG4gICAgbGV0IGF0dGVtcHRzID0gMDtcbiAgICBsZXQgY3VycmVudFVSTCA9IFwiXCI7XG5cbiAgICB0aGlzLndlYkNvbnRlbnRzLnJlbW92ZUxpc3RlbmVyKCdsb2dpbicsIHRoaXMubG9naW5FdmVudExpc3RlbmVyKTtcblxuICAgIHJldHVybiBhd2FpdCBuZXcgUHJvbWlzZTx2b2lkPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICB0aGlzLmxvZ2luRXZlbnRMaXN0ZW5lciA9IChldmVudCwgcmVxdWVzdCwgYXV0aEluZm8sIGNhbGxiYWNrKSA9PiB7XG4gICAgICAgIGlmKGN1cnJlbnRVUkwgIT09IHJlcXVlc3QudXJsKXtcbiAgICAgICAgICBhdHRlbXB0cyA9IDE7XG4gICAgICAgIH1cblxuICAgICAgICBpZihhdHRlbXB0cyA+PSA0KXtcbiAgICAgICAgICAvLyBuZWVkIHRvIGhhbmRsZSBlcnJvcjtcbiAgICAgICAgICB0aGlzLndlYkNvbnRlbnRzLnJlbW92ZUxpc3RlbmVyKCdsb2dpbicsIHRoaXMubG9naW5FdmVudExpc3RlbmVyKTtcbiAgICAgICAgICByZXR1cm4gY2FsbGJhY2sodXNlcm5hbWUsIHBhc3N3b3JkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjYWxsYmFjayh1c2VybmFtZSwgcGFzc3dvcmQpO1xuICAgICAgfTtcblxuICAgICAgdGhpcy53ZWJDb250ZW50cy5vbignbG9naW4nLCB0aGlzLmxvZ2luRXZlbnRMaXN0ZW5lcik7XG5cbiAgICAgIHJldHVybiByZXNvbHZlKCk7XG4gICAgfSk7XG4gIH1cbn0iXX0=