import React, { useState } from 'react';
import axios from 'axios'
import Calculator from '../calculator/Calculator'
import './App.scss';

function App() {
  const [validValues, setValidValues] = useState()
  const [disinfectant, setDisinfectant] = useState('')
  const [disinfectantConcentration, setDisinfectantConcentration] = useState('')
  const [time, setTime] = useState('')
  const [temperature, setTempterature] = useState('')
  const [giardiaActive, setGiardiaActive] = useState(true)
  const [logGardia, setLogGiardia] = useState('')
  const [virusActive, setVirusActive] = useState(true)
  const [logVirus, setLogVirus] = useState('')
  const [giardiaResult, setGiardiaResult] = useState('')
  const [virusResult, setVirusResult] = useState('')

  const apiUrl = process.env.REACT_APP_API_URL

  useState(() => {
    (async () => {
      const res = await axios.get(`${apiUrl}/valid-values`)
      if (res.status === 200) setValidValues(res.data)
    })()
  }, [])

  return (
    <div id="App">
      <header style={{ backgroundColor: '#e3e3e3', padding: '10px 30px' }}>CT Calc</header>
      <main>
        {validValues ? <Calculator
          validValues={validValues}
          disinfectant={disinfectant}
          setDisinfectant={setDisinfectant}
          disinfectantConcentration={disinfectantConcentration}
          setDisinfectantConcentration={setDisinfectantConcentration}
          time={time}
          setTime={setTime}
          temperature={temperature}
          setTempterature={setTempterature}
          giardiaActive={giardiaActive}
          setGiardiaActive={setGiardiaActive}
          logGiardia={logGardia}
          setLogGiardia={setLogGiardia}
          virusActive={virusActive}
          setVirusActive={setVirusActive}
          logVirus={logVirus}
          setLogVirus={setLogVirus}
          giardiaResult={giardiaResult}
          setGiardiaResult={setGiardiaResult}
          virusResult={virusResult}
          setVirusResult={setVirusResult}
        /> : <div>Loading...</div>}
      </main>
    </div >
  );
}

export default App;
