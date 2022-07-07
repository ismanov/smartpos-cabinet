import React from 'react';
import * as R from 'ramda';
import PropTypes from 'prop-types';
import { Button as MuiButton, IconButton as MuiIconButton } from "@material-ui/core";

export const Button = (props) => {
    return (
        <MuiButton 
            {...props}
            fullWidth
            variant={
                R.cond([
                    [R.equals("raised"), R.always("contained")],
                    [R.equals("outlined"), R.always("outlined")],
                    [R.equals("text"), R.always("text")],
                    [R.T, R.always("text")],
                ])
            }
            startIcon={props.leftIcon}
            endIcon={props.rightIcon}
        > { props.title } </MuiButton>
    )
};

Button.propTypes = {
    title: PropTypes.string.isRequired,
    variant: PropTypes.oneOf(["raised", "text", "outlined"]),
    onClick: PropTypes.func,
    leftIcon: PropTypes.element,
    rightIcon: PropTypes.element,
    roundedCorners: PropTypes.bool,
};

export const IconButton = (props) => {
    return (
        <MuiIconButton 
            {...props}
            style={...props.style, {color: props.color}}
        />
    )
};

IconButton.propTypes = {
    color: PropTypes.func,
    onClick: PropTypes.func,
    icon: PropTypes.element.isRequired,    
};