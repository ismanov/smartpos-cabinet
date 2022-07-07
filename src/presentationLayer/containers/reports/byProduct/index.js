import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import styles from './ByProduct.module.scss';
import {WebOutlined, CloudDownloadOutlined} from '@material-ui/icons';
import {TextField, Checkbox, IconButton, FormControlLabel} from '@material-ui/core';
import RangePicker from "#components/Pickers/daterange";
import cn from 'classnames';
import Table from '../../../components/Table/index';
import moment from "moment";
import TreeView from "../../catalogTree";
import ProductSelector from '../productSelector';
import Pagination from "../../../components/Pagination/Pagination";
import numeral from 'numeral';
import { withRouter } from 'react-router-dom';
import { makeStyles } from "@material-ui/core/styles";
import Card from '../../../components/material-components/components/Card/Card';
import CardHeader from '../../../components/material-components/components/Card/CardHeader';
import CardIcon from '../../../components/material-components/components/Card/CardIcon';
import Money from '@material-ui/icons/AttachMoney';
import Balance from '@material-ui/icons/AccountBalance';
import CardGiftcard from '@material-ui/icons/CardGiftcard';
import Sales from '@material-ui/icons/AddShoppingCart';
import dashStyles
    from "../../../components/material-components/assets/jss/material-dashboard-react/views/dashboardStyle.js";
import Tooltip from '@material-ui/core/Tooltip';
import {fetchMyCatalog} from "../../catalog/my/actions";
import {byProductsExcelReport, reportByProduct, setSort, getProductStats } from "./actions";
import NumberTextField from '../../../components/Textfields/NumberTextField';
import { formatPriceProduct } from "../../../../utils/format";

const useStyles = makeStyles(dashStyles);

