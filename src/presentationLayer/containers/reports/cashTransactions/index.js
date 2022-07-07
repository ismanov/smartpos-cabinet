import React, {useEffect, useState} from 'react';
import styles from './cashTransactions.module.scss';
import cn from 'classnames';
import {
    Typography,
    Button,
    Paper,
    makeStyles,
    Grid
} from "@material-ui/core";
import ChequeComponent from "#components/Cheque";
import RangePicker from "#components/Pickers/daterange";
import SelectBox from "#components/Select";
import moment from "moment";
import {useDispatch, useSelector} from 'react-redux';
import Pagination from "../../../components/Pagination/Pagination";
import SearchTextField from "#components/Textfields/search";
import {useTranslation} from "react-i18next";
import {fetchCashiers} from "../../employee/actions";
import {
    fetchCashOperationChequesList,
    fetchCashOperationsStatuses, fetchChequeById,
    setCashierId, setCheque,
    setSort,
    setOperation,
    fetchStats
} from "./actions";

import Card from "../../../components/material-components/components/Card/Card";
import CardHeader from "../../../components/material-components/components/Card/CardHeader";
import CardIcon from "../../../components/material-components/components/Card/CardIcon";
import style from "../../../components/material-components/assets/jss/material-dashboard-react/views/dashboardStyle.js";
import Balance from '@material-ui/icons/AccountBalance';
import Check from '@material-ui/icons/Ballot';
import Sales from '@material-ui/icons/AddShoppingCart';
import numeral from 'numeral';
import Table from '../../../components/Table/index';

const useStyles = makeStyles({...style});

const initDate = {
    startDate: moment().subtract(1, 'month').startOf('day').format('YYYY-MM-DDTHH:mm:ss'),
    endDate: moment().endOf('day').format('YYYY-MM-DDTHH:mm:ss')
}

