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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Paper
} from '@material-ui/core';

import {
    useDispatch, useSelector
} from 'react-redux';
import withNotification from '../../../../../hocs/withNotification/WithNotification';
import {
    withRouter
} from 'react-router-dom';
import {
    Row
} from '../../../../../components/containers/detailpage/DetailSection';

import moment from 'moment';
import {
    fetchTransferById,
    approveTransfer,
    cancelTransfer,
    createTransfer
} from "../../actions";
import { ArrowBackIos } from "@material-ui/icons";

const OrderDetail = props => {

    const [selectedProduct, setSelectedProduct] = useState();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [qty, setQty] = useState(0);
    const [multipleDialogOpen, setMultipleDialogOpen] = useState(false);
    const [products, setProducts] = useState([]);

    const currentUser = useSelector(state => state.get("dashboard").currentUser);
    const transfer = useSelector(state => state.get("transfer").transfer);
    const isLoading = useSelector(state => state.get("transfer").isLoading);
    const dispatch = useDispatch();

    useEffect(() => {
        const {transferId} = props.match.params
        if (transferId) {
            dispatch(fetchTransferById(transferId))            
        }    
    }, [])

    
    const renderMultipleDialog = () => {
        return (
            <Dialog
                onClose={() => {
                    setProducts([]);
                    setMultipleDialogOpen(false)
                }}
                open={multipleDialogOpen}
                fullScreen
            >
                <DialogTitle>Приход</DialogTitle>
                <DialogContent>
                    <Grid containers style={{padding: 15, minHeight: 400}}>
                        <Table style={{width: '100%'}}>
                            <TableHead style={{backgroundColor: '#eee'}}>
                                <TableCell>Товар</TableCell>
                                <TableCell>Общий заказ</TableCell>
                                <TableCell>Количество</TableCell>
                                <TableCell>Осталось</TableCell>
                            </TableHead>
                            <TableBody>
                                {products.map(item => (
                                    <TableRow>
                                        <TableCell>{item.product.name}</TableCell>
                                        <TableCell>{item.askedQty}</TableCell>
                                        <TableCell>
                                            <TextField
                                                placeholder='Количество'
                                                variant='outlined'
                                                style={{ width: 150 }}
                                                value={ parseFloat(item.realQty) || 0}
                                                onChange={event => {
                                                    let q = parseFloat(event.target.value)
                                                    let found = products.find(pr => pr.id === item.id)
                                                    if (found) {
                                                        if (!isNaN(q) && q >= 0) {
                                                            found.realQty = parseFloat(event.target.value)
                                                        } else {
                                                            found.realQty = 0
                                                        }

                                                    }
                                                    setProducts([...products]);                                                    
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>{
                                            item.askedQty ? (
                                                item.realQty ? parseFloat(item.askedQty) - parseFloat(item.realQty) : item.askedQty
                                            ) : 0
                                        }</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button
                        disabled={isLoading}
                        color='primary'
                        onClick={() => {
                            setProducts([]);
                            setMultipleDialogOpen(false)
                        }}
                    >
                        Отмена
                    </Button>
                    <Button
                        disabled={isLoading}
                        color='primary'
                        onClick={() => {
                            let transfer = produce(transfer, draftState => {
                                draftState.transferDetails = [...products];
                            })
                            dispatch(createTransfer(transfer, () => {
                                setMultipleDialogOpen(false);
                                const {transferId} = props.match.params
                                    if (transferId) {
                                        dispatch(fetchTransferById(transferId))                                        
                                    }
                            }))                            
                        }}>
                        Отправить
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }

    const renderFootButtons = (transfer, currentUser) => {
        if (transfer && currentUser) {
            switch(transfer.status.code) {
                case 'SENT':
                    if (transfer.toBranchId && transfer.toBranchId === currentUser.branchId) {
                        return (
                            <Grid container justify='flex-end' style={{marginTop: 20, padding: 10}} direction='row'>
                                <Button
                                    color='primary'
                                    disabled={isLoading}
                                    style={{marginLeft: 20}}
                                    onClick={() => {
                                        props.history.goBack()
                                    }}
                                >Назад</Button>
                                <Grid item>
                                    <Button
                                        color='secondary'
                                        disabled={isLoading}
                                        style={{marginLeft: 20}}
                                        onClick={() => {
                                            dispatch(cancelTransfer({...transfer, status: {code: 'CANCELLED'}}, props))                                            
                                        }}
                                    >Отменить</Button>
                                </Grid>
                                <Grid item>
                                    <Button
                                        color='primary'
                                        disabled={isLoading}
                                        style={{marginLeft: 20}}
                                        onClick={() => {
                                            props.history.goBack()
                                        }}
                                    >Назад</Button>
                                    <Button
                                        color='primary'
                                        disabled={isLoading}
                                        style={{marginLeft: 20}}
                                        onClick={() => {
                                            dispatch(approveTransfer({...transfer, status: { code: 'APPROVED' }}, props))                                            
                                        }}
                                    >Подтвердить</Button>
                                </Grid>
                            </Grid>
                            )

                    } else {
                        return (
                            <Grid container justify='flex-end' style={{marginTop: 20, padding: 10}} direction='row'>
                                <Grid item>
                                    <Button
                                        color='primary'
                                        disabled={isLoading}
                                        style={{marginLeft: 20}}
                                        onClick={() => {
                                            props.history.goBack()
                                        }}
                                    >Назад</Button>
                                </Grid>
                                
                            </Grid>
                        )
                    }

                case 'APPROVED':
                    return (
                        <Grid container justify='flex-end' style={{marginTop: 20, padding: 10}} direction='row'>
                            <Grid item>
                                <Button
                                    color='primary'
                                    disabled={isLoading}
                                    style={{marginLeft: 20}}
                                    onClick={() => {
                                        props.history.goBack()
                                    }}
                                >Назад</Button>
                            </Grid>
                        </Grid>
                    )
                case 'CANCELLED':
                    return (
                        <Grid container justify='flex-end' style={{marginTop: 20, padding: 10}} direction='row'>
                            <Grid item>
                                <Button
                                    color='primary'
                                    disabled={isLoading}
                                    style={{marginLeft: 20}}
                                    onClick={() => {
                                        props.history.goBack()
                                    }}
                                >Назад</Button>
                            </Grid>
                        </Grid>
                    )
                case 'REQUESTED':
                    if (transfer.toBranch && transfer.fromBranch.id === currentUser.branchId) {
                        return (
                            <Grid container justify='flex-end' style={{marginTop: 20, padding: 10}} direction='row'>
                                <Grid item>
                                    <Button
                                        color='primary'
                                        disabled={isLoading}
                                        style={{marginLeft: 20}}
                                        onClick={() => {
                                            props.history.goBack()
                                        }}
                                    >Назад</Button>
                                </Grid>
                                <Grid item>
                                    <Button
                                        color='secondary'
                                        disabled={isLoading}
                                        style={{marginLeft: 20}}
                                        onClick={() => {
                                            dispatch(cancelTransfer({...transfer, status: {code: 'CANCELLED'}}, props))                                        
                                        }}
                                    >Отменить</Button>
                                </Grid>
                                <Grid item>
                                    <Button
                                        color='primary'
                                        disabled={isLoading}
                                        style={{marginLeft: 20}}
                                        onClick={() => {
                                            setProducts([...transfer.transferDetails]);
                                            setMultipleDialogOpen(true);                                            
                                        }}
                                    >Отправить</Button>
                                </Grid>
                            </Grid>
                        )
                    } else {
                        return (
                            <Grid container justify='flex-end' style={{marginTop: 20, padding: 10}} direction='row'>
                                <Grid item>
                                    <Button
                                        color='primary'
                                        disabled={isLoading}
                                        style={{marginLeft: 20}}
                                        onClick={() => {
                                            props.history.goBack()
                                        }}
                                    >Назад</Button>
                                </Grid>
                                <Grid item>
                                    <Button
                                        color='secondary'
                                        disabled={isLoading}
                                        style={{marginLeft: 20}}
                                        onClick={() => {
                                            dispatch(cancelTransfer({...transfer, status: {code: 'CANCELLED'}}, props))                                                                                    
                                        }}
                                    >Отменить</Button>
                                </Grid>

                            </Grid>
                        )
                    }

            }
        }
    }

    let incomed = 0, total = 0
    if (transfer) {
        transfer.transferDetails.forEach(item => {
            incomed += isNaN(parseFloat(item.realQty)) ? 0 : parseFloat(item.realQty)
            total += isNaN(parseFloat(item.askedQty)) ? 0 : parseFloat(item.askedQty)
        })
    }

    return (
        <Grid container alignItems='flex-start' style={{
            height: '98%',
            margin: '20px 0px 0px 0px',
            overflow: 'scroll'
        }}>
            <Grid container direction='column' style={{height: '100%'}}>
                {renderMultipleDialog()}
                <Grid container direction='column'>
                    <Grid container direction='row' alignItems='center' style={{marginLeft: 20, marginTop: 10, marginBottom: 20, color: '#555'}}>
                        <IconButton onClick={() => { props.history.goBack() }} style={{ color: "#009f3c"}}>
                            <ArrowBackIos />
                        </IconButton>
                        <Typography variant='h4' style={{fontSize: 20, fontWeight: 'bold'}}>Детали перемещение товара</Typography>
                    </Grid>
                </Grid>
                <Paper style={{padding: 15}}>
                    <Grid container style={{flex: 0.5, padding: 10}}>
                        <Grid container style={{marginLeft: 20, marginTop: 10, color: '#555'}}>
                            <Grid item>
                                <Typography variant='h4' style={{fontSize: 20, fontWeight: 'bold'}}>Деталь {transfer ? ` #${transfer.id}` : ''} </Typography>
                            </Grid>
                        </Grid>
                        <Grid container direction='row'>
                            <Grid item xs={6}>
                                <Row
                                    title='Статус'
                                    value={transfer ? transfer.status.nameRu : 'Не определено'}
                                    style={{marginLeft: 20}}
                                />

                            </Grid>
                            <Grid item xs={6}>
                                <Row
                                    title='Получен'
                                    value={`${incomed} из ${total}`}
                                    style={{marginLeft: 20}}
                                />
                            </Grid>
                        </Grid>
                        <Grid container direction='row' style={{marginTop: 20}}>
                            <Grid item xs={6}>
                                <Row
                                    title='Дата заказа'
                                    value={transfer ? moment(transfer.createdDate).format('DD MMM, YYYY') : 'Не определено'}
                                    style={{marginLeft: 20}}
                                />

                            </Grid>
                            <Grid item xs={6}>
                                <Row
                                    title='Дата ожидаемой поставки'
                                    value={transfer && transfer.transferDate ? moment(transfer.transferDate).format('DD MMM, YYYY') : 'Не определено'}
                                    style={{marginLeft: 20}}
                                />
                            </Grid>
                        </Grid>
                        <Grid container direction='row' style={{marginTop: 20}}>
                            <Grid item xs={6}>
                                <Row
                                    title='С филиала'
                                    value={transfer && transfer.fromBranchName ? transfer.fromBranchName : 'Не определено'}
                                    style={{marginLeft: 20}}
                                />

                            </Grid>
                            <Grid item xs={6}>
                                <Row
                                    title='На филиал'
                                    value={transfer && transfer.toBranchName ? transfer.toBranchName : 'Не определено'}
                                    style={{marginLeft: 20}}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid container aligItems='center' style={{flex: 1, marginTop: 20, padding: 10, overflow: 'scroll'}}>
                        <Grid container aligItems='center' style={{marginLeft: 20, marginTop: 10, color: '#555'}} direction='column'>
                            <Grid item>
                                <Typography variant='h4' style={{fontSize: 20, fontWeight: 'bold'}}>Товары</Typography>
                            </Grid>
                            <Grid container alignItems='flex-start' style={{ marginTop: 20 }}>
                                <Table style={{width: '100%'}}>
                                    <TableHead>
                                        <TableRow style={{backgroundColor: '#eee'}}>
                                            <TableCell>
                                                Товар
                                            </TableCell>
                                            <TableCell>
                                                Общее количество
                                            </TableCell>
                                            <TableCell>
                                                Ед. изм.
                                            </TableCell>
                                            <TableCell>
                                                Получен
                                            </TableCell>
                                            <TableCell>
                                                Осталось
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {transfer && transfer.transferDetails.map(item => (
                                            <TableRow>
                                                <TableCell>
                                                    {item.product.name}
                                                </TableCell>
                                                <TableCell>
                                                    {item.askedQty || '-'}
                                                </TableCell>
                                                <TableCell>
                                                    {item.unitName || '-'}
                                                </TableCell>
                                                <TableCell>
                                                    {item.realQty || '-'}
                                                </TableCell>
                                                <TableCell>
                                                    {item.askedQty ? (
                                                        item.realQty ? parseFloat(item.askedQty) - parseFloat(item.realQty) : item.askedQty
                                                    ) : '-'}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Grid>
                        </Grid>
                    </Grid>
                    {
                        renderFootButtons(transfer, currentUser)
                    }
                </Paper>
            </Grid>
        </Grid>
    )
}


export default withNotification(withRouter(OrderDetail));
