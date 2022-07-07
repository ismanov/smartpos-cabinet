import Logic from '#businessLayer';
import {CONFIRM_ERROR_TEXT, CONFIRM_LOADING} from "../reducer";
import {generateToken} from "../../../../../utils/random";
import memory from "../../../../../coreLayer/services/memory";


export const confirmCode = (phoneNumber, confirmationCode, props) => {
    return async dispatch => {
        try {
            dispatch({
                type: CONFIRM_LOADING,
                payload: true
            });
            let token = Math.random().toString(36).substring(2, 10);
            await Logic.auth.confirmCode(phoneNumber, confirmationCode, token);
            let response = await Logic.auth.authenticate(phoneNumber, token);
            memory.set('token', response.data.access_token);
            dispatch({
                type: CONFIRM_LOADING,
                payload: false
            });
            window.localStorage.setItem('temp', token);
            props.history.push('/user/setPassword')
        } catch(error) {
            dispatch({
                type: CONFIRM_LOADING,
                payload: false
            });
            if (error.response && error.response.status === 500) {
                dispatch(setErrorText('Неправильный код подтверждения!'))
            }
        }
    }
};

export const setErrorText = (text) => ({
    type: CONFIRM_ERROR_TEXT,
    payload: text
})