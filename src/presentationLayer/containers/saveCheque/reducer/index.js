import produce from "immer";
export const SAVE_CHEQUE_TERMINALS          = 'SAVE_CHEQUE_TERMINALS';

const initialState = {
    terminals: []
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case SAVE_CHEQUE_TERMINALS:
            return produce(state, draftState => {
                draftState.terminals = action.payload;
            });
        default:
            return state;

    }
};

export default reducer;
