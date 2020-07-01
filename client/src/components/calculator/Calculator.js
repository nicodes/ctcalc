import React, { useState } from 'react';
import axios from 'axios'

import Select from '../select/Select';
import { disinfectantTypeOptions, logGiardiaOptions, logVirusOptions } from './calculator.util';
import './calculator.scss';
// const apiUrl = `http://${process.env.SERVER_URL}:${process.env.API_PORT}`
const apiUrl = process.env.REACT_APP_API_URL

function Calculator({
    disinfectantType,
    setDisinfectantType,
    disinfectantConcentration,
    setDisinfectantConcentration,
    time,
    setTime,
    temperature,
    setTempterature,
    logGiardia,
    setLogGiardia,
    logVirus,
    setLogVirus,
    giardiaResult,
    setGiardiaResult,
    virusResult,
    setVirusResult
}) {
    const [validationErrors, setValidationErrors] = useState([])

    /* handle submit button click */
    function submit() {
        (async () => {
            const giardiaUrl = `${apiUrl}/${disinfectantType}/giardia?temperature=${temperature}&log-inactivation=${logGiardia}`
            const virusUrl = `${apiUrl}/${disinfectantType}/virus?temperature=${temperature}&log-inactivation=${logVirus}`
            try {
                const [giardiaRes, virusRes] = await Promise.all([axios.get(giardiaUrl), axios.get(virusUrl)]);
                setValidationErrors([])
                setGiardiaResult(giardiaRes.data)
                setVirusResult(virusRes.data)
            } catch (error) {
                const { response } = error
                console.log(response)
                if (response.status === 400) {
                    setValidationErrors(response.data)
                }
            }
        })()
    }

    /* handle clear button click */
    function clear() {
        setDisinfectantType('')
        setDisinfectantConcentration('')
        setTime('')
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
            <span>Disinfectant Type:</span>
            <Select options={disinfectantTypeOptions}
                value={disinfectantType}
                onChange={setDisinfectantType} />

            {/* <span>Disinfectant Concentration (mg/L):</span>
            <input type='number' step='0.01' min='0' value={disinfectantConcentration} onChange={e => setDisinfectantConcentration(e.target.value)}></input>

            <span>Time (Minutes):</ span>
            <input type='number' step='0.01' min='0' value={time} onChange={e => setTime(e.target.value)}></input> */}

            <span>Temperature (°C):</span>
            <input type='number' step='0.01' min='0' value={temperature} onChange={e => setTempterature(e.target.value)}></input>

            <span>Logs of Giardia Inactivation:</span>
            <Select options={logGiardiaOptions}
                value={logGiardia}
                onChange={setLogGiardia} />

            <span>Logs of Virus Inactivation:</span>
            <Select options={logVirusOptions}
                value={logVirus}
                onChange={setLogVirus} />

            <div />
            <div className={'button-wrap'}>
                <button type='button' className={'submit'} onClick={submit}>Submit</button>
                <button type='button' className={'clear'} onClick={clear}>Clear</button>
            </div>
        </form>
        <div className={'results'}>
            <span>Giardia Result: {JSON.stringify(giardiaResult)}</span>
            <br />
            <span>Virus Result: {JSON.stringify(virusResult)}</span>
            {validationErrors.map(({ parameter, value, validInputs }) => <div>{`Invalid ${parameter}: ${value}. Valid inputs: ${JSON.stringify(validInputs)}`}</div>)}
        </div>
    </div >);
}

export default Calculator;
