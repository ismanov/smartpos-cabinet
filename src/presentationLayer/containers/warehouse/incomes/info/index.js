import React, { useEffect } from 'react';
import {withRouter} from 'react-router-dom';
import { IconButton, Paper, makeStyles, Grid } from "@material-ui/core"
import { ArrowBackIos } from '@material-ui/icons';
import Table from '../../../../components/Table/index';
import { useDispatch, useSelector } from 'react-redux';
import moment from "moment";
import {useTranslation} from "react-i18next";
import {fetchIncomeById} from "../actions";

const useStyles = makeStyles(() => ({
    header: {
        marginTop: 25
    },
    topContainer: {
        fontSize: 18,
        fontWeight: 'bold',
        padding: 20,
        width: '100%',
        marginTop: 20
    },
    content: {
        width: "100%"
    },
    rowTitle: {
        marginTop: 10,
        fontSize: 14,
        fontWeight: 200
    },
    rowValue: {
        fontSize: 17,
        fontWeight: 400
    },
    productListTitle: {
        marginTop: 20,
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 25
    },
    listContent: {
        marginTop: 10,
        padding: 20,
        width: '100%'
    }
}));

const IncomeInfo = props => {

    const {t} = useTranslation();

    const classes = useStyles();

    const dispatch = useDispatch();
    const income = useSelector(state => state.get("income").income);
    const isLoading = useSelector(state => state.get("income").isLoading);

    useEffect(() => {
        const { incomeId } = props.match.params;
        if (!incomeId) {
            props.history.goBack();
        } else {
            dispatch(fetchIncomeById(incomeId));
        }
    }, []);

    return (
        <Grid container>
            <Grid container direction="row" aligItems="center" className={classes.header}>
                <IconButton
                    color="primary"
                    style={{padding: 0, textAlign: 'center'}}
                    onClick={() => {
                        props.history.goBack();
                    }}
                >
                    <ArrowBackIos style={{padding: 0, marginLeft: 5}}/>
                </IconButton>
                <div style={{marginLeft: 10, fontSize: 20, fontWeight: 'bold'}}>
                    {t("incomeInfo.title")}
                </div>
            </Grid>
            <Grid container>
                <Paper className={classes.topContainer}>
                    <Grid container>
                        {t("incomeInfo.info_title")} № {income ? income.id : 0}
                    </Grid>
                    <Grid container direction="row" style={{marginTop: 20}}>
                        <Grid item xs={12} md={6}>
                            <Grid container className={classes.rowTitle}>
                                {t("incomeInfo.creator")}
                            </Grid>
                            <Grid container className={classes.rowValue}>
                                {income ? income.createdBy : t("common.unknown") }
                            </Grid>

                            <Grid container className={classes.rowTitle}>
                                {t("incomeInfo.supplier")}
                            </Grid>
                            <Grid container className={classes.rowValue}>
                                {
                                    income && income.contractor ?
                                        income.contractor.name : t("common.unknown")
                                }
                            </Grid>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Grid container className={classes.rowTitle}>
                                {t("incomeInfo.date")}
                            </Grid>
                            <Grid container className={classes.rowValue}>
                                {income ? moment(income.createdDate).format("DD/MM/YYYY") : "-"}
                            </Grid>

                            <Grid container className={classes.rowTitle}>
                                {t("incomeInfo.summa")}
                            </Grid>
                            <Grid container className={classes.rowValue}>
                                {
                                    income ?
                                        (income.incomeOfProductDetails || []).reduce((acc, item) => {
                                            return acc + (item.qty && item.costPrice ? Number(item.qty)*Number(item.costPrice) : 0)
                                        }, 0).format(2) : 0
                                } {t("common.sum")}
                            </Grid>
                        </Grid>
                    </Grid>

                </Paper>
            </Grid>

            <Grid container className={classes.productListTitle}>
                {t("incomeInfo.productList")}
            </Grid>
            <Paper className={classes.listContent}>
                <Table
                    headers={[
                        {
                            content: t("incomeInfo.productName"),
                            key: 'product',
                            sort: false,
                            render: row => row.product.name
                        },
                        {
                            content: t("incomeInfo.cost"),
                            key: 'costPrice',
                            sort: false,
                            render: row => (row.costPrice || 0).toFixed(2) || 0,
                        },
                        {
                            content: t("incomeInfo.qty"),
                            key: 'qty',
                            sort: false,
                            render: row => (row.qty || 0).toFixed(2),
                        },
                        {
                            content: t("common.unit"),
                            key: 'unitName',
                        },
                        {
                            content: t("incomeInfo.summa"),
                            key: 'summa',
                            sort: false,
                            render: row => row.costPrice && row.qty ? Number(row.costPrice || 0).toFixed(2) * Number(row.qty || 0).toFixed(2) : 0
                        }

                    ]}
                    isLoading={isLoading}
                    data={income && income.incomeOfProductDetails}
                />
            </Paper>
        </Grid>
    )
};

export default withRouter(IncomeInfo);
