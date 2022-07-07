import React, {useState, useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter }  from 'react-router-dom';
import  { Grid, TextField, Button, IconButton } from '@material-ui/core';
import SelectBox from "../../../../components/Select";
import DatePicker from "../../../../components/Pickers/datepicker";
import moment from "moment";
import { requestTransfer } from '../actions';
import ProductAddTable from "../component/productAddTable";
import withNotification from "../../../../hocs/withNotification/WithNotification";
import Paper from "@material-ui/core/Paper";
import { ArrowBackIos } from "@material-ui/icons";
import {fetchBranchList} from "../../../branches/actions";

const TransferOrder = props => {

    const [fromBranchId, setFromBranchId] = useState();
    const [toBranchId, setToBranchId] = useState();
    const [orderDate, setOrderDate] = useState(moment().format('DD MMM, YYYY'));
    const [createdDate, setCreatedDate] = useState(moment().format('DD MMM, YYYY'));
    const [productList, setProductList] = useState([]);
    const [comment, setComment] = useState('');
    const [fromBranchError, setFromBranchError] = useState(false);
    const [toBranchError, setToBranchError] = useState(false);

    const isLoading = useSelector(state => state.get("transfer").isLoading);
    const branchList = useSelector(state => state.get("branch").list);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchBranchList({page: 0, size: 10000000}))
    }, [])
    

    return (
        <Grid container style={{marginTop: 20}}>
            <Grid container direction="row" alignItems="center">
                <IconButton onClick={() => { props.history.goBack() }} style={{ color: "#009f3c"}}>
                    <ArrowBackIos />
                </IconButton>
                <span style={{marginLeft: 10, fontSize: 18, fontWeight: 'bold'}}>
                    Заявка на перемещение
                </span>
            </Grid>
            <Grid item xs={7} style={{marginTop: 15}}>
                <Paper style={{padding: 15}}>

                    <Grid container alignItems='flex-start' direction='column' style={{height: '100%', marginTop: 15}}>
                        <Grid container>
                            <Grid item xs={6}>
                                <SelectBox
                                    labelWidth={90}
                                    itemKey='id'
                                    itemValue='name'
                                    label="С Филиала"
                                    data={branchList}
                                    value={fromBranchId}
                                    error={fromBranchError}
                                    onChange={event => {
                                        setFromBranchId(event.target.value);
                                        setFromBranchError(false);                                        
                                    }}

                                />
                            </Grid>
                            <Grid item xs={6} style={{paddingLeft: 10}}>
                                <SelectBox
                                    labelWidth={90}
                                    itemKey='id'
                                    itemValue='name'
                                    label="На Филиал"
                                    data={branchList.filter(b => b.id !== fromBranchId)}
                                    value={toBranchId}
                                    onChange={event => {
                                        setToBranchId(event.target.value);
                                        setToBranchError(false);                                        
                                    }}

                                />
                            </Grid>
                        </Grid>

                        <Grid container direction='row' style={{marginTop: 15}}>
                            <Grid item xs={6}>
                                <DatePicker
                                    label='Дата заявки'
                                    onChange={date => {
                                        setCreatedDate(moment(date).format('DD MMM, YYYY'))
                                    }}
                                    value={createdDate}
                                />
                            </Grid>
                            <Grid item xs={6} style={{paddingLeft: 8}}>
                                <DatePicker
                                    label='Дата желаемой поставки'
                                    onChange={date => {
                                        setOrderDate(moment(date).format('DD MMM, YYYY'))
                                    }}
                                    value={orderDate}
                                />
                            </Grid>
                        </Grid>
                        <Grid container style={{marginTop: 20, height: 320, padding: 10, border: '1px #eee solid'}}>
                            <Grid item xs={12}>
                                <ProductAddTable
                                    style={{width: '100%'}}
                                    isAdding={true}
                                    onProductListChanged={list => {
                                        setProductList(list.map(p => ({...p, unitId: p.unit.id, unitName: p.unit.name})))                                        
                                    }}
                                    branchId={fromBranchId}
                                />
                            </Grid>
                        </Grid>
                        <Grid container style={{marginTop: 20}}>
                            <TextField
                                fullWidth
                                variant='outlined'
                                label='Комментарий'
                                onChange={event => { setComment(event.target.value) }}
                                value={comment}
                                multiline={true}
                                rows={6}
                            />
                        </Grid>
                        <Grid container style={{marginTop: 20, border: '1px #eee solid', padding: 10}} justify='flex-end'>
                            <Grid item style={{marginRight: 10}}>
                                <Button
                                    variant='text'
                                    color='primary'
                                    disabled={isLoading}
                                    onClick={() => {
                                        if (fromBranchId === undefined) {
                                            props.error('Выберите Филиал');
                                            setFromBranchError(true);                                            
                                            return
                                        }
                                        if (toBranchId === undefined) {
                                            props.error('Выберите Филиал');
                                            setToBranchError(true);                                            
                                            return
                                        }
                                        if (productList.length === 0) {
                                            props.error('Выберите това(ов) для оформления заявки!');
                                            return
                                        }
                                        dispatch(requestTransfer({
                                            fromBranchId,
                                            toBranchId,
                                            transferDate: moment(orderDate).format('YYYY-MM-DD'),
                                            transferDetails: productList.map(pr => ({
                                                product: pr.product,
                                                askedQty: pr.qty,
                                                unitId: pr.unitId,
                                                unitName: pr.unitName,
                                                unit: pr.unit
                                            })),
                                            status: {code: 'REQUESTED'}
                                        }, props))                                        
                                    }}>
                                    Сохранить
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
        </Grid>
    )
}

export default withRouter(withNotification(TransferOrder));
