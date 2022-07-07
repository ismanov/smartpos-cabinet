import React from 'react';
import { DatePicker as DP } from '@material-ui/pickers';
import {TextField} from '@material-ui/core';
import IconButton from "@material-ui/core/IconButton";
import { Clear } from '@material-ui/icons';


/**
 * @deprecated
 * use ../button.js
 */
const DatePicker = (props) => {
    return (
        <DP
            {...props}
            variant='dialog'
            fullWidth
            inputVariant="outlined"
            onChange={(date) => { props.onChange && props.onChange(date) }}
            format='dd MMMM, yyyy'
            TextFieldComponent={p =>
                <TextField
                    {...p}
                    fullWidth
                    variant='outlined'
                    label={props.label || 'Выберите дату'}
                    InputProps={{
                        startAdornment: props.onClear && (
                            <IconButton
                                disabled={props.disabled}
                                onClick={(e) => {
                                    props.onClear && props.onClear();
                                    e.stopPropagation()
                                }} style={{order: 1}}>
                                <Clear color="disabled" fontSize="small" />
                            </IconButton>
                        )
                    }}
                    InputAdornmentProps={{
                        position: "end",
                        style: {order: 2, marginLeft: 0}
                    }}
                />
            }
        />
    )
};

export default DatePicker;
