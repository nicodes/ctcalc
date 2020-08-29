import React from 'react';

const About = ({ setCalcView }) => {
    return (
        <div style={{ maxWidth: '60%', marginLeft: 'auto', marginRight: 'auto' }}>
            <h1>Contact Time Calculator</h1>
            <p>This Contact Time Calculator calculates the contact time provided and the amount of contact time needed to provide adequate inactivation of Giardia and viruses for a range of disinfectants. These calculations can be useful for determining compliance with the Surface Water Treatment Rule.</p>
            <p>All data and calculations are taken from </p>
            <p>The amount contact time needed is determined from user inputs of the type of disinfectant, the logs of inactivation needed, temperature, pH, and disinfectant residual. The calculator uses the methods and tables in EPA Manual EPA815-R-99-013, titled “Disinfection Profiling and Benchmarking Guidance Manual”, dated August 1999, for determining the amount of inactivation needed.</p>
            <p><a href='https://nepis.epa.gov/Exe/ZyNET.exe/20002249.TXT?ZyActionD=ZyDocument&Client=EPA&Index=1995+Thru+1999&Docs=&Query=&Time=&EndTime=&SearchMethod=1&TocRestrict=n&Toc=&TocEntry=&QField=&QFieldYear=&QFieldMonth=&QFieldDay=&IntQFieldOp=0&ExtQFieldOp=0&XmlQuery=&File=D%3A%5Czyfiles%5CIndex%20Data%5C95thru99%5CTxt%5C00000015%5C20002249.txt&User=ANONYMOUS&Password=anonymous&SortMethod=h%7C-&MaximumDocuments=1&FuzzyDegree=0&ImageQuality=r75g8/r75g8/x150y150g16/i425&Display=hpfr&DefSeekPage=x&SearchBack=ZyActionL&Back=ZyActionS&BackDesc=Results%20page&MaximumPages=1&ZyEntry=1&SeekPage=x&ZyPURL#'>
                Click for EPA source documents
            </a></p>
            <p><a href='/#' onClick={setCalcView}>Click here to get started</a></p>
        </div >
    );
}

export default About;
