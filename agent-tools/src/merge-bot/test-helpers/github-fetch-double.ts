import type { GithubApiFetch } from '../mint-installation-token.js';

/**
 * A scripted GitHub for the pull-request writes' tests: every request is
 * recorded (method, URL, parsed JSON body) and answered by the script, a
 * function from the request to a status and a body. A request the script
 * does not answer gets a 599 whose message names it, so a call a case did
 * not expect fails that case loudly instead of passing as GitHub's silence.
 * No network, no IO.
 */

/** One request as the fetch received it. */
export interface RecordedRequest {
  readonly method: string;
  readonly url: string;
  /** The JSON body, parsed; undefined when the request sent none. */
  readonly body: unknown;
  readonly authorization: string | undefined;
}

/** What the script answers one request with. */
interface ScriptedAnswer {
  readonly status: number;
  readonly body: unknown;
}

/** The script: the answer to a request, or undefined for one it does not expect. */
export type GithubScript = (request: RecordedRequest) => ScriptedAnswer | undefined;

/** The fetch over a script, and the requests it has received so far, in order. */
export function scriptedGithub(script: GithubScript): {
  readonly fetchImpl: GithubApiFetch;
  readonly requests: RecordedRequest[];
} {
  const requests: RecordedRequest[] = [];
  const fetchImpl: GithubApiFetch = (url, init) => {
    const request: RecordedRequest = {
      method: init.method,
      url,
      body: init.body === undefined ? undefined : JSON.parse(init.body),
      authorization: init.headers['authorization'],
    };
    requests.push(request);
    const answer = script(request) ?? {
      status: 599,
      body: { message: `unscripted request: ${init.method} ${url}` },
    };
    return Promise.resolve({ status: answer.status, json: () => Promise.resolve(answer.body) });
  };
  return { fetchImpl, requests };
}

/** A fetch that rejects every call, as a dropped connection does. */
export const connectionRefused: GithubApiFetch = () =>
  Promise.reject(new Error('connection reset'));

/** The recorded requests' method and URL lines, for assertions on which calls were made. */
export function requestLines(requests: readonly RecordedRequest[]): string[] {
  return requests.map((request) => `${request.method} ${request.url}`);
}

/** The recorded requests that write (anything but a GET), for assertions that nothing was written. */
export function writes(requests: readonly RecordedRequest[]): RecordedRequest[] {
  return requests.filter((request) => request.method !== 'GET');
}

/** The one recorded request with that method and URL, for assertions on what a call carried. */
export function requestTo(
  requests: readonly RecordedRequest[],
  method: string,
  url: string,
): RecordedRequest | undefined {
  return requests.find((request) => request.method === method && request.url === url);
}
