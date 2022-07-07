import React, {useEffect, useState} from 'react';
import { Grid, Typography, TextField, Button } from '@material-ui/core';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css'
import InputMask from 'react-input-mask';
import {useDispatch, useSelector} from 'react-redux';
import { Redirect, withRouter } from 'react-router-dom';
import ErrorText from '#components/sptext/error';
import 'react-circular-progressbar/dist/styles.css';
import RaisedButton from "../../../components/Buttons/raised";
import {confirmCode, setErrorText} from "./actions";
import {Formik, Field} from 'formik';
import * as Yup from "yup";
import {registerViaSMS} from "../signup/actions";
let x = null;
let time = 0;

const Confirm = props => {


    const [uiTime, setUITime] = useState();
    const isLoading = useSelector(state => state.get('confirm').isLoading);
    const errorText = useSelector(state => state.get('confirm').errorText);
    const dispatch = useDispatch();

    useEffect(() => {
        startTimer()
        return () => {
            clearInterval(x)
            x = null;
            setErrorText('');
        }
    }, [time])


    const startTimer = () => {
        time = 60;
        x = setInterval(() => {
            if (time - 1 !== 0) {
                setUITime(time - 1)
            } else  {
                setUITime(0)
                clearInterval(x)
            }
        }, 1000)
    }

    const formatPhoneNumber = (phoneNumber) => {
        return `+${phoneNumber.substring(0, 3)} ${phoneNumber.substring(3, 5)} *** ** ${phoneNumber.substring(10, 12)}`
    }



    const checkConfirmCode = (confirmCode) => {
        return confirmCode.indexOf('*') < 0 && confirmCode === ''
    }

    let registerNumber = localStorage.getItem('phoneNumber')
    if (registerNumber === undefined || registerNumber === '') return <Redirect to='/user/signup'/>

    return (
        <Formik
            initialValues={{
                accessCode: ''
            }}
            validationSchema={() => Yup.object().shape({
                accessCode: Yup.string().min(6).max(6).required()
            })}
            onSubmit={values => {
                const {accessCode} = values;
                dispatch(confirmCode(registerNumber, accessCode));
            }}>
            {({isValid, dirty}) => (
                <Grid container justify="center">
                    <Grid item xs={9}>
                        <Grid container justify="center">
                            <Grid item>
                                <img
                                    src={require('../../../../assets/img/logo_full.svg')}
                                    alt='logo'
                                    width={240}
                                    onClick={() => {
                                        props.history.push('/user/auth')
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={9} style={{marginTop: 20}}>
                        <Typography
                            variant='h5'
                            align='center'
                            style={{fontSize: 18, color: '#555'}}>
                            На указанный номер {formatPhoneNumber(registerNumber)} отправили СМС с кодом подтверждения.
                        </Typography>
                    </Grid>
                    <Grid item xs={9} style={{marginTop: 20}}>
                        <Grid container justify='center'>
                            <div style={{
                                width: 90,
                                height: 90,
                                marginTop: 20
                            }}>
                                <CircularProgressbar
                                    minValue={0}
                                    maxValue={60}
                                    value={uiTime}
                                    text={uiTime === 0 ? '0' : uiTime}
                                    styles={
                                        buildStyles({
                                            trailColor: '#14A76C22',
                                            pathColor: '#14A76C',
                                            textColor: '#14A76C',
                                            textSize: 40
                                        })
                                    }
                                />
                            </div>
                        </Grid>
                    </Grid>
                    <Grid item xs={9} style={{ marginTop: 20 }}>
                        <ErrorText text={errorText}/>
                    </Grid>
                    <Field name="accessCode">
                        {({field: {value}, form: {setFieldValue, errors}}) => (
                            <Grid item xs={9} style={{marginTop: 20}}>
                                <InputMask mask='999999' maskChar='*' onChange={(event) => {
                                    setErrorText('');
                                    setFieldValue('accessCode', event.target.value)
                                }} >
                                    {(inputProps) =>
                                        <TextField
                                            {...inputProps}
                                            fullWidth
                                            variant='outlined'
                                            label='Код подтверждения'
                                            error={errors.accessCode}
                                            helperText={errors.accessCode && 'Неправильный код подтверждения'}
                                        />
                                    }
                                </InputMask>
                            </Grid>
                        )}
                    </Field>

                    <Grid item xs={9} style={{marginTop: 20}}>
                        <RaisedButton
                            disabled={!(isValid && dirty && !isLoading)}
                            type="submit"
                        > Продолжить </RaisedButton>
                    </Grid>
                    <Grid item xs={9} style={{marginTop: 15}}>
                        <RaisedButton
                            onClick={() => {
                                if (uiTime === 0) {
                                    startTimer()
                                    dispatch(registerViaSMS(registerNumber, props));
                                }
                            }}
                            disabled={uiTime !== 0}

                        > Отправить код еще раз </RaisedButton>
                    </Grid>
                </Grid>
            )}
        </Formik>

    )
}

export default withRouter(Confirm);
