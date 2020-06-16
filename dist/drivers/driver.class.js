"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Driver = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _electron = require("electron");

var _javascript = require("../javascript.template");

var _electrolizer = require("../electrolizer.class");

var _delay = require("../utils/delay.function");

var _async = require("async");

var _fs = require("fs");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

//@ts-ignore
class Driver {
  constructor(bus) {
    this.bus = bus;
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
              return Promise.race([(0, _async.retry)({
                times: Infinity,
                interval: 100
              }, _this22.exists.bind(_this22, _arguments4[0])), yield errorTimeout()]);
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
              (0, _async.retry)({
                times: Infinity,
                interval: 100
              }, _this22.evaluate.apply(_this22, _arguments4)), yield errorTimeout()]);
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

}

exports.Driver = Driver;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9kcml2ZXJzL2RyaXZlci5jbGFzcy50cyJdLCJuYW1lcyI6WyJEcml2ZXIiLCJjb25zdHJ1Y3RvciIsImJ1cyIsImJ1c1R5cGUiLCJpbnN0YW5jZU9mVGVzdCIsIkJyb3dzZXJWaWV3IiwiZXJyb3IiLCJFbGVjdHJvbGl6ZXJUeXBlIiwid2VidmlldyIsImJyb3dzZXJWaWV3IiwiQnJvd3NlcldpbmRvdyIsImJyb3dzZXJXaW5kb3ciLCJ3ZWJDb250ZW50cyIsIl9pbmplY3QiLCJmbiIsIl9hcmdzIiwiQXJyYXkiLCJwcm90b3R5cGUiLCJzbGljZSIsImNhbGwiLCJhcmd1bWVudHMiLCJtYXAiLCJhcmd1bWVudCIsIkpTT04iLCJzdHJpbmdpZnkiLCJzdHJpbmdGbiIsIlN0cmluZyIsInNvdXJjZSIsImFyZ3MiLCJleGVjdXRlSmF2YVNjcmlwdCIsImV2YWx1YXRlX25vdyIsImdvdG8iLCJ1cmwiLCJoZWFkZXJzIiwibG9hZFVSTCIsImJhY2siLCJnb0JhY2siLCJmb3J3YXJkIiwiZ29Gb3J3YXJkIiwicmVmcmVzaCIsInJlbG9hZCIsImNsaWNrIiwic2VsZWN0b3IiLCJkb2N1bWVudCIsImFjdGl2ZUVsZW1lbnQiLCJibHVyIiwiZWxlbWVudCIsInF1ZXJ5U2VsZWN0b3IiLCJFcnJvciIsImJvdW5kaW5nIiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwiZXZlbnQiLCJNb3VzZUV2ZW50IiwidmlldyIsIndpbmRvdyIsImJ1YmJsZXMiLCJjYW5jZWxhYmxlIiwiY2xpZW50WCIsImxlZnQiLCJ3aWR0aCIsImNsaWVudFkiLCJ0b3AiLCJoZWlnaHQiLCJkaXNwYXRjaEV2ZW50IiwibW91c2Vkb3duIiwiZXhpc3RzIiwic2VsY3RvciIsIm1vdXNldXAiLCJtb3VzZW92ZXIiLCJtb3VzZW91dCIsImNyZWF0ZUV2ZW50IiwiaW5pdE1vdXNlRXZlbnQiLCJmb2N1cyIsInR5cGUiLCJ0ZXh0IiwiY2hhcnMiLCJzcGxpdCIsInR5cGVJbnRlcnZhbCIsImNoYXIiLCJzZW5kSW5wdXRFdmVudCIsImtleUNvZGUiLCJpbnNlcnQiLCJ2YWx1ZSIsImNoZWNrIiwiY2hlY2tlZCIsImluaXRFdmVudCIsInVuY2hlY2siLCJzZWxlY3QiLCJvcHRpb24iLCJzY3JvbGxUbyIsImh0bWwiLCJkb2N1bWVudEVsZW1lbnQiLCJvdXRlckhUTUwiLCJ2aWV3cG9ydCIsImJ2YnV4IiwiYm91bmRzIiwiZ2V0Qm91bmRzIiwic2V0Qm91bmRzIiwic2V0U2l6ZSIsImluamVjdCIsImZpbGUiLCJjb250ZW50cyIsInByb21pc2VzIiwicmVhZEZpbGUiLCJlbmNvZGluZyIsImluc2VydENTUyIsImV2YWx1YXRlIiwid2FpdCIsImJsb2NrIiwiZXJyb3JUaW1lb3V0IiwiZGVsYXkiLCJiaW5kIiwiUHJvbWlzZSIsInJhY2UiLCJ0aW1lcyIsIkluZmluaXR5IiwiaW50ZXJ2YWwiLCJhcHBseSIsImhlYWRlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBOztBQUdBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7QUFFQTtBQUNPLE1BQU1BLE1BQU4sQ0FBb0c7QUFDekdDLEVBQUFBLFdBQVcsQ0FBV0MsR0FBWCxFQUFrQjtBQUFBLFNBQVBBLEdBQU8sR0FBUEEsR0FBTztBQUFFOztBQUcvQixNQUFJQyxPQUFKLEdBQWdDO0FBQzlCLFFBQUk7QUFDRixVQUFJQyxjQUFjLEdBQUcsS0FBS0YsR0FBTCxZQUFvQkcscUJBQXpDO0FBQ0QsS0FGRCxDQUVFLE9BQU1DLEtBQU4sRUFBWTtBQUNaLGFBQU9DLCtCQUFpQkMsT0FBeEI7QUFDRDs7QUFFRCxRQUFHLEtBQUtOLEdBQUwsWUFBb0JHLHFCQUF2QixFQUFtQztBQUNqQyxhQUFPRSwrQkFBaUJFLFdBQXhCO0FBQ0Q7O0FBRUQsUUFBRyxLQUFLUCxHQUFMLFlBQW9CUSx1QkFBdkIsRUFBcUM7QUFDbkMsYUFBT0gsK0JBQWlCSSxhQUF4QjtBQUNEOztBQUVELFdBQU9KLCtCQUFpQkMsT0FBeEI7QUFDRDs7QUFHRCxNQUFJ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OztBQUlBOztBQUNGLGFBQUssVUFBTDtBQUNFRCxVQUFBQSxLQUFLO0FBQUEsd0RBQUc7QUFBQSxxQkFBWUksT0FBTyxDQUFDQyxJQUFSLENBQWEsQ0FDL0I7QUFDQSxnQ0FBTTtBQUFFQyxnQkFBQUEsS0FBSyxFQUFFQyxRQUFUO0FBQW1CQyxnQkFBQUEsUUFBUSxFQUFFO0FBQTdCLGVBQU4sRUFBMEMsT0FBSSxDQUFDVixRQUFMLENBQWNXLEtBQWQsQ0FBb0IsT0FBcEIsRUFBMEJqRyxXQUExQixDQUExQyxDQUYrQixRQUd6QnlGLFlBQVksRUFIYSxDQUFiLENBQVo7QUFBQSxhQUFIOztBQUFBO0FBQUE7QUFBQTtBQUFBLGFBQUw7O0FBS0Y7QUFDRUQsVUFBQUEsS0FBSztBQUFBLHdEQUFHLGFBQVksQ0FBRSxDQUFqQjs7QUFBQTtBQUFBO0FBQUE7QUFBQSxhQUFMOztBQUNBO0FBbEJKOztBQXFCQSxZQUFNQSxLQUFLLEVBQVg7QUE3QjBCO0FBOEIzQjs7QUFHS1UsRUFBQUEsTUFBTixDQUFhQSxNQUFiLEVBQTZCcEMsS0FBN0IsRUFBMkQ7QUFBQTtBQUUxRDs7QUE1VXdHIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQnJvd3NlclZpZXcsIEJyb3dzZXJXaW5kb3csIFdlYnZpZXdUYWcsIFdlYkNvbnRlbnRzIH0gZnJvbSAnZWxlY3Ryb24nO1xuaW1wb3J0IHsgT3BlcmF0b3JGdW5jdGlvbnMgfSBmcm9tICcuLi9vcGVyYXRvci1mdW5jdGlvbnMuaW50ZXJmYWNlJztcbmltcG9ydCB7IFB1c2ggfSBmcm9tICcuLi9ldmFsdWF0ZS1mdW5jdGlvbi50eXBlJztcbmltcG9ydCB7IGV4ZWN1dGUsIGluamVjdCB9IGZyb20gJy4uL2phdmFzY3JpcHQudGVtcGxhdGUnO1xuaW1wb3J0IHsgRWxlY3Ryb2xpemVyVHlwZSB9IGZyb20gJy4uL2VsZWN0cm9saXplci5jbGFzcyc7XG5pbXBvcnQgeyBkZWxheSB9IGZyb20gJy4uL3V0aWxzL2RlbGF5LmZ1bmN0aW9uJztcbmltcG9ydCB7IHVudGlsLCByZXRyeSB9IGZyb20gJ2FzeW5jJztcbmltcG9ydCB7IHByb21pc2VzIH0gZnJvbSAnZnMnO1xuXG4vL0B0cy1pZ25vcmVcbmV4cG9ydCBjbGFzcyBEcml2ZXI8VCBleHRlbmRzIFdlYnZpZXdUYWcgfCBCcm93c2VyVmlldyB8IEJyb3dzZXJXaW5kb3c+IGltcGxlbWVudHMgT3BlcmF0b3JGdW5jdGlvbnM8dm9pZD4ge1xuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgYnVzOiBUKXt9XG5cbiBcbiAgZ2V0IGJ1c1R5cGUoKTogRWxlY3Ryb2xpemVyVHlwZSB7XG4gICAgdHJ5IHtcbiAgICAgIGxldCBpbnN0YW5jZU9mVGVzdCA9IHRoaXMuYnVzIGluc3RhbmNlb2YgQnJvd3NlclZpZXc7XG4gICAgfSBjYXRjaChlcnJvcil7XG4gICAgICByZXR1cm4gRWxlY3Ryb2xpemVyVHlwZS53ZWJ2aWV3O1xuICAgIH1cblxuICAgIGlmKHRoaXMuYnVzIGluc3RhbmNlb2YgQnJvd3NlclZpZXcpe1xuICAgICAgcmV0dXJuIEVsZWN0cm9saXplclR5cGUuYnJvd3NlclZpZXc7XG4gICAgfVxuXG4gICAgaWYodGhpcy5idXMgaW5zdGFuY2VvZiBCcm93c2VyV2luZG93KXtcbiAgICAgIHJldHVybiBFbGVjdHJvbGl6ZXJUeXBlLmJyb3dzZXJXaW5kb3c7XG4gICAgfVxuXG4gICAgcmV0dXJuIEVsZWN0cm9saXplclR5cGUud2VidmlldztcbiAgfVxuXG4gIFxuICBnZXQgd2ViQ29udGVudHMoKTogV2ViQ29udGVudHMge1xuICAgIHN3aXRjaCh0aGlzLmJ1c1R5cGUpe1xuICAgICAgY2FzZSBFbGVjdHJvbGl6ZXJUeXBlLndlYnZpZXc6XG4gICAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgICByZXR1cm4gKHRoaXMuYnVzIGFzIFdlYnZpZXdUYWcpXG4gICAgfVxuXG4gICAgcmV0dXJuICh0aGlzLmJ1cyBhcyBCcm93c2VyV2luZG93KS53ZWJDb250ZW50cztcbiAgfVxuXG4gIFxuICBwcml2YXRlIGFzeW5jIF9pbmplY3QoZm46IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAgIGxldCBfYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cykuc2xpY2UoMSkubWFwKGFyZ3VtZW50ID0+IHtcbiAgICAgIHJldHVybiB7IGFyZ3VtZW50OiBKU09OLnN0cmluZ2lmeShhcmd1bWVudCkgfVxuICAgIH0pO1xuXG4gICAgbGV0IHN0cmluZ0ZuID0gU3RyaW5nKGZuKTtcbiAgICBsZXQgc291cmNlID0gaW5qZWN0KHtmbjogc3RyaW5nRm4sIGFyZ3M6IF9hcmdzIH0pO1xuXG4gICAgcmV0dXJuIGF3YWl0IHRoaXMud2ViQ29udGVudHMuZXhlY3V0ZUphdmFTY3JpcHQoc291cmNlLCB0cnVlKTtcbiAgfVxuXG4gIFxuICBhc3luYyBldmFsdWF0ZV9ub3c8VCwgSyBleHRlbmRzIGFueVtdLCBSPihmbjogKC4uLmFyZ3M6IFB1c2g8SywgVD4pID0+IFIsIC4uLmFyZ3M6IEspOiBQcm9taXNlPFI+IHtcbiAgICBsZXQgX2FyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpLnNsaWNlKDEpLm1hcChhcmd1bWVudCA9PiB7XG4gICAgICByZXR1cm4geyBhcmd1bWVudDogSlNPTi5zdHJpbmdpZnkoYXJndW1lbnQpIH1cbiAgICB9KTtcblxuICAgIGxldCBzdHJpbmdGbiA9IFN0cmluZyhmbik7XG4gICAgbGV0IHNvdXJjZSA9IGV4ZWN1dGUoe2ZuOiBzdHJpbmdGbiwgYXJnczogX2FyZ3MgfSk7XG5cbiAgICByZXR1cm4gYXdhaXQgdGhpcy53ZWJDb250ZW50cy5leGVjdXRlSmF2YVNjcmlwdChzb3VyY2UsIHRydWUpO1xuICB9XG5cbiAgXG4gIGFzeW5jIGdvdG8odXJsOiBzdHJpbmcsIGhlYWRlcnM/OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+KTogUHJvbWlzZTx2b2lkPiB7XG4gICAgYXdhaXQgdGhpcy53ZWJDb250ZW50cy5sb2FkVVJMKHVybCk7XG4gIH1cblxuICBcbiAgYXN5bmMgYmFjaygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICB0aGlzLndlYkNvbnRlbnRzLmdvQmFjaygpO1xuICB9XG5cbiAgYXN5bmMgZm9yd2FyZCgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICB0aGlzLndlYkNvbnRlbnRzLmdvRm9yd2FyZCgpO1xuICB9XG5cbiAgYXN5bmMgcmVmcmVzaCgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICB0aGlzLndlYkNvbnRlbnRzLnJlbG9hZCgpO1xuICB9XG5cbiAgYXN5bmMgY2xpY2soc2VsZWN0b3I6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiB0aGlzLmV2YWx1YXRlX25vdygoc2VsZWN0b3IpID0+IHtcbiAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgZG9jdW1lbnQuYWN0aXZlRWxlbWVudC5ibHVyKClcbiAgICAgIHZhciBlbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3RvcilcbiAgICAgIGlmICghZWxlbWVudCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1VuYWJsZSB0byBmaW5kIGVsZW1lbnQgYnkgc2VsZWN0b3I6ICcgKyBzZWxlY3RvcilcbiAgICAgIH1cbiAgICAgIHZhciBib3VuZGluZyA9IGVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICAgIHZhciBldmVudCA9IG5ldyBNb3VzZUV2ZW50KCdjbGljaycsIHtcbiAgICAgICAgLy9AdHMtaWdub3JlXG4gICAgICAgIHZpZXc6IGRvY3VtZW50LndpbmRvdyxcbiAgICAgICAgYnViYmxlczogdHJ1ZSxcbiAgICAgICAgY2FuY2VsYWJsZTogdHJ1ZSxcbiAgICAgICAgY2xpZW50WDogYm91bmRpbmcubGVmdCArIGJvdW5kaW5nLndpZHRoIC8gMixcbiAgICAgICAgY2xpZW50WTogYm91bmRpbmcudG9wICsgYm91bmRpbmcuaGVpZ2h0IC8gMlxuICAgICAgfSk7XG5cbiAgICAgIGVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XG4gICAgfSwgc2VsZWN0b3IpO1xuICB9XG5cbiAgYXN5bmMgbW91c2Vkb3duKHNlbGVjdG9yOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcblxuICB9XG5cbiAgXG4gIGFzeW5jIGV4aXN0cyhzZWxjdG9yOiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gYXdhaXQgdGhpcy5ldmFsdWF0ZV9ub3coKHNlbGVjdG9yKSA9PiB7XG4gICAgICBsZXQgZWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xuICAgICAgcmV0dXJuIGVsZW1lbnQgPyB0cnVlIDogZmFsc2U7XG4gICAgfSwgc2VsY3Rvcik7XG4gIH1cblxuICBcbiAgXG4gIGFzeW5jIG1vdXNldXAoc2VsZWN0b3I6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuXG4gIH1cbiAgXG4gIGFzeW5jIG1vdXNlb3ZlcihzZWxlY3Rvcjogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG5cbiAgfVxuXG4gIFxuICBhc3luYyBtb3VzZW91dChzZWxlY3Rvcjogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgYXdhaXQgdGhpcy5ldmFsdWF0ZV9ub3coKHNlbGVjdG9yKSA9PiB7XG4gICAgICBsZXQgZWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpXG4gICAgICBpZiAoIWVsZW1lbnQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmFibGUgdG8gZmluZCBlbGVtZW50IGJ5IHNlbGVjdG9yOiAnICsgc2VsZWN0b3IpXG4gICAgICB9XG4gICAgICBsZXQgZXZlbnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnTW91c2VFdmVudCcpXG4gICAgICAvL0B0cy1pZ25vcmVcbiAgICAgIGV2ZW50LmluaXRNb3VzZUV2ZW50KCdtb3VzZW91dCcsIHRydWUsIHRydWUpXG4gICAgICBlbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpXG4gICAgfSwgc2VsZWN0b3IpO1xuICB9XG5cbiAgXG4gIGFzeW5jIGZvY3VzKHNlbGVjdG9yOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gdGhpcy5ldmFsdWF0ZV9ub3coKHNlbGVjdG9yKSA9PiB7XG4gICAgICAvL0B0cy1pZ25vcmVcbiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpLmZvY3VzKCk7XG4gICAgfSwgc2VsZWN0b3IpO1xuICB9XG5cbiAgXG4gIGFzeW5jIGJsdXIoc2VsZWN0b3I6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiB0aGlzLmV2YWx1YXRlX25vdygoc2VsZWN0b3IpID0+IHtcbiAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgdmFyIGVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKVxuICAgICAgaWYgKGVsZW1lbnQpIHtcbiAgICAgICAgLy9AdHMtaWdub3JlXG4gICAgICAgIGVsZW1lbnQuYmx1cigpXG4gICAgICB9XG4gICAgfSwgc2VsZWN0b3IpO1xuICB9XG5cbiAgXG4gIGFzeW5jIHR5cGUoc2VsZWN0b3I6IHN0cmluZywgdGV4dD86IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAgIGxldCBjaGFycyA9IFN0cmluZyh0ZXh0KS5zcGxpdCgnJyk7XG5cbiAgICBsZXQgdHlwZUludGVydmFsID0gMjUwO1xuXG4gICAgYXdhaXQgdGhpcy5mb2N1cyhzZWxlY3Rvcik7XG5cbiAgICBmb3IobGV0IGNoYXIgb2YgY2hhcnMpe1xuICAgICAgdGhpcy53ZWJDb250ZW50cy5zZW5kSW5wdXRFdmVudCh7XG4gICAgICAgIHR5cGU6ICdrZXlEb3duJyxcbiAgICAgICAgLy9AdHMtaWdub3JlXG4gICAgICAgIGtleUNvZGU6IGNoYXIsXG4gICAgICB9KTtcblxuICAgICAgdGhpcy53ZWJDb250ZW50cy5zZW5kSW5wdXRFdmVudCh7XG4gICAgICAgIHR5cGU6ICdjaGFyJyxcbiAgICAgICAgLy9AdHMtaWdub3JlXG4gICAgICAgIGtleUNvZGU6IGNoYXIsXG4gICAgICB9KTtcblxuICAgICAgdGhpcy53ZWJDb250ZW50cy5zZW5kSW5wdXRFdmVudCh7XG4gICAgICAgIHR5cGU6ICdrZXlVcCcsXG4gICAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgICBrZXlDb2RlOiBjaGFyLFxuICAgICAgfSk7XG5cbiAgICAgIGF3YWl0IGRlbGF5KHR5cGVJbnRlcnZhbCk7XG4gICAgfVxuXG4gICAgYXdhaXQgdGhpcy5ibHVyKHNlbGVjdG9yKTtcbiAgfVxuXG4gIFxuICBhc3luYyBpbnNlcnQoc2VsZWN0b3I6IHN0cmluZywgdGV4dD86IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiBhd2FpdCB0aGlzLmV2YWx1YXRlX25vdygoc2VsZWN0b3IsIHRleHQpID0+IHtcbiAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgZG9jdW1lbnQuYWN0aXZlRWxlbWVudC5ibHVyKClcbiAgICAgIGxldCBlbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7XG5cbiAgICAgIGlmICghZWxlbWVudCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1VuYWJsZSB0byBmaW5kIGVsZW1lbnQgYnkgc2VsZWN0b3I6ICcgKyBzZWxlY3RvcilcbiAgICAgIH1cbiAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgZWxlbWVudC52YWx1ZSA9IHRleHQgPyB0ZXh0IDogJyc7XG4gICAgfSwgc2VsZWN0b3IsIHRleHQpO1xuICB9XG5cbiAgXG4gIGFzeW5jIGNoZWNrKHNlbGVjdG9yOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBhd2FpdCB0aGlzLmV2YWx1YXRlX25vdygoc2VsZWN0b3IpID0+IHtcbiAgICAgIGxldCBlbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7XG5cbiAgICAgIGlmICghZWxlbWVudCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1VuYWJsZSB0byBmaW5kIGVsZW1lbnQgYnkgc2VsZWN0b3I6ICcgKyBzZWxlY3RvcilcbiAgICAgIH1cblxuICAgICAgbGV0IGV2ZW50ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0hUTUxFdmVudHMnKTtcbiAgICAgIChlbGVtZW50IGFzIEhUTUxJbnB1dEVsZW1lbnQpLmNoZWNrZWQgPSB0cnVlO1xuICAgICAgZXZlbnQuaW5pdEV2ZW50KCdjaGFuZ2UnLCB0cnVlLCB0cnVlKTtcbiAgICAgIGVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XG4gICAgfSwgc2VsZWN0b3IpO1xuICB9XG5cbiAgXG4gIGFzeW5jIHVuY2hlY2soc2VsZWN0b3I6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAgIHRoaXMuZXZhbHVhdGVfbm93KChzZWxlY3RvcikgPT4ge1xuICAgICAgbGV0IGVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcbiAgICAgIGlmICghZWxlbWVudCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1VuYWJsZSB0byBmaW5kIGVsZW1lbnQgYnkgc2VsZWN0b3I6ICcgKyBzZWxlY3RvcilcbiAgICAgIH1cbiAgICAgIGxldCBldmVudCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdIVE1MRXZlbnRzJyk7XG4gICAgICAoZWxlbWVudCBhcyBIVE1MSW5wdXRFbGVtZW50KS5jaGVja2VkID0gZmFsc2U7XG4gICAgICBldmVudC5pbml0RXZlbnQoJ2NoYW5nZScsIHRydWUsIHRydWUpO1xuICAgICAgZWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcbiAgICB9LCBzZWxlY3Rvcik7XG4gIH1cblxuXG4gIGFzeW5jIHNlbGVjdChzZWxlY3Rvcjogc3RyaW5nLCBvcHRpb24/OiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICB0aGlzLmV2YWx1YXRlX25vdygoc2VsZWN0b3IpID0+IHtcbiAgICAgIGxldCBlbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7XG4gICAgICBpZiAoIWVsZW1lbnQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmFibGUgdG8gZmluZCBlbGVtZW50IGJ5IHNlbGVjdG9yOiAnICsgc2VsZWN0b3IpXG4gICAgICB9XG4gICAgICBsZXQgZXZlbnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnSFRNTEV2ZW50cycpO1xuICAgICAgKGVsZW1lbnQgYXMgSFRNTElucHV0RWxlbWVudCkudmFsdWUgPSBvcHRpb24gPyBvcHRpb24gOiAnJztcbiAgICAgIGV2ZW50LmluaXRFdmVudCgnY2hhbmdlJywgdHJ1ZSwgdHJ1ZSk7XG4gICAgICBlbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuICAgIH0sIHNlbGVjdG9yKTtcbiAgfVxuXG4gIGFzeW5jIHNjcm9sbFRvKHRvcDogbnVtYmVyLCBsZWZ0OiBudW1iZXIpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBhd2FpdCB0aGlzLmV2YWx1YXRlX25vdygodG9wLCBsZWZ0KSA9PiB7XG4gICAgICB3aW5kb3cuc2Nyb2xsVG8oeyB0b3AsIGxlZnQgfSk7XG4gICAgfSwgdG9wLCBsZWZ0KTtcbiAgfVxuXG4gIGFzeW5jIGh0bWwoKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICByZXR1cm4gdGhpcy5ldmFsdWF0ZV9ub3coKCkgPT4ge1xuICAgICAgcmV0dXJuIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5vdXRlckhUTUxcbiAgICB9KTtcbiAgfVxuXG4gIGFzeW5jIHZpZXdwb3J0KHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgc3dpdGNoKHRoaXMuYnVzVHlwZSl7XG4gICAgICBjYXNlIEVsZWN0cm9saXplclR5cGUud2VidmlldzpcbiAgICAgICAgcmV0dXJuO1xuICAgICAgY2FzZSBFbGVjdHJvbGl6ZXJUeXBlLmJyb3dzZXJWaWV3OlxuICAgICAgICBsZXQgYnZidXg6IEJyb3dzZXJWaWV3ID0gdGhpcy5idXMgYXMgQnJvd3NlclZpZXc7XG4gICAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgICBsZXQgYm91bmRzID0gYnZidXguZ2V0Qm91bmRzKCkgYXMgRWxlY3Ryb24uUmVjdGFuZ2xlO1xuICAgICAgICBidmJ1eC5zZXRCb3VuZHMoe1xuICAgICAgICAgIC4uLmJvdW5kcyxcbiAgICAgICAgICB3aWR0aCxcbiAgICAgICAgICBoZWlnaHRcbiAgICAgICAgfSlcbiAgICAgICAgcmV0dXJuO1xuICAgICAgY2FzZSBFbGVjdHJvbGl6ZXJUeXBlLmJyb3dzZXJXaW5kb3c6XG4gICAgICAgICh0aGlzLmJ1cyBhcyAoQnJvd3NlcldpbmRvdykpLnNldFNpemUod2lkdGgsIGhlaWdodCk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gIH1cblxuICBhc3luYyBpbmplY3QodHlwZTogJ2pzJyB8ICdjc3MnLCBmaWxlOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBsZXQgY29udGVudHMgPSBhd2FpdCBwcm9taXNlcy5yZWFkRmlsZShmaWxlLCB7IGVuY29kaW5nOiAndXRmLTgnIH0pIGFzIHN0cmluZztcbiAgICBzd2l0Y2godHlwZSl7XG4gICAgICBjYXNlICdqcyc6XG4gICAgICAgIGF3YWl0IHRoaXMuX2luamVjdChjb250ZW50cyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnY3NzJzpcbiAgICAgICAgdGhpcy53ZWJDb250ZW50cy5pbnNlcnRDU1MoY29udGVudHMpO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBhc3luYyBldmFsdWF0ZTxULCBLIGV4dGVuZHMgYW55W10sIFI+KGZuOiAoLi4uYXJnczogUHVzaDxLLCBUPikgPT4gUiwgLi4uYXJnczogSyk6IFByb21pc2U8Uj4ge1xuICAgIHJldHVybiB0aGlzLmV2YWx1YXRlX25vdyhmbiwgLi4uYXJncyk7XG4gIH1cbiBcblxuICBhc3luYyB3YWl0KG1zOiBudW1iZXIpOiBQcm9taXNlPHZvaWQ+XG4gIGFzeW5jIHdhaXQoc2VsZWN0b3I6IHN0cmluZyk6IFByb21pc2U8dm9pZD4gXG4gIGFzeW5jIHdhaXQoZm46ICgpID0+IGJvb2xlYW4sIC4uLmFyZ3M6IGFueVtdKTogUHJvbWlzZTx2b2lkPlxuICBhc3luYyB3YWl0KCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGxldCBibG9jazogKCkgPT4gUHJvbWlzZTx2b2lkPjtcblxuICAgIGxldCBlcnJvclRpbWVvdXQgPSBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgICBhd2FpdCBkZWxheSgzMDAwMCk7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ3RpbWVkIG91dCcpO1xuICAgIH07XG5cbiAgICBzd2l0Y2godHlwZW9mIGFyZ3VtZW50c1swXSl7XG4gICAgICBjYXNlIFwibnVtYmVyXCI6XG4gICAgICAgIGJsb2NrID0gZGVsYXkuYmluZChudWxsLCBhcmd1bWVudHNbMF0pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJzdHJpbmdcIjpcbiAgICAgICAgYmxvY2sgPSBhc3luYyAoKSA9PiBQcm9taXNlLnJhY2UoW1xuICAgICAgICAgIHJldHJ5KHsgdGltZXM6IEluZmluaXR5LCBpbnRlcnZhbDogMTAwIH0sIHRoaXMuZXhpc3RzLmJpbmQodGhpcywgYXJndW1lbnRzWzBdKSksXG4gICAgICAgICAgYXdhaXQgZXJyb3JUaW1lb3V0KCksXG4gICAgICAgIF0pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJmdW5jdGlvblwiOlxuICAgICAgICBibG9jayA9IGFzeW5jICgpID0+IFByb21pc2UucmFjZShbXG4gICAgICAgICAgLy9AdHMtaWdub3JlXG4gICAgICAgICAgcmV0cnkoeyB0aW1lczogSW5maW5pdHksIGludGVydmFsOiAxMDAgfSwgdGhpcy5ldmFsdWF0ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpKSxcbiAgICAgICAgICBhd2FpdCBlcnJvclRpbWVvdXQoKSxcbiAgICAgICAgXSk7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBibG9jayA9IGFzeW5jICgpID0+IHt9O1xuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICBhd2FpdCBibG9jaygpO1xuICB9XG5cbiAgXG4gIGFzeW5jIGhlYWRlcihoZWFkZXI6IHN0cmluZywgdmFsdWU6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuXG4gIH1cbiAgXG59Il19