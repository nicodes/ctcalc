import React, { useState } from 'react';
import axios from 'axios'
import ReactTooltip from 'react-tooltip';

import Select from '../select/Select';
import errorSvg from '../../images/error_outline.svg'
import { disinfectantOptions, giardiaLogOptions, virusLogOptions } from './calculator.util';
import './calculator.scss';

const apiUrl = process.env.REACT_APP_API_URL

const Calculator = () => {
    const [giardiaResult, setGiardiaResult] = useState()
    const [virusResult, setVirusResult] = useState()
    const [serverErrors, setServerErrors] = useState({})
    const [showErrors, setShowErrors] = useState(false)
    const [disableAll, setDisableAll] = useState(false)

    // form inputs
    const [disinfectant, setDisinfectant] = useState('')
    const [temperature, setTempterature] = useState('')
    const [temperatureError, setTempteratureError] = useState(true)
    const [ph, setPh] = useState('')
    const [phError, setPhError] = useState(true)
    const [concentration, setConcentration] = useState('')
    const [concentrationError, setConcentrationError] = useState(true)
    const [giardiaActive, setGiardiaActive] = useState(true)
    const [giardiaLog, setGiardiaLog] = useState('')
    const [virusActive, setVirusActive] = useState(true)
    const [virusLog, setVirusLog] = useState('')
    const [isFormula, setIsFormula] = useState(false)

    // helpers
    const isFreeChlorine = disinfectant === 'free-chlorine'
    const validateTemperature = t => setTempteratureError(t <= 0 || 25 < t)
    const validatePh = p => setPhError(p < 6 || 9 < p)
    const validateConcentration = c => setConcentrationError(c <= 0 || 3 < c)

    const submit = () => {
        setGiardiaResult(undefined)
        setVirusResult(undefined)
        !showErrors && setShowErrors(true);

        !(temperatureError
            || (isFreeChlorine && (phError || concentrationError))
            || (giardiaActive && giardiaLog === '')
            || (virusActive && virusLog === '')
        ) && (async () => {
            const urls = []
            giardiaActive && urls.push(`${apiUrl}/${disinfectant}/giardia?temperature=${temperature}&inactivation-log=${giardiaLog}`
                + `${isFreeChlorine
                    ? `&ph=${ph}&concentration=${concentration}${isFormula
                        ? '&formula=true'
                        : ''}`
                    : ''}`)
            virusActive && urls.push(`${apiUrl}/${disinfectant}/virus?temperature=${temperature}&inactivation-log=${virusLog}`)
            try {
                setServerErrors([])
                setDisableAll(true)
                const [giardiaRes, virusRes] = await Promise.all(urls.map(u => axios.get(u)));
                giardiaRes && setGiardiaResult(giardiaRes.data)
                virusRes && setVirusResult(virusRes.data)
            } catch (error) {
                console.log(error)
                // TODO fix this
                // const { response } = error
                // if (response.status === 400) {
                //     setServerErrors(response.data)
                // }
            }
        })()
    }

    const clear = () => {
        setShowErrors(false)
        setDisableAll(false)
        setGiardiaActive(true)
        setVirusActive(true)
        setDisinfectant('')
        setTempterature('')
        setGiardiaLog('')
        setVirusLog('')
    }

    const errorImg = text => showErrors ? <><img src={errorSvg} data-tip={text} alt='error' /><ReactTooltip place='right' /></> : <div />

    return (<div className={'calculator'}>
        <div style={{
            marginTop: '20px',
            padding: '20px',
            textAlign: 'center',
            backgroundColor: '#fcf8e3',
            border: 'solid 2px #faf2cc',
            color: '#8a6d3b'
        }}>WARNING: this site is under development and should only be used for testing</div>
        <h1>CT Calculator</h1>
        <form>
            {disinfectant === '' ? errorImg("Please select a value") : <div />}
            <div className='label-container'>
                <span>Disinfectant Type:</span>
            </div>
            <Select
                disabled={disableAll}
                options={disinfectantOptions}
                value={disinfectant}
                onChange={value => {
                    const isFreeChlorine = value === 'free-chlorine'
                    validateTemperature(temperature)
                    setDisinfectant(value)
                    if (isFreeChlorine) {
                        setPh('')
                        setConcentration('')
                    }
                }}
            />

            {isFreeChlorine && <>
                {concentrationError ? errorImg("Please enter a concentration between (0, 3]") : <div />}
                <div className='label-container'>
                    <span>Concentration (mg/L):</span>
                </div>
                <input
                    type='number'
                    step='0.01'
                    min={0.0001}
                    disabled={disableAll}
                    value={concentration}
                    onChange={({ target: { value } }) => {
                        validateConcentration(value)
                        setConcentration(value)
                    }}
                />

                {phError ? errorImg("Please enter a ph between [6, 9]") : <div />}
                <div className='label-container'>
                    <span>pH:</span>
                </div>
                <input
                    type='number'
                    step='0.01'
                    min={0.0001}
                    disabled={disableAll}
                    value={ph}
                    onChange={({ target: { value } }) => {
                        validatePh(value)
                        setPh(value)
                    }}
                />
            </>}

            {temperatureError ? errorImg("Please enter a temperature between (0, 25]") : <div />}
            <div className='label-container'>
                <span>Temperature (°C):</span>
            </div>
            <input
                type='number'
                step='0.01'
                min={0.0001}
                disabled={disableAll}
                value={temperature}
                onChange={({ target: { value } }) => {
                    validateTemperature(value)
                    setTempterature(value)
                }}
            />

            {giardiaActive && giardiaLog === '' ? errorImg("Please select a value") : <div />}
            <div className='label-container'>
                <input
                    type="checkbox"
                    disabled={disableAll}
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
                disabled={disableAll || !giardiaActive}
            />

            {virusActive && virusLog === '' ? errorImg("Please select a value") : <div />}
            <div className='label-container'>
                <input
                    type="checkbox"
                    disabled={disableAll}
                    checked={virusActive}
                    onChange={() => {
                        virusActive === true && setVirusLog('')
                        setVirusActive(!virusActive)
                    }}
                />
                <span className={virusActive ? null : 'kebab'}>Logs of Virus Inactivation:</span>
            </div>
            <Select
                disabled={disableAll || !virusActive}
                options={virusLogOptions}
                value={virusLog}
                onChange={setVirusLog}
            />

            {isFreeChlorine && giardiaActive && <>
                <div /> {/* skip grid area */}
                <div className='label-container'>
                    <span>Methodology:</span>
                </div>
                <div onChange={() => setIsFormula(!isFormula)}>
                    <input
                        type="radio"
                        disabled={disableAll}
                        checked={!isFormula} /> Interpolate
                    <br />
                    {/* <input
                        type="radio"
                        disabled={disableAll}
                        checked={!isFormula} /> Round
                    <br /> */}
                    <input
                        type="radio"
                        disabled={disableAll}
                        checked={isFormula} /> Formula
                </div>
            </>}

            <div style={{ width: '23px' }} /> {/* skip grid area, reserves space for error imgs */}
            <div /> {/* skip grid area */}
            <div className={'buttons-container'}>
                <button
                    type='button'
                    className={'submit'}
                    onClick={submit}
                    disabled={
                        disableAll || (showErrors &&
                            (disinfectant === ''
                                || temperatureError
                                || (isFreeChlorine && (phError || concentrationError))
                                || (giardiaActive && !giardiaLog)
                                || (virusActive && !virusLog)))
                    }
                >Submit</button>
                <button
                    type='button'
                    className={'clear'}
                    onClick={clear}
                >Clear</button>
            </div>

            {serverErrors.length === 0 && <>
                <div style={{ backgroundColor: '#e3e3e3', 'height': '3px', 'grid-column': `span 3` }} />
                {[['Giardia', giardiaResult], ['Virus', virusResult]].map(([label, result]) => result && <>
                    <div />
                    <span style={{ justifySelf: 'right', marginRight: '10px' }}>{label} Inactivation:</span>
                    <span>{JSON.stringify(result)}</span>
                </>)}
            </>}
        </form>
    </div>);
}

export default Calculator;
