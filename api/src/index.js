const express = require('express')
const cors = require('cors')
const { Pool } = require('pg')
const fs = require('fs');

const { linearInterpolate, bilinearInterpolate, trilinearInterpolate, fcFormula } = require('./utils')
// const validate = require('./validate');

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

// TODO move to utils
const queryDb = async (sql) => {
    try {
        const dbRes = await pool.query(sql);
        return dbRes
    } catch (err) {
        console.log(err)
    }
}

// TODO move to utils
const generateSql = (
    disinfectant,
    pathogen,
    temperature,
    inactivationLog,
    ph,
    concentration
) => `SELECT inactivation FROM ${disinfectant}.${pathogen} WHERE temperature=${temperature} AND inactivation_log=${inactivationLog}${ph && concentration ? ` AND ph=${ph} AND concentration=${concentration}` : ''};`

app.get('/:disinfectant/:pathogen', async (apiReq, apiRes) => {
    console.log(`GET /${apiReq.params.disinfectant}/${apiReq.params.pathogen}`, apiReq.query)

    const disinfectant = String(apiReq.params.disinfectant)
    const pathogen = String(apiReq.params.pathogen)
    const temperature = Number(apiReq.query.temperature)
    const inactivationLog = Number(apiReq.query['inactivation-log'])
    const ph = Number(apiReq.query.ph)
    const concentration = Number(apiReq.query.concentration)
    const isFormula = Number(apiReq.query.formula)

    // TODO add back validation
    const validationErrors = [] // validate(disinfectant, pathogen, temperature, inactivationLog, ph, concentration)

    if (Object.keys(validationErrors).length !== 0) {
        apiRes.status(400).send(validationErrors)
    } else {
        const disinfectantSanitized = disinfectant.replace('-', '_')
        const [isFreeChlorine, temperatureMin, n] = (
            () => disinfectant === 'free-chlorine'
                ? [true, 0.5, 5]
                : [false, 1.0, 1]
        )()
        const temperatureSanitized = Math.max(temperatureMin, temperature)
        const [temperatureLow, temperatureHigh] = (
            () => [
                Math.max(temperatureMin, Math.floor(temperatureSanitized / n) * n).toFixed(1),
                Number(Math.ceil(temperatureSanitized / n) * n).toFixed(1)
            ]
        )()
        const isTemperatureInterpolate = temperatureSanitized !== temperatureMin && temperatureLow !== temperatureHigh

        // 3 special cases:
        // * isForuma
        // * trilinear interpolation
        // * bilinear (temperature, ph)
        // * bilinear (temperature, concentration)
        // * bilinear (ph, concentration)
        // * linear (ph)
        // * linear (concentration)
        if (isFreeChlorine && pathogen === 'giardia') {
            // * isForuma
            if (isFormula)
                return apiRes.status(200).send(
                    `${fcFormula(
                        inactivationLog,
                        temperature,
                        concentration,
                        ph
                    )}`
                )

            const phLow = Number(Math.floor(ph / 0.5) * 0.5).toFixed(1)
            const phHigh = Number(Math.ceil(ph / 0.5) * 0.5).toFixed(1)
            const concentrationLow = Number(Math.floor(concentration / 0.2) * 0.2).toFixed(1)
            const concentrationHigh = Number(Math.ceil(concentration / 0.2) * 0.2).toFixed(1)
            const isPhInterpolate = phLow !== phHigh
            const isConcentrationInterpolate = concentrationLow !== concentrationHigh

            if (isPhInterpolate || isConcentrationInterpolate) {
                // * trilinear interpolation
                if (isTemperatureInterpolate && isPhInterpolate && isConcentrationInterpolate) {
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
                        ([t, p, c]) => generateSql(disinfectantSanitized, pathogen, t, inactivationLog, p, c)
                    ).join('')

                    dbRes = await queryDb(sql)
                    return apiRes.status(200).send(
                        `${trilinearInterpolate(temperature, temperatureLow, temperatureHigh, ph, phLow, phHigh, concentration, concentrationLow, concentrationHigh, ...dbRes.map(r => Number(r.rows[0].inactivation)))}`
                    )
                }

                // * bilinear (temperature, ph)
                if (isTemperatureInterpolate && isPhInterpolate) {
                    console.log('bilinear (temperature, ph)')
                    const sql = [
                        [temperatureLow, phLow],
                        [temperatureLow, phHigh],
                        [temperatureHigh, phLow],
                        [temperatureHigh, phHigh],
                    ].map(
                        ([t, p]) => generateSql(disinfectantSanitized, pathogen, t, inactivationLog, p, concentration)
                    ).join('')

                    dbRes = await queryDb(sql)
                    return apiRes.status(200).send(
                        `${bilinearInterpolate(temperature, temperatureLow, temperatureHigh, ph, phLow, phHigh, ...dbRes.map(r => Number(r.rows[0].inactivation)))}`
                    )
                }

                // * bilinear (temperature, concentration)
                if (isTemperatureInterpolate && isConcentrationInterpolate) {
                    console.log('bilinear (temperature, concentration)')
                    const sql = [
                        [temperatureLow, concentrationLow],
                        [temperatureLow, concentrationHigh],
                        [temperatureHigh, concentrationLow],
                        [temperatureHigh, concentrationHigh],
                    ].map(
                        ([t, c]) => generateSql(disinfectantSanitized, pathogen, t, inactivationLog, ph, c)
                    ).join('')

                    dbRes = await queryDb(sql)
                    return apiRes.status(200).send(
                        `${bilinearInterpolate(temperature, temperatureLow, temperatureHigh, concentration, concentrationLow, concentrationHigh, ...dbRes.map(r => Number(r.rows[0].inactivation)))}`
                    )
                }

                // * bilinear (ph, concentration)
                if (isPhInterpolate && isConcentrationInterpolate) {
                    console.log('bilinear (ph, concentration)')
                    const sql = [
                        [phLow, concentrationLow],
                        [phLow, concentrationHigh],
                        [phHigh, concentrationLow],
                        [phHigh, concentrationHigh],
                    ].map(
                        ([p, c]) => generateSql(disinfectantSanitized, pathogen, temperatureSanitized, inactivationLog, p, c)
                    ).join('')

                    dbRes = await queryDb(sql)
                    return apiRes.status(200).send(
                        `${bilinearInterpolate(temperature, temperatureLow, temperatureHigh, concentration, concentrationLow, concentrationHigh, ...dbRes.map(r => Number(r.rows[0].inactivation)))}`
                    )
                }

                // * linear (ph)
                if (isPhInterpolate) {
                    console.log('linear (ph)')
                    const sql = [phLow, phHigh].map(
                        p => generateSql(disinfectantSanitized, pathogen, temperatureSanitized, inactivationLog, p, concentration)
                    ).join('')

                    dbRes = await queryDb(sql)
                    return apiRes.status(200).send(
                        `${linearInterpolate(ph, phLow, phHigh, ...dbRes.map(r => Number(r.rows[0].inactivation)))}`
                    )
                }

                // * linear (concentration)
                console.log('linear (concentration)')
                const sql = [concentrationLow, concentrationHigh].map(
                    c => generateSql(disinfectantSanitized, pathogen, temperatureSanitized, inactivationLog, ph, c)
                ).join('')

                dbRes = await queryDb(sql)
                return apiRes.status(200).send(
                    `${linearInterpolate(concentration, concentrationLow, concentrationHigh, ...dbRes.map(r => Number(r.rows[0].inactivation)))}`
                )
            } // END if (isPhInterpolate || isConcentrationInterpolate)
        } // END if (isFreeChlorine && pathogen === 'giardia')

        // linear (temperature)
        if (isTemperatureInterpolate) {
            console.log('linear (temperature)')
            const sql = [temperatureLow, temperatureHigh].map(
                t => generateSql(disinfectantSanitized, pathogen, t, inactivationLog, ph, concentration)
            ).join('')

            dbRes = await queryDb(sql)
            return apiRes.status(200).send(
                `${linearInterpolate(temperature, temperatureLow, temperatureHigh, ...dbRes.map(r => Number(r.rows[0].inactivation)))}`
            )
        }

        // no interpolation 
        console.log('no interpolation')
        const sql = generateSql(disinfectantSanitized, pathogen, temperatureSanitized, inactivationLog, ph, concentration)

        dbRes = await queryDb(sql)
        return apiRes.status(200).send(
            `${dbRes.rows[0].inactivation}`
        )
    }
})

app.get('/now', async (apiReq, apiRes) => {
    console.log('GET /now')
    try {
        const dbRes = await pool.query('SELECT NOW();');
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
