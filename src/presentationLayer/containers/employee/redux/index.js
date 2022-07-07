import produce from "immer";

export const EMPLOYEE_LIST_LOADING = "EMPLOYEE_LIST_LOADING";
export const EMPLOYEE_LIST = "EMPLOYEE_LIST";
export const CASHIERS = "CASHIERS";
export const EMPLOYEE_LOADING = "EMPLOYEE_LOADING";
export const EMPLOYEE = "EMPLOYEE";
export const EMPLOYEE_ERROR = "EMPLOYEE_ERROR";
export const EMPLOYEE_STATS = "EMPLOYEE_STATS";
export const EMPLOYEE_ROLE = "EMPLOYEE_ROLE";
export const POSITION_LIST = "POSITION_LIST";
export const EMPLOYEE_LIST_SORT = "EMPLOYEE_LIST_SORT";

const initState = {
  list: [],
  employee: undefined,
  totalElements: 0,
  total: 0,
  page: 0,
  size: 20,
  isLoading: false,
  isListLoading: false,
  stats: undefined,
  cashiers: [],
  errorText: undefined,
  role: "ALL",
  positionList: [],
  sort: undefined,
};

const reducer = (state = initState, action) => {
  switch (action.type) {
    case EMPLOYEE:
      return produce(state, (draftState) => {
        draftState.employee = action.payload;
      });
    case EMPLOYEE_ROLE:
      return produce(state, (draftState) => {
        draftState.role = action.payload;
      });
    case EMPLOYEE_LIST:
      return produce(state, (draftState) => {
        draftState.list = action.payload.content;
        draftState.page =
          action.payload.number !== 0 &&
          action.payload.number >= action.payload.totalPages
            ? action.payload.totalPages - 1
            : action.payload.number;
        draftState.size = action.payload.size;
        draftState.total = action.payload.totalPages;
        draftState.totalElements = action.payload.totalElements;
      });

    case EMPLOYEE_LOADING:
      return produce(state, (draftState) => {
        draftState.isLoading = action.payload;
      });
    case EMPLOYEE_LIST_LOADING:
      return produce(state, (draftState) => {
        draftState.isListLoading = action.payload;
      });
    case EMPLOYEE_ERROR:
      return produce(state, (draftState) => {
        draftState.errorText = action.payload;
      });
    case EMPLOYEE_STATS:
      return produce(state, (draftState) => {
        draftState.stats = action.payload;
      });
    case CASHIERS:
      return produce(state, (draftState) => {
        draftState.cashiers = action.payload;
      });
    case POSITION_LIST:
      return produce(state, (draftState) => {
        draftState.positionList = action.payload;
      });
    case EMPLOYEE_LIST_SORT:
      return produce(state, (draftState) => {
        draftState.sort = action.payload;
      });
    default:
      return state;
  }
};

export default reducer;
