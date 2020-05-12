/* returns high and low for value and array */
/* eg. value = 2.5 and arr = [1, 2, 3] => [2, 3] */
function interpolationBounds(val, arr) {
    const highIdx = arr.sort((a, b) => a - b).findIndex((e) => e >= val)
    const highVal = arr[highIdx]
    const lowVal = highIdx === 0 || val === highVal ? highVal : arr[highIdx - 1]
    return [lowVal, highVal]
}

function interpolate(x0, x, x1, y0, y1) {
    const y = y0 + (y1 - y0) / (x1 - x0) * (x - x0)
    return y
}

module.exports = {
    interpolationBounds,
    interpolate
}
