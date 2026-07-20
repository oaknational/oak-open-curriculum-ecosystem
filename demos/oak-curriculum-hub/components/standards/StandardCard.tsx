import type { ReactElement } from 'react';
import type { StandardCardVM } from '@/lib/standards-view-model';

/**
 * A single quality-standard result card for the `/standards` browser: the QS id, an optional
 * type pill, the standard text, an optional rubric code, and the guidance-area + component tags —
 * reproducing the `Oak Standards.dc.html` card. The whole card is a `<button>` that opens the
 * standard's detail view (native keyboard + focus; an explicit `aria-label` gives it a concise
 * accessible name). Guidance-area tag colours are data-derived, so they are inline styles.
 */

/** Inline style for a data-derived guidance-area tag colour. */
function areaTagStyle(colour: string): { readonly backgroundColor: string } {
  return { backgroundColor: colour };
}

/** The type pill ("Required" lemon / "Model" lavender); nothing for an untyped standard. */
function TypePill({ card }: { readonly card: StandardCardVM }): ReactElement | null {
  if (card.typeVariant === 'none') {
    return null;
  }
  const tint = card.typeVariant === 'required' ? 'bg-decorative-5' : 'bg-decorative-3-subtle';
  return (
    <span
      className={`shrink-0 rounded-full border-2 border-line px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.03em] text-ink ${tint}`}
    >
      {card.typeLabel}
    </span>
  );
}

/** The guidance-area + component tag row beneath a card's headline; nothing when a card has none. */
function CardTags({ card }: { readonly card: StandardCardVM }): ReactElement | null {
  if (card.areaTags.length === 0 && card.componentTags.length === 0) {
    return null;
  }
  return (
    <span className="mt-3 flex flex-wrap items-center gap-2 border-t border-dashed border-line-soft pt-3">
      {card.areaTags.map((tag) => (
        <span
          key={tag.label}
          style={areaTagStyle(tag.colour)}
          className="rounded-full border-2 border-line px-2.5 py-1 text-[12px] font-bold text-ink"
        >
          {tag.label}
        </span>
      ))}
      {card.componentTags.map((component) => (
        <span
          key={component}
          className="rounded-full border border-line-soft px-2.5 py-1 text-[12px] text-ink-subdued"
        >
          {component}
        </span>
      ))}
    </span>
  );
}

export function StandardCard({
  card,
  onOpen,
}: {
  readonly card: StandardCardVM;
  readonly onOpen: (id: string) => void;
}): ReactElement {
  return (
    <button
      type="button"
      aria-label={`${card.id}: ${card.text}`}
      onClick={() => onOpen(card.id)}
      className="w-full rounded-large border-2 border-line bg-surface px-5 py-[18px] text-left shadow-accent-brand transition-transform hover:-translate-y-0.5 hover:shadow-accent-wide-brand"
    >
      <span className="flex flex-wrap items-start gap-3.5">
        <span className="shrink-0 rounded-mid border-2 border-link bg-decorative-3-subtle px-2.5 py-1.5 text-[12px] font-bold text-link">
          {card.id}
        </span>
        <TypePill card={card} />
        <span className="min-w-0 flex-1 text-[18px] leading-[26px] break-words">{card.text}</span>
        {card.hasCode && (
          <span className="shrink-0 rounded-mid border-2 border-line-soft px-2 py-1.5 text-[12px] font-bold text-ink-subdued">
            {card.code}
          </span>
        )}
        <span aria-hidden className="shrink-0 self-center text-[22px] font-bold text-ink-subdued">
          ›
        </span>
      </span>
      <CardTags card={card} />
    </button>
  );
}
