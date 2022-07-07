import Logic from '#businessLayer';
import { cookieHelper } from '../../../../../../coreLayer/helpers/memoryUtils';
import { SIGNIN_LOADING, SIGNIN_ERROR_TEXT } from './reducer';
import { of } from 'rxjs';
import { tap, mergeMap, pluck, } from 'rxjs/operators';
import * as R from 'ramda';

export const signInAction = (username, password, history) => dispatch =>
    of({ type: SIGNIN_LOADING, payload: true }).pipe(
        tap(dispatch),
        mergeMap(() => Logic.auth.authenticate(username, password)),
        pluck("data", "access_token"),
        tap(token => cookieHelper.set("token", token)),
        mergeMap(() => Logic.user.getCurrentUser()),
        pluck("data", "authorities"),        
    ).subscribe({
        next: R.ifElse(
            R.anyPass([R.isNil, R.includes("ROLE_CASHIER")]),
            () => history.replace('/cashier'),
            () => history.replace('/main'),
            ),
        error: R.pipe(
            R.map(R.path(["response", "status"])),
            R.map(Number),
            R.cond([
                [(status) => R.equals(403, status), R.always({ type: SIGNIN_ERROR_TEXT, payload: 'У вас нет доступа в кабинет!' })],
                [(status) => R.equals(404, status), () => history.replace("/init-config")],
                [R.T, R.always({ type: SIGNIN_ERROR_TEXT, payload: 'Неправильный логин или пароль!' })],
            ]),
            dispatch,
            R.tap(() => dispatch({type: SIGNIN_LOADING, paylaod: false}))
        ),
        complete: () => dispatch({type: SIGNIN_LOADING, paylaod: false}),
    });

export const clearErrorTextAction = () => ({ type: SIGNIN_ERROR_TEXT, payload: undefined, });
