import React, { useState, useEffect } from 'react';
import axios from 'axios'

import Select from '../select/Select';
import { disinfectantTypeOptions, logGiardiaOptions, logVirusOptions } from './calculator.util';
import './calculator.scss';
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

    /* handle submit button click */
    function submit() {
        (async () => {
            const giardiaUrl = `${apiUrl}/giardia/${disinfectantType}?temperature=${temperature}&logInactivation=${logGiardia}`
            const virusUrl = `${apiUrl}/virus/${disinfectantType}?temperature=${temperature}&logInactivation=${logVirus}`
            // console.log(giardiaUrl)
            // console.log(virusUrl)

            const [giardiaRes, virusRes] = await Promise.all([axios.get(giardiaUrl), axios.get(virusUrl)]);
            // console.log(giardiaRes)
            // console.log(virusRes)

            setGiardiaResult(giardiaRes.data)
            setVirusResult(virusRes.data)
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
        <h1>Calculator</h1>
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

            <span>Logs of Giardia Inactivation::</span>
            <Select options={logGiardiaOptions}
                value={logGiardia}
                onChange={setLogGiardia} />

            <span>Logs of Virus Inactivation::</span>
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
        </div>
    </div >);
}

export default Calculator;
