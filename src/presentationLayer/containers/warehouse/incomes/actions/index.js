import Logic from '#businessLayer';
import {INCOME_LIST, INCOME_LIST_IS_LOADING, INCOME, INCOME_SUPPLIER_LIST, SUPPLIER_ID} from '../reducer';

export const createIncome = (income, goBack) => {
    return dispatch => {
        dispatch({
            type: INCOME_LIST_IS_LOADING,
            payload: true
        });
        Logic
            .income
            .createIncome(income)
            .then(() => {
                dispatch({
                    type: INCOME_LIST_IS_LOADING,
                    payload: false
                });
                goBack && goBack();
            })
            .catch(error => {
                dispatch({
                    type: INCOME_LIST_IS_LOADING,
                    payload: false
                });
                console.log(error)
            })
    }
};

export const fetchIncomeList = (page, size, branchId, supplierId, sort) => {
    return dispatch => {
        dispatch({
            type: INCOME_LIST_IS_LOADING,
            payload: true
        });
        Logic
            .income
            .fetchIncomeList({page, size, branchId, contractorId: supplierId, orderBy: sort ? sort.col : undefined, sortOrder: sort ? sort.order : undefined})
            .then(response => {
                dispatch({
                    type: INCOME_LIST,
                    payload: response.data
                });
                dispatch({
                    type: INCOME_LIST_IS_LOADING,
                    payload: false
                });
            })
            .catch(error => {
                alert(error)
                dispatch({
                    type: INCOME_LIST_IS_LOADING,
                    payload: false
                });
            })
    }
};

export const fetchIncomeById = (id) => {
    return dispatch => {
        dispatch({
            type: INCOME_LIST_IS_LOADING,
            payload: true
        });
        Logic
            .income
            .fetchIncomeById(id)
            .then(response => {
                dispatch({
                    type: INCOME,
                    payload: response.data
                });
                dispatch({
                    type: INCOME_LIST_IS_LOADING,
                    payload: false
                });
            })
            .catch(error => {
                alert(error);
                dispatch({
                    type: INCOME_LIST_IS_LOADING,
                    payload: false
                });
            })
    }
};

export const setSupplierId = (supplierId) => {
    return {
        type: SUPPLIER_ID,
        payload: supplierId
    }
};

export const fetchSupplierList = ({page, size, sort, search}) => {
    return dispatch => {
        dispatch({
            type: INCOME_LIST_IS_LOADING,
            payload: true
        });

        Logic
            .supplier
            .fetchSupplierList({page, size, orderBy: sort ? sort.col : undefined, sortOrder: sort ? sort.order : undefined, search})
            .then(response => {
                dispatch({
                    type: INCOME_LIST_IS_LOADING,
                    payload: false
                });
                dispatch({
                    type: INCOME_SUPPLIER_LIST,
                    payload: response.data
                })
            })
            .catch(error => {
                dispatch({
                    type: INCOME_LIST_IS_LOADING,
                    payload: false
                });
                console.log(error)
            })
    }
};
