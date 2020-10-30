import React from 'react';
import {
  Switch,
  Route,
  Link,
  useLocation
} from "react-router-dom";

import Calculator from '../calculator/Calculator'
import About from '../about/About'
import { style, active } from './app.module.scss'

const App = () => {
  const { pathname } = useLocation()
  return (
    <div id="app" className={style}>
      <nav>
        <Link className={pathname === '/' ? active : null} to="/">CT Calc</Link>
        <Link className={pathname === '/about' ? active : null} to="/about">About</Link>
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
