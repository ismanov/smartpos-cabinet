import React, {useEffect, useState} from 'react';
import {
    Grid,
    Table,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
    IconButton
} from '@material-ui/core';
import { DeleteOutlined, AddOutlined } from '@material-ui/icons';
import SelectBox from "../../../../components/Select";
import { useTranslation } from "react-i18next";
import LogicContainer from "#businessLayer";
import * as Yup from "yup";
import {Field, Form, Formik} from "formik";
import NumberTextField from "../../../../components/Textfields/NumberTextField";
import ProductSelectBox from "../../../components/productSelector";

const AdjustmentProductList = props =>  {

    const [units, setUnits] = useState([]);
    const [rows, setRows] = useState([]);

    const { t } = useTranslation();

    useEffect(() => {
        props.onProductListChanged && props.onProductListChanged(rows);
    }, [rows]);

    return (
        <Grid container alignItems='flex-start'>
            <Grid item style={{width: '100%'}}>
                <Formik
                    initialValues={{
                        product: undefined,
                        qty: 1,
                        unit: undefined
                    }}
                    validationSchema={() => Yup.object().shape({
                        product: Yup.object().shape({
                            id: Yup.number().required(),
                            name: Yup.string().required()
                        }).required(),
                        qty: Yup.number().min(1).required(),
                        unit: Yup.object().shape({
                            id: Yup.number().required(),
                            name: Yup.string().required()
                        }).required()
                    })}
                    onSubmit={(values, { resetForm }) => {
                        setRows([...rows, {...values}])
                        resetForm()
                    }}>
                    {({isValid, dirty, handleSubmit}) => (
                        <Form>
                            <Table style={{height: '100%'}}>
                                <TableHead style={{backgroundColor: '#eee', color: '#555'}}>
                                    <TableCell style={{fontWeight: 'bold', padding: 15, margin: 0}}>
                                        {t("adjustmentProductAdd.productName")}
                                    </TableCell>
                                    <TableCell style={{fontWeight: 'bold', padding: 0}}>
                                        {t("common.unit")}
                                    </TableCell>
                                    <TableCell style={{ fontWeight: 'bold', padding: 0 }}>
                                        {t("common.qty")}
                                    </TableCell>
                                    <TableCell style={{fontWeight: 'bold', padding: 0}}>
                                        {t("adjustmentProductAdd.operations")}
                                    </TableCell>
                                </TableHead>
                                <TableBody>
                                    {
                                        rows.map((product, index) => {
                                            return (
                                                <TableRow key={index} style={{padding: 0}}>
                                                    <TableCell style={{padding: 0}}>
                                                        <div>
                                                            {product.product ? product.product.name : "-"}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell style={{padding: 0}}>
                                                        <div style={{width: 100}}>
                                                            {product.unit ? product.unit.name : "-"}
                                                        </div>
                                                    </TableCell>

                                                    <TableCell style={{padding: 0}}>
                                                        <div style={{width: 100}}>
                                                            {product.qty || "-"}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell style={{padding: 0}}>
                                                        <IconButton onClick={() => {
                                                            let list = [...rows];
                                                            list.splice(index, 1);
                                                            setRows([...list]);                                                            
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
                                                <Field name="product">
                                                    { ({field: {value}, form: {setFieldValue}}) => {
                                                        return (
                                                            <ProductSelectBox
                                                                branchId={props.branchId}
                                                                onProductSelect={product => {
                                                                    if (product) {
                                                                        setFieldValue("product", product);
                                                                        setFieldValue("unit", undefined);
                                                                        LogicContainer
                                                                            .units
                                                                            .fetchProductUnit(props.branchId, product.id)
                                                                            .then(response => {
                                                                                setUnits(response.data);
                                                                            })
                                                                            .catch(console.log)
                                                                    } else {
                                                                        setFieldValue("unit", undefined);
                                                                        setUnits([]);
                                                                        setFieldValue("product", undefined);
                                                                    }

                                                                }}
                                                                value={value || {name: ""}}
                                                                placeholder={t("adjustment.select_product")}

                                                            />
                                                        )
                                                    }}
                                                </Field>
                                            </div>
                                        </TableCell>
                                        <TableCell style={{width: '10%', margin: 0}}>
                                            <Field name="unit">
                                                { ({field: {value}, form: {setFieldValue, errors}}) => {
                                                    return (
                                                        <SelectBox
                                                            label={t("common.unit")}
                                                            data={units}
                                                            itemKey='id'
                                                            itemValue='name'
                                                            error={errors.unit}
                                                            value={value ? value.id : ''}
                                                            onChange={event => {
                                                                let id = event.target.value;
                                                                let found = units.find(u => u.id === id);
                                                                setFieldValue("unit", found);
                                                            }}
                                                        />
                                                    )
                                                }}

                                            </Field>
                                        </TableCell>

                                        <TableCell style={{width: '10%', margin: 0}}>
                                            <Field name="qty">
                                                {({field: {value}, form: {setFieldValue, errors}}) => {
                                                    return (
                                                        <NumberTextField
                                                            fullWidth
                                                            variant='outlined'
                                                            label={t("adjustment.qty")}
                                                            value={value}
                                                            error={errors.qty}
                                                            onChange={event => {
                                                                setFieldValue("qty", event.target.value)
                                                            }}
                                                        />
                                                    )
                                                }}
                                            </Field>
                                        </TableCell>
                                        <TableCell
                                            style={{width: '5%', padding: '10px 10px 10px 0px'}}>
                                                <IconButton
                                                    disabled={!isValid || !dirty}
                                                    onClick={handleSubmit}
                                                >
                                                    <AddOutlined color='primary'/>
                                                </IconButton>
                                        </TableCell>
                                    </TableRow>

                                </TableBody>
                            </Table>
                        </Form>
                    )}
                </Formik>
            </Grid>
        </Grid>
    );
};

export default AdjustmentProductList;
