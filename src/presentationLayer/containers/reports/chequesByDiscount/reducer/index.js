import produce from 'immer';
import moment from 'moment';

export const REPORT_CHEQUES_BY_DISCOUNT_LIST                = 'REPORT_CHEQUES_BY_DISCOUNT_LIST';
export const REPORT_CHEQUES_BY_DISCOUNT_LOADING             = 'REPORT_CHEQUES_BY_DISCOUNT_LOADING';
export const REPORT_CHEQUES_BY_DISCOUNT_SELECTED_CHEQUE     = 'REPORT_CHEQUES_BY_DISCOUNT_SELECTED_CHEQUE';
export const REPORT_CHEQUES_BY_DISCOUNT_CHEQUE_LOADING      = 'REPORT_CHEQUES_BY_DISCOUNT_CHEQUE_LOADING';
export const REPORT_CHEQUES_BY_DISCOUNT_CHEQUE_LIST_STATUS  = 'REPORT_CHEQUES_BY_DISCOUNT_CHEQUE_LIST_STATUS';
export const REPORT_CHEQUES_BY_DISCOUNT_DRAFT_CHEQUES_FLAG  = 'REPORT_CHEQUES_BY_DISCOUNT_DRAFT_CHEQUES_FLAG';
export const REPORT_CHEQUES_BY_DISCOUNT_DATE                = 'REPORT_CHEQUES_BY_DISCOUNT_DATE';
export const REPORT_CHEQUES_BY_DISCOUNT_PAYMENT_TYPES       = 'REPORT_CHEQUES_BY_DISCOUNT_PAYMENT_TYPES';
export const REPORT_CHEQUES_BY_DISCOUNT_LIST_SELECTBOX      = 'REPORT_CHEQUES_BY_DISCOUNT_LIST_SELECTBOX';
export const REPORT_CHEQUES_BY_DISCOUNT_LIST_SORT           = 'REPORT_CHEQUES_BY_DISCOUNT_LIST_SORT';
export const REPORT_CHEQUES_BY_DISCOUNT_LIST_EMPLOYEE       = 'REPORT_CHEQUES_BY_DISCOUNT_LIST_EMPLOYEE';
export const REPORT_CHEQUES_BY_DISCOUNT_LIST_OPERATION      = 'REPORT_CHEQUES_BY_DISCOUNT_LIST_OPERATION';
export const REPORT_CHEQUES_BY_DISCOUNT_LIST_PT             = 'REPORT_CHEQUES_BY_DISCOUNT_LIST_PT';
export const REPORT_CHEQUES_BY_DISCOUNT_LIST_DISCOUNT       = 'REPORT_CHEQUES_BY_DISCOUNT_LIST_DISCOUNT';
export const REPORT_CHEQUES_BY_DISCOUNT_LIST_STATUS         = 'REPORT_CHEQUES_BY_DISCOUNT_LIST_STATUS';

const initState = {
    list: [],
    page: 0,
    size: 20,
    total: 0,
    totalElements: 0,
    isLoading: false,
    selectedCheque: undefined,
    chequeLoading: false,
    date: {
        startDate: moment().subtract(1, 'month').startOf('day').format('YYYY-MM-DDTHH:mm:ss'),
        endDate: moment().endOf('day').format('YYYY-MM-DDTHH:mm:ss')
    },
    statusList: [],
    draftCheques: false,
    paymentTypes: [],
    selectbox: [],
    sort: undefined,
    employeeId: -1,
    operation: undefined,
    paymentType: undefined,
    discount: undefined,
    status: undefined,
};

const reducer = (state = initState, action) => {
    switch(action.type) {
        case REPORT_CHEQUES_BY_DISCOUNT_LIST:            
            return produce(state, draftState => {
                draftState.list = action.payload.content;
                draftState.page = action.payload.number > action.payload.totalPages ? action.payload.totalPages : action.payload.number;
                draftState.size = action.payload.size;
                draftState.total = action.payload.totalPages;
                draftState.totalElements = action.payload.totalElements;
            })
        case REPORT_CHEQUES_BY_DISCOUNT_LOADING:
            return produce(state, draftState => {
                draftState.isLoading = action.payload
            })
        case REPORT_CHEQUES_BY_DISCOUNT_SELECTED_CHEQUE:
            return produce(state, draftState => {
                draftState.selectedCheque = action.payload
            })
        case REPORT_CHEQUES_BY_DISCOUNT_CHEQUE_LOADING:
            return produce(state, draftState => {
                draftState.chequeLoading = action.payload
            })
        case REPORT_CHEQUES_BY_DISCOUNT_CHEQUE_LIST_STATUS:
            return produce(state, draftState => {
                draftState.statusList = action.payload
            })
        case REPORT_CHEQUES_BY_DISCOUNT_DRAFT_CHEQUES_FLAG:
            return produce(state, draftState => {
                draftState.draftCheques = action.payload
            })
        case REPORT_CHEQUES_BY_DISCOUNT_DATE:
            return produce(state, draftState => {
                draftState.date = action.payload
            })
        case REPORT_CHEQUES_BY_DISCOUNT_PAYMENT_TYPES:
            return produce(state, draftState => {
                draftState.paymentTypes = action.payload
            })
        case REPORT_CHEQUES_BY_DISCOUNT_LIST_SELECTBOX:
            return produce(state, draftState => {
                draftState.selectbox = action.payload
            })
        case REPORT_CHEQUES_BY_DISCOUNT_LIST_SORT:
            return produce(state, draftState => {
                draftState.sort = action.payload
            })
        case REPORT_CHEQUES_BY_DISCOUNT_LIST_EMPLOYEE:
            return produce(state, draftState => {
                draftState.employeeId = action.payload
            })
        case REPORT_CHEQUES_BY_DISCOUNT_LIST_OPERATION:
            return produce(state, draftState => {
                draftState.operation = action.payload
            })
        case REPORT_CHEQUES_BY_DISCOUNT_LIST_PT:
            return produce(state, draftState => {
                draftState.paymentType = action.payload
            })
        case REPORT_CHEQUES_BY_DISCOUNT_LIST_DISCOUNT:
            return produce(state, draftState => {
                draftState.discount = action.payload
            })
        case REPORT_CHEQUES_BY_DISCOUNT_LIST_STATUS:
            return produce(state, draftState => {
                draftState.status = action.payload
            })
        default:
            return state;
    }
};

export default reducer;