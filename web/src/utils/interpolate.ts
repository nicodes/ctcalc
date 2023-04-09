/**
 * Linearly interpolates between two values based on a given x-value and two boundary x-values.
 *
 * @param x The x-value to interpolate for.
 * @param x0 The lower boundary x-value.
 * @param x1 The upper boundary x-value.
 * @param c0 The value at the lower boundary x-value.
 * @param c1 The value at the upper boundary x-value.
 * @returns The interpolated value between the lower and upper boundary values.
 */
export function linearInterpolate(
  x: number,
  x0: number,
  x1: number,
  c0: number,
  c1: number
) {
  const c = c0 + ((c1 - c0) / (x1 - x0) || 0) * (x - x0);
  return c;
}

/**
 * Trilinearly interpolates between eight values based on given x, y, and z values and their corresponding boundary values.
 *
 * @param x The x-value to interpolate for.
 * @param x0 The lower boundary x-value.
 * @param x1 The upper boundary x-value.
 * @param y The y-value to interpolate for.
 * @param y0 The lower boundary y-value.
 * @param y1 The upper boundary y-value.
 * @param z The z-value to interpolate for.
 * @param z0 The lower boundary z-value.
 * @param z1 The upper boundary z-value.
 * @param c000 The value at the lower x-, y-, and z-boundaries.
 * @param c001 The value at the lower x- and y-boundaries and the upper z-boundary.
 * @param c010 The value at the lower x- and z-boundaries and the upper y-boundary.
 * @param c011 The value at the lower x-boundary and the upper y- and z-boundaries.
 * @param c100 The value at the upper x-, y-, and z-boundaries.
 * @param c101 The value at the upper x- and y-boundaries and the lower z-boundary.
 * @param c110 The value at the upper x- and z-boundaries and the lower y-boundary.
 * @param c111 The value at the upper x-boundary and the lower y- and z-boundaries.
 * @returns The interpolated value between the eight boundary values.
 */
export const trilinearInterpolate = (
  x: number,
  x0: number,
  x1: number,
  y: number,
  y0: number,
  y1: number,
  z: number,
  z0: number,
  z1: number,
  c000: number,
  c001: number,
  c010: number,
  c011: number,
  c100: number,
  c101: number,
  c110: number,
  c111: number
) => {
  const xd = (x - x0) / (x1 - x0) || 0;
  const yd = (y - y0) / (y1 - y0) || 0;
  const zd = (z - z0) / (z1 - z0) || 0;

  const c00 = c000 * (1 - xd) + c100 * xd;
  const c01 = c001 * (1 - xd) + c101 * xd;
  const c10 = c010 * (1 - xd) + c110 * xd;
  const c11 = c011 * (1 - xd) + c111 * xd;

  const c0 = c00 * (1 - yd) + c10 * yd;
  const c1 = c01 * (1 - yd) + c11 * yd;

  const c = c0 * (1 - zd) + c1 * zd;

  return c;
};
