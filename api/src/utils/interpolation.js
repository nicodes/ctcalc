const linearInterpolate = (x, x0, x1, c0, c1) => {
    console.log('linearInterpolate', x, x0, x1, c0, c1)
    const c = c0 + (c1 - c0) / (x1 - x0) * (x - x0)
    return c
}

const bilinearInterpolate = (
    x, x0, x1,
    y, y0, y1,
    c00, c01, c10, c11
) => {
    console.log('bilinearInterpolate', x, x0, x1,
        y, y0, y1,
        c00, c01, c10, c11)
    const x1mx = x1 - x
    const y1my = y1 - y
    const xmx0 = x - x0
    const ymy0 = y - y0

    const c = (
        (c00 * x1mx * y1my)
        + (c01 * x1mx * ymy0)
        + (c10 * xmx0 * y1my)
        + (c11 * xmx0 * ymy0)
    ) / ((x1 - x0) * (y1 - y0))
    return c
}

const trilinearInterpolate = (
    x, x0, x1,
    y, y0, y1,
    z, z0, z1,
    c000, c001, c010, c011, c100, c101, c110, c111
) => {
    console.log('trilinearInterpolate', x, x0, x1,
        y, y0, y1,
        z, z0, z1,
        c000, c001, c010, c011, c100, c101, c110, c111)
    const xd = (x - x0) / (x1 - x0)
    const yd = (y - y0) / (y1 - y0)
    const zd = (z - z0) / (z1 - z0)

    const c00 = (c000 * (1 - xd)) + (c100 * xd)
    const c01 = (c001 * (1 - xd)) + (c101 * xd)
    const c10 = (c010 * (1 - xd)) + (c110 * xd)
    const c11 = (c011 * (1 - xd)) + (c111 * xd)

    const c0 = (c00 * (1 - yd)) + (c10 * yd)
    const c1 = (c01 * (1 - yd)) + (c11 * yd)

    const c = (c0 * (1 - zd)) + (c1 * zd)
    return c
}

module.exports = {
    linearInterpolate,
    bilinearInterpolate,
    trilinearInterpolate
}
