import React, { useState, useEffect} from 'react';
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
import NumberTextField from '../../../../components/Textfields/NumberTextField';
import SelectBox from "../../../../components/Select";
import { useTranslation } from "react-i18next";
import Logic from '#businessLayer';
import axios from 'axios';

const CancelToken = axios.CancelToken;
var source = CancelToken.source();


const ProductAddEditTable = props => {

    const [rows, setRows] = useState([]);
    const [product, setProduct] = useState();
    const [productError, setProductError] = useState(false);
    const [qty, setQty] = useState();
    const [qtyError, setQtyError] = useState();
    const [cost, setCost] = useState();
    const [selectedProduct, setSelectedProduct] = useState();
    const [unit, setUnit] = useState();
    const [unitError, setUnitError] = useState(false);
    const [productList, setProductList] = useState([]);
    const [unitList, setUnitList] = useState();
    const [isSearchLoading, setIsSearchLoading] = useState(false);

    const {t} = useTranslation();


    useEffect(() => {
        setRows(props.products ? [...props.products] : [])
    }, [props.products])

    
    const addIncomeProduct = () => {

        if (!product) {
            setProductError(true)
            return
        }
        if (!unit) {
            setUnitError(true);
            return
        };
        if (!qty || Number(qty) === 0) {
            setQtyError('Введите количество')            
            return
        }
        let r = [{
            product,
            costPrice: cost,
            totalCost: Number(cost || 0) * Number(qty || 0),
            qty,
            unit
        }, ...rows]
        setRows(r)
        props.onProductListChanged && props.onProductListChanged(r)
        setUnitList([])
        setProduct(undefined);
        setProductError(false);
        setQtyError(undefined);
        setQty(undefined);
        setCost(undefined);
        setSelectedProduct(undefined);
        setUnit(undefined);
        setUnitError(false);        
    }

    return (
        <Grid container alignItems='flex-start'>
            <Table>
                <TableHead style={{backgroundColor: '#eee', color: '#555'}}>
                    <TableCell style={{fontWeight: 'bold', padding: 15, margin: 0}}>
                        {t("orderAdd.productName")}
                    </TableCell>
                    <TableCell style={{fontWeight: 'bold', padding: 0}}>
                        {t("common.unit")}
                    </TableCell>
                    <TableCell style={{fontWeight: 'bold', padding: 0}}>
                        {t("orderAdd.totalCount")}
                    </TableCell>
                    <TableCell style={{fontWeight: 'bold', padding: 0}}>
                        {t("orderAdd.price")}
                    </TableCell>
                    <TableCell style={{fontWeight: 'bold', padding: 0}}>
                        {t("orderAdd.summa")}
                    </TableCell>
                    <TableCell style={{fontWeight: 'bold', padding: 0}}>
                        {t("orderAdd.operations")}
                    </TableCell>
                </TableHead>
                <TableBody>
                    {
                        rows && rows.map((product, index) => {
                            return (
                                <TableRow key={`${index}`} style={{padding: 0}}>
                                    <TableCell style={{padding: 0}}>
                                        <div>
                                            {product.product.name}
                                        </div>
                                    </TableCell>
                                    <TableCell style={{padding: 0}}>
                                        <div>
                                            {product.unit ? product.unit.name : product.unitName || '-'}
                                        </div>
                                    </TableCell>
                                    <TableCell style={{padding: 0}}>
                                        <div style={{width: 100}}>
                                            {
                                                isNaN(Number(product.qty)) ? 0 : Number(product.qty).format(2)
                                            }
                                        </div>
                                    </TableCell>
                                    <TableCell style={{padding: 0}}>
                                        <div>
                                            {product.costPrice || 0}
                                        </div>
                                    </TableCell>
                                    <TableCell style={{padding: 0}}>
                                        <div>
                                            { isNaN(product.totalCost) ? 0 : Number(product.totalCost).format(2)}
                                        </div>
                                    </TableCell>
                                    <TableCell style={{padding: 0}}>
                                        <IconButton onClick={() => {
                                            let list = [...rows]
                                            let item = list[index]
                                            if (item.incomedQty > 0) {
                                                props.errorAlert && props.errorAlert(t("orderAdd.some_error"))
                                            } else {
                                                list.splice(index, 1)                                                
                                                setRows(list);                                                
                                                props.onProductListChanged && props.onProductListChanged(list)
                                            }
                                        }}>
                                            <DeleteOutlined color='inherit'/>
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            )
                        })
                    }

                    <TableRow style={{marginTop: 5}}>
                        <TableCell variant='body' style={{width: '30%', padding: '10px 15px'}}>
                            <div>
                                <Select
                                    placeholder={t("orderAdd.select_product")}
                                    onChange={id => {
                                        let found = productList.find(item => item.id === id.value)
                                        if (found) {
                                            setProduct({...found});
                                            setSelectedProduct(id);
                                            setProductError(false);
                                            Logic
                                                .resource
                                                .fetchUnitsForProductId(id.value, props.branchId)                                            
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
                                                .fetchProductListForKeyword({search: input, withBalance: true, branchId: props.branchId}, source.token)                                            
                                                .then(response => {
                                                    setIsSearchLoading(false)
                                                    setProductList(response.data)
                                                })
                                            
                                        } else {
                                            setProductList([]);                                            
                                        }
                                    }}
                                    options={productList.map(item => ({label: `${item.name}; баркод: ${item.barcode}`, value: item.id}))}
                                    isClearable={true}
                                    isMulti={false}
                                    isSearchable={true}
                                    isLoading={isSearchLoading}
                                    noOptionsMessage={() => t("orderAdd.nothing_found")}
                                    loadingMessage={() => t("orderAdd.searching")}
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
                                        display: productError ? 'flex': 'none'
                                    }}
                                    >
                                    {t("orderAdd.select_product")}
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
                                value={unit ? unit.id : ''}
                                onChange={event => {
                                    let id = event.target.value;
                                    let found = unitList.find(u => u.id === id);
                                    setUnit(found);
                                    setUnitError(false);                                    
                                }}
                            />
                        </TableCell>
                        <TableCell style={{width: '10%', padding: '10px 10px 10px 0px', margin: 0}}>
                            <NumberTextField
                                fullWidth
                                variant='outlined'
                                label={t("orderAdd.totalCount")}
                                value={qty || ''}
                                error={qtyError && qtyError !== '' }
                                helperText={qtyError}
                                onChange={event => {
                                    setQty(event.target.value < 0 ? 0 : event.target.value);
                                    setQtyError('');                                    
                                }}
                            />
                        </TableCell>
                        <TableCell style={{width: '10%', padding: '10px 10px 10px 0px', margin: 0}}>
                            <NumberTextField
                                fullWidth
                                variant='outlined'
                                label={t("orderAdd.price")}
                                value={cost || ''}
                                error={qtyError && qtyError !== '' }
                                helperText={qtyError}
                                onChange={event => {
                                    setCost(event.target.value);                                    
                                }}
                            />
                        </TableCell>
                        <TableCell style={{width: '10%', padding: '10px 10px 10px 0px', margin: 0}}>
                            <TextField
                                variant='outlined'
                                fullWidth
                                placeholder={t("orderAdd.summa")}
                                value={(Number(qty) * Number(cost))}
                                type='number'
                                disabled={true}
                            />
                        </TableCell>
                        <TableCell style={{width: '5%', padding: '10px 10px 10px 0px'}}>
                            <IconButton onClick={addIncomeProduct}>
                                <AddOutlined color='primary'/>
                            </IconButton>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </Grid>
    )

}


export default ProductAddEditTable;
