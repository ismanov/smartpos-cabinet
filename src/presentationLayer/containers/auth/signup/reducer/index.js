import produce from "immer";

export const SIGN_UP_LOADING            = 'SIGN_UP_LOADING';
export const SIGN_UP_ERROR_TEXT         = 'SIGN_UP_ERROR_TEXT';

const initState = {
    isLoading: false,
    errorText: ''
};

const reducer = (state = initState, action) => {
    switch (action.type) {
        case SIGN_UP_LOADING:
            return produce(state, draftState => {
                draftState.isLoading = action.payload
            })
        case SIGN_UP_ERROR_TEXT:
            return produce(state, draftState => {
                draftState.errorText = action.payload
            })
        default:
            return state;
    }
}

export default reducer;