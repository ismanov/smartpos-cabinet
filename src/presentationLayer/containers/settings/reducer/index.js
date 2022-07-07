import produce from "immer";

export const TEMPLATE               = 'TEMPLATE';
export const ACTIVITY_TYPE_LIST     = 'ACTIVITY_TYPE_LIST';
export const BANK_REQUISITES        = 'BANK_REQUISITES';

const initialState = {
    template: undefined,
    activityTypeList: [],
    bankRequisites: undefined
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case TEMPLATE:
            return produce(state, draftState => {
                draftState.template = action.payload;
            });
        case ACTIVITY_TYPE_LIST:
            return produce(state, draftState => {
                draftState.activityTypeList = action.payload
            });
        case BANK_REQUISITES:
            return produce(state, draftState => {
                draftState.bankRequisites = action.payload
            });
        default:
            return state;
    }
};

export default reducer;