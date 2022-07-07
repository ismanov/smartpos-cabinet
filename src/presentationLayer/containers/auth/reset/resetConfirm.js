import React from 'react';
import { TextField, Typography, Grid } from  '@material-ui/core';
import {useDispatch, useSelector} from 'react-redux';
import PhoneTextField from '../../../components/Textfields/phone';
import PasswordTextField from '../../../components/Textfields/password';
import ErrorText from '../../../components/sptext/error';
import {confirmReset, setErrorText} from "./actions";
import RaisedButton from "../../../components/Buttons/raised";
import { withRouter } from 'react-router-dom';
import {Formik, Field} from 'formik';
import * as Yup from "yup";

const ResetConfirm = props => {

    const isLoading = useSelector(state => state.get("reset").isLoading);
    const errorText = useSelector(state => state.get("reset").errorText);
    const dispatch = useDispatch();
    
    return (
        <Formik
            initialValues={{
                code: '',
                password: ''
            }}
            validationSchema={() => Yup.object().shape({
                code: Yup.string().min(6).max(6).required(),
                password: Yup.string().matches(/(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.{9,})|\b\d{6}\b/).required()
            })}
            onSubmit={values => {
                const {code, password} = values;
                dispatch(confirmReset(code, password, props));
            }}>
            {({isValid, dirty, submitForm}) => (
                <Grid container justify="center">
                    <Grid item xs={9} style={{marginTop: 15}}>
                        <Grid container justify="center">
                            <Grid item>
                                <img
                                    src={require('../../../../assets/img/logo_full.svg')}
                                    alt='logo'
                                    width={240}
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => {
                                        props.history.push('/user/auth')
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={9} style={{marginTop: 20}}>
                        <Grid container justify="center">
                            <Grid item>
                                <Typography variant='h4' align='center' style={{fontSize: 16}}>
                                    Завершение восстановления пароля
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={9} style={{marginTop: 25}}>
                        <ErrorText text={errorText} />
                    </Grid>
                    <Grid item xs={9} style={{marginTop: 45}}>
                        <PhoneTextField
                            disabled={true}
                            value={`${window.localStorage.getItem('tempPhone')}`}/>
                    </Grid>
                    <Field name="code">
                        {({field: {value}, form: {setFieldValue}}) => (
                            <Grid item xs={9} style={{marginTop: 20}}>
                                <TextField
                                    label='СМС код'
                                    fullWidth
                                    variant="outlined"
                                    InputProps={{
                                        autoComplete: false
                                    }}
                                    value={value}
                                    onChange={event => {
                                        dispatch(setErrorText(''));
                                        setFieldValue('code', event.target.value)
                                    }}
                                    style={{
                                        marginTop: 20
                                    }}
                                />
                            </Grid>
                        )}
                    </Field>

                    <Field name="password">
                        {({field: {value}, form: {setFieldValue}}) => (
                            <Grid item xs={9} style={{marginTop: 20}}>
                                <PasswordTextField
                                    value={value}
                                    onChange={event => {
                                        dispatch(setErrorText(''));
                                        setFieldValue('password', event.target.value)
                                    }}
                                    style={{
                                        fontSize: 30
                                    }}
                                />
                            </Grid>
                        )}
                    </Field>

                    <Grid item xs={9} style={{marginTop: 30}}>
                        <RaisedButton
                            type="submit"
                            disabled={!(isValid && dirty && !isLoading)}
                            onClick={submitForm}
                            title="Подтвердить"
                        />
                    </Grid>
                </Grid>
            )}
        </Formik>
    )
}

export default withRouter(ResetConfirm);
