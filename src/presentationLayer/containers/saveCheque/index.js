import React, {useState} from 'react';
import { IconButton, TextField, Grid, Paper, makeStyles } from '@material-ui/core';
import { ArrowBackIos } from '@material-ui/icons';
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import { withRouter } from 'react-router-dom';
import SelectBox from "../../components/SelectBox";
import {createCheque, fetchTerminalsForBranchId} from "./actions";
import LogicContainer from '#businessLayer';
import NumberTextField from "../../components/Textfields/NumberTextField";
import { Add, Delete } from '@material-ui/icons';
import RaisedButton from "../../components/Buttons/raised";
import withNotification from "../../hocs/withNotification/WithNotification";
import moment from "moment";
import ProductSelectBoxInBranch from "../components/productInBranchSelector";
import numeral from "numeral";
import useScanDetection from 'use-scan-detection';

numeral.register('locale', 'custom', {
    delimiters: {
        thousands: ' ',
        decimal: ','
    }
});

numeral.locale('custom');


const useStyle = makeStyles(() => ({
    header: {
        marginTop: 20,
        fontSize: 18,
        color: '#555',
        fontWeight: 'bold'
    },
    paper: {
        width: '100%',
        padding: 15
    },
    emptyText: {
        textAlign: 'center'
    },
    table: {
        border: "1px #aaa solid",
        borderRadius: 8,
        minHeight: 350,
        overflow: 'hidden'
    },
    tableHeader: {
        display: 'flex',
        alignItems: 'center',
        backgroundColor: "#eee",
        color: "#555",
        borderBottom: '1px #888 solid',
        height: 50,
        fontWeight: "bold",
        padding: 10
    },
    tableRow: {
        display: 'flex',
        alignItems: 'center',
        padding: 10,
        borderBottom: '1px #eee solid',
        color: "#555",
        marginTop: 8
    }
}));

