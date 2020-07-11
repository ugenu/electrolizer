import { compile } from 'handlebars';

const templateExecute  = `
  new Promise(async (resolve, reject) => {
    let fn = ({{{fn}}});
    let args = [];
    let response = undefined;

    {{#args}}args.push({{{argument}}});{{/args}}

    try {
      response = await fn.apply(null, args);
    } catch (error) {
      return reject(error);
    }
    
    return resolve(response);
  }); 
`;

/**
 * TODO: [EL-2] fix inject and make tests
 */
const templateInject = `
(function javascript () {
  if (typeof module === 'object') {window.module = module; module = undefined;}
  var response = (function () { {{{fn}}} \n})()
  if (window.module) module = window.module;
})();
`;

export const execute = compile(templateExecute);
export const inject = compile(templateInject);