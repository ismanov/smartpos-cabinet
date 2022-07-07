import React, { useState, useEffect } from "react";

import {useDispatch, useSelector} from "react-redux";
import { Paper, Grid, IconButton } from '@material-ui/core';
import { ArrowBackIos } from '@material-ui/icons';
import { withRouter } from 'react-router-dom';
import {useTranslation} from "react-i18next";
import {fetchProductBalanceById} from "./actions";

const BalanceCard = props => {

    const currentBranch = useSelector(state => state.get('dashboard').currentBranch);
    const {t} =  useTranslation();
    const productBalance = useSelector(state => state.get('balanceCard').productBalance);
    const dispatch = useDispatch();

    useEffect(() => {
        let productId;
        if (props.history && props.history.location && props.history.location.search) {
            productId = props.history.location.search.split('=')[1]
        }
        dispatch(fetchProductBalanceById(currentBranch, productId))
    }, [currentBranch]);

    return (
        <Grid container style={{padding: 15}} >
            <Grid container direction="row" alignItems="center" style={{marginTop: 10}}>
                <Grid item>
                    <IconButton color="primary" onClick={() => {
                        props.history.goBack()
                    }}>
                        <ArrowBackIos />
                    </IconButton>
                </Grid>
                <span style={{fontWeight: 'bold', marginLeft: 5}}> {t("balanceCard.title")} </span>
            </Grid>
            <Grid container style={{marginTop: 15}}>
                {productBalance && productBalance.map(p => (
                    <Paper style={{width: '100%', padding: 10, marginTop: 20}}>
                        <Grid container direction="row" alignItems='center'>
                            <Grid item xs={12}>
                                <span  style={{fontSize: 17, color: '#777'}}>{t("balanceCard.productName")}:</span>
                                <span  style={{fontWeight: 'bold', fontSize: 17}}> &nbsp; { p.product.name }</span>
                            </Grid>
                        </Grid>

                        <Grid container direction="row" alignItems='center' style={{marginTop: 20}}>
                            <Grid item xs={4}>
                                <div>
                                    <div style={{fontWeight: 'bold', fontSize: 18}}>{t("balanceCard.cost")}</div>
                                    <div style={{fontSize: 18}}>{ Number(p.costPrice).toFixed(2) } {t("common.sum")}</div>
                                </div>
                            </Grid>
                            <Grid item xs={4} style={{paddingLeft: 10}}>
                                <div>
                                    <div style={{fontWeight: 'bold', fontSize: 18}}>{t("balanceCard.salePrice")}</div>
                                    <div style={{fontSize: 18}}>{Number(p.salesPrice).toFixed(2)} {t("common.sum")}</div>
                                </div></Grid>
                            <Grid item xs={4} style={{paddingLeft: 10}}>
                                <div>
                                    <div style={{fontWeight: 'bold', fontSize: 18}}>{t("balanceCard.summa")}</div>
                                    <div style={{fontSize: 18}}>{Number(p.totalSalesPrice).toFixed(2)} {t("common.sum")}</div>
                                </div>
                            </Grid>
                        </Grid>
                        <Grid container direction="row" alignItems='center' style={{marginTop: 40}}>
                            <Grid item xs={4}>
                                <div>
                                    <div style={{fontWeight: 'bold', fontSize: 18}}>{t("balanceCard.balance")}</div>
                                    <div style={{fontSize: 18}}>{p.qty} {p.unit.name}</div>
                                </div>
                            </Grid>
                            <Grid item xs={4} style={{paddingLeft: 10}}>
                                <div>
                                    <div style={{fontWeight: 'bold', fontSize: 18}}>{t("balanceCard.margin")}</div>
                                    <div style={{fontSize: 18}}>{Number(p.margin).toFixed(2)} {t("common.sum")}</div>
                                </div></Grid>
                            <Grid item xs={4} style={{paddingLeft: 10}}>
                                <div>
                                    <div style={{fontWeight: 'bold', fontSize: 18}}>{t("balanceCard.profit")}</div>
                                    <div style={{fontSize: 18}}>{Number(p.profit).toFixed(2)} {t("common.sum")}</div>
                                </div>
                            </Grid>
                        </Grid>

                    </Paper>
                ))}
            </Grid>
        </Grid>
    )
};

export default withRouter(BalanceCard);
