function getValidInputs(disinfectant, pathogen) {
    let validTemperatures;
    let validLogInactivations;
    switch (true) {
        case (disinfectant === 'chloramine' && pathogen === 'giardia'):
            validTemperatures = [1, 5, 10, 15, 20, 25]
            validLogInactivations = [0.5, 1.0, 1.5, 2.0, 2.5, 3.0]
            break;
        case (disinfectant === 'chloramine' && pathogen === 'virus'):
            validTemperatures = [0, 5, 10, 15, 20, 25]
            validLogInactivations = [2, 3, 4]
            break;
        case (disinfectant === 'chlorine-dioxide' && pathogen === 'giardia'):
            validTemperatures = [1, 5, 10, 15, 20, 25]
            validLogInactivations = [0.5, 1.0, 1.5, 2.0, 2.5, 3.0]
            break;
        case (disinfectant === 'chlorine-dioxide' && pathogen === 'virus'):
            validTemperatures = [1, 5, 10, 15, 20, 25]
            validLogInactivations = [2, 3, 4]
            break;
        case (disinfectant === 'ozone' && pathogen === 'giardia'):
            validTemperatures = [1, 5, 10, 15, 20, 25]
            validLogInactivations = [0.5, 1.0, 1.5, 2.0, 2.5, 3.0]
            break;
        case (disinfectant === 'ozone' && pathogen === 'virus'):
            validTemperatures = [1, 5, 10, 15, 20, 25]
            validLogInactivations = [2, 3, 4]
            break;
        default:
            break;
    }
    return { validTemperatures, validLogInactivations }
}

function validate(disinfectant, pathogen, temperature, logInactivation) {
    const errors = []
    const validDisinfectants = ['chloramine', 'chlorine-dioxide', 'ozone']
    const validPathogens = ['giardia', 'virus']
    if (!validDisinfectants.includes(disinfectant)) errors.push({ parameter: 'disinfectant', value: disinfectant, validInputs: validDisinfectants })
    if (!validPathogens.includes(pathogen)) errors.push({ parameter: 'pathogen', value: pathogen, validInputs: validPathogens })
    if (errors.length === 0) {
        const { validTemperatures, validLogInactivations } = getValidInputs(disinfectant, pathogen)
        const temperatureMin = Math.min(...validTemperatures)
        const temperatureMax = Math.max(...validTemperatures)
        if (temperature < temperatureMin || temperatureMax < temperature) errors.push({ parameter: 'temperature', value: temperature, validInputs: `${temperatureMin}, ..., ${temperatureMax}` })
        if (!validLogInactivations.includes(logInactivation)) errors.push({ parameter: 'log-inactivation', value: logInactivation, validInputs: validLogInactivations })
    }
    return errors;
}

module.exports = {
    getValidInputs,
    validate
}
