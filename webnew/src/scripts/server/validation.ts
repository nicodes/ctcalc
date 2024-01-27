const methodologies = ["round", "interpolate", "formula"];

const disinfectants = [
  "free_chlorine",
  "chlorine_dioxide",
  "chloramine",
  "ozone",
];

const pathogens = ["giardia", "virus"];

const inactivationLogs = [2, 3, 4];

const giardiaInactivationLogs = [0.5, 1, 1.5, 2, 2.5, 3];

function isValidMethodology(methodology: any) {
  if (typeof methodology !== "string") return false;
  return methodologies.includes(methodology);
}

function isValidDisinfectant(disinfectant: any) {
  if (typeof disinfectant !== "string") return false;
  return disinfectants.includes(disinfectant);
}

function isValidPathogen(pathogen: any) {
  if (typeof pathogen !== "string") return false;
  return pathogens.includes(pathogen);
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

function isValidLogInactivation(inactivationLog: any, isGiardia?: boolean) {
  console.log(inactivationLog, isGiardia);
  if (typeof inactivationLog !== "number") return false;
  return (isGiardia ? giardiaInactivationLogs : inactivationLogs).includes(
    inactivationLog
  );
}

export function validate(formData: any) {
  // const methodology = formData.get("methodology");
  // if (!isValidMethodology(methodology)) return { error: "Invalid methodology" };

  const disinfectant = formData.get("disinfectant");
  if (!isValidDisinfectant(disinfectant))
    return { error: "Invalid disinfectant" };

  const pathogen = formData.get("pathogen");
  if (!isValidPathogen(pathogen)) return { error: "Invalid pathogen" };

  const temperature = Number(formData.get("temperature"));
  if (!isValidTemperature(temperature)) return { error: "Invalid temperature" };

  const ph = Number(formData.get("ph"));
  if (!isValidPh(ph)) return { error: "Invalid ph" };

  const concentration = Number(formData.get("concentration"));
  if (disinfectant === "chlorine" && !isValidConcentration(concentration))
    return { error: "Invalid concentration" };

  const inactivationLog = Number(formData.get("log-inactivation"));
  if (!isValidLogInactivation(inactivationLog, pathogen === "giardia"))
    return { error: "Invalid log-inactivation" };

  return {
    validatedFormData: {
      // methodology,
      disinfectant,
      pathogen,
      temperature,
      ph,
      concentration,
      inactivationLog,
    },
  };
}
