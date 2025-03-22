globalThis.process ??= {}; globalThis.process.env ??= {};
import './chunks/astro-designed-error-pages_D_wLCTY8.mjs';
import './chunks/astro/server_Co4SjOCG.mjs';
import { s as sequence } from './chunks/index_BWSqsUcd.mjs';

const onRequest$1 = (context, next) => {
  if (context.isPrerendered) {
    context.locals.runtime ??= {
      env: process.env
    };
  }
  return next();
};

const onRequest = sequence(
	onRequest$1,
	
	
);

export { onRequest };
