import React from 'react';
import {
  Switch,
  Route,
  Link,
  useLocation
} from "react-router-dom";

import Calculator from '../calculator/Calculator'
import About from '../about/About'
import githubSvg from '../../assets/github.svg'
import { style, active } from './app.module.scss'

const App = () => {
  const { pathname } = useLocation()
  return (
    <div id="app" className={style}>
      <nav>
        <Link className={pathname === '/' ? active : null} to="/">CT Calc</Link>
        <Link className={pathname === '/about' ? active : null} to="/about">About</Link>
        <div></div>
        <a style={{ marginLeft: 'auto' }} href='https://www.paypal.com/donate?hosted_button_id=TSJZP6V8WXKSN'>Donate</a>
        <a style={{ width: '25px' }} href='https://github.com/nicodes/ctcalc'>
          <img style={{ width: '100%' }} src={githubSvg} alt='github logo' />
        </a>
      </nav>
      <main>
        <Switch>
          <Route path="/" exact>
            <Calculator />
          </Route>
          <Route path="/about" exact>
            <About />
          </Route>
        </Switch>
      </main>
    </div >
  );
}

export default App;
