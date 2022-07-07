import React from "react";
import NumberFormat from 'react-number-format';
import TextField from "@material-ui/core/TextField";


/**
 * @deprecated
 * use ../button.js
 */
function NumberFormatCustom(props) {
    const { inputRef, onChange, ...other } = props;

    return (
        <NumberFormat
            {...other}
            getInputRef={inputRef}
            onValueChange={(values) => {
                onChange({
                    target: {
                        name: props.name,
                        value: values.value
                    },
                });
            }}
            thousandSeparator=" "
            isNumericString
        />
    );
}

function NumberTextField(props) {
    return (
        <TextField
            {...props}
            InputProps={{
                inputComponent: NumberFormatCustom
            }}
        />
    )
};

export default NumberTextField;
