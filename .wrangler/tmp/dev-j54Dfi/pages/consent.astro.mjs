globalThis.process ??= {}; globalThis.process.env ??= {};
import { b as createComponent, r as renderComponent, d as renderTemplate } from '../chunks/astro/server_Co4SjOCG.mjs';
import { $ as $$Layout } from '../chunks/Layout_Ca_sYZF3.mjs';
export { renderers } from '../renderers.mjs';

const $$Consent = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {}, { "default": ($$result2) => renderTemplate` <link rel="preconnect" href="https://fonts.googleapis.com"> <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin> <link href="https://fonts.googleapis.com/css2?family=Lexend:wght@400;500;600;700&family=Doto:wght@600&display=swap" rel="stylesheet"> ${renderComponent($$result2, "ConsentVue", null, { "client:only": "vue", "client:component-hydration": "only", "client:component-path": "/Users/junyaoc/Documents/lab/mukapay-client/src/components/Consent.vue", "client:component-export": "default" })} ` })}`;
}, "/Users/junyaoc/Documents/lab/mukapay-client/src/pages/consent.astro", void 0);

const $$file = "/Users/junyaoc/Documents/lab/mukapay-client/src/pages/consent.astro";
const $$url = "/consent";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Consent,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
