import React, {useEffect, useState} from 'react';
import {connect, useDispatch, useSelector} from 'react-redux';
import Table from '../../../components/Table/index';
import {
    Grid,
    Button,
    Typography, Paper, IconButton
} from '@material-ui/core';
import SearchTextField from '../../../components/Textfields/search';
import SupplierAddEditDialog from '../components/AddEditDialog';
import QuestionDialog from '../../../components/Dialog/question';
import Tooltip from '@material-ui/core/Tooltip';
import AddIcon from '@material-ui/icons/Add';
import Pagination from "../../../components/Pagination/Pagination";
import {DeleteOutlined, EditOutlined} from "@material-ui/icons";
import {useTranslation} from "react-i18next";
import {fetchSupplierList, removeSupplier} from "../actions";

const SupplierList = () => {

    const { t } = useTranslation();

    const [supplier, setSupplier] = useState();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deletingId, setDeletingId] = useState();
    const [sort, setSort] = useState();
    const [text, setText] = useState();

    const isLoading = useSelector(state => state.get("supplier").isLoading);
    const supplierList = useSelector(state => state.get("supplier").list);
    const page = useSelector(state => state.get("supplier").page);
    const size = useSelector(state => state.get("supplier").size);
    const total = useSelector(state => state.get("supplier").total);
    const dispatch = useDispatch();

    const updateList = () => {
        dispatch(fetchSupplierList({page, size, sort, search: text}))
    }

    useEffect(() => {
        updateList()
    }, [sort, text])

    const formatAddress = (region, city, address) => {
        let r = region ? `${region.nameRu},` : '';
        let c = city ? `${city.nameRu},` : '';
        let a = address ? address : '';
        return `${r}${c}${a}`;
    }

    let list = supplierList.map(value => ({
        id: value.id,
        name: value.name,
        address: formatAddress(value.region, value.city, value.address),
        contactPerson: value.contactPerson || 'Не установлено!',
        phone: value.phone || '',
        operations: (
            <Grid container direction='row' justify='center'>
                <Grid item>
                    <Tooltip title='Изменить'>
                        <IconButton color='primary' onClick={() => {
                            supplierList.forEach(item => {
                                if (item.id === value.id) {
                                    setSupplier(item);
                                    setDialogOpen(true);
                                }
                            })
                        }}>
                            <EditOutlined />
                        </IconButton>
                    </Tooltip>
                </Grid>
                <Grid item style={{marginLeft: 5}}>
                    <Tooltip title='Удалить'>
                        <IconButton color='secondary' onClick={() => {
                            setDeletingId(value.id)
                            setDeleteDialogOpen(true)
                        }}>
                            <DeleteOutlined />
                        </IconButton>
                    </Tooltip>
                </Grid>
            </Grid>
        )
    }))

    

    return (
        <Grid container style={{height: '100%'}}>
            <SupplierAddEditDialog
                current={supplier}
                open={dialogOpen}
                onDialogClose={success => {
                    console.log('ondialog close', success)
                    if (success) {
                        dispatch(fetchSupplierList({page, size, sort}))
                    }
                    setDialogOpen(false);
                    setSupplier(undefined);
                }}
            />
            <QuestionDialog
                open={deleteDialogOpen}
                onClose={() => {
                    setDeletingId(undefined);
                    setDeleteDialogOpen(false);
                }}
                title='Удаление'
                message='Вы действительно хотите удалить?'
                onPositive={() => {
                    dispatch(removeSupplier(deletingId, () => {
                        dispatch(fetchSupplierList({page, size, sort}))
                    }))
                    setDeleteDialogOpen(false);
                }}
                onNegative={() => {
                    setDeleteDialogOpen(false);
                }}
            />
            <Grid container direction="column">
                <Typography style={{fontWeight: 'bold', fontSize: 18, marginTop: 20}}> Поставщики </Typography>
                <Paper style={{marginTop: 15, padding: 15, height: 'calc(100% - 130px)', overflow: 'auto'}}>
                    <Grid item xs={5}>
                        <SearchTextField
                            onChange={(text) => {
                                setText(text)

                            }}
                        />
                    </Grid>
                    <Grid item style={{marginTop: 30}}>
                        <Table
                            onAction={(selected, action) => {
                                if (action === 'edit') {
                                    supplierList.forEach(item => {
                                        if (item.id === selected.id) {
                                            setSupplier(item);
                                            setDialogOpen(true);
                                        }
                                    })
                                } else {
                                    setDeletingId(selected.id);
                                    setDeleteDialogOpen(true);
                                }
                            }}
                            order={true}
                            page={page}
                            size={size}
                            headers={[
                                {
                                    content: 'Наименование',
                                    key: 'name',
                                    sort: true
                                },
                                {
                                    content: 'Адрес',
                                    key: 'address',
                                    sort: false,
                                    render: row => formatAddress(row.region, row.city, row.address)
                                },
                                {
                                    content: 'Контактное лицо',
                                    key: 'contactPerson',
                                    sort: true
                                },
                                {
                                    content: 'Контакты',
                                    key: 'phone',
                                    sort: true
                                },
                                {
                                    content: 'Операции',
                                    key: 'operations',
                                    sort: false
                                }
                            ]}
                            data={list}
                            sort={(index, order) => {
                                setSort({
                                    col: index,
                                    order
                                })


                            }}
                            isLoading={isLoading}
                        />
                    </Grid>
                </Paper>
                <Grid container direction="row" style={{marginTop: 20, paddingRight: 20}}>
                    <Grid item style={{flex: 1}}>
                        <Pagination
                            disabled={isLoading}
                            onPageChange={page => {
                                dispatch(fetchSupplierList({page, size, sort, search: text}))
                            }}

                            pagesCount={total}
                            current={page}
                            size={size}
                            onSizeChange={(size) => {
                                dispatch(fetchSupplierList({page, size, sort, search: text}))
                            }}
                        />
                    </Grid>
                    <Grid item>
                        <Tooltip title={'Добавить поставщика'} arrow>
                            <Button variant={'outlined'} color='primary' onClick={() => {
                                setSupplier(undefined);
                                setDialogOpen(true)
                            }}><AddIcon/></Button>
                        </Tooltip>
                    </Grid>

                </Grid>
            </Grid>
        </Grid>
    )
}

export default SupplierList
