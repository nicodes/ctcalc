const express = require('express')
const { Pool } = require('pg')

const host = process.env.HOST
const port = process.env.PORT
const dbHost = process.env.DB_HOST
const dbPort = process.env.DB_PORT
const dbName = process.env.DB_NAME
const dbUser = process.env.DB_USER
const dbPwd = process.env.DB_PWD

const app = express()

const pool = new Pool({
    host: dbHost,
    port: dbPort,
    database: dbName,
    user: dbUser,
    password: dbPwd,
})

app.get('/:pathogen/:disinfectant', (apiReq, apiRes) => {
    const { pathogen, disinfectant } = apiReq.params
    console.log(`GET /:${pathogen}/:${disinfectant}`, apiReq.query)

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

    /* if no validation errors */
    if (Object.keys(validationErrors).length === 0) {
        const sql = `SELECT inactivation FROM ${pathogen}.${disinfectant.replace('-', '_')} WHERE temperature = ${temperature} AND log_inactivation = ${logInactivation}; `
        console.log(sql)
        pool.query(sql, (dbErr, dbRes) => {
            // TODO do some checking here 
            apiRes.status(200).send(dbRes.rows)
            // pool.end() // TODO where does it make most sense to end the pool?
        })
    } else {
        apiRes.status(422).send(validationErrors)
    }
})

app.get('*', function (req, res) {
    res.status(404).send('Not found');
});

app.listen(port, () => console.log(`API listening on http://${host}:${port}`))
