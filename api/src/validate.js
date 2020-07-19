const validValues = {
    validDisinfectants: ['chloramine', 'chlorine-dioxide', 'ozone'],
    validPathogens: ['giardia', 'virus'],
    validTemperatures: {
        chloramine: {
            giardia: [1, 5, 10, 15, 20, 25],
            virus: [0, 5, 10, 15, 20, 25]
        },
        'chlorine-dioxide': {
            giardia: [1, 5, 10, 15, 20, 25],
            virus: [1, 5, 10, 15, 20, 25]
        },
        ozone: {
            giardia: [1, 5, 10, 15, 20, 25],
            virus: [1, 5, 10, 15, 20, 25]
        }
    },
    validLogInactivations: {
        chloramine: {
            giardia: [0.5, 1.0, 1.5, 2.0, 2.5, 3.0],
            virus: [2, 3, 4]
        },
        'chlorine-dioxide': {
            giardia: [0.5, 1.0, 1.5, 2.0, 2.5, 3.0],
            virus: [2, 3, 4]
        },
        ozone: {
            giardia: [0.5, 1.0, 1.5, 2.0, 2.5, 3.0],
            virus: [2, 3, 4]
        }
    }
}

function validate(disinfectant, pathogen, temperature, logInactivation) {
    const errors = {}
    const validDisinfectants = validValues.validDisinfectants
    const validPathogens = validValues.validPathogens

    if (!validDisinfectants.includes(disinfectant)) errors.disinfectant = { value: disinfectant, validValues: validDisinfectants.toString() }
    if (!validPathogens.includes(pathogen)) errors.pathogen = { value: pathogen, validValues: validPathogens.toString() }
    if (Object.keys(errors).length === 0) {
        const validTemperatures = validValues.validTemperatures[disinfectant][pathogen]
        const validLogInactivations = validValues.validLogInactivations[disinfectant][pathogen]
        const temperatureMin = Math.min(...validTemperatures)
        const temperatureMax = Math.max(...validTemperatures)
        if (temperature < temperatureMin || temperatureMax < temperature) errors.temperature = { value: temperature, validValues: `${temperatureMin}, ..., ${temperatureMax}` }
        if (!validLogInactivations.includes(logInactivation)) errors.logInactivation = { value: logInactivation, validValues: validLogInactivations }
    }
    return errors;
}

module.exports = {
    validValues,
    validate
}
