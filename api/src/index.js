const express = require('express')
const cors = require('cors')
const { Pool } = require('pg')
const fs = require('fs');

const { interpolate } = require('./utils')
const { validations, validate } = require('./validate')

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
    res.status(200).send(validations);
})

app.get('/:disinfectant/:pathogen', (apiReq, apiRes) => {
    console.log(`GET /${apiReq.params.disinfectant}/${apiReq.params.pathogen}`, apiReq.query)

    const { disinfectant, pathogen } = apiReq.params
    const temperature = Number(apiReq.query.temperature)
    const inactivationLog = Number(apiReq.query['inactivation-log'])
    // const ph = Number(apiReq.query.ph)
    // const concentration = Number(apiReq.query.concentration)

    const validationErrors = validate(disinfectant, pathogen, temperature, inactivationLog)

    if (Object.keys(validationErrors).length !== 0) {
        apiRes.status(400).send(validationErrors)
    } else {
        const interpolateFlag = temperature % 1 !== 0
        const sql = (function () {
            if (interpolateFlag) {
                return `SELECT inactivation FROM ${disinfectant}.${pathogen} WHERE temperature = ${Math.ceil(temperature)} AND inactivation_log = ${inactivationLog};`
                    + `SELECT inactivation FROM ${disinfectant}.${pathogen} WHERE temperature = ${Math.floor(temperature)} AND inactivation_log = ${inactivationLog};`
            }
            return `SELECT inactivation FROM ${disinfectant}.${pathogen} WHERE temperature = ${temperature} AND inactivation_log = ${inactivationLog};`
        })();

        (async () => {
            try {
                const dbRes = await pool.query(sql);
                const inactivation = (function () {
                    if (interpolateFlag) {
                        const inactivationHigh = Number(dbRes[0].rows[0].inactivation)
                        const inactivationLow = Number(dbRes[1].rows[0].inactivation)
                        return interpolate(temperature, Math.floor(temperature), inactivationLow, Math.ceil(temperature), inactivationHigh)
                    }
                    return Number(dbRes.rows[0].inactivation)
                })();
                apiRes.status(200).send({ inactivation })
            } catch (err) {
                console.log(err)
            }
        })()
    }
})

app.get('/now', async function (apiReq, apiRes) {
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
