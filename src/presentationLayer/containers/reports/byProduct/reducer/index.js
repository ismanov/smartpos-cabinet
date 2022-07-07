import produce from "immer";

export const REPORT_BY_PRODUCT_LIST          = 'REPORT_BY_PRODUCT_LIST';
export const REPORT_BY_PRODUCT_LOADING       = 'REPORT_BY_PRODUCT_LOADING';
export const REPORT_BY_PRODUCT_SORT          = 'REPORT_BY_PRODUCT_SORT';
export const REPORT_BY_PRODUCT_STATS_LOADING = "REPORT_BY_PRODUCT_STATS_LOADING";
export const REPORT_BY_PRODUCT_STATS         = "REPORT_BY_PRODUCT_STATS";
export const REPORT_BY_PRODUCT_STATS_ERROR   = "REPORT_BY_PRODUCT_STATS_ERROR";


const initState = {
    isLoading: false,
    list: [],
    page: 0,
    size: 20,
    total: 0,
    totalElements: 0,
    sort: undefined,
    productStats: {
      loading: false,
      data: {},
      error: null
    }
};

const reducer = (state = initState, action) => {
    switch (action.type) {
        case REPORT_BY_PRODUCT_LIST:
            return produce(state, draftState => {
                draftState.list = action.payload.content;
                draftState.page = action.payload.number > action.payload.totalPages ? action.payload.totalPages : action.payload.number;
                draftState.size = action.payload.size;
                draftState.total = action.payload.totalPages;
                draftState.totalElements = action.payload.totalElements;
            })
        case REPORT_BY_PRODUCT_LOADING:
            return produce(state, draftState => {
                draftState.isLoading = action.payload
            })
        case REPORT_BY_PRODUCT_SORT:
            return produce(state, draftState => {
                draftState.sort = action.payload
            })
        case REPORT_BY_PRODUCT_STATS_LOADING:
          return produce(state, draftState => {
            draftState.productStats.loading = true
          });
        case REPORT_BY_PRODUCT_STATS:
          return produce(state, draftState => {
            draftState.productStats = {
              loading: false,
              data: action.payload,
              error: null
            };
          });
        case REPORT_BY_PRODUCT_STATS_ERROR:
          return produce(state, draftState => {
            draftState.productStats = {
              loading: false,
              data: {},
              error: action.payload
            };
          });
        default:
            return state
    }
};

export default reducer;