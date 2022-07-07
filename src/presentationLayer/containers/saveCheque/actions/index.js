import Logic from '#businessLayer';
import { SAVE_CHEQUE_TERMINALS } from '../reducer';

export const fetchTerminalsForBranchId = (branchId) => {
    return dispatch => {
        Logic
            .terminal
            .fetchTerminalsByBranchId({branchId})
            .then(response => {
                dispatch({
                    type: SAVE_CHEQUE_TERMINALS,
                    payload: response.data.data || []
                })
            })
            .catch(error => { console.log(error) })
    }
};

export const createCheque = (cheque, props, callback) => {
    return () => {
        Logic
            .cheque
            .createCheque(cheque)
            .then(() => {
                props.success && props.success("Чек создан успешно!");
                callback && callback();
            })
            .catch(error => {
                props.error && props.error(error.toString());
            })
    }
};