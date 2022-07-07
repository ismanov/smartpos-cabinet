import produce from "immer";
import moment from "moment";

export const REPORT_BY_ONE_PRODUCT_LIST_LOADING = 'REPORT_BY_ONE_PRODUCT_LIST_LOADING'
export const REPORT_BY_ONE_PRODUCT_LIST         = 'REPORT_BY_ONE_PRODUCT_LIST'
export const REPORT_BY_ONE_PRODUCT_STATS        = 'REPORT_BY_ONE_PRODUCT_STATS'
export const REPORT_BY_ONE_PRODUCT_DYNAMICS     = 'REPORT_BY_ONE_PRODUCT_DYNAMICS'
export const REPORT_BY_ONE_PRODUCT_SORT         = 'REPORT_BY_ONE_PRODUCT_SORT'

const initState = {
    isLoading: false,
    list: [],
    page: 0,
    size: 20,
    total: 0,
    stats: undefined,
    dynamics: [],    
    sort: undefined,
};

const reducer = (state = initState, action) => {
    switch (action.type) {
        case REPORT_BY_ONE_PRODUCT_LIST_LOADING:
            return produce(state, draftState => {
                draftState.isLoading = action.payload
            })
        case REPORT_BY_ONE_PRODUCT_LIST:
            return produce(state, draftState => {
                draftState.list = action.payload.content;
                draftState.page = action.payload.number > action.payload.totalPages ? action.payload.totalPages : action.payload.number;
                draftState.size = action.payload.size;
                draftState.total = action.payload.totalPages;
            })
        case REPORT_BY_ONE_PRODUCT_STATS: {
            return produce(state, draftState => {
                draftState.stats = action.payload
            })
        }
        case REPORT_BY_ONE_PRODUCT_DYNAMICS: {
            return produce(state, draftState => {
                draftState.dynamics = action.payload
            })
        }
        case REPORT_BY_ONE_PRODUCT_SORT:
            return produce(state, draftState => {
                draftState.sort = action.payload
            })
        default:
            return state
    }
}

export default reducer;