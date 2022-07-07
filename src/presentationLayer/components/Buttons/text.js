import React from 'react';
import { Button } from '@material-ui/core';

/**
 * @deprecated
 * use ../button.js
 */
const TextButton = props => {
    let style = props.style ? props.style : {};
    style = {...style};
    return (
        <Button
            {...props}
            variant='text'
            color={props.color || 'primary'}
            style={style}
        >
            {props.title}
        </Button>
    )
};

export default TextButton;