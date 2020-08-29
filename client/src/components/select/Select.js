import React from 'react';

const Select = ({
    value = '',
    options,
    onChange,
    disabled = false
}) => (<select value={value} onChange={e => onChange(e.target.value)} disabled={disabled}>
    {value === '' && <option key='' value={''} disabled>-- Select --</option>}
    {options.map(({ value, label }, i) => <option key={i} value={value}>{label}</option>)}
</select>)

export default Select;
