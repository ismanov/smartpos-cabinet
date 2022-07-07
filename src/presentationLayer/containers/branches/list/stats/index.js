import React from 'react';
import {Grid} from '@material-ui/core';
import {useSelector} from "react-redux";
import numeral from "numeral";
import Card from '../../../../components/material-components/components/Card/Card';
import CardHeader from '../../../../components/material-components/components/Card/CardHeader';
import CardIcon from '../../../../components/material-components/components/Card/CardIcon';
import {makeStyles} from "@material-ui/core/styles";
import Balance from '@material-ui/icons/AccountBalance';
import Check from '@material-ui/icons/Ballot';
import Sales from '@material-ui/icons/AddShoppingCart';
import Money from '@material-ui/icons/AttachMoney';

import styles
    from "../../../../components/material-components/assets/jss/material-dashboard-react/views/dashboardStyle.js";
import {useTranslation} from "react-i18next";

const useStyles = makeStyles(styles);

export default () => {
    const classes = useStyles();
    const { t } = useTranslation();
    const salesStats = useSelector(state => state.get("branch").salesStats)

    return (
        <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
                <Card>
                    <CardHeader color="primary" stats icon>
                        <CardIcon color="primary">
                            <Money/>
                        </CardIcon>
                        <p className={classes.cardCategory}>{t("branches.cash")}</p>
                        <h3 className={classes.cardTitle}>
                            {numeral(salesStats ? salesStats.salesTotal : 0).format('0,0') + ` ${t("units.sum")}`}
                        </h3>
                    </CardHeader>
                </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <Card>
                    <CardHeader color="primary" stats icon>
                        <CardIcon color="primary">
                            <Balance/>
                        </CardIcon>
                        <p className={classes.cardCategory}>{t("branches.cashMoney")}</p>
                        <h3 className={classes.cardTitle}>
                            {numeral(salesStats ? salesStats.salesCash : 0).format('0,0') + ` ${t("units.sum")}`}
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
                        <p className={classes.cardCategory}>{t("branches.averageCheques")}</p>
                        <h3 className={classes.cardTitle}>
                            {numeral(salesStats ? salesStats.averageReceiptCost : 0).format('0,0') + ` ${t("units.sum")}`}
                        </h3>
                    </CardHeader>
                </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <Card>
                    <CardHeader color="primary" stats icon>
                        <CardIcon color="primary">
                            <Sales/>
                        </CardIcon>
                        <p className={classes.cardCategory}>{t("branches.sales")}</p>
                        <h3 className={classes.cardTitle}>
                            {numeral(salesStats ? salesStats.salesCount : 0).format('0,0')}
                        </h3>
                    </CardHeader>
                </Card>
            </Grid>
        </Grid>
    )
};
