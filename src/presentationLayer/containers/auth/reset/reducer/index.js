import produce from "immer";

export const RESET_LOADING              = 'RESET_LOADING';
export const RESET_ERROR_TEXT           = 'RESET_ERROR_TEXT';

const initState = {
    isLoading: false,
    errorText: ''
}

const reducer = (state = initState, action) => {
    switch (action.type) {
        case RESET_LOADING:
            return produce(state, draftState => {
                draftState.isLoading = action.payload
            });
        case RESET_ERROR_TEXT:
            return produce(state, draftState => {
                draftState.errorText = action.payload
            })
        default:
            return state;
    }
}

export default reducer;