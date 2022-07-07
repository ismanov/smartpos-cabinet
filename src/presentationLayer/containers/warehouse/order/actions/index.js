import Logic from '#businessLayer';
import { ORDER_SUPPLIER_LIST, ORDER_LIST, ORDER_LIST_LOADING, ORDER, ORDER_LIST_SORT, ORDER_LIST_DATE, ORDER_LIST_STATUS, ORDER_LIST_SUPPLIER, } from '../reducer';
import moment from 'moment';

export const setSupplier = (supplier) => ({
    type: ORDER_LIST_SUPPLIER,
    payload: supplier,
})

export const setStatus = (status) => ({
    type: ORDER_LIST_STATUS,
    payload: status,
})

export const setDate = (date) => ({
    type: ORDER_LIST_DATE,
    payload: date
});

export const setSort = (sort) => ({
    type: ORDER_LIST_SORT,
    payload: sort,
});

export const fetchSupplierList = ({page, size, sort, search}) => {
    return dispatch => {
        Logic
            .supplier
            .fetchSupplierList({page, size, orderBy: sort ? sort.col : undefined, sortOrder: sort ? sort.order : undefined, search})
            .then(response => {
                dispatch({
                    type: ORDER_SUPPLIER_LIST,
                    payload: response.data
                })
            })
            .catch(console.log)
    }
};


export const fetchOrderList = (page, size, branchId, contractorId, status, fromDate, toDate, sort) => {
    return async dispatch => {
        try {
            dispatch({
                type: ORDER_LIST_LOADING,
                payload: true
            });
            let response = await Logic.order.fetchOrderList({ page, size, branchId, contractorId, status, from: fromDate, to: toDate, orderBy: sort ? sort.col : undefined, sortOrder: sort ? sort.order : undefined });
            dispatch({
                type: ORDER_LIST,
                payload: response.data
            })
            dispatch({
                type: ORDER_LIST_LOADING,
                payload: false
            });
        } catch(error) {
            console.log(error)
            dispatch({
                type: ORDER_LIST_LOADING,
                payload: false
            });
        }

    }
};

export const fetchOrderById = (orderId) => {
    return async dispatch => {
        try {
            dispatch({
                type: ORDER_LIST_LOADING,
                payload: true
            });
            let response = await Logic.order.fetchOrderById(orderId);
            dispatch({
                type: ORDER,
                payload: response.data
            })
            dispatch({
                type: ORDER_LIST_LOADING,
                payload: false
            });
        } catch(error) {
            console.log(error)
            dispatch({
                type: ORDER_LIST_LOADING,
                payload: false
            });
        }
    }
};

export const clearOrderItem = () => ({
    type: ORDER,
    payload: undefined
});

export const createOrder = (order, props) => {
    return async dispatch => {
        try {
            dispatch({
                type: ORDER_LIST_LOADING,
                payload: true
            });
            await Logic.order.createOrder(order);
            dispatch({
                type: ORDER_LIST_LOADING,
                payload: false
            });
            props.history.goBack();
        } catch (error) {
            console.log(error)
            dispatch({
                type: ORDER_LIST_LOADING,
                payload: false
            });
        }
    }
}

export const updateOrder = (order, props) => {
    return async dispatch => {
        try {
            dispatch({
                type: ORDER_LIST_LOADING,
                payload: true
            });
            await Logic.order.updateOrder(order);
            dispatch({
                type: ORDER_LIST_LOADING,
                payload: false
            });
            props.history.goBack();
        } catch (error) {
            console.log(error)
            dispatch({
                type: ORDER_LIST_LOADING,
                payload: false
            });
        }
    }
}

export const deleteOrder = (order, props) => {
    return async dispatch => {
        try {
            dispatch({
                type: ORDER_LIST_LOADING,
                payload: true
            });
            await Logic.order.deleteOrder(order.id);
            dispatch({
                type: ORDER_LIST_LOADING,
                payload: false
            });
            props.history.goBack();
        } catch (error) {
            console.log(error)
            dispatch({
                type: ORDER_LIST_LOADING,
                payload: false
            });
        }
    }
}

export const setOrder = (order) => ({
    type: ORDER,
    payload: order
});

export const createIncomeFromOrder = (products, order, closeDialog) => {
    return async dispatch => {

        let income = {
            toBranch: order.toBranch,
            contractor: order.contractor,
            incomeOfProductDetails: products,
            purchaseOrderDTO: order ? {id: order.id} : undefined,
            documentDate: moment().format("YYYY-MM-DD")
        };
        try {
            dispatch({
                type: ORDER_LIST_LOADING,
                payload: true
            });
            await Logic.income.createIncome(income);
            let response = await Logic.order.fetchOrderById(order.id);
            dispatch({
                type: ORDER,
                payload: response.data
            })
            closeDialog && closeDialog();
            dispatch({
                type: ORDER_LIST_LOADING,
                payload: false
            });
        } catch(error) {
            console.log(error)
            dispatch({
                type: ORDER_LIST_LOADING,
                payload: false
            });
        }
    }
};
