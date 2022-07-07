import produce from "immer";
import * as constants from "../constants";
import { PageableList } from "../../../../../utils/pageable-list";

const initialState = {
  offersList: {
    loading: false,
    data: new PageableList(),
    error: null
  },
  offersListFilterProps: {},
  vatItems: []
};

const reducer = (state = initialState, action) => {
  switch(action.type) {
    // OFFERS
    case constants.GET_OFFERS_LIST_LOADING:
      return produce(state, draftState => {
        draftState.offersList = {
          ...state.offersList,
          loading: true
        }
      });
    case constants.GET_OFFERS_LIST:
      return produce(state, draftState => {
        draftState.offersList = {
          loading: false,
          data: action.payload,
          error: null
        }
      });
    case constants.GET_OFFERS_LIST_ERROR:
      return produce(state, draftState => {
        draftState.offersList = {
          loading: false,
          data: new PageableList(),
          error: action.payload
        }
      });
    case constants.UPDATE_OFFERS_LIST_FILTER_PROPS:
      return produce(state, draftState => {
        draftState.offersListFilterProps = {
          ...state.offersListFilterProps,
          ...action.payload
        }
      });
    case constants.RESET_OFFERS_LIST_FILTER_PROPS:
      return produce(state, draftState => {
        draftState.offersListFilterProps = {}
      });
    case constants.GET_VAT_ITEMS:
      return produce(state, draftState => {
        draftState.vatItems = action.payload
      });
    case constants.RESET_SUPPLIER_CATALOG:
      return initialState;
    default:
      return state
  }
};

export default reducer;