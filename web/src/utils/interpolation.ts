export function linearInterpolate(
  x: number,
  x0: number,
  x1: number,
  c0: number,
  c1: number
) {
  console.log("linearInterpolate", x, x0, x1, c0, c1);
  const c = c0 + ((c1 - c0) / (x1 - x0)) * (x - x0);
  return c;
}

export function bilinearInterpolate(
  x: number,
  x0: number,
  x1: number,
  y: number,
  y0: number,
  y1: number,
  c00: number,
  c01: number,
  c10: number,
  c11: number
) {
  console.log("bilinearInterpolate", x, x0, x1, y, y0, y1, c00, c01, c10, c11);
  const x1mx = x1 - x;
  const y1my = y1 - y;
  const xmx0 = x - x0;
  const ymy0 = y - y0;

  const c =
    (c00 * x1mx * y1my +
      c01 * x1mx * ymy0 +
      c10 * xmx0 * y1my +
      c11 * xmx0 * ymy0) /
    ((x1 - x0) * (y1 - y0));
  return c;
}

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
  console.log(
    "trilinearInterpolate",
    x,
    x0,
    x1,
    y,
    y0,
    y1,
    z,
    z0,
    z1,
    c000,
    c001,
    c010,
    c011,
    c100,
    c101,
    c110,
    c111
  );
  // TODO why || 0? it's because we shouldn't be triinterpolating when we're at the edge of the data
  const xd = (x - x0) / (x1 - x0) || 0;
  const yd = (y - y0) / (y1 - y0) || 0;
  const zd = (z - z0) / (z1 - z0) || 0;
  console.log("test1", xd, yd, zd);

  const c00 = c000 * (1 - xd) + c100 * xd;
  const c01 = c001 * (1 - xd) + c101 * xd;
  const c10 = c010 * (1 - xd) + c110 * xd;
  const c11 = c011 * (1 - xd) + c111 * xd;
  console.log("test2", c00, c01, c10, c11);

  const c0 = c00 * (1 - yd) + c10 * yd;
  const c1 = c01 * (1 - yd) + c11 * yd;
  console.log("test3", c0, c1);

  const c = c0 * (1 - zd) + c1 * zd;
  console.log("test4", c);

  return c;
};
