const methodologies = ["round", "interpolate", "formula"] as const;
export type Methodology = (typeof methodologies)[number];
export function isValidMethodology(methodology: any) {
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
export function isValidDisinfectant(disinfectant: any) {
  if (typeof disinfectant !== "string") return false;
  return disinfectants.includes(disinfectant as Disinfectant);
}

const pathogens = ["giardia", "virus"] as const;
export type Pathogen = (typeof pathogens)[number];
export function isValidPathogen(pathogen: any) {
  if (typeof pathogen !== "string") return false;
  return pathogens.includes(pathogen as Pathogen);
}

export function isValidTemperature(temperature: any) {
  if (typeof temperature !== "number") return false;
  return 0 < temperature && temperature <= 25;
}

export function isValidPh(ph: any) {
  if (typeof ph !== "number") return false;
  return 6 <= ph && ph <= 9;
}

export function isValidConcentration(concentration: any) {
  if (typeof concentration !== "number") return false;
  return 0 < concentration && concentration <= 3;
}

// TODO should these be strings?
export const inactivationLogs = [2, 3, 4];
export const giardiaInactivationLogs = [0.5, 1, 1.5, 2, 2, 3];
export function isValidInactivationLog(
  inactivationLog: any,
  isGiardia?: boolean
) {
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
export function newValidate(
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

  if (!isValidPh(queryParams.ph)) return [, `Invalid ph: ${queryParams.ph}`];

  if (!isValidConcentration(queryParams.concentration))
    return [, `Invalid concentration: ${queryParams.concentration}`];

  if (
    !isValidInactivationLog(
      queryParams["inactivation_log"],
      queryParams.pathogen === "giardia"
    )
  )
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

/////////////

export function validate(queryParams: any) {
  const err = [];

  const disinfectant = String(queryParams.disinfectant);
  if (!isValidDisinfectant(queryParams.disinfectant))
    err.push(`Invalid disinfectant: ${queryParams.disinfectant}`);

  const pathogen = String(queryParams.pathogen);
  if (!isValidPathogen(pathogen)) err.push(`Invalid pathogen: ${pathogen}`);

  const temperature = Number(queryParams.temperature);
  if (isValidTemperature(temperature))
    err.push(`Invalid temperature: ${temperature}`);

  const ph = queryParams.ph;
  const concentration = queryParams.concentration;
  const inactivationLog = queryParams["inactivation_log"];

  const isFormula = queryParams.formula === "true";
  const isRound = queryParams.round;
  //   const err = [];

  /* validate */
  //   !["free-chlorine", "chlorine-dioxide", "chloramine", "ozone"].includes(
  //     disinfectant
  //   ) && err.push(`Invalid disinfectant: ${disinfectant}`);

  //   !["giardia", "virus"].includes(pathogen) &&
  //     err.push(`Invalid pathogen: ${pathogen}`);

  (temperature <= 0 || 25 < temperature) &&
    err.push(`Invalid temperature: ${temperature}`);
  const isFreeChlorine = disinfectant === "free-chlorine";

  const a =
    pathogen === "giardia"
      ? Array(6)
          .fill(undefined)
          .map((e, i) => ((i + 1) * 0.5).toFixed(1))
      : Array(3)
          .fill(undefined)
          .map((e, i) => (i + 2).toFixed(1));
  !a.includes(inactivationLog) &&
    err.push(`Invalid inactivation_log: ${inactivationLog}`);

  (ph < 6 || 9 < ph) && err.push(`Invalid ph: ${ph}`);
  (concentration <= 0 || 3 < concentration) &&
    err.push(`Invalid concentration: ${concentration}`);
  isFormula === true &&
    !isFreeChlorine &&
    err.push(
      `Invalid disinfectant for formula value: ${isFormula}, disinfectant type must be "free-chlorine"`
    );

  return [
    isRound
      ? {
          disinfectant: disinfectant.replace("-", "_"),
          pathogen,
          temperature: isFreeChlorine
            ? Math.max(Math.floor(temperature / 5) * 5, 0.5)
            : Math.floor(temperature),
          inactivationLog,
          ph: Math.ceil(ph * 2) / 2,
          concentration: Math.max(Math.ceil(concentration * 5) / 5, 0.4),
          isFormula,
          isRound,
        }
      : {
          disinfectant: disinfectant.replace("-", "_"),
          pathogen,
          temperature,
          inactivationLog,
          ph,
          concentration,
          isFormula,
          isRound,
        },
    isFreeChlorine,
    err,
  ];
}
