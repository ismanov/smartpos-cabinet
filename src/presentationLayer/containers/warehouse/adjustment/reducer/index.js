import produce from "immer";

export const ADJUSTMENT_LIST            = 'ADJUSTMENT_LIST';
export const ADJUSTMENT_LIST_LOADING    = 'ADJUSTMENT_LIST_LOADING';
export const ADJUSTMENT_LIST_PRODUCT    = 'ADJUSTMENT_LIST_PRODUCT';
export const ADJUSTMENT_LIST_SORT       = 'ADJUSTMENT_LIST_SORT';

const initialState = {
    page: 0,
    size: 20,
    total: 0,
    list: [],
    isLoading: false,
    product: undefined,
    sort: undefined,
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case ADJUSTMENT_LIST:
            return produce(state, draftState => {
                draftState.list = action.payload.content;
                draftState.page = action.payload.number !==0 && action.payload.number >= action.payload.totalPages ? action.payload.totalPages-1 : action.payload.number;
                draftState.size = action.payload.size;
                draftState.total = action.payload.totalPages;
            });
        case ADJUSTMENT_LIST_LOADING:
            return produce(state, draftState => {
                draftState.isLoading = action.payload
            });
        case ADJUSTMENT_LIST_PRODUCT:
            return produce(state, draftState => {
                draftState.product = action.payload
            });
        case ADJUSTMENT_LIST_SORT: 
            return produce(state, draftState => {
                draftState.sort = action.payload
            })
        default:
            return state;
    }
};

export default reducer;
