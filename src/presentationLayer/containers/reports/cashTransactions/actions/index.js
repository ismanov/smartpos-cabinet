import Logic from '#businessLayer';
import {
    CASH_TRANSACTION_LOADING,
    CASH_TRANSACTION_LIST,
    CASH_TRANSACTION_LIST_SORT,
    CASH_TRANSACTION_CASHIER,    
    CASH_TRANSACTION_STATUSES,
    CASH_TRANSACTION_CHEQUE_LOADING,
    CASH_TRANSACTION_CHEQUE, 
    CASH_TRANSACTION_OPERATION,
    CASH_TRANSACTION_STATS
} from '../reducer';

export const setCashierId = (id) => {
    return {
        type: CASH_TRANSACTION_CASHIER,
        payload: id
    }
};

export const setSort = (sort) => ({
    type: CASH_TRANSACTION_LIST_SORT,
    payload: sort,
})

export const setOperation = (operation) => {
    return {
        type: CASH_TRANSACTION_OPERATION,
        payload: operation
    }
}

export const setCheque = (cheque) => {
    return {
        type: CASH_TRANSACTION_CHEQUE,
        payload: cheque
    }
}

export const fetchCashOperationChequesList = ({ sort, page, size, userId, from, to, branchId, search, status }) => {
    return dispatch => {
        dispatch({
            type: CASH_TRANSACTION_LOADING,
            payload: true
        });
        Logic
            .report
            .fetchCashOperationsChequeList({
                orderBy: sort ? sort.col : undefined, 
                sortOrder: sort ? sort.order : undefined,
                page,
                size,
                userId,
                from,
                to,
                branchId,
                search,
                status,
            })
            .then(response => {
                dispatch({
                    type: CASH_TRANSACTION_LOADING,
                    payload: false
                });
                dispatch({
                    type: CASH_TRANSACTION_LIST,
                    payload: response.data
                })
            })
            .catch(error => {
                console.log(error)
                dispatch({
                    type: CASH_TRANSACTION_LOADING,
                    payload: false
                });
            })

    }
};

export const fetchCashOperationsStatuses = () => {
    return dispatch => {

        Logic
            .report
            .fetchChequeOperationStatus()
            .then(response => {
                dispatch({
                    type: CASH_TRANSACTION_STATUSES,
                    payload: response.data
                })
            })
            .catch(error => {
                console.log(error)
            })

    }
};

export const fetchChequeById = (id) => {
    return dispatch => {
        dispatch({
            type: CASH_TRANSACTION_CHEQUE_LOADING,
            payload: true
        });
        Logic
            .report
            .fetchChequeById(id)
            .then(response => {
                dispatch({
                    type: CASH_TRANSACTION_CHEQUE,
                    payload: response.data
                });
                dispatch({
                    type: CASH_TRANSACTION_CHEQUE_LOADING,
                    payload: false
                });
            })
            .catch(error => {
                alert(error)
                dispatch({
                    type: CASH_TRANSACTION_CHEQUE_LOADING,
                    payload: false
                });
            })
    }
};

export const fetchStats = (filter) => {
    return dispatch => {
        Logic
            .report
            .cashTransactionStats(filter)
            .then(response => {
                dispatch({
                    type: CASH_TRANSACTION_STATS,
                    payload: response.data
                })
            })
    }
}