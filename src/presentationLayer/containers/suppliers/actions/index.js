import Logic from '#businessLayer';
import {SUPPLIER_LIST_LOADING, SUPPLIER_LIST, SUPPLIER_ERROR_TEXT} from "../reducer";

export const fetchSupplierList = ({page, size, sort, search}) => {
    return dispatch => {
        dispatch({
            type: SUPPLIER_LIST_LOADING,
            payload: true
        });        
        Logic
            .supplier
            .fetchSupplierList({page, size, orderBy: sort ? sort.col : undefined, sortOrder: sort ? sort.order : undefined, search})
            .then(response => {
                dispatch({
                    type: SUPPLIER_LIST_LOADING,
                    payload: false
                });
                
                dispatch({
                    type: SUPPLIER_LIST,
                    payload: response.data
                })
            })
            .catch(error => {
                dispatch({
                    type: SUPPLIER_LIST_LOADING,
                    payload: false
                });
                dispatch({
                    type: SUPPLIER_ERROR_TEXT,
                    payload: error.message
                })
            })
    }
};

export const createSupplier = (supplier, props) => {
    return dispatch => {
        dispatch({
            type: SUPPLIER_LIST_LOADING,
            payload: true
        });
        Logic
            .supplier
            .createSupplier(supplier)
            .then(response => {
                console.log('ondialog close 1', response)
                dispatch({
                    type: SUPPLIER_LIST_LOADING,
                    payload: false
                });                
                console.log('ondialog close 2', props)
                props.onDialogClose && props.onDialogClose(true)
            })
            .catch(error => {
                dispatch({
                    type: SUPPLIER_LIST_LOADING,
                    payload: false
                });
            })
    }
};

export const updateSupplier = (supplier, props) => {
    return dispatch => {
        dispatch({
            type: SUPPLIER_LIST_LOADING,
            payload: true
        });
        Logic
            .supplier
            .updateSupplier(supplier)
            .then(response => {
                dispatch({
                    type: SUPPLIER_LIST_LOADING,
                    payload: false
                });
                props.onDialogClose && props.onDialogClose(true)
            })
            .catch(error => {
                dispatch({
                    type: SUPPLIER_LIST_LOADING,
                    payload: false
                });
            })
    }
};

export const removeSupplier = (supplierId, update) => {
    return dispatch => {
        dispatch({
            type: SUPPLIER_LIST_LOADING,
            payload: true
        });
        Logic
            .supplier
            .removeSupplier(supplierId)
            .then(response => {
                dispatch({
                    type: SUPPLIER_LIST_LOADING,
                    payload: false
                });
                update && update();
            })
            .catch(error => {
                dispatch({
                    type: SUPPLIER_LIST_LOADING,
                    payload: false
                });
                dispatch({
                    type: SUPPLIER_ERROR_TEXT,
                    payload: error.message
                });
            })
    }
};
