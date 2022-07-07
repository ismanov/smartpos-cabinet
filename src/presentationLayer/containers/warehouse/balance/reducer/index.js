import produce from "immer";

export const PRODUCT_BALANCE                    = 'PRODUCT_BALANCE';
export const PRODUCT_BALANCE_STATS              = 'PRODUCT_BALANCE_STATS';
export const PRODUCT_BALANCE_LIST_LOADING       = 'PRODUCT_BALANCE_LIST_LOADING';
export const PRODUCT_BALANCE_UNIT_LIST          = 'PRODUCT_BALANCE_UNIT_LIST';
export const SEARCH_MY_CATALOG                  = 'SEARCH_MY_CATALOG';
export const SEARCH_LOADING                     = 'SEARCH_LOADING';
export const PRODUCT_BALANCE_SEARCH_PRODUCTS    = 'PRODUCT_BALANCE_SEARCH_PRODUCTS';
export const PRODUCT_BALANCE_SEARCH_LOADING     = 'PRODUCT_BALANCE_SEARCH_PRODUCTS';
export const PRODUCT_BALANCE_SORT               = 'PRODUCT_BALANCE_SORT';
export const PRODUCT_BALANCE_SELECTED_CATS      = 'PRODUCT_BALANCE_SELECTED_CATS';
export const PRODUCT_BALANCE_PRODUCT_ID         = 'PRODUCT_BALANCE_PRODUCT_ID';


const initialState = {
    productBalanceList: [],
    page: 0,
    total: 0,
    size: 20,
    productBalanceStats: {
        productCount: 0,
        totalCostPrice: 0,
        totalSalesPrice: 0
    },
    isLoading: false,
    unitList: [],
    searchCatalog: [],
    searchLoading: false,
    productList: [],
    productSearchLoading: false,
    sort: undefined,
    selectedCategories: [],
    product: undefined,    
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case PRODUCT_BALANCE:
            return produce(state, draftState => {
                draftState.productBalanceList = action.payload.content;
                draftState.page = action.payload.number !== 0 && action.payload.number >= action.payload.totalPages ? action.payload.totalPages-1 : action.payload.number;
                draftState.total = action.payload.totalPages;
                draftState.size = action.payload.size;
            });
        case PRODUCT_BALANCE_STATS:
            return produce(state, draftState => {
                draftState.productBalanceStats = action.payload;
            });
        case PRODUCT_BALANCE_LIST_LOADING:
            return produce(state, draftState => {
                draftState.isLoading = action.payload;
            });
        case PRODUCT_BALANCE_UNIT_LIST:
            return produce(state, draftState => {
                draftState.unitList = action.payload;
            });
        case SEARCH_MY_CATALOG:
            return produce(state, draftState => {
                draftState.searchCatalog = action.payload;
            });
        case SEARCH_LOADING:
            return produce(state, draftState => {
                draftState.searchLoading = action.payload;
            });
        case PRODUCT_BALANCE_SEARCH_PRODUCTS:
            return produce(state, draftState => {
                draftState.productList = action.payload;
            });
        case PRODUCT_BALANCE_SEARCH_LOADING:
            return produce(state, draftState => {
                draftState.productSearchLoading = action.payload;
            });
        case PRODUCT_BALANCE_SORT:
            return produce(state, draftState => {
                draftState.sort = action.payload;
            });
        case PRODUCT_BALANCE_SELECTED_CATS:
            return produce(state, draftState => {
                draftState.selectedCategories = action.payload;
            });
        case PRODUCT_BALANCE_PRODUCT_ID:
            return produce(state, draftState => {
                draftState.product = action.payload;
            });
        default:
            return state;
    }
};

export default reducer;
