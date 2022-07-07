import produce from "immer";

export const DISCOUNT_LIST          = 'DISCOUNT_LIST';
export const DISCOUNT_STATS         = 'DISCOUNT_STATS';
export const DISCOUNT_LOADING       = 'DISCOUNT_LOADING';
export const DISCOUNT_SORT          = 'DISCOUNT_SORT';
export const DISCOUNT_START_DATE    = 'DISCOUNT_START_DATE';
export const DISCOUNT_END_DATE      = 'DISCOUNT_END_DATE';
export const DISCOUNT_NDS           = 'DISCOUNT_NDS';
export const DISCOUNT_STATUS        = 'DISCOUNT_STATUS';

const initState = {
    list: [],
    page: 0,
    size: 20,
    total: 0,
    stats: undefined,
    isLoading: false,
    startDate: undefined,
    endDate: undefined,
    nds: undefined,
    status: undefined,
    sort: undefined,
};

const reducer = (state = initState, action) => {
    switch (action.type) {
        case DISCOUNT_LIST:
            return produce(state, draftState => {
                draftState.list = action.payload.content;
                draftState.page = action.payload.number !== 0 && action.payload.number >= action.payload.totalPages ? action.payload.totalPages-1 : action.payload.number;
                draftState.total = action.payload.totalPages;
                draftState.size = action.payload.size;
            });
        case DISCOUNT_STATS:
            return produce(state, draftState => {
                draftState.stats = action.payload
            });
        case DISCOUNT_LOADING:
            return produce(state, draftState => {
                draftState.isLoading = action.payload
            });
        case DISCOUNT_START_DATE:
            return produce(state, draftState => {
                draftState.startDate = action.payload
            });
        case DISCOUNT_END_DATE:
            return produce(state, draftState => {
                draftState.endDate = action.payload
            });
        case DISCOUNT_NDS:
            return produce(state, draftState => {
                draftState.nds = action.payload
            });
        case DISCOUNT_SORT:
            return produce(state, draftState => {
                draftState.sort = action.payload
            });
        case DISCOUNT_STATUS:
            return produce(state, draftState => {
                draftState.status = action.payload
            });            
        default:
            return state;
    }

};

export default reducer;
