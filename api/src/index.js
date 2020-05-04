const express = require('express')
const cors = require('cors')
const { Pool } = require('pg')
const fs = require('fs');

const {
    ENV,
    HOST,
    PORT,
    DB_HOST,
    DB_PORT,
    DB_NAME,
    DB_USER,
    DB_PWD
} = process.env

const app = express()
app.use(cors())

const dbConfig = {
    host: DB_HOST,
    port: DB_PORT,
    database: DB_NAME,
    user: DB_USER,
    password: DB_PWD
}
const pool = new Pool(
    //     ENV === 'prod' ? {
    //     ...dbConfig, ssl: {
    //         rejectUnauthorized: false,
    //         ca: fs.readFileSync('certs/ca-certificate.crt').toString()
    //     }
    // } : 
    dbConfig)

app.get('/:pathogen/:disinfectant', (apiReq, apiRes) => {
    const { pathogen, disinfectant } = apiReq.params
    console.log(`GET /${pathogen}/${disinfectant}`, apiReq.query)

    const temperature = Number(apiReq.query.temperature)
    const logInactivation = Number(apiReq.query.logInactivation)
    const ph = Number(apiReq.query.ph)
    const concentration = Number(apiReq.query.concentration)

    /* param validation */
    const validPathogens = ['giardia', 'virus']
    const validDisinfectants = ['chloramine', 'chlorine-dioxide', 'free-chlorine', 'ozone']
    let validTemperatures, validLogInactivations
    const validationErrors = {}

    if (pathogen === 'giardia') {
        if (disinfectant === 'chloramine' || disinfectant === 'chlorine-dioxide' || disinfectant === 'ozone') {
            validTemperatures = [1, 5, 10, 15, 20, 25]
            validLogInactivations = [0.5, 1.0, 1.5, 2.0, 2.5, 3.0]
        }
        else if (disinfectant === 'free-chlorine') {
            validTemperatures = [0.5, 5.0, 10.0, 15.0, 20.0, 25.0]
            validLogInactivations = [0.5, 1.0, 1.5, 2.0, 2.5, 3.0]
            const validPhs = [6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0]
            const validConcentrations = [0.4, 0.6, 0.8, 1.0, 1.2, 1.4, 1.6, 1.8, 2.0, 2.2, 2.4, 2.6, 2.8, 3.0]
            if (!validPhs.includes(ph))
                validationErrors.ph = { invalidValue: ph, validValues: validPhs }
            if (!validConcentrations.includes(concentration))
                validationErrors.concentration = { invalidValue: concentration, validValues: validConcentrations }
        }
        else validationErrors.disinfectant = { invalidValue: disinfectant, validValues: validDisinfectants }
    }

    else if (pathogen === 'virus') {
        validLogInactivations = [2, 3, 4]
        if (disinfectant === 'chloramine' || disinfectant === 'free-chlorine')
            validTemperatures = [0, 5, 10, 15, 20, 25] // TODO DOUBLE CHECK VALUES
        else if (disinfectant === 'chlorine-dioxide' || disinfectant === 'ozone')
            validTemperatures = [1, 5, 10, 15, 20, 25]
        else validationErrors.disinfectant = { invalidValue: disinfectant, validValues: validDisinfectants }
    }
    else validationErrors.pathogen = { invalidValue: pathogen, validValues: validPathogens }

    // if no pathogen or disinfectant errors
    if (!(pathogen in validationErrors || disinfectant in validationErrors)) {
        if (!validTemperatures.includes(temperature))
            validationErrors.temperature = { invalidValue: temperature, validValues: validTemperatures }
        if (!validLogInactivations.includes(logInactivation))
            validationErrors.logInactivation = { invalidValue: logInactivation, validValues: validLogInactivations }
    }

    /* if no validation errors run sql */
    if (Object.keys(validationErrors).length === 0) {
        const sql = `SELECT inactivation FROM ${pathogen}.${disinfectant.replace('-', '_')} WHERE temperature = ${temperature} AND log_inactivation = ${logInactivation};`;
        (async () => {
            try {
                const dbRes = await pool.query(sql)
                // await pool.end() // TODO where should this be handled?
                apiRes.status(200).send(dbRes.rows[0])
            } catch (err) {
                console.log(err)
            }
        })()
    } else {
        apiRes.status(422).send(validationErrors)
    }
})

app.get('/test', function (req, res) {
    res.status(200).send('test');
});

app.get('*', function (req, res) {
    res.status(404).send('Not found');
});

app.listen(PORT, () => console.log(`API listening on http://${HOST}:${PORT}`))
