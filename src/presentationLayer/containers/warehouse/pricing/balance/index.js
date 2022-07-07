import React, { useEffect, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { withRouter } from "react-router-dom";
import {
  Grid,
  List,
  Divider,
  Typography,
  IconButton,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContentText,
  DialogActions,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Tooltip,
} from "@material-ui/core";
import { Close, Check, ListOutlined } from "@material-ui/icons";
import moment from "moment";
import SelectBox from "#components/Select";
import * as styles from "./all.module.scss";
import Pagination from "../../../../components/Pagination/Pagination";
import { useTranslation } from "react-i18next";
import PricingCatalogTree from "./components";
import {
  fetchMyCatalog,
  setCategory,
  setProductList,
  fetchProductListForCategoryId,
  updatePrice,
} from "../../../catalog/my/actions";
import {
  fetchProductPriceHistory,
  changeCategoryPrice,
  setCategoryId,
} from "./actions";
import NumberTextField from "../../../../components/Textfields/NumberTextField";
import withNotification from "../../../../hocs/withNotification/WithNotification";

// let categoryId = -1;
let prices = new Map();

const Pricing = (props) => {
  const [productHistoryDialog, setProductHistoryDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState();
  const [selectedCategory, setSelectedCategory] = useState();
  const [changePriceDialog, setChangePriceDialog] = useState(false);
  const [update, setUpdate] = useState(false);
  const [percent, setPercent] = useState();
  const [changePriceType, setChangePriceType] = useState("inc");

  const dispatch = useDispatch();
  const currentBranch = useSelector(
    (state) => state.get("dashboard").currentBranch
  );
  const myCatalog = useSelector((state) => state.get("myCatalog").myCatalog);
  const productList = useSelector(
    (state) => state.get("myCatalog").productList
  );
  const page = useSelector((state) => state.get("myCatalog").page);
  const size = useSelector((state) => state.get("myCatalog").size);
  const total = useSelector((state) => state.get("myCatalog").total);
  const productListLoading = useSelector(
    (state) => state.get("myCatalog").productListLoading
  );
  const priceHistory = useSelector(
    (state) => state.get("pricing").priceHistoryList
  );
  const isCategoryChangePriceLoading = useSelector(
    (state) => state.get("pricing").isLoading
  );
  const categoryId = useSelector((state) => state.get("pricing").categoryId);

  const { t } = useTranslation();

  useEffect(
    () => {
      updateUI();
    },
    [currentBranch, categoryId]
  );

  const updateUI = () => {
    dispatch(fetchMyCatalog(currentBranch));
    dispatch(setProductList([]));
    dispatch(setCategory(undefined));
    if (categoryId) {
      dispatch(fetchProductListForCategoryId(categoryId, currentBranch));
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.filter}>
        <Typography
          variant="h4"
          style={{ color: "#555", fontSize: 18, fontWeight: "bold" }}
        >
          {t("pricing.title")}
        </Typography>
      </div>
      <Dialog
        onClose={() => {
          setProductHistoryDialog(false);
          setSelectedProduct(undefined);
        }}
        fullWidth
        open={productHistoryDialog}
      >
        <DialogTitle>{t("pricing.dialog_title")}</DialogTitle>
        <DialogContentText>
          <Grid container style={{ padding: 15 }}>
            <Grid container>
              <Typography
                variant="h4"
                style={{ padding: 20, fontSize: 17, color: "#555" }}
              >
                {t("pricing.product")}: {selectedProduct}
              </Typography>
            </Grid>
            <Grid container style={{ marginTop: 10 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{t("pricing.date")}</TableCell>
                    <TableCell>{t("pricing.was")}</TableCell>
                    <TableCell>{t("pricing.now")}</TableCell>
                    <TableCell>{t("pricing.changedBy")}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {priceHistory && priceHistory.length !== 0 ? (
                    priceHistory.map((history, index) => {
                      return (
                        <TableRow key={index}>
                          <TableCell>
                            {moment(history.updatedDateTime).format(
                              "YYYY-DD-MM HH:mm:ss"
                            )}
                          </TableCell>
                          <TableCell>
                            {isNaN(parseFloat(history.oldPrice))
                              ? 0
                              : parseFloat(history.oldPrice)}
                          </TableCell>
                          <TableCell>
                            {isNaN(parseFloat(history.newPrice))
                              ? 0
                              : parseFloat(history.newPrice)}
                          </TableCell>
                          <TableCell>
                            {history.updatedBy
                              ? `${history.updatedBy.lastName} ${
                                  history.updatedBy.firstName
                                }`
                              : t("common.not_defined")}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4}>
                        <Grid
                          container
                          justify="center"
                          style={{ padding: 10, color: "#999", fontSize: 13 }}
                        >
                          {t("common.empty_list")}
                        </Grid>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Grid>
          </Grid>
        </DialogContentText>
        <DialogActions>
          <Button
            color="primary"
            onClick={() => {
              setProductHistoryDialog(false);
              setSelectedProduct(undefined);
            }}
          >
            {t("common.close")}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        onClose={() => {
          setChangePriceDialog(false);
          setSelectedCategory(undefined);
          setPercent(null);
          setChangePriceType(null);
        }}
        fullWidth
        open={changePriceDialog}
      >
        <DialogTitle>{t("pricing.dialog_set_price_title")}</DialogTitle>
        <DialogContentText>
          <Grid container style={{ padding: 15 }}>
            <Grid container>
              <Grid container>
                <Typography
                  variant="h4"
                  style={{ padding: 20, fontSize: 17, color: "#555" }}
                >
                  {t("pricing.category")}:{" "}
                  {selectedCategory ? selectedCategory.name : ""}
                </Typography>
              </Grid>
              <Grid
                container
                justify="center"
                direction="row"
                style={{ marginTop: 10 }}
              >
                <Grid item xs={6}>
                  <SelectBox
                    data={[
                      {
                        key: "inc",
                        value: t("pricing.addPrice"),
                      },
                      {
                        key: "dec",
                        value: t("pricing.subtractPrice"),
                      },
                    ]}
                    onChange={(e) => {
                      setChangePriceType(e.target.value);
                    }}
                    itemKey="key"
                    itemValue="value"
                    value={changePriceType}
                  />
                </Grid>
                <Grid
                  item
                  xs={4}
                  style={{
                    paddingLeft: 20,
                    paddingRight: 10,
                  }}
                >
                  <NumberTextField
                    fullWidth
                    placeholder={t("pricing.summa")}
                    variant="outlined"
                    onChange={(e) => {
                      setPercent(e.target.value);
                    }}
                  />
                </Grid>
                <Grid item xs={1}>
                  <Grid
                    container
                    justify="center"
                    alignItems="center"
                    style={{ height: "100%" }}
                  >
                    %
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </DialogContentText>
        <DialogActions>
          <Button
            disabled={
              isCategoryChangePriceLoading || !percent || !changePriceType
            }
            color="primary"
            onClick={() => {
              dispatch(
                changeCategoryPrice(
                  currentBranch,
                  selectedCategory.id,
                  Number(percent || 0),
                  props,
                  (error) => {
                    setTimeout(() => {
                      !error && updateUI();
                    }, 2100);
                    setChangePriceDialog(false);
                    setPercent(undefined);
                  },
                  changePriceType === "dec"
                )
              );
            }}
          >
            {t("common.yes")}
          </Button>
          <Button
            disabled={isCategoryChangePriceLoading}
            color="primary"
            onClick={() => {
              setSelectedCategory(undefined);
              setChangePriceDialog(false);
            }}
          >
            {t("common.no")}
          </Button>
        </DialogActions>
      </Dialog>

      <Paper className={styles.content}>
        <div className={styles.content_left}>
          <Typography
            variant="h4"
            style={{
              color: "#555",
              fontSize: 18,
              fontWeight: "bold",
              marginLeft: 20,
              marginTop: 20,
            }}
          >
            {t("pricing.catalog")}
          </Typography>
          <PricingCatalogTree
            data={myCatalog}
            onItemClick={(id) => {
              dispatch(setCategoryId(id));
              // dispatch(fetchProductListForCategoryId(id, currentBranch, page, size));
              // categoryId = id
            }}
            onNewPrice={(item) => {
              if (currentBranch >= 0) {
                setSelectedCategory(item);
                setChangePriceDialog(true);
              } else {
                props.error("Выберите филиал");
              }
            }}
            value={categoryId}
          />
        </div>
        <div className={styles.content_right}>
          <Grid container style={{ margin: "15px 10px" }}>
            <Typography
              variant="h4"
              style={{ color: "#555", fontSize: 18, fontWeight: "bold" }}
            >
              {t("pricing.product_list")}
            </Typography>
          </Grid>
          <List className={styles.product_list}>
            {productListLoading ? (
              <div style={{ textAlign: "center", padding: 20 }}>
                Загрузка...
              </div>
            ) : (
              (productList || []).map((product, index) => {
                return (
                  <div>
                    <Grid
                      key={`${index}`}
                      container
                      alignItems="center"
                      style={{ padding: 10 }}
                      direction="row"
                    >
                      <Grid item xs={7}>
                        <Typography
                          variant="h4"
                          style={{
                            color: "#555",
                            fontSize: 14,
                            fontWeight: "bold",
                          }}
                        >{`${page * size + index + 1}. ${
                          product.name
                        }`}</Typography>
                      </Grid>

                      {currentBranch && (
                        <Grid item xs={2}>
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
                        </Grid>
                      )}

                      {currentBranch && (
                        <Grid item xs={3}>
                          <Grid container justify="center">
                            <IconButton
                              color="primary"
                              disabled={prices.get(product.id) === undefined}
                              onClick={() => {
                                dispatch(
                                  updatePrice(
                                    {
                                      branchId: currentBranch,
                                      productId: product.id,
                                      salesPrice: Number(
                                        prices.get(product.id)
                                      ),
                                    },
                                    categoryId
                                  )
                                );
                                prices.delete(product.id);
                              }}
                            >
                              <Check />
                            </IconButton>
                            <IconButton
                              disabled={prices.get(product.id) === undefined}
                              color="secondary"
                              onClick={() => {
                                prices.delete(product.id);
                                setUpdate(!update);
                              }}
                            >
                              <Close />
                            </IconButton>
                            <Tooltip title={t("pricing.history")}>
                              <IconButton
                                color="inherit"
                                onClick={() => {
                                  dispatch(
                                    fetchProductPriceHistory(
                                      product.id,
                                      currentBranch
                                    )
                                  );
                                  setSelectedProduct(product.name);
                                  setProductHistoryDialog(true);
                                }}
                              >
                                <ListOutlined />
                              </IconButton>
                            </Tooltip>
                          </Grid>
                        </Grid>
                      )}
                    </Grid>
                    <Divider light />
                  </div>
                );
              })
            )}
          </List>
          <div className={styles.pagination}>
            <Pagination
              current={page}
              pagesCount={total}
              size={size}
              onPageChange={(page) => {
                dispatch(
                  fetchProductListForCategoryId(
                    categoryId,
                    currentBranch,
                    page,
                    size
                  )
                );
              }}
              onSizeChange={(size) => {
                dispatch(
                  fetchProductListForCategoryId(
                    categoryId,
                    currentBranch,
                    page,
                    size
                  )
                );
              }}
            />
          </div>
        </div>
      </Paper>
    </div>
  );
};

export default withRouter(withNotification(Pricing));
