import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./ByOneProduct.module.scss";
import { IconButton } from "@material-ui/core";
import { CloudDownloadOutlined } from "@material-ui/icons";
import ProductSelector from "../productSelector";
import RangePicker from "#components/Pickers/daterange";
import Table from "../../../components/Table/index";
import { ResponsiveLine } from "@nivo/line";
import Switch from "../../../components/Switch";
import cn from "classnames";
import moment from "moment";
import Pagination from "../../../components/Pagination/Pagination";
import dashStyles from "../../../components/material-components/assets/jss/material-dashboard-react/views/dashboardStyle.js";
import { makeStyles } from "@material-ui/core";
import Card from "../../../components/material-components/components/Card/Card";
import CardHeader from "../../../components/material-components/components/Card/CardHeader";
import CardIcon from "../../../components/material-components/components/Card/CardIcon";
import Money from "@material-ui/icons/AttachMoney";
import Balance from "@material-ui/icons/AccountBalance";
import Check from "@material-ui/icons/Ballot";
import LoyaltyIcon from "@material-ui/icons/Loyalty";
import Tooltip from "@material-ui/core/Tooltip";
import {
  byOneProductsExcelReport,
  reportByOneProduct,
  reportByOneProductSalesStats,
  setSort,
} from "./actions";
import { useTranslation } from "react-i18next";
import { defineGranularity } from "../../../../utils/format";

const useStyles = makeStyles(dashStyles);

const initDate = {
  startDate: moment()
    .subtract(1, "month")
    .startOf("day")
    .format("YYYY-MM-DDTHH:mm:ss"),
  endDate: moment()
    .endOf("day")
    .format("YYYY-MM-DDTHH:mm:ss"),
};

