import React, { useState, useEffect } from "react";
import {
  Typography,
  Button,
  Paper,
  Switch,
  makeStyles,
  Grid,
  IconButton,
  Tooltip,
} from "@material-ui/core";
import { AddCircleOutlined, Delete } from "@material-ui/icons";
import ChequeComponent from "#components/Cheque";
import RangePicker from "#components/Pickers/daterange";
import SelectBox from "#components/Select";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import Pagination from "../../../components/Pagination/Pagination";
import SearchTextField from "#components/Textfields/search";
import { useTranslation } from "react-i18next";
import { fetchCashiers } from "../../employee/actions";
import {
  fetchChequeList,
  fetchChequeStatuses,
  setDate,
  setDraftCheques,
  fetchPaymentTypes,
  fetchReceiptStats,
  fetchChequeById,
  downloadChequeList,
  setEmployeeId,
  setOperation,
  setPaymentType,
  deleteChequeById,
  fetchTerminals,
  setTerminal,
} from "./actions";
import Card from "../../../components/material-components/components/Card/Card";
import CardHeader from "../../../components/material-components/components/Card/CardHeader";
import CardIcon from "../../../components/material-components/components/Card/CardIcon";
import style from "../../../components/material-components/assets/jss/material-dashboard-react/views/dashboardStyle.js";
import Balance from "@material-ui/icons/AccountBalance";
import Check from "@material-ui/icons/Ballot";
import Sales from "@material-ui/icons/AddShoppingCart";
import numeral from "numeral";
import { withRouter } from "react-router-dom";
import Table from "../../../components/Table/index";
import { Description } from "@material-ui/icons";
import QuestionDialog from "../../../components/Dialog/question";
import { TERMINALS_LIST } from "./reducer";

const useStyles = makeStyles(() => ({
  ...style,
  container: {
    height: "100%",
    padding: 15,
  },
  paper: {
    width: "100%",
    marginTop: 10,
    padding: 15,
    overflowY: "auto",
  },
  totalElementsTitle: {
    marginTop: 12,
    fontWeight: "bold",
    fontSize: 15,
  },
  content: {
    marginTop: 5,
    display: "flex",
    flexFlow: "row",
    position: "relative",
  },
  table: {
    flexGrow: 1,
    overflow: "auto",
    border: "1px solid #eee",
  },
}));

