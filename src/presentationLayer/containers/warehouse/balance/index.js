import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Table from '../../../components/Table/index';
import Pagination from '../../../components/Pagination/Pagination';
import {
    Grid, Button, Dialog,
    DialogTitle, DialogContent,
    DialogActions, TextField, Paper,
    CircularProgress, IconButton
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { Sync } from '@material-ui/icons';
import Tooltip from '@material-ui/core/Tooltip';
import SearchTextField from "../../../components/Textfields/search";
import Autocomplete from '@material-ui/lab/Autocomplete';
import {makeStyles} from "@material-ui/core/styles";
import styles from "../../../components/material-components/assets/jss/material-dashboard-react/views/dashboardStyle.js";
import Card from "../../../components/material-components/components/Card/Card";
import CardHeader from "../../../components/material-components/components/Card/CardHeader";
import CardIcon from "../../../components/material-components/components/Card/CardIcon";
import Balance from '@material-ui/icons/AccountBalance';
import Check from '@material-ui/icons/Ballot';
import Sales from '@material-ui/icons/AddShoppingCart';
import {useTranslation} from "react-i18next";
import {Formik, Form, Field} from 'formik';
import * as Yup from "yup";
import NumberTextField from "../../../components/Textfields/NumberTextField";
import SelectBox from "../../../components/SelectBox";
import { EditOutlined } from '@material-ui/icons';
import { withRouter } from 'react-router-dom';
import withNotification from '../../../hocs/withNotification/WithNotification';
import {
    clearProductList,
    clearUnitsCoeff,
    fetchProductBalanceList, fetchProductListForKeyword,
    fetchProductsBalanceStats,
    fetchUnitsWithCoeff,
    searchMyCatalog,
    setBalanceSort,
    setSelectedCategories,
    setProduct as setProductAction,
} from "./actions";
import {createAdjustment} from "../adjustment/actions";
import BigNumber from 'bignumber.js';

const useStyles = makeStyles(styles);

let reasons = (t) => Object.freeze({
    lost: {
        code: 'LOST',
        nameRu: t("balance.lost")
    },
    damaged: {
        code: 'DAMAGED',
        nameRu: t("balance.damaged")
    },
    expired: {
        code: 'EXPIRED',
        nameRu: t("balance.expired")
    }
});

const WarehouseAll = props => {

    const formRef = React.useRef();
    const [adjustDialog, setAdjustDialog] = useState(false);
    const [product, setProduct] = useState(undefined);

    const [productSearchOpen, setProductSearchOpen] = useState(false);

    const [search, setSearch] = useState();    
    const { t } = useTranslation();

    const currentBranch = useSelector(state => state.get("dashboard").currentBranch);
    const productBalanceList = useSelector(state => state.get("productBalance").productBalanceList);
    const isLoading = useSelector(state => state.get("productBalance").isLoading);
    const page = useSelector(state => state.get("productBalance").page);
    const total = useSelector(state => state.get("productBalance").total);
    const size = useSelector(state => state.get("productBalance").size);
    const stats = useSelector(state => state.get("productBalance").productBalanceStats);
    const searchCatalog = useSelector(state => state.get("productBalance").searchCatalog);
    const unitList = useSelector(state => state.get("productBalance").unitList);
    const productList = useSelector(state => state.get("productBalance").productList);
    const sort = useSelector(state => state.get("productBalance").sort);
    const productSearchLoading = useSelector(state => state.get("productBalance").productSearchLoading);
    const categoryIds = useSelector(state => state.get("productBalance").selectedCategories);
    const selectedProduct = useSelector(state => state.get("productBalance").product);

    const dispatch = useDispatch();

    const classes = useStyles();

    useEffect(() => {
        dispatch(searchMyCatalog('', currentBranch));
        
        dispatch(fetchProductsBalanceStats(currentBranch, page, size, sort));
    }, [currentBranch]);

    useEffect(() => {
        dispatch(fetchProductBalanceList(currentBranch, page, size, sort, search, categoryIds ? categoryIds.map(c => c.id).join(",") : undefined, selectedProduct ? selectedProduct.id : undefined));
    }, [sort, categoryIds, search, categoryIds, selectedProduct, currentBranch, ])

    let headers = currentBranch ? [
        {
            content: t("balance.productName"),
            key: 'productName',
            sort: true,
            render: row => row.product && row.product.name
        },
        {
            content: t("balance.qty"),
            key: 'qty',
            sort: true
        },
        {
            content: t("common.unit"),
            key: 'unitName',
            sort: true,
            render: row => row.unit ? row.unit.name : t("balance.not_exists")
        },
        {
            content: t("balance.status"),
            key: 'costPrice',
            sort: false,
            render: row => row.qty > 0 ? t("common.in_stock") : t("common.no_in_stock")
        },
        {
            content: t("balance.cost"),
            key: 'costPrice',
            sort: true,
            render: row => Number(row.costPrice || 0).format(2)
        },
        {
            content: t("balance.price"),
            key: 'salesPrice',
            sort: true,
            render: row => Number(row.salesPrice || 0).format(2)
        },
        {
            content: t("balance.totalCost"),
            key: 'totalCostPrice',
            sort: true,
            render: row => Number(row.totalCostPrice || 0).format(2),
        },
        {
            content: t("balance.totalSale"),
            key: 'totalSalesPrice',
            sort: true,
            render: row => Number(row.totalSalesPrice || 0).format(2)
        },
        {
            content: t("balance.potentialProfit"),
            key: 'profit',
            sort: true,
            render: row => Number(row.profit || 0).format(2),
        },
        {
            content: t("balance.margin"),
            key: 'margin',
            sort: true,
            render: row => Number(row.margin || 0).format(2),
        },
        {
            content: t("common.operations"),
            key: 'operations'
        }
    ] : [
        {
            content: t("balance.productName"),
            key: 'productName',
            sort: true,
            render: row => row.product && row.product.name
        },
        {
            content: t("balance.qty"),
            key: 'qty',
            sort: true
        },
        {
            content: t("common.unit"),
            key: 'unitName',
            sort: true,
            render: row => row.unit ? row.unit.name : t("balance.not_exists")
        },
        {
            content: t("balance.status"),
            key: 'costPrice',
            sort: false,
            render: row => row.qty > 0 ? t("common.in_stock") : t("common.no_in_stock")
        },
        {
            content: t("balance.cost"),
            key: 'costPrice',
            sort: true,
            render: row => Number(row.costPrice || 0).format(2)
        },
        {
            content: t("balance.price"),
            key: 'salesPrice',
            sort: true,
            render: row => Number(row.salesPrice || 0).format(2)
        },
        {
            content: t("balance.totalCost"),
            key: 'totalCostPrice',
            sort: true,
            render: row => Number(row.totalCostPrice || 0).format(2),
        },
        {
            content: t("balance.totalSale"),
            key: 'totalSalesPrice',
            sort: true,
            render: row => Number(row.totalSalesPrice || 0).format(2)
        },
        {
            content: t("balance.potentialProfit"),
            key: 'profit',
            sort: true,
            render: row => Number(row.profit || 0).format(2),
        },
        {
            content: t("balance.margin"),
            key: 'margin',
            sort: true,
            render: row => Number(row.margin || 0).format(2),
        }
    ];

    let list = (productBalanceList || []).map(value => ({
        ...value,
        id: value.product.id,
        operations: (
            <Grid container justify='center'>
                <Grid item>
                    <Tooltip title={t("balance.adjustment")}>
                        <IconButton color='primary' onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (currentBranch !== undefined) {
                                dispatch(fetchUnitsWithCoeff(value.product.id, currentBranch, true));
                                setAdjustDialog(true);
                                setProduct(value.product);
                            }
                        }}>
                            <EditOutlined />
                        </IconButton>
                    </Tooltip>
                </Grid>
            </Grid>
        )
    }))

    let r = reasons(t);
    let l = [
        r.expired,
        r.lost,
        r.damaged
    ];

    return (
        <div className={classes.wrapper}>
            <Formik
                innerRef={formRef}
                enableReinitialize={true}
                initialValues={{
                    unitId: undefined,
                    reason: undefined,
                    qty: undefined
                }}
                validationSchema={() => Yup.object().shape({
                    unitId: Yup.number().required(),
                    reason: Yup.string().required(),
                    qty: Yup.number().positive().required()
                })}
                onSubmit={values => {
                    dispatch(createAdjustment(
                        {
                            stockAdjustmentItems: [{
                                product: {
                                    id: product.id,
                                    name: product.name
                                },
                                unitId: values.unitId,
                                qty: values.qty
                            }],
                            branch: {id: currentBranch},
                            reason: {code: values.reason}
                        },
                        undefined,
                        () => {
                            setAdjustDialog(false);
                            formRef.current && formRef.current.resetForm();
                            dispatch(fetchProductBalanceList(currentBranch, page, size));
                            dispatch(clearUnitsCoeff());
                        }
                    ));
                }}>
                {({isValid, dirty, handleSubmit, values}) => (
                    <Form>
                        <Dialog
                            fullWidth
                            open={adjustDialog}
                            onClose={() => {
                                formRef.current && formRef.current.resetForm();
                            }}
                        >
                            <DialogTitle>{t("adjustment.title")}</DialogTitle>
                            <DialogContent>
                                <Grid container style={{padding: 15}}>
                                    <Grid container>
                                        <TextField
                                            value={product ? product.name : ''}
                                            disabled={true}
                                            fullWidth
                                            variant='outlined'
                                        />
                                    </Grid>
                                    <Grid container style={{marginTop: 20}}>
                                        <Grid item xs={6}>
                                            <Field name="qty">
                                                {({field: { value }, form: {setFieldValue, errors}}) => (
                                                    <NumberTextField
                                                        fullWidth
                                                        variant='outlined'
                                                        label={t("common.qty")}
                                                        value={value}
                                                        error={errors.qty}
                                                        helperText={errors.qty && t("balance.qty_error")}
                                                        onChange={event => {
                                                            setFieldValue('qty', event.target.value);
                                                        }}
                                                        onBlur={() => {                                                            
                                                            const { qty, unitId } = values;
                                                            let unit = unitList.find(u => unitId === u.id);
                                                            if (unit) {
                                                                if (qty > unit.balance) {
                                                                    setFieldValue('qty', unit.balance)
                                                                } else if (qty < 0) {
                                                                    setFieldValue('qty', 0)
                                                                }
                                                            }
                                                        }}
                                                    />
                                                )}
                                            </Field>

                                        </Grid>
                                        <Grid item xs={6} style={{paddingLeft: 10}}>
                                            <Field name="unitId">
                                                {({field: {value}, form: {setFieldValue, errors}}) => (
                                                    <SelectBox
                                                        label={t("common.unit")}
                                                        data={unitList}
                                                        itemKey='id'
                                                        itemValue='name'
                                                        error={errors.unitId}
                                                        helperText={t("balance.adjustment_unit_error")}
                                                        value={value}
                                                        onChange={event => {
                                                            setFieldValue("unitId", event.target.value);
                                                        }}
                                                        onBlur={() => {
                                                            const { qty, unitId } = values;
                                                            let unit = unitList.find(u => unitId === u.id);
                                                            if (unit) {
                                                                if (qty > unit.balance) {
                                                                    setFieldValue('qty', unit.balance)
                                                                } else if (qty < 0) {
                                                                    setFieldValue('qty', 0)
                                                                }
                                                            }
                                                        }}
                                                    />
                                                )}
                                            </Field>
                                        </Grid>
                                    </Grid>
                                    {values && values.unitId >= 0 ? (
                                        <Grid container style={{marginTop: 2}}>
                                            <Grid item style={{ color: '#888', fontSize: 13 }}>
                                                Остаток: { unitList.find(u => values.unitId === u.id).balance } &nbsp; { unitList.find(u => values.unitId === u.id).name }
                                            </Grid>
                                        </Grid>
                                    ) : undefined}
                                    
                                    <Grid container style={{marginTop: 20}}>
                                        <Field name="reason">
                                            {({field: {value}, form: {setFieldValue, errors}}) => (
                                                <SelectBox
                                                    data={l}
                                                    error={errors.reason}
                                                    itemKey='code'
                                                    itemValue='nameRu'
                                                    label={t("balance.reason")}
                                                    helperText={t("balance.adjustment_reason_error")}
                                                    onChange={event => {
                                                        setFieldValue("reason", event.target.value);
                                                    }}
                                                    value={value}
                                                />
                                            )}
                                        </Field>

                                    </Grid>
                                </Grid>
                            </DialogContent>
                            <DialogActions>
                                <Button
                                    color='primary'
                                    onClick={() => {
                                        formRef.current && formRef.current.resetForm();
                                        dispatch(clearUnitsCoeff());
                                        setAdjustDialog(false)
                                    }}>{t("common.cancel")}</Button>
                                <Button
                                    color='primary'
                                    disabled={!isValid || !dirty}
                                    onClick={() => {
                                        handleSubmit();
                                    }}>{t("balance.adjustment")}</Button>
                            </DialogActions>
                        </Dialog>
                    </Form>
                )}
            </Formik>

            <div className={classes.title}>
                {t("balance.title")}
            </div>

            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={4}>
                    <Card>
                        <CardHeader color="primary" stats icon>
                            <CardIcon color="primary">
                                <Balance/>
                            </CardIcon>
                            <p className={classes.cardCategory}>{t("balance.product_count")}</p>
                            <h3 className={classes.cardTitle}>
                                {stats ? new BigNumber(stats.productCount || 0).toFormat(0) : 0}
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
                            <p className={classes.cardCategory}>{t("balance.stat_total_cost")}</p>
                            <h3 className={classes.cardTitle}>
                                {stats ? new BigNumber(stats.totalCostPrice || 0).toFormat(2) : '0' + ` ${t("common.sum")}`}
                            </h3>
                        </CardHeader>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Card>
                        <CardHeader color="primary" stats icon>
                            <CardIcon color="primary">
                                <Sales/>
                            </CardIcon>
                            <p className={classes.cardCategory}>{t("balance.stat_total_price")}</p>
                            <h3 className={classes.cardTitle}>
                                {stats ? new BigNumber(stats.totalSalesPrice || 0).toFormat(2) : '0' + ` ${t("common.sum")}`}
                            </h3>
                        </CardHeader>
                    </Card>
                </Grid>
            </Grid>

            <Paper style={{ minHeight: 400 }}>
                <Grid container style={{padding: 10}}>
                    <Grid xs={3}>
                        <SearchTextField
                            onSearch={e => {
                                setSearch(e)
                            }}
                            onChange={e => {
                                setSearch(e);                                
                            }}
                        />
                    </Grid>
                    <Grid xs={4} style={{paddingLeft: 10}}>
                        <Autocomplete
                            multiple
                            id="category-search"
                            options={searchCatalog ? searchCatalog : categoryIds}
                            getOptionLabel={(option) => option.name}
                            onChange={(e, v) => {
                                dispatch(setSelectedCategories(v));                                
                            }}
                            noOptionsText={t("common.empty_list")}
                            value={categoryIds}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant="outlined"
                                    label={t("balance.category")}
                                    placeholder={t("balance.select_category")}
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
                            // getOptionSelected={(option, value) => option.name === value.name}
                            getOptionLabel={(option) => option.name}
                            options={productList ? productList : [selectedProduct]}
                            loading={productSearchLoading}
                            value={selectedProduct}
                            onChange={(e, v) => {                                
                                dispatch(setProductAction(v));                                
                            }}
                            noOptionsText={t("common.empty_list")}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label={t("balance.product")}
                                    variant="outlined"
                                    onChange={e => {
                                        if (!e.target.value)  {
                                            dispatch(clearProductList())
                                        } else {
                                            dispatch(fetchProductListForKeyword(e.target.value, false, currentBranch))
                                        }
                                    }}
                                    InputProps={{
                                        ...params.InputProps,
                                        endAdornment: (
                                            <React.Fragment>
                                                {productSearchLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                                {params.InputProps.endAdornment}
                                            </React.Fragment>
                                        ),
                                    }}
                                />
                            )}
                        />
                    </Grid>
                    <Grid xs={1} style={{paddingLeft: 15}}>
                        <IconButton color="primary" onClick={() => {
                            dispatch(fetchProductBalanceList(currentBranch, page, size));
                        }}>
                            <Sync />
                        </IconButton>
                    </Grid>
                </Grid>

                <Table
                    order={true}
                    headers={headers}
                    data={list}
                    page={page}
                    size={size}
                    onItemClick={i => { props.history.push(`/main/warehouse/balanceCard?productId=${i.id}`) }}
                    showAction={!!currentBranch}
                    isLoading={isLoading}
                    onSort={(i, order) => {
                        dispatch(setBalanceSort({ col: i, order }))                        
                    }}
                    sort={sort}
                />
            </Paper>
            <Grid container direction="row" style={{marginTop: 30}}>
                <div style={{flex: 1}}>
                    <Pagination
                        disabled={isLoading}
                        onPageChange={page => {
                            dispatch(fetchProductBalanceList(currentBranch, page, size))
                        }}
                        onSizeChange={size => {
                            dispatch(fetchProductBalanceList(currentBranch, page, size));
                        }}
                        size={size}
                        pagesCount={total}
                        current={page}
                    />
                </div>
                {currentBranch && (<div className={styles.button}>
                    <Tooltip arrow title={t("balance.add_income")} placement={'bottom'}>
                        <Button color='primary' variant={'outlined'} onClick={() => {
                            props.history.push('/main/warehouse/incomes/add')
                        }}><AddIcon/></Button>
                    </Tooltip>
                </div>)}
            </Grid>
        </div>
    )
};

export default withNotification(withRouter(WarehouseAll));
