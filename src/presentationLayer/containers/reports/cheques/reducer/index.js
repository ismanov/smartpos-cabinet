import produce from "immer";
import moment from "moment";

export const CHEQUE_LIST = "CHEQUE_LIST";
export const CHEQUE_LIST_LOADING = "CHEQUE_LIST_LOADING";
export const SELECTED_CHEQUE = "SELECTED_CHEQUE";
export const CHEQUE_LOADING = "CHEQUE_LOADING";
export const CHEQUE_LIST_DATE = "CHEQUE_LIST_DATE";
export const CHEQUE_LIST_STATUS = "CHEQUE_LIST_STATUS";
export const CHEQUE_LIST_TERMINAL = "CHEQUE_LIST_TERMINAL";
export const TERMINALS_LIST = "TERMINALS_LIST";
export const DRAFT_CHEQUES_FLAG = "DRAFT_CHEQUES_FLAG";
export const CHEQUES_PAYMENT_TYPES = "CHEQUES_PAYMENT_TYPES";
export const CHEQUE_STATS = "CHEQUE_STATS";
export const CHEQUE_LIST_EMPLOYEE = "CHEQUE_LIST_EMPLOYEE";
export const CHEQUE_LIST_OPERATION = "CHEQUE_LIST_OPERATION";
export const CHEQUE_LIST_PT = "CHEQUE_LIST_PT";
export const CHEQUE_LIST_SORT = "CHEQUE_LIST_SORT";

const initialState = {
  list: [],
  page: 0,
  size: 20,
  total: 0,
  selectedCheque: undefined,
  totalElements: 0,
  chequeLoading: false,
  date: {
    startDate: moment()
      .subtract(1, "month")
      .startOf("day")
      .format("YYYY-MM-DDTHH:mm:ss"),
    endDate: moment()
      .endOf("day")
      .format("YYYY-MM-DDTHH:mm:ss"),
  },
  statusList: [],
  terminal: undefined,
  terminalList: [],
  isLoading: false,
  draftCheques: false,
  paymentTypes: [],
  stats: undefined,
  employeeId: -1,
  operation: undefined,
  paymentType: undefined,
  sort: undefined,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case CHEQUE_LIST:
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
    case CHEQUE_LIST_LOADING:
      return produce(state, (draftState) => {
        draftState.isLoading = action.payload;
      });
    case SELECTED_CHEQUE:
      return produce(state, (draftState) => {
        draftState.selectedCheque = action.payload;
      });
    case CHEQUE_LOADING:
      return produce(state, (draftState) => {
        draftState.chequeLoading = action.payload;
      });
    case CHEQUE_LIST_DATE:
      return produce(state, (draftState) => {
        draftState.date = action.payload;
      });
    case CHEQUE_LIST_STATUS:
      return produce(state, (draftState) => {
        draftState.statusList = action.payload;
      });
    case CHEQUE_LIST_TERMINAL:
      return produce(state, (draftState) => {
        draftState.terminal = action.payload;
      });
    case TERMINALS_LIST:
      return produce(state, (draftState) => {
        draftState.terminalList = action.payload;
      });
    case DRAFT_CHEQUES_FLAG:
      return produce(state, (draftState) => {
        draftState.draftCheques = action.payload;
      });
    case CHEQUES_PAYMENT_TYPES:
      return produce(state, (draftState) => {
        draftState.paymentTypes = action.payload;
      });
    case CHEQUE_STATS:
      return produce(state, (draftState) => {
        draftState.stats = action.payload;
      });
    case CHEQUE_LIST_EMPLOYEE:
      return produce(state, (draftState) => {
        draftState.employeeId = action.payload;
      });
    case CHEQUE_LIST_OPERATION:
      return produce(state, (draftState) => {
        draftState.operation = action.payload;
      });
    case CHEQUE_LIST_PT:
      return produce(state, (draftState) => {
        draftState.paymentType = action.payload;
      });
    case CHEQUE_LIST_SORT:
      return produce(state, (draftState) => {
        draftState.sort = action.payload;
      });
    default:
      return state;
  }
};

export default reducer;
