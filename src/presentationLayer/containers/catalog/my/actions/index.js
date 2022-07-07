import Logic from "#businessLayer";
import {
  MY_CATALOG_PRODUCT_LIST,
  MY_CATALOG_SYNC_BRANCH_LIST,
  MY_CATALOG_LOADING,
  MY_CATALOG_LIST,
  MY_CATALOG_NODE,
  MY_CATALOG_PRODUCT_LIST_LOADING,
  MY_CATALOG_UNIT_LIST,
  DIALOG_PRODUCT_LOADING,
  DIALOG_PRODUCT,
  MY_CATALOG_SELECTED_CATEGORY_ID,
  MY_CATALOG_VAT_LIST,
} from "../reducer";
import axios from "axios";
import produce from "immer";
const CancelToken = axios.CancelToken;
var source = CancelToken.source();

export const fetchVatList = () => {
  return (disptach) => {
    Logic.resource
      .fetchVatList()
      .then((response) => {
        disptach({
          type: MY_CATALOG_VAT_LIST,
          payload: response.data,
        });
      })
      .catch(console.log);
  };
};

export const fetchMyCatalog = (branchId) => {
  return (dispatch) => {
    dispatch({
      type: MY_CATALOG_LOADING,
      payload: true,
    });
    Logic.myCatalog
      .fetchMyCatalog(branchId)
      .then((response) => {
        dispatch({
          type: MY_CATALOG_LIST,
          payload: response.data,
        });
        dispatch({
          type: MY_CATALOG_LOADING,
          payload: false,
        });
      })
      .catch((error) => {
        console.log(error);
        dispatch({
          type: MY_CATALOG_LOADING,
          payload: false,
        });
      });
  };
};

export const fetchBranchList = () => {
  return (dispatch) => {
    Logic.branch
      .fetchSelectBoxBranchList()
      .then((response) => {
        dispatch({
          type: MY_CATALOG_SYNC_BRANCH_LIST,
          payload: response.data,
        });
      })
      .catch(console.log);
  };
};

export const addCategory = (category, branchId, props) => {
  return async (dispatch) => {
    dispatch({
      type: MY_CATALOG_LOADING,
      payload: true,
    });
    try {
      await Logic.myCatalog.addCategory({ ...category, branchId: branchId });
      let response = await Logic.myCatalog.fetchMyCatalog(branchId);
      dispatch({
        type: MY_CATALOG_LIST,
        payload: response.data,
      });
      dispatch({
        type: MY_CATALOG_LOADING,
        payload: false,
      });
    } catch (error) {
      props.error && props.error(error.toString());
      dispatch({
        type: MY_CATALOG_LOADING,
        payload: false,
      });
    }
  };
};

export const updateCategory = (category, branchId) => {
  return async (dispatch) => {
    dispatch({
      type: MY_CATALOG_LOADING,
      payload: true,
    });
    try {
      await Logic.myCatalog.updateCategory({ ...category, branchId });
      let response = await Logic.myCatalog.fetchMyCatalog(branchId);
      dispatch({
        type: MY_CATALOG_LIST,
        payload: response.data,
      });
      dispatch({
        type: MY_CATALOG_LOADING,
        payload: false,
      });
    } catch (error) {
      dispatch({
        type: MY_CATALOG_LOADING,
        payload: false,
      });
    }
  };
};

export const removeCategory = (category, branchId, props) => {
  return async (dispatch) => {
    dispatch({
      type: MY_CATALOG_LOADING,
      payload: true,
    });
    try {
      const disableCategory = (c) => {
        let d = produce(c, (draft) => {
          draft.enabled = false;
        });
        if (d.children && d.children.length !== 0) {
          return produce(d, (draft) => {
            draft.children = d.children.map((item) => disableCategory(item));
          });
        } else {
          return d;
        }
      };
      let c = { ...category };
      c = disableCategory(c);
      console.log("rem, del", c);
      await Logic.myCatalog.removeCategory({ ...c, branchId });
      let response = await Logic.myCatalog.fetchMyCatalog(branchId);
      props.success &&
        props.success("Удален успешно! Процесс может занять около минуты");
      dispatch({
        type: MY_CATALOG_LIST,
        payload: response.data,
      });

      dispatch({
        type: MY_CATALOG_LOADING,
        payload: false,
      });
    } catch (error) {
      console.log(error);
      dispatch({
        type: MY_CATALOG_LOADING,
        payload: false,
      });
      props.error && props.error(error.toString());
    }
  };
};

export const setProductList = (productList) => {
  return {
    type: MY_CATALOG_PRODUCT_LIST,
    payload: {
      content: productList,
      page: 0,
      number: 0,
      size: 20,
      totalPages: 0,
      totalElements: 0,
    },
  };
};

export const setCategory = (node) => {
  return {
    type: MY_CATALOG_NODE,
    payload: node,
  };
};

export const fetchProductListForCategoryId = (
  categoryId,
  branchId,
  page,
  size,
  search
) => {
  return (dispatch) => {
    dispatch({
      type: MY_CATALOG_PRODUCT_LIST_LOADING,
      payload: true,
    });
    source.cancel("Остановить запрос!");
    source = CancelToken.source();
    Logic.product
      .fetchProductListForCategoryId(
        { categoryId, branchId, page, size, search },
        source.token
      )
      .then((response) => {
        dispatch({
          type: MY_CATALOG_PRODUCT_LIST,
          payload: response.data,
        });
        dispatch({
          type: MY_CATALOG_PRODUCT_LIST_LOADING,
          payload: false,
        });
      })
      .catch(console.log);
  };
};

