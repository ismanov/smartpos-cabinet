import Logic from "#businessLayer";
import {
  PRICE_HISTORY,
  CATEGORY_CHANGE_PRICE_LOADING,
  PRICE_SELECTED_CATEGORY_ID,
} from "../reducer";

export const setCategoryId = (categoryId) => ({
  type: PRICE_SELECTED_CATEGORY_ID,
  payload: categoryId,
});

export const clearProductPriceHistory = () => {
  return {
    type: PRICE_HISTORY,
    payload: [],
  };
};

export const fetchProductPriceHistory = (id, branchId) => {
  return (dispatch) => {
    Logic.product
      .fetchProductPricingHistory(id, branchId)
      .then((response) => {
        dispatch({
          type: PRICE_HISTORY,
          payload: response.data,
        });
      })
      .catch(console.log);
  };
};

export const changeCategoryPrice = (
  branchId,
  categoryId,
  amountPercent,
  props,
  cb,
  decrease
) => {
  return (dispatch) => {
    dispatch({
      type: CATEGORY_CHANGE_PRICE_LOADING,
      payload: true,
    });
    const stopLoading = () =>
      dispatch({
        type: CATEGORY_CHANGE_PRICE_LOADING,
        payload: false,
      });
    let error = false;
    Logic.product
      .changeCategoryPrice(branchId, categoryId, amountPercent, decrease)
      .then(() => {
        props.success && props.success("Цена изменена успешно!");
      })
      .catch((e) => {
        console.log(e);
        error = true;
      })
      .finally(() => {
        if (cb) {
          cb(error);
        }
        stopLoading();
      });
  };
};
