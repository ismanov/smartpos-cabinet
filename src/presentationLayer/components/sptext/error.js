import React from 'react';
import {Typography} from "@material-ui/core";


/**
 * @deprecated
 * use ../button.js
 */
const ErrorText = (props) => {

    return (
        <Typography 
            color='error'
            style={{
                paddingTop: 5,
                paddingBottom: 5,
                paddingLeft: 10,
                paddingRight: 10,
                borderWidth: 1,
                borderStyle: 'solid',                
                borderColor: '#d63d3d',
                borderRadius: 4,
                backgroundColor: '#d63d3d22',
                display: !props.text || props.text === '' ? 'none' : 'flex',
                ...props.style
            }}> 
        {props.text}
        </Typography>
    )
};

export default ErrorText;