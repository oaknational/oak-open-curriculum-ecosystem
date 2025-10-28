import { createElement, type ReactNode } from 'react';

type AllowedTag = 'em' | 'strong' | 'mark';

const ALLOWED_TAGS: ReadonlySet<string> = new Set(['em', 'strong', 'mark']);

function isAllowedTag(name: string): name is AllowedTag {
  return ALLOWED_TAGS.has(name);
}

function tokenize(html: string): string[] {
  return html.split(/(<\/?[^>]+>)/g).filter(Boolean);
}

function flushUnclosed(
  stack: { type: AllowedTag; children: ReactNode[] }[],
  current: () => ReactNode[],
): void {
  if (stack.length) {
    const last = stack.pop();
    if (last) {
      current().push(...last.children);
    }
  }
}

function handleToken(
  tok: string,
  stack: { type: AllowedTag; children: ReactNode[] }[],
  current: () => ReactNode[],
  keyRef: { current: number },
): void {
  const m = tok.match(/^<\/?\s*([a-zA-Z0-9]+)[^>]*>$/);
  if (!m) {
    current().push(tok);
    return;
  }
  const name = m[1].toLowerCase();
  const closing = tok.startsWith('</');
  if (!isAllowedTag(name)) {
    return;
  }
  if (!closing) {
    stack.push({ type: name, children: [] });
  } else {
    const last = stack.pop();
    if (last && last.type === name) {
      current().push(createElement(name, { key: `hl-${keyRef.current++}` }, ...last.children));
    }
  }
}

export function renderSafeHighlight(html: string): ReactNode[] {
  const tokens = tokenize(html);
  const stack: { type: AllowedTag; children: ReactNode[] }[] = [];
  const root: ReactNode[] = [];
  const keyRef = { current: 0 };

  const current = (): ReactNode[] => (stack.length ? stack[stack.length - 1].children : root);

  for (const tok of tokens) {
    handleToken(tok, stack, current, keyRef);
  }
  flushUnclosed(stack, current);
  return root;
}
