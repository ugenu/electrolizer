"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Cookies = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

class Cookies {
  constructor(webContents) {
    this.webContents = webContents;
  }

  get(name) {
    var _this = this;

    return (0, _asyncToGenerator2.default)(function* () {
      var filter = {};

      if (typeof name === "string") {
        filter.name = name;
      }

      filter.url = _this.webContents.getURL();
      return yield _this.webContents.session.cookies.get(filter);
    })();
  }

  set() {
    var _arguments = arguments,
        _this2 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      var details = {
        url: _this2.webContents.getURL()
      };

      if (typeof _arguments[0] === "string") {
        details.name = _arguments[0];
        details.value = _arguments[1] ? _arguments[1] : undefined;
      } else {
        details = _objectSpread({}, _arguments[0]);
      }

      yield _this2.webContents.session.cookies.set(details);
    })();
  }

  clear(name) {
    var _this3 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      var details = {
        url: _this3.webContents.getURL(),
        name
      };
      var cookies = yield _this3.get(details);

      for (var _cookie of cookies) {
        yield _this3.webContents.session.cookies.remove(details.url, _cookie.name);
      }
    })();
  }

  clearAll() {
    var _this4 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      _this4.webContents.session.clearStorageData({
        storages: ['cookies']
      });
    })();
  }

}

