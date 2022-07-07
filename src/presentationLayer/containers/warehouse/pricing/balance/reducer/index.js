import produce from "immer";

export const PRICE_HISTORY                  = 'PRICE_HISTORY';
export const CATEGORY_CHANGE_PRICE_LOADING  = 'CATEGORY_CHANGE_PRICE_LOADING';
export const PRICE_SELECTED_CATEGORY_ID     = 'PRICE_SELECTED_CATEGORY_ID';

const initState = {
    priceHistoryList: [],
    isLoading: false,
    categoryId: undefined,
};

const reducer = (state = initState, action) => {
    switch (action.type) {
        case PRICE_HISTORY:
            return produce(state, draftState => {
                draftState.priceHistoryList = action.payload
            })
        case CATEGORY_CHANGE_PRICE_LOADING:
            return produce(state, draftState => {
                draftState.isLoading = action.payload
            })
        case PRICE_SELECTED_CATEGORY_ID:
            return produce(state, draftState => {
                draftState.categoryId = action.payload
            })
        default:
            return state
    }
};

export default reducer;