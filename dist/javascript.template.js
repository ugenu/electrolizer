"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.inject = exports.execute = void 0;

var _handlebars = require("handlebars");

var templateExecute = "\n  new Promise(async (resolve, reject) => {\n    let fn = ({{{fn}}});\n    let args = [];\n    let response = undefined;\n\n    {{#args}}args.push({{{argument}}});{{/args}}\n\n    try {\n      response = await fn.apply(null, args);\n    } catch (error) {\n      return reject(error);\n    }\n    \n    return resolve(response);\n  }); \n";
var templateInject = "\nnew Promise(async (resolve, reject) => {\n  let fn = ( () => {\n    {{{fn}}}\n  })();\n\n  let response = undefined;\n  try {\n    response = await fn.apply(null);\n  } catch (error) {\n    return reject(error);\n  }\n  \n  return resolve(response);\n});\n";
var execute = (0, _handlebars.compile)(templateExecute);
exports.execute = execute;
var inject = (0, _handlebars.compile)(templateInject);
exports.inject = inject;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9qYXZhc2NyaXB0LnRlbXBsYXRlLnRzIl0sIm5hbWVzIjpbInRlbXBsYXRlRXhlY3V0ZSIsInRlbXBsYXRlSW5qZWN0IiwiZXhlY3V0ZSIsImluamVjdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUVBLElBQU1BLGVBQWUsdVZBQXJCO0FBa0JBLElBQU1DLGNBQWMsdVFBQXBCO0FBaUJPLElBQU1DLE9BQU8sR0FBRyx5QkFBUUYsZUFBUixDQUFoQjs7QUFDQSxJQUFNRyxNQUFNLEdBQUcseUJBQVFGLGNBQVIsQ0FBZiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNvbXBpbGUgfSBmcm9tICdoYW5kbGViYXJzJztcblxuY29uc3QgdGVtcGxhdGVFeGVjdXRlICA9IGBcbiAgbmV3IFByb21pc2UoYXN5bmMgKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGxldCBmbiA9ICh7e3tmbn19fSk7XG4gICAgbGV0IGFyZ3MgPSBbXTtcbiAgICBsZXQgcmVzcG9uc2UgPSB1bmRlZmluZWQ7XG5cbiAgICB7eyNhcmdzfX1hcmdzLnB1c2goe3t7YXJndW1lbnR9fX0pO3t7L2FyZ3N9fVxuXG4gICAgdHJ5IHtcbiAgICAgIHJlc3BvbnNlID0gYXdhaXQgZm4uYXBwbHkobnVsbCwgYXJncyk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHJldHVybiByZWplY3QoZXJyb3IpO1xuICAgIH1cbiAgICBcbiAgICByZXR1cm4gcmVzb2x2ZShyZXNwb25zZSk7XG4gIH0pOyBcbmA7XG5cbmNvbnN0IHRlbXBsYXRlSW5qZWN0ID0gYFxubmV3IFByb21pc2UoYXN5bmMgKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICBsZXQgZm4gPSAoICgpID0+IHtcbiAgICB7e3tmbn19fVxuICB9KSgpO1xuXG4gIGxldCByZXNwb25zZSA9IHVuZGVmaW5lZDtcbiAgdHJ5IHtcbiAgICByZXNwb25zZSA9IGF3YWl0IGZuLmFwcGx5KG51bGwpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHJldHVybiByZWplY3QoZXJyb3IpO1xuICB9XG4gIFxuICByZXR1cm4gcmVzb2x2ZShyZXNwb25zZSk7XG59KTtcbmA7XG5cbmV4cG9ydCBjb25zdCBleGVjdXRlID0gY29tcGlsZSh0ZW1wbGF0ZUV4ZWN1dGUpO1xuZXhwb3J0IGNvbnN0IGluamVjdCA9IGNvbXBpbGUodGVtcGxhdGVJbmplY3QpOyJdfQ==