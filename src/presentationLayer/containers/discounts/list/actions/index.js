import Logic from '#businessLayer';
import { DISCOUNT_LIST, DISCOUNT_STATS, DISCOUNT_LOADING, DISCOUNT_END_DATE, DISCOUNT_START_DATE, DISCOUNT_SORT, DISCOUNT_NDS, DISCOUNT_STATUS, } from '../reducer';
import axios from "axios";

const CancelToken = axios.CancelToken;
var sourceList = CancelToken.source();

var sourceStats = CancelToken.source();

export const setStartDate = (startDate) => ({
    type: DISCOUNT_START_DATE,
    payload: startDate,
});

export const setEndDate = (endDate) => ({
    type: DISCOUNT_END_DATE,
    payload: endDate,
});

export const setSort = (sort) => ({
    type: DISCOUNT_SORT,
    payload: sort,
});

export const setNds = (nds) => ({
    type: DISCOUNT_NDS,
    payload: nds,
});

export const setStatus = (status) => ({
    type: DISCOUNT_STATUS,
    payload: status,
});

export const fetchDiscountList = (branchId, page, size, vat, status, search, from, to, sort) => {
    return dispatch => {
        sourceList.cancel('Остановить запрос!');
        sourceList = CancelToken.source();
        dispatch({type: DISCOUNT_LOADING, payload: true});
        Logic
            .discounts
            .fetchDiscountList({branchId, page, size, includeVat: vat === undefined || vat === '' ? undefined : vat === 0, status, search, from, to, orderBy: sort ? sort.col : undefined, sortOrder: sort ? sort.order : undefined}, sourceList.token)
            .then(response => {
                dispatch({
                    type: DISCOUNT_LIST,
                    payload: response.data
                });
                dispatch({type: DISCOUNT_LOADING, payload: false});
            })
            .catch((error) => {
                console.log(error);
                dispatch({type: DISCOUNT_LOADING, payload: false});
            });
    }
};

export const createDiscount = (discount, props) => {
    return dispatch => {
        dispatch({
            type: DISCOUNT_LOADING,
            payload: true
        })
        Logic
            .discounts
            .createDiscount(discount)
            .then(_ => {
                props.success('Акция Добавлена успешно!');
                dispatch({
                    type: DISCOUNT_LOADING,
                    payload: false
                })
                props.history.goBack()
            })
            .catch(console.log);
    }
};


export const fetchDiscountStats = (branchId, page, size, vat, status, search, from, to) => {
    return dispatch => {
        sourceStats.cancel('Остановить запрос!');
        sourceStats = CancelToken.source();
        Logic
            .discounts
            .fetchDiscountStats({branchId, page, size, includeVat: vat === undefined || vat === '' ? undefined : vat === 0, status, search, from, to}, sourceList.token)
            .then(response => {
                dispatch({
                    type: DISCOUNT_STATS,
                    payload: response.data
                })
            })
            .catch(console.log);
    }
};
