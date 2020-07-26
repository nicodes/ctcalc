import React, { useState } from 'react';
import axios from 'axios'

import Select from '../select/Select';
import errorSvg from '../../images/error_outline.svg'
import { disinfectantOptions, phOptions, concentrationOptions, giardiaLogOptions, virusLogOptions } from './calculator.util';
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
    const [ph, setPh] = useState('')
    const [concentration, setConcentration] = useState('')
    const [giardiaActive, setGiardiaActive] = useState(true)
    const [giardiaLog, setGiardiaLog] = useState('')
    const [virusActive, setVirusActive] = useState(true)
    const [virusLog, setVirusLog] = useState('')

    const isFreeChlorine = disinfectant === 'free-chlorine'
    const validateTemperature = function (t, ifc = isFreeChlorine) {
        setTempteratureError(
            t < (ifc ? 0.5 : 1)
            || 25 < t
        )
    }

    function submit() {
        (async () => {
            const giardiaUrl = `${apiUrl}/${disinfectant}/giardia?temperature=${temperature}&inactivation-log=${giardiaLog}`
                + `${isFreeChlorine ? `&ph=${ph}&concentration=${concentration}` : ''}`
            const virusUrl = `${apiUrl}/${disinfectant}/virus?temperature=${temperature}&inactivation-log=${virusLog}`
            const urls = []
            giardiaActive && urls.push(giardiaUrl)
            virusActive && urls.push(virusUrl)
            try {
                const [giardiaRes, virusRes] = await Promise.all(urls.map(u => axios.get(u)));
                setServerErrors([])
                setGiardiaResult(giardiaRes ? giardiaRes.data : undefined)
                setVirusResult(virusRes ? virusRes.data : undefined)
            } catch (error) {
                const { response } = error
                if (response.status === 400) {
                    setServerErrors(response.data)
                }
            }
        })()
    }

    function clear() {
        setGiardiaActive(true)
        setVirusActive(true)
        setDisinfectant('')
        setTempterature('')
        setGiardiaLog('')
        setVirusLog('')
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
            <div className='label-container'>
                <span>Disinfectant Type:</span>
            </div>
            <Select
                options={disinfectantOptions}
                value={disinfectant}
                onChange={value => {
                    const isFreeChlorine = value === 'free-chlorine'
                    validateTemperature(temperature, isFreeChlorine)
                    setDisinfectant(value)
                    if (isFreeChlorine) {
                        setPh('')
                        setConcentration('')
                    }
                }}
            />

            <div className='label-container'>
                {temperatureError && <img src={errorSvg} alt='error' />}
                <span>Temperature (°C):</span>
            </div>
            <input
                type='number'
                step='0.01'
                min={isFreeChlorine ? 0.5 : 1}
                value={temperature}
                onChange={({ target: { value } }) => {
                    validateTemperature(value)
                    setTempterature(value)
                }}
            />

            {isFreeChlorine && <>
                <div className='label-container'>
                    <span>pH:</span>
                </div>
                <Select
                    options={phOptions}
                    value={ph}
                    onChange={setPh}
                />

                <div className='label-container'>
                    <span>Concentration (mg/L):</span>
                </div>
                <Select
                    options={concentrationOptions}
                    value={concentration}
                    onChange={setConcentration}
                />
            </>}

            <div className='label-container'>
                <input
                    type="checkbox"
                    checked={giardiaActive}
                    onChange={() => {
                        giardiaActive === true && setGiardiaLog('')
                        setGiardiaActive(!giardiaActive)
                    }}
                />
                <span className={giardiaActive ? null : 'kebab'}>Logs of Giardia Inactivation:</span>
            </div>
            <Select
                options={giardiaLogOptions}
                value={giardiaLog}
                onChange={setGiardiaLog}
                disabled={!giardiaActive}
            />

            <div className='label-container'>
                <input
                    type="checkbox"
                    checked={virusActive}
                    onChange={() => {
                        virusActive === true && setVirusLog('')
                        setVirusActive(!virusActive)
                    }}
                />
                <span className={virusActive ? null : 'kebab'}>Logs of Virus Inactivation:</span>
            </div>
            <Select
                options={virusLogOptions}
                value={virusLog}
                onChange={setVirusLog}
                disabled={!virusActive}
            />

            <div /> {/* skip grid area */}
            <div className={'buttons-container'}>
                <button type='button' className={'submit'} onClick={submit} disabled={temperatureError}>Submit</button>
                <button type='button' className={'clear'} onClick={clear}>Clear</button>
            </div>

            {serverErrors.length === 0 && <>
                <div style={{ backgroundColor: '#e3e3e3', 'height': '3px', 'grid-column': `span 2` }} />
                {[['Giardia', giardiaResult], ['Virus', virusResult]].map(([label, result]) => result && <>
                    <span style={{ justifySelf: 'right' }}>{label} Inactivation:</span>
                    <span>{JSON.stringify(result)}</span>
                </>)}
            </>}
        </form>
    </div>);
}

export default Calculator;
