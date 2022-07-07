import produce from "immer";

export const INCOME_LIST                = 'INCOME_LIST';
export const SUPPLIER_ID                = 'SUPPLIER_ID';
export const INCOME_SUPPLIER_LIST       = 'INCOME_SUPPLIER_LIST';
export const INCOME_LIST_IS_LOADING     = 'INCOME_LIST_IS_LOADING';
export const INCOME                     = 'INCOME';


const initialState = {
    incomeList: [],
    page: 0,
    size: 20,
    total: 0,
    isLoading: false,
    supplierList: [],
    supplierId: undefined,
    income: undefined
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case INCOME_LIST:
            return produce(state, draftState => {
                draftState.incomeList = action.payload.content;
                draftState.page = action.payload.number !==0 && action.payload.number >= action.payload.totalPages ? action.payload.totalPages-1 : action.payload.number;
                draftState.total = action.payload.totalPages;
                draftState.size = action.payload.size;
            });
        case SUPPLIER_ID:
            return produce(state, draftState => {
                draftState.supplierId = action.payload;
            });
        case INCOME_SUPPLIER_LIST:
            return produce(state, draftState => {
                draftState.supplierList = action.payload.content;
            });
        case INCOME_LIST_IS_LOADING:
            return produce(state, draftState => {
                draftState.isLoading = action.payload;
            });
        case INCOME:
            return produce(state, draftState => {
                draftState.income = action.payload;
            });
        default:
            return state;
    }
};

export default reducer;