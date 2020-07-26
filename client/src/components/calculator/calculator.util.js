export const disinfectantOptions = [
    { value: 'free-chlorine', label: 'Free Chlorine' },
    { value: 'chlorine-dioxide', label: 'Chlorine Dioxide' },
    { value: 'chloramine', label: 'Chloramine' },
    { value: 'ozone', label: 'Ozone' },
]

export const phOptions = Array(7).fill().map((e, i) => {
    const v = (i * 0.5) + 6
    return { value: v, label: v.toFixed(1) }
})

export const concentrationOptions = Array(14).fill().map((e, i) => {
    const v = (i * 0.2) + 0.4
    return { value: v, label: v.toFixed(1) }
})

export const giardiaLogOptions = new Array(6).fill().map((e, i) => {
    const v = (i + 1) * 0.5
    return { value: v, label: v.toFixed(1) }
})

export const virusLogOptions = Array(3).fill().map((e, i) => {
    const v = i + 2
    return { value: v, label: v.toFixed(1) }
})
