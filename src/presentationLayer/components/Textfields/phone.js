import React from 'react';
import InputMask from 'react-input-mask';
import { TextField } from '@material-ui/core';


/**
 * @deprecated
 * use ../button.js
 */
const PhoneTextField = (props) => {

    const onChange = (event) => {
        let regex = /\d+/g;
        let phoneNumber = event.target.value.match(regex).join('');
        phoneNumber = phoneNumber.length < 3 || !phoneNumber.startsWith('998')  ? '998' : phoneNumber;
        let isValid = phoneNumber.length === 12;
        props.onPhoneChange && props.onPhoneChange(isValid, phoneNumber)
    };

    return (
        <InputMask
            {...props}
            mask={props.mask || '+(\\9\\98) 99 999-99-99'}
            maskChar={props.maskChar || ""}
            onChange={onChange}
            // value={props.value ? props.value : '998'}
            placeholder="+(998) __ ___-__-__"
        >
            { (inputProps) =>
                <TextField
                    variant='outlined'
                    fullWidth
                    autoComplete='off'
                    label='Телефон'
                    {...inputProps}
                />
            }
        </InputMask>
    )
};

export default PhoneTextField;
