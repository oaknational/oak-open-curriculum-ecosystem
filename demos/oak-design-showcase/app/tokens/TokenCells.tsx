'use client';

/**
 * The three cells that carry a token's meaning: what it is, what it paints,
 * and whose value it is here.
 *
 * They live apart from the table because each answers a different question
 * about presentation, and each has a rule worth stating once rather than
 * re-deciding in a row body: the specimen is decorative, the annotations
 * only mark restrictions, and identity is never signalled by colour alone.
 */
import type { ReactElement } from 'react';

import { IDENTITY_LABELS, type IdentitySlug } from '../../components/useIdentity';

import { RESOLVED_PROPERTY, type SpecimenKind } from './specimen-kind';
import type { CatalogueToken } from './token-catalogue';

/** Specimen kinds whose paint only reads on real glyphs. */
const SAMPLE_TEXT: Readonly<Partial<Record<SpecimenKind, string>>> = {
  font: 'Ag',
  family: 'Ag',
  weight: 'Ag',
  'font-size': 'Ag',
  leading: 'Ag Ag Ag',
  tracking: 'AVAILABLE',
};

/** The applied specimen. Decorative by construction: the value printed
 *  beside it carries the information, and four hundred announced sample
 *  glyphs would carry none. */
export function Specimen({ token }: { readonly token: CatalogueToken }): ReactElement {
  if (token.kind === 'plain') {
    return (
      <>
        <span aria-hidden="true">&mdash;</span>
        <span className="oak-visually-hidden">No specimen for this token</span>
      </>
    );
  }
  return (
    <span
      className={`tok-paint tok-paint--${token.kind}`}
      data-resolve={RESOLVED_PROPERTY[token.kind]}
      aria-hidden="true"
    >
      {SAMPLE_TEXT[token.kind]}
    </span>
  );
}

/**
 * The token's name, and the one annotation that qualifies the TOKEN.
 *
 * Tier is annotated only at tier 1, the one a reader can misuse — literals
 * live there and belong inside token definitions — because tiers 2 and 3
 * are both "use these" and marking them would spend four hundred rows
 * saying nothing.
 */
export function TokenName({ token }: { readonly token: CatalogueToken }): ReactElement {
  return (
    <>
      <span className="oak-code-3">{token.name}</span>
      {token.tier === 1 && (
        <span className="oak-body-4 tok-flag">
          {'primitive'}
          <span className="oak-visually-hidden">
            {' '}
            &mdash; reference this inside a token definition, not at the point of use
          </span>
        </span>
      )}
    </>
  );
}

/**
 * The value, the expression it came from, and the marker saying this is one
 * of several.
 *
 * "theme" sits HERE rather than beside the name because it is a fact about
 * the VALUE: the token is the same token under every theme, and what
 * changes is the number printed in this cell. Putting it where it belongs
 * also buys the narrow card a line — beside the name it pushed the identity
 * badges onto a row of their own.
 */
export function TokenValue({
  token,
  value,
  expression,
}: {
  readonly token: CatalogueToken;
  readonly value: string;
  readonly expression: string;
}): ReactElement {
  return (
    <>
      <span className="oak-code-3">{value}</span>
      {expression !== '' && expression !== value && (
        <span className="oak-code-3 tok-expr"> {expression}</span>
      )}
      {/* Transitive, not declaration-counted (review round 3): an alias of
          a themed role changes with the theme while declaring one face. */}
      {token.themed && (
        <span className="oak-body-4 tok-flag">
          {'theme'}
          <span className="oak-visually-hidden"> &mdash; this value changes with the theme</span>
        </span>
      )}
    </>
  );
}

/** Which identities re-point this token. The one currently shown is marked,
 *  so the rows that just changed are findable by eye after a switch — and
 *  named in text inside the marker, never by its outline alone. */
export function IdentityDeltaCell({
  owners,
  identity,
}: {
  readonly owners: readonly IdentitySlug[];
  readonly identity: IdentitySlug;
}): ReactElement {
  if (owners.length === 0) {
    return (
      <>
        <span aria-hidden="true">&mdash;</span>
        <span className="oak-visually-hidden">No identity re-points this token</span>
      </>
    );
  }
  return (
    <span className="tok-owners">
      {owners.map((slug) => (
        // The identity being shown is the outlined one. Its neighbours take
        // the quiet grey: a hundred and ten lemon tags down a reference
        // table shout louder than the swatches the table is about.
        <span
          key={slug}
          className={
            slug === identity ? 'oak-tag oak-tag--white tok-owner-shown' : 'oak-tag oak-tag--grey'
          }
        >
          {IDENTITY_LABELS[slug]}
          {slug === identity && (
            <span className="oak-visually-hidden">
              {' '}
              &mdash; the identity shown, so this value is theirs
            </span>
          )}
        </span>
      ))}
    </span>
  );
}
