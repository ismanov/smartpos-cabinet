import produce from 'immer';

export const TRANSFER_LOADING           = 'TRANSFER_LOADING';
export const TRANSFER_LIST              = 'TRANSFER_LIST';
export const TRANSFER                   = 'TRANSFER';

const initState = {
    list: [],
    page: 0,
    total: 0,
    size: 20,
    transfer: undefined,
    isLoading: false
};

const reducer = (state = initState, action) => {
    switch (action.type) {
        case TRANSFER_LIST:
            return produce(state, draftState => {
                draftState.list = action.payload.content;
                draftState.page = action.payload.number !==0 && action.payload.number >= action.payload.totalPages ? action.payload.totalPages-1 : action.payload.number;
                draftState.total = action.payload.totalPages;
                draftState.size = action.payload.size;
            })
        case TRANSFER:
            return produce(state, draftState => {
                draftState.transfer = action.payload
            })
        case TRANSFER_LOADING:
            return produce(state, draftState => {
                draftState.isLoading = action.payload
            })
        default:
            return state;
    }
}

export default reducer;