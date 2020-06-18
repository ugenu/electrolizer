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

var _async = require("async");

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

  wait() {
    var _arguments4 = arguments,
        _this22 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      var block;

      var errorTimeout = /*#__PURE__*/function () {
        var _ref = (0, _asyncToGenerator2.default)(function* () {
          yield (0, _delay.delay)(30000);
          throw new Error('timed out');
        });

        return function errorTimeout() {
          return _ref.apply(this, arguments);
        };
      }();

      switch (typeof _arguments4[0]) {
        case "number":
          block = _delay.delay.bind(null, _arguments4[0]);
          break;

        case "string":
          block = /*#__PURE__*/function () {
            var _ref2 = (0, _asyncToGenerator2.default)(function* () {
              return Promise.race([(0, _async.retry)(Infinity, _this22.exists.bind(_this22, _arguments4[0])), typeof _arguments4[1] === "number" ? (0, _delay.delay)(_arguments4[1]) : errorTimeout()]);
            });

            return function block() {
              return _ref2.apply(this, arguments);
            };
          }();

          break;

        case "function":
          block = /*#__PURE__*/function () {
            var _ref3 = (0, _asyncToGenerator2.default)(function* () {
              return Promise.race([//@ts-ignore
              (0, _async.retry)(Infinity, _this22.evaluate.apply(_this22, _arguments4)), errorTimeout()]);
            });

            return function block() {
              return _ref3.apply(this, arguments);
            };
          }();

        default:
          block = /*#__PURE__*/function () {
            var _ref4 = (0, _asyncToGenerator2.default)(function* () {});

            return function block() {
              return _ref4.apply(this, arguments);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9kcml2ZXJzL2RyaXZlci5jbGFzcy50cyJdLCJuYW1lcyI6WyJEcml2ZXIiLCJjb25zdHJ1Y3RvciIsImJ1cyIsIkNvb2tpZXMiLCJ3ZWJDb250ZW50cyIsImJ1c1R5cGUiLCJpbnN0YW5jZU9mVGVzdCIsIkJyb3dzZXJWaWV3IiwiZXJyb3IiLCJFbGVjdHJvbGl6ZXJUeXBlIiwid2VidmlldyIsImJyb3dzZXJWaWV3IiwiQnJvd3NlcldpbmRvdyIsImJyb3dzZXJXaW5kb3ciLCJfaW5qZWN0IiwiZm4iLCJfYXJncyIsIkFycmF5IiwicHJvdG90eXBlIiwic2xpY2UiLCJjYWxsIiwiYXJndW1lbnRzIiwibWFwIiwiYXJndW1lbnQiLCJKU09OIiwic3RyaW5naWZ5Iiwic3RyaW5nRm4iLCJTdHJpbmciLCJzb3VyY2UiLCJhcmdzIiwiZXhlY3V0ZUphdmFTY3JpcHQiLCJldmFsdWF0ZV9ub3ciLCJnb3RvIiwidXJsIiwiaGVhZGVycyIsIkVycm9yIiwibG9hZFVSTCIsImJhY2siLCJnb0JhY2siLCJmb3J3YXJkIiwiZ29Gb3J3YXJkIiwicmVmcmVzaCIsInJlbG9hZCIsImNsaWNrIiwic2VsZWN0b3IiLCJkb2N1bWVudCIsImFjdGl2ZUVsZW1lbnQiLCJibHVyIiwiZWxlbWVudCIsInF1ZXJ5U2VsZWN0b3IiLCJib3VuZGluZyIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsImV2ZW50IiwiTW91c2VFdmVudCIsInZpZXciLCJ3aW5kb3ciLCJidWJibGVzIiwiY2FuY2VsYWJsZSIsImNsaWVudFgiLCJsZWZ0Iiwid2lkdGgiLCJjbGllbnRZIiwidG9wIiwiaGVpZ2h0IiwiZGlzcGF0Y2hFdmVudCIsIm1vdXNlZG93biIsImV4aXN0cyIsInNlbGN0b3IiLCJtb3VzZXVwIiwibW91c2VvdmVyIiwibW91c2VvdXQiLCJjcmVhdGVFdmVudCIsImluaXRNb3VzZUV2ZW50IiwiZm9jdXMiLCJ0eXBlIiwidGV4dCIsImNoYXJzIiwic3BsaXQiLCJ0eXBlSW50ZXJ2YWwiLCJjaGFyIiwic2VuZElucHV0RXZlbnQiLCJrZXlDb2RlIiwiaW5zZXJ0IiwidmFsdWUiLCJjaGVjayIsImNoZWNrZWQiLCJpbml0RXZlbnQiLCJ1bmNoZWNrIiwic2VsZWN0Iiwib3B0aW9uIiwic2Nyb2xsVG8iLCJodG1sIiwiZG9jdW1lbnRFbGVtZW50Iiwib3V0ZXJIVE1MIiwidmlld3BvcnQiLCJidmJ1eCIsImJvdW5kcyIsImdldEJvdW5kcyIsInNldEJvdW5kcyIsInNldFNpemUiLCJpbmplY3QiLCJmaWxlIiwiY29udGVudHMiLCJwcm9taXNlcyIsInJlYWRGaWxlIiwiZW5jb2RpbmciLCJpbnNlcnRDU1MiLCJldmFsdWF0ZSIsIndhaXQiLCJibG9jayIsImVycm9yVGltZW91dCIsImRlbGF5IiwiYmluZCIsIlByb21pc2UiLCJyYWNlIiwiSW5maW5pdHkiLCJhcHBseSIsImhlYWRlciIsInVzZXJhZ2VudCIsInNldFVzZXJBZ2VudCIsImF1dGhlbnRpY2F0aW9uIiwidXNlcm5hbWUiLCJwYXNzd29yZCIsImF0dGVtcHRzIiwiY3VycmVudFVSTCIsInJlbW92ZUxpc3RlbmVyIiwibG9naW5FdmVudExpc3RlbmVyIiwicmVzb2x2ZSIsInJlamVjdCIsInJlcXVlc3QiLCJhdXRoSW5mbyIsImNhbGxiYWNrIiwib24iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTs7QUFHQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7O0FBRU8sTUFBTUEsTUFBTixDQUFvRztBQUl6R0MsRUFBQUEsV0FBVyxDQUFXQyxHQUFYLEVBQWtCO0FBQUEsU0FBUEEsR0FBTyxHQUFQQSxHQUFPO0FBQUEsbURBRm5CLElBQUlDLGdCQUFKLENBQVksS0FBS0MsV0FBakIsQ0FFbUI7QUFBQSw4REFrVmtKLE1BQU0sQ0FBRSxDQWxWMUo7QUFBRTs7QUFHL0IsTUFBSUMsT0FBSixHQUFnQztBQUM5QixRQUFJO0FBQ0YsVUFBSUMsY0FBYyxHQUFHLEtBQUtKLEdBQUwsWUFBb0JLLHFC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LEVBQUFBLGNBQU4sQ0FBcUJDLFFBQXJCLEVBQXVDQyxRQUF2QyxFQUF3RDtBQUFBOztBQUFBO0FBQ3RELFVBQUlDLFFBQVEsR0FBRyxDQUFmO0FBQ0EsVUFBSUMsVUFBVSxHQUFHLEVBQWpCOztBQUVBLE1BQUEsT0FBSSxDQUFDeEgsV0FBTCxDQUFpQnlILGNBQWpCLENBQWdDLE9BQWhDLEVBQXlDLE9BQUksQ0FBQ0Msa0JBQTlDOztBQUVBLG1CQUFhLElBQUliLE9BQUosQ0FBa0IsQ0FBQ2MsT0FBRCxFQUFVQyxNQUFWLEtBQXFCO0FBQ2xELFFBQUEsT0FBSSxDQUFDRixrQkFBTCxHQUEwQixDQUFDMUUsS0FBRCxFQUFRNkUsT0FBUixFQUFpQkMsUUFBakIsRUFBMkJDLFFBQTNCLEtBQXdDO0FBQ2hFLGNBQUdQLFVBQVUsS0FBS0ssT0FBTyxDQUFDaEcsR0FBMUIsRUFBOEI7QUFDNUIwRixZQUFBQSxRQUFRLEdBQUcsQ0FBWDtBQUNEOztBQUVELGNBQUdBLFFBQVEsSUFBSSxDQUFmLEVBQWlCO0FBQ2Y7QUFDQSxZQUFBLE9BQUksQ0FBQ3ZILFdBQUwsQ0FBaUJ5SCxjQUFqQixDQUFnQyxPQUFoQyxFQUF5QyxPQUFJLENBQUNDLGtCQUE5Qzs7QUFDQSxtQkFBT0ssUUFBUSxDQUFDVixRQUFELEVBQVdDLFFBQVgsQ0FBZjtBQUNEOztBQUVELGlCQUFPUyxRQUFRLENBQUNWLFFBQUQsRUFBV0MsUUFBWCxDQUFmO0FBQ0QsU0FaRDs7QUFjQSxRQUFBLE9BQUksQ0FBQ3RILFdBQUwsQ0FBaUJnSSxFQUFqQixDQUFvQixPQUFwQixFQUE2QixPQUFJLENBQUNOLGtCQUFsQzs7QUFFQSxlQUFPQyxPQUFPLEVBQWQ7QUFDRCxPQWxCWSxDQUFiO0FBTnNEO0FBeUJ2RDs7QUFqWHdHIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQnJvd3NlclZpZXcsIEJyb3dzZXJXaW5kb3csIFdlYnZpZXdUYWcsIFdlYkNvbnRlbnRzIH0gZnJvbSAnZWxlY3Ryb24nO1xuaW1wb3J0IHsgT3BlcmF0b3JGdW5jdGlvbnMgfSBmcm9tICcuLi9vcGVyYXRvci1mdW5jdGlvbnMuaW50ZXJmYWNlJztcbmltcG9ydCB7IFB1c2ggfSBmcm9tICcuLi9ldmFsdWF0ZS1mdW5jdGlvbi50eXBlJztcbmltcG9ydCB7IGV4ZWN1dGUsIGluamVjdCB9IGZyb20gJy4uL2phdmFzY3JpcHQudGVtcGxhdGUnO1xuaW1wb3J0IHsgRWxlY3Ryb2xpemVyVHlwZSB9IGZyb20gJy4uL2VsZWN0cm9saXplci5jbGFzcyc7XG5pbXBvcnQgeyBkZWxheSB9IGZyb20gJy4uL3V0aWxzL2RlbGF5LmZ1bmN0aW9uJztcbmltcG9ydCB7IHVudGlsLCByZXRyeSB9IGZyb20gJ2FzeW5jJztcbmltcG9ydCB7IHByb21pc2VzIH0gZnJvbSAnZnMnO1xuaW1wb3J0IHsgQ29va2llcyB9IGZyb20gJy4vY29va2llcy5jbGFzcyc7XG5cbmV4cG9ydCBjbGFzcyBEcml2ZXI8VCBleHRlbmRzIFdlYnZpZXdUYWcgfCBCcm93c2VyVmlldyB8IEJyb3dzZXJXaW5kb3c+IGltcGxlbWVudHMgT3BlcmF0b3JGdW5jdGlvbnM8dm9pZD4ge1xuXG4gIGNvb2tpZXMgPSBuZXcgQ29va2llcyh0aGlzLndlYkNvbnRlbnRzKTtcblxuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgYnVzOiBUKXt9XG5cbiBcbiAgZ2V0IGJ1c1R5cGUoKTogRWxlY3Ryb2xpemVyVHlwZSB7XG4gICAgdHJ5IHtcbiAgICAgIGxldCBpbnN0YW5jZU9mVGVzdCA9IHRoaXMuYnVzIGluc3RhbmNlb2YgQnJvd3NlclZpZXc7XG4gICAgfSBjYXRjaChlcnJvcil7XG4gICAgICByZXR1cm4gRWxlY3Ryb2xpemVyVHlwZS53ZWJ2aWV3O1xuICAgIH1cblxuICAgIGlmKHRoaXMuYnVzIGluc3RhbmNlb2YgQnJvd3NlclZpZXcpe1xuICAgICAgcmV0dXJuIEVsZWN0cm9saXplclR5cGUuYnJvd3NlclZpZXc7XG4gICAgfVxuXG4gICAgaWYodGhpcy5idXMgaW5zdGFuY2VvZiBCcm93c2VyV2luZG93KXtcbiAgICAgIHJldHVybiBFbGVjdHJvbGl6ZXJUeXBlLmJyb3dzZXJXaW5kb3c7XG4gICAgfVxuXG4gICAgcmV0dXJuIEVsZWN0cm9saXplclR5cGUud2VidmlldztcbiAgfVxuXG4gIFxuICBnZXQgd2ViQ29udGVudHMoKTogV2ViQ29udGVudHMge1xuICAgIHN3aXRjaCh0aGlzLmJ1c1R5cGUpe1xuICAgICAgY2FzZSBFbGVjdHJvbGl6ZXJUeXBlLndlYnZpZXc6XG4gICAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgICByZXR1cm4gKHRoaXMuYnVzIGFzIFdlYnZpZXdUYWcpXG4gICAgfVxuXG4gICAgcmV0dXJuICh0aGlzLmJ1cyBhcyBCcm93c2VyV2luZG93KS53ZWJDb250ZW50cztcbiAgfVxuXG4gIFxuICBwcml2YXRlIGFzeW5jIF9pbmplY3QoZm46IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAgIGxldCBfYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cykuc2xpY2UoMSkubWFwKGFyZ3VtZW50ID0+IHtcbiAgICAgIHJldHVybiB7IGFyZ3VtZW50OiBKU09OLnN0cmluZ2lmeShhcmd1bWVudCkgfVxuICAgIH0pO1xuXG4gICAgbGV0IHN0cmluZ0ZuID0gU3RyaW5nKGZuKTtcbiAgICBsZXQgc291cmNlID0gaW5qZWN0KHtmbjogc3RyaW5nRm4sIGFyZ3M6IF9hcmdzIH0pO1xuXG4gICAgcmV0dXJuIGF3YWl0IHRoaXMud2ViQ29udGVudHMuZXhlY3V0ZUphdmFTY3JpcHQoc291cmNlLCB0cnVlKTtcbiAgfVxuXG4gIFxuICBwcml2YXRlIGFzeW5jIGV2YWx1YXRlX25vdzxULCBLIGV4dGVuZHMgYW55W10sIFI+KGZuOiAoLi4uYXJnczogUHVzaDxLLCBUPikgPT4gUiwgLi4uYXJnczogSyk6IFByb21pc2U8Uj4ge1xuICAgIGxldCBfYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cykuc2xpY2UoMSkubWFwKGFyZ3VtZW50ID0+IHtcbiAgICAgIHJldHVybiB7IGFyZ3VtZW50OiBKU09OLnN0cmluZ2lmeShhcmd1bWVudCkgfVxuICAgIH0pO1xuXG4gICAgbGV0IHN0cmluZ0ZuID0gU3RyaW5nKGZuKTtcbiAgICBsZXQgc291cmNlID0gZXhlY3V0ZSh7Zm46IHN0cmluZ0ZuLCBhcmdzOiBfYXJncyB9KTtcblxuICAgIHJldHVybiBhd2FpdCB0aGlzLndlYkNvbnRlbnRzLmV4ZWN1dGVKYXZhU2NyaXB0KHNvdXJjZSwgdHJ1ZSk7XG4gIH1cblxuICBcbiAgYXN5bmMgZ290byh1cmw6IHN0cmluZywgaGVhZGVycz86IFJlY29yZDxzdHJpbmcsIHN0cmluZz4pOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBpZighdXJsKXsgdGhyb3cgbmV3IEVycm9yKCd1cmwgbXVzdCBiZSBkZWZpbmVkJyk7IH1cbiAgICBhd2FpdCB0aGlzLndlYkNvbnRlbnRzLmxvYWRVUkwodXJsKTtcbiAgfVxuXG4gIFxuICBhc3luYyBiYWNrKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHRoaXMud2ViQ29udGVudHMuZ29CYWNrKCk7XG4gIH1cblxuICBhc3luYyBmb3J3YXJkKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHRoaXMud2ViQ29udGVudHMuZ29Gb3J3YXJkKCk7XG4gIH1cblxuICBhc3luYyByZWZyZXNoKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHRoaXMud2ViQ29udGVudHMucmVsb2FkKCk7XG4gIH1cblxuICBhc3luYyBjbGljayhzZWxlY3Rvcjogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIHRoaXMuZXZhbHVhdGVfbm93KChzZWxlY3RvcikgPT4ge1xuICAgICAgLy9AdHMtaWdub3JlXG4gICAgICBkb2N1bWVudC5hY3RpdmVFbGVtZW50LmJsdXIoKVxuICAgICAgdmFyIGVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKVxuICAgICAgaWYgKCFlbGVtZW50KSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignVW5hYmxlIHRvIGZpbmQgZWxlbWVudCBieSBzZWxlY3RvcjogJyArIHNlbGVjdG9yKVxuICAgICAgfVxuICAgICAgdmFyIGJvdW5kaW5nID0gZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICAgICAgdmFyIGV2ZW50ID0gbmV3IE1vdXNlRXZlbnQoJ2NsaWNrJywge1xuICAgICAgICAvL0B0cy1pZ25vcmVcbiAgICAgICAgdmlldzogZG9jdW1lbnQud2luZG93LFxuICAgICAgICBidWJibGVzOiB0cnVlLFxuICAgICAgICBjYW5jZWxhYmxlOiB0cnVlLFxuICAgICAgICBjbGllbnRYOiBib3VuZGluZy5sZWZ0ICsgYm91bmRpbmcud2lkdGggLyAyLFxuICAgICAgICBjbGllbnRZOiBib3VuZGluZy50b3AgKyBib3VuZGluZy5oZWlnaHQgLyAyXG4gICAgICB9KTtcblxuICAgICAgZWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcbiAgICB9LCBzZWxlY3Rvcik7XG4gIH1cblxuICBhc3luYyBtb3VzZWRvd24oc2VsZWN0b3I6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuXG4gIH1cblxuICBcbiAgYXN5bmMgZXhpc3RzKHNlbGN0b3I6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHJldHVybiBhd2FpdCB0aGlzLmV2YWx1YXRlX25vdygoc2VsZWN0b3IpID0+IHtcbiAgICAgIGxldCBlbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7XG4gICAgICByZXR1cm4gZWxlbWVudCA/IHRydWUgOiBmYWxzZTtcbiAgICB9LCBzZWxjdG9yKTtcbiAgfVxuXG4gIFxuICBcbiAgYXN5bmMgbW91c2V1cChzZWxlY3Rvcjogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG5cbiAgfVxuICBcbiAgYXN5bmMgbW91c2VvdmVyKHNlbGVjdG9yOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcblxuICB9XG5cbiAgXG4gIGFzeW5jIG1vdXNlb3V0KHNlbGVjdG9yOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBhd2FpdCB0aGlzLmV2YWx1YXRlX25vdygoc2VsZWN0b3IpID0+IHtcbiAgICAgIGxldCBlbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3RvcilcbiAgICAgIGlmICghZWxlbWVudCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1VuYWJsZSB0byBmaW5kIGVsZW1lbnQgYnkgc2VsZWN0b3I6ICcgKyBzZWxlY3RvcilcbiAgICAgIH1cbiAgICAgIGxldCBldmVudCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdNb3VzZUV2ZW50JylcbiAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgZXZlbnQuaW5pdE1vdXNlRXZlbnQoJ21vdXNlb3V0JywgdHJ1ZSwgdHJ1ZSlcbiAgICAgIGVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudClcbiAgICB9LCBzZWxlY3Rvcik7XG4gIH1cblxuICBcbiAgYXN5bmMgZm9jdXMoc2VsZWN0b3I6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiB0aGlzLmV2YWx1YXRlX25vdygoc2VsZWN0b3IpID0+IHtcbiAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3RvcikuZm9jdXMoKTtcbiAgICB9LCBzZWxlY3Rvcik7XG4gIH1cblxuICBcbiAgYXN5bmMgYmx1cihzZWxlY3Rvcjogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIHRoaXMuZXZhbHVhdGVfbm93KChzZWxlY3RvcikgPT4ge1xuICAgICAgLy9AdHMtaWdub3JlXG4gICAgICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpXG4gICAgICBpZiAoZWxlbWVudCkge1xuICAgICAgICAvL0B0cy1pZ25vcmVcbiAgICAgICAgZWxlbWVudC5ibHVyKClcbiAgICAgIH1cbiAgICB9LCBzZWxlY3Rvcik7XG4gIH1cblxuICBcbiAgYXN5bmMgdHlwZShzZWxlY3Rvcjogc3RyaW5nLCB0ZXh0Pzogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgbGV0IGNoYXJzID0gU3RyaW5nKHRleHQpLnNwbGl0KCcnKTtcblxuICAgIGxldCB0eXBlSW50ZXJ2YWwgPSAyNTA7XG5cbiAgICBhd2FpdCB0aGlzLmZvY3VzKHNlbGVjdG9yKTtcblxuICAgIGZvcihsZXQgY2hhciBvZiBjaGFycyl7XG4gICAgICB0aGlzLndlYkNvbnRlbnRzLnNlbmRJbnB1dEV2ZW50KHtcbiAgICAgICAgdHlwZTogJ2tleURvd24nLFxuICAgICAgICAvL0B0cy1pZ25vcmVcbiAgICAgICAga2V5Q29kZTogY2hhcixcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLndlYkNvbnRlbnRzLnNlbmRJbnB1dEV2ZW50KHtcbiAgICAgICAgdHlwZTogJ2NoYXInLFxuICAgICAgICAvL0B0cy1pZ25vcmVcbiAgICAgICAga2V5Q29kZTogY2hhcixcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLndlYkNvbnRlbnRzLnNlbmRJbnB1dEV2ZW50KHtcbiAgICAgICAgdHlwZTogJ2tleVVwJyxcbiAgICAgICAgLy9AdHMtaWdub3JlXG4gICAgICAgIGtleUNvZGU6IGNoYXIsXG4gICAgICB9KTtcblxuICAgICAgYXdhaXQgZGVsYXkodHlwZUludGVydmFsKTtcbiAgICB9XG5cbiAgICBhd2FpdCB0aGlzLmJsdXIoc2VsZWN0b3IpO1xuICB9XG5cbiAgXG4gIGFzeW5jIGluc2VydChzZWxlY3Rvcjogc3RyaW5nLCB0ZXh0Pzogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuZXZhbHVhdGVfbm93KChzZWxlY3RvciwgdGV4dCkgPT4ge1xuICAgICAgLy9AdHMtaWdub3JlXG4gICAgICBkb2N1bWVudC5hY3RpdmVFbGVtZW50LmJsdXIoKVxuICAgICAgbGV0IGVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcblxuICAgICAgaWYgKCFlbGVtZW50KSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignVW5hYmxlIHRvIGZpbmQgZWxlbWVudCBieSBzZWxlY3RvcjogJyArIHNlbGVjdG9yKVxuICAgICAgfVxuICAgICAgLy9AdHMtaWdub3JlXG4gICAgICBlbGVtZW50LnZhbHVlID0gdGV4dCA/IHRleHQgOiAnJztcbiAgICB9LCBzZWxlY3RvciwgdGV4dCk7XG4gIH1cblxuICBcbiAgYXN5bmMgY2hlY2soc2VsZWN0b3I6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAgIGF3YWl0IHRoaXMuZXZhbHVhdGVfbm93KChzZWxlY3RvcikgPT4ge1xuICAgICAgbGV0IGVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcblxuICAgICAgaWYgKCFlbGVtZW50KSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignVW5hYmxlIHRvIGZpbmQgZWxlbWVudCBieSBzZWxlY3RvcjogJyArIHNlbGVjdG9yKVxuICAgICAgfVxuXG4gICAgICBsZXQgZXZlbnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnSFRNTEV2ZW50cycpO1xuICAgICAgKGVsZW1lbnQgYXMgSFRNTElucHV0RWxlbWVudCkuY2hlY2tlZCA9IHRydWU7XG4gICAgICBldmVudC5pbml0RXZlbnQoJ2NoYW5nZScsIHRydWUsIHRydWUpO1xuICAgICAgZWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcbiAgICB9LCBzZWxlY3Rvcik7XG4gIH1cblxuICBcbiAgYXN5bmMgdW5jaGVjayhzZWxlY3Rvcjogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgdGhpcy5ldmFsdWF0ZV9ub3coKHNlbGVjdG9yKSA9PiB7XG4gICAgICBsZXQgZWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xuICAgICAgaWYgKCFlbGVtZW50KSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignVW5hYmxlIHRvIGZpbmQgZWxlbWVudCBieSBzZWxlY3RvcjogJyArIHNlbGVjdG9yKVxuICAgICAgfVxuICAgICAgbGV0IGV2ZW50ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0hUTUxFdmVudHMnKTtcbiAgICAgIChlbGVtZW50IGFzIEhUTUxJbnB1dEVsZW1lbnQpLmNoZWNrZWQgPSBmYWxzZTtcbiAgICAgIGV2ZW50LmluaXRFdmVudCgnY2hhbmdlJywgdHJ1ZSwgdHJ1ZSk7XG4gICAgICBlbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuICAgIH0sIHNlbGVjdG9yKTtcbiAgfVxuXG5cbiAgYXN5bmMgc2VsZWN0KHNlbGVjdG9yOiBzdHJpbmcsIG9wdGlvbj86IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAgIHRoaXMuZXZhbHVhdGVfbm93KChzZWxlY3RvcikgPT4ge1xuICAgICAgbGV0IGVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcbiAgICAgIGlmICghZWxlbWVudCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1VuYWJsZSB0byBmaW5kIGVsZW1lbnQgYnkgc2VsZWN0b3I6ICcgKyBzZWxlY3RvcilcbiAgICAgIH1cbiAgICAgIGxldCBldmVudCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdIVE1MRXZlbnRzJyk7XG4gICAgICAoZWxlbWVudCBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZSA9IG9wdGlvbiA/IG9wdGlvbiA6ICcnO1xuICAgICAgZXZlbnQuaW5pdEV2ZW50KCdjaGFuZ2UnLCB0cnVlLCB0cnVlKTtcbiAgICAgIGVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XG4gICAgfSwgc2VsZWN0b3IpO1xuICB9XG5cbiAgYXN5bmMgc2Nyb2xsVG8odG9wOiBudW1iZXIsIGxlZnQ6IG51bWJlcik6IFByb21pc2U8dm9pZD4ge1xuICAgIGF3YWl0IHRoaXMuZXZhbHVhdGVfbm93KCh0b3AsIGxlZnQpID0+IHtcbiAgICAgIHdpbmRvdy5zY3JvbGxUbyh7IHRvcCwgbGVmdCB9KTtcbiAgICB9LCB0b3AsIGxlZnQpO1xuICB9XG5cbiAgYXN5bmMgaHRtbCgpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIHJldHVybiB0aGlzLmV2YWx1YXRlX25vdygoKSA9PiB7XG4gICAgICByZXR1cm4gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50Lm91dGVySFRNTFxuICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgdmlld3BvcnQod2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBzd2l0Y2godGhpcy5idXNUeXBlKXtcbiAgICAgIGNhc2UgRWxlY3Ryb2xpemVyVHlwZS53ZWJ2aWV3OlxuICAgICAgICByZXR1cm47XG4gICAgICBjYXNlIEVsZWN0cm9saXplclR5cGUuYnJvd3NlclZpZXc6XG4gICAgICAgIGxldCBidmJ1eDogQnJvd3NlclZpZXcgPSB0aGlzLmJ1cyBhcyBCcm93c2VyVmlldztcbiAgICAgICAgLy9AdHMtaWdub3JlXG4gICAgICAgIGxldCBib3VuZHMgPSBidmJ1eC5nZXRCb3VuZHMoKSBhcyBFbGVjdHJvbi5SZWN0YW5nbGU7XG4gICAgICAgIGJ2YnV4LnNldEJvdW5kcyh7XG4gICAgICAgICAgLi4uYm91bmRzLFxuICAgICAgICAgIHdpZHRoLFxuICAgICAgICAgIGhlaWdodFxuICAgICAgICB9KVxuICAgICAgICByZXR1cm47XG4gICAgICBjYXNlIEVsZWN0cm9saXplclR5cGUuYnJvd3NlcldpbmRvdzpcbiAgICAgICAgKHRoaXMuYnVzIGFzIChCcm93c2VyV2luZG93KSkuc2V0U2l6ZSh3aWR0aCwgaGVpZ2h0KTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGluamVjdCh0eXBlOiAnanMnIHwgJ2NzcycsIGZpbGU6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAgIGxldCBjb250ZW50cyA9IGF3YWl0IHByb21pc2VzLnJlYWRGaWxlKGZpbGUsIHsgZW5jb2Rpbmc6ICd1dGYtOCcgfSkgYXMgc3RyaW5nO1xuICAgIHN3aXRjaCh0eXBlKXtcbiAgICAgIGNhc2UgJ2pzJzpcbiAgICAgICAgYXdhaXQgdGhpcy5faW5qZWN0KGNvbnRlbnRzKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdjc3MnOlxuICAgICAgICB0aGlzLndlYkNvbnRlbnRzLmluc2VydENTUyhjb250ZW50cyk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGV2YWx1YXRlPFQsIEsgZXh0ZW5kcyBhbnlbXSwgUj4oZm46ICguLi5hcmdzOiBQdXNoPEssIFQ+KSA9PiBSLCAuLi5hcmdzOiBLKTogUHJvbWlzZTxSPiB7XG4gICAgcmV0dXJuIHRoaXMuZXZhbHVhdGVfbm93KGZuLCAuLi5hcmdzKTtcbiAgfVxuIFxuXG4gIGFzeW5jIHdhaXQobXM6IG51bWJlcik6IFByb21pc2U8dm9pZD5cbiAgYXN5bmMgd2FpdChzZWxlY3Rvcjogc3RyaW5nLCBtc0RlbGF5PzogbnVtYmVyKTogUHJvbWlzZTx2b2lkPiBcbiAgYXN5bmMgd2FpdDxULCBLIGV4dGVuZHMgYW55W10+KGZuOiAoLi4uYXJnczogUHVzaDxLLCBUPikgPT4gYm9vbGVhbiAgfCBQcm9taXNlPGJvb2xlYW4+LCAuLi5hcmdzOiBLKTogUHJvbWlzZTx2b2lkPlxuICBhc3luYyB3YWl0KCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGxldCBibG9jazogKCkgPT4gUHJvbWlzZTx2b2lkPjtcblxuICAgIGxldCBlcnJvclRpbWVvdXQgPSBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgICBhd2FpdCBkZWxheSgzMDAwMCk7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ3RpbWVkIG91dCcpO1xuICAgIH07XG5cbiAgICBzd2l0Y2godHlwZW9mIGFyZ3VtZW50c1swXSl7XG4gICAgICBjYXNlIFwibnVtYmVyXCI6XG4gICAgICAgIGJsb2NrID0gZGVsYXkuYmluZChudWxsLCBhcmd1bWVudHNbMF0pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJzdHJpbmdcIjpcbiAgICAgICAgYmxvY2sgPSBhc3luYyAoKSA9PiBQcm9taXNlLnJhY2UoW1xuICAgICAgICAgIHJldHJ5KEluZmluaXR5LCB0aGlzLmV4aXN0cy5iaW5kKHRoaXMsIGFyZ3VtZW50c1swXSkpLFxuICAgICAgICAgIHR5cGVvZiBhcmd1bWVudHNbMV0gPT09IFwibnVtYmVyXCIgPyBkZWxheShhcmd1bWVudHNbMV0pIDogZXJyb3JUaW1lb3V0KCksXG4gICAgICAgIF0pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJmdW5jdGlvblwiOlxuICAgICAgICBibG9jayA9IGFzeW5jICgpID0+IFByb21pc2UucmFjZShbXG4gICAgICAgICAgLy9AdHMtaWdub3JlXG4gICAgICAgICAgcmV0cnkoSW5maW5pdHksIHRoaXMuZXZhbHVhdGUuYXBwbHkodGhpcywgYXJndW1lbnRzKSksXG4gICAgICAgICAgZXJyb3JUaW1lb3V0KCksXG4gICAgICAgIF0pO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgYmxvY2sgPSBhc3luYyAoKSA9PiB7fTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgYXdhaXQgYmxvY2soKTtcbiAgfVxuXG4gIFxuICBhc3luYyBoZWFkZXIoaGVhZGVyOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcblxuICB9XG5cbiAgYXN5bmMgdXNlcmFnZW50KHVzZXJhZ2VudDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgdGhpcy53ZWJDb250ZW50cy5zZXRVc2VyQWdlbnQodXNlcmFnZW50KTtcbiAgfVxuICBcbiAgcHJpdmF0ZSBsb2dpbkV2ZW50TGlzdGVuZXIgOiAoZXZlbnQ6IEVsZWN0cm9uLkV2ZW50LCByZXF1ZXN0OiBFbGVjdHJvbi5SZXF1ZXN0LCBhdXRoSW5mbzogRWxlY3Ryb24uQXV0aEluZm8sIGNhbGxiYWNrOiAodXNlcm5hbWU6IHN0cmluZywgcGFzc3dvcmQ6IHN0cmluZykgPT4gdm9pZCkgPT4gdm9pZCA9ICgpID0+IHt9XG5cbiAgYXN5bmMgYXV0aGVudGljYXRpb24odXNlcm5hbWU6IHN0cmluZywgcGFzc3dvcmQ6IHN0cmluZyl7XG4gICAgbGV0IGF0dGVtcHRzID0gMDtcbiAgICBsZXQgY3VycmVudFVSTCA9IFwiXCI7XG5cbiAgICB0aGlzLndlYkNvbnRlbnRzLnJlbW92ZUxpc3RlbmVyKCdsb2dpbicsIHRoaXMubG9naW5FdmVudExpc3RlbmVyKTtcblxuICAgIHJldHVybiBhd2FpdCBuZXcgUHJvbWlzZTx2b2lkPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICB0aGlzLmxvZ2luRXZlbnRMaXN0ZW5lciA9IChldmVudCwgcmVxdWVzdCwgYXV0aEluZm8sIGNhbGxiYWNrKSA9PiB7XG4gICAgICAgIGlmKGN1cnJlbnRVUkwgIT09IHJlcXVlc3QudXJsKXtcbiAgICAgICAgICBhdHRlbXB0cyA9IDE7XG4gICAgICAgIH1cblxuICAgICAgICBpZihhdHRlbXB0cyA+PSA0KXtcbiAgICAgICAgICAvLyBuZWVkIHRvIGhhbmRsZSBlcnJvcjtcbiAgICAgICAgICB0aGlzLndlYkNvbnRlbnRzLnJlbW92ZUxpc3RlbmVyKCdsb2dpbicsIHRoaXMubG9naW5FdmVudExpc3RlbmVyKTtcbiAgICAgICAgICByZXR1cm4gY2FsbGJhY2sodXNlcm5hbWUsIHBhc3N3b3JkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjYWxsYmFjayh1c2VybmFtZSwgcGFzc3dvcmQpO1xuICAgICAgfTtcblxuICAgICAgdGhpcy53ZWJDb250ZW50cy5vbignbG9naW4nLCB0aGlzLmxvZ2luRXZlbnRMaXN0ZW5lcik7XG5cbiAgICAgIHJldHVybiByZXNvbHZlKCk7XG4gICAgfSk7XG4gIH1cbn0iXX0=