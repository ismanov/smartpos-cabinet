import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {withRouter} from 'react-router-dom';
import Table from '../../../components/Table/index';
import Pagination from '../../../components/Pagination/Pagination';
import { Grid, TextField, Paper, CircularProgress } from '@material-ui/core';
import SearchTextField from "../../../components/Textfields/search";
import Autocomplete from '@material-ui/lab/Autocomplete';
import styles from "../../../components/material-components/assets/jss/material-dashboard-react/views/dashboardStyle.js";
import moment from "moment";
import DatePicker from "../../../components/Pickers/datepicker";
import {useTranslation} from "react-i18next";
import {
    fetchProductListForKeyword,
    fetchProductsBalanceByDay,
    fetchProductsBalanceStats,
    searchMyCatalog,
    setDate,
    setProduct, 
    setSelectedCategories,
    setSort,
} from "./actions";


const WarehouseByDay = () => {

    // const [sort, setSort] = useState();
    const [productSearchOpen, setProductSearchOpen] = useState(false);
    const [search, setSearch] = useState();
    // const [categoryIds, setCategoryIds] = useState();
    const [searchProduct, setSearchProduct] = useState();
    const currentBranch = useSelector(state => state.get('dashboard').currentBranch);
    const {t} = useTranslation();

    const dispatch = useDispatch();

    const page = useSelector(state => state.get('balanceByDay').page);
    const size = useSelector(state => state.get('balanceByDay').size);
    const total = useSelector(state => state.get('balanceByDay').total);
    const productBalanceList = useSelector(state => state.get('balanceByDay').list);
    const productList = useSelector(state => state.get('balanceByDay').productList);
    const productSearchLoading = useSelector(state => state.get('balanceByDay').productSearchLoading);
    const isLoading = useSelector(state => state.get('balanceByDay').isLoading);
    const searchCatalog = useSelector(state => state.get('balanceByDay').searchCatalog);
    const date = useSelector(state => state.get('balanceByDay').date);
    const categoryIds = useSelector(state => state.get('balanceByDay').selectedCategories);
    const selectedProduct = useSelector(state => state.get('balanceByDay').selectedProduct);
    const sort = useSelector(state => state.get('balanceByDay').sort);

    useEffect(() => {
        dispatch(searchMyCatalog('', currentBranch));        
        dispatch(fetchProductsBalanceStats(currentBranch, page, size, sort));
    }, [currentBranch, sort, date,]);

    useEffect(() => {        
        dispatch(fetchProductsBalanceByDay(moment(date).format('YYYY-MM-DD'), currentBranch, page, size, sort, search, categoryIds ? categoryIds.map(c => c.id).join(","):undefined, selectedProduct ? selectedProduct.id : undefined));
    }, [currentBranch, sort, date, search, categoryIds, selectedProduct]);

    let headers = [
        {
            content: t("balanceByDay.name"),
            key: 'product',
            sort: true,
            render: row => row.product && row.product.name
        },
        {
            content: t("balanceByDay.unit"),
            key: 'product',
            sort: false,
            render: row => row.unit && row.unit.name
        },
        {
            content: t("balanceByDay.date"),
            key: 'balanceDate',
            sort: true
        },
        {
            content: t("balanceByDay.qty_start"),
            key: 'balanceStart',
            sort: true
        },
        {
            content: t("balanceByDay.income"),
            key: 'income',
            sort: true
        },
        {
            content: t("balanceByDay.returns"),
            key: 'back',
            sort: true
        },
        {
            content: t("balanceByDay.sales"),
            key: 'sale',
            sort: true
        },
        {
            content: t("balanceByDay.adjustment"),
            key: 'stockAdjustment',
            sort: true
        },
        {
            content: t("balanceByDay.transfer_in"),
            key: 'transferIn',
            sort: true
        },
        {
            content: t("balanceByDay.transfer_out"),
            key: 'transferOut',
            sort: true
        },
        {
            content: t("balanceByDay.qty_end"),
            key: 'balanceEnd',
            sort: true
        }
    ];

    return (
        <div className={styles.wrapper}>

            <div className={styles.title} style={{fontSize: 18, fontWeight: 'bold', marginTop: 20}}>
                {t("balanceByDay.title")}
            </div>
            <Paper style={{minHeight: 400, marginTop: 40}}>

                <Grid container style={{padding: 10}}>
                    <Grid xs={3}>
                        <DatePicker
                            label={t("balanceByDay.day")}
                            onChange={date => {
                                dispatch(setDate(date));
                            }}
                            value={date || moment().format('YYYY-MM-DD')}
                        />
                    </Grid>
                    <Grid xs={3} style={{paddingLeft: 10}}>
                        <SearchTextField
                            onSearch={e => {
                                setSearch(e)
                            }}
                            onChange={e => {
                                setSearch(e);
                            }}
                        />
                    </Grid>
                    <Grid xs={3} style={{paddingLeft: 10}}>
                        <Autocomplete
                            multiple
                            id="category-search"
                            options={searchCatalog ? searchCatalog : categoryIds}
                            getOptionLabel={(option) => option.name}
                            onChange={(e, v) => {                                
                                dispatch(setSelectedCategories(v))                                
                            }}
                            value={categoryIds}
                            noOptionsText={t("common.empty_list")}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant="outlined"
                                    label={t("balanceByDay.category")}
                                    placeholder={t("balanceByDay.category_placeholder")}
                                    onChange={(e) => {
                                        dispatch(searchMyCatalog(e.target.value, currentBranch));
                                    }}
                                />
                            )}
                        />
                    </Grid>

                    <Grid xs={3} style={{paddingLeft: 10}}>
                        <Autocomplete
                            id="products-saerch"
                            open={productSearchOpen}
                            onOpen={() => {
                                setProductSearchOpen(true);
                            }}
                            onClose={() => {
                                setProductSearchOpen(false);
                            }}
                            getOptionSelected={(option, value) => option.name === value.name}
                            getOptionLabel={(option) => option.name}
                            options={productList ? productList : [selectedProduct]}
                            loading={productSearchLoading}
                            onChange={(e, v) => {
                                dispatch(setProduct(v));                                
                            }}
                            value={selectedProduct}
                            noOptionsText={t("common.empty_list")}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label={t("balanceByDay.product")}
                                    variant="outlined"
                                    onChange={e => {
                                        dispatch(fetchProductListForKeyword(e.target.value, false, currentBranch))
                                    }}
                                    InputProps={{
                                        ...params.InputProps,
                                        endAdornment: (
                                            <React.Fragment>
                                                {productSearchLoading ?
                                                    <CircularProgress color="inherit" size={20}/> : null}
                                                {params.InputProps.endAdornment}
                                            </React.Fragment>
                                        ),
                                    }}
                                />
                            )}
                        />
                    </Grid>
                </Grid>

                <Table
                    order={true}
                    openPathWithId={false}
                    headers={headers}
                    data={productBalanceList || []}
                    page={page}
                    size={size}
                    onSort={(i, order) => {
                        dispatch(setSort({col: i, order}))                        
                    }}
                    sort={sort}
                />
            </Paper>
            <Grid container direction="row" style={{marginTop: 30}}>
                <div style={{flex: 1}}>
                    <Pagination
                        disabled={isLoading}
                        onPageChange={page => {
                            dispatch(fetchProductsBalanceByDay(moment(date).format('YYYY-MM-DD'), currentBranch, page, size, sort, search, categoryIds ? categoryIds.map(c => c.id).join(","):undefined, selectedProduct ? selectedProduct.id : undefined));
                        }}
                        onSizeChange={size => {
                            dispatch(fetchProductsBalanceByDay(moment(date).format('YYYY-MM-DD'), currentBranch, page, size, sort, search, categoryIds ? categoryIds.map(c => c.id).join(","):undefined, selectedProduct ? selectedProduct.id : undefined));
                        }}
                        size={size}
                        pagesCount={total}
                        current={page}
                    />
                </div>
            </Grid>
        </div>
    )
};

export default withRouter(WarehouseByDay);
