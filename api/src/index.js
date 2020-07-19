const express = require('express')
const cors = require('cors')
const { Pool } = require('pg')
const fs = require('fs');

const { interpolationBounds, interpolate } = require('./utils')
const { validate, validValues } = require('./validate')

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
const pool = new Pool(
    //     ENV === 'prod' ? {
    //     ...dbConfig, ssl: {
    //         rejectUnauthorized: false,
    //         ca: fs.readFileSync('certs/ca-certificate.crt').toString()
    //     }
    // } : 
    dbConfig)

app.get('/valid-values', (req, res) => {
    console.log('GET /valid-values')
    res.status(200).send(validValues);
})

app.get('/:disinfectant/:pathogen', (apiReq, apiRes) => {
    console.log(`GET /${apiReq.params.disinfectant}/${apiReq.params.pathogen}`, apiReq.query)

    // const disinfectant = apiReq.params.disinfectant.replace('_', '-')
    const { disinfectant, pathogen } = apiReq.params
    const temperature = Number(apiReq.query.temperature)
    const logInactivation = Number(apiReq.query['log-inactivation'])
    // const ph = Number(apiReq.query.ph)
    // const concentration = Number(apiReq.query.concentration)

    const validationErrors = validate(disinfectant, pathogen, temperature, logInactivation)

    /* if no validation errors run sql */
    if (Object.keys(validationErrors).length === 0) {
        const validTemperatures = validValues.validTemperatures[disinfectant][pathogen]
        const [temperatureLow, temperatureHigh] = interpolationBounds(temperature, validTemperatures)
        const sql = `SELECT inactivation FROM ${disinfectant}.${pathogen} WHERE temperature = ${temperatureLow} AND log_inactivation = ${logInactivation};`
            + `SELECT inactivation FROM ${disinfectant}.${pathogen} WHERE temperature = ${temperatureHigh} AND log_inactivation = ${logInactivation};`;
        (async () => {
            try {
                const dbRes = await pool.query(sql);
                const inactivationLow = Number(dbRes[0].rows[0].inactivation)
                const inactivationHigh = Number(dbRes[1].rows[0].inactivation)
                const inactivation = interpolate(temperatureLow, temperature, temperatureHigh, inactivationLow, inactivationHigh)
                apiRes.status(200).send({ inactivation })
            } catch (err) {
                console.log(err)
            }
        })()
    } else {
        apiRes.status(400).send(validationErrors)
    }
})

app.get('/test', function (req, res) {
    res.status(200).send('test ctcalc api');
});

app.get('*', function (req, res) {
    res.status(404).send('Not found');
});

app.listen(port, () => console.log(`ctcalc API running`))
