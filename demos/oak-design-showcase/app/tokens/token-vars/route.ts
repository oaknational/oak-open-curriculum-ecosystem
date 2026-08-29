import { loadCatalogue } from '../token-source';
import { tokenVarsStylesheet } from '../token-vars';

/**
 * Serves the generated token→specimen bindings as a real stylesheet.
 *
 * The page links this in its server render, so it is present in the initial
 * HTML and every specimen is painted at first paint — the same construction
 * the specimen route uses for its identity sheet: correct by arriving early,
 * not correct by a script fixing it afterwards.
 *
 * The catalogue is built from trees inlined at build time, so this route has
 * no request-varying input and is safe to cache immutably for the life of a
 * deployment; a token change ships a new build, which is what invalidates it.
 */
export function GET(): Response {
  return new Response(tokenVarsStylesheet(loadCatalogue().tokens), {
    headers: {
      'content-type': 'text/css; charset=utf-8',
      'cache-control': 'public, max-age=0, must-revalidate',
    },
  });
}
