import Logic from "#businessLayer";
import * as constants from "../constants";

// ORDERING
export const addOrderingProductAction = (params) => {
  return dispatch => {
    dispatch({
      type: constants.ADD_ORDERING_PRODUCT,
      payload: params
    });
  }
};

export const updateOrderingProductAction = (params) => {
  return dispatch => {
    dispatch({
      type: constants.UPDATE_ORDERING_PRODUCT,
      payload: params
    });
  }
};

export const deleteOrderingProductAction = (params) => {
  return dispatch => {
    dispatch({
      type: constants.DELETE_ORDERING_PRODUCT,
      payload: params
    });
  }
};

export const resetOrderingAction = () => {
  return dispatch => {
    dispatch({
      type: constants.RESET_ORDERING
    });
  }
};

export const setOrderingFieldsAction = (params) => {
  return dispatch => {
    dispatch({
      type: constants.SET_ORDERING_FIELDS,
      payload: params
    });
  }
};

export const setEditingProductsAction = (params) => {
  return dispatch => {
    dispatch({
      type: constants.SET_EDITING_PRODUCTS,
      payload: params
    });
  }
};

export const getSuppliersItemsAction = (params) => {
  return dispatch => {
    dispatch({
      type: constants.GET_SUPPLIERS_ITEMS_LOADING
    });
    Logic
      .ordering
      .getSuppliersItems(params)
      .then(response => {
        dispatch({
          type: constants.GET_SUPPLIERS_ITEMS,
          payload: response.data
        })
      })
      .catch(error => {
        dispatch({
          type: constants.GET_SUPPLIERS_ITEMS_ERROR,
          payload: error.response.data
        });
      })
  }
};

export const getBranchesItemsAction = (params) => {
  return dispatch => {
    dispatch({
      type: constants.GET_BRANCHES_ITEMS_LOADING
    });
    Logic
      .ordering
      .getBranchesItems(params)
      .then(response => {
        dispatch({
          type: constants.GET_BRANCHES_ITEMS,
          payload: response.data
        })
      })
      .catch(error => {
        dispatch({
          type: constants.GET_BRANCHES_ITEMS_ERROR,
          payload: error.response.data
        });
      })
  }
};

export const getPaymentsItemsAction = (params) => {
  return dispatch => {
    Logic
      .ordering
      .getPaymentsItems(params)
      .then(response => {
        dispatch({
          type: constants.GET_PAYMENTS_ITEMS,
          payload: response.data
        })
      })
  }
};

export const getDeliveryTypeItemsAction = (params) => {
  return dispatch => {
    Logic
      .ordering
      .getDeliveryTypeItems(params)
      .then(response => {
        dispatch({
          type: constants.GET_DELIVERY_TYPE_ITEMS,
          payload: response.data
        })
      })
  }
};

export const getProductsItemsAction = (params) => {
  return dispatch => {
    dispatch({
      type: constants.GET_PRODUCTS_ITEMS_LOADING
    });
    Logic
      .ordering
      .getProductsItems(params)
      .then(response => {
        dispatch({
          type: constants.GET_PRODUCTS_ITEMS,
          payload: response.data
        })
      })
      .catch(error => {
        dispatch({
          type: constants.GET_PRODUCTS_ITEMS_ERROR,
          payload: error.response.data
        });
      })
  }
};

export const resetProductsItemsAction = () => {
  return dispatch => {
    dispatch({
      type: constants.RESET_PRODUCTS_ITEMS
    });
  }
};

export const createOrderAction = (params) => {
  return dispatch => {
    dispatch({
      type: constants.CREATE_ORDER_LOADING
    });
    Logic
      .ordering
      .createOrder(params)
      .then(() => {
        dispatch({
          type: constants.CREATE_ORDER,
        })
      })
      .catch(error => {
        dispatch({
          type: constants.CREATE_ORDER_ERROR,
          payload: error.response.data
        });
      })
  }
};

export const updateOrderAction = (params) => {
  return dispatch => {
    dispatch({
      type: constants.UPDATE_ORDER_LOADING
    });
    Logic
      .ordering
      .updateOrder(params)
      .then(() => {
        dispatch({
          type: constants.UPDATE_ORDER,
        })
      })
      .catch(error => {
        dispatch({
          type: constants.UPDATE_ORDER_ERROR,
          payload: error.response.data
        });
      })
  }
};

export const deleteDraftOrderAction = (params) => {
  return dispatch => {
    dispatch({
      type: constants.DELETE_DRAFT_ORDER_LOADING
    });
    Logic
      .ordering
      .deleteDraftOrder(params)
      .then(() => {
        dispatch({
          type: constants.DELETE_DRAFT_ORDER,
        })
      })
      .catch(error => {
        dispatch({
          type: constants.DELETE_DRAFT_ORDER_ERROR,
          payload: error.response.data
        });
      })
  }
};

export const resetDeleteDraftOrderAction = () => {
  return dispatch => {
    dispatch({
      type: constants.RESET_DELETE_DRAFT_ORDER
    });
  }
};