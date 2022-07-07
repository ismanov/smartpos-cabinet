import React, {useEffect, useState} from 'react';
import {
    Grid,
    Typography,
    Button,
    makeStyles
} from '@material-ui/core';
import Table from '../../../../components/Table/index';
import Pagination from "../../../../components/Pagination/Pagination";
import {useDispatch, useSelector} from "react-redux";
import {withRouter} from 'react-router-dom';
import moment from 'moment';
import Paper from "@material-ui/core/Paper";
import Tooltip from '@material-ui/core/Tooltip';
import EditIcon from '@material-ui/icons/Edit';
import {useTranslation} from "react-i18next";
import {fetchAdjustmentList, setProduct, setSort, } from "../actions";
import ProductSelectBox from '../../../components/productSelector';

const useStyle = makeStyles(() => ({
    container: {
        height: '100%'
    },
    paper: {
        width: '100%',
        marginTop: 20,
        height: 'calc(100% - 140px)',
        overflow: 'auto'
    }
}));


const AdjustmentList = props => {

    const dispatch = useDispatch();

    
    const page = useSelector(state => state.get("adjustment").page);
    const size = useSelector(state => state.get("adjustment").size);
    const total = useSelector(state => state.get("adjustment").total);
    const list = useSelector(state => state.get("adjustment").list);
    const product = useSelector(state => state.get("adjustment").product);
    const isLoading = useSelector(state => state.get("adjustment").isLoading);
    const sort = useSelector(state => state.get("adjustment").sort);
    const currentBranch = useSelector(state => state.get('dashboard').currentBranch);
    
    const { t } = useTranslation();
    const classes = useStyle();

    useEffect(() => {
        dispatch(fetchAdjustmentList(page, size, currentBranch, sort, product ? product.id : undefined))
    }, [currentBranch, sort, product,]);

    return (
        <Grid container className={classes.container}>
            <Grid container alignItems='flex-start' direction='column'>
                <Typography variant='h4' style={{
                    fontSize: 17,
                    fontWeight: 'bold',
                    marginLeft: 20,
                    marginTop: 14,
                    color: '#555'
                }}>
                    {t("adjustment.title")}
                </Typography>
            </Grid>
            <Grid container style={{marginTop: 20}}>
                <Grid item xs={6} md={3}>
                    <ProductSelectBox 
                        branchId={currentBranch}
                        onProductSelect={product => {                                 
                            dispatch(setProduct(product))                                                     
                        }}    
                        value={product}                                                
                    />
                </Grid>                
            </Grid>

            <Paper className={classes.paper}>
                <Table
                    order={true}
                    page={page}
                    size={size}
                    headers={[
                        {
                            content: t("adjustment.product"),
                            key: 'product',
                            sort: true,
                            render: (row) => row.product.name
                        },
                        {
                            content: t("adjustment.qty"),
                            key: 'qty',
                            sort: true
                        },
                        {
                            content: t("common.unit"),
                            key: 'unit',
                            sort: true,
                            render: (row) => row.product.unit ? row.product.unit.name : t("common.no")
                        },
                        {
                            content: t("adjustment.fio"),
                            key: 'fullName',
                            sort: true,
                            render: (row) => row.stockAdjustment.fullName ? `${row.stockAdjustment.fullName.name}` : t("common.not_defined"),
                        },
                        {
                            content: t("adjustment.date"),
                            key: 'createdDate',
                            sort: true,
                            render: (row) => row.stockAdjustment.createdDate ? moment(row.stockAdjustment.createdDate).format('DD MMM, YYYY') : t("common.not_defined")
                        },
                        {
                            content: t("adjustment.reason"),
                            key: 'reason',
                            sort: true,
                            render: (row) => row.stockAdjustment.reason.nameRu
                        }
                    ]}
                    isLoading={isLoading}
                    data={list}
                    onSort={(index, order) => {
                        dispatch(setSort({ col: index, order }))                        
                    }}
                    sort={sort}
                />
            </Paper>
            <Grid container style={{marginTop: 20, border: '1px #eee solid', padding: 10}} direction='row'>
                <Grid item xs={6}>
                    <Pagination
                        pagesCount={total}
                        currentPage={page}
                        onPageChange={page => {
                            dispatch(fetchAdjustmentList(page, size, currentBranch, sort));
                        }}
                        size={size}
                        onSizeChange={size => {
                            dispatch(fetchAdjustmentList(page, size, currentBranch, sort));
                        }}
                    />
                </Grid>
                {currentBranch && (<Grid item xs={6}>
                    <Grid container justify='flex-end'>
                        <Tooltip title={t("adjustment.title")} arrow>
                            <Button variant={'outlined'} color='primary' onClick={() => {
                                props.history.push('/main/warehouse/adjustment/add')
                            }}> <EditIcon/></Button>
                        </Tooltip>
                    </Grid>
                </Grid>)}

            </Grid>
        </Grid>
    )
};


export default withRouter(AdjustmentList);
