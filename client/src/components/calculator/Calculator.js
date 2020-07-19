import React, { useState } from 'react';
import axios from 'axios'

import Select from '../select/Select';
import errorSvg from '../../images/error_outline.svg'
import { disinfectantOptions, logGiardiaOptions, logVirusOptions } from './calculator.util';
import './calculator.scss';
// const apiUrl = `http://${process.env.SERVER_URL}:${process.env.API_PORT}`
const apiUrl = process.env.REACT_APP_API_URL

function Calculator({
    validValues,
    disinfectant,
    setDisinfectant,
    disinfectantConcentration,
    setDisinfectantConcentration,
    time,
    setTime,
    temperature,
    setTempterature,
    giardiaActive,
    setGiardiaActive,
    logGiardia,
    setLogGiardia,
    virusActive,
    setVirusActive,
    logVirus,
    setLogVirus,
    giardiaResult,
    setGiardiaResult,
    virusResult,
    setVirusResult
}) {
    const [serverErrors, setServerErrors] = useState([])
    const [uiErrors, setUiErrors] = useState({})
    console.log(serverErrors)

    /* handle submit button click */
    function submit() {
        // {
        //     const newUiErrors = {}
        //     if (!validValues.validDisinfectants.contains(disinfectant))
        //         newUiErrors.disinfectant = true
        //     if (!validValues.validPathogens.contains(pathogen))
        //         newUiErrors.pathogen = true
        //     if (!validValues.validTemperatures[disinfectant][pathogen].contains(disinfectant))
        //         newUiErrors.temperature = true
        //     if (!validValues.ValidLogInactivations[disinfectant][pathogen].contains(pathogen))
        //         newUiErrors.logInactivation = true
        //     if (Object.keys(newUiErrors).length !== 0)
        //         setUiErrors(newUiErrors)
        // }


        ; (async () => {
            const giardiaUrl = `${apiUrl}/${disinfectant}/giardia?temperature=${temperature}&log-inactivation=${logGiardia}`
            const virusUrl = `${apiUrl}/${disinfectant}/virus?temperature=${temperature}&log-inactivation=${logVirus}`
            try {
                const [giardiaRes, virusRes] = await Promise.all([axios.get(giardiaUrl), axios.get(virusUrl)]);
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
        setDisinfectantConcentration('')
        setTime('')
        setTempterature('')
        setLogGiardia('')
        setLogVirus('')
    }

    function renderLabel(label, err) {
        return (<div class='label-container'>
            {err && <img src={errorSvg} />}
            <span>{label}:</span>
        </div>)
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
            {renderLabel('Disinfectant Type', uiErrors.disinfectant)}
            <Select options={disinfectantOptions}
                value={disinfectant}
                onChange={setDisinfectant} />

            {/* <span>Disinfectant Concentration (mg/L):</span>
            <input type='number' step='0.01' min='0' value={disinfectantConcentration} onChange={e => setDisinfectantConcentration(e.target.value)}></input>

            <span>Time (Minutes):</ span>
            <input type='number' step='0.01' min='0' value={time} onChange={e => setTime(e.target.value)}></input> */}

            {/* temperature */}
            {renderLabel('disinfectant', uiErrors.temperature)}
            <input type='number' step='0.01' min='0' value={temperature} onChange={e => setTempterature(e.target.value)} />

            {/* giardia */}
            <div class='label-container'>
                {<img src={errorSvg} />}
                <input type="checkbox" checked={giardiaActive} onChange={() => {
                    giardiaActive === true && setLogGiardia('')
                    setGiardiaActive(!giardiaActive)
                }} />
                <span class={giardiaActive ? null : 'kebab'}>Logs of Giardia Inactivation:</span>
            </div>
            <Select options={logGiardiaOptions}
                value={logGiardia}
                onChange={setLogGiardia}
                disabled={!giardiaActive}
            />

            {/* virus */}
            <div class='label-container'>
                {<img src={errorSvg} />}
                <input type="checkbox" checked={virusActive} onChange={() => {
                    virusActive === true && setLogVirus('')
                    setVirusActive(!virusActive)
                }} />
                <span class={virusActive ? null : 'kebab'}>Logs of Virus Inactivation:</span>
            </div>
            <Select options={logVirusOptions}
                value={logVirus}
                onChange={setLogVirus}
                disabled={!virusActive}
            />

            {/* buttons */}
            <div /> {/* skip grid area */}
            <div className={'buttons-container'}>
                <button type='button' className={'submit'} onClick={submit}>Submit</button>
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
    </div >);
}

export default Calculator;
