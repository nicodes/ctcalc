import React, { useState, useEffect } from 'react';
import axios from 'axios'
import './App.css';

const apiUrl = process.env.REACT_APP_API_URL

function App() {
  const [inactivation, setInactivation] = useState('loading...')

  useEffect(() => {
    (async function () {
      const url = `${apiUrl}/virus/chlorine-dioxide?temperature=1&logInactivation=2`
      const { data } = await axios.get(url)
      setInactivation(data.inactivation)
    })()
  }, [])

  return (
    <div className="App">
      {inactivation}
    </div>
  );
}

export default App;
