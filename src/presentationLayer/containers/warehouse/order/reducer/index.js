import produce from "immer";
import moment from 'moment';

export const ORDER_SUPPLIER_LIST        = 'ORDER_SUPPLIER_LIST';
export const ORDER_LIST                 = 'ORDER_LIST';
export const ORDER                      = 'ORDER';
export const ORDER_LIST_LOADING         = 'ORDER_LIST_LOADING';
export const ORDER_LIST_SORT            = 'ORDER_LIST_SORT';
export const ORDER_LIST_DATE            = 'ORDER_LIST_DATE';
export const ORDER_LIST_STATUS          = 'ORDER_LIST_STATUS';
export const ORDER_LIST_SUPPLIER        = 'ORDER_LIST_SUPPLIER';

const initialState = {
    supplierList: [],
    orderList: [],
    order: undefined,
    page: 0,
    size: 20,
    total: 0,
    isLoading: false,
    sort: undefined,
    date: {
        startDate: moment().subtract(1, 'month').startOf('day').format('YYYY-MM-DDTHH:mm:ss'),
        endDate: moment().endOf('day').format('YYYY-MM-DDTHH:mm:ss'),
    },
    status: 'ALL',
    supplier: -1,
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case ORDER_SUPPLIER_LIST:
            return produce(state, draftState => {
                draftState.supplierList = action.payload.content;
            })
        case ORDER_LIST:
            return produce(state, draftState => {
                draftState.orderList = action.payload.content;
                draftState.page = action.payload.number !==0 && action.payload.number >= action.payload.totalPages ? action.payload.totalPages-1 : action.payload.number;
                draftState.size = action.payload.size;
                draftState.total = action.payload.totalPages
            })
        case ORDER:
            return produce(state, draftState => {
                draftState.order = action.payload
            })
        case ORDER_LIST_LOADING:
            return produce(state, draftState => {
                draftState.isLoading = action.payload
            })
        case ORDER_LIST_SORT:
            return produce(state, draftState => {
                draftState.sort = action.payload
            })
        case ORDER_LIST_DATE:
            return produce(state, draftState => {
                draftState.date = action.payload
            })
        case ORDER_LIST_STATUS:
            return produce(state, draftState => {
                draftState.status = action.payload
            })
        case ORDER_LIST_SUPPLIER:
            return produce(state, draftState => {
                draftState.supplier = action.payload
            })
        default:
            return state;
    }
}

export default reducer;