const ByProduct = props => {
    const classes = useStyles();
    const [categoryOpen, setCategoryOpen] = useState(true);
    const [range, setRange] = useState({
        startDate: moment().subtract(1, 'month').startOf('day').format('YYYY-MM-DDTHH:mm:ss'),
        endDate: moment().endOf('day').format('YYYY-MM-DDTHH:mm:ss')
    });
    const [categoryIds, setCategoryIds] = useState([]);
    const [catalogKeyword, setCatalogKeyword] = useState('');
    const [productId, setProductId] = useState(-1);
    const [isSocial, setIsSocial] = useState(false);
    const [fromSalesTotal, setFromSalesTotal] = useState();
    const [toSalesTotal, setToSalesTotal] = useState();

    const myCatalog = useSelector(state => state.get("myCatalog").myCatalog);
    const isLoading = useSelector(state => state.get("reportByProduct").isLoading);
    const list = useSelector(state => state.get("reportByProduct").list);
    const page = useSelector(state => state.get("reportByProduct").page);
    const size = useSelector(state => state.get("reportByProduct").size);
    const total = useSelector(state => state.get("reportByProduct").total);
    const sort = useSelector(state => state.get("reportByProduct").sort);
    const productStats = useSelector(state => state.get("reportByProduct").productStats);
    const totalElements = useSelector(state => state.get("reportByProduct").totalElements);
    const currentBranch = useSelector(state => state.get('dashboard').currentBranch);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchMyCatalog(currentBranch));
        updateReport()
    }, [currentBranch]);

    useEffect(() => {
        updateReport()
    }, [productId, isSocial, catalogKeyword, sort, categoryIds, range, fromSalesTotal, toSalesTotal]);

    useEffect(() => {
      dispatch(getProductStats({
        branchId: currentBranch,
        categoryIds: categoryIds.length === 0 ? undefined : categoryIds,
        from: range.startDate,
        to: range.endDate,
        productId,
        onlySocial: isSocial,
        fromSalesTotal,
        toSalesTotal
      }));
    }, [productId, isSocial, categoryIds, range, fromSalesTotal, toSalesTotal, currentBranch]);

    const updateReport = () => {
        dispatch(reportByProduct({
            branchId: currentBranch,
            categoryId: categoryIds.length === 0 ? undefined : categoryIds,
            from: range.startDate,
            to: range.endDate,
            page,
            size,
            sort,
            productId,
            isSocial,
            fromSalesTotal,
            toSalesTotal
        }));
    };

    return (
        <div className={styles.container}>
            <div className={styles.title}>По Товарам</div>
            <div className={styles.info}>
                <div className={styles.item}>
                    <Card>
                        <CardHeader color="primary" stats icon>
                            <CardIcon color="primary">
                                <Sales/>
                            </CardIcon>
                            <p className={classes.cardCategory}>Всего:</p>
                            <h3 className={classes.cardTitle}>
                                {formatPriceProduct(productStats.data.totalProductCount ? productStats.data.totalProductCount : 0)} тов.
                            </h3>
                        </CardHeader>
                    </Card>
                </div>
                <div className={styles.item}>
                    <Card>
                        <CardHeader color="primary" stats icon>
                            <CardIcon color="primary">
                                <CardGiftcard/>
                            </CardIcon>
                            <p className={classes.cardCategory}>Скидка:</p>
                            <h3 className={classes.cardTitle}>
                              {formatPriceProduct(productStats.data.totalDiscount ? productStats.data.totalDiscount : 0)} сум
                            </h3>
                        </CardHeader>
                    </Card>
                    {/*Выбрано: {numeral(props.totalProductsCount || 0).format('0,0')} тов.*/}
                </div>
                {/*<div className={styles.vertical_divider}/>*/}
                <div className={styles.item}>
                    <Card>
                        <CardHeader color="primary" stats icon>
                            <CardIcon color="primary">
                                <Money/>
                            </CardIcon>
                            <p className={classes.cardCategory}>Общая сумма:</p>
                            <h3 className={classes.cardTitle}>
                              {formatPriceProduct(productStats.data.totalSum ? productStats.data.totalSum : 0)} сум
                            </h3>
                        </CardHeader>
                    </Card>
                </div>
                <div className={styles.item}>
                    <Card>
                        <CardHeader color="primary" stats icon>
                            <CardIcon color="primary">
                                <Balance/>
                            </CardIcon>
                            <p className={classes.cardCategory}>Общий НДС:</p>
                            <h3 className={classes.cardTitle}>
                              {formatPriceProduct(productStats.data.totalNds ? productStats.data.totalNds : 0)} сум
                            </h3>
                        </CardHeader>
                    </Card>
                </div>
            </div>

            <div className={styles.filter}>
                <Tooltip title={categoryOpen ? "Закрыть поиск" : 'Открыть поиск'} arrow>
                    <div
                        className={cn(styles.category_toggle, categoryOpen ? styles.active : false)}
                        onClick={() => {
                            setCategoryOpen(!categoryOpen);
                        }}
                    >
                        <WebOutlined/>
                    </div>
                </Tooltip>
                <div className={cn(styles.search_box)}>
                    <ProductSelector
                        branchId={currentBranch}
                        onChange={item => {
                            setProductId(item ? item.value : undefined);
                        }}
                    />
                </div>
                <div style={{ width: 200, marginLeft: 20 }}> 
                    <NumberTextField 
                        label="Сумма С" 
                        variant="outlined" 
                        onChange={(e) => { setFromSalesTotal(e.target.value) }}
                        /> 
                </div>
                <div style={{ width: 200, marginLeft: 10 }}> 
                    <NumberTextField 
                        label="Сумма До" 
                        variant="outlined" 
                        onChange={(e) => { setToSalesTotal(e.target.value) }}
                        /> 
                </div>
                <div style={{marginLeft: 20, minWidth: 410}}>
                    <RangePicker
                        onChange={range => {
                            console.log("range", range)
                            setRange({
                                startDate: moment(range.startDate).startOf('day').format('YYYY-MM-DDTHH:mm:ss'),
                                endDate: moment(range.endDate).endOf('day').format('YYYY-MM-DDTHH:mm:ss')
                            })

                        }}
                        hideQuickPanel={false}
                        value={range}
                        hideQuickPanel={true}
                    />
                </div>
                <div className={cn(styles.item, styles.social)} style={{marginTop: 0}}>
                    <FormControlLabel
                        className={'custom-label'}
                        control={
                            <Checkbox
                                color='primary'
                                checked={isSocial}
                                onChange={() => {
                                    setIsSocial(!isSocial)
                                }}
                            />
                        }
                        label="Товары без НДС"
                    />
                </div>
                <div>
                    <Tooltip arrow title={'Скачать отчёт'} placement={'bottom'}>
                        <IconButton color='primary' onClick={() => {

                            dispatch(byProductsExcelReport({
                                branchId: currentBranch,
                                categoryIds: categoryIds.length === 0 ? undefined : categoryIds,
                                from: range.startDate,
                                to: range.endDate,
                                productId: productId === -1 ? undefined : productId,
                                onlySocial: isSocial,
                            }));
                        }}>
                            <CloudDownloadOutlined style={{fontSize: 40}}/>
                        </IconButton>
                    </Tooltip>
                </div>
            </div>

            <div className={styles.content}>
                <div className={cn(styles.category_list, styles.bordered, categoryOpen ? [styles.open] : styles.close)}>
                    <div className={styles.wrapper}>
                        <div className={styles.title}>Категория товаров и услуг</div>
                        <div className={styles.search}>
                            <TextField
                                label='Поиск'
                                variant='outlined'
                                fullWidth
                                onChange={event => {
                                    setCatalogKeyword(event.target.value);
                                }}
                            />
                        </div>
                        <div className={styles.list}>
                            <TreeView
                                data={myCatalog}
                                checkbox={true}
                                itemClickable={false}
                                onSelected={items => {
                                    setCategoryIds([...items]);
                                }}
                                keyword={catalogKeyword}
                            />
                        </div>
                    </div>
                </div>
                <div
                    className={cn(styles.table, styles.bordered, categoryOpen ? [styles.open, styles.ml] : styles.close)}>
                    <Table
                        headers={[
                            {
                                content: 'Название',
                                key: 'name',
                                sort: true
                            },
                            {
                                content: 'Кол-во',
                                key: 'salesCount',
                                sort: true
                            },
                            {
                                content: 'Ед. изм.',
                                key: 'unit',
                                sort: false
                            },
                            {
                                content: 'Стоимость',
                                key: 'price',
                                sort: true
                            },
                            {
                                content: 'Сумма',
                                key: 'salesTotal',
                                sort: true
                            },
                            {
                                content: 'Кол-во чеков',
                                key: 'receiptCount',
                                sort: true
                            },
                            {
                                content: 'Скидка',
                                key: 'discount',
                                sort: true
                            },
                            {
                                content: 'Филиал',
                                key: 'branchName',
                                sort: true
                            }
                        ]}
                        data={list}
                        order={true}
                        page={page}
                        size={size}
                        isLoading={isLoading}
                        showSearchEmpty={false}
                        onSort={(i, t) => { dispatch(setSort({col: i, order: t})) }}
                        sort={sort}
                        onItemClick={item => {
                            localStorage.setItem('product', JSON.stringify(item))
                            props.history.push(`/main/report/byOneProduct?productId=${item.id}`);
                        }}/>
                </div>
            </div>
            <div className={styles.footer}>
                <Pagination
                    onPageChange={page => {
                        dispatch(reportByProduct({
                            branchId: currentBranch,
                            categoryId: categoryIds.length === 0 ? undefined : categoryIds,
                            from: range.startDate,
                            to: range.endDate,
                            page,
                            size,
                            sort,
                            productId: productId === -1 ? undefined : productId,
                            isSocial
                        }));
                    }}
                    onSizeChange={size => {
                        dispatch(reportByProduct({
                            branchId: currentBranch,
                            categoryId: categoryIds.length === 0 ? undefined : categoryIds,
                            from: range.startDate,
                            to: range.endDate,
                            page,
                            size,
                            sort,
                            productId: productId === -1 ? undefined : productId,
                            isSocial
                        }));
                    }}
                    pagesCount={total}
                    current={page}
                    size={size}
                />
            </div>
        </div>
    )
};



export default withRouter(ByProduct)