const SaveCheque = props => {


    const currentUser = useSelector(state => state.get("dashboard").currentUser);
    const currentBranch = currentUser && (currentUser.authorities || []).includes('ROLE_CASHIER') ?
        useSelector(state => state.get("cashier").currentBranch) :
        useSelector(state => state.get("dashboard").currentBranch);
    const currentCompany = useSelector(state => state.get("dashboard").currentOwner);
    const classes = useStyle();
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const terminals = useSelector(state => state.get("saveCheque").terminals);
    const [terminal, setTerminal] = useState();
    const [receiptDetails, setReceiptDetails] = useState([]);
    const [units, setUnits] = useState([]);
    const [unit, setUnit] = useState();
    const [product, setProduct] = useState();
    const [amount, setAmount] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    useScanDetection({
        onComplete: (data) => { console.log("scanned data", data) },
        onError: (error) => { console.log("scanner error", error) },
        preventDefault: false,
        container: document.querySelector("body"),
    });

    React.useEffect(() => {
        if (currentBranch >= 0) {
            dispatch(fetchTerminalsForBranchId(currentBranch));
        }
    }, [currentBranch])

    return (
        <Grid container>
            <Grid container className={classes.header} alignItems="center">
                <Grid item>
                    <IconButton
                        color="primary"
                        onClick={() => {
                            props.history.goBack()
                        }}
                    >
                        <ArrowBackIos />
                    </IconButton>
                </Grid>
                <Grid item>
                    {t("sale.title")}
                </Grid>
            </Grid>

            <Grid container>
                <Paper className={classes.paper}>
                    {!currentBranch ?
                        (
                            <div className={classes.emptyText}>{t("common.selectBranch")}</div>
                        ) :
                        (
                            <Grid container direction="column">
                                <Grid container>
                                    <Grid item xs={12} md={4}>
                                        <SelectBox
                                            itemKey='id'
                                            itemValue='serialNumber'
                                            label={t("sale.terminal")}
                                            data={terminals}
                                            value={terminal ? terminal.id : ''}
                                            onChange={e => {
                                                setTerminal(terminals.find(t => t.id === e.target.value))
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid container direction="column" style={{marginTop: 30}} className={classes.table}>
                                    <Grid container direction="row" className={classes.tableHeader}>
                                        <Grid item xs={3}>
                                            {t("sale.product")}
                                        </Grid>
                                        <Grid item xs={2} style={{paddingLeft: 10}}>
                                            {t("common.unit")}
                                        </Grid>
                                        <Grid item xs={2} style={{paddingLeft: 10}}>
                                            {t("sale.price")}
                                        </Grid>
                                        <Grid item xs={2} style={{paddingLeft: 10}}>
                                            {t("common.qty")}
                                        </Grid>
                                        <Grid item xs={2} style={{paddingLeft: 10}}>
                                            {t("sale.total")}
                                        </Grid>
                                        <Grid item xs={1} style={{paddingLeft: 10}}>
                                            {t("sale.operations")}
                                        </Grid>
                                    </Grid>
                                    {receiptDetails.map((details, index) => (
                                        <Grid container direction="row" className={classes.tableRow}>
                                            <Grid item xs={3}>
                                                {details.product && details.product.name}
                                            </Grid>

                                            <Grid item xs={2} style={{paddingLeft: 10}}>
                                                {details.unit && details.unit.name}
                                            </Grid>
                                            <Grid item xs={2} style={{paddingLeft: 10}}>
                                                {details.unit && numeral(details.unit.price || 0).format('0,0.000')} {t("common.sum")}
                                            </Grid>
                                            <Grid item xs={2} style={{paddingLeft: 10}}>
                                                {Number(details.amount).toLocaleString()}
                                            </Grid>
                                            <Grid item xs={2} style={{paddingLeft: 10}}>
                                                {details.unit && details.amount ? numeral((details.unit.price || 0) * (details.amount || 0)).format('0,0.000') : 0} {t("common.sum")}
                                            </Grid>
                                            <Grid item xs={1} style={{paddingLeft: 10}}>
                                                <IconButton
                                                    color="secondary"
                                                    onClick={() => {
                                                        let r = [...receiptDetails];
                                                        r.splice(index, 1);
                                                        setReceiptDetails(r);
                                                    }}
                                                >
                                                    <Delete />
                                                </IconButton>
                                            </Grid>
                                        </Grid>
                                    ))}
                                    <Grid container direction="row" className={classes.tableRow}>
                                        <Grid item xs={3}>
                                            <ProductSelectBoxInBranch
                                                branchId={currentBranch}
                                                onProductSelect={product => {
                                                    setProduct(product);
                                                    if (product) {
                                                        LogicContainer
                                                            .units
                                                            .fetchProductUnit(currentBranch, product.id)
                                                            .then(response => {
                                                                setUnits(response.data);
                                                            })
                                                            .catch(console.log)
                                                    } else {
                                                        setUnits([]);
                                                    }
                                                }}
                                                value={product || {name: ""}}
                                                placeholder={t("adjustment.select_product")}
                                            />
                                        </Grid>
                                        <Grid item xs={2} style={{paddingLeft: 10}}>
                                            <SelectBox
                                                itemKey="id"
                                                itemValue="name"
                                                label={t("common.unit")}
                                                onChange={e => {
                                                    let found = units.find(u => u.id === e.target.value);
                                                    setUnit(found);
                                                }}
                                                data={units}
                                                value={unit ? unit.id : ''}
                                            />
                                        </Grid>
                                        <Grid item xs={2} style={{paddingLeft: 10}}>
                                            {unit ? numeral(unit.price || 0).format('0,0.000') : 0} {t("common.sum")}
                                        </Grid>
                                        <Grid item xs={2} style={{paddingLeft: 10}}>
                                            <NumberTextField
                                                fullWidth
                                                variant='outlined'
                                                label={t("common.qty")}
                                                value={amount}
                                                // onBlur={() => {
                                                //     if (amount < 1) {
                                                //         setAmount(1);
                                                //     }
                                                // }}
                                                onChange={e => {
                                                    setAmount(e.target.value);
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={2} style={{paddingLeft: 10}}>
                                            {unit && amount ? numeral((unit.price || 0) * (amount || 0)).format('0,0.000') : 0} {t("common.sum")}
                                        </Grid>
                                        <Grid item xs={1} style={{paddingLeft: 10}}>
                                            <IconButton
                                                color="primary"
                                                disabled={!unit || !product || amount < 0}
                                                onClick={() => {
                                                    setReceiptDetails([...receiptDetails, {product, unit, amount}]);
                                                    setProduct(undefined);
                                                    setUnit(undefined);
                                                    setAmount(1);
                                                }}
                                            >
                                                <Add />
                                            </IconButton>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid container style={{marginTop: 10}} justify="flex-end">
                                    <Grid item>
                                        <strong>{t("sale.totalSum")}:</strong> {numeral((receiptDetails || []).reduce((acc, detail) => acc + (detail.amount || 0) * (detail.unit.price || 0),0)).format('0,0.000')} {t("common.sum")}
                                    </Grid>
                                </Grid>
                                <Grid container style={{marginTop: 30}} justify="flex-end">
                                    <Grid item xs={2}>
                                        <RaisedButton
                                            disabled={isLoading || !receiptDetails.length || !terminal}
                                            isLoading={isLoading}
                                            title={t('common.save')}
                                            onClick={() => {
                                                let ndsPercent = currentCompany.ndsPercent || 0;
                                                let totalCost = receiptDetails.reduce((acc, detail) => acc + (detail.amount || 0)*(detail.unit.price || 0), 0);
                                                let cheque = {
                                                    branchId: currentBranch,
                                                    companyId: currentCompany.id,
                                                    receiptDateTime: moment().format('YYYY-MM-DDTHH:mm:ss'),
                                                    totalCost: totalCost,
                                                    totalNds: parseFloat(totalCost) * parseFloat(ndsPercent)/100.0,
                                                    totalPaid: 0,
                                                    terminalModel: terminal.model,
                                                    terminalSN: terminal.serialNumber,
                                                    status: { code: "DRAFT" },
                                                    user: { id: currentUser.id },
                                                    receiptDetails: receiptDetails.map(detail => ({
                                                        productId: detail.product.id,
                                                        productBarcode: detail.product.barcode,
                                                        productName: detail.product.name,
                                                        qty: detail.amount || 0,
                                                        amount: (detail.amount || 0) * (detail.unit.price || 0),
                                                        ndsPercent: detail.product.vatRate,
                                                        nds: detail.product.vatRate ? (detail.product.vatRate || 0) * (detail.amount || 0) * (detail.unit.price || 0) / (100 + (detail.product.vatRate || 0)) : 0,
                                                        price: detail.unit.price || 0,
                                                        unitId: detail.unit ? detail.unit.id : null,
                                                    }))
                                                }
                                                dispatch(createCheque(cheque, props, () => {
                                                    setTimeout(props.history.goBack, 200)
                                                }))
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        )
                    }
                </Paper>
            </Grid>
        </Grid>
    )
};

export default withRouter(withNotification(SaveCheque));
