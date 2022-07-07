import Logic from '#businessLayer';

import {
    REPORT_CHEQUES_BY_DISCOUNT_CHEQUE_LIST_STATUS,
    REPORT_CHEQUES_BY_DISCOUNT_CHEQUE_LOADING, 
    REPORT_CHEQUES_BY_DISCOUNT_DRAFT_CHEQUES_FLAG,
    REPORT_CHEQUES_BY_DISCOUNT_DATE,
    REPORT_CHEQUES_BY_DISCOUNT_LIST,
    REPORT_CHEQUES_BY_DISCOUNT_LOADING,
    REPORT_CHEQUES_BY_DISCOUNT_SELECTED_CHEQUE,
    REPORT_CHEQUES_BY_DISCOUNT_PAYMENT_TYPES,  
    REPORT_CHEQUES_BY_DISCOUNT_LIST_SELECTBOX,
    REPORT_CHEQUES_BY_DISCOUNT_LIST_SORT,
    REPORT_CHEQUES_BY_DISCOUNT_LIST_EMPLOYEE,
    REPORT_CHEQUES_BY_DISCOUNT_LIST_OPERATION,
    REPORT_CHEQUES_BY_DISCOUNT_LIST_PT,
    REPORT_CHEQUES_BY_DISCOUNT_LIST_DISCOUNT,
    REPORT_CHEQUES_BY_DISCOUNT_LIST_STATUS,
} from '../reducer';
import axios from "axios";

const CancelToken = axios.CancelToken;
var sourceList = CancelToken.source();

export const setStatus = (status) => ({
    type: REPORT_CHEQUES_BY_DISCOUNT_LIST_STATUS,
    payload: status,
});

export const setDiscount = (discount) => ({
    type: REPORT_CHEQUES_BY_DISCOUNT_LIST_DISCOUNT,
    payload: discount
});

export const setOperation = (operation) => ({
    type: REPORT_CHEQUES_BY_DISCOUNT_LIST_OPERATION,
    payload: operation
});

export const setPaymentType = (paymentType) => ({
    type: REPORT_CHEQUES_BY_DISCOUNT_LIST_PT,
    payload: paymentType,
})

export const setEmployeeId = (employeeId) => ({
    type: REPORT_CHEQUES_BY_DISCOUNT_LIST_EMPLOYEE,
    payload: employeeId,
})

export const setSort = (sort) => ({
    type: REPORT_CHEQUES_BY_DISCOUNT_LIST_SORT,
    payload: sort,
})

export const fetchChequeList = (filter) => {
    return dispatch => {
        dispatch({
            type: REPORT_CHEQUES_BY_DISCOUNT_LOADING,
            payload: true
        })
        Logic
            .report
            .fetchDiscountChequeList(filter)
            .then(response => {
                dispatch({
                    type: REPORT_CHEQUES_BY_DISCOUNT_LOADING,
                    payload: false
                })
                dispatch({
                    type: REPORT_CHEQUES_BY_DISCOUNT_LIST,
                    payload: response.data
                })
            })
            .catch(error => {
                dispatch({
                    type: REPORT_CHEQUES_BY_DISCOUNT_LOADING,
                    payload: false
                })
                console.log(error)
            })
    }
}

const paymentTypes = {
    "CASH": "Наличные",
    "CARD": "Карта",
    "UZCARD": "UZCARD",
    "HUMO": "HUMO",
    "LOYALTY_CARD": "Карта лояльности",
    "NDS": "НДС",
    "DISCOUNT": "Акции",
    "EXCISE": "Акциз",
    "OTHER": "Другое"
}

export const fetchPaymentTypes = () => {
    return dispatch => {
        Logic
            .report
            .fetchPaymentTypes()
            .then(response => {                
                dispatch({
                    type: REPORT_CHEQUES_BY_DISCOUNT_PAYMENT_TYPES,
                    payload: response.data.map(pt => ({key: pt, value: paymentTypes[pt]}))
                })
            })
            .catch(error => { console.log(error) })
    }
}

export const fetchDiscountSelectbox = (name, branchId) => {
    return dispatch => {
        sourceList.cancel('Остановить запрос!');
        sourceList = CancelToken.source();
        Logic
            .discounts
            .fetchDiscountSelectbox({name, branchId}, sourceList.token)
            .then(response => {
                console.log(response.data)
                dispatch({
                    type: REPORT_CHEQUES_BY_DISCOUNT_LIST_SELECTBOX,
                    payload: response.data
                })
            })
            .catch(console.log)
    }
}

export const fetchChequeStatuses = () => {
    return dispatch => {
        Logic
            .report
            .fetchChequeStatus()
            .then(response => {
                dispatch({
                    type: REPORT_CHEQUES_BY_DISCOUNT_CHEQUE_LIST_STATUS,
                    payload: response.data
                })
            })
            .catch(console.log)

    }
};

export const fetchChequeById = (id) => {
    return dispatch => {
        dispatch({
            type: REPORT_CHEQUES_BY_DISCOUNT_CHEQUE_LOADING,
            payload: true
        });
        Logic
            .report
            .fetchChequeById(id)
            .then(response => {
                dispatch({
                    type: REPORT_CHEQUES_BY_DISCOUNT_SELECTED_CHEQUE,
                    payload: response.data
                });
                dispatch({
                    type: REPORT_CHEQUES_BY_DISCOUNT_CHEQUE_LOADING,
                    payload: false
                });
            })
            .catch(error => {
                alert(error)
                dispatch({
                    type: REPORT_CHEQUES_BY_DISCOUNT_CHEQUE_LOADING,
                    payload: false
                });
            })
    }
};

export const setDate = (date) => {
    return dispatch => {
        dispatch({
            type: REPORT_CHEQUES_BY_DISCOUNT_DATE,
            payload: date
        })
    }
}

export const setDraftCheques = (flag) => {
    return dispatch => {
        dispatch({
            type: REPORT_CHEQUES_BY_DISCOUNT_DRAFT_CHEQUES_FLAG,
            payload: flag
        })
    }
}