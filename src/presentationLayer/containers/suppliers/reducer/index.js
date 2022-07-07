import produce from "immer";

export const SUPPLIER_LIST              = 'SUPPLIER_LIST';
export const SUPPLIER_LIST_LOADING      = 'SUPPLIER_LIST_LOADING';
export const SUPPLIER_ERROR_TEXT        = 'SUPPLIER_ERROR_TEXT';

const initState = {
    list: [],
    page: 0,
    size: 20,
    total: 0,
    isLoading: false,
    errorText: ''
};

const reducer = (state = initState, action) => {
    switch (action.type) {
        case SUPPLIER_LIST:
            return produce(state, draftState => {
                draftState.list = action.payload.content;
                draftState.page = action.payload.number > action.payload.totalPages ? action.payload.totalPages : action.payload.number;
                draftState.size = action.payload.size;
                draftState.total = action.payload.totalPages;
            })
        case SUPPLIER_LIST_LOADING:
            return produce(state, draftState => {
                draftState.isLoading = action.payload
            })
        case SUPPLIER_ERROR_TEXT:
            return produce(state, draftState => {
                draftState.errorText = action.payload
            })
        default:
            return state;
    }
}

export default reducer;
