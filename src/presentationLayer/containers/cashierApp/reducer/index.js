import produce from "immer";

export const CASHIER_CURRENT_BRANCH             = 'CURRENT_BRANCH';

const initialState = {
    currentBranch: undefined
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case CASHIER_CURRENT_BRANCH:
            return produce(state, draftState => {
                draftState.currentBranch = action.payload
            })
        default:
            return state;
    }
};

export default reducer;
