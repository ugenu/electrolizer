"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.delay = delay;

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

function delay(_x) {
  return _delay.apply(this, arguments);
}

function _delay() {
  _delay = (0, _asyncToGenerator2.default)(function* (ms) {
    return new Promise(resolve => {
      setTimeout(resolve, ms);
    });
  });
  return _delay.apply(this, arguments);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9kZWxheS5mdW5jdGlvbi50cyJdLCJuYW1lcyI6WyJkZWxheSIsIm1zIiwiUHJvbWlzZSIsInJlc29sdmUiLCJzZXRUaW1lb3V0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztTQUFzQkEsSzs7Ozs7MkNBQWYsV0FBcUJDLEVBQXJCLEVBQWdEO0FBQ3JELFdBQU8sSUFBSUMsT0FBSixDQUFhQyxPQUFELElBQWE7QUFDOUJDLE1BQUFBLFVBQVUsQ0FBQ0QsT0FBRCxFQUFVRixFQUFWLENBQVY7QUFDRCxLQUZNLENBQVA7QUFHRCxHIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGRlbGF5KG1zOiBudW1iZXIpOiBQcm9taXNlPHZvaWQ+IHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgc2V0VGltZW91dChyZXNvbHZlLCBtcyk7XG4gIH0pO1xufSJdfQ==