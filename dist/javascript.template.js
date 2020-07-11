"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.inject = exports.execute = void 0;

var _handlebars = require("handlebars");

var templateExecute = "\n  new Promise(async (resolve, reject) => {\n    let fn = ({{{fn}}});\n    let args = [];\n    let response = undefined;\n\n    {{#args}}args.push({{{argument}}});{{/args}}\n\n    try {\n      response = await fn.apply(null, args);\n    } catch (error) {\n      return reject(error);\n    }\n    \n    return resolve(response);\n  }); \n";
/**
 * TODO: [EL-2] fix inject and make tests
 */

var templateInject = "\n(function javascript () {\n  if (typeof module === 'object') {window.module = module; module = undefined;}\n  var response = (function () { {{{fn}}} \n})()\n  if (window.module) module = window.module;\n})();\n";
var execute = (0, _handlebars.compile)(templateExecute);
exports.execute = execute;
var inject = (0, _handlebars.compile)(templateInject);
exports.inject = inject;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9qYXZhc2NyaXB0LnRlbXBsYXRlLnRzIl0sIm5hbWVzIjpbInRlbXBsYXRlRXhlY3V0ZSIsInRlbXBsYXRlSW5qZWN0IiwiZXhlY3V0ZSIsImluamVjdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUVBLElBQU1BLGVBQWUsdVZBQXJCO0FBa0JBOzs7O0FBR0EsSUFBTUMsY0FBYyx5TkFBcEI7QUFRTyxJQUFNQyxPQUFPLEdBQUcseUJBQVFGLGVBQVIsQ0FBaEI7O0FBQ0EsSUFBTUcsTUFBTSxHQUFHLHlCQUFRRixjQUFSLENBQWYiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjb21waWxlIH0gZnJvbSAnaGFuZGxlYmFycyc7XG5cbmNvbnN0IHRlbXBsYXRlRXhlY3V0ZSAgPSBgXG4gIG5ldyBQcm9taXNlKGFzeW5jIChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBsZXQgZm4gPSAoe3t7Zm59fX0pO1xuICAgIGxldCBhcmdzID0gW107XG4gICAgbGV0IHJlc3BvbnNlID0gdW5kZWZpbmVkO1xuXG4gICAge3sjYXJnc319YXJncy5wdXNoKHt7e2FyZ3VtZW50fX19KTt7ey9hcmdzfX1cblxuICAgIHRyeSB7XG4gICAgICByZXNwb25zZSA9IGF3YWl0IGZuLmFwcGx5KG51bGwsIGFyZ3MpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICByZXR1cm4gcmVqZWN0KGVycm9yKTtcbiAgICB9XG4gICAgXG4gICAgcmV0dXJuIHJlc29sdmUocmVzcG9uc2UpO1xuICB9KTsgXG5gO1xuXG4vKipcbiAqIFRPRE86IFtFTC0yXSBmaXggaW5qZWN0IGFuZCBtYWtlIHRlc3RzXG4gKi9cbmNvbnN0IHRlbXBsYXRlSW5qZWN0ID0gYFxuKGZ1bmN0aW9uIGphdmFzY3JpcHQgKCkge1xuICBpZiAodHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpIHt3aW5kb3cubW9kdWxlID0gbW9kdWxlOyBtb2R1bGUgPSB1bmRlZmluZWQ7fVxuICB2YXIgcmVzcG9uc2UgPSAoZnVuY3Rpb24gKCkgeyB7e3tmbn19fSBcXG59KSgpXG4gIGlmICh3aW5kb3cubW9kdWxlKSBtb2R1bGUgPSB3aW5kb3cubW9kdWxlO1xufSkoKTtcbmA7XG5cbmV4cG9ydCBjb25zdCBleGVjdXRlID0gY29tcGlsZSh0ZW1wbGF0ZUV4ZWN1dGUpO1xuZXhwb3J0IGNvbnN0IGluamVjdCA9IGNvbXBpbGUodGVtcGxhdGVJbmplY3QpOyJdfQ==