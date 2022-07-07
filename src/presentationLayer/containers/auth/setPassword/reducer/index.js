import produce from "immer";

export const SET_PASSWORD_LOADING               = 'SET_PASSWORD_LOADING';
export const SET_PASSWORD_ERROR_TEXT            = 'SET_PASSWORD_ERROR_TEXT';

const initState = {
    isLoading: false,
    errorText: ''
};

const reducer = (state = initState, action) => {
    switch (action.type) {
        case SET_PASSWORD_LOADING:
            return produce(state, draftState => {
                draftState.isLoading = action.payload
            })
        case SET_PASSWORD_ERROR_TEXT:
            return produce(state, draftState => {
                draftState.errorText = action.payload
            })
        default:
            return state;
    }
};

export default reducer;