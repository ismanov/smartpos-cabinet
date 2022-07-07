import Logic from "#businessLayer";
import * as constants from "../constants";

// LIST
export const getArrivalListAction = (params) => {
  return dispatch => {
    dispatch({
      type: constants.GET_ARRIVAL_LIST_LOADING
    });
    Logic
      .arrival
      .getArrivalList(params)
      .then(response => {
        dispatch({
          type: constants.GET_ARRIVAL_LIST,
          payload: response.data
        })
      })
      .catch(error => {
        dispatch({
          type: constants.GET_ARRIVAL_LIST_ERROR,
          payload: error.response.data
        });
      })
  }
};

export const updateArrivalListFilterPropsAction = (params) => {
  return dispatch => {
    dispatch({
      type: constants.UPDATE_ARRIVAL_LIST_FILTER_PROPS,
      payload: params
    });
  }
};

export const getArrivalListSuppliersItemsAction = (params) => {
  return dispatch => {
    dispatch({
      type: constants.GET_ARRIVAL_LIST_SUPPLIERS_ITEMS_LOADING
    });
    Logic
      .arrival
      .getSuppliersItems(params)
      .then(response => {
        dispatch({
          type: constants.GET_ARRIVAL_LIST_SUPPLIERS_ITEMS,
          payload: response.data
        })
      })
      .catch(error => {
        dispatch({
          type: constants.GET_ARRIVAL_LIST_SUPPLIERS_ITEMS_ERROR,
          payload: error.response.data
        });
      })
  }
};

// CREATE
export const updateArrivalCreateFormFieldsAction = (params) => {
  return dispatch => {
    dispatch({
      type: constants.UPDATE_ARRIVAL_CREATE_FORM_FIELDS,
      payload: params
    });
  }
};

export const resetArrivalCreateFormFieldsAction = () => {
  return dispatch => {
    dispatch({
      type: constants.RESET_ARRIVAL_CREATE_FORM_FIELDS
    });
  }
};

export const getArrivalCreateBranchesItemsAction = (params) => {
  return dispatch => {
    dispatch({
      type: constants.GET_ARRIVAL_CREATE_BRANCHES_ITEMS_LOADING
    });
    Logic
      .arrival
      .getArrivalCreateBranches(params)
      .then(response => {
        dispatch({
          type: constants.GET_ARRIVAL_CREATE_BRANCHES_ITEMS,
          payload: response.data
        })
      })
      .catch(error => {
        dispatch({
          type: constants.GET_ARRIVAL_CREATE_BRANCHES_ITEMS_ERROR,
          payload: error.response.data
        });
      })
  }
};

export const getArrivalCreateSuppliersItemsAction = (params) => {
  return dispatch => {
    dispatch({
      type: constants.GET_ARRIVAL_CREATE_SUPPLIERS_ITEMS_LOADING
    });
    Logic
      .arrival
      .getSuppliersItems(params)
      .then(response => {
        dispatch({
          type: constants.GET_ARRIVAL_CREATE_SUPPLIERS_ITEMS,
          payload: response.data
        })
      })
      .catch(error => {
        dispatch({
          type: constants.GET_ARRIVAL_CREATE_SUPPLIERS_ITEMS_ERROR,
          payload: error.response.data
        });
      })
  }
};

export const getArrivalCreateOrderDetailsAction = (params) => {
  return dispatch => {
    dispatch({
      type: constants.GET_ARRIVAL_CREATE_ORDER_DETAILS_LOADING
    });
    Logic
      .arrival
      .getArrivalCreateProducts(params)
      .then(response => {
        dispatch({
          type: constants.GET_ARRIVAL_CREATE_ORDER_DETAILS,
          payload: response.data
        })
      })
      .catch(error => {
        dispatch({
          type: constants.GET_ARRIVAL_CREATE_ORDER_DETAILS_ERROR,
          payload: error.response.data
        });
      })
  }
};

export const resetArrivalCreateOrderDetailsAction = () => {
  return dispatch => {
    dispatch({
      type: constants.RESET_ARRIVAL_CREATE_ORDER_DETAILS
    });
  }
};

