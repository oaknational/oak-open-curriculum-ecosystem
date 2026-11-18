import { describe, expect, it } from 'vitest';

import { mayPrefixRedirection, redirectionWordKind } from './redirections.js';

describe('redirectionWordKind reads one shell word as the redirection it is', () => {
  it.each([
    { word: '>/dev/null', kind: 'glued' },
    { word: '2>&1', kind: 'glued' },
    { word: '2>/dev/null', kind: 'glued' },
    { word: '&>>log', kind: 'glued' },
    { word: '>&-', kind: 'glued' },
    { word: '3>&2-', kind: 'glued' },
    { word: '<input', kind: 'glued' },
    { word: '<<<word', kind: 'glued' },
    { word: '>', kind: 'operator' },
    { word: '2>', kind: 'operator' },
    { word: '>>', kind: 'operator' },
    { word: '>|', kind: 'operator' },
    { word: '<>', kind: 'operator' },
    { word: '<&', kind: 'operator' },
    { word: '>&', kind: 'operator' },
    { word: '&>', kind: 'operator' },
    { word: '&>>', kind: 'operator' },
    { word: '<<<', kind: 'operator' },
    { word: '>!', kind: 'operator' },
    { word: '>>!', kind: 'operator' },
    { word: '&>!', kind: 'operator' },
    { word: '>&!', kind: 'operator' },
    { word: '>>|', kind: 'operator' },
    { word: '&>|', kind: 'operator' },
    { word: '<<', kind: 'heredoc' },
    { word: '<<-', kind: 'heredoc' },
    { word: '<<EOF', kind: 'heredoc' },
    { word: '<<-EOF', kind: 'heredoc' },
    { word: 'git', kind: 'none' },
    { word: '-n', kind: 'none' },
    { word: '2', kind: 'none' },
    { word: 'a>b', kind: 'none' },
  ])('reads $word as $kind', ({ word, kind }) => {
    expect(redirectionWordKind(word)).toBe(kind);
  });
});

describe('mayPrefixRedirection reads a word the scanner split from the redirection after it', () => {
  it.each([
    { word: '{fd}', next: '>/dev/null', prefix: true },
    { word: '{fd}', next: '>', prefix: true },
    { word: '2', next: '<<EOF', prefix: true },
    { word: '{fd}', next: 'git', prefix: false },
    { word: '2', next: 'git', prefix: false },
    { word: '{', next: '>/dev/null', prefix: false },
    { word: '{1fd}', next: '>/dev/null', prefix: false },
    { word: 'git', next: '>/dev/null', prefix: false },
  ])('reads $word before $next as a prefix: $prefix', ({ word, next, prefix }) => {
    expect(mayPrefixRedirection(word, next)).toBe(prefix);
  });
});
