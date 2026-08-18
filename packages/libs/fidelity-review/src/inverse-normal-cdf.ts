/**
 * Φ⁻¹ (inverse standard-normal CDF) as a standalone numeric primitive —
 * the Acklam rational approximation, relative error below 1.15e-9 over
 * (0, 1), no dependency. Extracted from visual-calibration at its line
 * cap; the calibration module remains its consumer.
 */
import { err, ok, type Result } from '@oaknational/result';

/** Φ⁻¹ via the Acklam rational approximation. */
export function inverseNormalCdf(p: number): Result<number, string> {
  if (!(p > 0 && p < 1)) {
    return err(`inverseNormalCdf domain is (0, 1); saw ${p}`);
  }
  const a = [
    -39.69683028665376, 220.9460984245205, -275.9285104469689, 138.357751867269, -30.66479806614716,
    2.506628277459239,
  ] as const;
  const b = [
    -54.47609879822406, 161.5858368580409, -155.6989798598866, 66.80131188771972,
    -13.28068155288572,
  ] as const;
  const c = [
    -0.007784894002430293, -0.3223964580411365, -2.400758277161838, -2.549732539343734,
    4.374664141464968, 2.938163982698783,
  ] as const;
  const d = [
    0.007784695709041462, 0.3224671290700398, 2.445134137142996, 3.754408661907416,
  ] as const;
  const pLow = 0.02425;
  const pHigh = 1 - pLow;
  if (p < pLow) {
    const q = Math.sqrt(-2 * Math.log(p));
    return ok(
      (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
        ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1),
    );
  }
  if (p > pHigh) {
    const q = Math.sqrt(-2 * Math.log(1 - p));
    return ok(
      -(
        (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
        ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1)
      ),
    );
  }
  const q = p - 0.5;
  const r = q * q;
  return ok(
    ((((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q) /
      (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1),
  );
}
