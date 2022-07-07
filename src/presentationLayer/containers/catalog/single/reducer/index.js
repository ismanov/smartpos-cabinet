import produce from "immer";

export const SINGLE_CATALOG                 = "SINGLE_CATALOG";
export const SINGLE_CATALOG_LOADING         = "SINGLE_CATALOG_LOADING";
export const SINGLE_CATALOG_BRANCH_ID       = "SINGLE_CATALOG_BRANCH_ID";

const initialState = {
    catalogList: [],
    isLoading: false,
    branchId: undefined,
};

const reducer = (state = initialState, action) => {
    switch(action.type) {
        case SINGLE_CATALOG:
            return produce(state, draftState => {
                draftState.catalogList = action.payload
            });
        case SINGLE_CATALOG_LOADING:
            return produce(state, draftState => {
                draftState.isLoading = action.payload
            });
        case SINGLE_CATALOG_BRANCH_ID:
            return produce(state, draftState => {
                draftState.branchId = action.payload
            });
        default:
            return state
    }
};

export default reducer;
