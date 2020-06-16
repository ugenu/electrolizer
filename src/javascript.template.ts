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

const templateInject = `
new Promise(async (resolve, reject) => {
  let fn = ( () => {
    {{{fn}}}
  })();

  let response = undefined;
  try {
    response = await fn.apply(null);
  } catch (error) {
    return reject(error);
  }
  
  return resolve(response);
});
`;

export const execute = compile(templateExecute);
export const inject = compile(templateInject);