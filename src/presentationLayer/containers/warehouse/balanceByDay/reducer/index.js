import produce from "immer";

export const BALANCE_BY_DAY_SEARCH_CATALOG                      = 'BALANCE_BY_DAY_SEARCH_CATALOG';
export const PRODUCT_BALANCE_BY_DAY                             = 'PRODUCT_BALANCE_BY_DAY';
export const PRODUCT_BALANCE_STATS                              = 'PRODUCT_BALANCE_STATS';
export const PRODUCT_BALANCE_BY_DAY_SEARCH_PRODUCTS             = 'PRODUCT_BALANCE_BY_DAY_SEARCH_PRODUCTS';
export const PRODUCT_BALANCE_BY_DAY_SEARCH_PRODUCTS_LOADING     = 'PRODUCT_BALANCE_BY_DAY_SEARCH_PRODUCTS_LOADING';
export const PRODUCT_BALANCE_BY_DAY_SELECTED_DAY                = 'PRODUCT_BALANCE_BY_DAY_SELECTED_DAY';
export const PRODUCT_BALANCE_BY_DAY_SELECTED_CATEGORIES         = 'PRODUCT_BALANCE_BY_DAY_SELECTED_CATEGORIES';
export const PRODUCT_BALANCE_BY_DAY_SELECTED_PRODUCT            = 'PRODUCT_BALANCE_BY_DAY_SELECTED_PRODUCT';
export const PRODUCT_BALANCE_BY_DAY_SORT                        = 'PRODUCT_BALANCE_BY_DAY_SORT';


const initialState = {
    list: [],
    page: 0,
    size: 20,
    total: 0,
    searchCatalog: undefined,
    stats: undefined,
    isLoading: false,
    unitList: [],
    searchLoading: false,
    productList: [],
    productSearchLoading: false,
    date: undefined,
    selectedCategories: [],
    selectedProduct: undefined,
    sort: undefined,
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case BALANCE_BY_DAY_SEARCH_CATALOG:
            return produce(state, draftState => {
                draftState.searchCatalog = action.payload
            });
        case PRODUCT_BALANCE_BY_DAY:
            return produce(state, draftState => {
                draftState.list = action.payload.content;
                draftState.page = action.payload.number !== 0 && action.payload.number >= action.payload.totalPages ? action.payload.totalPages-1 : action.payload.number;
                draftState.size = action.payload.size;
                draftState.total = action.payload.totalPages;
            });
        case PRODUCT_BALANCE_STATS:
            return produce(state, draftState => {
                draftState.stats = action.payload
            });
        case PRODUCT_BALANCE_BY_DAY_SEARCH_PRODUCTS:
            return produce(state, draftState => {
                draftState.productList = action.payload
            });
        case PRODUCT_BALANCE_BY_DAY_SEARCH_PRODUCTS_LOADING:
            return produce(state, draftState => {
                draftState.productSearchLoading = action.payload
            });
        case PRODUCT_BALANCE_BY_DAY_SELECTED_DAY:
            return produce(state, draftState => {
                draftState.date = action.payload
            });
        case PRODUCT_BALANCE_BY_DAY_SELECTED_CATEGORIES:
            return produce(state, draftState => {
                draftState.selectedCategories = action.payload
            });
        case PRODUCT_BALANCE_BY_DAY_SELECTED_PRODUCT:
            return produce(state, draftState => {
                draftState.selectedProduct = action.payload
            });
        case PRODUCT_BALANCE_BY_DAY_SORT:
            return produce(state, draftState => {
                draftState.sort = action.payload
            });            
        default:
            return state;

    }
};

export default reducer;
