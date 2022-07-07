import produce from 'immer';
import React, {useEffect, useState} from 'react';
import {
    Grid,
    Typography,
    Button,
    Table,
    TableHead,
    TableBody,
    TableCell,
    TableRow,
    IconButton,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Divider,
    Paper
} from '@material-ui/core';
import { ShoppingBasketOutlined, ArrowBackIos } from '@material-ui/icons';
import { useDispatch, useSelector } from 'react-redux';
import withNotification from '../../../../hocs/withNotification/WithNotification';
import { withRouter } from 'react-router-dom';
import {Row} from '../../../../components/containers/detailpage/DetailSection';
import moment from 'moment';
import {Delete, Edit, Close, Add} from '@material-ui/icons';
import {useTranslation, withTranslation} from "react-i18next";
import {createIncomeFromOrder, deleteOrder, fetchOrderById, updateOrder} from "../actions";

const OrderDetail = props => {

    const [selectedProduct, setSelectedProduct] = useState();
    const [dialogOpen, setDialogOpen] = useState();
    const [qty, setQty] = useState(0);
    const [multipleDialogOpen, setMultipleDialogOpen] = useState(false);
    const [products, setProducts] = useState([]);
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const order = useSelector(state => state.get("order").order);
    const isLoading = useSelector(state => state.get("order").isLoading);

    useEffect(() => {
        const { orderId } = props.match.params;
        if (orderId) {
            dispatch(fetchOrderById(orderId))
        } else {
            props.history.goBack()
        }
    }, []);

    const renderMultipleDialog = () => {

        return (
            <Dialog
                onClose={() => {
                    setProducts([]);
                    setMultipleDialogOpen(false);
                }}
                open={multipleDialogOpen}
                fullScreen
            >
                <DialogTitle>{t("orderDetail.title")}</DialogTitle>
                <DialogContent>
                    <Grid containers style={{padding: 15, minHeight: 400}}>
                        <Table style={{width: '100%'}}>
                            <TableHead style={{backgroundColor: '#eee'}}>
                                <TableCell>{t("orderDetail.product")}</TableCell>
                                <TableCell>{t("orderDetail.order")}</TableCell>
                                <TableCell>{t("common.unit")}</TableCell>
                                <TableCell>{t("orderDetail.received")}</TableCell>
                                <TableCell>{t("orderDetail.qty")}</TableCell>
                                <TableCell>{t("orderDetail.left")}</TableCell>
                            </TableHead>
                            <TableHead>
                                {(products || []).map(item => (
                                    <TableRow>
                                        <TableCell>{item.product.name}</TableCell>
                                        <TableCell>{item.qty}</TableCell>
                                        <TableCell>{item.unitName}</TableCell>
                                        <TableCell>{item.incomedQty || 0}</TableCell>
                                        <TableCell>
                                            <TextField
                                                placeholder='Количество'
                                                variant='outlined'
                                                style={{width: 150}}
                                                value={parseFloat(item.tempQty) || 0}
                                                onChange={event => {
                                                    let left = item.qty ? (
                                                        item.incomedQty ? parseFloat(item.qty) - parseFloat(item.incomedQty) : item.qty
                                                    ) : 0;
                                                    let p = produce(products, draftProducts => {
                                                        let foundIndex = -1;
                                                        draftProducts.forEach((p, index) => {
                                                            if (p.id === item.id) {
                                                                foundIndex = index
                                                            }
                                                        })
                                                        if (foundIndex >= 0) {
                                                            draftProducts[foundIndex].tempQty = parseFloat(event.target.value) > left ? left : parseFloat(event.target.value)
                                                        } else {
                                                            draftProducts[foundIndex].tempQty = 0
                                                        }
                                                    })

                                                    setProducts(p);
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>{
                                            item.qty ? (
                                                item.incomedQty ? parseFloat(item.qty) - parseFloat(item.incomedQty) : item.qty
                                            ) : 0
                                        }</TableCell>
                                    </TableRow>
                                ))}
                            </TableHead>
                        </Table>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button
                        disabled={isLoading}
                        color='primary'
                        onClick={() => {
                            setProducts([]);
                            setMultipleDialogOpen(false);
                        }}
                    >
                        {t("common.cancel")}
                    </Button>
                    <Button
                        disabled={isLoading}
                        color='primary'
                        onClick={() => {
                            dispatch(createIncomeFromOrder(products.map(pr => ({
                                product: pr.product,
                                qty: pr.tempQty || 0,
                                unitId: pr.unitId,
                                costPrice: pr.costPrice
                            })), order, () => {
                                setProducts([]);
                                setMultipleDialogOpen(false);
                            }))
                        }}>
                        {t("orderDetail.income")}

                    </Button>
                </DialogActions>
            </Dialog>
        )
    }

    let incomed = 0, total = 0
    if (order) {
        order.orderItems.forEach(item => {
            incomed += item.incomedQty
            total += item.qty
        })
    }

    let left;
    if (selectedProduct) {
        let qty = parseFloat(selectedProduct.qty);
        let incomed = selectedProduct.incomedQty ? parseFloat(selectedProduct.incomedQty) : 0
        left = qty - incomed
    }
    return (
        <Grid container alignItems='flex-start' style={{height: '98%', margin: '20px 0px 0px 0px'}}>
            <Grid container direction='column' style={{height: '100%'}}>
                {renderMultipleDialog()}
                <Dialog
                    onClose={() => {
                        setSelectedProduct(undefined);
                        setDialogOpen(false);
                        setQty(0);
                    }}
                    fullWidth
                    open={dialogOpen}
                >
                    <DialogTitle> {t("orderDetail.title")} </DialogTitle>
                    <DialogContent>
                        <Divider light/>
                        <Grid container style={{padding: 15}} justify='flex-start' direction='column'>

                            <Grid container justify='flex-start' direction='column'>
                                <Grid container style={{marginTop: 20}}>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label={t("orderDetail.product")}
                                            value={selectedProduct ? selectedProduct.product.name : ''}
                                            disabled={true}
                                            variant='outlined'
                                        />
                                    </Grid>
                                </Grid>
                                <Grid container style={{marginTop: 20}} direction='row'>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label={t("orderDetail.order")}
                                            value={selectedProduct ? selectedProduct.qty : ''}
                                            disabled={true}
                                            variant='outlined'
                                        />

                                    </Grid>

                                </Grid>
                                <Grid container style={{marginTop: 20}} direction='row'>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label={t("orderDetail.received")}
                                            value={selectedProduct ? selectedProduct.incomedQty || '0' : '0'}
                                            disabled={true}
                                            variant='outlined'
                                        />

                                    </Grid>
                                </Grid>
                                <Grid container style={{marginTop: 20}} direction='row'>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label={t("orderDetail.left")}
                                            variant='outlined'
                                            value={left}
                                            disabled={true}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid container style={{marginTop: 20}} direction='row' alignItems='center'>
                                    <Grid item xs={11}>
                                        <TextField
                                            fullWidth
                                            label={t("orderDetail.qty")}
                                            variant='outlined'
                                            value={parseFloat(qty)}
                                            onChange={event => {
                                                let value = isNaN(Number(event.target.value)) || Number(event.target.value) < 0 ? '0' : event.target.value;
                                                setQty(parseFloat(value || 0) > left ? left : parseFloat(value || 0))
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={1} style={{paddingLeft: 5, textAlign: 'center'}}>
                                        { selectedProduct ? selectedProduct.unitName : '-' }
                                    </Grid>
                                </Grid>

                            </Grid>
                        </Grid>
                        <Divider light style={{marginTop: 20}}/>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            disabled={isLoading}
                            color='primary'
                            onClick={() => {
                                setSelectedProduct(undefined);
                                setDialogOpen(false);
                                setQty(0);
                            }}
                        >{t("common.cancel")}</Button>

                        <Button
                            disabled={isLoading || !qty}
                            color='primary'
                            onClick={() => {
                                dispatch(createIncomeFromOrder(
                                    [{
                                        product: selectedProduct.product,
                                        qty: qty,
                                        costPrice: selectedProduct.costPrice,
                                        unitId: selectedProduct.unitId
                                    }],
                                    order,
                                    () => {
                                        setSelectedProduct(undefined);
                                        setDialogOpen(false);
                                        setQty(0);
                                    }
                                ))
                            }}
                        >{t("orderDetail.income")}</Button>
                    </DialogActions>
                </Dialog>
                <Grid container direction='column'>
                    <Grid container alignItems="center"
                          style={{marginLeft: 20, marginTop: 10, marginBottom: 20, color: '#555'}}>
                        <Grid item>
                            <IconButton color="primary" onClick={() => {
                                props.history.goBack()
                            }}>
                                <ArrowBackIos/>
                            </IconButton>
                        </Grid>
                        <Grid item>

                            <Typography variant='h4' style={{fontSize: 20, fontWeight: 'bold', marginLeft: 10}}>
                                {t("orderDetail.detail")}</Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <Paper style={{borderRadius: 6, padding: 10}}>
                    <Grid container style={{flex: 0.5, border: '1px #eee solid', padding: 10}}>
                        <Grid container style={{marginLeft: 20, marginTop: 10, color: '#555'}}>
                            <Grid item>
                                <Typography variant='h4' style={{
                                    fontSize: 20,
                                    fontWeight: 'bold'
                                }}>{t("orderDetail.detail_title")} {order ? ` #${order.id}` : ''} </Typography>
                            </Grid>
                        </Grid>
                        <Grid container direction='row'>
                            <Grid item xs={6}>
                                <Row
                                    title='Статус'
                                    value={order ? order.status.nameRu : t("common.not_defined")}
                                    style={{marginLeft: 20}}
                                />

                            </Grid>
                            <Grid item xs={6}>
                                <Row
                                    title={t("orderDetail.taken")}
                                    value={`${incomed} ${t("orderDetail.from")} ${total}`}
                                    style={{marginLeft: 20}}
                                />
                            </Grid>
                        </Grid>
                        <Grid container direction='row' style={{marginTop: 20}}>
                            <Grid item xs={6}>
                                <Row
                                    title={t("orderDetail.date")}
                                    value={order ? moment(order.orderDate).format('DD MMM, YYYY') : t("common.not_defined")}
                                    style={{marginLeft: 20}}
                                />

                            </Grid>
                            <Grid item xs={6}>
                                <Row
                                    title={t("orderDetail.delivery_date")}
                                    value={order && order.expectedDate ? moment(order.expectedDate).format('DD MMM, YYYY') : t("common.not_defined")}
                                    style={{marginLeft: 20}}
                                />
                            </Grid>
                        </Grid>
                        <Grid container direction='row' style={{marginTop: 20}}>
                            <Grid item xs={6}>
                                <Row
                                    title={t("orderDetail.branch")}
                                    value={order && order.toBranch ? order.toBranch.name : 'Не определено'}
                                    style={{marginLeft: 20}}
                                />

                            </Grid>
                            <Grid item xs={6}>
                                <Row
                                    title={t("orderDetail.supplier")}
                                    value={order && order.contractor ? order.contractor.name : 'Не определено'}
                                    style={{marginLeft: 20}}
                                />
                            </Grid>
                        </Grid>

                    </Grid>
                    <Grid container aligItems='center' style={{
                        flex: 1,
                        marginTop: 20,
                        border: '1px #eee solid',
                        padding: 10,
                        overflow: 'scroll'
                    }}>
                        <Grid container aligItems='center' style={{marginLeft: 20, marginTop: 10, color: '#555'}}
                              direction='column'>
                            <Grid item>
                                <Typography
                                    variant='h4'
                                    style={{fontSize: 20, fontWeight: 'bold'}}>{t("orderDetail.products")}</Typography>
                            </Grid>
                            <Grid container alignItems='flex-start' style={{marginTop: 20}}>
                                <Table style={{width: '100%'}}>
                                    <TableHead>
                                        <TableRow style={{backgroundColor: '#eee'}}>
                                            <TableCell>
                                                {t("orderDetail.product")}
                                            </TableCell>
                                            <TableCell>
                                                {t("orderDetail.total_count")}
                                            </TableCell>
                                            <TableCell>
                                                {t("common.unit")}
                                            </TableCell>
                                            <TableCell>
                                                {t("orderDetail.taken")}
                                            </TableCell>
                                            <TableCell>
                                                {t("orderDetail.left")}
                                            </TableCell>
                                            <TableCell>
                                                {t("orderDetail.buy_cost")}
                                            </TableCell>
                                            <TableCell>
                                                {t("orderDetail.total")}
                                            </TableCell>
                                            <TableCell>
                                                {t("orderDetail.income")}
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {order && order.orderItems.map(item => (
                                            <TableRow>
                                                <TableCell>
                                                    {item.product.name}
                                                </TableCell>
                                                <TableCell>
                                                    {item.qty || '0'}
                                                </TableCell>
                                                <TableCell>
                                                    {item.unitName}
                                                </TableCell>
                                                <TableCell>
                                                    {item.incomedQty || '-'}
                                                </TableCell>
                                                <TableCell>
                                                    {item.qty ? (
                                                        item.incomedQty ? parseFloat(item.qty) - parseFloat(item.incomedQty) : item.qty
                                                    ) : '-'}
                                                </TableCell>
                                                <TableCell>
                                                    {item.costPrice || '-'}
                                                </TableCell>
                                                <TableCell>
                                                    {item.costPrice * item.qty ? item.costPrice * item.qty : '-'}
                                                </TableCell>

                                                <TableCell>
                                                    <Tooltip title={t("orderDetail.make_income")}>
                                                        <IconButton color='primary'
                                                                    disabled={
                                                                        isLoading ||
                                                                        (order ? order.status.code === 'CANCELLED' : true) ||
                                                                        (order ? order.status.code === 'RECEIVED' : true)
                                                                    }
                                                                    onClick={() => {
                                                                        setSelectedProduct(item);
                                                                        setDialogOpen(true);
                                                                    }}>
                                                            <ShoppingBasketOutlined/>
                                                        </IconButton>
                                                    </Tooltip>
                                                </TableCell>
                                            </TableRow>
                                        ))}


                                    </TableBody>
                                </Table>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid container justify='flex-end'
                          style={{marginTop: 20, border: '1px #eee solid', padding: 10}} direction='row'>
                        <Grid item>
                            <Tooltip arrow title={t("common.delete")}>
                                <Button
                                    color='secondary'
                                    variant={'outlined'}
                                    disabled={
                                        isLoading ||
                                        (order ? order.status.code === 'RECEIVED' : true) ||
                                        (order ? order.status.code === 'PARTLY_RECEIVED' : true)
                                    }
                                    onClick={() => {
                                        dispatch(deleteOrder(order, props));
                                    }}
                                ><Delete/></Button>
                            </Tooltip>
                        </Grid>
                        <Grid item>
                            <Tooltip arrow title={t("common.cancel")}>
                                <Button
                                    color='secondary'
                                    variant={'outlined'}
                                    style={{marginLeft: 20}}
                                    onClick={() => {
                                        dispatch(updateOrder({...order, status: {code: 'CANCELLED'}}, props))
                                    }}
                                    disabled={
                                        isLoading ||
                                        (order ? order.status.code === 'RECEIVED' : true) ||
                                        (order ? order.status.code === 'PARTLY_RECEIVED' : true) ||
                                        (order ? order.status.code === 'CANCELLED' : true)
                                    }
                                ><Close/></Button>
                            </Tooltip>
                        </Grid>
                        <Grid item>
                            <Tooltip arrow title={t("orderDetail.income")}>
                                <Button
                                    color='primary'
                                    variant={'outlined'}
                                    style={{marginLeft: 20}}
                                    onClick={() => {
                                        setMultipleDialogOpen(true);
                                        setProducts(order.orderItems);
                                    }}
                                    disabled={
                                        isLoading ||
                                        (order ? order.status.code === 'CANCELLED' : true) ||
                                        (order ? order.status.code === 'RECEIVED' : true)
                                    }
                                ><Add/></Button>
                            </Tooltip>
                        </Grid>
                        <Grid item>
                            <Tooltip arrow title={t("common.edit")}>
                                <Button
                                    color='primary'
                                    variant={'outlined'}
                                    disabled={
                                        isLoading ||
                                        (order ? order.status.code === 'CANCELLED' : true) ||
                                        (order ? order.status.code === 'RECEIVED' : true) ||
                                        (order ? order.status.code === 'PARTLY_RECEIVED' : true)
                                    }
                                    style={{marginLeft: 20}}
                                    onClick={() => {
                                        props.history.push(`/main/warehouse/orders/new/${order.id}`)
                                    }}
                                ><Edit/></Button>
                            </Tooltip>
                        </Grid>
                    </Grid>
                </Paper>

            </Grid>
        </Grid>
    )
}

export default withNotification(withRouter(withTranslation()(OrderDetail)));
