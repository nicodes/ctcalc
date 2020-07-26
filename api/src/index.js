const express = require('express')
const cors = require('cors')
const { Pool } = require('pg')
const fs = require('fs');

const { interpolate } = require('./utils')
const validate = require('./validate');

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

app.get('/:disinfectant/:pathogen', (apiReq, apiRes) => {
    console.log(`GET /${apiReq.params.disinfectant}/${apiReq.params.pathogen}`, apiReq.query)

    const { disinfectant, pathogen } = apiReq.params
    const temperature = apiReq.query.temperature
    const inactivationLog = apiReq.query['inactivation-log']
    const ph = apiReq.query.ph
    const concentration = apiReq.query.concentration

    const validationErrors = validate(disinfectant, pathogen, temperature, inactivationLog, ph, concentration)

    if (Object.keys(validationErrors).length !== 0) {
        apiRes.status(400).send(validationErrors)
    } else {
        const isFreeChlorine = disinfectant === 'free-chlorine'
        const sanitizedDisinfectant = disinfectant.replace('-', '_')

        const temperatureMin = isFreeChlorine ? 0.5 : 1
        const isInterpolate = (temperatureMin < temperature)
            && ((temperature % (isFreeChlorine ? 5 : 1)) !== 0);

        const [temperatureHigh, temperatureLow] = (() => {
            if (!isInterpolate) return []
            const [c, f] = (() => isFreeChlorine
                ? [Math.ceil(temperature / 5) * 5, Math.floor(temperature / 5) * 5]
                : [Math.ceil(temperature), Math.floor(temperature)])()
            return [c, f]
        })()

        const sql = (() => {
            const a = isInterpolate
                ? [temperatureHigh, temperatureLow]
                : [temperature]
            return a.map(t =>
                `SELECT inactivation FROM ${sanitizedDisinfectant}.${pathogen}`
                + ` WHERE temperature=${t < temperatureMin ? temperatureMin : t} AND inactivation_log = ${inactivationLog}`
                + `${isFreeChlorine && pathogen === 'giardia' ? ` AND ph=${ph} AND concentration=${concentration}` : ''} `
                + ';'
            ).join('')
        })();

        (async () => {
            try {
                const dbRes = await pool.query(sql);
                const inactivation = isInterpolate
                    ? interpolate(temperature, temperatureLow, Number(dbRes[1].rows[0].inactivation), temperatureHigh, Number(dbRes[0].rows[0].inactivation))
                    : Number(dbRes.rows[0].inactivation)
                apiRes.status(200).send(`${inactivation}`)
            } catch (err) {
                console.log(err)
            }
        })()
    }
})

app.get('/now', async function (apiReq, apiRes) {
    console.log('GET /now')
    try {
        const dbRes = await pool.query('SELECT NOW();');
        apiRes.status(200).send(dbRes.rows)
    } catch (err) {
        console.log(err)
    }
});

app.get('/test', function (req, res) {
    res.status(200).send('test');
});

app.get('*', function (req, res) {
    res.status(404).send('Not found');
});

app.listen(port, () => console.log(`ctcalc API running`))
