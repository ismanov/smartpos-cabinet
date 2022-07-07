import Logic from '#businessLayer';
import { ADJUSTMENT_LIST, ADJUSTMENT_LIST_LOADING, ADJUSTMENT_LIST_PRODUCT, ADJUSTMENT_LIST_SORT, } from '../reducer';


export const setSort = (sort) => ({
    type: ADJUSTMENT_LIST_SORT,
    payload: sort,
})

export const setProduct = (product) => ({
    type: ADJUSTMENT_LIST_PRODUCT,
    payload: product,
});

export const fetchAdjustmentList = (page, size, branchId, sort, productId) => {
    return dispatch => {
        dispatch({
            type: ADJUSTMENT_LIST_LOADING,
            payload: true
        });
        Logic
            .adjustment
            .fetchAdjustmentList({page, size, orderBy: sort ? sort.col : undefined, sortOrder: sort ? sort.order : undefined, branchId, productId})
            .then(response => {
                dispatch({
                    type: ADJUSTMENT_LIST_LOADING,
                    payload: false
                });
                dispatch({
                    type: ADJUSTMENT_LIST,
                    payload: response.data
                })
            })
            .catch(error => {
                dispatch({
                    type: ADJUSTMENT_LIST_LOADING,
                    payload: false
                });
                console.log(error)
            })
    }
};

export const createAdjustment = (adjustment, props, f) => {
    return dispatch => {
        dispatch({
            type: ADJUSTMENT_LIST_LOADING,
            payload: true
        });
        Logic
            .adjustment
            .createAdjustment(adjustment)
            .then(() => {
                dispatch({
                    type: ADJUSTMENT_LIST_LOADING,
                    payload: false
                });
                f && f();
                props && props.history.goBack();
            })
            .catch(error => {
                dispatch({
                    type: ADJUSTMENT_LIST_LOADING,
                    payload: false
                });
                console.log(error)
            })
    }
};
