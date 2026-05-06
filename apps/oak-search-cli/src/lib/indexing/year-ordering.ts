function curriculumYearRank(year: string): number | null {
  if (year === 'all-years') {
    return Number.MAX_SAFE_INTEGER;
  }

  const match = year.match(/\d+/);
  return match ? Number(match[0]) : null;
}

export function compareCurriculumYears(left: string, right: string): number {
  const leftRank = curriculumYearRank(left);
  const rightRank = curriculumYearRank(right);

  if (leftRank !== null && rightRank !== null && leftRank !== rightRank) {
    return leftRank - rightRank;
  }

  if (leftRank !== null && rightRank === null) {
    return -1;
  }

  if (leftRank === null && rightRank !== null) {
    return 1;
  }

  return left.localeCompare(right);
}