exports.Cookies = Cookies;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9kcml2ZXJzL2Nvb2tpZXMuY2xhc3MudHMiXSwibmFtZXMiOlsiQ29va2llcyIsImNvbnN0cnVjdG9yIiwid2ViQ29udGVudHMiLCJnZXQiLCJuYW1lIiwiZmlsdGVyIiwidXJsIiwiZ2V0VVJMIiwic2Vzc2lvbiIsImNvb2tpZXMiLCJzZXQiLCJkZXRhaWxzIiwiYXJndW1lbnRzIiwidmFsdWUiLCJ1bmRlZmluZWQiLCJjbGVhciIsImNvb2tpZSIsInJlbW92ZSIsImNsZWFyQWxsIiwiY2xlYXJTdG9yYWdlRGF0YSIsInN0b3JhZ2VzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUdPLE1BQU1BLE9BQU4sQ0FBaUQ7QUFDdERDLEVBQUFBLFdBQVcsQ0FBV0MsV0FBWCxFQUFvQztBQUFBLFNBQXpCQSxXQUF5QixHQUF6QkEsV0FBeUI7QUFBRTs7QUFFM0NDLEVBQUFBLEdBQU4sQ0FBVUMsSUFBVixFQUFzRTtBQUFBOztBQUFBO0FBQ3BFLFVBQUlDLE1BQXVCLEdBQUcsRUFBOUI7O0FBRUEsVUFBRyxPQUFPRCxJQUFQLEtBQWdCLFFBQW5CLEVBQTRCO0FBQzFCQyxRQUFBQSxNQUFNLENBQUNELElBQVAsR0FBY0EsSUFBZDtBQUNEOztBQUVEQyxNQUFBQSxNQUFNLENBQUNDLEdBQVAsR0FBYSxLQUFJLENBQUNKLFdBQUwsQ0FBaUJLLE1BQWpCLEVBQWI7QUFFQSxtQkFBYSxLQUFJLENBQUNMLFdBQUwsQ0FBaUJNLE9BQWpCLENBQXlCQyxPQUF6QixDQUFpQ04sR0FBakMsQ0FBcUNFLE1BQXJDLENBQWI7QUFUb0U7QUFVckU7O0FBSUtLLEVBQUFBLEdBQU4sR0FBMkI7QUFBQTtBQUFBOztBQUFBO0FBRXpCLFVBQUlDLE9BQXlCLEdBQUc7QUFDOUJMLFFBQUFBLEdBQUcsRUFBRSxNQUFJLENBQUNKLFdBQUwsQ0FBaUJLLE1BQWpCO0FBRHlCLE9BQWhDOztBQUlBLFVBQUcsT0FBT0ssVUFBUyxDQUFDLENBQUQsQ0FBaEIsS0FBd0IsUUFBM0IsRUFBb0M7QUFDbENELFFBQUFBLE9BQU8sQ0FBQ1AsSUFBUixHQUFlUSxVQUFTLENBQUMsQ0FBRCxDQUF4QjtBQUNBRCxRQUFBQSxPQUFPLENBQUNFLEtBQVIsR0FBZ0JELFVBQVMsQ0FBQyxDQUFELENBQVQsR0FBZUEsVUFBUyxDQUFDLENBQUQsQ0FBeEIsR0FBOEJFLFNBQTlDO0FBQ0QsT0FIRCxNQUdPO0FBQ0xILFFBQUFBLE9BQU8scUJBQ0ZDLFVBQVMsQ0FBQyxDQUFELENBRFAsQ0FBUDtBQUdEOztBQUVELFlBQU0sTUFBSSxDQUFDVixXQUFMLENBQWlCTSxPQUFqQixDQUF5QkMsT0FBekIsQ0FBaUNDLEdBQWpDLENBQXFDQyxPQUFyQyxDQUFOO0FBZnlCO0FBZ0IxQjs7QUFFS0ksRUFBQUEsS0FBTixDQUFZWCxJQUFaLEVBQTBDO0FBQUE7O0FBQUE7QUFDeEMsVUFBSU8sT0FBeUIsR0FBRztBQUM5QkwsUUFBQUEsR0FBRyxFQUFFLE1BQUksQ0FBQ0osV0FBTCxDQUFpQkssTUFBakIsRUFEeUI7QUFFOUJILFFBQUFBO0FBRjhCLE9BQWhDO0FBS0EsVUFBSUssT0FBTyxTQUFTLE1BQUksQ0FBQ04sR0FBTCxDQUFTUSxPQUFULENBQXBCOztBQUVBLFdBQUksSUFBSUssT0FBUixJQUFrQlAsT0FBbEIsRUFBMkI7QUFDekIsY0FBTSxNQUFJLENBQUNQLFdBQUwsQ0FBaUJNLE9BQWpCLENBQXlCQyxPQUF6QixDQUFpQ1EsTUFBakMsQ0FBd0NOLE9BQU8sQ0FBQ0wsR0FBaEQsRUFBcURVLE9BQU0sQ0FBQ1osSUFBNUQsQ0FBTjtBQUNEO0FBVnVDO0FBV3pDOztBQUVLYyxFQUFBQSxRQUFOLEdBQWdDO0FBQUE7O0FBQUE7QUFDOUIsTUFBQSxNQUFJLENBQUNoQixXQUFMLENBQWlCTSxPQUFqQixDQUF5QlcsZ0JBQXpCLENBQTBDO0FBQ3hDQyxRQUFBQSxRQUFRLEVBQUUsQ0FBQyxTQUFEO0FBRDhCLE9BQTFDO0FBRDhCO0FBSS9COztBQXBEcUQiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBXZWJDb250ZW50cyB9IGZyb20gXCJlbGVjdHJvblwiO1xuaW1wb3J0IHsgQ29va2llcyBhcyBJQ29va2llcyB9IGZyb20gJy4vY29va2llcy5pbnRlcmZhY2UnO1xuXG5leHBvcnQgY2xhc3MgQ29va2llcyBpbXBsZW1lbnRzIElDb29raWVzPFByb21pc2U8dm9pZD4+IHtcbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIHdlYkNvbnRlbnRzOiBXZWJDb250ZW50cyl7fVxuXG4gIGFzeW5jIGdldChuYW1lOiBzdHJpbmcgfCBFbGVjdHJvbi5GaWx0ZXIpOiBQcm9taXNlPEVsZWN0cm9uLkNvb2tpZVtdPiB7XG4gICAgbGV0IGZpbHRlcjogRWxlY3Ryb24uRmlsdGVyID0ge307XG5cbiAgICBpZih0eXBlb2YgbmFtZSA9PT0gXCJzdHJpbmdcIil7XG4gICAgICBmaWx0ZXIubmFtZSA9IG5hbWU7XG4gICAgfVxuXG4gICAgZmlsdGVyLnVybCA9IHRoaXMud2ViQ29udGVudHMuZ2V0VVJMKCk7XG5cbiAgICByZXR1cm4gYXdhaXQgdGhpcy53ZWJDb250ZW50cy5zZXNzaW9uLmNvb2tpZXMuZ2V0KGZpbHRlcik7XG4gIH1cblxuICBhc3luYyBzZXQobmFtZTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nKTogUHJvbWlzZTx2b2lkPlxuICBhc3luYyBzZXQoY29va2llOiBFbGVjdHJvbi5Db29raWUpOiBQcm9taXNlPHZvaWQ+XG4gIGFzeW5jIHNldCgpOiBQcm9taXNlPHZvaWQ+IHtcblxuICAgIGxldCBkZXRhaWxzOiBFbGVjdHJvbi5EZXRhaWxzID0ge1xuICAgICAgdXJsOiB0aGlzLndlYkNvbnRlbnRzLmdldFVSTCgpXG4gICAgfTtcblxuICAgIGlmKHR5cGVvZiBhcmd1bWVudHNbMF0gPT09IFwic3RyaW5nXCIpe1xuICAgICAgZGV0YWlscy5uYW1lID0gYXJndW1lbnRzWzBdO1xuICAgICAgZGV0YWlscy52YWx1ZSA9IGFyZ3VtZW50c1sxXSA/IGFyZ3VtZW50c1sxXSA6IHVuZGVmaW5lZDtcbiAgICB9IGVsc2Uge1xuICAgICAgZGV0YWlscyA9IHtcbiAgICAgICAgLi4uYXJndW1lbnRzWzBdXG4gICAgICB9XG4gICAgfVxuXG4gICAgYXdhaXQgdGhpcy53ZWJDb250ZW50cy5zZXNzaW9uLmNvb2tpZXMuc2V0KGRldGFpbHMpO1xuICB9XG5cbiAgYXN5bmMgY2xlYXIobmFtZT86IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAgIGxldCBkZXRhaWxzOiBFbGVjdHJvbi5EZXRhaWxzID0ge1xuICAgICAgdXJsOiB0aGlzLndlYkNvbnRlbnRzLmdldFVSTCgpLFxuICAgICAgbmFtZVxuICAgIH07XG5cbiAgICBsZXQgY29va2llcyA9IGF3YWl0IHRoaXMuZ2V0KGRldGFpbHMpO1xuXG4gICAgZm9yKGxldCBjb29raWUgb2YgY29va2llcykge1xuICAgICAgYXdhaXQgdGhpcy53ZWJDb250ZW50cy5zZXNzaW9uLmNvb2tpZXMucmVtb3ZlKGRldGFpbHMudXJsLCBjb29raWUubmFtZSk7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgY2xlYXJBbGwoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgdGhpcy53ZWJDb250ZW50cy5zZXNzaW9uLmNsZWFyU3RvcmFnZURhdGEoe1xuICAgICAgc3RvcmFnZXM6IFsnY29va2llcyddXG4gICAgfSk7XG4gIH1cbn0iXX0=