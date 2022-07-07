import Logic from '#businessLayer';
import { PRODUCT_BALANCE_CARD } from '../reducer';

export const fetchProductBalanceById = (branchId, productId) => {
    return dispatch => {
        Logic
            .warehouse
            .fetchProductBalanceById({branchId, productId})
            .then(response => {
                dispatch({
                    type: PRODUCT_BALANCE_CARD,
                    payload: response.data
                });
            })
            .catch(console.log)
    }
};
