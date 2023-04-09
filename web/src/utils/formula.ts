/**
 * Calculates the FC formula for temperatures below 12.5 degrees Celsius.
 *
 * @param inactivationLog The inactivation log value.
 * @param temperature The temperature value in degrees Celsius.
 * @param concentration The concentration value.
 * @param ph The pH value.
 * @returns The result of the FC formula.
 */
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

/**
 * Calculates the FC formula for temperatures equal to or above 12.5 degrees Celsius.
 *
 * @param inactivationLog The inactivation log value.
 * @param temperature The temperature value in degrees Celsius.
 * @param concentration The concentration value.
 * @param ph The pH value.
 * @returns The result of the FC formula.
 */
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

/**
 * Calculates the FC formula.
 *
 * @param inactivationLog - The inactivation log value.
 * @param temperature - The temperature value in degrees Celsius.
 * @param concentration - The concentration value.
 * @param ph - The pH value.
 * @returns The result of the FC formula.
 */
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
