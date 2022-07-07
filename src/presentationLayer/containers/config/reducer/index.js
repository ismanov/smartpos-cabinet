import produce from "immer";

export const CONFIG_BUSINESS_TYPE           = 'CONFIG_BUSINESS_TYPE';
export const CONFIG_REGION_LIST             = 'CONFIG_REGION_LIST';
export const CONFIG_VAT_LIST                = 'CONFIG_VAT_LIST';
export const CONFIG_CITY_LIST               = 'CONFIG_CITY_LIST';
export const CONFIG_CITY_LIVING_LIST        = 'CONFIG_CITY_LIVING_LIST';
export const CONFIG_ACTIVITY_TYPE           = 'CONFIG_ACTIVITY_TYPE';
export const CONFIG_LOADING                 = 'LOADING';
export const CONFIG_POSITION_LIST           = 'CONFIG_POSITION_LIST';
export const CONFIG_EMPLOYEE_LIST           = 'CONFIG_EMPLOYEE_LIST';
export const CONFIG_BRANCH_LIST             = 'CONFIG_BRANCH_LIST';
export const CONFIG_CATALOG                 = 'CONFIG_CATALOG';
export const CONFIG_ERROR_TEXT              = 'CONFIG_ERROR_TEXT';

const initState = {
    businessType: [],
    regionList: [],
    vatList: [],
    cityList: [],
    livingCityList: [],
    activityType: [],
    isLoading: false,
    positionList: [],
    employeeList: [],
    branchList: [],
    catalog: [],
    errorText: ''
};

const reducer = (state = initState, action) => {
    switch (action.type) {
        case CONFIG_BUSINESS_TYPE:
            return produce(state, draftState => {
                draftState.businessType = action.payload
            })
        case CONFIG_REGION_LIST:
            return produce(state, draftState => {
                draftState.regionList = action.payload
            })
        case CONFIG_VAT_LIST:
            return produce(state, draftState => {
                draftState.vatList = action.payload
            })
        case CONFIG_CITY_LIST:
            return produce(state, draftState => {
                draftState.cityList = action.payload
            })
        case CONFIG_CITY_LIVING_LIST:
            return produce(state, draftState => {
                draftState.livingCityList = action.payload
            })
        case CONFIG_ACTIVITY_TYPE:
            return produce(state, draftState => {
                draftState.activityType = action.payload
            })
        case CONFIG_LOADING:
            return produce(state, draftState => {
                draftState.isLoading = action.payload
            })
        case CONFIG_POSITION_LIST:
            return produce(state, draftState => {
                draftState.positionList = action.payload
            })
        case CONFIG_EMPLOYEE_LIST:
            return produce(state, draftState => {
                draftState.employeeList = action.payload
            })
        case CONFIG_BRANCH_LIST:
            return produce(state, draftState => {
                draftState.branchList = action.payload
            })
        case CONFIG_CATALOG:
            return produce(state, draftState => {
                draftState.catalog = action.payload
            })
        case CONFIG_ERROR_TEXT:
            return produce(state, draftState => {
                draftState.errorText = action.payload
            })
        default:
            return state;

    }
}

export default reducer;