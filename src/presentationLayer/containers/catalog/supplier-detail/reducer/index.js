import produce from "immer";
import * as constants from "../constants";
import { PageableList } from "../../../../../utils/pageable-list";

const initialState = {
  supplierInfo: {
    loading: false,
    data: {},
    error: null
  },
  categories: {
    loading: false,
    list: [],
    error: null
  },
  currentBranch: null,
  branchesItems: {
    list: [],
    loading: false,
    error: null
  },
  products: {
    loading: false,
    data: new PageableList(),
    error: null
  },
  productsFilterProps: {},
  selectedProducts: [],
  showSelectedProducts: false
};

const reducer = (state = initialState, action) => {
  switch(action.type) {
    // SUPPLIER INFO
    case constants.GET_SUPPLIER_INFO_LOADING:
      return produce(state, draftState => {
        draftState.supplierInfo.loading = true
      });
    case constants.GET_SUPPLIER_INFO:
      return produce(state, draftState => {
        draftState.supplierInfo = {
          loading: false,
          data: action.payload,
          error: null
        }
      });
    case constants.GET_SUPPLIER_INFO_ERROR:
      return produce(state, draftState => {
        draftState.supplierInfo = {
          loading: false,
          data: {},
          error: action.payload
        }
      });
    // CATEGORIES
    case constants.GET_CATEGORIES_LIST_LOADING:
      return produce(state, draftState => {
        draftState.categories.loading = true
      });
    case constants.GET_CATEGORIES_LIST:
      return produce(state, draftState => {
        draftState.categories = {
          loading: false,
          list: action.payload,
          error: null
        }
      });
    case constants.GET_CATEGORIES_LIST_ERROR:
      return produce(state, draftState => {
        draftState.categories = {
          loading: false,
          list: [],
          error: action.payload
        }
      });
    case constants.RESET_CATEGORIES_LIST:
      return produce(state, draftState => {
        draftState.categories = {
          loading: false,
          list: [],
          error: null
        }
      });
    case constants.RESET_SUPPLIER_DETAIL:
      return initialState;
    case constants.SET_CATEGORIES_BRANCH:
      return produce(state, draftState => {
        draftState.currentBranch = action.payload
      });
    case constants.GET_BRANCHES_ITEMS_LOADING:
      return produce(state, draftState => {
        draftState.branchesItems.loading = true
      });
    case constants.GET_BRANCHES_ITEMS:
      return produce(state, draftState => {
        draftState.branchesItems = {
          list: action.payload.content,
          loading: false
        }
      });
    case constants.GET_BRANCHES_ITEMS_ERROR:
      return produce(state, draftState => {
        draftState.branchesItems = {
          list: [],
          loading: false,
          error: action.payload
        }
      });
    // PRODUCTS
    case constants.GET_PRODUCTS_LOADING:
      return produce(state, draftState => {
        draftState.products.loading = true
      });
    case constants.GET_PRODUCTS:
      return produce(state, draftState => {
        draftState.products = {
          loading: false,
          data: action.payload,
          error: null
        }
      });
    case constants.GET_PRODUCTS_ERROR:
      return produce(state, draftState => {
        draftState.products = {
          loading: false,
          data: new PageableList(),
          error: action.payload
        }
      });
    case constants.RESET_PRODUCTS:
      return produce(state, draftState => {
        draftState.products = {
          loading: false,
          data: new PageableList(),
          error: null
        }
      });
    case constants.UPDATE_PRODUCTS_FILTER_PROPS:
      return produce(state, draftState => {
        draftState.productsFilterProps = {
          ...state.productsFilterProps,
          ...action.payload
        }
      });
    case constants.ADD_SELECTED_PRODUCT:
      return produce(state, draftState => {
        draftState.selectedProducts = action.payload
      });
    case constants.SHOW_SELECTED_PRODUCTS:
      return produce(state, draftState => {
        draftState.showSelectedProducts = action.payload
      });
    default:
      return state
  }
};

export default reducer;