function interpolate(xi, x0, y0, x1, y1) {
    return y0 + (y1 - y0) / (x1 - x0) * (xi - x0)
}

module.exports = {
    interpolate
}
