// import Astro from 'astro';
import inactivations from "../../inactivations.json";
import { fcFormula } from "../../utils/formula";
import { trilinearInterpolate } from "../../utils/interpolation";
import {
  Disinfectant,
  Methodology,
  Pathogen,
  activationLogs,
  giardiaActivationLogs,
  isValidMethodology,
  newValidate,
  validate,
} from "../../utils/validate";

function getInactivationFromJSON(
  disinfectant: Disinfectant,
  pathogen: Pathogen,
  temperature: number,
  inactivationLog: number,
  ph: number,
  concentration: number
) {
  if (disinfectant === "free_chlorine" && pathogen === "giardia")
    return (inactivations as any)[disinfectant][pathogen][temperature][
      concentration
    ][ph.toFixed(1)][inactivationLog.toFixed(1)];

  return (inactivations as any)[disinfectant][pathogen][
    inactivationLog.toFixed(1)
  ];
}

/**
 * Parses the query parameters of a URL string as JSON and returns them as an object.
 * @param url - The URL string to parse.
 * @returns An object containing the parsed query parameters, or undefined if the URL has no query parameters.
 */
function parseQueryParams(url: string): Record<string, any> | undefined {
  const queryParamsString = url.split("?")[1];
  if (!queryParamsString) return;

  const queryParamsArray = queryParamsString.split("&");
  const queryParams: Record<string, any> = {};

  // Loop over each key-value pair in the array and parse the value as JSON
  queryParamsArray.forEach((queryParam) => {
    const [key, value] = queryParam.split("=");

    try {
      // Decode the URI-encoded value string and parse it as JSON
      const decodedValue = decodeURIComponent(value);
      const parsedValue = JSON.parse(decodedValue);
      queryParams[key] = parsedValue;
    } catch (err) {
      // If parsing fails, set the key-value pair to the original (unparsed) value
      queryParams[key] = value;
    }
  });

  return queryParams;
}

// Outputs: /builtwith.json
export async function get({ params, request }) {
  const queryParams = parseQueryParams(request.url);

  console.log(queryParams);

  const [validatedParams, error] = newValidate(queryParams);
  if (!validatedParams) return { body: error };

  const {
    methodology,
    disinfectant,
    pathogen,
    temperature,
    ph,
    concentration,
    inactivationLog,
  } = validatedParams;

  console.log(validatedParams);

  // helpers
  const isFreeChlorine = disinfectant === "free_chlorine";

  const [temperatureMin, n] = (() => (isFreeChlorine ? [0.5, 5] : [1.0, 1]))();
  const temperatureSanitized =
    temperature < temperatureMin ? temperatureMin : temperature;
  const t = temperatureSanitized / n;
  const temperatureLow = Math.max(temperatureMin, Math.floor(t) * n);
  const temperatureHigh = Number(Math.ceil(t) * n);
  const isTemperatureInterpolate = !(
    temperatureSanitized === temperatureMin ||
    temperatureLow === temperatureHigh
  );

  const phLow = Number(Math.floor(ph / 0.5) * 0.5);
  const phHigh = Number(Math.ceil(ph / 0.5) * 0.5);
  const isPhInterpolate = phLow !== phHigh;

  const concentrationLow = Number(Math.floor(concentration / 0.2) * 0.2);
  const concentrationHigh = Number(Math.ceil(concentration / 0.2) * 0.2);
  const isConcentrationInterpolate = concentrationLow !== concentrationHigh;

  // inactivation
  // const inactivation = getInactivationFromJSON(
  //   disinfectant,
  //   pathogen,
  //   temperature,
  //   inactivationLog,
  //   ph,
  //   concentration
  // );

  // Formula
  // if (queryParams?.methodology === "formula") {
  //   const result = fcFormula(inactivationLog, temperature, concentration, ph);
  //   return { body: `${result}` };
  // }

  // Trilinear Interpolation
  if (
    true
    // isTemperatureInterpolate &&
    // isPhInterpolate &&
    // isConcentrationInterpolate
  ) {
    // console.log("trilinear");
    console.log("test concentration", concentrationLow, concentrationHigh);
    const inactivations = [
      [temperatureLow, phLow, concentrationLow],
      [temperatureLow, phLow, concentrationHigh],
      [temperatureLow, phHigh, concentrationLow],
      [temperatureLow, phHigh, concentrationHigh],
      [temperatureHigh, phLow, concentrationLow],
      [temperatureHigh, phLow, concentrationHigh],
      [temperatureHigh, phHigh, concentrationLow],
      [temperatureHigh, phHigh, concentrationHigh],
    ].map(([t, p, c]) => {
      console.log(t, p, c);
      return getInactivationFromJSON(
        disinfectant,
        pathogen,
        t,
        inactivationLog,
        p,
        c
      );
    });
    console.log(inactivations);
    // return {
    //   body: JSON.stringify(x),
    // };

    const interpolatedInactivations = trilinearInterpolate(
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

    console.log("result", interpolatedInactivations);

    return {
      body: `${interpolatedInactivations}`,
    };
  }

  // .join("");
  // dbRes = await queryDb(pool, sql);
  // return apiRes
  //   .status(200)
  //   .send(
  //     `${trilinearInterpolate(
  //       temperature,
  //       temperatureLow,
  //       temperatureHigh,
  //       ph,
  //       phLow,
  //       phHigh,
  //       concentration,
  //       concentrationLow,
  //       concentrationHigh,
  //       ...dbRes.map((r) => Number(r.rows[0].inactivation))
  //     )}`
  //   );
  // }

  return {
    body: JSON.stringify("test"),
  };
}
