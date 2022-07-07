import React, {useState, useEffect} from 'react';
import {
    Grid,
    TextField,
    Table,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
    IconButton,
    Typography
} from '@material-ui/core';
import {
    DeleteOutlined,
    AddOutlined
} from '@material-ui/icons';
import Select from 'react-select';
import SelectBox from "../../../../components/Select";
import {useTranslation} from "react-i18next";

import Logic from '#businessLayer';
import axios from 'axios';

const CancelToken = axios.CancelToken;
var source = CancelToken.source();


const TransferProductAddTable = props => {

    const [productList, setProductList] = useState([]);
    const [isSearchLoading, setIsSearchLoading] = useState(false);
    const [unitList, setUnitList] = useState([]);

    
    const [rows, setRows] = useState([]);
    const [product, setProduct] = useState();
    const [productError, setProductError] = useState(false);
    const [qtyError, setQtyError] = useState(undefined);
    const [qty, setQty] = useState();    
    const [selectedProduct, setSelectedProduct] = useState();
    const [unit, setUnit] = useState();
    const [unitError, setUnitError] = useState(false);
    
    const { t } = useTranslation();

    useEffect(() => {        
        if (props.products) {
            setRows([...props.products])
        }        
    }, [props.products])

    useEffect(() => {
        props.onProductListChanged && props.onProductListChanged([...rows])
    }, [rows])

    return (
        <Grid container alignItems='flex-start'>
            <Table>
                <TableHead style={{backgroundColor: '#eee', color: '#555', marginTop: 15}}>
                    <TableCell style={{fontWeight: 'bold', padding: 15, margin: 0}}>
                        {t("transfers.productName")}
                    </TableCell>
                    <TableCell style={{fontWeight: 'bold', padding: 0}}>
                        {t("common.unit")}
                    </TableCell>
                    <TableCell style={{fontWeight: 'bold', padding: 0}}>
                        {t("transfers.order_qty")}

                    </TableCell>
                    <TableCell style={{fontWeight: 'bold', padding: 0}}>
                        {t("transfers.balance")}
                    </TableCell>
                    <TableCell style={{fontWeight: 'bold', padding: 0}}>
                        {t("transfers.operations")}
                    </TableCell>
                </TableHead>
                <TableBody>
                    {
                        rows && rows.map((product, index) => {
                            return (
                                <TableRow key={index} style={{padding: 0}}>
                                    <TableCell style={{padding: 0}}>
                                        <div>
                                            {product.product.name}
                                        </div>
                                    </TableCell>
                                    <TableCell style={{padding: 0}}>
                                        <div style={{width: 100}}>
                                            <TextField
                                                variant='outlined'
                                                fullWidth
                                                placeholder={t("common.qty")}
                                                value={parseFloat(product.qty || 0)}
                                                onChange={e => {
                                                    let list = [...rows]
                                                    if (product.incomedQty && parseFloat(e.target.value) < product.incomedQty) {
                                                        list[index].qty = product.incomedQty
                                                        props.errorAlert && props.errorAlert(`${t("transfers.qty_error")}: ${product.incomedQty}`)
                                                    } else {
                                                        list[index].qty = parseFloat(e.target.value)
                                                    }
                                                    setRows(list);
                                                }}
                                                type='number'
                                                helperText={qtyError}
                                                error={qtyError && qtyError !== '' }
                                                inputProps={{
                                                    style:{
                                                        height: 20
                                                    }
                                                }}
                                                style={{
                                                    marginTop: 5,
                                                    marginBottom: 5
                                                }}
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell style={{padding: 0}}>
                                        <div>
                                            {product.unit ? product.unit.name : '-'}
                                        </div>
                                    </TableCell>
                                    <TableCell style={{padding: 0}}>
                                        <div>
                                            { product.product ? product.product.currBalance || 0 : 0}
                                        </div>
                                    </TableCell>

                                    <TableCell style={{padding: 0}}>
                                        <IconButton onClick={() => {
                                            let list = [...rows]
                                            let item = list[index]
                                            if (item.incomedQty > 0) {
                                                props.errorAlert && props.errorAlert(t("transfers.order_error"))
                                            } else {
                                                list.splice(index, 1)
                                                setRows(list);                                                    
                                            }
                                        }}>
                                            <DeleteOutlined color='inherit'/>
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            )
                        })
                    }
                    {props.isAdding ? (
                        <TableRow style={{marginTop: 5}}>
                            <TableCell variant='body' style={{width: '30%', padding: '10px 15px'}}>
                                <div>
                                    <Select
                                        placeholder={t("transfers.select_product")}
                                        onChange={id => {
                                            let found = productList.find(item => item.id === id.value);
                                            if (found) {
                                                setProduct({...found});
                                                setSelectedProduct(id);
                                                setProductError(false);
                                                Logic
                                                    .resource
                                                    .fetchUnitsForProductId(id.value, props.branchId, true)                                            
                                                    .then(response => { setUnitList(response.data) })                                                                       
                                            }
                                            if (!id) {
                                                setSelectedProduct(undefined);
                                                setProductError(false);
                                                setUnit(undefined);
                                                setUnitList([]);                                            
                                            }
                                        }}
                                        value={selectedProduct || ''}
                                        onInputChange={input => {
                                            setProductError(false);
                                            
                                            if (input.length >= 2) {
                                                setIsSearchLoading(true)
                                                Logic
                                                    .product
                                                    .fetchProductListForKeyword({search: input, branchId: props.branchId}, source.token)                                            
                                                    .then(response => {
                                                        
                                                        setIsSearchLoading(false)
                                                        setProductList(response.data)
                                                    })
                                            } else {
                                                setProductList([]);
                                            }
                                        }}
                                        options={productList.map(item => ({label: `${item.name}; ${t("transfers.barcode")}: ${item.barcode}`, value: item.id}))}
                                        isClearable={true}
                                        isMulti={false}
                                        isSearchable={true}
                                        isLoading={isSearchLoading}
                                        noOptionsMessage={() => t("transfers.nothing_found")}
                                        loadingMessage={() => t("transfers.searching")}
                                        styles={{
                                            control: styles => ({
                                                ...styles,
                                                width: '100%',
                                                height: 54
                                            })
                                        }}
                                    />
                                    <Typography
                                        color='secondary'
                                        variant='subtitle1'
                                        style={{
                                            fontSize: 12,
                                            display: productError === true ? 'flex': 'none'
                                        }}
                                    >
                                        {t("transfers.select_product")}
                                    </Typography>
                                </div>
                            </TableCell>
                            <TableCell style={{width: '10%', padding: '10px 10px 10px 0px', margin: 0}}>
                                <SelectBox
                                    label={t("common.unit")}
                                    data={unitList}
                                    itemKey='id'
                                    itemValue='name'
                                    error={unitError}
                                    value={unit ? unit.id : undefined}
                                    onChange={event => {
                                        let id = event.target.value;
                                        let found = unitList.find(u => u.id === id);
                                        setUnit(found);
                                        setUnitError(false);                                            
                                    }}
                                />
                            </TableCell>
                            <TableCell style={{width: '10%', padding: '10px 10px 10px 0px', margin: 0}}>
                                <TextField
                                    variant='outlined'
                                    fullWidth
                                    placeholder={t("transfers.total_qty")}
                                    value={parseFloat(qty)}
                                    onChange={e => {
                                        setQty(isNaN(Number(e.target.value)) || Number(e.target.value) < 0 ? 0 : e.target.value);
                                        setQtyError('');                                            
                                    }}
                                    type='number'
                                    helperText={qtyError}
                                    error={qtyError && qtyError !== '' }
                                />
                            </TableCell>
                            <TableCell style={{width: '10%', padding: '10px 10px 10px 0px', margin: 0}}>
                                <div>
                                    {unit ? unit.balance || 0 : 0}
                                </div>
                            </TableCell>
                            <TableCell style={{width: '5%', padding: '10px 10px 10px 0px'}}>
                                <IconButton onClick={() => {
                                    if (!product) {
                                        setProductError(true)                                        
                                        return
                                    }
                                    if (!unit) {
                                        setUnitError(true)                                            
                                        return
                                    }
                                    if (!qty || Number(qty) === 0) {
                                        setQtyError('Введите количество');                                            
                                        return
                                    }

                                    setRows([{
                                        product,
                                        qty,
                                        unit
                                    }, ...rows])

                                    setProduct(undefined);
                                    setProductError(false);
                                    setQtyError(undefined);
                                    setQty(undefined);
                                    setSelectedProduct(undefined);
                                    setUnit(undefined);
                                    setUnitError(false);
                                    setUnitList([]);                                        
                                }}>
                                    <AddOutlined color='primary'/>
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ) : undefined}
                </TableBody>
            </Table>
        </Grid>
    )    

};
export default TransferProductAddTable;