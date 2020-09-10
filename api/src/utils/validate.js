const validate = (params, query) => {
    const disinfectant = params.disinfectant
    const pathogen = params.pathogen
    const temperature = query.temperature
    const ph = query.ph
    const concentration = query.concentration
    const inactivationLog = query['inactivation-log']
    const isFormula = query.formula
    const err = []

    /* validate */
    !['free-chlorine', 'chlorine-dioxide', 'chloramine', 'ozone'].includes(disinfectant) && err.push(`Invalid disinfectant: ${disinfectant}`)
    !['giardia', 'virus'].includes(pathogen) && err.push(`Invalid pathogen: ${pathogen}`);
    (temperature <= 0 || 25 < temperature) && err.push(`Invalid temperature: ${temperature}`)
    const isFreeChlorine = disinfectant === 'free-chlorine'

    a = pathogen === 'giardia'
        ? Array(6).fill().map((e, i) => ((i + 1) * 0.5).toFixed(1))
        : Array(3).fill().map((e, i) => (i + 2).toFixed(1))
    !a.includes(inactivationLog) && err.push(`Invalid inactivation-log: ${inactivationLog}`);

    (ph < 6 || 9 < ph) && err.push(`Invalid ph: ${ph}`);
    (concentration <= 0 || 3 < concentration) && err.push(`Invalid concentration: ${concentration}`)
    isFormula === true && !isFreeChlorine && err.push(`Invalid disinfectant for formula value: ${isFormula}, disinfectant type must be "free-chlorine"`)

    return [{ disinfectant: disinfectant.replace('-', '_'), pathogen, temperature, inactivationLog, ph, concentration, isFormula }, isFreeChlorine, err]
}

module.exports = validate