const CashTransactions = () => {

    const [uid, setUid] = useState();
    const [date, setDate] = useState(initDate);


    const cashierId = useSelector(state => state.get('cashTransaction').cashierId);    
    const operation = useSelector(state => state.get('cashTransaction').operation);
    const cheque = useSelector(state => state.get('cashTransaction').cheque);
    const chequeLoading = useSelector(state => state.get('cashTransaction').chequeLoading);
    const page = useSelector(state => state.get('cashTransaction').page);
    const size = useSelector(state => state.get('cashTransaction').size);
    const totalPages = useSelector(state => state.get('cashTransaction').totalPages);
    const totalElements = useSelector(state => state.get('cashTransaction').totalElements);
    const list = useSelector(state => state.get('cashTransaction').list);    
    const isLoading = useSelector(state => state.get('cashTransaction').isLoading);
    const currentBranch = useSelector(state => state.get("dashboard").currentBranch);
    const cashiers = useSelector(state => state.get("employee").cashiers);
    const currentOwner = useSelector(state => state.get("dashboard").currentOwner);
    const statusList = useSelector(state => state.get('cashTransaction').cashOperationStatuses);
    const stats = useSelector(state => state.get("cashTransaction").stats);    
    const sort = useSelector(state => state.get("cashTransaction").sort);   
    const dispatch = useDispatch();
    const { t } = useTranslation();
    
    const classes = useStyles();

    const updateList = () => {
        dispatch(fetchCashOperationChequesList(
            {
                sort,
                page,
                size,
                userId: cashierId === -1 ? undefined : cashierId,
                from: date ? date.startDate : undefined,
                to: date ? date.endDate : undefined,
                branchId: currentBranch,
                search: uid || undefined,
                status: operation
            }
        ))
        dispatch(fetchStats(
            {
                userId: cashierId === -1 ? undefined : cashierId,
                from: date ? date.startDate : undefined,
                to: date ? date.endDate : undefined,
                branchId: currentBranch,
                search: uid || undefined,
                status: operation
            }
        ))
    };

    useEffect(() => {
        dispatch(fetchCashOperationsStatuses())
    }, []);

    useEffect(() => {
        updateList()
    }, [
        date, cashierId, uid, page,
        size, operation, currentBranch,
        sort
    ]);

    useEffect(() => {
        dispatch(fetchCashiers(currentBranch))
        setCashierId(undefined);
    }, [ currentBranch ]);
    

    return(
        <div className={styles.container}>
            <div>
                <Typography variant='h4'
                            style={{
                                fontSize: 18,
                                fontWeight: "bold"
                            }}
                > Кассовые операции </Typography>
            </div>

            <Grid container spacing={3} style={{marginTop: 10}}>                             
                <Grid item xs={12} sm={6} md={4}>
                    <Card>
                        <CardHeader color="primary" stats icon>
                            <CardIcon color="primary">
                                <Sales/>
                            </CardIcon>
                            <p className={classes.cardCategory}>{t("cashTransactions.returnFlow")}</p>
                            <h3 className={classes.cardTitle}>
                                {numeral(stats && stats.returnedCash).format('0,0.00')} {t("common.sum")}
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
                            <p className={classes.cardCategory}>{t("cashTransactions.flow")}</p>
                            <h3 className={classes.cardTitle}>
                                {numeral(stats && stats.withdraw ).format('0,0.00')} {t("common.sum")}
                            </h3>
                        </CardHeader>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Card>
                        <CardHeader color="primary" stats icon>
                            <CardIcon color="primary">
                                <Check/>
                            </CardIcon>

                            <p className={classes.cardCategory}>{t("cashTransactions.withdraw")}</p>
                            <h3 className={classes.cardTitle}>
                                {numeral(stats && stats.flow).format('0,0.00')} {t("common.sum")}
                            </h3>
                        </CardHeader>
                    </Card>
                </Grid>
                
            </Grid>

            <Grid container spacing={3}>          
                <Grid item xs={12} sm={6} md={4}>
                    <Card>
                        <CardHeader color="primary" stats icon>
                            <CardIcon color="primary">
                                <Sales/>
                            </CardIcon>
                            <p className={classes.cardCategory}>{t("cashTransactions.incassation")}</p>
                            <h3 className={classes.cardTitle}>
                                {numeral(stats && stats.incassation).format('0,0.00')} {t("common.sum")}
                            </h3>
                        </CardHeader>
                    </Card>
                </Grid>        
                <Grid item xs={12} sm={6} md={4}>
                    <Card>
                        <CardHeader color="primary" stats icon>
                            <CardIcon color="primary">
                                <Check/>
                            </CardIcon>

                            <p className={classes.cardCategory}>{t("cashTransactions.cashbox")}</p>
                            <h3 className={classes.cardTitle}>
                                {numeral(stats && stats.cashBox).format('0,0.00')} {t("common.sum")}
                            </h3>
                        </CardHeader>
                    </Card>
                </Grid>   
                <Grid item xs={12} sm={6} md={4}>
                    <Card>
                        <CardHeader color="primary" stats icon>
                            <CardIcon color="primary">
                                <Check/>
                            </CardIcon>

                            <p className={classes.cardCategory}>{t("cashTransactions.paidCash")}</p>
                            <h3 className={classes.cardTitle}>
                                {numeral(stats && stats.cashBox).format('0,0.00')} {t("common.sum")}
                            </h3>
                        </CardHeader>
                    </Card>
                </Grid>                
            </Grid>

            <Paper style={{padding: 15, marginTop: 10}}>

                <div className={styles.filter}>
                    <div>
                        <RangePicker
                            position={'flex-start'}
                            hideQuickPanel={true}
                            onChange={range => {
                                setDate({
                                    startDate: moment(range.startDate).startOf('day').format("YYYY-MM-DDTHH:mm:ss"),
                                    endDate: moment(range.endDate).endOf('day').format("YYYY-MM-DDTHH:mm:ss")
                                })
                            }}
                            value={date}
                        />
                    </div>
                    <div className={styles.item} style={{paddingLeft: 10, height: 53}}>
                        <SelectBox
                            itemKey='id'
                            itemValue='name'
                            label={t("cashOperations.employees")}
                            labelWidth={100}
                            value={cashierId || -1}
                            onChange={event => {
                                dispatch(setCashierId(event.target.value));
                                setUid('');                                
                            }}
                            data={[{id: -1, fullName: {lastName: t("common.all"), firstName: ''}},  ...cashiers].map(item => {
                                return {
                                    id: item.id,
                                    name: item && item.fullName ? `${item.fullName.lastName} ${item.fullName.firstName}` : t("common.no_name")
                                }
                            })}
                        />
                    </div>
                    <div className={styles.item} style={{paddingLeft: 10, height: 53}}>
                        <SearchTextField
                            label={t("cashOperations.cheque_no")}
                            value={uid}
                            onChange={text => {
                                setUid(text);
                            }}
                            onSearch={uid => {
                                setUid(uid);
                            }}
                        />

                    </div>

                    <div className={styles.item} style={{paddingLeft: 10, height: 53}}>
                        <SelectBox
                            itemKey='code'
                            itemValue='nameRu'
                            label={t("cashOperations.operation")}
                            placeholder={t("cashOperations.operation")}
                            labelWidth={100}
                            value={operation || ''}
                            data={statusList}
                            onChange={(e) => {
                                dispatch(setOperation(e.target.value))
                            }}
                        />

                    </div>

                    <div className={styles.item} style={{
                        paddingLeft: 20,
                        paddingTop: 10
                    }}>
                        <Button
                            style={{
                                color: '#999',
                                textTransform: 'none',
                                height: 40
                            }}
                            onClick={() => {
                                setDate(initDate);
                                dispatch(setOperation(undefined));
                                setUid('');
                                dispatch(setCashierId(undefined));
                                dispatch(setCheque(undefined));
                            }}
                        > x Сбросить </Button>
                        <div className={cn(styles.download_buttons)}>

                        </div>
                    </div>
                </div>
                <div className={styles.total_elements}> ВСЕГО: {totalElements} </div>
                <div className={styles.content}>
                    <div className={styles.table}>
                        {console.log('list', list)}
                        <Table
                            order={true}
                            onItemClick={item => {
                                dispatch(fetchChequeById(item.id))
                            }}
                            selectClickedRow={true}
                            headers={
                                [
                                    {
                                        content: t("cashOperations.date"),
                                        sort: true,
                                        key: 'receiptDateTime',
                                        render: (item) => item.receiptDateTime ? moment(item.receiptDateTime).format('YYYY-MM-DD HH:mm:ss') : '-'
                                    },
                                    {
                                        content: t("cashOperations.summa"),
                                        sort: false,                                        
                                        render: (item) => item.totalCost ? item.totalCost.toLocaleString() : '0'
                                    },
                                    {
                                        content: t("cashOperations.operation"),
                                        sort: true,
                                        key: 'status',
                                        render: (item) => item.status ? item.status.nameRu : t("common.not_defined")
                                    },
                                    {
                                        content: t("cashOperations.shift"),
                                        sort: true,
                                        key: 'shiftNo',
                                        render: (item) => item.shiftNo ? item.shiftNo : t("common.not_defined")
                                    },
                                    {
                                        content: t("cashOperations.nds_summa"),
                                        sort: true,
                                        key: 'totalNds',
                                        render: (item) => item.totalNds ? item.totalNds.toLocaleString() : '0'
                                    },
                                    {
                                        content: t("cashOperations.cash"),
                                        sort: true,
                                        key: 'totalCash',
                                        render: (item) => isNaN(Number(item.totalCash)) ? '0' : Number(item.totalCash).toLocaleString()

                                    },                                
                                ]
                            }
                            isLoading={isLoading}
                            data={list}                                
                            page={page || 0}
                            size={size || 20}
                            onSort={(i, t) => { dispatch(setSort({col: i, order: t})) }}
                            sort={sort}
                        /> 
                    </div>
                    <div className={styles.cheque}>
                        <ChequeComponent
                            cheque={cheque ? {
                                ...cheque,
                                owner: currentOwner
                            } : undefined}
                            isLoading={chequeLoading}
                        />
                    </div>
                </div>
                <div className={styles.pagination}>
                    <Pagination
                        disabled={isLoading}
                        onPageChange={page => {
                            dispatch(fetchCashOperationChequesList(
                                {
                                    page,
                                    size,
                                    userId: cashierId,
                                    from: date ? date.startDate : undefined,
                                    to: date ? date.endDate : undefined,
                                    branchId: currentBranch,
                                    search: uid || undefined,
                                    status: operation
                                }
                            ))
                        }}
                        onSizeChange={size => {
                            dispatch(fetchCashOperationChequesList(
                                {
                                    page,
                                    size,
                                    userId: cashierId,
                                    from: date ? date.startDate : undefined,
                                    to: date ? date.endDate : undefined,
                                    branchId: currentBranch,
                                    search: uid || undefined,
                                    status: operation
                                }
                            ))
                        }}
                        pagesCount={totalPages}
                        current={page}
                        size={size}
                    />
                </div>
            </Paper>
        </div>
    )
};

export default CashTransactions;
