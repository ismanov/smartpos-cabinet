import Logic from '#businessLayer';
import FileDownload from "js-file-download";
import {
  REPORT_BY_PRODUCT_LIST,
  REPORT_BY_PRODUCT_LOADING,
  REPORT_BY_PRODUCT_SORT,
  REPORT_BY_PRODUCT_STATS_LOADING,
  REPORT_BY_PRODUCT_STATS,
  REPORT_BY_PRODUCT_STATS_ERROR
} from '../reducer';

export const setSort = (sort) => ({
    type: REPORT_BY_PRODUCT_SORT,
    payload: sort,
});

export const reportByProduct = ({branchId, categoryId, from, to, page, size=100000, sort, productId, isSocial, fromSalesTotal, toSalesTotal}) => {
    return dispatch => {
        dispatch({
            type: REPORT_BY_PRODUCT_LOADING,
            payload: true
        });
        Logic
            .report
            .reportByProducts({branchId, categoryIds: categoryId, from, to, page, size, orderBy: sort ? sort.col : undefined, sortOrder: sort ? sort.order: undefined, productId, onlySocial: isSocial, fromSalesTotal, toSalesTotal})
            .then(response => {
                dispatch({
                    type: REPORT_BY_PRODUCT_LIST,
                    payload: response.data
                });
                dispatch({
                    type: REPORT_BY_PRODUCT_LOADING,
                    payload: false
                });
            })
            .catch(error => {
                console.log(error);
                dispatch({
                    type: REPORT_BY_PRODUCT_LOADING,
                    payload: false
                });
            })

    }
};

export const byProductsExcelReport = (filters) => {
    return () => {
        Logic
            .excel
            .products(filters)
            .then(response => { FileDownload(response.data, 'report_by_products.xlsx'); })
            .catch(console.log)
    }
};

export const getProductStats = (params) => {
  return dispatch => {
    dispatch({
      type: REPORT_BY_PRODUCT_STATS_LOADING
    });
    Logic
      .report
      .getProductStats(params)
      .then(response => {
        dispatch({
          type: REPORT_BY_PRODUCT_STATS,
          payload: response.data
        });
      })
      .catch(error => {
        dispatch({
          type: REPORT_BY_PRODUCT_STATS_ERROR,
          payload: error
        });
      })

  }
};