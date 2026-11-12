/**
 * The declared settlement-push budget, read from the pull request
 * description's intake line (`budget — 2`, `budget: 2`), as the PR template
 * records it. Undeclared reads as PDR-132's two.
 */

const DEFAULT_BUDGET_PUSHES = 2;

const BUDGET_LINE = /budget\s*[—–:-]\s*(\d{1,2})\b/iu;

interface DeclaredBudget {
  readonly pushes: number;
  readonly declared: boolean;
}

export function readBudget(body: string): DeclaredBudget {
  const match = BUDGET_LINE.exec(body);
  if (match === null) {
    return { pushes: DEFAULT_BUDGET_PUSHES, declared: false };
  }
  return { pushes: Number(match[1]), declared: true };
}

/**
 * One rebudget decision in the local note: `<pull request> — <YYYY-MM-DD> — <reason>`
 * (a colon or a hyphen serves as the dash), one line per push past the budget.
 */
const REBUDGET_LINE = /^\s*(\d+)\s*[—–:-]\s*\d{4}-\d{2}-\d{2}\s*[—–:-]\s*\S/u;

/** How many rebudget decisions the note records for one pull request. */
export function countRebudgets(note: string, pullRequest: number): number {
  return note
    .split('\n')
    .map((line) => REBUDGET_LINE.exec(line))
    .filter((match) => match !== null && Number(match[1]) === pullRequest).length;
}
