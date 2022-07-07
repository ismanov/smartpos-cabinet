import produce from 'immer'

export const SIGNIN_LOADING         = 'SIGNIN_LOADING';
export const SIGNIN_ERROR_TEXT      = 'SIGNIN_ERROR_TEXT';

const initState = { isLoading: false, errorText: '' };

const reducer = (state = initState, action) => {
    switch (action.type) {
        case SIGNIN_LOADING:
            return produce(state, draftState => {
                draftState.isLoading = action.payload
            });
        case SIGNIN_ERROR_TEXT:
            return produce(state, draftState => {
                draftState.errorText = action.payload
            });
        default:
            return state;
    }
};

export default reducer;
