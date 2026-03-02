# 5. Headless Components

## What this package provides

Typed React wrappers around Ark UI (Zag.js) primitives that:

- Re-export Ark components with the shared variant types from `core`
- Map component props to data attributes (for recipe CSS targeting)
- Add any shared behavioural logic not covered by Ark
- Enforce the variant types from `core`

## What this package does NOT provide

- Any CSS, colours, fonts, spacing, or visual styling
- Any design token references
- Any brand-specific components
- Any layout utilities

## Ark UI (Zag.js) — how it works

Ark UI is built on Zag.js — finite state machines for UI interactions. Each component (Dialog, Accordion, Tabs, etc.) is a state machine that:

- Manages open/closed/active states
- Handles keyboard events (Arrow, Enter, Space, Escape, Home, End)
- Sets ARIA attributes automatically based on state transitions
- Manages focus (trapping, return, roving tabindex)
- Announces changes to screen readers

The state machines are framework-agnostic. Ark UI provides thin bindings for React (and Vue, Svelte, Solid — though we only use React now).

## Example: Headless Button

```typescript
// packages/headless/src/components/button/Button.tsx

import { forwardRef } from "react";
import type { ButtonIntent, ButtonSize } from "@oaknational/ds-core";

interface HeadlessButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  intent?: ButtonIntent;
  size?: ButtonSize;
  asChild?: boolean;
}

export const HeadlessButton = forwardRef<HTMLButtonElement, HeadlessButtonProps>(
  function HeadlessButton({ intent, size, className, ...props }, ref) {
    return (
      <button
        ref={ref}
        data-ds="button"
        data-intent={intent}
        data-size={size}
        className={className}
        {...props}
      />
    );
  }
);
```

## Example: Headless Dialog (wrapping Ark UI)

```typescript
// packages/headless/src/components/dialog/Dialog.tsx

import { Dialog as ArkDialog } from "@ark-ui/react/dialog";
import { Portal } from "@ark-ui/react/portal";
import type { DialogSize } from "@oaknational/ds-core";

interface DialogContentProps {
  children: React.ReactNode;
  size?: DialogSize;
}

function DialogContent({ children, size = "md", ...props }: DialogContentProps) {
  return (
    <Portal>
      <ArkDialog.Backdrop data-ds="dialog-overlay" />
      <ArkDialog.Positioner>
        <ArkDialog.Content data-ds="dialog" data-size={size} {...props}>
          {children}
        </ArkDialog.Content>
      </ArkDialog.Positioner>
    </Portal>
  );
}

export const Dialog = {
  Root: ArkDialog.Root,
  Trigger: ArkDialog.Trigger,
  Content: DialogContent,
  Title: ArkDialog.Title,
  Description: ArkDialog.Description,
  CloseTrigger: ArkDialog.CloseTrigger,
};
```

## `asChild` pattern for framework integration

Ark UI (like Radix) supports `asChild`, which lets consumers render their own element while inheriting the headless behaviour:

```tsx
import NextLink from "next/link";
import { Link } from "@oaknational/ds-oak";

<Link asChild>
  <NextLink href="/about">About us</NextLink>
</Link>
```

This avoids the need for a Next.js adapter package. The consumer passes `next/link` or `next/image` as a child — the headless component provides behaviour and data attributes; the child provides framework-specific routing or optimisation.

## Server Components note

Components that use Ark UI (any interactive component) need `"use client"` at the top of their file. Typography, layout, and other non-interactive components can remain server components.
