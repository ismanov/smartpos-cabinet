import React, {useState, useEffect} from 'react';
import {
    Typography,
    Paper, Grid,
    makeStyles,
    Button
} from "@material-ui/core";
import moment from "moment";
import {useDispatch, useSelector} from 'react-redux';
import Pagination from "../../../components/Pagination/Pagination";
import ZReportChequeComponent from "../../../components/ZReportChequeComponent";
import Card from "../../../components/material-components/components/Card/Card";
import CardHeader from "../../../components/material-components/components/Card/CardHeader";
import CardIcon from "../../../components/material-components/components/Card/CardIcon";
import Balance from '@material-ui/icons/AccountBalance';
import Check from '@material-ui/icons/Ballot';
import Sales from '@material-ui/icons/AddShoppingCart';
import numeral from "numeral";
import style
    from "../../../components/material-components/assets/jss/material-dashboard-react/views/dashboardStyle.js";
import {useTranslation} from "react-i18next";
import {fetchZReport, fetchZReportStats, fetchCashiers, setDate, downloadZReport, setEmployee, setSort, } from "./actions";
import Table from '../../../components/Table/index';
import SearchTextField from "../../../components/Textfields/search";
import SelectBox from "../../../components/Select";
import RangePicker from '../../../components/Pickers/daterange';
import { Description } from '@material-ui/icons';

const useStyles = makeStyles(() => ({
    ...style,
    paper: {
        padding: 15,
        marginTop: 15,
        width: '100%',
    },
    table: {
        border: '1px solid #eee',
        borderRadius: 5
    },
    pagination: {
        marginTop: 15,
        marginBottom: 20
    }
}));

