import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { Grid, Button, Typography } from '@material-ui/core';
import Table from '../../../../components/Table/index';
import SelectBox from '../../../../components/Select';
import DateRangePicker from '../../../../components/Pickers/daterange';
import Pagination from '../../../../components/Pagination/Pagination';
import moment from 'moment';
import {withRouter} from 'react-router-dom';
import Paper from "@material-ui/core/Paper";
import AddIcon from '@material-ui/icons/Add';
import Tooltip from '@material-ui/core/Tooltip';
import {useTranslation} from "react-i18next";
import {fetchOrderList, fetchSupplierList, setSort, setDate, setStatus, setSupplier, } from "../actions";

const statuses = (t)  => {
    return [
        {
            code: 'ALL',
            name: t("orderList.all")
        },
        {
            code: 'RECEIVED',
            name: t("orderList.received")
        },
        {
            code: 'PARTLY_RECEIVED',
            name: t("orderList.partly_received")
        },
        {
            code: 'NEW',
            name: t("orderList.ordered")
        },
        {
            code: 'DRAFT',
            name: t("orderList.draft")
        },
        {
            code: 'CANCELLED',
            name: t("orderList.cancelled")
        }
    ]
};

const OrderList = props => {
    
    const supplierList = useSelector(state => state.get("order").supplierList);
    const orderList = useSelector(state => state.get("order").orderList);
    const page = useSelector(state => state.get("order").page);
    const size = useSelector(state => state.get("order").size);
    const total = useSelector(state => state.get("order").total);
    const isLoading = useSelector(state => state.get("order").isLoading);
    const sort = useSelector(state => state.get("order").sort);
    const date = useSelector(state => state.get("order").date);
    const status = useSelector(state => state.get("order").status);
    const supplier = useSelector(state => state.get("order").supplier);
    const dispatch = useDispatch();    
    const currentBranch = useSelector(state => state.get("dashboard").currentBranch);
    const { t } = useTranslation();

    const s = statuses(t);

    useEffect(() => {
        dispatch(fetchSupplierList({page: 0, size: 1000000}));
    }, []);

    useEffect(() => {
        dispatch(fetchOrderList(page, size, currentBranch, supplier === -1 ? undefined : supplier, status.code === 'ALL' ? undefined : status.code, date ? date.startDate : undefined, date ? date.endDate : undefined, sort));
    }, [date, status, currentBranch, supplier, sort, ]);

    return (
        <Grid container style={{height: '100%'}}>
            <Grid item style={{marginTop: 20}}>
                <Typography style={{fontWeight: 'bold', fontSize: 18}}> {t("orderList.title")} </Typography>
            </Grid>
            <Paper style={{padding: 15, width: '100%', marginTop: 20, height: 'calc(100% - 160px)', position: 'relative', overflow: 'auto'}}>
                <Grid container direction="row">
                    <Grid item xs={6} style={{paddingTop: 12}}>
                        <DateRangePicker
                            position={'flex-start'}
                            onChange={range => {
                                const {startDate, endDate} = range;
                                dispatch(setDate({
                                    startDate: moment(startDate).format('YYYY-MM-DDTHH:mm:ss'),
                                    endDate: moment(endDate).format('YYYY-MM-DDTHH:mm:ss'),
                                }))
                            }}
                            value={date}
                        />
                    </Grid>
                    <Grid item xs={3} style={{paddingLeft: 10, marginTop: 10}}>
                        <SelectBox
                            label={t("orderList.status")}
                            value={status.code}
                            data={s}
                            itemKey='code'
                            itemValue='name'
                            onChange={e => {
                                dispatch(setStatus(s.find(s => s.code === e.target.value)))                                
                            }}
                        />
                    </Grid>
                    <Grid item xs={3} style={{paddingLeft: 10, marginTop: 10}}>
                        <SelectBox
                            label='Поставщик'
                            data={[
                                {
                                    id: -1,
                                    name: t("orderList.all")
                                },
                                ...supplierList
                            ]}
                            itemKey='id'
                            value={supplier}
                            itemValue='name'
                            onChange={e => {
                                dispatch(setSupplier(e.target.value))                                
                            }}
                        />
                    </Grid>
                </Grid>

                <Grid item style={{marginTop: 20}}>
                    <Table
                        onItemClick={(item) => {
                            props.history.push(`/main/warehouse/orders/card/${item.id}`)
                        }}
                        headers={
                            [
                                {
                                    content: t("orderList.order_no"),
                                    key: 'id',
                                    sort: true,
                                    render: row => row.id
                                },
                                {
                                    content: t("orderList.supplier"),
                                    key: 'contractor',
                                    sort: true,
                                    render: row => row.contractor ? row.contractor.name : t("common.not_defined")
                                },
                                {
                                    content: t("orderList.branch"),
                                    key: 'toBranch',
                                    sort: true,
                                    render: row => row.toBranch ? row.toBranch.name : t("common.not_defined")
                                },
                                {
                                    content: t("orderList.order_date"),
                                    key: 'orderDate',
                                    sort: true,
                                    render: row => row.orderDate ? moment(row.orderDate).format('DD MMM, YYYY') : t("common.not_defined")
                                },
                                {
                                    content: t("orderList.expect_date"),
                                    key: 'expectedDate',
                                    sort: true,
                                    render: row => row.expectedDate ? moment(row.expectedDate).format('DD MMM, YYYY') : t("common.not_defined")
                                },
                                {
                                    content: t("orderList.status"),
                                    key: 'status',
                                    sort: true,
                                    render: row => row.status ? row.status.nameRu : t("common.not_defined")
                                }
                            ]
                        }
                        data={orderList}
                        order={true}
                        page={page}
                        size={size}
                        isLoading={isLoading}
                        onSort={(i, t) => {                            
                            dispatch(setSort({col: i, order: t}));
                        }}
                        sort={sort}
                    />
                </Grid>
            </Paper>
            <Grid container style={{padding: 10, border: '1px #eee solid', marginTop: 30}} direction='row' alignItems='center'>
                <Grid item xs={6}>
                    <Pagination
                        disabled={isLoading}
                        onPageChange={page => {
                            dispatch(fetchOrderList(page, size, currentBranch, supplier === -1 ? undefined : supplier, status.code === 'ALL' ? undefined : status.code, date ? date.startDate : undefined, date ? date.endDate : undefined, sort));
                        }}
                        onSizeChange={size => {
                            dispatch(fetchOrderList(page, size, currentBranch, supplier === -1 ? undefined : supplier, status.code === 'ALL' ? undefined : status.code, date ? date.startDate : undefined, date ? date.endDate : undefined, sort));
                        }}
                        pagesCount={total}
                        current={page}
                        size={size}
                    />
                </Grid>
                <Grid item xs={6}>
                    <Grid container justify='flex-end'>
                        <Grid item style={{marginRight: 10}}>
                            <Tooltip title={t("orderList.add")} arrow>
                                <Button
                                    variant={'outlined'}
                                    color='primary'
                                    onClick={() => props.history.push('/main/warehouse/orders/new/add')}
                                ><AddIcon/></Button>
                            </Tooltip>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
};

export default withRouter(OrderList);
