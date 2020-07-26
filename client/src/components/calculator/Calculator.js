import React, { useState } from 'react';
import axios from 'axios'

import Select from '../select/Select';
import errorSvg from '../../images/error_outline.svg'
import { disinfectantOptions, logGiardiaOptions, logVirusOptions } from './calculator.util';
import './calculator.scss';

// const apiUrl = `http://${process.env.SERVER_URL}:${process.env.API_PORT}`
const apiUrl = process.env.REACT_APP_API_URL

function Calculator() {
    const [giardiaResult, setGiardiaResult] = useState()
    const [virusResult, setVirusResult] = useState()
    const [serverErrors, setServerErrors] = useState({})

    // form inputs
    const [disinfectant, setDisinfectant] = useState('')
    const [temperature, setTempterature] = useState('')
    const [temperatureError, setTempteratureError] = useState(false)
    const [giardiaActive, setGiardiaActive] = useState(true)
    const [logGiardia, setLogGiardia] = useState('')
    const [virusActive, setVirusActive] = useState(true)
    const [logVirus, setLogVirus] = useState('')

    const freeChlorineBool = disinfectant === 'free-chlorine'
    const validateTemperature = function (t, d) {
        setTempteratureError(
            t < (d === 'free-chlorine' ? 0.5 : 1)
            || 25 < t
        )
    }

    /* handle submit button click */
    function submit() {
        (async () => {
            const giardiaUrl = `${apiUrl}/${disinfectant}/giardia?temperature=${temperature}&inactivation-log=${logGiardia}`
            const virusUrl = `${apiUrl}/${disinfectant}/virus?temperature=${temperature}&inactivation-log=${logVirus}`
            const urls = []
            giardiaActive && urls.push(giardiaUrl)
            virusActive && urls.push(virusUrl)
            try {
                const [giardiaRes, virusRes] = await Promise.all(urls.map(u => axios.get(u)));
                setServerErrors([])
                setGiardiaResult(giardiaRes.data)
                setVirusResult(virusRes.data)
            } catch (error) {
                const { response } = error
                console.log(response)
                if (response.status === 400) {
                    setServerErrors(response.data)
                }
            }
        })()
    }

    /* handle clear button click */
    function clear() {
        setGiardiaActive(true)
        setVirusActive(true)
        setDisinfectant('')
        setTempterature('')
        setLogGiardia('')
        setLogVirus('')
    }

    return (<div className={'calculator'}>
        <div style={{
            marginTop: '20px',
            padding: '20px',
            textAlign: 'center',
            backgroundColor: '#fcf8e3',
            border: 'solid 2px #faf2cc',
            color: '#8a6d3b'
        }}>WARNING: this site is under development and should only be used for testing</div>
        <h1>Calculator - test</h1>
        <form>
            {/* disinfectant */}
            <div className='label-container'>
                <span>Disinfectant Type:</span>
            </div>
            <Select options={disinfectantOptions}
                value={disinfectant}
                onChange={value => {
                    validateTemperature(temperature, value)
                    setDisinfectant(value)
                }} />

            {/* temperature */}
            <div className='label-container'>
                {temperatureError && <img src={errorSvg} alt='error' />}
                <span>Temperature (°C):</span>
            </div>
            <input type='number' step='0.01' min={freeChlorineBool ? 0.5 : 1} value={temperature} onChange={({ target: { value } }) => {
                validateTemperature(value, disinfectant)
                setTempterature(value)
            }} />

            {/* giardia */}
            <div className='label-container'>
                <input type="checkbox" checked={giardiaActive} onChange={() => {
                    giardiaActive === true && setLogGiardia('')
                    setGiardiaActive(!giardiaActive)
                }} />
                <span className={giardiaActive ? null : 'kebab'}>Logs of Giardia Inactivation:</span>
            </div>
            <Select options={logGiardiaOptions}
                value={logGiardia}
                onChange={setLogGiardia}
                disabled={!giardiaActive}
            />

            {/* virus */}
            <div className='label-container'>
                <input type="checkbox" checked={virusActive} onChange={() => {
                    virusActive === true && setLogVirus('')
                    setVirusActive(!virusActive)
                }} />
                <span className={virusActive ? null : 'kebab'}>Logs of Virus Inactivation:</span>
            </div>
            <Select options={logVirusOptions}
                value={logVirus}
                onChange={setLogVirus}
                disabled={!virusActive}
            />

            {/* buttons */}
            <div /> {/* skip grid area */}
            <div className={'buttons-container'}>
                <button type='button' className={'submit'} onClick={submit} disabled={temperatureError}>Submit</button>
                <button type='button' className={'clear'} onClick={clear}>Clear</button>
            </div>

            {/* results */}
            {serverErrors.length === 0
                && (giardiaResult || virusResult) && <>
                    <div style={{ backgroundColor: '#e3e3e3', 'height': '3px', 'grid-column': `span 2` }} />
                    {[['Giardia', giardiaResult], ['Virus', virusResult]].map(([label, result]) => <>
                        <span style={{ justifySelf: 'right' }}>{label} Inactivation:</span>
                        <span>{JSON.stringify(result)}</span>
                    </>)}
                </>
            }
        </form>
    </div>);
}

export default Calculator;
