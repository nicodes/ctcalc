import React from 'react';

function Select({
    value = '',
    options,
    onChange
}) {
    return (
        <select value={value} onChange={e => onChange(e.target.value)}>
            {value === '' && <option key='' value={''} disabled>-- Select --</option>}
            {options.map(({ value, label }, i) => <option key={i} value={value}>{label}</option>)}
        </select>);
}

export default Select;
