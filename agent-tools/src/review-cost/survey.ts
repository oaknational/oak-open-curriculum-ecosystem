import { currentRepo, pullRequestsSince, type ListedPullRequest } from './harvest.js';
import type { CostReport } from './cost.js';
import { pricePullRequest, type PricingInput } from './price.js';

/**
 * `review-cost survey`: every pull request updated since a date, any state,
 * priced as the gate prices it — one line per pull request, a table for the
 * review-cost ledger the wrap appends to, never a refusal. Post-merge reviews
 * and comments are in the count: the recording is read at survey time. A pull
 * request whose commits this checkout does not hold (a fork's, a closed one
 * never fetched) is a row that says so, never an abort of the survey.
 */

export interface SurveyInput {
  readonly since: string;
  readonly repo?: string;
  readonly expectedReviewers: readonly string[];
  readonly ghPath?: string;
  readonly json: boolean;
  readonly stdout: Pick<NodeJS.WriteStream, 'write'>;
  /** The listing seam (defaults to `gh pr list`). */
  readonly list?: (since: string, repo: string, ghPath?: string) => ListedPullRequest[];
  /** The pricing seam (defaults to the gate's pricing over the live recording and local git). */
  readonly price?: (input: PricingInput) => CostReport;
}

type PricedRow = ListedPullRequest & { readonly report: CostReport };
type UnpricedRow = ListedPullRequest & { readonly error: string };
type SurveyRow = PricedRow | UnpricedRow;

// The one boundary where a pricing failure is translated: the survey continues.
function priceRow(
  pull: ListedPullRequest,
  input: SurveyInput,
  repo: string,
  price: (pricing: PricingInput) => CostReport,
): SurveyRow {
  try {
    return {
      ...pull,
      report: price({
        number: pull.number,
        repo,
        expectedReviewers: input.expectedReviewers,
        ghPath: input.ghPath,
      }),
    };
  } catch (cause) {
    return { ...pull, error: cause instanceof Error ? cause.message : String(cause) };
  }
}

function tableLine(row: SurveyRow): string {
  if ('error' in row) {
    return `| #${String(row.number)} | ${row.state} | — | — | — | unpriceable | ${row.error} |\n`;
  }
  const { report } = row;
  const costs = report.rounds
    .map((round) => `${round.head.slice(0, 9)} ${String(round.cost)}`)
    .join(', ');
  return `| #${String(row.number)} | ${row.state} | ${String(report.rounds.length)} | ${String(report.total)} | ${String(report.budget)} (${String(report.budgetPushes)} pushes) | ${report.verdict} | ${costs} |\n`;
}

export function runSurvey(input: SurveyInput): number {
  const list = input.list ?? pullRequestsSince;
  const price = input.price ?? pricePullRequest;
  const repo = input.repo ?? currentRepo(input.ghPath);
  const rows = list(input.since, repo, input.ghPath).map((pull) =>
    priceRow(pull, input, repo, price),
  );
  if (input.json) {
    input.stdout.write(`${JSON.stringify(rows)}\n`);
    return 0;
  }
  input.stdout.write(
    '| PR | state | rounds | settlement cost | budget | verdict | round costs |\n',
  );
  input.stdout.write('| --- | --- | --- | --- | --- | --- | --- |\n');
  for (const row of rows) {
    input.stdout.write(tableLine(row));
  }
  return 0;
}
