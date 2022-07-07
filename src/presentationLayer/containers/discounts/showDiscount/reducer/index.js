import produce from "immer";

export const INFO_DISCOUNT = "INFO_DISCOUNT";

const initState = {
    discount: undefined
};

const reducer = (state = initState, action) => {
    switch (action.type) {
        case INFO_DISCOUNT:
            return produce(state, draftState => {
                draftState.discount = action.payload
            });
        default:
            return state;
    }
};

export default reducer;
