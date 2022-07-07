import Logic from '#businessLayer';
import { SIGN_UP_LOADING, SIGN_UP_ERROR_TEXT } from '../reducer';

export const registerViaSMS = (phoneNumber, props) => {
    return dispatch => {
        dispatch({
            type: SIGN_UP_LOADING,
            payload: true
        });
        Logic
            .auth
            .registerViaSMS(phoneNumber)
            .then(() => {
                localStorage.setItem('phoneNumber', phoneNumber);
                dispatch({
                    type: SIGN_UP_LOADING,
                    payload: false
                });
                props.history.push('/user/confirm')
            })
            .catch(error => {
                dispatch({
                    type: SIGN_UP_LOADING,
                    payload: false
                });
                if (error.response && error.response.status === 400) {
                    dispatch(setErrorText('Указанный номер уже зарегистрирован! Попробуйте восстановить пароль!'))
                } else {
                    dispatch(setErrorText(error.message))
                }
            })
    }
};

export const setErrorText = (text) => ({
    type: SIGN_UP_ERROR_TEXT,
    payload: text
})