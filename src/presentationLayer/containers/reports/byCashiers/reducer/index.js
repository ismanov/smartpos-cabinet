import produce from "immer";

export const REPORT_BY_CASHIERS_LIST                = 'REPORT_BY_CASHIERS_LIST';
export const REPORT_BY_CASHIERS_LIST_LOADING        = 'REPORT_BY_CASHIERS_LIST_LOADING';
export const REPORT_BY_CASHIERS_LIST_SORT           = 'REPORT_BY_CASHIERS_LIST_SORT';

const initState = {
    list: [],
    page: 0,
    size: 20,
    total: 0,
    isLoading: false,
    sort: undefined,
};

const reducer = (state = initState, action) => {
    switch (action.type) {
        case REPORT_BY_CASHIERS_LIST:
            return produce(state, draftState => {
                draftState.list = action.payload.content;
                draftState.page = action.payload.number > action.payload.totalPages ? action.payload.totalPages : action.payload.number;
                draftState.size = action.payload.size;
                draftState.total = action.payload.totalPages;
            })
        case REPORT_BY_CASHIERS_LIST_LOADING:
            return produce(state, draftState => {
                draftState.isLoading = action.payload
            })
        case REPORT_BY_CASHIERS_LIST_SORT:
            return produce(state, draftState => {
                draftState.sort = action.payload
            })
        default:
            return state
    }


}

export default reducer;

