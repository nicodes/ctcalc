import React, { useState } from 'react';
import Calculator from '../calculator/Calculator'
import About from '../about/About'
import { style, active } from './app.module.scss'

const CALC_VIEW = 0
const ABOUT_VIEW = 1

function App() {
  const [view, setView] = useState(CALC_VIEW)
  return (
    <div id="app" className={style}>
      <nav>
        <div className={view === CALC_VIEW ? active : null} onClick={() => setView(CALC_VIEW)}>
          <a>CT Calc</a>
        </div>
        <div className={view === ABOUT_VIEW ? active : null} onClick={() => setView(ABOUT_VIEW)}>
          <a>About</a>
        </div>
      </nav>
      <main>
        {view === CALC_VIEW && <Calculator />}
        {view === ABOUT_VIEW && <About setCalcView={() => setView(CALC_VIEW)} />}
      </main>
    </div >
  );
}

export default App;
