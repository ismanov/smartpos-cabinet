import React from 'react';
import {Grid, Typography} from '@material-ui/core';
import PhoneTextField from '../../../components/Textfields/phone';
import ErrorText from '../../../components/sptext/error';
import {Link, withRouter} from 'react-router-dom';
import {Formik, Field} from 'formik';
import {useDispatch, useSelector} from "react-redux";
import RaisedButton from "../../../components/Buttons/raised";
import * as Yup from "yup";
import {requestReset, setErrorText} from "./actions";

const Reset = props => {

    const isLoading = useSelector(state => state.get('reset').isLoading);
    const errorText = useSelector(state => state.get('reset').errorText);
    const dispatch = useDispatch();

    return (

        <Formik
            initialValues={{
                phoneNumber: ''
            }}
            validationSchema={() => Yup.object().shape({
                phoneNumber: Yup.string().min(12).required()
            })}
            onSubmit={values => {
                const {phoneNumber} = values;
                dispatch(requestReset(phoneNumber, props))
            }}>
            {({isValid, dirty, submitForm}) => (
                <Grid container justify="center">
                    <Grid item xs={9} style={{marginTop: 30}}>
                        <Grid container justify="center">
                            <Grid item>
                                <img
                                    src={require('../../../../assets/img/logo_full.svg')}
                                    alt='logo'
                                    width={240}
                                    style={{cursor: 'pointer'}}
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
                                Восстановить аккаунт
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={9} style={{marginTop: 45}}>
                        <ErrorText text={errorText}/>
                    </Grid>
                    <Field name="phoneNumber">
                        {({field: {value}, form: {setFieldValue}}) => (
                            <Grid item xs={9} style={{marginTop: 30}}>
                                <PhoneTextField
                                    value={value}
                                    onPhoneChange={(_, phone) => {
                                        dispatch(setErrorText(''))
                                        setFieldValue('phoneNumber', phone)
                                    }}
                                />
                            </Grid>
                        )}
                    </Field>

                    <Grid xs={9} style={{marginTop: 30}}>
                        <RaisedButton
                            type="submit"
                            fullWidth
                            onClick={submitForm}
                            disabled={!(isValid && dirty && !isLoading)}
                            title="Отправить"
                        />
                    </Grid>
                    <Grid container justify='center' direction='row' style={{marginTop: 35}}>
                        <Typography variant='h1' style={{fontSize: 18, color: '#666'}}> Есть аккаунт? &nbsp;</Typography>
                        <Link to='/user/auth' style={{color: '#009f3c', textDecoration: 'none'}}>Авторизоваться!</Link>
                    </Grid>
                    {/*<Grid container justify='center' style={{marginTop: 15}}>*/}
                    {/*    <Typography variant='h1' style={{fontSize: 18, color: '#666'}}> Нет аккаунта? &nbsp;</Typography>*/}
                    {/*    <Link to='/user/signup' style={{color: '#009f3c', textDecoration: 'none'}}> Зарегистрироваться! </Link>*/}
                    {/*</Grid>*/}
                </Grid>
            )}
        </Formik>
    )
}

export default withRouter(Reset);