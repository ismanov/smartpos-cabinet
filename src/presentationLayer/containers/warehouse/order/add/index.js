import React, {useEffect, useState} from 'react';
import {
    Grid,
    Typography,
    TextField,
    Button,
    IconButton,
    List,
    Divider,
    Paper
} from '@material-ui/core';
import { Close, AddOutlined } from '@material-ui/icons';
import SelectBox from '../../../../components/Select';
import DatePicker from '../../../../components/Pickers/datepicker'
import {useDispatch, useSelector} from 'react-redux';
import withNotification from '../../../../hocs/withNotification/WithNotification';
import ProductAddEditTable from '../component/productAddEditOrderTable';
import {withRouter} from 'react-router-dom';
import moment from 'moment';
import { ArrowBackIos } from "@material-ui/icons";
import BranchSelect from "../../../components/branchList";
import {useTranslation, withTranslation} from "react-i18next";
import {clearOrderItem, createOrder, fetchOrderById, fetchSupplierList, updateOrder} from "../actions";
import NumberTextField from "../../../../components/Textfields/NumberTextField";


const AddOrder = props => {

    const [order, setOrder] = useState([]);
    const [additionalExpenses, setAdditionalExpenses] = useState([]);
    const [additionalName, setAdditionalName] = useState('');
    const [additionalCost, setAdditionalCost] = useState('');
    const [contractor, setContractor] = useState();
    const [branch, setBranch] = useState();
    const [branchError, setBranchError] = useState();
    const [orderDate, setOrderDate] = useState(moment().format('YYYY-MM-DD'));
    const [expectedDate, setExpectedDate] = useState(moment().format('YYYY-MM-DD'));
    const [comment, setComment] = useState('');

    const dispatch = useDispatch();
    const supplierList = useSelector(state => state.get('order').supplierList);
    const orderItem = useSelector(state => state.get('order').order);
    const isLoading = useSelector(state => state.get('order').isLoading);
    const {t} = useTranslation();

    useEffect(() => {
        dispatch(fetchSupplierList({page: 0, size: 10000000}));
        const { orderId } = props.match.params;
        if (orderId !== 'add') {
            dispatch(fetchOrderById(orderId));
        } else {
            dispatch(clearOrderItem());
        }
        return () => {
            dispatch(clearOrderItem())
        }
    }, []);

    useEffect(() => {
        if (orderItem) {
            setBranch(orderItem.toBranchId || undefined);
            setOrder([...orderItem.orderItems]);
            setAdditionalExpenses(orderItem.additionalCosts ? [...orderItem.additionalCosts] : []);
            setOrderDate(orderItem.orderDate ? moment(orderItem.orderDate).format('YYYY-MM-DD') : undefined);
            setExpectedDate(orderItem.expectedDate ? moment(orderItem.expectedDate).format('YYYY-MM-DD') : undefined)
            setContractor(orderItem.contractor ? orderItem.contractor.id : undefined)            
        } else {
            setBranch(undefined);
            setOrder([]);
            setAdditionalExpenses([]);
            setOrderDate(moment().format('YYYY-MM-DD'));
            setExpectedDate(moment().format('YYYY-MM-DD'))
            setContractor(undefined)            
        }
    }, [orderItem]);


    let received = orderItem && orderItem.status ? orderItem.status.code === 'RECEIVED' : false
    let partlyReceived = orderItem && orderItem.status ? orderItem.status.code === 'PARTLY_RECEIVED' : false
    return (
        <Grid container direction='column'>
            <Grid container alignItems="center" style={{ marginTop: 20}}>
                <IconButton onClick={() => { props.history.goBack() }} style={{ color: "#009f3c"}}>
                    <ArrowBackIos />
                </IconButton>
                <Grid item>
                    <Typography variant='h4' style={{fontSize: 20, fontWeight: 'bold', color: '#555'}}>{t("orderAdd.title")}</Typography>
                </Grid>
            </Grid>
            <Grid container style={{marginTop: 10}}>
                <Paper style={{padding: 15, width: '100%'}}>
                    <Grid container direction='row'>
                        <Grid item md={6}>
                            <SelectBox
                                key={1}
                                label={props.match.params.orderId === 'add' ? t("orderAdd.supplier") : ''}
                                data={supplierList}
                                itemKey='id'
                                itemValue='name'
                                disabled={supplierList === undefined}
                                value={contractor || ''}
                                onChange={event => {
                                    setContractor(event.target.value);
                                }}
                            />
                        </Grid>
                        <Grid item md={6} style={{paddingLeft: 10}}>
                            <BranchSelect
                                skipAllBranch={true}
                                value={branch || ''}
                                error={branchError}
                                onChange={branchId => {
                                    if (branchId !== undefined) {
                                        setBranch(branchId);
                                        setBranchError(false);
                                    }
                                }}
                            />
                        </Grid>
                    </Grid>
                    <Grid container direction='row' style={{marginTop: 20}}>
                        <Grid item md={6}>
                            <DatePicker
                                label={t("orderAdd.order_date")}
                                onChange={date => {
                                    setOrderDate(date);
                                }}
                                value={orderDate}
                            />
                        </Grid>
                        <Grid item md={6} style={{paddingLeft: 10}}>
                            <DatePicker
                                label={t("orderAdd.expect_date")}
                                onChange={date => {
                                    setExpectedDate(date);
                                }}
                                value={expectedDate}
                            />
                        </Grid>
                    </Grid>
                    <Grid container
                          style={{
                              minHeight: 300,
                              width: '100%',
                              marginTop: 20
                          }}>
                        <ProductAddEditTable
                            products={order}
                            onProductListChanged={productList => {
                                setOrder([...productList].map(p => { return {...p, unitId: p.unit ? p.unit.id : undefined, unitName: p.unit ? p.unit.name : "Unknown"} }))
                            }}
                            branchId={branch}
                            errorAlert={text => { props.error(text) }}
                        />
                    </Grid>
                    <Grid item style={{marginTop: 30}}>
                        <Typography variant='h4' style={{fontSize: 18, fontWeight: 'bold'}}>
                            {t("orderAdd.additional")}
                        </Typography>
                    </Grid>
                    <Grid item xs={8}>
                        <List>
                            {additionalExpenses.map((item, index) => (
                                <Grid container direction='column'>
                                    <Grid container direction='row' style={{padding: 10}} alignItems='center'>
                                        <Grid item xs={6}>
                                            <Typography variant='h4' style={{fontSize: 16}}>
                                                {item.name}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={5} style={{paddingLeft: 10}}>
                                            <Typography variant='h4' style={{fontSize: 16}}>
                                                {item.amount}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={1}>
                                            <IconButton onClick={() => {
                                                let temp = [...additionalExpenses]
                                                temp.splice(index, 1)
                                                setAdditionalExpenses(temp);
                                            }}>
                                                <Close />
                                            </IconButton>
                                        </Grid>
                                    </Grid>
                                    <Divider />
                                </Grid>
                            ))}
                        </List>
                        <Grid container direction='row' style={{marginTop: 10}}>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label={t("orderAdd.expense")}
                                    variant='outlined'
                                    onChange={event => {
                                        setAdditionalName(event.target.value);
                                    }}
                                    value={additionalName}
                                />
                            </Grid>
                            <Grid item xs={5} style={{paddingLeft: 10}}>
                                <NumberTextField
                                    fullWidth
                                    label={t("orderAdd.summa")}
                                    variant='outlined'
                                    onChange={event => {
                                        setAdditionalCost(event.target.value)
                                    }}
                                    value={additionalCost}
                                />
                            </Grid>
                            <Grid item xs={1} style={{paddingLeft: 10}}>
                                <Grid container justify='center'>
                                    <IconButton color='primary' onClick={() => {
                                        if (additionalName && additionalCost) {
                                            let add = [...additionalExpenses]
                                            add.push({
                                                name: additionalName,
                                                amount: additionalCost
                                            })
                                            setAdditionalExpenses(add);
                                            setAdditionalCost('');
                                            setAdditionalName('');
                                        }
                                    }}>
                                        <AddOutlined />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} style={{ marginTop: 20 }}>
                        <TextField
                            variant='outlined'
                            label={t("orderAdd.leave_comment")}
                            fullWidth
                            multiline={true}
                            rows={2}
                            value={comment}
                            onChange={event => {
                                setComment(event.target.value);
                            }}
                        />
                    </Grid>
                    <Grid container justify='flex-end' style={{ marginTop: 20 }} direction='row'>
                        <Grid item>
                            <Button
                                color='primary'
                                disabled={ isLoading || received || partlyReceived }
                                onClick={() => {
                                    if (!order || order.length === 0) {
                                        props.error(t("orderAdd.order_list_error"));
                                        return
                                    }
                                    if (!contractor) {
                                        props.error(t("orderAdd.supplier_error"));
                                        return
                                    }
                                    if (!orderDate) {
                                        props.error(t("orderAdd.date_error"));
                                        return
                                    }
                                    const {orderId} = props.match.params
                                    let newOrder = ({
                                        additionalCosts: additionalExpenses ? [...additionalExpenses] : undefined,
                                        contractor: {id: contractor},
                                        orderDate: orderDate ? moment(orderDate).format('YYYY-MM-DD') : undefined,
                                        expectedDate: expectedDate ? moment(expectedDate).format('YYYY-MM-DD') : undefined,
                                        orderItems: [...order],
                                        toBranchId: branch,
                                        status: { code: 'DRAFT'},
                                        description: comment
                                    })

                                    if (orderId === 'add') {
                                        dispatch(createOrder(newOrder, props))
                                    } else {
                                        dispatch(updateOrder({...newOrder, id: orderItem.id}, props))
                                    }
                                }}>Сохранить как черновик</Button>
                        </Grid>
                        <Grid item>
                            <Button
                                color='primary'
                                disabled={isLoading}
                                onClick={() => {
                                    if (!order || order.length === 0) {
                                        props.error(t("orderAdd.order_list_error"));
                                        return
                                    }
                                    if (!contractor) {
                                        props.error(t("orderAdd.supplier_error"));
                                        return
                                    }
                                    if (!orderDate) {
                                        props.error(t("orderAdd.date_error"));
                                        return
                                    }
                                    const {orderId} = props.match.params;
                                    let newOrder = ({
                                        additionalCosts: additionalExpenses ? [...additionalExpenses] : undefined,
                                        contractor: {id: contractor},
                                        orderDate: orderDate ? moment(orderDate).format('YYYY-MM-DD') : undefined,
                                        expectedDate: expectedDate ? moment(expectedDate).format('YYYY-MM-DD') : undefined,
                                        orderItems: [...order],
                                        toBranchId: branch,
                                        status: { code: 'NEW'},
                                        description: comment
                                    });
                                    if (orderId === 'add' || orderId === undefined) {
                                        dispatch(createOrder(newOrder, props))
                                    } else {
                                        dispatch(updateOrder({...newOrder, id: orderItem.id}, props))
                                    }
                                }}
                                style={{marginLeft: 10}}>Заказать</Button>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
        </Grid>
    )
}

export default withNotification(withRouter(withTranslation()(AddOrder)));
