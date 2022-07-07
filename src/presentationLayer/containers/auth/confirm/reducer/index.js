import produce from "immer";

export const CONFIRM_LOADING           = 'CONFIRM_LOADING';
export const CONFIRM_ERROR_TEXT        = 'CONFIRM_ERROR_TEXT';

const initState = {
    isLoading: false,
    errorText: ''
}

const reducer = (state = initState, action) => {
    switch (action.type) {
        case CONFIRM_LOADING:
            return produce(state, draftState => {
                draftState.isLoading = action.payload
            })
        case CONFIRM_ERROR_TEXT:
            return produce(state, draftState => {
                draftState.errorText = action.payload
            })
        default:
            return state;
    }
}

export default reducer;