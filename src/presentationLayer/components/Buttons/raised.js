import React from 'react';
import { CircularProgress, Button } from '@material-ui/core';
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    root: {
        borderRadius: 1000,
        color:  'white',
        [theme.breakpoints.down('sm')]: {
            height: 35,
        },
        [theme.breakpoints.up('md')]: {
            height: 40,
        },
        [theme.breakpoints.up('lg')]: {
            height: 45,
        },
    },

    circular: {
        [theme.breakpoints.down('sm')]: {
            height: 25,
            width: 25
        },
        [theme.breakpoints.up('md')]: {
            height: 30,
            width: 30
        },
        [theme.breakpoints.up('lg')]: {
            height: 35,
            width: 35
        },
    }
}));

/**
 * @deprecated
 * use ../button.js
 */
const RaisedButton = (props) => {
    const classes = useStyles();
    return (
        <Button
            {...props}
            fullWidth
            variant='contained'
            color='primary'
            className={classes.root}
        >
            {props.isLoading ? (<CircularProgress variant='indeterminate' className={classes.circular} />) : props.title}
        </Button>
    )
};

export default RaisedButton;