const Cheques = (props) => {
  const [uid, setUid] = useState("");
  const [sort, setSort] = useState();
  const [deleteingId, setDeletingId] = useState();

  // redux
  const dispatch = useDispatch();
  const cashiers = useSelector((state) => state.get("employee").cashiers);
  const currentUser = useSelector(
    (state) => state.get("dashboard").currentUser
  );
  const chequeList = useSelector((state) => state.get("cheque").list);
  const isLoading = useSelector((state) => state.get("cheque").isLoading);
  const total = useSelector((state) => state.get("cheque").total);
  const totalElements = useSelector(
    (state) => state.get("cheque").totalElements
  );
  const cheque = useSelector((state) => state.get("cheque").selectedCheque);
  const chequeLoading = useSelector(
    (state) => state.get("cheque").chequeLoading
  );
  const page = useSelector((state) => state.get("cheque").page);
  const size = useSelector((state) => state.get("cheque").size);
  const date = useSelector((state) => state.get("cheque").date);
  const status = useSelector((state) => state.get("cheque").statusList);
  const terminal = useSelector((state) => state.get("cheque").terminal);
  const terminalList = useSelector((state) => state.get("cheque").terminalList);
  const draftCheques = useSelector((state) => state.get("cheque").draftCheques);
  const paymentTypes = useSelector((state) => state.get("cheque").paymentTypes);
  const stats = useSelector((state) => state.get("cheque").stats);
  const employeeId = useSelector((state) => state.get("cheque").employeeId);
  const operation = useSelector((state) => state.get("cheque").operation);
  const paymentType = useSelector((state) => state.get("cheque").paymentType);

  const cashier = useSelector((state) => state.get("cashier").currentBranch);
  const dashboard = useSelector(
    (state) => state.get("dashboard").currentBranch
  );

  const currentBranch =
    currentUser && (currentUser.authorities || []).includes("ROLE_CASHIER")
      ? cashier
      : dashboard;

  const { t } = useTranslation();

  const classes = useStyles();

  const updateList = () => {
    dispatch(
      fetchChequeList({
        page,
        size,
        userId: employeeId === -1 ? undefined : employeeId,
        from: date ? date.startDate : undefined,
        to: date ? date.endDate : undefined,
        branchId: currentBranch,
        search: uid || undefined,
        ...(draftCheques
          ? {
              terminalId: currentBranch
                ? terminal === -1
                  ? undefined
                  : terminal
                : undefined,
            }
          : { paymentTypes: paymentType === -1 ? undefined : paymentType }),
        status: draftCheques
          ? "DRAFT"
          : operation === -1
            ? undefined
            : operation,
        es: true,
        sort,
      })
    );
    console.log("pt", paymentType);
    !draftCheques &&
      dispatch(
        fetchReceiptStats({
          userId: employeeId === -1 ? undefined : employeeId,
          from: date ? date.startDate : undefined,
          to: date ? date.endDate : undefined,
          branchId: currentBranch,
          ...(draftCheques
            ? {
                terminalId: currentBranch
                  ? terminal === -1
                    ? undefined
                    : terminal
                  : undefined,
              }
            : { paymentTypes: paymentType === -1 ? undefined : paymentType }),
          search: uid || undefined,
          status: draftCheques
            ? "DRAFT"
            : operation === -1
              ? undefined
              : operation,
        })
      );
  };

  useEffect(() => {
    dispatch(fetchChequeStatuses());
    dispatch(fetchPaymentTypes());
  }, []);

  useEffect(
    () => {
      if (currentBranch) {
        dispatch({
          type: TERMINALS_LIST,
          payload: [],
        });
        dispatch(setTerminal(undefined));
        dispatch(fetchTerminals({ branchId: currentBranch }));
      }
    },
    [currentBranch]
  );

  useEffect(
    () => {
      updateList();
    },
    [
      date,
      employeeId,
      uid,
      operation,
      currentBranch,
      draftCheques,
      paymentType,
      sort,
      terminal,
    ]
  );

  useEffect(
    () => {
      currentBranch && dispatch(fetchTerminals({ branchId: currentBranch }));
    },
    [currentBranch]
  );

  useEffect(
    () => {
      if (cashiers && cashiers.length) {
        let found = cashiers.find((c) => c.id === employeeId);
        if (!found) {
          dispatch(setEmployeeId(-1));
        }
      }
    },
    [cashiers]
  );

  return (
    <Grid container className={classes.container}>
      <QuestionDialog
        open={Boolean(deleteingId)}
        title="Удалить Чек"
        message="Вы действительно хотите удалить чек?"
        onPositive={() => {
          dispatch(
            deleteChequeById(deleteingId, {
              page,
              size,
              userId: employeeId === -1 ? undefined : employeeId,
              from: date ? date.startDate : undefined,
              to: date ? date.endDate : undefined,
              branchId: currentBranch,
              search: uid || undefined,
              status: draftCheques
                ? "DRAFT"
                : operation === -1
                  ? undefined
                  : operation,
              es: true,
              paymentTypes: paymentType === -1 ? undefined : paymentType,
              sort,
            })
          );
          setDeletingId(undefined);
          dispatch(fetchChequeById(undefined));
        }}
        onNegative={() => {
          setDeletingId(undefined);
        }}
      />
      <Grid container>
        <Typography
          variant="h4"
          style={{
            fontSize: 18,
            fontWeight: "bold",
          }}
        >
          {t("cheques.title")}
        </Typography>
      </Grid>
      {!draftCheques && (
        <>
          <Grid container spacing={3} style={{ marginTop: 10 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardHeader color="primary" stats icon>
                  <CardIcon color="primary">
                    <Balance />
                  </CardIcon>
                  <p className={classes.cardCategory}>{t("cheques.shifts")}</p>
                  <h3 className={classes.cardTitle}>
                    {stats ? stats.shifts : "0"}
                  </h3>
                </CardHeader>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardHeader color="primary" stats icon>
                  <CardIcon color="primary">
                    <Check />
                  </CardIcon>

                  <p className={classes.cardCategory}>
                    {t("cheques.chequeCount")}
                  </p>
                  <h3 className={classes.cardTitle}>
                    {stats ? stats.receipts : "0"}
                  </h3>
                </CardHeader>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardHeader color="primary" stats icon>
                  <CardIcon color="primary">
                    <Sales />
                  </CardIcon>
                  <p className={classes.cardCategory}>{t("cheques.revenue")}</p>
                  <h3 className={classes.cardTitle}>
                    {stats ? numeral(stats.revenue).format("0,0.00") : "0"}
                    {t("common.sum")}
                  </h3>
                </CardHeader>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardHeader color="primary" stats icon>
                  <CardIcon color="primary">
                    <Sales />
                  </CardIcon>
                  <p className={classes.cardCategory}>{t("cheques.cash")}</p>
                  <h3 className={classes.cardTitle}>
                    {stats ? numeral(stats.cash).format("0,0.00") : "0"}
                    {t("common.sum")}
                  </h3>
                </CardHeader>
              </Card>
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardHeader color="primary" stats icon>
                  <CardIcon color="primary">
                    <Balance />
                  </CardIcon>
                  <p className={classes.cardCategory}>{t("cheques.card")}</p>
                  <h3 className={classes.cardTitle}>
                    {stats ? numeral(stats.card).format("0,0.00") : "0"}
                    {t("common.sum")}
                  </h3>
                </CardHeader>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardHeader color="primary" stats icon>
                  <CardIcon color="primary">
                    <Check />
                  </CardIcon>

                  <p className={classes.cardCategory}>
                    {t("cheques.cardUzCard")}
                  </p>
                  <h3 className={classes.cardTitle}>
                    {stats ? numeral(stats.cardUzCard).format("0,0.00") : "0"}
                    {t("common.sum")}
                  </h3>
                </CardHeader>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardHeader color="primary" stats icon>
                  <CardIcon color="primary">
                    <Sales />
                  </CardIcon>
                  <p className={classes.cardCategory}>
                    {t("cheques.cardHumo")}
                  </p>
                  <h3 className={classes.cardTitle}>
                    {stats ? numeral(stats.cardHumo).format("0,0.00") : "0"}
                    {t("common.sum")}
                  </h3>
                </CardHeader>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardHeader color="primary" stats icon>
                  <CardIcon color="primary">
                    <Sales />
                  </CardIcon>
                  <p className={classes.cardCategory}>
                    {t("cheques.cardLoyalty")}
                  </p>
                  <h3 className={classes.cardTitle}>
                    {stats ? numeral(stats.cardLoyalty).format("0,0.00") : "0"}
                    {t("common.sum")}
                  </h3>
                </CardHeader>
              </Card>
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardHeader color="primary" stats icon>
                  <CardIcon color="primary">
                    <Balance />
                  </CardIcon>
                  <p className={classes.cardCategory}>
                    {t("cheques.cardOther")}
                  </p>
                  <h3 className={classes.cardTitle}>
                    {stats ? numeral(stats.cardOther).format("0,0.00") : "0"}
                    {t("common.sum")}
                  </h3>
                </CardHeader>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardHeader color="primary" stats icon>
                  <CardIcon color="primary">
                    <Check />
                  </CardIcon>

                  <p className={classes.cardCategory}>{t("cheques.nds")}</p>
                  <h3 className={classes.cardTitle}>
                    {stats ? numeral(stats.nds).format("0,0.00") : "0"}
                    {t("common.sum")}
                  </h3>
                </CardHeader>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardHeader color="primary" stats icon>
                  <CardIcon color="primary">
                    <Sales />
                  </CardIcon>
                  <p className={classes.cardCategory}>
                    {t("cheques.positionsInReceipts")}
                  </p>
                  <h3 className={classes.cardTitle}>
                    {stats ? stats.positionsInReceipts : "0"}
                  </h3>
                </CardHeader>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardHeader color="primary" stats icon>
                  <CardIcon color="primary">
                    <Sales />
                  </CardIcon>
                  <p className={classes.cardCategory}>
                    {t("reportByOneProduct.discount")}
                  </p>
                  <h3 className={classes.cardTitle}>
                    {stats ? stats.discount : "0"}
                  </h3>
                </CardHeader>
              </Card>
            </Grid>
          </Grid>
        </>
      )}

      <Paper className={classes.paper}>
        <Grid container direction="row" alignItems="center">
          <Grid item xs={6} md={2}>
            <Switch
              color="primary"
              checked={draftCheques}
              onChange={(_, checked) => {
                dispatch(setDraftCheques(checked));
              }}
            />
            {t("cheques.draftCheques")}
          </Grid>
          <Grid item xs={6} md={3} style={{ paddingLeft: 10 }}>
            <RangePicker
              position={"flex-start"}
              hideQuickPanel={true}
              value={date}
              onChange={(range) => {
                dispatch(
                  setDate({
                    startDate: moment(range.startDate)
                      .startOf("day")
                      .format("YYYY-MM-DDTHH:mm:ss"),
                    endDate: moment(range.endDate)
                      .endOf("day")
                      .format("YYYY-MM-DDTHH:mm:ss"),
                  })
                );
              }}
            />
          </Grid>
          <Grid xs={6} md={2} style={{ paddingLeft: 10 }}>
            <SelectBox
              itemKey="id"
              itemValue="name"
              label={t("cheques.employees")}
              labelWidth={100}
              value={employeeId}
              onChange={(event) => {
                dispatch(setEmployeeId(event.target.value));
                setUid("");
              }}
              data={[
                {
                  id: -1,
                  fullName: { lastName: t("common.all"), firstName: "" },
                },
                ...cashiers,
              ].map((item) => {
                return {
                  id: item.id,
                  name:
                    item && item.fullName
                      ? `${item.fullName.lastName} ${item.fullName.firstName}`
                      : t("common.no_name"),
                };
              })}
            />
          </Grid>
          <Grid item xs={6} md={2} style={{ paddingLeft: 10 }}>
            <SearchTextField
              label={t("cheques.cheque_no")}
              value={uid}
              onChange={(text) => {
                setUid(text || undefined);
              }}
              onSearch={(uid) => {
                setUid(uid);
              }}
            />
          </Grid>
          {!draftCheques ? (
            <Grid item xs={6} md={2} style={{ paddingLeft: 10 }}>
              <SelectBox
                itemKey="code"
                itemValue="nameRu"
                label={t("cheques.operation")}
                placeholder={t("cheques.operation")}
                labelWidth={100}
                withReset={true}
                value={operation || ""}
                data={[{ code: -1, nameRu: "Все" }, ...status]}
                onChange={(e) => {
                  dispatch(setOperation(e.target.value));
                }}
              />
            </Grid>
          ) : (
            currentBranch && (
              <Grid item xs={6} md={2} style={{ paddingLeft: 10 }}>
                <SelectBox
                  itemKey="code"
                  itemValue="nameRu"
                  label={"ККМ"}
                  placeholder={t("ККМ")}
                  labelWidth={100}
                  withReset={true}
                  value={terminal || ""}
                  data={[
                    { code: -1, nameRu: "Все" },
                    ...(terminalList || []).map((item) => ({
                      nameRu: item.serialNumber,
                      code: item.id,
                    })),
                  ]}
                  onChange={(e) => {
                    dispatch(setTerminal(e.target.value));
                  }}
                />
              </Grid>
            )
          )}
          <Grid item xs={1} md={1} style={{ paddingLeft: 10 }}>
            <Tooltip title={t("cheques.addCheque")}>
              <IconButton
                color="primary"
                onClick={() => {
                  if (
                    (currentUser.authorities || []).includes("ROLE_CASHIER")
                  ) {
                    props.history.push("/cashier/save-Cheque");
                  } else {
                    props.history.push("/main/save-Cheque");
                  }
                }}
              >
                <AddCircleOutlined />
              </IconButton>
            </Tooltip>
          </Grid>

          {!draftCheques && (
            <Grid item xs={1} md={2} style={{ marginTop: 10 }}>
              <SelectBox
                itemKey="key"
                itemValue="value"
                label={t("cheques.paymentType")}
                placeholder={t("cheques.paymentType")}
                labelWidth={100}
                withReset={true}
                value={paymentType || ""}
                data={[{ key: -1, value: "Все" }, ...paymentTypes]}
                onChange={(e) => {
                  dispatch(setPaymentType(e.target.value));
                }}
              />
            </Grid>
          )}

          <Grid
            item
            style={{
              paddingLeft: 20,
              paddingTop: 10,
            }}
          >
            <Button
              style={{
                color: "#999",
                textTransform: "none",
                height: 40,
              }}
              onClick={() => {
                dispatch(
                  setDate({
                    startDate: moment()
                      .subtract(1, "month")
                      .startOf("day")
                      .format("YYYY-MM-DDTHH:mm:ss"),
                    endDate: moment()
                      .endOf("day")
                      .format("YYYY-MM-DDTHH:mm:ss"),
                  })
                );
                dispatch(setOperation(undefined));
                dispatch(setTerminal(undefined));
                dispatch(setPaymentType(undefined));
                setUid("");
                dispatch(setEmployeeId(-1));
              }}
            >
              x {t("cheques.reset")}
            </Button>
          </Grid>
          <Grid
            item
            style={{
              paddingLeft: 20,
              paddingTop: 10,
            }}
          >
            <Button
              color="primary"
              variant="contained"
              style={{ height: 40 }}
              onClick={() => {
                dispatch(
                  downloadChequeList({
                    userId: employeeId === -1 ? undefined : employeeId,
                    from: date ? date.startDate : undefined,
                    to: date ? date.endDate : undefined,
                    branchId: currentBranch,
                    search: uid || undefined,
                    status: draftCheques
                      ? "DRAFT"
                      : operation === -1
                        ? undefined
                        : operation,
                    es: true,
                    paymentTypes: paymentType === -1 ? undefined : paymentType,
                    sort,
                  })
                );
              }}
              startIcon={<Description />}
            >
              Скачать в Excel файл
            </Button>
          </Grid>
        </Grid>
        <div className={classes.totalElementsTitle}>
          {t("cheques.total")}: {totalElements}
        </div>
        <div className={classes.content}>
          <div className={classes.table}>
            <Table
              order={true}
              onItemClick={(item) => {
                dispatch(fetchChequeById(item.id));
              }}
              selectClickedRow={true}
              headers={[
                {
                  content: t("cheques.date"),
                  sort: true,
                  key: "receiptDateTime",
                  render: (item) =>
                    item.receiptDateTime
                      ? moment(item.receiptDateTime).format(
                          "YYYY-MM-DD HH:mm:ss"
                        )
                      : "-",
                },
                {
                  content: t("cheques.summa"),
                  sort: false,
                  render: (item) =>
                    item.totalCost ? item.totalCost.toLocaleString() : "0",
                },
                {
                  content: t("cheques.operation"),
                  sort: true,
                  key: "status",
                  render: (item) =>
                    item.status ? item.status.nameRu : t("common.not_defined"),
                },
                {
                  content: t("cheques.shift"),
                  sort: true,
                  key: "shiftNo",
                  render: (item) =>
                    item.shiftNo ? item.shiftNo : t("common.not_defined"),
                },
                {
                  content: t("cheques.nds_summa"),
                  sort: true,
                  key: "totalNds",
                  render: (item) =>
                    item.totalNds ? item.totalNds.toLocaleString() : "0",
                },
                {
                  content: t("cheques.cash"),
                  sort: true,
                  key: "totalCash",
                  render: (item) =>
                    isNaN(Number(item.totalCash))
                      ? "0"
                      : Number(item.totalCash).toLocaleString(),
                },
                {
                  content: t("cheques.card"),
                  sort: true,
                  key: "totalCard",
                  render: (item) =>
                    isNaN(Number(item.totalCard))
                      ? "0"
                      : Number(item.totalCard).toLocaleString(),
                },
                {
                  content: t("cheques.kkm"),
                  sort: true,
                  key: "terminalSN",
                },
              ].concat(
                draftCheques
                  ? [
                      {
                        content: "",
                        key: "actions",
                        render: (item) => (
                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeletingId(item.id);
                            }}
                          >
                            <Delete />
                          </IconButton>
                        ),
                      },
                    ]
                  : []
              )}
              isLoading={isLoading}
              data={chequeList}
              page={page || 0}
              size={size || 20}
              onSort={(i, t) => {
                setSort({ col: i, order: t });
              }}
              sort={sort}
            />
          </div>
          <div style={{ marginLeft: 10 }}>
            <ChequeComponent
              cheque={cheque}
              isLoading={chequeLoading}
              onDelete={(id) => {
                setDeletingId(id);
              }}
            />
          </div>
        </div>
        <div
          style={{
            marginTop: 15,
            marginBottom: 20,
          }}
        >
          <Pagination
            disabled={isLoading}
            onPageChange={(page) => {
              dispatch(
                fetchChequeList({
                  page,
                  size,
                  userId: employeeId === -1 ? undefined : employeeId,
                  from: date ? date.startDate : undefined,
                  to: date ? date.endDate : undefined,
                  branchId: currentBranch,
                  search: uid || undefined,
                  status: operation === -1 ? undefined : operation,
                  es: true,
                  paymentTypes: paymentType === -1 ? undefined : paymentType,
                })
              );
            }}
            onSizeChange={(size) => {
              dispatch(
                fetchChequeList({
                  page,
                  size,
                  userId: employeeId === -1 ? undefined : employeeId,
                  from: date ? date.startDate : undefined,
                  to: date ? date.endDate : undefined,
                  branchId: currentBranch,
                  search: uid || undefined,
                  status: operation === -1 ? undefined : operation,
                  es: true,
                  paymentTypes: paymentType === -1 ? undefined : paymentType,
                })
              );
            }}
            pagesCount={total}
            current={page}
            size={size}
          />
        </div>
      </Paper>
    </Grid>
  );
};

export default withRouter(Cheques);
