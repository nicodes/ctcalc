import React, { useState, useEffect } from 'react';
import Calculator from '../calculator/Calculator'
import './App.scss';

function App() {
  const [disinfectantType, setDisinfectantType] = useState('')
  const [disinfectantConcentration, setDisinfectantConcentration] = useState('')
  const [time, setTime] = useState('')
  const [temperature, setTempterature] = useState('')
  const [logGardia, setLogGiardia] = useState('')
  const [logVirus, setLogVirus] = useState('')

  const [giardiaResult, setGiardiaResult] = useState('')
  const [virusResult, setVirusResult] = useState('')

  return (
    <div id="App">
      <header style={{ backgroundColor: 'lightgrey' }}>header</header>
      <main>
        <Calculator
          disinfectantType={disinfectantType}
          setDisinfectantType={setDisinfectantType}
          disinfectantConcentration={disinfectantConcentration}
          setDisinfectantConcentration={setDisinfectantConcentration}
          time={time}
          setTime={setTime}
          temperature={temperature}
          setTempterature={setTempterature}
          logGiardia={logGardia}
          setLogGiardia={setLogGiardia}
          logVirus={logVirus}
          setLogVirus={setLogVirus}
          giardiaResult={giardiaResult}
          setGiardiaResult={setGiardiaResult}
          virusResult={virusResult}
          setVirusResult={setVirusResult}
        />
      </main>
    </div >
  );
}

export default App;