export const getArrivalCreateOrdersItemsAction = (params) => {
  return dispatch => {
    dispatch({
      type: constants.GET_ARRIVAL_CREATE_ORDERS_ITEMS_LOADING
    });
    Logic
      .arrival
      .getArrivalCreateOrders(params)
      .then(response => {
        dispatch({
          type: constants.GET_ARRIVAL_CREATE_ORDERS_ITEMS,
          payload: response.data
        })
      })
      .catch(error => {
        dispatch({
          type: constants.GET_ARRIVAL_CREATE_ORDERS_ITEMS_ERROR,
          payload: error.response.data
        });
      })
  }
};

export const getArrivalCreateProductsItemsAction = (params) => {
  return dispatch => {
    dispatch({
      type: constants.GET_ARRIVAL_CREATE_PRODUCTS_ITEMS_LOADING
    });
    Logic
      .arrival
      .getArrivalCreateProductsItems(params)
      .then(response => {
        dispatch({
          type: constants.GET_ARRIVAL_CREATE_PRODUCTS_ITEMS,
          payload: response.data
        })
      })
      .catch(error => {
        dispatch({
          type: constants.GET_ARRIVAL_CREATE_PRODUCTS_ITEMS_ERROR,
          payload: error.response.data
        });
      })
  }
};

export const getArrivalCreateProductUnitsAction = (params) => {
  return dispatch => {
    dispatch({
      type: constants.GET_ARRIVAL_CREATE_PRODUCT_UNITS_LOADING
    });
    Logic
      .arrival
      .getArrivalCreateProductUnits(params)
      .then(response => {
        dispatch({
          type: constants.GET_ARRIVAL_CREATE_PRODUCT_UNITS,
          payload: response.data
        })
      })
      .catch(error => {
        dispatch({
          type: constants.GET_ARRIVAL_CREATE_PRODUCT_UNITS_ERROR,
          payload: error.response.data
        });
      })
  }
};

export const resetArrivalCreateProductUnitsAction = () => {
  return dispatch => {
    dispatch({
      type: constants.RESET_ARRIVAL_CREATE_PRODUCT_UNITS
    });
  }
};

export const addArrivalsByOrderAction = (params) => {
  return dispatch => {
    dispatch({
      type: constants.ADD_ARRIVALS_BY_ORDER_LOADING
    });
    Logic
      .arrival
      .addArrivalsByOrder(params)
      .then(response => {
        dispatch({
          type: constants.ADD_ARRIVALS_BY_ORDER,
          payload: response.data
        })
      })
      .catch(error => {
        dispatch({
          type: constants.ADD_ARRIVALS_BY_ORDER_ERROR,
          payload: error.response.data
        });
      })
  }
};

export const addArrivalsByProductAction = (params) => {
  return dispatch => {
    dispatch({
      type: constants.ADD_ARRIVALS_BY_PRODUCT_LOADING
    });
    Logic
      .arrival
      .addArrivalsByProduct(params)
      .then(response => {
        dispatch({
          type: constants.ADD_ARRIVALS_BY_PRODUCT,
          payload: response.data
        })
      })
      .catch(error => {
        dispatch({
          type: constants.ADD_ARRIVALS_BY_PRODUCT_ERROR,
          payload: error.response.data
        });
      })
  }
};

export const resetAddArrivalsAction = () => {
  return dispatch => {
    dispatch({
      type: constants.RESET_ADD_ARRIVALS
    });
  }
};

export const resetArrivalCreateAction = () => {
  return dispatch => {
    dispatch({
      type: constants.RESET_ARRIVAL_CREATE
    });
  }
};

// INFO
export const getArrivalInfoAction = (params) => {
  return dispatch => {
    dispatch({
      type: constants.GET_ARRIVAL_INFO_LOADING
    });
    Logic
      .arrival
      .getArrivalInfo(params)
      .then(response => {
        dispatch({
          type: constants.GET_ARRIVAL_INFO,
          payload: response.data
        })
      })
      .catch(error => {
        dispatch({
          type: constants.GET_ARRIVAL_INFO_ERROR,
          payload: error.response.data
        });
      })
  }
};

export const resetArrivalInfoAction = () => {
  return dispatch => {
    dispatch({
      type: constants.RESET_ARRIVAL_INFO
    });
  }
};