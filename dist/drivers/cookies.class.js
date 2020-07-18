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

  get() {
    var _arguments = arguments,
        _this = this;

    return (0, _asyncToGenerator2.default)(function* () {
      var arg = _arguments[0];
      var filter = {};

      if (typeof arg === "string") {
        filter.name = arg;
      }

      filter.url = _this.webContents.getURL();

      if (typeof arg === "object") {
        filter = arg;
      }

      return yield _this.webContents.session.cookies.get(filter);
    })();
  }

  set() {
    var _arguments2 = arguments,
        _this2 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      var details = {
        url: _this2.webContents.getURL()
      };

      if (typeof _arguments2[0] === "string") {
        details.name = _arguments2[0];
        details.value = _arguments2[1] ? _arguments2[1] : undefined;
      } else {
        details = _objectSpread({}, _arguments2[0]);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9kcml2ZXJzL2Nvb2tpZXMuY2xhc3MudHMiXSwibmFtZXMiOlsiQ29va2llcyIsImNvbnN0cnVjdG9yIiwid2ViQ29udGVudHMiLCJnZXQiLCJhcmciLCJhcmd1bWVudHMiLCJmaWx0ZXIiLCJuYW1lIiwidXJsIiwiZ2V0VVJMIiwic2Vzc2lvbiIsImNvb2tpZXMiLCJzZXQiLCJkZXRhaWxzIiwidmFsdWUiLCJ1bmRlZmluZWQiLCJjbGVhciIsImNvb2tpZSIsInJlbW92ZSIsImNsZWFyQWxsIiwiY2xlYXJTdG9yYWdlRGF0YSIsInN0b3JhZ2VzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUdPLE1BQU1BLE9BQU4sQ0FBaUQ7QUFDdERDLEVBQUFBLFdBQVcsQ0FBV0MsV0FBWCxFQUFzRDtBQUFBLFNBQTNDQSxXQUEyQyxHQUEzQ0EsV0FBMkM7QUFBRTs7QUFLN0RDLEVBQUFBLEdBQU4sR0FBd0M7QUFBQTtBQUFBOztBQUFBO0FBQ3RDLFVBQUlDLEdBQUcsR0FBR0MsVUFBUyxDQUFDLENBQUQsQ0FBbkI7QUFFQSxVQUFJQyxNQUF1QixHQUFHLEVBQTlCOztBQUVBLFVBQUcsT0FBT0YsR0FBUCxLQUFlLFFBQWxCLEVBQTJCO0FBQ3pCRSxRQUFBQSxNQUFNLENBQUNDLElBQVAsR0FBY0gsR0FBZDtBQUNEOztBQUVERSxNQUFBQSxNQUFNLENBQUNFLEdBQVAsR0FBYSxLQUFJLENBQUNOLFdBQUwsQ0FBaUJPLE1BQWpCLEVBQWI7O0FBRUEsVUFBRyxPQUFPTCxHQUFQLEtBQWUsUUFBbEIsRUFBNEI7QUFDMUJFLFFBQUFBLE1BQU0sR0FBR0YsR0FBVDtBQUNEOztBQUVELG1CQUFhLEtBQUksQ0FBQ0YsV0FBTCxDQUFpQlEsT0FBakIsQ0FBeUJDLE9BQXpCLENBQWlDUixHQUFqQyxDQUFxQ0csTUFBckMsQ0FBYjtBQWZzQztBQWdCdkM7O0FBSUtNLEVBQUFBLEdBQU4sR0FBMkI7QUFBQTtBQUFBOztBQUFBO0FBRXpCLFVBQUlDLE9BQXlCLEdBQUc7QUFDOUJMLFFBQUFBLEdBQUcsRUFBRSxNQUFJLENBQUNOLFdBQUwsQ0FBaUJPLE1BQWpCO0FBRHlCLE9BQWhDOztBQUlBLFVBQUcsT0FBT0osV0FBUyxDQUFDLENBQUQsQ0FBaEIsS0FBd0IsUUFBM0IsRUFBb0M7QUFDbENRLFFBQUFBLE9BQU8sQ0FBQ04sSUFBUixHQUFlRixXQUFTLENBQUMsQ0FBRCxDQUF4QjtBQUNBUSxRQUFBQSxPQUFPLENBQUNDLEtBQVIsR0FBZ0JULFdBQVMsQ0FBQyxDQUFELENBQVQsR0FBZUEsV0FBUyxDQUFDLENBQUQsQ0FBeEIsR0FBOEJVLFNBQTlDO0FBQ0QsT0FIRCxNQUdPO0FBQ0xGLFFBQUFBLE9BQU8scUJBQ0ZSLFdBQVMsQ0FBQyxDQUFELENBRFAsQ0FBUDtBQUdEOztBQUVELFlBQU0sTUFBSSxDQUFDSCxXQUFMLENBQWlCUSxPQUFqQixDQUF5QkMsT0FBekIsQ0FBaUNDLEdBQWpDLENBQXFDQyxPQUFyQyxDQUFOO0FBZnlCO0FBZ0IxQjs7QUFFS0csRUFBQUEsS0FBTixDQUFZVCxJQUFaLEVBQTBDO0FBQUE7O0FBQUE7QUFDeEMsVUFBSU0sT0FBeUIsR0FBRztBQUM5QkwsUUFBQUEsR0FBRyxFQUFFLE1BQUksQ0FBQ04sV0FBTCxDQUFpQk8sTUFBakIsRUFEeUI7QUFFOUJGLFFBQUFBO0FBRjhCLE9BQWhDO0FBS0EsVUFBSUksT0FBTyxTQUFTLE1BQUksQ0FBQ1IsR0FBTCxDQUFTVSxPQUFULENBQXBCOztBQUVBLFdBQUksSUFBSUksT0FBUixJQUFrQk4sT0FBbEIsRUFBMkI7QUFDekIsY0FBTSxNQUFJLENBQUNULFdBQUwsQ0FBaUJRLE9BQWpCLENBQXlCQyxPQUF6QixDQUFpQ08sTUFBakMsQ0FBd0NMLE9BQU8sQ0FBQ0wsR0FBaEQsRUFBcURTLE9BQU0sQ0FBQ1YsSUFBNUQsQ0FBTjtBQUNEO0FBVnVDO0FBV3pDOztBQUVLWSxFQUFBQSxRQUFOLEdBQWdDO0FBQUE7O0FBQUE7QUFDOUIsTUFBQSxNQUFJLENBQUNqQixXQUFMLENBQWlCUSxPQUFqQixDQUF5QlUsZ0JBQXpCLENBQTBDO0FBQ3hDQyxRQUFBQSxRQUFRLEVBQUUsQ0FBQyxTQUFEO0FBRDhCLE9BQTFDO0FBRDhCO0FBSS9COztBQTdEcUQiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFbGVjdHJvblNoaW1zIH0gZnJvbSAnLi4vc2hpbXMvZWxlY3Ryb24tc2hpbXMnO1xuaW1wb3J0IHsgQ29va2llcyBhcyBJQ29va2llcyB9IGZyb20gJy4vY29va2llcy5pbnRlcmZhY2UnO1xuXG5leHBvcnQgY2xhc3MgQ29va2llcyBpbXBsZW1lbnRzIElDb29raWVzPFByb21pc2U8dm9pZD4+IHtcbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIHdlYkNvbnRlbnRzOiBFbGVjdHJvblNoaW1zLldlYkNvbnRlbnRzTGlrZSl7fVxuXG4gIGFzeW5jIGdldCgpOiBQcm9taXNlPEVsZWN0cm9uLkNvb2tpZVtdPlxuICBhc3luYyBnZXQobmFtZTogc3RyaW5nKTogUHJvbWlzZTxFbGVjdHJvbi5Db29raWVbXT47XG4gIGFzeW5jIGdldChmaWx0ZXI6IEVsZWN0cm9uLkZpbHRlcik6IFByb21pc2U8RWxlY3Ryb24uQ29va2llW10+O1xuICBhc3luYyBnZXQoKTogUHJvbWlzZTxFbGVjdHJvbi5Db29raWVbXT4ge1xuICAgIGxldCBhcmcgPSBhcmd1bWVudHNbMF07XG5cbiAgICBsZXQgZmlsdGVyOiBFbGVjdHJvbi5GaWx0ZXIgPSB7fTtcblxuICAgIGlmKHR5cGVvZiBhcmcgPT09IFwic3RyaW5nXCIpe1xuICAgICAgZmlsdGVyLm5hbWUgPSBhcmc7XG4gICAgfVxuICAgIFxuICAgIGZpbHRlci51cmwgPSB0aGlzLndlYkNvbnRlbnRzLmdldFVSTCgpO1xuXG4gICAgaWYodHlwZW9mIGFyZyA9PT0gXCJvYmplY3RcIikge1xuICAgICAgZmlsdGVyID0gYXJnO1xuICAgIH1cblxuICAgIHJldHVybiBhd2FpdCB0aGlzLndlYkNvbnRlbnRzLnNlc3Npb24uY29va2llcy5nZXQoZmlsdGVyKTtcbiAgfVxuXG4gIGFzeW5jIHNldChuYW1lOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+XG4gIGFzeW5jIHNldChjb29raWU6IEVsZWN0cm9uLkNvb2tpZSk6IFByb21pc2U8dm9pZD5cbiAgYXN5bmMgc2V0KCk6IFByb21pc2U8dm9pZD4ge1xuXG4gICAgbGV0IGRldGFpbHM6IEVsZWN0cm9uLkRldGFpbHMgPSB7XG4gICAgICB1cmw6IHRoaXMud2ViQ29udGVudHMuZ2V0VVJMKClcbiAgICB9O1xuXG4gICAgaWYodHlwZW9mIGFyZ3VtZW50c1swXSA9PT0gXCJzdHJpbmdcIil7XG4gICAgICBkZXRhaWxzLm5hbWUgPSBhcmd1bWVudHNbMF07XG4gICAgICBkZXRhaWxzLnZhbHVlID0gYXJndW1lbnRzWzFdID8gYXJndW1lbnRzWzFdIDogdW5kZWZpbmVkO1xuICAgIH0gZWxzZSB7XG4gICAgICBkZXRhaWxzID0ge1xuICAgICAgICAuLi5hcmd1bWVudHNbMF1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBhd2FpdCB0aGlzLndlYkNvbnRlbnRzLnNlc3Npb24uY29va2llcy5zZXQoZGV0YWlscyk7XG4gIH1cblxuICBhc3luYyBjbGVhcihuYW1lPzogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgbGV0IGRldGFpbHM6IEVsZWN0cm9uLkRldGFpbHMgPSB7XG4gICAgICB1cmw6IHRoaXMud2ViQ29udGVudHMuZ2V0VVJMKCksXG4gICAgICBuYW1lXG4gICAgfTtcblxuICAgIGxldCBjb29raWVzID0gYXdhaXQgdGhpcy5nZXQoZGV0YWlscyk7XG5cbiAgICBmb3IobGV0IGNvb2tpZSBvZiBjb29raWVzKSB7XG4gICAgICBhd2FpdCB0aGlzLndlYkNvbnRlbnRzLnNlc3Npb24uY29va2llcy5yZW1vdmUoZGV0YWlscy51cmwsIGNvb2tpZS5uYW1lKTtcbiAgICB9XG4gIH1cblxuICBhc3luYyBjbGVhckFsbCgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICB0aGlzLndlYkNvbnRlbnRzLnNlc3Npb24uY2xlYXJTdG9yYWdlRGF0YSh7XG4gICAgICBzdG9yYWdlczogWydjb29raWVzJ11cbiAgICB9KTtcbiAgfVxufSJdfQ==