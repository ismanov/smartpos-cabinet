import produce from "immer";

export const REPORT_CATEGORY_LIST           = 'REPORT_CATEGORY_LIST';
export const REPORT_CATEGORY_STATS          = 'REPORT_CATEGORY_STATS';
export const REPORT_CATEGORY_LOADING        = 'REPORT_CATEGORY_LOADING';

const initState = {
    list: [],
    stats: undefined,
    isLoading: false
}

const reducer = (state = initState, action) => {
    switch (action.type) {
        case REPORT_CATEGORY_LIST:
            return produce(state, draftState => {
                draftState.list = action.payload
            })
        case REPORT_CATEGORY_STATS:
            return produce(state, draftState => {
                draftState.stats = action.payload
            })
        case REPORT_CATEGORY_LOADING:
            return produce(state, draftState => {
                draftState.isLoading = action.payload
            })
        default:
            return state;
    }
}

export default reducer;