import React from 'react';
import { Typography, Grid, Checkbox } from '@material-ui/core';
import PhoneTextField from '../../../components/Textfields/phone';
import ErrorText from '../../../components/sptext/error';
import {Link, withRouter} from 'react-router-dom';
import RaisedButton from "#components/Buttons/raised";
import {makeStyles} from "@material-ui/core/styles";
import {Formik, Field} from 'formik';
import * as Yup from 'yup';
import {useDispatch, useSelector} from "react-redux";
import {registerViaSMS, setErrorText} from "./actions";

const useStyles = makeStyles((theme) => ({
    container: {
        height: '100%'
    }
}));

const SignUp = props => {

    const isLoading = useSelector(state => state.get('signup').isLoading);
    const errorText = useSelector(state => state.get('signup').errorText);
    const dispatch = useDispatch();
    const classes = useStyles()

    return (
        <Formik
            initialValues={{
                phoneNumber: '',
                checked: false
            }}
            validationSchema={() => Yup.object().shape({
                phoneNumber: Yup.string().min(12).required(),
                checked: Yup.bool().oneOf([true])
            })}
            onSubmit={values => {
                let {phoneNumber} = values;
                dispatch(registerViaSMS(phoneNumber))

            }}>
            {({isValid, dirty}) => (
                <Grid container className={classes.container} justify='center'>
                    <Grid item xs={9} style={{marginTop: 20}}>
                        <Grid container justify="center">
                            <Grid item>
                                <img
                                    src={require('../../../../assets/img/logo_full.svg')}
                                    alt='logo' width={240}
                                    onClick={() => { props.history.push('/user/auth') }}
                                    style={{ cursor: 'pointer' }}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={9} style={{marginTop: 20}}>
                        <Grid container justify="center">
                            <Grid item>
                                Регистрация
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={9} style={{marginTop: 40}}>
                        <Grid container justify='center'>
                            <Grid item>
                                <ErrorText
                                    text={errorText}
                                    value={this.state.phoneNumber}
                                    onPhoneChange={(valid, phoneNumber) => this.setState({ phoneNumber: phoneNumber })}
                                />
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={9} style={{marginTop: 15}}>
                        <Field name="username">
                            {({field: {value}, form: {setFieldValue}}) => (
                                <PhoneTextField
                                    value={value}
                                    onPhoneChange={(_, phoneNumber) => {
                                        setFieldValue('phoneNumber', phoneNumber);
                                        dispatch(setErrorText(''))
                                    }}
                                />
                            )}
                        </Field>
                    </Grid>
                    <Grid item xs={9} style={{marginTop: 15}}>
                        <Field name="username">
                            {({field: {value}, form: {setFieldValue}}) => (
                                <Grid container justify='center' alignItems='center' style={{marginTop: 15}}>
                                    <Grid item xs={1}>

                                        <Checkbox
                                            color='primary'
                                            value={value}
                                            onChange={(event, checked) => {
                                                setFieldValue('checked', checked);
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={11} style={{paddingLeft: 10}}>
                                        <Typography variant='inherit' style={{fontSize: 17, textAlign: 'justify', color: 'black'}}> Я ознакомлен(а) и согласен с <a href='https://storage.smartpos.uz/oferta_smartpos.pdf' style={{color: '#009f3c', textDecoration: 'none'}}>Условиями Использования.</a> </Typography>
                                    </Grid>
                                </Grid>
                            )}
                        </Field>
                    </Grid>
                    <Grid item xs={9} style={{marginTop: 20}}>
                        <RaisedButton
                            type="submit"
                            disabled={!(isValid && dirty && !isLoading)}
                            isLoading={isLoading}
                            title='Регистрация'
                        />
                    </Grid>

                    <Grid container justify='center' direction='row' style={{marginTop: 25}}>
                        <Typography variant='h1' style={{fontSize: 18, color: '#666'}}> Есть аккаунт? &nbsp;</Typography>
                        <Link to='/user/auth' style={{color: '#009f3c', textDecoration: 'none'}}>Авторизуйтесь!</Link>
                    </Grid>
                    <Grid container justify='center' style={{marginTop: 15}}>
                        <Link to='/user/reset' style={{color: '#009f3c', textDecoration: 'none'}}> Забыли пароль? </Link>
                    </Grid>
                </Grid>
            )}

        </Formik>

    )
}

export default withRouter(SignUp);