const ByOneProduct = (props) => {
  const [product, setProduct] = useState();
  const [tableMode, setTableMode] = useState(true);
  const [date, setDate] = useState(initDate);

  const branchId = useSelector((state) => state.get("dashboard").currentBranch);
  const list = useSelector((state) => state.get("reportByOneProduct").list);
  const page = useSelector((state) => state.get("reportByOneProduct").page);
  const size = useSelector((state) => state.get("reportByOneProduct").size);
  const total = useSelector((state) => state.get("reportByOneProduct").total);
  const stats = useSelector((state) => state.get("reportByOneProduct").stats);
  const dynamics = useSelector(
    (state) => state.get("reportByOneProduct").dynamics
  );
  const sort = useSelector((state) => state.get("reportByOneProduct").sort);

  const dispatch = useDispatch();

  const { t } = useTranslation();

  useEffect(
    () => {
      let search = props.location.search;
      let productId;
      if (search) {
        let splitted = search.split("=");
        if (splitted.length > 1) {
          productId = splitted[1];
        }
      }
      if (productId !== undefined) {
        let product = JSON.parse(localStorage.getItem("product"));
        setProduct(product);
      }
    },
    [props.location.search]
  );

  const updateList = () => {
    if (product) {
      if (tableMode)
        dispatch(
          reportByOneProduct({
            page,
            size,
            from: date
              ? moment(date.startDate).format("YYYY-MM-DDTHH:mm:ss")
              : undefined,
            to: date
              ? moment(date.endDate).format("YYYY-MM-DDTHH:mm:ss")
              : undefined,
            productId: typeof product === "number" ? product : product.id,
            branchId,
            sort,
          })
        );
      else
        dispatch(
          reportByOneProduct({
            page,
            size,
            from: date
              ? moment(date.startDate).format("YYYY-MM-DDTHH:mm:ss")
              : undefined,
            to: date
              ? moment(date.endDate).format("YYYY-MM-DDTHH:mm:ss")
              : undefined,
            productId: typeof product === "number" ? product : product.id,
            branchId,
            withGranularity: true,
          })
        );
      dispatch(
        reportByOneProductSalesStats({
          branchId,
          from: date
            ? moment(date.startDate).format("YYYY-MM-DDTHH:mm:ss")
            : undefined,
          to: date
            ? moment(date.endDate).format("YYYY-MM-DDTHH:mm:ss")
            : undefined,
          productId: typeof product === "number" ? product : product.id,
        })
      );
    }
  };

  useEffect(
    () => {
      updateList();
    },
    [branchId, product, date, sort, tableMode]
  );

  const renderContent = () => {
    if (!product) {
      return (
        <div className={styles.empty}>
          {t("reportByOneProduct.selectProduct")}
        </div>
      );
    } else if (tableMode) {
      return (
        <div
          className={cn(styles.table, tableMode ? styles.active : undefined)}
        >
          <Table
            headers={[
              {
                content: t("reportByOneProduct.qty"),
                key: "salesCount",
                sort: true,
              },
              {
                content: t("reportByOneProduct.cost"),
                key: "price",
                sort: true,
              },
              {
                content: t("reportByOneProduct.sum"),
                key: "salesTotal",
                sort: true,
              },
              {
                content: t("reportByOneProduct.discount"),
                key: "discount",
                sort: true,
              },
              {
                content: t("reportByOneProduct.chequeCount"),
                key: "receiptCount",
                sort: true,
              },
              {
                content: t("reportByOneProduct.nds"),
                key: "nds",
                sort: true,
              },
              {
                content: "Дата",
                key: "dateTime",
                sort: true,
                render: (row) =>
                  row.dateTime
                    ? moment(row.dateTime).format("DD.MM.YYYY")
                    : "-",
              },
            ]}
            order={true}
            data={list}
            // page={total}
            page={page}
            size={size}
            onSort={(i, t) => {
              dispatch(
                setSort({
                  col: i,
                  order: t,
                })
              );
            }}
            sort={sort}
          />
        </div>
      );
    } else {
      return (
        <div
          className={cn(styles.diagram, !tableMode ? styles.active : undefined)}
        >
          <ResponsiveLine
            margin={{
              top: 50,
              right: 120,
              bottom: 80,
              left: 60,
            }}
            curve="linear"
            axisBottom={{
              tickRotation: 75,
            }}
            colors="#009f3c"
            lineWidth={2}
            pointSize={10}
            pointColor="#fff"
            useMesh={true}
            pointBorderWidth={2}
            pointBorderColor="#009f3c"
            enablePointLabel={false}
            pointLabel="y"
            pointLabelYOffset={-12}
            isInteractive={true}
            animate={true}
            data={[
              {
                id: "trades",
                color: "#009f3c",
                data:
                  dynamics &&
                  dynamics.map((d) => ({
                    x: d.unit || "",
                    y: d.amounts.salesTotal || 0,
                  })),
              },
            ]}
          />
        </div>
      );
    }
  };

  const classes = useStyles();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}> {t("reportByOneProduct.title")} </div>
        <div className={styles.info_container}>
          <div className={styles.item}>
            <Card>
              <CardHeader color="primary" stats icon>
                <CardIcon color="primary">
                  <Money />
                </CardIcon>
                <p className={classes.cardCategory}>
                  {t("reportByOneProduct.total")}:
                </p>
                <h3 className={classes.cardTitle}>
                  {stats ? stats.salesTotal || 0 : 0} {t("units.sum")}
                </h3>
              </CardHeader>
            </Card>
          </div>
          <div className={styles.item}>
            <Card>
              <CardHeader color="primary" stats icon>
                <CardIcon color="primary">
                  <Check />
                </CardIcon>
                <p className={classes.cardCategory}>
                  {t("reportByOneProduct.chequeCount")}:
                </p>
                <h3 className={classes.cardTitle}>
                  {stats ? stats.receiptCount || 0 : 0}
                </h3>
              </CardHeader>
            </Card>
          </div>
          <div className={styles.item}>
            <Card>
              <CardHeader color="primary" stats icon>
                <CardIcon color="primary">
                  <Balance />
                </CardIcon>
                <p className={classes.cardCategory}>
                  {t("reportByOneProduct.totalNds")}:
                </p>
                <h3 className={classes.cardTitle}>
                  {stats ? stats.nds || 0 : 0} {t("units.sum")}
                </h3>
              </CardHeader>
            </Card>
          </div>
          <div className={styles.item}>
            <Card>
              <CardHeader color="primary" stats icon>
                <CardIcon color="primary">
                  <LoyaltyIcon />
                </CardIcon>
                <p className={classes.cardCategory}>
                  {t("reportByOneProduct.totalDiscount")}:
                </p>
                <h3 className={classes.cardTitle}>
                  {stats ? stats.discount || 0 : 0} {t("units.sum")}
                </h3>
              </CardHeader>
            </Card>
          </div>
        </div>
        <div
          className={styles.filter}
          style={{
            paddingTop: "20px",
          }}
        >
          <div className={styles.item}>
            <ProductSelector
              branchId={branchId}
              onChange={(product) => {
                setProduct(product ? product.value : undefined);
              }}
            />
          </div>
          <div className={styles.ml_20}>
            <RangePicker
              value={{
                startDate: moment(date.startDate).toDate(),
                endDate: moment(date.endDate).toDate(),
              }}
              onChange={(range) => {
                setDate({
                  startDate: moment(range.startDate)
                    .startOf("day")
                    .format("YYYY-MM-DDTHH:mm:ss"),
                  endDate: moment(range.endDate)
                    .endOf("day")
                    .format("YYYY-MM-DDTHH:mm:ss"),
                });
              }}
            />
          </div>
          <div className={styles.button}>
            {product && (
              <Tooltip
                arrow
                title={t("reportByOneProduct.downloadReport")}
                placement={"bottom"}
              >
                <IconButton
                  color="primary"
                  onClick={() => {
                    console.log("product", product);
                    dispatch(
                      byOneProductsExcelReport({
                        branchId,
                        from: date
                          ? moment(date.startDate).format("YYYY-MM-DDTHH:mm:ss")
                          : undefined,
                        to: date
                          ? moment(date.endDate).format("YYYY-MM-DDTHH:mm:ss")
                          : undefined,
                        productId: product.id,
                        granularity: defineGranularity({
                          from: new Date(date.startDate),
                          to: new Date(date.endDate),
                        }),
                      })
                    );
                  }}
                >
                  <CloudDownloadOutlined
                    style={{
                      fontSize: 32,
                    }}
                  />
                </IconButton>
              </Tooltip>
            )}
          </div>
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.title}> {product ? product.name : ""} </div>
          <div>
            <Switch
              items={[
                t("reportByOneProduct.table"),
                t("reportByOneProduct.graphics"),
              ]}
              itemChanged={(pos) => {
                setTableMode(pos === 0);
              }}
            />
          </div>
        </div>
        <div
          className={styles.wrapper}
          style={{
            alignItems: product ? "flex-start" : "center",
          }}
        >
          {renderContent()}
        </div>
      </div>
      <div
        className={styles.footer}
        style={{
          display: tableMode ? "block" : "none",
        }}
      >
        <Pagination
          onPageChange={(page) => {
            if (product) {
              if (tableMode)
                dispatch(
                  reportByOneProduct({
                    page,
                    size,
                    from: date
                      ? moment(date.startDate).format("YYYY-MM-DDTHH:mm:ss")
                      : undefined,
                    to: date
                      ? moment(date.endDate).format("YYYY-MM-DDTHH:mm:ss")
                      : undefined,
                    productId: product.id,
                    branchId,
                  })
                );
              else
                dispatch(
                  reportByOneProduct({
                    page,
                    size,
                    from: date
                      ? moment(date.startDate).format("YYYY-MM-DDTHH:mm:ss")
                      : undefined,
                    to: date
                      ? moment(date.endDate).format("YYYY-MM-DDTHH:mm:ss")
                      : undefined,
                    productId: product.id,
                    branchId,
                    withGranularity: true,
                  })
                );
              dispatch(
                reportByOneProductSalesStats({
                  branchId,
                  from: date
                    ? moment(date.startDate).format("YYYY-MM-DDTHH:mm:ss")
                    : undefined,
                  to: date
                    ? moment(date.endDate).format("YYYY-MM-DDTHH:mm:ss")
                    : undefined,
                  product: product.id,
                })
              );
            }
          }}
          onSizeChange={(size) => {
            if (product) {
              dispatch(
                reportByOneProduct({
                  page,
                  size,
                  from: date
                    ? moment(date.startDate).format("YYYY-MM-DDTHH:mm:ss")
                    : undefined,
                  to: date
                    ? moment(date.endDate).format("YYYY-MM-DDTHH:mm:ss")
                    : undefined,
                  productId: product.id,
                  branchId,
                })
              );
              dispatch(
                reportByOneProduct({
                  page,
                  size,
                  from: date
                    ? moment(date.startDate).format("YYYY-MM-DDTHH:mm:ss")
                    : undefined,
                  to: date
                    ? moment(date.endDate).format("YYYY-MM-DDTHH:mm:ss")
                    : undefined,
                  productId: product.id,
                  branchId,
                  withGranularity: true,
                })
              );
              dispatch(
                reportByOneProductSalesStats({
                  branchId,
                  from: date
                    ? moment(date.startDate).format("YYYY-MM-DDTHH:mm:ss")
                    : undefined,
                  to: date
                    ? moment(date.endDate).format("YYYY-MM-DDTHH:mm:ss")
                    : undefined,
                  product: product.id,
                })
              );
            }
          }}
          pagesCount={total}
          current={page}
          size={size}
        />
      </div>
    </div>
  );
};

export default ByOneProduct;
