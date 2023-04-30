import inactivations from "../data/inactivations.json";
import { fcFormula } from "./formula";
import { trilinearInterpolate, linearInterpolate } from "./interpolate";
import type { Disinfectant, Pathogen } from "./validate";

/**
 * Gets the inactivation value for a given disinfectant, pathogen, temperature, concentration, pH, and inactivation log from a JSON object.
 *
 * @param disinfectant The disinfectant to get the inactivation value for.
 * @param pathogen The pathogen to get the inactivation value for.
 * @param temperature The temperature value in degrees Celsius to get the inactivation value for.
 * @param concentration The concentration value to get the inactivation value for. Optional, default is undefined.
 * @param ph The pH value to get the inactivation value for. Optional, default is undefined.
 * @param inactivationLog The inactivation log value to get the inactivation value for.
 * @returns The inactivation value for the given parameters.
 */
export function getInactivationFromJSON(
  disinfectant: Disinfectant,
  pathogen: Pathogen,
  temperature: number,
  concentration: number | undefined,
  ph: number | undefined,
  inactivationLog: number
) {
  if (disinfectant === "free_chlorine" && pathogen === "giardia")
    return (inactivations as any)[disinfectant][pathogen][
      temperature.toFixed(1)
    ][concentration!.toFixed(1)][ph!.toFixed(1)][inactivationLog.toFixed(1)];

  return (inactivations as any)[disinfectant][pathogen][temperature.toFixed(1)][
    inactivationLog.toFixed(1)
  ];
}

/**
 * Calculates the inactivation value based on the provided validated parameters.
 * @param validatedParams Object containing validated parameters used in the calculation:
 * @param validatedParams.methodology Methodology used in the calculation. Can be "formula", "experimental", or "extrapolated".
 * @param validatedParams.disinfectant Type of disinfectant used in the calculation. Can be "free_chlorine" or "monochloramine".
 * @param validatedParams.pathogen Type of pathogen used in the calculation. Can be "giardia" or "cryptosporidium".
 * @param validatedParams.temperature Temperature value in degrees Celsius.
 * @param validatedParams.ph pH value.
 * @param validatedParams.concentration Concentration value in mg/L.
 * @param validatedParams.inactivationLog Inactivation log value.
 * @returns Results of all calculation methodologies.
 */
export function getResults(validatedParams: any) {
  const {
    methodology,
    disinfectant,
    pathogen,
    temperature,
    ph,
    concentration,
    inactivationLog,
  } = validatedParams;

  // boolean helpers
  const isFormula = methodology === "formula";
  const isFreeChlorine = disinfectant === "free_chlorine";
  const isGiardia = pathogen === "giardia";

  // temperature helpers
  const [temperatureMin, n] = isFreeChlorine ? [0.5, 5] : [1.0, 1];
  const temperatureSanitized =
    temperature < temperatureMin ? temperatureMin : temperature;
  const t = temperatureSanitized / n;
  const temperatureLow = Math.max(temperatureMin, Math.floor(t) * n);
  const temperatureHigh = Number(Math.ceil(t) * n);

  // Formula
  const formulaResult = fcFormula(
    inactivationLog,
    temperature,
    concentration,
    ph
  );

  let interpolatedResult: number;
  // TODO what to do about rounding?

  // Free Chlorine and Giardia requires trilinear interpolation over temperature, ph, and concentration
  if (isFreeChlorine && isGiardia) {
    const phLow = Number(Math.floor(ph / 0.5) * 0.5);
    const phHigh = Number(Math.ceil(ph / 0.5) * 0.5);

    const concentrationLow = Number(Math.floor(concentration / 0.2) * 0.2);
    const concentrationHigh = Number(Math.ceil(concentration / 0.2) * 0.2);

    const inactivations = [
      [temperatureLow, phLow, concentrationLow],
      [temperatureLow, phLow, concentrationHigh],
      [temperatureLow, phHigh, concentrationLow],
      [temperatureLow, phHigh, concentrationHigh],
      [temperatureHigh, phLow, concentrationLow],
      [temperatureHigh, phLow, concentrationHigh],
      [temperatureHigh, phHigh, concentrationLow],
      [temperatureHigh, phHigh, concentrationHigh],
    ].map(([t, p, c]) =>
      getInactivationFromJSON(disinfectant, pathogen, t, c, p, inactivationLog)
    );

    interpolatedResult = trilinearInterpolate(
      temperature,
      temperatureLow,
      temperatureHigh,
      ph,
      phLow,
      phHigh,
      concentration,
      concentrationLow,
      concentrationHigh,
      inactivations[0],
      inactivations[1],
      inactivations[2],
      inactivations[3],
      inactivations[4],
      inactivations[5],
      inactivations[6],
      inactivations[7]
    );
  } else {
    const inactivations = [temperatureLow, temperatureHigh].map((t) =>
      getInactivationFromJSON(
        disinfectant,
        pathogen,
        t,
        undefined,
        undefined,
        inactivationLog
      )
    );

    interpolatedResult = linearInterpolate(
      temperature,
      temperatureLow,
      temperatureHigh,
      inactivations[0],
      inactivations[1]
    );
  }

  return { formulaResult, interpolatedResult };
}
