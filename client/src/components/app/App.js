import React, { useState } from 'react';
import Calculator from '../calculator/Calculator'
import About from '../about/About'
import { style, active } from './app.module.scss'

const CALC_VIEW = 0
const ABOUT_VIEW = 1

const App = () => {
  const [view, setView] = useState(CALC_VIEW)
  return (
    <div id="app" className={style}>
      <nav>
        <div className={view === CALC_VIEW ? active : null} onClick={() => setView(CALC_VIEW)}>
          <a href='/#'>CT Calc</a>
        </div>
        <div className={view === ABOUT_VIEW ? active : null} onClick={() => setView(ABOUT_VIEW)}>
          <a href='/#'>About</a>
        </div>
      </nav>
      <main>
        {(() => {
          switch (view) {
            case CALC_VIEW: return <Calculator />
            case ABOUT_VIEW: return <About setCalcView={() => setView(CALC_VIEW)} />
            default: return
          }
        })()}
      </main>
    </div >
  );
}

export default App;
