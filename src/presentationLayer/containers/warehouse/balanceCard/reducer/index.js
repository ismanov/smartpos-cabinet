import produce from "immer";
export const PRODUCT_BALANCE_CARD            = 'PRODUCT_BALANCE_CARD';

const initState = {
    productBalance: []
};

const reducer = (state = initState, action) => {
    switch (action.type) {
        case PRODUCT_BALANCE_CARD:
            return produce(state, draftState => {
                draftState.productBalance = action.payload
            });
        default:
            return state;

    }
};

export default reducer;
