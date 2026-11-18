import { describe, expect, it } from 'vitest';

import { parseThreadId, type ThreadId } from '../core/codex-thread-id.js';
import {
  buildChildEnv,
  buildOpenArgv,
  buildResumeArgv,
  digestTemplate,
  envelopeDigest,
  type EnvelopeTemplate,
} from './envelope.js';
import { parseModelPins, type ModelPins } from './model-pins.js';

const V7_ID = '01a0cfaf-7914-72e2-afe7-fb2d0938eb94';

describe('parseModelPins', () => {
  it('reads no pins when there is no configuration', () => {
    expect(parseModelPins(undefined)).toStrictEqual({ ok: true, value: {} });
  });

  it('reads the two top-level keys and nothing else', () => {
    const text = [
      'model = "gpt-6-sol"',
      'model_reasoning_effort = "xhigh"',
      'approval_policy = "on-request"',
      '[mcp_servers.example.env]',
      'TOKEN = "not-read"',
    ].join('\n');
    expect(parseModelPins(text)).toStrictEqual({
      ok: true,
      value: { model: 'gpt-6-sol', effort: 'xhigh' },
    });
  });

  it('reads an absent key as no pin for that key', () => {
    expect(parseModelPins('model = "gpt-6-sol"')).toStrictEqual({
      ok: true,
      value: { model: 'gpt-6-sol' },
    });
  });

  it('never repeats the file text when the configuration cannot be parsed', () => {
    const result = parseModelPins('model = "gpt-6-sol"\nsecret = "abc123\n');
    expect(result).toStrictEqual({ ok: false, error: { kind: 'unparseable-config' } });
  });

  it('accepts a model name of 64 characters, the longest allowed', () => {
    const model = 'a'.repeat(64);
    expect(parseModelPins(`model = "${model}"`)).toStrictEqual({ ok: true, value: { model } });
  });

  it('reads the lowest effort, none, as a pin', () => {
    expect(parseModelPins('model_reasoning_effort = "none"')).toStrictEqual({
      ok: true,
      value: { effort: 'none' },
    });
  });

  it.each([
    ['a model with a quote', String.raw`model = "gpt\"; rm"`, 'model'],
    ['a model starting with a dash', 'model = "-m"', 'model'],
    ['a model of 65 characters', `model = "${'a'.repeat(65)}"`, 'model'],
    ['a model that is not a string', 'model = 6', 'model'],
    [
      'an effort outside the closed set',
      'model_reasoning_effort = "extreme"',
      'model_reasoning_effort',
    ],
    ['an effort that is not a string', 'model_reasoning_effort = true', 'model_reasoning_effort'],
  ])('fails closed on %s, naming the key', (_label, text, key) => {
    expect(parseModelPins(text)).toStrictEqual({
      ok: false,
      error: { kind: 'invalid-model-pin', key },
    });
  });
});

const SENTINEL =
  'The dialogue call envelope changed. Re-adjudicate the authority envelope ' +
  '(ADR-180 §6) before changing this expectation.';

const THREAD = V7_ID;

function threadId(): ThreadId {
  const parsed = parseThreadId(THREAD);
  if (!parsed.ok) {
    return expect.unreachable('fixture thread id must parse');
  }
  return parsed.value;
}

const FLAGS = [
  '--json',
  '--ignore-user-config',
  '--ignore-rules',
  '--skip-git-repo-check',
  '--disable',
  'memories',
  '--disable',
  'shell_snapshot',
];

const SETTINGS = [
  '-c',
  'sandbox_mode="read-only"',
  '-c',
  'approval_policy="never"',
  '-c',
  'web_search="disabled"',
  '-c',
  'project_root_markers=[]',
  '-c',
  'shell_environment_policy.inherit="core"',
  '-c',
  'allow_login_shell=false',
];

const PINS_SLOT = ['-c', 'model="model-slot"', '-c', 'model_reasoning_effort="high"'];

describe('the dialogue call envelope (designed sentinel)', () => {
  it.each([
    ['with model pins', { model: 'model-slot', effort: 'high' } as const, PINS_SLOT],
    ['without model pins', {}, []],
  ])('builds the open argv exactly, %s', (_label, pins, pinArgs) => {
    expect(buildOpenArgv('/root-slot', pins), SENTINEL).toStrictEqual([
      'exec',
      ...FLAGS,
      '-C',
      '/root-slot',
      ...SETTINGS,
      ...pinArgs,
      '-',
    ]);
  });

  it.each([
    ['with model pins', { model: 'model-slot', effort: 'high' } as const, PINS_SLOT],
    ['without model pins', {}, []],
  ])('builds the resume argv exactly, %s', (_label, pins, pinArgs) => {
    expect(buildResumeArgv(threadId(), pins), SENTINEL).toStrictEqual([
      'exec',
      'resume',
      THREAD,
      ...FLAGS,
      ...SETTINGS,
      ...pinArgs,
      '-',
    ]);
  });

  it('builds the child environment exactly, with both homes belonging to the instrument', () => {
    const env = buildChildEnv({
      instrumentHome: '/home-slot',
      instrumentCodexHome: '/codex-home-slot',
      user: 'user-slot',
      lang: 'lang-slot',
      tmpdir: '/tmp-slot',
    });
    expect(env, SENTINEL).toStrictEqual({
      HOME: '/home-slot',
      USER: 'user-slot',
      LOGNAME: 'user-slot',
      LANG: 'lang-slot',
      TMPDIR: '/tmp-slot',
      PATH: '/usr/bin:/bin:/usr/sbin:/sbin',
      CODEX_HOME: '/codex-home-slot',
    });
  });
});

describe('envelopeDigest', () => {
  const pinned: ModelPins = { model: 'gpt-6-sol', effort: 'xhigh' };

  it('gives the same envelope the same digest every time', () => {
    expect(envelopeDigest(pinned)).toBe(envelopeDigest({ ...pinned }));
  });

  it.each([
    ['another model', { ...pinned, model: 'gpt-6-terra' }],
    ['another effort', { ...pinned, effort: 'high' }],
    ['no model pin', { effort: pinned.effort }],
    ['no effort pin', { model: pinned.model }],
    ['no pins at all', {}],
  ] satisfies readonly (readonly [string, ModelPins])[])(
    'gives an envelope with %s a different digest, so a pass on one model is no pass on another',
    (_label, other) => {
      expect(envelopeDigest(other)).not.toBe(envelopeDigest(pinned));
    },
  );
});

describe('digestTemplate', () => {
  const template: EnvelopeTemplate = {
    open: ['exec', '-'],
    resume: ['exec', 'resume', '-'],
    childEnv: buildChildEnv({
      instrumentHome: '/home-slot',
      instrumentCodexHome: '/codex-home-slot',
      user: 'user-slot',
      lang: 'lang-slot',
      tmpdir: '/tmp-slot',
    }),
  };

  it('gives the same template the same digest every time', () => {
    expect(digestTemplate({ ...template })).toBe(digestTemplate(template));
  });

  it.each([
    ['open argv', { ...template, open: ['exec', '--other', '-'] }],
    ['resume argv', { ...template, resume: ['exec', 'resume', '--other', '-'] }],
    ['child environment', { ...template, childEnv: { ...template.childEnv, PATH: '/other' } }],
  ] satisfies readonly (readonly [string, EnvelopeTemplate])[])(
    'gives a template that differs only in its %s a different digest, so the hash covers every part',
    (_label, other) => {
      expect(digestTemplate(other)).not.toBe(digestTemplate(template));
    },
  );
});
