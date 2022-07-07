import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Paper, makeStyles, Grid } from "@material-ui/core";
import { withRouter } from "react-router-dom";
import SelectBox from "../../../../components/Select";
import Table from "../../../../components/Table/index";
import moment from "moment";
import Pagination from "../../../../components/Pagination/Pagination";
import AddIcon from "@material-ui/icons/Add";
import Tooltip from "@material-ui/core/Tooltip";
import { useTranslation } from "react-i18next";
import { fetchIncomeList, fetchSupplierList, setSupplierId } from "../actions";

const header = (t) => [
  {
    content: t("incomes.number"),
    key: "id",
    sort: true,
    render: (row) => row.id,
  },
  {
    content: t("incomes.date"),
    key: "documentDate",
    sort: true,
    render: (row) =>
      row.documentDate
        ? moment(row.documentDate).format("YYYY-MM-DD")
        : t("common.no_chosen"),
  },
  {
    content: t("incomes.supplier"),
    key: "contractor",
    sort: true,
    render: (row) =>
      row.contractor ? row.contractor.name : t("common.no_chosen"),
  },
  {
    content: t("incomes.branch"),
    key: "toBranch",
    sort: true,
    render: (row) => (row.toBranch ? row.toBranch.name : t("common.no_chosen")),
  },
];

const useStyles = makeStyles(() => ({
  header: {
    marginTop: 15,
    height: 30,
    display: "flex",
    alignItems: "center",
    paddingLeft: 20,
    fontSize: 16,
    fontWeight: "bold",
  },
  filter: {
    height: 60,
    marginTop: 20,
  },
  content: {
    marginTop: 10,
    height: "calc(100% - 200px)",
    overflowY: "auto",
    width: "100%",
  },
  bottom: {
    height: 80,
    paddingLeft: 20,
  },
}));

const WarehouseIncomes = (props) => {
  const [sort, setSort] = useState();
  const currentBranch = useSelector(
    (state) => state.get("dashboard").currentBranch
  );
  const { t } = useTranslation();
  const classes = useStyles();

  const dispatch = useDispatch();
  const incomeList = useSelector((state) => state.get("income").incomeList);
  const page = useSelector((state) => state.get("income").page);
  const size = useSelector((state) => state.get("income").size);
  const total = useSelector((state) => state.get("income").total);
  const supplierId = useSelector((state) => state.get("income").supplierId);
  const isLoading = useSelector((state) => state.get("income").isLoading);
  const supplierList = useSelector((state) => state.get("income").supplierList);

  useEffect(() => {
    dispatch(fetchSupplierList({ page: 0, size: 1000000 }));
  }, []);

  useEffect(
    () => {
      dispatch(
        fetchIncomeList(
          page,
          size,
          currentBranch,
          supplierId === -1 ? undefined : supplierId,
          sort
        )
      );
    },
    [currentBranch, supplierId, sort]
  );

  return (
    <Grid container>
      <div className={classes.header}>{t("incomes.title")}</div>
      <Grid container className={classes.filter} direction="row">
        <Grid item xs={12} md={3}>
          <SelectBox
            label={t("incomes.supplier")}
            labelWidth={90}
            itemKey="value"
            itemValue="name"
            data={
              supplierList &&
              [{ name: t("common.all"), id: undefined }, ...supplierList].map(
                (supplier) => ({
                  name: supplier.name,
                  value: supplier.id,
                })
              )
            }
            value={supplierId}
            onChange={(event) => {
              dispatch(setSupplierId(event.target.value));
            }}
          />
        </Grid>
      </Grid>
      <Paper className={classes.content}>
        <Table
          order={true}
          headers={header(t)}
          isLoading={isLoading}
          data={incomeList}
          page={page}
          size={size}
          onItemClick={(row) => {
            let found = incomeList.find((item) => item.id === row.id);
            if (found) {
              props.history.push(`/main/warehouse/incomes/info/${found.id}`);
            }
          }}
          onSort={(index, order) => {
            setSort({ col: index, order });
          }}
          sort={sort}
        />
      </Paper>
      <Grid
        container
        className={classes.bottom}
        alignItems="center"
        direction="row"
      >
        <Grid item xs={8}>
          <Pagination
            disabled={isLoading}
            onPageChange={(page) => {
              dispatch(fetchIncomeList(page, size, currentBranch, supplierId));
            }}
            onSizeChange={(size) => {
              dispatch(fetchIncomeList(page, size, currentBranch, supplierId));
            }}
            pagesCount={total}
            current={page}
            size={size}
          />
        </Grid>
        <Grid item xs={4}>
          <Grid container justify="flex-end" style={{ paddingRight: 20 }}>
            <Tooltip arrow title={t("incomes.add_income")}>
              <Button
                color="primary"
                variant={"outlined"}
                onClick={() =>
                  props.history.push("/main/warehouse/incomes/add")
                }
              >
                <AddIcon />
              </Button>
            </Tooltip>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default withRouter(WarehouseIncomes);
