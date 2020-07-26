
const validations = {
    meta: {
        disinfectants: ['chloramine', 'chlorine-dioxide', 'free-chlorine', 'ozone'],
        pathogens: ['giardia', 'virus']
    },
    chloramine: {
        giardia: {
            temperatures: {
                min: 1,
                max: 25
            },
            inactivationLogs: [0.5, 1.0, 1.5, 2.0, 2.5, 3.0]
        },
        virus: {
            temperatures: {
                min: 1,
                max: 25
            },
            inactivationLogs: [2, 3, 4]
        }
    },
    'chlorine-dioxide': {
        giardia: {
            temperatures: {
                min: 1,
                max: 25
            },
            inactivationLogs: [0.5, 1.0, 1.5, 2.0, 2.5, 3.0]
        },
        virus: {
            temperatures: {
                min: 1,
                max: 25
            },
            inactivationLogs: [2, 3, 4]
        }
    },
    'free-chlorine': {
        giardia: {
            temperatures: {
                min: 0.5,
                max: 25
            },
            inactivationLogs: [0.5, 1.0, 1.5, 2.0, 2.5, 3.0]
        },
        virus: {
            temperatures: {
                min: 0.5,
                max: 25
            },
            inactivationLogs: [2, 3, 4]
        }
    },
    ozone: {
        giardia: {
            temperatures: {
                min: 1,
                max: 25
            },
            inactivationLogs: [0.5, 1.0, 1.5, 2.0, 2.5, 3.0]
        },
        virus: {
            temperatures: {
                min: 1,
                max: 25
            },
            inactivationLogs: [2, 3, 4]
        }
    }
}

function validate(disinfectant, pathogen, temperature, inactivationLog) {
    const errors = {}

    const validDisinfectants = validations.meta.disinfectants
    if (!validDisinfectants.includes(disinfectant)) errors.disinfectant = `Invalid value: ${disinfectant}. Acceptable values: ${validDisinfectants}`

    const validPathogens = validations.meta.pathogens
    if (!validPathogens.includes(pathogen)) errors.pathogen = `Invalid value: ${pathogen}. Acceptable values: ${validPathogens}`

    if (Object.keys(errors).length === 0) {
        const { min, max } = validations[disinfectant][pathogen].temperatures
        if (temperature < min || max < temperature)
            errors.temperature = `Invalid value: ${pathogen}. Acceptable values range ${min}-${max}`

        const validInactivationLogs = validations[disinfectant][pathogen].inactivationLogs
        if (!validInactivationLogs.includes(inactivationLog))
            errors.inactivationLog = `Invalid value: ${inactivationLog}. Acceptable values: ${validInactivationLogs}`
    }
    return errors;
}

module.exports = {
    validations,
    validate
}
