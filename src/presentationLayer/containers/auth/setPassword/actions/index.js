import { SET_PASSWORD_LOADING, SET_PASSWORD_ERROR_TEXT } from "../reducer";
import { of, from, } from 'rxjs';
import { tap, mergeMap, map, mapTo, } from 'rxjs/operators';
import * as R from 'ramda';
import { localStorageHelper } from '../../../../../coreLayer/helpers/memoryUtils';

export const setPasswordRx = (newPassword, history) => dispatch => of({ type: SET_PASSWORD_LOADING, payload: true })
    .pipe(
        tap(dispatch),
        map(() => localStorageHelper.get("phone")),
        mergeMap((phone) => from(() => Logic.user.setPassword(phone, newPassword))),
        mapTo({type: SET_PASSWORD_LOADING, payload: false}),
        tap(dispatch),
    )
    .subscribe({
        next: () => history.push('/user/auth'),
        error: (error) => {
            dispatch({
                type: SET_PASSWORD_LOADING,
                payload: false
            });
            dispatch(setErrorText(error.message));
        }
    })

export const setPassword = (newPassword, props) => {
    return dispatch => {
        dispatch({
            type: SET_PASSWORD_LOADING,
            payload: true
        });
        let token = localStorage.getItem('temp');
        Logic
            .user
            .setPassword(token, newPassword)
            .then(() =>  {
                localStorage.removeItem('temp');
                dispatch({
                    type: SET_PASSWORD_LOADING,
                    payload: false
                });
                props.history.push('/init-config')
            })
            .catch(error => {
                dispatch({
                    type: SET_PASSWORD_LOADING,
                    payload: false
                });
                dispatch(setErrorText(error.message));
            })
    }
};

export const setErrorText = (text) => ({
    type: SET_PASSWORD_ERROR_TEXT,
    payload: text
})