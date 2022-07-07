import Logic from "#businessLayer";
import * as constants from "../constants";

// OFFERS
export const getOffersListAction = (params) => {
  return dispatch => {
    dispatch({
      type: constants.GET_OFFERS_LIST_LOADING
    });
    Logic
      .supplierCatalog
      .getOffersList(params)
      .then(response => {
        dispatch({
          type: constants.GET_OFFERS_LIST,
          payload: response.data
        })
      })
      .catch(error => {
        dispatch({
          type: constants.GET_OFFERS_LIST_ERROR,
          payload: error.response.statusText
        });
      })
  }
};

export const updateOffersListFilterPropsAction = (params) => {
  return dispatch => {
    dispatch({
      type: constants.UPDATE_OFFERS_LIST_FILTER_PROPS,
      payload: params
    });
  }
};

export const resetSupplierCatalogAction = () => {
  return dispatch => {
    dispatch({
      type: constants.RESET_SUPPLIER_CATALOG
    });
  }
};

export const getVatItemsAction = () => {
  return dispatch => {
    dispatch({
      type: constants.GET_VAT_ITEMS_LOADING
    });
    Logic
      .supplierCatalog
      .getVatItems()
      .then(response => {
        dispatch({
          type: constants.GET_VAT_ITEMS,
          payload: response.data
        })
      })
      .catch(error => {
        dispatch({
          type: constants.GET_VAT_ITEMS_ERROR,
          payload: error.response.statusText
        });
      })
  }
};