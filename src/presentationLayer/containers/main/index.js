import React from "react";
import { Grid, Typography } from "@material-ui/core";
import MainDiagram from "./mainDiagram";
import MainFilter from "./filter";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import dashboardStyles from "../../../assets/jss/dashboardStyles";
import Card from "../../components/material-components/components/Card/Card.js";
import CardHeader from "../../components/material-components/components/Card/CardHeader.js";
import CardBody from "../../components/material-components/components/Card/CardBody";
import Table from "../../components/material-components/components/Table/Table";
import { useSelector } from "react-redux";

const useStyles = makeStyles(dashboardStyles);

const DashboardMain = () => {
  const classes = useStyles();
  const topEmployees = useSelector((state) => state.get("main").topEmployees);
  const topProducts = useSelector((state) => state.get("main").topProducts);

  const { t } = useTranslation();

  return (
    <div>
      <Typography
        variant="h4"
        style={{
          color: "#555",
          fontSize: 22,
          fontWeight: "bold",
          marginBottom: 15,
          marginTop: 25,
        }}
      >
        {t("home.mainPage")}
      </Typography>
      <MainFilter />
      <MainDiagram />
      <Grid container direction="row" spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>{t("home.topSales")}</h4>
            </CardHeader>
            <CardBody>
              <Table
                tableHeaderColor="primary"
                tableHead={["№", t("home.productName"), t("home.cash")]}
                tableData={
                  topProducts && topProducts.length
                    ? topProducts.map((item, index) => {
                        return [index + 1, item.name, item.salesTotal || 0];
                      })
                    : []
                }
              />
            </CardBody>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>
                {t("home.topCashiers")}
              </h4>
            </CardHeader>
            <CardBody>
              <Table
                tableHeaderColor="primary"
                tableHead={["№", t("home.cashierName"), t("home.cash")]}
                tableData={
                  topEmployees && topEmployees.length
                    ? topEmployees.map((item, index) => {
                        return [index + 1, item.name, item.salesTotal || 0];
                      })
                    : []
                }
              />
            </CardBody>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default DashboardMain;
