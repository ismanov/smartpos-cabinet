import moment from "moment";
import produce from "immer";

export const DASHBOARD_DATE             = 'DASHBOARD_DATE';
export const DASHBOARD_MODE             = 'DASHBOARD_MODE';
export const DASHBOARD_DYNAMICS         = 'DASHBOARD_DYNAMICS';
export const DASHBOARD_STATES           = 'DASHBOARD_STATES';
export const DASHBOARD_TOP_PRODUCTS     = 'DASHBOARD_TOP_PRODUCTS';
export const DASHBOARD_TOP_EMPLOYEES    = 'DASHBOARD_TOP_EMPLOYEES';
export const DASHBOARD_MAIN_LOADING     = 'DASHBOARD_MAIN_LOADING';
export const DASHBOARD_SELECTED_TAB     = 'DASHBOARD_SELECTED_TAB';


export const initState = {
    date: {
        startDate: moment().subtract(1, 'month').startOf('day').format('YYYY-MM-DDTHH:mm:ss'),
        endDate: moment().endOf('day').format('YYYY-MM-DDTHH:mm:ss')
    },
    mode: 1,
    dynamics: [],
    states: undefined,
    topProducts: [],
    topEmployees: [],
    mainLoading: false,
    tab: 0
};

const reducer = (state = initState, action) => {
    switch (action.type) {
        case DASHBOARD_DATE:
            return produce(state, draftState => {
                draftState.date = action.payload
            });
        case DASHBOARD_MODE:
            return produce(state, draftState => {
                draftState.mode = action.payload
            });
        case DASHBOARD_DYNAMICS:
            return produce(state, draftState => {
                draftState.dynamics = action.payload;
            });
        case DASHBOARD_STATES:
            return produce(state, draftState => {
                draftState.states = action.payload
            });
        case DASHBOARD_TOP_PRODUCTS:
            return produce(state, draftState => {
                draftState.topProducts = action.payload
            });
        case DASHBOARD_TOP_EMPLOYEES:
            return produce(state, draftState => {
                draftState.topEmployees = action.payload
            });
        case DASHBOARD_MAIN_LOADING:
            return produce(state, draftState => {
                draftState.mainLoading = action.payload
            });
        case DASHBOARD_SELECTED_TAB:
            return produce(state, draftState => {
                draftState.tab = action.payload
            });
        default:
            return state;
    }
};

export default reducer;
