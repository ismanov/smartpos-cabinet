import produce from 'immer';

export const CURRENT_USER           = 'CURRENT_USER';
export const CURRENT_OWNER          = 'CURRENT_OWNER';
export const COMMON_BRANCH_LIST     = 'COMMON_BRANCH_LIST';
export const CURRENT_BRANCH         = 'CURRENT_BRANCH';
export const CURRENT_LANG           = 'CURRENT_LANG';

export const initState = {
    currentUser: undefined,
    currentOwner: undefined,
    commonBranchList: [],
    currentBranch: undefined,
    lang: "ru",
};

const reducer = (state = initState, action) => {
    switch (action.type) {
        case CURRENT_USER:
            return produce(state, draftState => {
                draftState.currentUser = action.payload;
            });
        case CURRENT_OWNER:
            return produce(state, draftState => {
                draftState.currentOwner = action.payload;
            });
        case COMMON_BRANCH_LIST:
            return produce(state, draftState => {
                draftState.commonBranchList = action.payload;
            });
        case CURRENT_BRANCH:
            return produce(state, draftState => {
                draftState.currentBranch = action.payload;
            });
        case CURRENT_LANG:
            return produce(state, draftState => {
                draftState.lang = action.payload;
            });
        default:
            return state;
    }
};

export default reducer;
