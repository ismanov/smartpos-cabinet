import produce from "immer";

export const MY_CATALOG_LOADING                 = 'MY_CATALOG_LOADING';
export const MY_CATALOG_NODE                    = 'MY_CATALOG_NODE';
export const MY_CATALOG_LIST                    = 'MY_CATALOG_LIST';
export const MY_CATALOG_SYNC_BRANCH_LIST        = 'MY_CATALOG_SYNC_BRANCH_LIST';
export const MY_CATALOG_PRODUCT_LIST            = 'MY_CATALOG_PRODUCT_LIST';
export const MY_CATALOG_PRODUCT_LIST_LOADING    = 'MY_CATALOG_PRODUCT_LIST_LOADING';
export const MY_CATALOG_UNIT_LIST               = 'MY_CATALOG_UNIT_LIST';
export const DIALOG_PRODUCT_LOADING             = 'DIALOG_PRODUCT_LOADING';
export const DIALOG_PRODUCT                     = 'DIALOG_PRODUCT';
export const MY_CATALOG_SELECTED_CATEGORY_ID    = 'MY_CATALOG_SELECTED_CATEGORY_ID';
export const MY_CATALOG_VAT_LIST                = 'MY_CATALOG_VAT_LIST';

const initialState = {
    isLoading: false,
    node: undefined,
    myCatalog: undefined,
    syncBranchList: [],
    productList: [],
    page: 0,
    size: 20,
    total: 0,
    totalElements: 0,
    productListLoading: false,
    unitList: [],
    isDialogLoading: false,
    dialogProduct: undefined,
    selectedCategoryId: undefined,
    vatList: []
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case MY_CATALOG_LOADING:
            return produce(state, draftState => {
                draftState.isLoading = action.payload
            });
        case MY_CATALOG_NODE:
            return produce(state, draftState => {
                draftState.node = action.payload
            });
        case MY_CATALOG_LIST:
            return produce(state, draftState => {
                draftState.myCatalog = action.payload
            });
        case MY_CATALOG_SYNC_BRANCH_LIST:
            return produce(state, draftState => {
                draftState.syncBranchList = action.payload
            });
        case MY_CATALOG_PRODUCT_LIST:
            return produce(state, draftState => {
                draftState.productList = action.payload.content;
                draftState.page = action.payload.number !==0 && action.payload.number >= action.payload.totalPages ? action.payload.totalPages-1 : action.payload.number;
                draftState.size = action.payload.size;
                draftState.total = action.payload.totalPages;
                draftState.totalElements = action.payload.totalElements;
            });
        case MY_CATALOG_PRODUCT_LIST_LOADING:
            return produce(state, draftState => {
                draftState.productListLoading = action.payload
            });
        case MY_CATALOG_UNIT_LIST:
            return produce(state, draftState => {
                draftState.unitList = action.payload
            });
        case DIALOG_PRODUCT:
            return produce(state, draftState => {
                draftState.dialogProduct = action.payload
            });
        case DIALOG_PRODUCT_LOADING:
            return produce(state, draftState => {
                draftState.isDialogLoading = action.payload
            });
        case MY_CATALOG_SELECTED_CATEGORY_ID:
            return produce(state, draftState => {
                draftState.selectedCategoryId = action.payload
            });
        case MY_CATALOG_VAT_LIST:
            return produce(state, draftState => {
                draftState.vatList = action.payload
            })
        default:
            return state;
    }
};

export default reducer;
