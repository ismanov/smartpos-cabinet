import produce from "immer";
import * as constants from "../constants";

const initialState = {
  ordering: {
    list: [],
    filterProps: {}
  },
  editingProducts: {},
  suppliersItems: {
    list: [],
    loading: false,
    error: null
  },
  branchesItems: {
    list: [],
    loading: false,
    error: null
  },
  paymentsItems: [],
  deliveryTypeItems: [],
  productsItems: {
    list: [],
    loading: false,
    error: null
  },
  createOrder: {
    loading: false,
    success: false,
    error: null
  },
  updateOrder: {
    loading: false,
    success: false,
    error: null
  },
  deleteDraftOrder: {
    loading: false,
    success: false,
    error: null
  }
};

const reducer = (state = initialState, action) => {
  switch(action.type) {
    case constants.ADD_ORDERING_PRODUCT:
      return produce(state, draftState => {
        draftState.ordering = action.payload
      });
    case constants.UPDATE_ORDERING_PRODUCT:
      return produce(state, draftState => {
        draftState.ordering.list = action.payload
      });
    case constants.DELETE_ORDERING_PRODUCT:
      return produce(state, draftState => {
        draftState.ordering.list = action.payload
      });
    case constants.SET_ORDERING_FIELDS:
      return produce(state, draftState => {
        draftState.ordering.filterProps = {
          ...draftState.ordering.filterProps,
          ...action.payload
        }
      });
    case constants.RESET_ORDERING:
      return initialState;

    case constants.SET_EDITING_PRODUCTS:
      return produce(state, draftState => {
        draftState.editingProducts = action.payload
      });

    case constants.GET_SUPPLIERS_ITEMS_LOADING:
      return produce(state, draftState => {
        draftState.suppliersItems.loading = true
      });
    case constants.GET_SUPPLIERS_ITEMS:
      return produce(state, draftState => {
        draftState.suppliersItems = {
          list: action.payload.content,
          loading: false,
          error: null
        }
      });
    case constants.GET_SUPPLIERS_ITEMS_ERROR:
      return produce(state, draftState => {
        draftState.suppliersItems = {
          list: [],
          loading: false,
          error: action.payload
        }
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
    case constants.GET_PAYMENTS_ITEMS:
      return produce(state, draftState => {
        draftState.paymentsItems = action.payload
      });
    case constants.GET_DELIVERY_TYPE_ITEMS:
      return produce(state, draftState => {
        draftState.deliveryTypeItems = action.payload
      });
    case constants.GET_PRODUCTS_ITEMS_LOADING:
      return produce(state, draftState => {
        draftState.productsItems.loading = true
      });
    case constants.GET_PRODUCTS_ITEMS:
      return produce(state, draftState => {
        draftState.productsItems = {
          list: action.payload.content,
          loading: false
        }
      });
    case constants.GET_PRODUCTS_ITEMS_ERROR:
      return produce(state, draftState => {
        draftState.productsItems = {
          list: [],
          loading: false,
          error: action.payload
        }
      });
    case constants.RESET_PRODUCTS_ITEMS:
      return produce(state, draftState => {
        draftState.productsItems = {
          list: [],
          loading: false,
          error: null
        }
      });
    case constants.CREATE_ORDER_LOADING:
      return produce(state, draftState => {
        draftState.createOrder.loading = true
      });
    case constants.CREATE_ORDER:
      return produce(state, draftState => {
        draftState.createOrder = {
          loading: false,
          success: true,
          error: null
        }
      });
    case constants.CREATE_ORDER_ERROR:
      return produce(state, draftState => {
        draftState.createOrder = {
          loading: false,
          success: false,
          error: action.payload
        }
      });
    case constants.UPDATE_ORDER_LOADING:
      return produce(state, draftState => {
        draftState.updateOrder.loading = true
      });
    case constants.UPDATE_ORDER:
      return produce(state, draftState => {
        draftState.updateOrder = {
          loading: false,
          success: true,
          error: null
        }
      });
    case constants.UPDATE_ORDER_ERROR:
      return produce(state, draftState => {
        draftState.updateOrder = {
          loading: false,
          success: false,
          error: action.payload
        }
      });
    case constants.DELETE_DRAFT_ORDER_LOADING:
      return produce(state, draftState => {
        draftState.deleteDraftOrder.loading = true
      });
    case constants.DELETE_DRAFT_ORDER:
      return produce(state, draftState => {
        draftState.deleteDraftOrder = {
          loading: false,
          success: true,
          error: null
        }
      });
    case constants.DELETE_DRAFT_ORDER_ERROR:
      return produce(state, draftState => {
        draftState.deleteDraftOrder = {
          loading: false,
          success: false,
          error: action.payload
        }
      });
    case constants.RESET_DELETE_DRAFT_ORDER:
      return produce(state, draftState => {
        draftState.deleteDraftOrder = {
          loading: false,
          success: false,
          error: null
        }
      });
    default:
      return state
  }
};

export default reducer;