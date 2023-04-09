const methodologies = ["round", "interpolate", "formula"] as const;
export type Methodology = (typeof methodologies)[number];

function isValidMethodology(methodology: any) {
  if (typeof methodology !== "string") return false;
  return methodologies.includes(methodology as Methodology);
}

const disinfectants = [
  "free_chlorine",
  "chlorine_dioxide",
  "chloramine",
  "ozone",
] as const;
export type Disinfectant = (typeof disinfectants)[number];

function isValidDisinfectant(disinfectant: any) {
  if (typeof disinfectant !== "string") return false;
  return disinfectants.includes(disinfectant as Disinfectant);
}

const pathogens = ["giardia", "virus"] as const;
export type Pathogen = (typeof pathogens)[number];

function isValidPathogen(pathogen: any) {
  if (typeof pathogen !== "string") return false;
  return pathogens.includes(pathogen as Pathogen);
}

function isValidTemperature(temperature: any) {
  if (typeof temperature !== "number") return false;
  return 0 < temperature && temperature <= 25;
}

function isValidPh(ph: any) {
  if (typeof ph !== "number") return false;
  return 6 <= ph && ph <= 9;
}

function isValidConcentration(concentration: any) {
  if (typeof concentration !== "number") return false;
  return 0 < concentration && concentration <= 3;
}

// TODO should these be strings?
const inactivationLogs = [2, 3, 4];
const giardiaInactivationLogs = [0.5, 1, 1.5, 2, 2, 3];
function isValidInactivationLog(inactivationLog: any, isGiardia?: boolean) {
  if (typeof inactivationLog !== "number") return false;
  return (isGiardia ? giardiaInactivationLogs : inactivationLogs).includes(
    inactivationLog
  );
}

type ValidatedParams = {
  methodology: Methodology;
  disinfectant: Disinfectant;
  pathogen: Pathogen;
  temperature: number;
  ph: number;
  concentration: number;
  inactivationLog: number;
};

/** returns validated params xor error */
export function validate(
  queryParams: any
): [ValidatedParams, undefined?] | [undefined, string] {
  if (!queryParams) return [, "No arguments provided"];

  if (!isValidMethodology(queryParams.methodology))
    return [, `Invalid methodology: ${queryParams.methodology}`];

  if (!isValidDisinfectant(queryParams.disinfectant))
    return [, `Invalid disinfectant: ${queryParams.disinfectant}`];

  if (!isValidPathogen(queryParams.pathogen))
    return [, `Invalid pathogen: ${queryParams.pathogen}`];

  if (!isValidTemperature(queryParams.temperature))
    return [, `Invalid temperature: ${queryParams.temperature}`];

  const isFreeChlorine = queryParams.disinfectant === "free_chlorine";
  const isGiardia = queryParams.pathogen === "giardia";

  if (isFreeChlorine && isGiardia && !isValidPh(queryParams.ph))
    return [, `Invalid ph: ${queryParams.ph}`];

  if (
    isFreeChlorine &&
    isGiardia &&
    !isValidConcentration(queryParams.concentration)
  )
    return [, `Invalid concentration: ${queryParams.concentration}`];

  if (!isValidInactivationLog(queryParams["inactivation_log"], isGiardia))
    return [, `Invalid inactivation_log: ${queryParams["inactivation_log"]}`];

  const validatedparams: ValidatedParams = {
    methodology: queryParams.methodology as Methodology,
    disinfectant: queryParams.disinfectant as Disinfectant,
    pathogen: queryParams.pathogen as Pathogen,
    temperature: Number(queryParams.temperature),
    ph: Number(queryParams.ph),
    concentration: Number(queryParams.concentration),
    inactivationLog: Number(queryParams["inactivation_log"]),
  };

  return [validatedparams];
}
