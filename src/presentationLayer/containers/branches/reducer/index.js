import produce from "immer";
import moment from 'moment';

export const BRANCH_LIST                = 'BRANCH_LIST';
export const BRANCH_LIST_LOADING        = 'BRANCH_LIST';
export const BRANCH                     = 'BRANCH';
export const BRANCH_LOADING             = 'BRANCH_LOADING';
export const BRANCH_LIST_SALES_DYNAMICS = 'SALES_DYNAMICS';
export const BRANCH_LIST_SALES_STATS    = 'SALES_STATS';
export const BRANCH_SALES_STATS         = 'BRANCH_SALES_STATS';
export const BRANCH_EMPLOYEES           = 'BRANCH_EMPLOYEES';
export const BRANCH_REGION_LIST         = 'BRANCH_REGION_LIST';
export const BRANCH_CITY_LIST           = 'BRANCH_CITY_LIST';
export const BRANCH_ACTIVITY_TYPE_LIST  = 'BRANCH_ACTIVITY_TYPE_LIST';
export const BRANCH_LIST_DATE_RANGE     = 'BRANCH_LIST_DATE_RANGE';
export const BRANCH_LIST_SORT           = 'BRANCH_LIST_SORT';
export const BRANCH_DETAIL_DATE         = 'BRANCH_DETAIL_DATE';


const initialState = {
    branch: undefined,
    isLoading: false,
    isListLoading: false,
    list: [],
    page: 0,
    size: 20,
    total: 0,
    totalElements: 0,
    salesDynamics: undefined,
    salesStats: undefined,
    branchSalesStats: undefined,
    branchEmployees: [],
    regionList: [],
    cityList: [],
    activityType: [],
    listDate: {
        startDate: moment().subtract(1, 'month').startOf('day').format('YYYY-MM-DDTHH:mm:ss'),
        endDate: moment().endOf('day').format('YYYY-MM-DDTHH:mm:ss')
    },
    sort: undefined,
    detailDate: {
        startDate: moment().subtract(1, 'month').startOf('day').format('YYYY-MM-DDTHH:mm:ss'),
        endDate: moment().endOf('day').format('YYYY-MM-DDTHH:mm:ss')
    },
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case BRANCH_LIST:
            return produce(state, draftState => {
                draftState.list = action.payload.content;
                draftState.page = action.payload.number > action.payload.totalPages ? action.payload.totalPages : action.payload.number;
                draftState.size = action.payload.size;
                draftState.total = action.payload.totalPages;
                draftState.totalElements = action.payload.totalElements;
            });
        case BRANCH_LIST_LOADING:
            return produce(state, draftState => {
                draftState.isListLoading = action.payload;
            });
        case BRANCH:
            return produce(state, draftState => {
                draftState.branch = action.payload;
            });
        case BRANCH_LOADING:
            return produce(state, draftState => {
                draftState.isLoading = action.payload;
            });
        case BRANCH_LIST_SALES_DYNAMICS:
            return produce(state, draftState => {
                draftState.salesDynamics = action.payload;
            });
        case BRANCH_LIST_SALES_STATS:
            return produce(state, draftState => {
                draftState.salesStats = action.payload;
            });
        case BRANCH_SALES_STATS:
            return produce(state, draftState => {
                draftState.branchSalesStats = action.payload;
            });
        case BRANCH_EMPLOYEES:
            return produce(state, draftState => {
                draftState.branchEmployees = action.payload;
            });
        case BRANCH_REGION_LIST:
            return produce(state, draftState => {
                draftState.regionList = action.payload;
            });
        case BRANCH_CITY_LIST:
            return produce(state, draftState => {
                draftState.cityList = action.payload;
            });
        case BRANCH_ACTIVITY_TYPE_LIST:
            return produce(state, draftState => {
                draftState.activityType = action.payload;
            });
        case BRANCH_LIST_DATE_RANGE:
            return produce(state, draftState => {
                draftState.listDate = action.payload;
            });
        case BRANCH_LIST_SORT:
            return produce(state, draftState => {
                draftState.sort = action.payload;
            });
        case BRANCH_DETAIL_DATE:
            return produce(state, draftState => {
                draftState.detailDate = action.payload;
            });
        default:
            return state
    }
};

export default reducer;
