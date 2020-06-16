"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.evals = evals;

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

/**
 * from https://stackoverflow.com/a/58547161
 * THANK YOU
 */
function evals(_x) {
  return _evals.apply(this, arguments);
}

function _evals() {
  _evals = (0, _asyncToGenerator2.default)(function* (fn) {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    return {};
  });
  return _evals.apply(this, arguments);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9ldmFsdWF0ZS1mdW5jdGlvbi50eXBlLnRzIl0sIm5hbWVzIjpbImV2YWxzIiwiZm4iLCJhcmdzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBOzs7O1NBYXNCQSxLOzs7OzsyQ0FBZixXQUE0Q0MsRUFBNUMsRUFBb0c7QUFBQSxzQ0FBckJDLElBQXFCO0FBQXJCQSxNQUFBQSxJQUFxQjtBQUFBOztBQUN6RyxXQUFPLEVBQVA7QUFDRCxHIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBmcm9tIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS81ODU0NzE2MVxuICogVEhBTksgWU9VXG4gKi9cblxudHlwZSBDb25zPEgsIFQgZXh0ZW5kcyByZWFkb25seSBhbnlbXT4gPVxuICAgICgoaGVhZDogSCwgLi4udGFpbDogVCkgPT4gdm9pZCkgZXh0ZW5kcyAoKC4uLmNvbnM6IGluZmVyIFIpID0+IHZvaWQpID8gUiA6IG5ldmVyO1xuXG5leHBvcnQgdHlwZSBQdXNoPFQgZXh0ZW5kcyByZWFkb25seSBhbnlbXSwgVj5cbiAgICA9IFQgZXh0ZW5kcyBhbnkgPyBDb25zPHZvaWQsIFQ+IGV4dGVuZHMgaW5mZXIgVSA/XG4gICAgeyBbSyBpbiBrZXlvZiBVXTogSyBleHRlbmRzIGtleW9mIFQgPyBUW0tdIDogViB9IDogbmV2ZXIgOiBuZXZlcjtcblxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZXZhbHM8VCwgSyBleHRlbmRzIGFueVtdLCBSPihmbjogKC4uLmFyZ3M6IFB1c2g8SywgVD4pID0+IFIsIC4uLmFyZ3M6IEspOiBQcm9taXNlPFI+IHtcbiAgcmV0dXJuIHt9IGFzIFI7XG59XG4iXX0=