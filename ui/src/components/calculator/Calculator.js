import React, { useState } from 'react';
import axios from 'axios'
import ReactTooltip from 'react-tooltip';

import Select from '../select/Select';
import errorSvg from '../../assets/error_outline.svg'
import helpSvg from '../../assets/help.svg'

import { disinfectantOptions, giardiaLogOptions, virusLogOptions } from './calculator.util';
import './calculator.scss';

const apiHost = process.env.REACT_APP_API_URL

const Calculator = () => {
    const [giardiaResult, setGiardiaResult] = useState()
    const [virusResult, setVirusResult] = useState()
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
    const [methodology, setMethodology] = useState('interpolation')

    // helpers
    const isFreeChlorine = disinfectant === 'free-chlorine'
    const validateTemperature = t => setTempteratureError(typeof t === 'number' && (t <= 0 || 25 < t))
    const validatePh = p => setPhError(p < 6 || 9 < p)
    const validateConcentration = c => setConcentrationError(c <= 0 || 3 < c)

    const submit = () => {
        setGiardiaResult(undefined)
        setVirusResult(undefined)
        !showErrors && setShowErrors(true)
        !(temperatureError
            || (isFreeChlorine && (phError || concentrationError))
            || (giardiaActive && giardiaLog === '')
            || (virusActive && virusLog === '')
        ) && (async () => {
            const urls = []
            giardiaActive && urls.push(`${apiHost}/${disinfectant}/giardia?temperature=${temperature}&inactivation-log=${giardiaLog}`
                + `${methodology === 'round' ? '&round=true' : ''}`
                + `${isFreeChlorine
                    ? `&ph=${ph}&concentration=${concentration}${methodology === 'formula'
                        ? '&formula=true'
                        : ''}`
                    : ''}`)
            virusActive && urls.push(`${apiHost}/${disinfectant}/virus?temperature=${temperature}&inactivation-log=${virusLog}`)
            try {
                setDisableAll(true)
                const [giardiaRes, virusRes] = await Promise.all(urls.map(u => axios.get(u)));
                giardiaRes && setGiardiaResult(giardiaRes.data)
                virusRes && setVirusResult(virusRes.data)
            } catch (error) {
                console.log(error)
            }
        })()
    }

    const clear = () => {
        setShowErrors(false)
        setGiardiaResult()
        setVirusResult()
        setDisableAll(false)
        setGiardiaActive(true)
        setVirusActive(true)
        setDisinfectant('')
        setTempterature('')
        setGiardiaLog('')
        setVirusLog('')
    }

    const errorImg = text => showErrors && <><img src={errorSvg} data-tip={text} alt='error' /><ReactTooltip place='right' /></>

    return (<div className={'calculator'}>
        <h1>CT Calculator</h1>
        <form>
            <div className='label-container'>
                {disinfectant === '' && errorImg("Please select a value")}
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
                <div className='label-container'>
                    {concentrationError && errorImg("Please enter a concentration between (0, 3]")}
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

                <div className='label-container'>
                    {phError && errorImg("Please enter a ph between [6, 9]")}
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

            <div className='label-container'>
                {temperatureError && errorImg("Please enter a temperature between (0, 25]")}
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

            <div className='label-container'>
                {giardiaActive && giardiaLog === '' && errorImg("Please select a value")}
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

            <div className='label-container'>
                {virusActive && virusLog === '' && errorImg("Please select a value")}
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

            <div className='label-container'>
                <span>Methodology:</span>
            </div>
            <div>
                <div style={{ display: 'flex' }}>
                    <input
                        type="radio"
                        disabled={disableAll}
                        checked={methodology === 'interpolate'}
                        onChange={() => setMethodology('interpolate')} />
                    <span>Interpolate</span>
                    <img src={helpSvg} data-tip={'Linear interpolation using table values'} alt='error' style={{ height: '1.2em', paddingLeft: 5 }} /><ReactTooltip place='right' />
                </div>

                {/* <br /> */}
                <div style={{ display: 'flex' }}>
                    <input
                        type="radio"
                        disabled={disableAll}
                        checked={methodology === 'round'}
                        onChange={() => setMethodology('round')} />
                    <span>Round</span>
                    <img src={helpSvg} data-tip={'Selects most conservative table values by conservative rounding'} alt='error' style={{ height: '1.2em', paddingLeft: 5 }} /><ReactTooltip place='right' />
                </div>

                {isFreeChlorine && giardiaActive && <div style={{ display: 'flex' }}>
                    <input
                        type="radio"
                        disabled={disableAll}
                        checked={methodology === 'formula'}
                        onChange={() => setMethodology('formula')} />
                    <span>Formula</span>
                    <img src={helpSvg} data-tip={'Calculate value using EPA Regression formula'} alt='error' style={{ height: '1.2em', paddingLeft: 5 }} /><ReactTooltip place='right' />
                </div>}
            </div>

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
                    }>Submit</button>
                <button type='button' className={'clear'} onClick={clear} >{disableAll ? 'Reset' : 'Clear'}</button>
            </div>

            {(giardiaResult || virusResult) && <div className='divider' />}
            {giardiaResult && <>
                <span className='result-container'>Giardia Inactivation:</span>
                <input type='text' value={giardiaResult} readOnly />
            </>}
            {virusResult && <>
                <span>Virus Inactivation:</span>
                <input type='text' value={virusResult} readOnly />
            </>}
        </form>
    </div >);
}

export default Calculator;
