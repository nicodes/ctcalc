import React from 'react';
import Calculator from '../calculator/Calculator'
import './App.scss';

function App() {
  return (
    <div id="app">
      <header style={{ backgroundColor: '#e3e3e3', padding: '10px 30px' }}>CT Calc</header>
      <main>
        <Calculator />
      </main>
    </div >
  );
}

export default App;
