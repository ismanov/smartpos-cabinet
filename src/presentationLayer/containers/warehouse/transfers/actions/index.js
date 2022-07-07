
import Logic from '#businessLayer';
import { TRANSFER, TRANSFER_LIST, TRANSFER_LOADING } from '../reducer';

export const fetchTransferList = (page, size, branchId, sort) => {
    return dispatch => {
        dispatch({
            type: TRANSFER_LOADING,
            payload: true
        });
        Logic
            .transfer
            .fetchAllTransfers({page, size, branchId, orderBy: sort ? sort.col : undefined, sortOrder: sort ? sort.order : undefined})
            .then(response => {
                dispatch({
                    type: TRANSFER_LIST,
                    payload: response.data
                });
                dispatch({
                    type: TRANSFER_LOADING,
                    payload: false
                });                
            })
            .catch(error => {
                dispatch({
                    type: TRANSFER_LOADING,
                    payload: false
                });
            })
    }
};

export const fetchTransferById = id => {
    return dispatch => {
        Logic
            .transfer
            .fetchTransferById(id)
            .then(response => {
                dispatch({
                    type: TRANSFER,
                    payload: response.data
                })
            })
            .catch(console.log)
    }
};

export const requestTransfer = (transfer, props) => {
    return dispatch => {
        dispatch({
            type: TRANSFER_LOADING,
            payload: true
        });
        Logic
            .transfer
            .requestTransfer(transfer)
            .then(response => {
                dispatch({
                    type: TRANSFER_LOADING,
                    payload: false
                });
                props.history.goBack()
            })
            .catch(error => {
                dispatch({
                    type: TRANSFER_LOADING,
                    payload: false
                });
            })
    }
};

export const createTransfer = (transfer, props, postmethod) => {
    return dispatch => {
        dispatch({
            type: TRANSFER_LOADING,
            payload: true
        });
        Logic
            .transfer
            .createTransfer(transfer)
            .then(response => {
                dispatch({
                    type: TRANSFER_LOADING,
                    payload: false
                });
                props && props.history.goBack && props.history.goBack();
                postmethod && postmethod()
            })
            .catch(error => {
                dispatch({
                    type: TRANSFER_LOADING,
                    payload: false
                });
            })
    }
};


export const approveTransfer = (transfer, props) => {
    return dispatch => {
        dispatch({
            type: TRANSFER_LOADING,
            payload: true
        });
        Logic
            .transfer
            .approveTransfer(transfer)
            .then(response => {
                dispatch({
                    type: TRANSFER_LOADING,
                    payload: false
                });
                props.history.goBack()
            })
            .catch(error => {
                dispatch({
                    type: TRANSFER_LOADING,
                    payload: false
                });
            })
    }
};

export const cancelTransfer = (transfer, props) => {
    return dispatch => {
        dispatch({
            type: TRANSFER_LOADING,
            payload: false
        });
        Logic
            .transfer
            .cancelTransfer(transfer)
            .then(response => {
                dispatch({
                    type: TRANSFER_LOADING,
                    payload: false
                });
                props.history.goBack()
            })
            .catch(error => {
                dispatch({
                    type: TRANSFER_LOADING,
                    payload: false
                });
            })
    }
};
