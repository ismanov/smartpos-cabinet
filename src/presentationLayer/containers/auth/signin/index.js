import React from 'react';
import {Grid} from '@material-ui/core';
import { Link } from 'react-router-dom';
import PhoneTextField from '#components/Textfields/phone';
import PasswordTextField from '#components/Textfields/password';
import ErrorText from '#components/sptext/error';
import { Button } from '../../../components/button';
import { makeStyles } from "@material-ui/core/styles";
import {Formik, Form, Field} from 'formik';
import * as Yup from 'yup';
import { useSignIn } from './hooks';

const useStyles = makeStyles((theme) => ({
    root: {
        height: '100%'
    },
    centered: {
        textAlign: 'center',
        width: '80%'
    },
    link: {
        marginTop: 15,
        textDecoration: 'none',
        color: theme.palette.primary.main
    },
    cashier: {
        marginTop: 15
    }
}));

const SignIn = () => {

    const classes = useStyles();    
    const { state, actions, history, } = useSignIn();

    return (
        <Formik
            initialValues={{
                username: '',
                password: ''
            }}
            validationSchema={() => Yup.object().shape({
                username: Yup.string().min(12).required(),
                password: Yup.string().matches(/(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.{9,})|\b\d{6}\b/).required()
            })}
            onSubmit={values => {
                const {username, password} = values;
                actions.signIn(username, password);
            }}>
            {({isValid, dirty}) => (
                <Form>
                    <Grid container className={classes.root} direction="column" justify="center" alignItems='center'>
                        <div className={classes.centered} style={{marginTop: 10}}>
                            <img
                                src={require('../../../../assets/img/logo_full.svg')}
                                alt='logo'
                                width={240}
                                onClick={() => { history.push('/user/auth') }}
                                style={{ cursor: 'pointer' }}
                            />
                        </div>
                        <div className={classes.centered} style={{marginTop: 10}}>
                            Вход в личный кабинет
                        </div>
                        <div className={classes.centered} style={{marginTop: 30}}>
                            <ErrorText text={state.errorText} />
                        </div>
                        <div className={classes.centered} style={{marginTop: 15}}>
                            <Field name="username">
                                {({field: {value}, form: {setFieldValue}}) => (
                                    <PhoneTextField
                                        value={value}
                                        onPhoneChange={(_, phoneNumber) => {
                                            setFieldValue('username', phoneNumber);
                                            actions.clearErrorText();
                                        }}
                                    />
                                )}
                            </Field>
                        </div>
                        <div className={classes.centered} style={{marginTop: 20}}>
                            <Field name="password">
                                {({field: {value}, form: {setFieldValue}}) => (
                                    <PasswordTextField
                                        value={value}
                                        onChange={(event) => {
                                            setFieldValue('password', event.target.value);
                                            actions.clearErrorText();
                                        }}
                                    />
                                )}
                            </Field>
                        </div>
                        <div className={classes.centered} style={{marginTop: 25}}>
                            <Button
                                rounded
                                type="submit"
                                variant="raised"                                
                                disabled={!(isValid && dirty && !state.isLoading)}
                                isLoading={state.isLoading}
                                title='Войти'
                            />
                        </div>                        
                        <Link to='/user/reset' className={classes.link}> Забыли пароль? </Link>
                    </Grid>
                </Form>
            )}
        </Formik>
    );
};

export default SignIn;
