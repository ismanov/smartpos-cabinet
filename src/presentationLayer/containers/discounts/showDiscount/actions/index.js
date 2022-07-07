import Logic from '#businessLayer';
import {INFO_DISCOUNT} from "../reducer";

export const fetchDiscountById = (id) =>  {
    return dispatch => {
        Logic
            .discounts
            .fetchDiscountById(id)
            .then(response => {
                dispatch(setDiscountInfo(response.data));
            })
            .catch(console.log)
    }
};

export const setDiscountInfo = (info) => {
    return {
        type: INFO_DISCOUNT,
        payload: info
    }
};

export const changeStatus = (id, status, callback) => {
    return dispatch => {
        Logic
            .discounts
            .changeStatus(id, status)
            .then(response => {
                dispatch({
                    type: INFO_DISCOUNT,
                    payload: response.data
                })
                callback && callback()
            })
            .catch(console.log)
    }
};

export const updateDiscount = (discount, callback) => {
    return dispatch => {
        Logic
            .discounts
            .updateDiscount(discount)
            .then(response => {
                dispatch({
                    type: INFO_DISCOUNT,
                    payload: response.data
                })
                callback && callback()
            })
            .catch(console.log)
    }
}
