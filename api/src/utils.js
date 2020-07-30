function interpolate(xi, x0, y0, x1, y1) {
    return y0 + (y1 - y0) / (x1 - x0) * (xi - x0)
}

const fcFormulaLow = (
    inactivationLog,
    temperature,
    concentration,
    ph
) => 0.353 * inactivationLog * (
    12.006 + Math.exp(
        2.46
        - 0.073 * temperature
        + 0.125 * concentration
        + 0.389 * ph
    )
)

function fcFormulaHigh(
    inactivationLog,
    temperature,
    concentration,
    ph
) {
    return 0.361 * inactivationLog * (
        -2.261 + Math.exp(
            2.69
            - 0.065 * temperature
            + 0.111 * concentration
            + 0.361 * ph
        )
    )
}

function fcFormula(
    inactivationLog,
    temperature,
    concentration,
    ph
) {
    return temperature < 12.5
        ? fcFormulaLow(
            inactivationLog,
            temperature,
            concentration,
            ph
        )
        : fcFormulaHigh(
            inactivationLog,
            temperature,
            concentration,
            ph
        )
}

module.exports = {
    interpolate,
    fcFormula
}
