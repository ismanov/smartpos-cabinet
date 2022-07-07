import React from 'react';
import { Grid, Typography} from '@material-ui/core';
import {useDispatch, useSelector} from 'react-redux';
import PasswordTextField from '#components/Textfields/password';
import {withRouter} from 'react-router-dom';
import {containsLowerCaseLetter, containsUpperCaseLetter} from "#utils/format";
import * as Yup from "yup";

import {Formik, Field} from "formik";
import {setPassword} from "./actions";


const SetPassword = props => {

    const isLoading = useSelector(state => state.get('setPassword').isLoading);
    const dispatch = useDispatch();

    return (
        <Formik
            initialValues={{
                password: '',
                confirmPassword: ''
            }}
            validationSchema={() => Yup.object().shape({
                password: Yup.string().matches(/(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.{9,})|\b\d{6}\b/).required(),
                confirmPassword: Yup.string().matches(/(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.{9,})|\b\d{6}\b/).required()
            })}
            onSubmit={values => {
                const {password} = values;
                dispatch(setPassword(password))
            }}>
            {({isValid, dirty}) => (
                <Grid container justify="center">
                    <Grid item xs={9} style={{marginTop: 30}}>
                        <Grid container justify='center'>
                            <Grid item>
                                <img
                                    src={require('../../../../assets/img/logo_full.svg')}
                                    alt='logo' width={240}
                                    style={{cursor: 'pointer'}}
                                    onClick={() => {
                                        props.history.push('/user/auth')
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={9} style={{marginTop: 20}}>
                        <Grid container justify='center' style={{marginTop: 20}}>
                            <Grid item>
                                <Typography
                                    variant='h1'
                                    align='center'
                                    style={{fontSize: 18, color: '#555'}}>Личный кабинет</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Field name="password">
                        {({field: {value}}) => (
                            <Grid item xs={9} style={{marginTop: 20}}>
                                <Grid container direction='row'>
                                    <Grid item xs={4}>
                                        <Grid item xs={12}>
                                            <Typography align='center' color={containsUpperCaseLetter(value) ? 'primary' : 'inherit'} variant='h4' style={{fontSize: 40}}>A</Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography variant='h4' color={containsUpperCaseLetter(value) ? 'primary' : 'inherit'} align='center' style={{fontSize: 12}}>Заглавные буквы</Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Grid item xs={12}>
                                            <Typography variant='h4' color={containsLowerCaseLetter(value) ? 'primary' : 'inherit'} align='center' style={{fontSize: 40}}>a</Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography variant='h4' color={containsLowerCaseLetter(value) ? 'primary' : 'inherit'} align='center' style={{fontSize: 12}}>Строчные буквы</Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Grid item xs={12}>
                                            <Typography variant='h4' color={value && value.length >= 8 ? 'primary' : 'inherit'} align='center' style={{fontSize: 40}}>8+</Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography variant='h4'  color={value && value >= 8 ? 'primary' : 'inherit'} align='center' style={{fontSize: 12}}>Больше 8 символов</Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        )}
                    </Field>
                    <Grid item xs={9} style={{marginTop: 40}}>
                        <Field name="password">
                            {({field: {value}, form: {setFieldValue}}) => (
                                <PasswordTextField
                                    value={value}
                                    onChange={(event) => {
                                        setFieldValue('password', event.target.value)
                                    }}
                                />
                            )}
                        </Field>
                    </Grid>
                    <Grid item xs={9} style={{marginTop: 20}}>
                        <Field name="confirmPassword">
                            {({field: {value}, form: {setFieldValue}}) => (
                                <PasswordTextField
                                    value={value}
                                    onChange={(event) => {
                                        setFieldValue('confirmPassword', event.target.value)
                                    }}
                                />
                            )}
                        </Field>                        
                    </Grid>
                    <Grid item xs={9} style={{marginTop: 15}}>
                        <RaisedButton
                            disabled={!(isValid && dirty && !isLoading)}
                            isLoading={isLoading}
                            type="submit"
                        > Продолжить </RaisedButton>
                    </Grid>
                </Grid>
            )} </Formik>

    )
}

export default withRouter(SetPassword)
