import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductTable from "../components/productAddTable";
import {
  TextField,
  Button,
  IconButton,
  Paper,
  Grid,
  makeStyles,
} from "@material-ui/core";
import SelectBox from "../../../../components/Select";
import { KeyboardDatePicker } from "@material-ui/pickers";
import { ArrowBackIos } from "@material-ui/icons";
import moment from "moment";
import { withRouter } from "react-router-dom";
import { createIncome } from "../actions";
import BranchSelect from "../../../components/branchList";
import { useTranslation } from "react-i18next";
import { fetchSupplierList } from "../actions";

const useStyles = makeStyles(() => ({
  header: {
    marginTop: 15,
    height: 60,
    fontSize: 18,
    fontWeight: "bold",
  },
  filter: {
    marginTop: 20,
    paddingLeft: 20,
  },
  content: {
    width: "100%",
    marginTop: 15,
    padding: 10,
  },
  total: {
    marginTop: 10,
    textAlign: "right",
    fontWeight: "bold",
    paddingRight: 15,
  },
  products: {
    marginTop: 15,
    minHeight: 300,
  },
  productListError: {
    color: "#ff3955",
    textAlign: "center",
    marginTop: 15,
  },
  bottom: {
    height: 50,
    marginTop: 15,
  },
}));

const IncomeDetail = (props) => {
  const [productList, setProductList] = useState();
  const [date, setDate] = useState(moment().format("YYYY-MM-DD"));
  const [contractor, setContractor] = useState();
  const [productListError, setProductListError] = useState();
  const [comment, setComment] = useState();
  const [branchId, setBranchId] = useState();
  const [branchError, setBranchError] = useState(false);

  const currentOwner = useSelector(
    (state) => state.get("dashboard").currentOwner
  );
  const supplierList = useSelector((state) => state.get("income").supplierList);
  const isLoading = useSelector((state) => state.get("income").isLoading);
  const dispatch = useDispatch();

  const classes = useStyles();

  const { t } = useTranslation();

  useEffect(() => {
    dispatch(fetchSupplierList({ page: 0, size: 10000 }));
  }, []);

  return (
    <Grid container>
      <Grid
        container
        direction="row"
        alignItems="center"
        className={classes.header}
      >
        <Grid item>
          <IconButton
            onClick={() => {
              props.history.goBack();
            }}
            style={{ textAlign: "center" }}
          >
            <ArrowBackIos />
          </IconButton>
        </Grid>
        <Grid item>
          <span style={{ marginLeft: 8 }}> {t("incomeDetail.title")} </span>
        </Grid>
      </Grid>
      <Grid
        container
        direction="row"
        alignItems="center"
        className={classes.filter}
      >
        <Grid item xs={12} md={3}>
          <BranchSelect
            skipAllBranch={true}
            value={branchId}
            error={branchError}
            onChange={(branchId) => {
              console.log(branchId);
              if (branchId) {
                setBranchId(branchId);
                setBranchError(false);
              }
            }}
          />
        </Grid>
        <Grid item xs={12} md={3} style={{ paddingLeft: 10 }}>
          <SelectBox
            label={t("incomeDetail.select_supplier")}
            itemKey="value"
            itemValue="name"
            labelWidth={200}
            onChange={(event) => {
              setContractor(event.target.value);
            }}
            data={
              supplierList &&
              supplierList.map((item) => ({
                name: item.name,
                value: item.id,
              }))
            }
            value={contractor}
          />
        </Grid>
        <Grid item xs={12} md={3} style={{ paddingLeft: 10 }}>
          <KeyboardDatePicker
            variant="dialog"
            fullWidth
            value={date}
            onChange={(date) => {
              setDate(moment(date).format("YYYY-MM-DD"));
            }}
            TextFieldComponent={(props) => (
              <TextField
                {...props}
                fullWidth
                variant="outlined"
                label={t("incomeDetail.choose_date")}
              />
            )}
          />
        </Grid>
      </Grid>
      <Paper className={classes.content}>
        <div className={classes.total}>
          {t("incomeDetail.total_amount")}:{" "}
          {(productList &&
            productList.reduce(
              (acc, item) => acc + item.costPrice * item.qty,
              0
            )) ||
            0}{" "}
          {t("common.sum")}
        </div>
        <div className={classes.products}>
          <ProductTable
            onProductListChanged={(productList) => {
              setProductList(
                productList.map((p) => {
                  return { ...p, unitId: p.unit.id, unitName: p.unit.name };
                })
              );
              setProductListError(undefined);
            }}
            branchId={branchId}
            owner={currentOwner}
          />
        </div>
        <div
          className={classes.productListError}
          style={{ display: productListError ? "block" : "none" }}
        >
          {t("incomeDetail.list_error")}
        </div>
        <div style={{ marginTop: 35 }}>
          <TextField
            fullWidth
            multiline
            variant="outlined"
            label={t("incomeDetail.leave_comment")}
            value={comment}
            onChange={(event) => {
              setComment(event.target.value);
            }}
            rows={6}
            disabled={false}
          />
        </div>
      </Paper>
      <Grid
        container
        direction="row"
        justify="flex-end"
        className={classes.bottom}
      >
        <Button
          disabled={isLoading}
          color="primary"
          onClick={() => {
            if (branchId === undefined) {
              setBranchError(true);
              return;
            }
            if (!(productList || []).length) {
              setProductListError(true);
              return;
            }
            dispatch(
              createIncome(
                {
                  contractor: contractor ? { id: contractor } : undefined,
                  documentDate: date,
                  incomeOfProductDetails: productList,
                  comment: comment,
                  toBranchId: branchId,
                },
                props.history.goBack
              )
            );
          }}
        >
          {" "}
          {t("incomeDetail.add")}{" "}
        </Button>
      </Grid>
    </Grid>
  );
};

export default withRouter(IncomeDetail);
