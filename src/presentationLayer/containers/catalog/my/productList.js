import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { withRouter } from "react-router-dom";

import {
  CircularProgress,
  Grid,
  Typography,
  List,
  Tooltip,
  IconButton,
  DialogTitle,
  DialogContentText,
  DialogActions,
  Button,
  Dialog,
  Divider,
  DialogContent,
  makeStyles,
} from "@material-ui/core";
import { Edit, Delete, Check, Close } from "@material-ui/icons";
import SearchTextField from "../../../components/Textfields/search";
import Pagination from "../../../components/Pagination/Pagination";
import ProductAddEditComponent from "../components/ProductAddEditComponent";
import { useTranslation } from "react-i18next";
import NumberTextField from "../../../components/Textfields/NumberTextField";
import {
  fetchMyCatalog,
  fetchProductListForCategoryId,
  removeProduct,
  setProductList,
  updatePrice,
} from "./actions";
import withNotification from "../../../hocs/withNotification/WithNotification";

const useStyles = makeStyles(() => ({
  list: {
    minHeight: 300,
    marginTop: 10,
  },
  borderBottom: {
    borderBottom: "1px solid #eee",
  },
}));

let prices = new Map();
const ProductList = (props) => {
  const [updatingProduct, setUpdatingProduct] = useState();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteProductDialog, setDeleteProductDialog] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState();
  const [search, setSearch] = useState("");
  const [update, setUpdate] = useState(false);
  const currentBranch = useSelector(
    (state) => state.get("dashboard").currentBranch
  );
  const myCatalog = useSelector((state) => state.get("myCatalog").myCatalog);
  const productList = useSelector(
    (state) => state.get("myCatalog").productList
  );
  const page = useSelector((state) => state.get("myCatalog").page);
  const size = useSelector((state) => state.get("myCatalog").size);
  const totalPages = useSelector((state) => state.get("myCatalog").total);
  const isLoading = useSelector(
    (state) => state.get("myCatalog").productListLoading
  );
  const selectedCategoryId = useSelector(
    (state) => state.get("myCatalog").selectedCategoryId
  );
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const classes = useStyles();

  useEffect(
    () => {
      updateList();
    },
    [props.history.location]
  );

  useEffect(
    () => {
      dispatch(setProductList([]));
    },
    [currentBranch]
  );

  useEffect(
    () => {
      if (selectedCategoryId) {
        setDialogOpen(true);
      }
    },
    [selectedCategoryId]
  );

  const updateList = () => {
    let search = props.location.search;
    let id;
    if (search) {
      let splitted = search.split("=");
      if (splitted.length > 1) {
        id = splitted[1];
      }
    } else {
      dispatch(setProductList([]));
    }

    if (id !== undefined && (myCatalog || []).length) {
      dispatch(fetchProductListForCategoryId(id, currentBranch, page, size));
    }
  };

  useEffect(() => {
    return () => dispatch(setProductList([]));
  }, []);

  return (
    <Grid container>
      <Grid item xs={12}>
        <Grid container direction="row">
          <Grid item xs={6} style={{ paddingLeft: 10 }}>
            <Typography
              variant="h4"
              style={{ color: "#555", fontSize: 18, fontWeight: "bold" }}
            >
              {t("productList.list")}
            </Typography>
          </Grid>
          <Grid item xs={6} style={{ paddingRight: 10 }}>
            <SearchTextField
              tooltipTitle={t("productList.search_by_product")}
              onChange={(text) => {
                setSearch(text);
                let search = props.location.search;
                let id;
                if (search) {
                  let splitted = search.split("=");
                  if (splitted.length > 1) {
                    id = splitted[1];
                  }
                }
                if (id !== undefined) {
                  dispatch(
                    fetchProductListForCategoryId(
                      id,
                      currentBranch,
                      page,
                      size,
                      text
                    )
                  );
                } else {
                  dispatch(setProductList([]));
                }
              }}
            />
          </Grid>
        </Grid>
      </Grid>

      {console.log("productList", productList)}

      <Grid item xs={12} className={classes.list}>
        {isLoading ? (
          <Grid container justify="center" alignItems="center">
            <CircularProgress variant="indeterminate" />{" "}
            <div style={{ marginLeft: 20 }}>{t("common.loading")}</div>
          </Grid>
        ) : productList && productList.length === 0 ? (
          <Grid container justify="center" alignItems="center">
            <Typography variant="h4" style={{ color: "#555", fontSize: 14 }}>
              {t("productList.empty_product_list")}
            </Typography>
          </Grid>
        ) : (
          <Grid container>
            <Grid item xs={12}>
              <List>
                {productList && productList.length ? (
                  <Grid
                    container
                    className={classes.borderBottom}
                    style={{ paddingBottom: 20 }}
                  >
                    <Grid container direction="row">
                      <Grid item xs={6} style={{ paddingLeft: 10 }}>
                        <Typography
                          variant="h4"
                          style={{
                            color: "#555",
                            fontSize: 14,
                            fontWeight: "bold",
                          }}
                        >
                          {t("productList.product")}
                        </Typography>
                      </Grid>
                      <Grid item xs={2}>
                        {currentBranch && (
                          <div>
                            {t("productList.price")}{" "}
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                          </div>
                        )}
                      </Grid>
                      <Grid item xs={4}>
                        {currentBranch && (
                          <div>
                            {t("productList.operations")}{" "}
                            &nbsp;&nbsp;&nbsp;&nbsp;
                          </div>
                        )}
                      </Grid>
                    </Grid>
                  </Grid>
                ) : (
                  undefined
                )}
                {productList &&
                  productList.map((product, index) => {
                    return (
                      <Grid
                        container
                        direction="row"
                        style={{ padding: 10 }}
                        className={classes.borderBottom}
                      >
                        <Grid item xs={6} style={{ paddingLeft: 10 }}>
                          <Typography
                            variant="h4"
                            style={{
                              color: "#555",
                              fontSize: 14,
                              fontWeight: "bold",
                            }}
                          >
                            {page * size + index + 1}.{`${product.name}`}
                          </Typography>
                        </Grid>
                        <Grid item xs={2}>
                          {currentBranch && (
                            <NumberTextField
                              fullWidth
                              variant="outlined"
                              label={t("productList.price")}
                              value={
                                prices.get(product.id) !== undefined
                                  ? prices.get(product.id)
                                  : product.salesPrice
                              }
                              onChange={(event) => {
                                let n =
                                  Number(event.target.value) < 0
                                    ? 0
                                    : event.target.value;
                                prices.set(product.id, n);
                                setUpdate(!update);
                              }}
                            />
                          )}
                        </Grid>
                        <Grid item xs={1}>
                          {currentBranch && (
                            <Tooltip title={t("productList.save_cost")}>
                              <IconButton
                                color="primary"
                                disabled={prices.get(product.id) === undefined}
                                onClick={() => {
                                  // product.salesPrice = parseFloat(product.tempPrice);
                                  let search = props.location.search;
                                  let id;
                                  if (search) {
                                    let splitted = search.split("=");
                                    if (splitted.length > 1) {
                                      id = splitted[1];
                                    }
                                  }
                                  dispatch(
                                    updatePrice(
                                      {
                                        branchId: currentBranch,
                                        productId: product.id,
                                        salesPrice: Number(
                                          prices.get(product.id)
                                        ),
                                      },
                                      id
                                    )
                                  );
                                  prices.delete(product.id);
                                }}
                              >
                                <Check />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Grid>
                        <Grid item xs={1}>
                          {currentBranch && (
                            <Tooltip title={t("common.cancel")}>
                              <IconButton
                                color="secondary"
                                disabled={prices.get(product.id) === undefined}
                                onClick={() => {
                                  prices.delete(product.id);
                                  setUpdate(!update);
                                }}
                              >
                                <Close />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Grid>
                        <Grid item xs={1}>
                          {currentBranch && (
                            <Tooltip title={t("productList.change_product")}>
                              <IconButton
                                onClick={() => {
                                  setUpdatingProduct(product);
                                  setDialogOpen(true);
                                }}
                              >
                                <Edit />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Grid>
                        <Grid item xs={1}>
                          {currentBranch && (
                            <Tooltip title={t("productList.delete_product")}>
                              <IconButton
                                onClick={() => {
                                  setDeleteProductDialog(true);
                                  setDeletingProduct(product);
                                }}
                              >
                                <Delete />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Grid>
                      </Grid>
                    );
                  })}
              </List>
            </Grid>
          </Grid>
        )}
        <Grid item xs={12} style={{ marginTop: 20 }}>
          <Pagination
            page={page}
            pagesCount={totalPages}
            size={size}
            onPageChange={(page) => {
              let s = props.location.search;
              let id;
              if (s) {
                let splitted = s.split("=");
                if (splitted.length > 1) {
                  id = splitted[1];
                }
              }

              if (id !== undefined) {
                dispatch(
                  fetchProductListForCategoryId(
                    id,
                    currentBranch,
                    page,
                    size,
                    search
                  )
                );
              } else {
                dispatch(setProductList([]));
              }
            }}
            onSizeChange={(size) => {
              let s = props.location.search;
              let id;
              if (s) {
                let splitted = s.split("=");
                if (splitted.length > 1) {
                  id = splitted[1];
                }
              }
              if (id !== undefined) {
                dispatch(
                  fetchProductListForCategoryId(
                    id,
                    currentBranch,
                    page,
                    size,
                    search
                  )
                );
              } else {
                dispatch(setProductList([]));
              }
            }}
          />
        </Grid>
      </Grid>

      <Dialog
        onClose={() => {
          setDeleteProductDialog(false);
          setDeletingProduct(undefined);
        }}
        fullWidth
        open={deleteProductDialog}
      >
        <DialogTitle>{t("productList.delete_product_title")}</DialogTitle>
        <DialogContentText>
          <Typography
            variant="h4"
            style={{ padding: 20, fontSize: 17, color: "#555" }}
          >
            {t("productList.delete_product_text")}
          </Typography>
        </DialogContentText>
        <DialogActions>
          <Button
            color="primary"
            onClick={() => {
              let search = props.location.search;
              let id;
              if (search) {
                let splitted = search.split("=");
                if (splitted.length > 1) {
                  id = splitted[1];
                }
              }
              dispatch(
                removeProduct(deletingProduct, currentBranch, id, props)
              );
              setDeleteProductDialog(false);
              setDeletingProduct(undefined);
            }}
          >
            {t("common.yes")}
          </Button>
          <Button
            color="primary"
            onClick={() => {
              setDeleteProductDialog(false);
              setDeletingProduct(undefined);
            }}
          >
            {t("common.no")}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={dialogOpen}
        fullScreen
        PaperProps={{
          style: {
            backgroundColor: "#eee",
            boxShadow: "none",
          },
        }}
      >
        <DialogContent>
          <ProductAddEditComponent
            open={dialogOpen}
            current={updatingProduct}
            categoryId={selectedCategoryId}
            onBack={() => {
              setDialogOpen(false);
              setUpdatingProduct(undefined);
              dispatch(fetchMyCatalog(currentBranch));
            }}
            onDialogClose={() => {
              setDialogOpen(false);
              setUpdatingProduct(undefined);
              dispatch(fetchMyCatalog(currentBranch));
            }}
          />
        </DialogContent>
      </Dialog>
    </Grid>
  );
};

export default withNotification(withRouter(ProductList));
