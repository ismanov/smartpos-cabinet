import Logic from "#businessLayer";
import * as constants from "../constants";

// SUPPLIER INFO
export const getSupplierInfoAction = (params) => {
  return dispatch => {
    dispatch({
      type: constants.GET_SUPPLIER_INFO_LOADING
    });
    Logic
      .supplierCatalog
      .getSupplierInfo(params)
      .then(response => {
        dispatch({
          type: constants.GET_SUPPLIER_INFO,
          payload: response.data
        })
      })
      .catch(error => {
        dispatch({
          type: constants.GET_SUPPLIER_INFO_ERROR,
          payload: error.response.data
        });
      })
  }
};

// CATEGORIES
export const getCategoriesListAction = (params) => {
  return dispatch => {
    dispatch({
      type: constants.GET_CATEGORIES_LIST_LOADING
    });
    Logic
      .supplierCatalog
      .getCategoriesList(params)
      .then(response => {
        dispatch({
          type: constants.GET_CATEGORIES_LIST,
          payload: response.data
        })
      })
      .catch(error => {
        dispatch({
          type: constants.GET_CATEGORIES_LIST_ERROR,
          payload: error.response.data
        });
      })
  }
};

export const resetCategoriesListAction = () => {
  return dispatch => {
    dispatch({
      type: constants.RESET_CATEGORIES_LIST
    });
  }
};

export const resetSupplierDetailAction = () => {
  return dispatch => {
    dispatch({
      type: constants.RESET_SUPPLIER_DETAIL
    });
  }
};

export const setCategoriesBranchAction = (params) => {
  return dispatch => {
    dispatch({
      type: constants.SET_CATEGORIES_BRANCH,
      payload: params
    });
  }
};

export const getBranchesItemsAction = (params) => {
  return dispatch => {
    dispatch({
      type: constants.GET_BRANCHES_ITEMS_LOADING
    });
    Logic
      .supplierCatalog
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
          payload: error.response.statusText
        });
      })
  }
};

// PRODUCTS
export const getProductsAction = (params) => {
  return dispatch => {
    dispatch({
      type: constants.GET_PRODUCTS_LOADING
    });
    Logic
      .supplierCatalog
      .getProducts(params)
      .then(response => {
        dispatch({
          type: constants.GET_PRODUCTS,
          payload: response.data
        })
      })
      .catch(error => {
        dispatch({
          type: constants.GET_PRODUCTS_ERROR,
          payload: error.response.data
        });
      })
  }
};

export const resetProductsAction = () => {
  return dispatch => {
    dispatch({
      type: constants.RESET_PRODUCTS
    });
  }
};

export const updateProductsFilterPropsAction = (params) => {
  return dispatch => {
    dispatch({
      type: constants.UPDATE_PRODUCTS_FILTER_PROPS,
      payload: params
    });
  }
};

export const addSelectedProductsAction = (params) => {
  return dispatch => {
    dispatch({
      type: constants.ADD_SELECTED_PRODUCT,
      payload: params
    });
  }
};

export const showSelectedProductsAction = (params) => {
  return dispatch => {
    dispatch({
      type: constants.SHOW_SELECTED_PRODUCTS,
      payload: params
    });
  }
};