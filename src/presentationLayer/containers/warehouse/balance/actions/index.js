import {
    PRODUCT_BALANCE, PRODUCT_BALANCE_STATS, SEARCH_LOADING,
    PRODUCT_BALANCE_LIST_LOADING, PRODUCT_BALANCE_UNIT_LIST,
    PRODUCT_BALANCE_SEARCH_PRODUCTS, PRODUCT_BALANCE_SEARCH_LOADING,
    SEARCH_MY_CATALOG, PRODUCT_BALANCE_SORT, PRODUCT_BALANCE_SELECTED_CATS,
    PRODUCT_BALANCE_PRODUCT_ID
} from '../reducer';
import Logic from "#businessLayer";
import axios from "axios";

const CancelToken = axios.CancelToken;
var source = CancelToken.source();

export const setProduct = (product) => ({
    type: PRODUCT_BALANCE_PRODUCT_ID,
    payload: product
});

export const setBalanceSort = (sort) => ({
    type: PRODUCT_BALANCE_SORT,
    payload: sort,
});

export const setSelectedCategories = (categories) => ({
    type: PRODUCT_BALANCE_SELECTED_CATS,
    payload: categories,
});

export const fetchProductBalanceList = (branchId, page, size, sort, search, categoryIds, productId) => {
    return dispatch => {
        dispatch({
            type: PRODUCT_BALANCE_LIST_LOADING,
            payload: true
        });
        Logic
            .warehouse
            .fetchProductBalance({
                branchId,
                page,
                size,
                orderBy: sort ? sort.col : undefined,
                sortOrder: sort ? sort.order: undefined,
                search,
                categoryIds,
                productId
            })
            .then(response => {
                dispatch({
                    type: PRODUCT_BALANCE,
                    payload: response.data
                });
                dispatch({
                    type: PRODUCT_BALANCE_LIST_LOADING,
                    payload: false
                });
            })
            .catch(error => {
                dispatch({
                    type: PRODUCT_BALANCE_LIST_LOADING,
                    payload: false
                });
            })
    }
};

export const fetchProductsBalanceStats = (branchId, page, size, sort, search, categoryIds, productId) => {
    return dispatch => {

        Logic
            .warehouse
            .fetchProductBalanceStats({
                branchId,
                page,
                size,
                orderBy: sort ? sort.col : undefined,
                sortOrder: sort ? sort.order: undefined,
                search,
                categoryIds,
                productId
            })
            .then(response => {
                dispatch({
                    type: PRODUCT_BALANCE_STATS,
                    payload: response.data
                });
            })
            .catch(console.log)
    }
};

export const fetchUnitsWithCoeff = (productId, branchId, withBalance) => {
    return dispatch => {
        Logic
            .resource
            .fetchUnitListWithCoeff(productId, branchId, withBalance)
            .then(response => {
                dispatch({
                    type: PRODUCT_BALANCE_UNIT_LIST,
                    payload: response.data
                })
            })
            .catch(console.log)
    }
};

export const searchMyCatalog = (search, branchId) => {
    return dispatch => {
        source.cancel('request_cancelled');
        source = CancelToken.source();
        Logic
            .myCatalog
            .searchMyCatalog({ search, branchId }, source.token)
            .then(response => {
                dispatch({
                    type: SEARCH_MY_CATALOG,
                    payload: response.data
                })
            })
            .catch(console.log)
    }
};

export const fetchProductListForKeyword = (keyword, withBalance, branchId) => {
    return dispatch => {
        dispatch({
            type: SEARCH_LOADING,
            payload: true
        });
        source.cancel('Остановить запрос!');
        source = CancelToken.source();
        Logic
            .product
            .fetchProductListForKeyword({search: keyword, withBalance, branchId}, source.token)
            .then(response => {
                dispatch({
                    type: PRODUCT_BALANCE_SEARCH_PRODUCTS,
                    payload: response.data
                });
                dispatch({
                    type: SEARCH_LOADING,
                    payload: false
                })
            })
            .catch(error => {
                dispatch({
                    type: SEARCH_LOADING,
                    payload: false
                })
            })
    }
};

export const clearUnitsCoeff = () => {
    return {
        type: PRODUCT_BALANCE_UNIT_LIST,
        payload: []
    }
};

export const clearProductList = () => {
    return {
        type: PRODUCT_BALANCE_SEARCH_PRODUCTS,
        payload: []
    }
};
