import Logic from '#businessLayer';
import axios from "axios";
import {
    BALANCE_BY_DAY_SEARCH_CATALOG,
    PRODUCT_BALANCE_BY_DAY,
    PRODUCT_BALANCE_STATS,
    PRODUCT_BALANCE_BY_DAY_SEARCH_PRODUCTS,
    PRODUCT_BALANCE_BY_DAY_SEARCH_PRODUCTS_LOADING,
    PRODUCT_BALANCE_BY_DAY_SELECTED_DAY,
    PRODUCT_BALANCE_BY_DAY_SELECTED_PRODUCT,
    PRODUCT_BALANCE_BY_DAY_SELECTED_CATEGORIES,
    PRODUCT_BALANCE_BY_DAY_SORT,
} from "../reducer";


const CancelToken = axios.CancelToken;
var source = CancelToken.source();

export const setSort = (sort) => ({
    type: PRODUCT_BALANCE_BY_DAY_SORT,
    payload: sort
})

export const setProduct = (product) => ({
    type: PRODUCT_BALANCE_BY_DAY_SELECTED_PRODUCT,
    payload: product
});

export const setSelectedCategories = (categories) => ({
    type: PRODUCT_BALANCE_BY_DAY_SELECTED_CATEGORIES,
    payload: categories,
});

export const setDate = (date) => ({
    type: PRODUCT_BALANCE_BY_DAY_SELECTED_DAY,
    payload: date
});

export const searchMyCatalog = (search, branchId) => {
    return dispatch => {
        source.cancel('request_cancelled');
        source = CancelToken.source();
        Logic
            .myCatalog
            .searchMyCatalog({ search, branchId }, source.token)
            .then(response => {
                dispatch({
                    type: BALANCE_BY_DAY_SEARCH_CATALOG,
                    payload: response.data
                })
            })
            .catch(console.log)
    }
};

export const fetchProductsBalanceByDay = (balanceDate, branchId, page, size, sort, search, categoryIds, productId) => {
    return dispatch => {

        Logic
            .warehouse
            .fetchProductBalanceByDay({
                branchId,
                page,
                size,
                orderBy: sort ? sort.col : undefined,
                sortOrder: sort ? sort.order: undefined,
                search,
                categoryIds,
                productId,
                balanceDate
            })
            .then(response => {
                dispatch({
                    type: PRODUCT_BALANCE_BY_DAY,
                    payload: response.data
                });
            })
            .catch(error => {
                console.log(error)
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
            .catch(error => {
                console.log(error)
            })
    }
};

export const fetchProductListForKeyword = (keyword, withBalance, branchId) => {
    return dispatch => {
        dispatch({
            type: PRODUCT_BALANCE_BY_DAY_SEARCH_PRODUCTS_LOADING,
            payload: true
        });
        source.cancel('Остановить запрос!');
        source = CancelToken.source();
        Logic
            .product
            .fetchProductListForKeyword({search: keyword, withBalance, branchId}, source.token)
            .then(response => {
                dispatch({
                    type: PRODUCT_BALANCE_BY_DAY_SEARCH_PRODUCTS,
                    payload: response.data
                });
                dispatch({
                    type: PRODUCT_BALANCE_BY_DAY_SEARCH_PRODUCTS_LOADING,
                    payload: false
                })
            })
            .catch(error => {
                dispatch({
                    type: PRODUCT_BALANCE_BY_DAY_SEARCH_PRODUCTS_LOADING,
                    payload: false
                })
            })
    }
};
