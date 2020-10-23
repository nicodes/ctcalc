const express = require('express')
const cors = require('cors')
const { Pool } = require('pg')
const fs = require('fs');

const {
    queryDb,
    generateSql,
    linearInterpolate,
    bilinearInterpolate,
    trilinearInterpolate,
    fcFormula,
    validate
} = require('./utils')

const app = express()
app.use(cors())

const port = 8080
const dbConfig = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USR_API,
    password: process.env.DB_PWD_API
}
const pool = new Pool(dbConfig)

app.get('/:disinfectant/:pathogen', async (apiReq, apiRes) => {
    console.log(`GET /${apiReq.params.disinfectant}/${apiReq.params.pathogen}`, apiReq.query)

    /* validate and get some helpers*/
    const [
        {
            disinfectant,
            pathogen,
            temperature,
            inactivationLog,
            ph,
            concentration,
            isFormula
        },
        isFreeChlorine,
        validationErrors
    ] = validate(apiReq.params, apiReq.query)

    /* if validation error send 400 */
    if (Object.keys(validationErrors).length !== 0) {
        apiRes.status(400).send(validationErrors)
    }

    /* else validation is good */
    else {
        const [temperatureMin, n] = (() => isFreeChlorine ? [0.5, 5] : [1.0, 1])()
        const temperatureSanitized = temperature < temperatureMin ? temperatureMin : temperature
        const t = temperatureSanitized / n
        const temperatureLow = Math.max(temperatureMin, Math.floor(t) * n).toFixed(1)
        const temperatureHigh = Number(Math.ceil(t) * n).toFixed(1)
        const isTemperatureInterpolate = !(temperatureSanitized === temperatureMin || temperatureLow === temperatureHigh)

        const phLow = Number(Math.floor(ph / 0.5) * 0.5).toFixed(1)
        const phHigh = Number(Math.ceil(ph / 0.5) * 0.5).toFixed(1)
        const isPhInterpolate = phLow !== phHigh

        const concentrationLow = Number(Math.floor(concentration / 0.2) * 0.2).toFixed(1)
        const concentrationHigh = Number(Math.ceil(concentration / 0.2) * 0.2).toFixed(1)
        const isConcentrationInterpolate = concentrationLow !== concentrationHigh

        switch (true) {
            case isFormula:
                console.log('formula')
                return apiRes.status(200).send(
                    `${fcFormula(
                        inactivationLog,
                        temperature,
                        concentration,
                        ph
                    )}`
                )

            case isTemperatureInterpolate && isPhInterpolate && isConcentrationInterpolate: {
                console.log('trilinear')
                const sql = [
                    [temperatureLow, phLow, concentrationLow],
                    [temperatureLow, phLow, concentrationHigh],
                    [temperatureLow, phHigh, concentrationLow],
                    [temperatureLow, phHigh, concentrationHigh],
                    [temperatureHigh, phLow, concentrationLow],
                    [temperatureHigh, phLow, concentrationHigh],
                    [temperatureHigh, phHigh, concentrationLow],
                    [temperatureHigh, phHigh, concentrationHigh],
                ].map(
                    ([t, p, c]) => generateSql(disinfectant, pathogen, t, inactivationLog, p, c)
                ).join('')
                dbRes = await queryDb(pool, sql)
                return apiRes.status(200).send(
                    `${trilinearInterpolate(temperature, temperatureLow, temperatureHigh, ph, phLow, phHigh, concentration, concentrationLow, concentrationHigh, ...dbRes.map(r => Number(r.rows[0].inactivation)))}`
                )
            }

            case isTemperatureInterpolate && isPhInterpolate: {
                console.log("bilinear - temperature, ph")
                const sql = [
                    [temperatureLow, phLow],
                    [temperatureLow, phHigh],
                    [temperatureHigh, phLow],
                    [temperatureHigh, phHigh],
                ].map(
                    ([t, p]) => generateSql(disinfectant, pathogen, t, inactivationLog, p, concentration)
                ).join('')
                dbRes = await queryDb(pool, sql)
                return apiRes.status(200).send(
                    `${bilinearInterpolate(temperature, temperatureLow, temperatureHigh, ph, phLow, phHigh, ...dbRes.map(r => Number(r.rows[0].inactivation)))}`
                )
            }

            case isTemperatureInterpolate && isConcentrationInterpolate: {
                console.log("bilinear - temperature, concentration")
                const sql = [
                    [temperatureLow, concentrationLow],
                    [temperatureLow, concentrationHigh],
                    [temperatureHigh, concentrationLow],
                    [temperatureHigh, concentrationHigh],
                ].map(
                    ([t, c]) => generateSql(disinfectant, pathogen, t, inactivationLog, ph, c)
                ).join('')
                dbRes = await queryDb(pool, sql)
                return apiRes.status(200).send(
                    `${bilinearInterpolate(temperature, temperatureLow, temperatureHigh, concentration, concentrationLow, concentrationHigh, ...dbRes.map(r => Number(r.rows[0].inactivation)))}`
                )
            }

            case isPhInterpolate && isConcentrationInterpolate: {
                console.log("bilinear - ph, concentration")
                const sql = [
                    [phLow, concentrationLow],
                    [phLow, concentrationHigh],
                    [phHigh, concentrationLow],
                    [phHigh, concentrationHigh],
                ].map(
                    ([p, c]) => generateSql(disinfectant, pathogen, temperatureSanitized, inactivationLog, p, c)
                ).join('')
                dbRes = await queryDb(pool, sql)
                return apiRes.status(200).send(
                    `${bilinearInterpolate(temperature, temperatureLow, temperatureHigh, concentration, concentrationLow, concentrationHigh, ...dbRes.map(r => Number(r.rows[0].inactivation)))}`
                )
            }

            case isTemperatureInterpolate: {
                console.log("linear - temperature")
                const sql = [temperatureLow, temperatureHigh].map(
                    t => generateSql(disinfectant, pathogen, t, inactivationLog, ph, concentration)
                ).join('')
                dbRes = await queryDb(pool, sql)
                return apiRes.status(200).send(
                    `${linearInterpolate(temperature, temperatureLow, temperatureHigh, ...dbRes.map(r => Number(r.rows[0].inactivation)))}`
                )
            }

            case isPhInterpolate: {
                console.log("linear - ph")
                const sql = [phLow, phHigh].map(
                    p => generateSql(disinfectant, pathogen, temperatureSanitized, inactivationLog, p, concentration)
                ).join('')
                dbRes = await queryDb(pool, sql)
                return apiRes.status(200).send(
                    `${linearInterpolate(ph, phLow, phHigh, ...dbRes.map(r => Number(r.rows[0].inactivation)))}`
                )
            }

            case isConcentrationInterpolate: {
                console.log("linear - concentration")
                const sql = [concentrationLow, concentrationHigh].map(
                    c => generateSql(disinfectant, pathogen, temperatureSanitized, inactivationLog, ph, c)
                ).join('')
                dbRes = await queryDb(pool, sql)
                return apiRes.status(200).send(
                    `${linearInterpolate(concentration, concentrationLow, concentrationHigh, ...dbRes.map(r => Number(r.rows[0].inactivation)))}`
                )
            }

            default: {
                console.log('no interpolation')
                const sql = generateSql(disinfectant, pathogen, temperatureSanitized, inactivationLog, ph, concentration)
                dbRes = await queryDb(pool, sql)
                return apiRes.status(200).send(
                    `${dbRes.rows[0].inactivation}`
                )
            }
        }
    }
})

app.get('/now', async (apiReq, apiRes) => {
    console.log('GET /now')
    try {
        const dbRes = await queryDb(pool, 'SELECT NOW()');
        return apiRes.status(200).send(dbRes.rows)
    } catch (err) {
        console.log(err)
    }
});

app.get('/test', (req, res) => {
    res.status(200).send('test');
});

app.get('*', (req, res) => {
    res.status(404).send('Not found');
});

app.listen(port, () => console.log(`ctcalc API running`))
