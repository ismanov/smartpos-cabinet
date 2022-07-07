import React from 'react';
import {useSelector} from 'react-redux';
import {Grid, Paper} from "@material-ui/core";
import numeral from "numeral";
import CardHeader from "../../../../components/material-components/components/Card/CardHeader";
import CardIcon from "../../../../components/material-components/components/Card/CardIcon";
import Card from "../../../../components/material-components/components/Card/Card";
import {makeStyles} from "@material-ui/core/styles";
import Money from '@material-ui/icons/AttachMoney';
import CallReceivedIcon from '@material-ui/icons/CallReceived';
import Check from '@material-ui/icons/Ballot';
import Balance from '@material-ui/icons/AccountBalance';
import styles from "../../../../components/material-components/assets/jss/material-dashboard-react/views/dashboardStyle.js";
import {useTranslation} from "react-i18next";

const useStyles = makeStyles(styles);

export default () => {

    const classes = useStyles();
    const salesStats = useSelector(state => state.get("branch").branchSalesStats);
    const {t} = useTranslation();

    return <>
        <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={2}>
                <Card>
                    <CardHeader color="primary" stats icon>
                        <CardIcon color="primary">
                            <Money/>
                        </CardIcon>
                        <p className={classes.cardCategory}>Чеки</p>
                        <h3 className={classes.cardTitle}>
                            {numeral(salesStats ? salesStats.salesCount : 0).format('0,0')}
                        </h3>
                    </CardHeader>
                </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <Card>
                    <CardHeader color="primary" stats icon>
                        <CardIcon color="primary">
                            <CallReceivedIcon/>
                        </CardIcon>
                        <p className={classes.cardCategory}>Возвраты</p>
                        <h3 className={classes.cardTitle}>
                            {numeral(salesStats ? salesStats.returned : 0).format('0,0') + ' ' + t("units.sum")}
                        </h3>
                    </CardHeader>
                </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <Card>
                    <CardHeader color="primary" stats icon>
                        <CardIcon color="primary">
                            <Check/>
                        </CardIcon>
                        <p className={classes.cardCategory}>Средний чек</p>
                        <h3 className={classes.cardTitle}>
                            {numeral(salesStats ? salesStats.averageReceiptCost : 0).format('0,0') + ' ' + t("units.sum")}
                        </h3>
                    </CardHeader>
                </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <Card>
                    <CardHeader color="primary" stats icon>
                        <CardIcon color="primary">
                            <Balance/>
                        </CardIcon>
                        <p className={classes.cardCategory}>Сумма продаж</p>
                        <h3 className={classes.cardTitle}>
                            {numeral(salesStats ? salesStats.salesTotal : 0).format('0,0') + ' ' + t("units.sum")}
                        </h3>
                    </CardHeader>
                </Card>
            </Grid>
        </Grid>
    </>
};
