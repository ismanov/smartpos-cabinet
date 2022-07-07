import React, {useState, useEffect} from 'react';
import {
    Typography,
    Button,
    Paper,
    Switch,
    makeStyles,
    Grid, 
    TextField,
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
    fetchChequeById, 
    fetchChequeList, 
    fetchChequeStatuses, 
    setDate,     
    fetchPaymentTypes, 
    fetchDiscountSelectbox, 
    setSort, 
    setEmployeeId, 
    setOperation,
    setPaymentType,
    setStatus,
    setDiscount,
} from "./actions";
import { withRouter } from 'react-router-dom';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Table from '../../../components/Table/index';

const useStyles = makeStyles(() => ({
    container: {
        height: '100%',
        padding: 15
    },
    paper: {
        width: '100%',
        height: 'calc(100% - 40px)',
        marginTop: 10,
        padding: 15,
        overflowY: "auto"
    },
    totalElementsTitle: {
        marginTop: 12,
        fontWeight: 'bold',
        fontSize: 15
    },
    content: {
        marginTop: 5,
        display: 'flex',
        flexFlow: 'row',
        position: 'relative'
    },
    table: {
        flexGrow: 1,
        overflow: 'auto',
        border: '1px solid #eee'
    }
}));

const ChequesByDiscount = () => {

    const [uid, setUid] = useState('');
    const [search, setSearch] = useState('');

    // redux
    const dispatch = useDispatch();
    const cashiers = useSelector(state => state.get("employee").cashiers);
    const currentUser = useSelector(state => state.get("dashboard").currentUser);
    const chequeList = useSelector(state => state.get("chequesByDiscount").list);
    const isLoading = useSelector(state => state.get("chequesByDiscount").isLoading);
    const total = useSelector(state => state.get("chequesByDiscount").total);
    const totalElements = useSelector(state => state.get("chequesByDiscount").totalElements);
    const cheque = useSelector(state => state.get("chequesByDiscount").selectedCheque);
    const chequeLoading = useSelector(state => state.get("chequesByDiscount").chequeLoading);
    const page = useSelector(state => state.get("chequesByDiscount").page);
    const size = useSelector(state => state.get("chequesByDiscount").size);
    const date = useSelector(state => state.get("chequesByDiscount").date);
    const statusList = useSelector(state => state.get("chequesByDiscount").statusList);    
    const paymentTypes = useSelector(state => state.get("chequesByDiscount").paymentTypes);
    const selectbox = useSelector(state => state.get('chequesByDiscount').selectbox);
    const sort = useSelector(state => state.get('chequesByDiscount').sort);
    const employeeId = useSelector(state => state.get("chequesByDiscount").employeeId);
    const operation = useSelector(state => state.get("chequesByDiscount").operation);
    const paymentType = useSelector(state => state.get("chequesByDiscount").paymentType);
    const status = useSelector(state => state.get("chequesByDiscount").status);
    const discount = useSelector(state => state.get("chequesByDiscount").discount);

    const cashier = useSelector(state => state.get("cashier").currentBranch);
    const dashboard =  useSelector(state => state.get("dashboard").currentBranch);

    const currentBranch =
        currentUser && (currentUser.authorities || []).includes("ROLE_CASHIER") ?
            cashier : dashboard;
        

    const { t } = useTranslation();

    const classes = useStyles();

    const updateList = React.useCallback(() => {
        dispatch(fetchChequeList(
            {
                page,
                size,
                userId: employeeId === -1 ? undefined: employeeId,
                from: date ? date.startDate : undefined,
                to: date ? date.endDate : undefined,
                branchId: currentBranch,
                search: uid || undefined,                
                es: true,
                paymentType,
                promotionId: discount ? discount.id : undefined,
                promotionStatus: status
            }
        ))
    }, [
        page, 
        size, 
        employeeId, 
        date, 
        fetchChequeList, 
        currentBranch, 
        uid, 
        paymentType, 
        discount, 
        status
    ]);

    useEffect(() => {
        dispatch(fetchChequeStatuses())
        dispatch(fetchPaymentTypes())
    }, []);

    useEffect(() => {        
        updateList()
    }, [
        date,
        employeeId,
        uid,
        operation,
        currentBranch,        
        paymentType,
        discount,
        status,
        updateList,
    ]);

    useEffect(() => {
        dispatch(fetchCashiers(currentBranch));        
    }, [currentBranch]);

    useEffect(() => {
        if (cashiers && cashiers.length) {
            let found = cashiers.find(c => c.id === employeeId);
            if (!found) {
                dispatch(setEmployeeId(-1));
            }
        }
    }, [cashiers]);

    return(
        <Grid container className={classes.container}>
            <Grid container>
                <Typography variant='h4'
                            style={{
                                fontSize: 18,
                                fontWeight: "bold"
                            }}
                > {t("reportByDiscount.title")} </Typography>
            </Grid>

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
                                dispatch(setEmployeeId(event.target.value));
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
                            label={t("cheques.cheque_no")}
                            value={uid}
                            onChange={text => {
                                setUid(text || undefined);
                            }}
                            onSearch={uid => {
                                setUid(uid);
                            }}
                        />

                    </Grid>
                    <Grid item xs={6} md={2} style={{paddingLeft: 10}}>
                        <SelectBox
                            itemKey='code'
                            itemValue='nameRu'
                            label={t("cheques.operation")}
                            placeholder={t("cheques.operation")}
                            labelWidth={100}
                            withReset={true}
                            value={operation || ''}
                            data={statusList}
                            onChange={(e) => {
                                dispatch(setOperation(e.target.value))                                
                            }}
                        />
                    </Grid>

                    <Grid item xs={6} md={2} style={{paddingLeft: 10}}>
                        <SelectBox
                            itemKey='key'
                            itemValue='value'
                            label={t("cheques.paymentType")}
                            placeholder={t("cheques.paymentType")}
                            labelWidth={100}
                            withReset={true}
                            value={paymentType || ''}
                            data={paymentTypes}
                            onChange={(e) => {
                                dispatch(setPaymentType(e.target.value))
                            }}
                        />
                    </Grid>
                    
                    <Grid item xs={6} md={2} style={{marginTop: 7}}>
                        <Autocomplete
                            id="discount-search"
                            options={selectbox ? selectbox : [discount]}
                            getOptionLabel={(option) => option.name}
                            onChange={(e, v) => {  
                                dispatch(setDiscount(v));                                    
                            }}
                            value={discount || {name: search}}
                            noOptionsText={t("common.empty_list")}
                            onInputChange={(_, value) => {
                                setSearch(value);
                                dispatch(fetchDiscountSelectbox(value, currentBranch));
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant="outlined"
                                    label="Выберите акцию"
                                    placeholder="Выберите акцию"                                    
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={6} md={2} style={{marginTop: 7, paddingLeft: 10}}>
                        <SelectBox
                                data={[
                                    {
                                        key: "ACTIVE",
                                        value: t("discount.active_key")
                                    },
                                    {
                                        key: "PLANNED",
                                        value: t("discount.planned_key")
                                    },
                                    {
                                        key: "ENDED",
                                        value: t("discount.ended_key")
                                    },
                                    {
                                        key: "PAUSED",
                                        value: t("discount.paused_key")
                                    },
                                    {
                                        key: "CANCELLED",
                                        value: t("discount.cancelled_key")
                                    }
                                ]}
                                withReset={true}
                                itemKey="key"
                                itemValue="value"
                                label={t("discount.status")}
                                value={status || ''}
                                onChange={(e) => {
                                    dispatch(setStatus(e.target.value || undefined));                                    
                                }}
                            />
                    </Grid>

                    <Grid item style={{
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
                                dispatch(setDate({
                                    startDate: moment().subtract(1, 'month').startOf('day').format('YYYY-MM-DDTHH:mm:ss'),
                                    endDate: moment().endOf('day').format('YYYY-MM-DDTHH:mm:ss')
                                }))
                                dispatch(setOperation(undefined));
                                dispatch(setPaymentType(undefined));                                
                                dispatch(setEmployeeId(-1));
                                dispatch(setDiscount(undefined))
                                dispatch(setStatus(undefined));                                
                                setSearch('');
                                setUid('');
                            }}
                        >x {t("cheques.reset")} </Button>
                    </Grid>
                </Grid>
                <div className={classes.totalElementsTitle}> {t("cheques.total")}: {totalElements} </div>
                <div className={classes.content}>
                    <div className={classes.table}>
                        <Table
                            order={true}
                            onItemClick={item => {
                                dispatch(fetchChequeById(item.id))
                            }}
                            selectClickedRow={true}
                            headers={
                                [
                                    {
                                        content: t("cheques.date"),
                                        sort: true,
                                        key: 'receiptDateTime',
                                        render: (item) => item.receiptDateTime ? moment(item.receiptDateTime).format('YYYY-MM-DD HH:mm:ss') : '-'
                                    },
                                    {
                                        content: t("cheques.summa"),
                                        sort: false,                                        
                                        render: (item) => item.totalCost ? item.totalCost.toLocaleString() : '0'
                                    },
                                    {
                                        content: t("cheques.operation"),
                                        sort: true,
                                        key: 'status',
                                        render: (item) => item.status ? item.status.nameRu : t("common.not_defined")
                                    },
                                    {
                                        content: t("cheques.shift"),
                                        sort: true,
                                        key: 'shiftNo',
                                        render: (item) => item.shiftNo ? item.shiftNo : t("common.not_defined")
                                    },
                                    {
                                        content: t("cheques.nds_summa"),
                                        sort: true,
                                        key: 'totalNds',
                                        render: (item) => item.totalNds ? item.totalNds.toLocaleString() : '0'
                                    },
                                    {
                                        content: t("cheques.cash"),
                                        sort: true,
                                        key: 'totalCash',
                                        render: (item) => isNaN(Number(item.totalCash)) ? '0' : Number(item.totalCash).toLocaleString()

                                    },
                                    {
                                        content: t("cheques.card"),
                                        sort: true,
                                        key: 'totalCard',
                                        render: (item) => isNaN(Number(item.totalCard)) ? '0' : Number(item.totalCard).toLocaleString()
                                    },
                                    {
                                        content: t("cheques.kkm"),
                                        sort: true,
                                        key: 'terminalSN',                                        
                                    },
                                ]
                            }
                            isLoading={isLoading}
                            data={chequeList}                                
                            page={page || 0}
                            size={size || 20}
                            onSort={(i, t) => { dispatch(setSort({col: i, order: t})) }}
                            sort={sort}
                        />                          
                    </div>
                    <div style={{marginLeft: 10}}>
                        <ChequeComponent
                            cheque={cheque}
                            isLoading={chequeLoading}
                        />
                    </div>
                </div>
                <div style={{
                    marginTop: 15,
                    marginBottom: 20
                }}>
                    <Pagination
                        disabled={isLoading}
                        onPageChange={page => {
                            dispatch(fetchChequeList(
                                {
                                    page,
                                    size,
                                    userId: employeeId === -1 ? undefined: employeeId,
                                    from: date ? date.startDate : undefined,
                                    to: date ? date.endDate : undefined,
                                    branchId: currentBranch,
                                    search: uid || undefined,
                                    status: operation,
                                    es: true
                                }
                            ))

                        }}
                        onSizeChange={size => {
                            dispatch(fetchChequeList(
                                {
                                    page,
                                    size,
                                    userId: employeeId === -1 ? undefined: employeeId,
                                    from: date ? date.startDate : undefined,
                                    to: date ? date.endDate : undefined,
                                    branchId: currentBranch,
                                    search: uid || undefined,
                                    status: operation,
                                    es: true
                                }
                            ))
                        }}
                        pagesCount={total}
                        current={page}
                        size={size}
                    />
                </div>
            </Paper>
        </Grid>
    )
};

export default withRouter(ChequesByDiscount);
