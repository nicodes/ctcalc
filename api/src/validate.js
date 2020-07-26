const disinfectantOptions = ['chloramine', 'chlorine-dioxide', 'free-chlorine', 'ozone']
const pathogenOptions = ['giardia', 'virus']
const phOptions = Array(7).fill().map((e, i) => ((i * 0.5) + 6).toFixed(1))
const concentrationOptions = Array(14).fill().map((e, i) => ((i * 0.2) + 0.4).toFixed(1))
const giardiaLogOptions = Array(6).fill().map((e, i) => ((i + 1) * 0.5).toFixed(1))
const virusLogOptions = Array(3).fill().map((e, i) => (i + 2).toFixed(1))

function validate(disinfectant, pathogen, temperature, inactivationLog, ph, concentration) {
    const errors = {}

    if (!disinfectantOptions.includes(disinfectant))
        errors.disinfectant = `Invalid value: ${disinfectant}. Acceptable values: ${disinfectantOptions}`

    if (!pathogenOptions.includes(pathogen))
        errors.pathogen = `Invalid value: ${pathogen}. Acceptable values: ${pathogenOptions}`

    if (Object.keys(errors).length === 0) {
        const isFreeChlorine = disinfectant === 'free-chlorine'
        const isGiardia = pathogen === 'giardia'

        if (temperature < 0 || 25 < temperature)
            errors.temperature = `Invalid value: ${temperature}. Acceptable values: [0 - 25]`

        const o = isGiardia ? giardiaLogOptions : virusLogOptions
        if (!o.includes(inactivationLog))
            errors.inactivationLog = `Invalid value: ${inactivationLog}. Acceptable values: ${o}`

        if (isFreeChlorine && isGiardia) {
            if (!phOptions.includes(ph))
                errors.ph = `Invalid value: ${ph}. Acceptable values: ${phOptions}`

            if (!concentrationOptions.includes(concentration))
                errors.concentration = `Invalid value: ${concentration}. Acceptable values: ${concentrationOptions}`
        }
    }
    return errors;
}

module.exports = validate

