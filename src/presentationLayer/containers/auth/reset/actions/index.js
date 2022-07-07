import Logic from '#businessLayer';
import { RESET_ERROR_TEXT, RESET_LOADING } from '../reducer';

export const requestReset = (phoneNumber, props) => {
    return dispatch => {
        dispatch({
            type: RESET_LOADING,
            payload: true
        });
        window.localStorage.setItem('tempPhone',  phoneNumber);
        Logic
            .auth
            .resetPasswordSendMessage(phoneNumber)
            .then(() => {
                dispatch({
                    type: RESET_LOADING,
                    payload: false
                });
                props.history.push('/user/reset-confirm')
            })
            .catch(error => {
                dispatch({
                    type: RESET_LOADING,
                    payload: false
                });
                if (error.response && error.response.status === 400) {
                    dispatch(setErrorText('Пользователь не найден!'))
                } else {
                    dispatch(setErrorText(error.message))
                }
            })
    }
};

export const setErrorText = (text) => ({ type: RESET_ERROR_TEXT, payload: text });


export const confirmReset = (confirmCode, newPassword, props) => {
    return dispatch => {
        dispatch({
            type: RESET_LOADING,
            payload: true
        });
        let phoneNumber = window.localStorage.getItem('tempPhone');
        Logic
            .auth
            .resetPasswordConfirm({key: confirmCode, login: phoneNumber, newPassword: newPassword})
            .then((json) => {
                dispatch({
                    type: RESET_LOADING,
                    payload: false
                });
                window.localStorage.removeItem('tempPhone');
                props.history.push('/user/auth')
            })
            .catch(error => {
                dispatch({
                    type: RESET_LOADING,
                    payload: false
                });
                dispatch(setErrorText('Неправильный код подтверждения!'));
            })
    }
};