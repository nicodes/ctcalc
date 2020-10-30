export const disinfectantOptions = [
    { value: 'free-chlorine', label: 'Free Chlorine' },
    { value: 'chlorine-dioxide', label: 'Chlorine Dioxide' },
    { value: 'chloramine', label: 'Chloramine' },
    { value: 'ozone', label: 'Ozone' }
]

export const phOptions = Array(7).fill().map((e, i) => {
    const v = ((i * 0.5) + 6).toFixed(1)
    return { value: v, label: v }
})

export const concentrationOptions = Array(14).fill().map((e, i) => {
    const v = ((i * 0.2) + 0.4).toFixed(1)
    return { value: v, label: v }
})

export const giardiaLogOptions = Array(6).fill().map((e, i) => {
    const v = ((i + 1) * 0.5).toFixed(1)
    return { value: v, label: v }
})

export const virusLogOptions = Array(3).fill().map((e, i) => {
    const v = (i + 2).toFixed(1)
    return { value: v, label: v }
})