export const fetchProductListForKeyword = (keyword, withBalance, branchId) => {
  return (dispatch) => {
    dispatch({
      type: MY_CATALOG_PRODUCT_LIST_LOADING,
      payload: true,
    });
    source.cancel("Остановить запрос!");
    source = CancelToken.source();
    Logic.product
      .fetchProductListForKeyword(
        { search: keyword, withBalance, branchId },
        source.token
      )
      .then((response) => {
        dispatch({
          type: MY_CATALOG_PRODUCT_LIST,
          payload: response.data,
        });
        dispatch({
          type: MY_CATALOG_PRODUCT_LIST_LOADING,
          payload: false,
        });
      })
      .catch((error) => {
        dispatch({
          type: MY_CATALOG_PRODUCT_LIST_LOADING,
          payload: false,
        });
      });
  };
};

export const removeProduct = (product, branchId, categoryId, props) => {
  return async (dispatch) => {
    dispatch({ type: MY_CATALOG_PRODUCT_LIST_LOADING, payload: true });
    try {
      let p = { ...product, enabled: false };
      await Logic.product.removeProduct(p, branchId);
      dispatch(fetchMyCatalog(branchId));
      let response = await Logic.product.fetchProductListForCategoryId({
        categoryId,
        branchId,
        page: props ? props.page : 0,
        size: props ? props.size : 20,
      });
      dispatch({
        type: MY_CATALOG_PRODUCT_LIST,
        payload: response.data,
      });
      dispatch({ type: MY_CATALOG_PRODUCT_LIST_LOADING, payload: false });
    } catch (error) {
      props.error && props.error(error.toString());
      dispatch({ type: MY_CATALOG_PRODUCT_LIST_LOADING, payload: false });
    }
  };
};

export const updatePrice = (product, categoryId) => {
  return async (dispatch) => {
    dispatch({
      type: MY_CATALOG_PRODUCT_LIST_LOADING,
      payload: true,
    });
    try {
      await Logic.product.updatePrice(product);
      let response = await Logic.product.fetchProductListForCategoryId({
        categoryId,
        branchId: product.branchId,
      });
      dispatch({
        type: MY_CATALOG_PRODUCT_LIST,
        payload: response.data,
      });
      dispatch({
        type: MY_CATALOG_PRODUCT_LIST_LOADING,
        payload: false,
      });
    } catch (error) {
      dispatch({
        type: MY_CATALOG_PRODUCT_LIST_LOADING,
        payload: false,
      });
    }
  };
};

export const updateProduct = (product, close, branchId) => {
  return async (dispatch) => {
    dispatch({
      type: MY_CATALOG_PRODUCT_LIST_LOADING,
      payload: true,
    });
    try {
      await Logic.product.updateProduct({ ...product, branchId: branchId });
      let response = await Logic.product.fetchProductListForCategoryId({
        categoryId: product.categoryDTO ? product.categoryDTO.id : undefined,
        branchId: branchId === -1 ? undefined : branchId,
      });
      dispatch({
        type: MY_CATALOG_PRODUCT_LIST,
        payload: response.data,
      });
      dispatch({
        type: MY_CATALOG_PRODUCT_LIST_LOADING,
        payload: false,
      });
      close && close(true);
    } catch (error) {
      dispatch({
        type: MY_CATALOG_PRODUCT_LIST_LOADING,
        payload: false,
      });
    }
  };
};

export const createProduct = (product, close, branchId) => {
  return async (dispatch) => {
    dispatch({
      type: MY_CATALOG_PRODUCT_LIST_LOADING,
      payload: true,
    });
    try {
      await Logic.product.createProduct({
        ...product,
        branchId: branchId === -1 ? undefined : branchId,
      });
      let response = await Logic.product.fetchProductListForCategoryId({
        categoryId: product.categoryDTO.id,
        branchId: branchId === -1 ? undefined : branchId,
      });
      dispatch({
        type: MY_CATALOG_PRODUCT_LIST,
        payload: response.data,
      });
      dispatch({
        type: MY_CATALOG_PRODUCT_LIST_LOADING,
        payload: false,
      });
      close && close(true);
    } catch (error) {
      dispatch({
        type: MY_CATALOG_PRODUCT_LIST_LOADING,
        payload: false,
      });
    }
  };
};

export const fetchUnitList = () => {
  return (dispatch) => {
    Logic.resource
      .fetchUnitList()
      .then((response) => {
        dispatch({
          type: MY_CATALOG_UNIT_LIST,
          payload: response.data,
        });
      })
      .catch((error) => {});
  };
};

export const fetchProductById = (id, currentBranch) => {
  return (dispatch) => {
    dispatch({
      type: DIALOG_PRODUCT_LOADING,
      payload: true,
    });
    Logic.product
      .fetchProductById(id, currentBranch)
      .then((response) => {
        dispatch({
          type: DIALOG_PRODUCT,
          payload: response.data,
        });
        dispatch({
          type: DIALOG_PRODUCT_LOADING,
          payload: false,
        });
      })
      .catch((e) => {
        dispatch({
          type: DIALOG_PRODUCT_LOADING,
          payload: false,
        });
      });
  };
};

export const setDialogProduct = (product) => {
  return {
    type: DIALOG_PRODUCT,
    payload: undefined,
  };
};

export const setSelectedCategoryId = (id) => {
  return {
    type: MY_CATALOG_SELECTED_CATEGORY_ID,
    payload: id,
  };
};

export const transferCatalog = (fromBranch, toBranch, props) => {
  return async (_) => {
    try {
      await Logic.single.transferCatalog(fromBranch, toBranch);
      props && props.success("Успешно завершен!");
    } catch (error) {
      props.error && props.error(error.message);
    }
  };
};
