import produce from "immer";
import moment from 'moment';

export const CASH_TRANSACTION_LIST              = 'CASH_TRANSACTION_LIST';
export const CASH_TRANSACTION_CASHIER           = 'CASH_TRANSACTION_CASHIER';
export const CASH_TRANSACTION_OPERATION         = 'CASH_TRANSACTION_OPERATION';
export const CASH_TRANSACTION_LOADING           = 'CASH_TRANSACTION_LOADING';
export const CASH_TRANSACTION_STATUSES          = 'CASH_TRANSACTION_STATUSES';
export const CASH_TRANSACTION_CHEQUE            = 'CASH_TRANSACTION_CHEQUE';
export const CASH_TRANSACTION_CHEQUE_LOADING    = 'CASH_TRANSACTION_CHEQUE_LOADING';
export const CASH_TRANSACTION_STATS             = 'CASH_TRANSACTION_STATS';
export const CASH_TRANSACTION_LIST_SORT         = 'CASH_TRANSACTION_LIST_SORT';


const initState = {    
    cashierId: -1,    
    operation: undefined,
    list: [],
    page: 0,
    size: 20,
    totalPages: 0,
    totalElements: 0,
    isLoading: false,
    cashOperationStatuses: [],
    cheque: undefined,
    chequeLoading: false,
    stats: undefined,
    sort: undefined,
};

const reducer = (state = initState, action) => {
    switch (action.type) {
        case CASH_TRANSACTION_LIST:
            return produce(state, draftState => {
                draftState.list = action.payload.content.map((r, i) => ({...r, index: i}));
                draftState.page = action.payload.number !==0 && action.payload.number >= action.payload.totalPages ? action.payload.totalPages-1 : action.payload.number;
                draftState.size = action.payload.size;
                draftState.total = action.payload.totalPages;
                draftState.totalElements = action.payload.totalElements;
            });        
        case CASH_TRANSACTION_CASHIER:
            return produce(state, draftState => {
                draftState.cashierId = action.payload
            })        
        case CASH_TRANSACTION_LOADING:
            return produce(state, draftState => {
                draftState.isLoading = action.payload
            })
        case CASH_TRANSACTION_OPERATION:
            return produce(state, draftState => {
                draftState.operation = action.payload
            });
        case CASH_TRANSACTION_STATUSES:
            return produce(state, draftState => {
                draftState.cashOperationStatuses = action.payload
            })
        case CASH_TRANSACTION_CHEQUE:
            return produce(state, draftState => {
                draftState.cheque = action.payload
            })
        case CASH_TRANSACTION_CHEQUE_LOADING:
            return produce(state, draftState => {
                draftState.chequeLoading = action.payload
            })
        case CASH_TRANSACTION_STATS:
            return produce(state, draftState => {
                draftState.stats = action.payload
            })
        case CASH_TRANSACTION_LIST_SORT:
            return produce(state, draftState => {
                draftState.sort = action.payload
            })
        default:
            return state
    }
}

export default reducer;
