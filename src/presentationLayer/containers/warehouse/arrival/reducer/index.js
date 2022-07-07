import produce from "immer";
import * as constants from "../constants";
import { PageableList } from "../../../../../utils/pageable-list";

const initialState = {
  arrivalList: {
    loading: false,
    data: new PageableList(),
    error: null
  },
  arrivalListFilterProps: {},
  arrivalListSuppliersItems: {
    loading: false,
    data: [],
    error: null
  },
  arrivalCreateDetails: {
    formFields: {
      arrivalType: {
        label: "По товарам",
        value: "AUTOMATIC"
      },
      arrivalsItems: [],
      editingProducts: {}
    },
    orderDetails: {
      loading: false,
      data: null,
      error: null
    },
    branchesItems: {
      loading: false,
      data: [],
      error: null
    },
    suppliersItems: {
      loading: false,
      data: [],
      error: null
    },
    ordersItems: {
      loading: false,
      data: [],
      error: null
    },
    productsItems: {
      loading: false,
      data: [],
      error: null
    },
    productUnits: {
      loading: false,
      data: [],
      error: null
    },
    addArrivalsByOrder: {
      loading: false,
      success: false,
      error: null
    },
    addArrivalsByProduct: {
      loading: false,
      success: false,
      error: null
    }
  },
  arrivalInfo: {
    loading: false,
    data: null,
    error: null
  }
};

