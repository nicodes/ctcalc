function fcFormulaLow(
  inactivationLog: number,
  temperature: number,
  concentration: number,
  ph: number
) {
  return (
    0.353 *
    inactivationLog *
    (12.006 +
      Math.exp(2.46 - 0.073 * temperature + 0.125 * concentration + 0.389 * ph))
  );
}

function fcFormulaHigh(
  inactivationLog: number,
  temperature: number,
  concentration: number,
  ph: number
) {
  return (
    0.361 *
    inactivationLog *
    (-2.261 +
      Math.exp(2.69 - 0.065 * temperature + 0.111 * concentration + 0.361 * ph))
  );
}

export function fcFormula(
  inactivationLog: number,
  temperature: number,
  concentration: number,
  ph: number
) {
  return temperature < 12.5
    ? fcFormulaLow(inactivationLog, temperature, concentration, ph)
    : fcFormulaHigh(inactivationLog, temperature, concentration, ph);
}
