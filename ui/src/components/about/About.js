import React from 'react';
import { Link } from "react-router-dom";

import pdf from '../../assets/disinfection-profiling-and-benchmarking-guidance-manual.pdf'

const About = () => {
    return (
        <div style={{ maxWidth: '60%', marginLeft: 'auto', marginRight: 'auto' }}>
            <h1>About</h1>
            <p>This Contact Time Calculator calculates the amount of contact time needed to provide adequate inactivation of Giardia and viruses for a range of disinfectants. These calculations can be useful for determining compliance with the Surface Water Treatment Rule.</p>
            <p>The amount contact time needed is determined from user inputs of the type of disinfectant, the logs of inactivation needed, temperature, pH, and disinfectant residual. The calculator uses the methods and tables in EPA Manual EPA815-R-99-013, titled “Disinfection Profiling and Benchmarking Guidance Manual”, dated August 1999, for determining the amount of inactivation needed.</p>
            <p><a href={pdf} download>Click here to download EPA source documents</a></p>
            <p>This project is open source and can be viewed on <a href='http://github.com/nicodes/ctcalc'>github</a>.</p>
            <Link to="/">Click here to get started</Link>
            <p>This project is funded by donations. If you find it useful please consider <a href='https://www.paypal.com/donate?hosted_button_id=TSJZP6V8WXKSN'>donating</a>.</p>
            <p>For more information or questions please contact us at <a href="mailto:info@ctcalc.com">info@ctcalc.com</a></p>
        </div >
    );
}

export default About;
