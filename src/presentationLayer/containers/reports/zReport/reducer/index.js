import produce from "immer";
import moment from 'moment';

export const Z_REPORT_LIST          = 'Z_REPORT_LIST';
export const Z_REPORT_STATS         = 'Z_REPORT_STATS';
export const Z_REPORT_LOADING       = 'Z_REPORT_LOADING';
export const Z_REPORT_CASHIERS      = 'Z_REPORT_CASHIERS';
export const Z_REPORT_DATE          = 'Z_REPORT_DATE';
export const Z_REPORT_EMPLOYEE      = 'Z_REPORT_EMPLOYEE';
export const Z_REPORT_SORT          = 'Z_REPORT_SORT';

const initialState = {
    list: [],
    page: 0,
    size: 20,
    total: 0,
    isLoading: false,
    stats: undefined,
    cashiers: [],
    date: {
        startDate: moment().subtract(1, 'month').startOf('day').format('YYYY-MM-DDTHH:mm:ss'),
        endDate: moment().endOf('day').format('YYYY-MM-DDTHH:mm:ss')
    },
    employeeId: -1,
    sort: undefined,
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case Z_REPORT_LIST:
            return produce(state, draftState => {
                draftState.list = action.payload.content;
                draftState.page = action.payload.number !== 0 && action.payload.number >= action.payload.totalPages ? action.payload.totalPages-1 : action.payload.number;
                draftState.total = action.payload.totalPages;
                draftState.size = action.payload.size;
            })
        case Z_REPORT_STATS:
            return produce(state, draftState => {
                draftState.stats = action.payload
            })
        case Z_REPORT_CASHIERS:
            return produce(state, draftState => {
                draftState.cashiers = action.payload
            })
        case Z_REPORT_DATE:
            return produce(state, draftState => {
                draftState.date = action.payload
            });
        case Z_REPORT_EMPLOYEE:
            return produce(state, draftState => {
                draftState.employeeId = action.payload
            });
        case Z_REPORT_SORT:
            return produce(state, draftState => {
                draftState.sort = action.payload
            });
        default:
            return state
    }
};

export default reducer;