const reducer = (state = initialState, action) => {
  switch(action.type) {
    case constants.GET_ARRIVAL_LIST_LOADING:
      return produce(state, draftState => {
        draftState.arrivalList.loading = true
      });
    case constants.GET_ARRIVAL_LIST:
      return produce(state, draftState => {
        draftState.arrivalList = {
          loading: false,
          data: action.payload,
          error: null
        }
      });
    case constants.GET_ARRIVAL_LIST_ERROR:
      return produce(state, draftState => {
        draftState.arrivalList = {
          loading: false,
          data: new PageableList(),
          error: action.payload
        }
      });
    case constants.UPDATE_ARRIVAL_LIST_FILTER_PROPS:
      return produce(state, draftState => {
        draftState.arrivalListFilterProps = {
          ...state.arrivalListFilterProps,
          ...action.payload
        }
      });
    case constants.GET_ARRIVAL_LIST_SUPPLIERS_ITEMS_LOADING:
      return produce(state, draftState => {
        draftState.arrivalListSuppliersItems.loading = true
      });
    case constants.GET_ARRIVAL_LIST_SUPPLIERS_ITEMS:
      return produce(state, draftState => {
        draftState.arrivalListSuppliersItems = {
          loading: false,
          data: action.payload.content,
          error: null
        }
      });
    case constants.GET_ARRIVAL_LIST_SUPPLIERS_ITEMS_ERROR:
      return produce(state, draftState => {
        draftState.arrivalListSuppliersItems = {
          loading: false,
          data: [],
          error: action.payload
        }
      });

    case constants.UPDATE_ARRIVAL_CREATE_FORM_FIELDS:
      return produce(state, draftState => {
        draftState.arrivalCreateDetails.formFields = {
          ...state.arrivalCreateDetails.formFields,
          ...action.payload
        }
      });
    case constants.RESET_ARRIVAL_CREATE_FORM_FIELDS:
      return produce(state, draftState => {
        draftState.arrivalCreateDetails.formFields = initialState.arrivalCreateDetails.formFields
      });

    case constants.GET_ARRIVAL_CREATE_BRANCHES_ITEMS_LOADING:
      return produce(state, draftState => {
        draftState.arrivalCreateDetails.branchesItems.loading = true
      });
    case constants.GET_ARRIVAL_CREATE_BRANCHES_ITEMS:
      return produce(state, draftState => {
        draftState.arrivalCreateDetails.branchesItems = {
          loading: false,
          data: action.payload,
          error: null
        }
      });
    case constants.GET_ARRIVAL_CREATE_BRANCHES_ITEMS_ERROR:
      return produce(state, draftState => {
        draftState.arrivalCreateDetails.branches = {
          loading: false,
          data: [],
          error: action.payload
        }
      });

    case constants.GET_ARRIVAL_CREATE_SUPPLIERS_ITEMS_LOADING:
      return produce(state, draftState => {
        draftState.arrivalCreateDetails.suppliersItems.loading = true
      });
    case constants.GET_ARRIVAL_CREATE_SUPPLIERS_ITEMS:
      return produce(state, draftState => {
        draftState.arrivalCreateDetails.suppliersItems = {
          loading: false,
          data: action.payload.content,
          error: null
        }
      });
    case constants.GET_ARRIVAL_CREATE_SUPPLIERS_ITEMS_ERROR:
      return produce(state, draftState => {
        draftState.arrivalCreateDetails.suppliersItems = {
          loading: false,
          data: [],
          error: action.payload
        }
      });

    case constants.GET_ARRIVAL_CREATE_ORDER_DETAILS_LOADING:
      return produce(state, draftState => {
        draftState.arrivalCreateDetails.orderDetails.loading = true
      });
    case constants.GET_ARRIVAL_CREATE_ORDER_DETAILS:
      return produce(state, draftState => {
        draftState.arrivalCreateDetails.orderDetails = {
          loading: false,
          data: action.payload,
          error: null
        }
      });
    case constants.GET_ARRIVAL_CREATE_ORDER_DETAILS_ERROR:
      return produce(state, draftState => {
        draftState.arrivalCreateDetails.orderDetails = {
          loading: false,
          data: null,
          error: action.payload
        }
      });
    case constants.RESET_ARRIVAL_CREATE_ORDER_DETAILS:
      return produce(state, draftState => {
        draftState.arrivalCreateDetails.orderDetails = initialState.arrivalCreateDetails.orderDetails
      });
    case constants.GET_ARRIVAL_CREATE_ORDERS_ITEMS_LOADING:
      return produce(state, draftState => {
        draftState.arrivalCreateDetails.ordersItems.loading = true
      });
    case constants.GET_ARRIVAL_CREATE_ORDERS_ITEMS:
      return produce(state, draftState => {
        draftState.arrivalCreateDetails.ordersItems = {
          loading: false,
          data: action.payload.content,
          error: null
        }
      });
    case constants.GET_ARRIVAL_CREATE_ORDERS_ITEMS_ERROR:
      return produce(state, draftState => {
        draftState.arrivalCreateDetails.ordersItems = {
          loading: false,
          data: [],
          error: action.payload
        }
      });

    case constants.GET_ARRIVAL_CREATE_PRODUCTS_ITEMS_LOADING:
      return produce(state, draftState => {
        draftState.arrivalCreateDetails.productsItems.loading = true
      });
    case constants.GET_ARRIVAL_CREATE_PRODUCTS_ITEMS:
      return produce(state, draftState => {
        draftState.arrivalCreateDetails.productsItems = {
          loading: false,
          data: action.payload,
          error: null
        }
      });
    case constants.GET_ARRIVAL_CREATE_PRODUCTS_ITEMS_ERROR:
      return produce(state, draftState => {
        draftState.arrivalCreateDetails.productsItems = {
          loading: false,
          data: [],
          error: action.payload
        }
      });

    case constants.GET_ARRIVAL_CREATE_PRODUCT_UNITS_LOADING:
      return produce(state, draftState => {
        draftState.arrivalCreateDetails.productUnits.loading = true
      });
    case constants.GET_ARRIVAL_CREATE_PRODUCT_UNITS:
      return produce(state, draftState => {
        draftState.arrivalCreateDetails.productUnits = {
          loading: false,
          data: action.payload,
          error: null
        }
      });
    case constants.GET_ARRIVAL_CREATE_PRODUCT_UNITS_ERROR:
      return produce(state, draftState => {
        draftState.arrivalCreateDetails.productUnits = {
          loading: false,
          data: [],
          error: action.payload
        }
      });
    case constants.RESET_ARRIVAL_CREATE_PRODUCT_UNITS:
      return produce(state, draftState => {
        draftState.arrivalCreateDetails.productUnits = initialState.arrivalCreateDetails.productUnits
      });


    case constants.ADD_ARRIVALS_BY_ORDER_LOADING:
      return produce(state, draftState => {
        draftState.arrivalCreateDetails.addArrivalsByOrder.loading = true
      });
    case constants.ADD_ARRIVALS_BY_ORDER:
      return produce(state, draftState => {
        draftState.arrivalCreateDetails.addArrivalsByOrder = {
          loading: false,
          success: true,
          error: null
        }
      });
    case constants.ADD_ARRIVALS_BY_ORDER_ERROR:
      return produce(state, draftState => {
        draftState.arrivalCreateDetails.addArrivalsByOrder = {
          loading: false,
          success: false,
          error: action.payload
        }
      });
    case constants.ADD_ARRIVALS_BY_PRODUCT_LOADING:
      return produce(state, draftState => {
        draftState.arrivalCreateDetails.addArrivalsByProduct.loading = true
      });
    case constants.ADD_ARRIVALS_BY_PRODUCT:
      return produce(state, draftState => {
        draftState.arrivalCreateDetails.addArrivalsByProduct = {
          loading: false,
          success: true,
          error: null
        }
      });
    case constants.ADD_ARRIVALS_BY_PRODUCT_ERROR:
      return produce(state, draftState => {
        draftState.arrivalCreateDetails.addArrivalsByProduct = {
          loading: false,
          success: false,
          error: action.payload
        }
      });
    case constants.RESET_ADD_ARRIVALS:
      return produce(state, draftState => {
        draftState.arrivalCreateDetails.addArrivalsByOrder = initialState.arrivalCreateDetails.addArrivalsByOrder;
        draftState.arrivalCreateDetails.addArrivalsByProduct = initialState.arrivalCreateDetails.addArrivalsByProduct;
      });
    case constants.RESET_ARRIVAL_CREATE:
      return produce(state, draftState => {
        draftState.arrivalCreateDetails = initialState.arrivalCreateDetails;
      });

    case constants.GET_ARRIVAL_INFO_LOADING:
      return produce(state, draftState => {
        draftState.arrivalInfo.loading = true
      });
    case constants.GET_ARRIVAL_INFO:
      return produce(state, draftState => {
        draftState.arrivalInfo = {
          loading: false,
          data: action.payload,
          error: null
        }
      });
    case constants.GET_ARRIVAL_INFO_ERROR:
      return produce(state, draftState => {
        draftState.arrivalInfo = {
          loading: false,
          data: null,
          error: action.payload
        }
      });
    case constants.RESET_ARRIVAL_INFO:
      return produce(state, draftState => {
        draftState.arrivalInfo = initialState.arrivalInfo;
      });

    default:
      return state
  }
};

export default reducer;