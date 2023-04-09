import inactivations from "../data/inactivations.json";
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
  console.log(
    "lookup:",
    disinfectant,
    pathogen,
    temperature,
    concentration,
    ph,
    inactivationLog
  );
  if (disinfectant === "free_chlorine" && pathogen === "giardia")
    return (inactivations as any)[disinfectant][pathogen][
      temperature.toFixed(1)
    ][concentration!.toFixed(1)][ph!.toFixed(1)][inactivationLog.toFixed(1)];

  return (inactivations as any)[disinfectant][pathogen][temperature.toFixed(1)][
    inactivationLog.toFixed(1)
  ];
}
