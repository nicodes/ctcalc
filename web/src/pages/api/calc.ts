import { fcFormula } from "../../utils/formula";
import { getInactivationFromJSON } from "../../utils/inactivation";
import {
  linearInterpolate,
  trilinearInterpolate,
} from "../../utils/interpolate";
import { parseQueryParams } from "../../utils/parseQueryParams";
import { validate } from "../../utils/validate";

export async function get({ params, request }) {
  const queryParams = parseQueryParams(request.url);
  const [validatedParams, error] = validate(queryParams);

  if (!validatedParams) return { body: error }; // TODO put error code

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
  if (isFormula) {
    const result = fcFormula(inactivationLog, temperature, concentration, ph);
    return { body: `${result}` };
  }

  // TODO what to do about rounding?

  // Free Chlorine and Giardia requires trilinear interpolation over temperature, ph, and concentration
  console.log("test", isFreeChlorine, isGiardia);
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

    const interpolatedInactivation = trilinearInterpolate(
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

    return {
      body: `${interpolatedInactivation}`,
    };
  }

  console.log("Linear interpolation over temperature");
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

  const interpolatedInactivation = linearInterpolate(
    temperature,
    temperatureLow,
    temperatureHigh,
    inactivations[0],
    inactivations[1]
  );

  return {
    body: `${interpolatedInactivation}`,
  };
}