const ZReport = () => {

    const [report, selectedReport] = useState();    
    const classes = useStyles();
    const { t } = useTranslation();
    const dispatch = useDispatch();

    // redux
    const isLoading = useSelector(state => state.get("zReport").isLoading);
    const list = useSelector(state => state.get("zReport").list);
    const page = useSelector(state => state.get("zReport").page);
    const size = useSelector(state => state.get("zReport").size);
    const total = useSelector(state => state.get("zReport").total);
    const cashiers = useSelector(state => state.get("zReport").cashiers);
    const currentUser = useSelector(state => state.get("dashboard").currentUser);
    const currentBranch = currentUser && (currentUser.authorities || []).includes("ROLE_CASHIER") ?
        useSelector(state => state.get("cashier").currentBranch) :
        useSelector(state => state.get("dashboard").currentBranch);
    const stats = useSelector(state => state.get("zReport").stats);    
    const date = useSelector(state => state.get("zReport").date);
    const sort = useSelector(state => state.get("zReport").sort);
    const employeeId = useSelector(state => state.get("zReport").employeeId);    
    const [uid, setUid] = useState('');    
    const currentOwner = useSelector(state => state.get("dashboard").currentOwner);

    const updateList = () => {
        dispatch(fetchZReport(
            {
                page,
                size,
                branchId: currentBranch,
                sort,
                search: uid || undefined,
                cashierId: employeeId === -1 ? undefined : employeeId,
                from: date ? date.startDate : undefined,
                to: date ? date.endDate : undefined
            }
        ));
        dispatch(fetchZReportStats(
            {
                branchId: currentBranch,
                from: date ? date.startDate : undefined,
                to: date ? date.endDate : undefined,
            }
        ));
    };

    useEffect(() => { updateList() }, [currentBranch, sort, employeeId, uid, date]);

    useEffect(() => {
        dispatch(fetchCashiers(currentBranch));
    }, [currentBranch]);


    return(
        <Grid container>
            <Grid item xs={12} style={{marginTop: 20}}>
                <Typography variant='h4'
                            style={{
                                fontSize: 18,
                                fontWeight: "bold"
                            }}
                > {t("zReport.title")} </Typography>
            </Grid>

            <Grid container spacing={3} style={{marginTop: 10}}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardHeader color="primary" stats icon>
                            <CardIcon color="primary">
                                <Balance/>
                            </CardIcon>
                            <p className={classes.cardCategory}>Акциз</p>
                            <h3 className={classes.cardTitle}>
                                {numeral(stats && stats.excise ).format('0,0.00')} {t("common.sum")}
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
                            <p className={classes.cardCategory}>{t("zReport.nds")}</p>
                            <h3 className={classes.cardTitle}>
                                {numeral(stats && stats.nds ).format('0,0.00')} {t("common.sum")}
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

                            <p className={classes.cardCategory}>{t("zReport.cash")}</p>
                            <h3 className={classes.cardTitle}>
                                {numeral(stats && stats.totalCash).format('0,0.00')} {t("common.sum")}
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
                            <p className={classes.cardCategory}>{t("zReport.card")}</p>
                            <h3 className={classes.cardTitle}>
                                {numeral(stats && stats.totalCard).format('0,0.00')} {t("common.sum")}
                            </h3>
                        </CardHeader>
                    </Card>
                </Grid>
            </Grid>
            <Grid container>
                <Paper className={classes.paper}>
                    <Grid container direction="row" alignItems="center">
                        <Grid item xs={6} md={3}>
                            <RangePicker
                                position={'flex-start'}
                                hideQuickPanel={true}
                                value={date}
                                onChange={range => {
                                    dispatch(setDate({
                                        startDate: moment(range.startDate).startOf('day').format("YYYY-MM-DDTHH:mm:ss"),
                                        endDate: moment(range.endDate).endOf('day').format("YYYY-MM-DDTHH:mm:ss")
                                    }))
                                }}
                            />
                        </Grid>
                        <Grid xs={6} md={2} style={{paddingLeft: 10}}>
                            <SelectBox
                                itemKey='id'
                                itemValue='name'
                                label={t("cheques.employees")}
                                labelWidth={100}
                                value={employeeId}
                                onChange={event => {
                                    dispatch(setEmployee(event.target.value));
                                    setUid('');
                                }}
                                data={[{id: -1, fullName: {lastName: t("common.all"), firstName: ''}},  ...cashiers].map(item => {
                                    return {
                                        id: item.id,
                                        name: item && item.fullName ? `${item.fullName.lastName} ${item.fullName.firstName}` : t("common.no_name")
                                    }

                                })}
                            />
                        </Grid>
                        <Grid item xs={6} md={2} style={{paddingLeft: 10}}>
                            <SearchTextField
                                label={t("common.search")}
                                value={uid}
                                onChange={text => {
                                    setUid(text || undefined);
                                }}
                                onSearch={uid => {
                                    setUid(uid);
                                }}
                            />

                        </Grid>
                        <Grid item xs={6} md={3} style={{paddingLeft: 10}}>
                            <Button
                                color="primary"
                                variant="contained"
                                style={{ height: 40 }}
                                onClick={() => {
                                    dispatch(downloadZReport({
                                        branchId: currentBranch,
                                        sort,
                                        search: uid || undefined,
                                        cashierId: employeeId === -1 ? undefined : employeeId,
                                        from: date ? date.startDate : undefined,
                                        to: date ? date.endDate : undefined
                                    }))
                                }}
                                startIcon={<Description />}
                            > Скачать в Excel файл </Button>

                        </Grid>
                    </Grid>
                    <Grid container direction="row" style={{marginTop: 20}}>
                        <Grid item xs={9} className={classes.table}>
                            <Table
                                order={true}
                                onItemClick={item => {
                                    selectedReport(item);
                                }}
                                selectClickedRow={true}
                                headers={
                                    [
                                        {
                                            content: t("zReport.date"),
                                            sort: true,
                                            key: 'endDateTime',
                                            render: (item) => item.endDateTime ? moment(item.endDateTime).format('YYYY-MM-DD HH:mm:ss') : '-'
                                        },
                                        {
                                            content: t("zReport.summa"),
                                            sort: false,
                                            render: (item) => numeral((item.totalCash || 0) + (item.totalCard || 0)).format('0,0.00')
                                        },
                                        {
                                            content: t("zReport.cash"),
                                            sort: true,
                                            key: 'cash',
                                            render: (item) => numeral(item.totalCash || 0).format('0,0.00')
                                        },
                                        {
                                            content: t("zReport.card"),
                                            sort: true,
                                            key: 'card',
                                            render: (item) => numeral(item.totalCard || 0).format('0,0.00')
                                        },
                                        {
                                            content: t("zReport.nds_summa"),
                                            sort: true,
                                            key: 'NDS',
                                            render: (item) => numeral(item.nds || 0).format('0,0.00')
                                        },
                                        {
                                            content: t("zReport.shift"),
                                            sort: true,
                                            key: 'number',
                                            render: (item) => item.fiscalNumber || t("common.not_defined")

                                        },
                                        {
                                            content: t("zReport.branch"),
                                            sort: true,
                                            key: 'branchId',
                                            render: (item) => item.branchName || t("common.not_defined")
                                        },
                                        {
                                            content: t("zReport.kkm"),
                                            sort: true,
                                            key: 'terminalSN',                                        
                                        },
                                    ]
                                }
                                isLoading={isLoading}
                                data={list}                                
                                page={page}
                                size={size}
                                onSort={(i, t) => { dispatch(setSort({col: i, order: t})) }}
                                sort={sort}
                            />                            
                        </Grid>
                        <Grid item xs={3} style={{paddingLeft: 10}}>
                            <Grid container justify="center">
                                <Grid item>
                                    <ZReportChequeComponent
                                        cheque={report ? {
                                            ...report,
                                            owner: currentOwner
                                        } : undefined}
                                        isLoading={isLoading}
                                    />
                                </Grid>

                            </Grid>

                        </Grid>
                    </Grid>

                    <div className={classes.pagination}>
                        <Pagination
                            disabled={isLoading}
                            onPageChange={page => {
                                dispatch(fetchZReport(
                                    {
                                        page, 
                                        size, 
                                        branchId: currentBranch,                                        
                                        sort,
                                        search: uid || undefined,
                                        cashierId: employeeId === -1 ? undefined : employeeId,
                                        from: date ? date.startDate : undefined,
                                        to: date ? date.endDate : undefined,
                                    }
                                ));
                                selectedReport(undefined);
                            }}
                            onSizeChange={size => {
                                dispatch(fetchZReport(
                                    {
                                        page, 
                                        size, 
                                        branchId: currentBranch,                                        
                                        sort,
                                        search: uid || undefined,
                                        cashierId: employeeId === -1 ? undefined : employeeId,
                                        from: date ? date.startDate : undefined,
                                        to: date ? date.endDate : undefined,
                                    }
                                ));
                                selectedReport(undefined);
                            }}
                            pagesCount={total}
                            current={page}
                            size={size}
                        />
                    </div>
                </Paper>
            </Grid>
        </Grid>
    )
};

export default ZReport;
