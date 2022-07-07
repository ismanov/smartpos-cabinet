import React, { useState, useEffect } from "react";

import * as orderingActions from "../../../warehouse/orders/ordering/actions";

import FormControl from "@material-ui/core/FormControl";
import { InputLabel, OutlinedInput, Select, TextField } from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";
import { ShopBuySvg } from "../../../../../assets/svg/svg-icons";

import { formatPriceProduct } from "../../../../../utils/format";
import { getBaseUnitParams } from "../../../../../utils/getBaseUnitParams";

export const defineSelectedUnitParams = (units, selectedUnitId) => {
  const selectedUnitParams = units.filter((unit) => unit.unit.id === selectedUnitId);

  return selectedUnitParams[0];
};

export const SupplierCatalogOfferDetails = (props) => {
  const { supplierDetails, dispatch, history, orderingData } = props;

  const { product, branch, deliveryTypes } = supplierDetails;

  const baseUnit = getBaseUnitParams(product.units);

  const [ productFields, setProductFields ] = useState({
    selectedUnit: baseUnit.unit.id,
    productCount: baseUnit.minOrder
  });

  const [ fieldsErrors, setFieldsErrors ] = useState({});

  const {
    unit,
    price,
    minOrder
  } = defineSelectedUnitParams(product.units, productFields.selectedUnit);

  const onUnitChange = (e) => {
    const unitId = e.target.value;

    setProductFields({
      selectedUnit: unitId,
      productCount: defineSelectedUnitParams(product.units, unitId).minOrder
    })
  };

  const onProductCountChange = (e) => {
    const productCount = e.target.value.replace(/[^0-9]/g, '');

    setProductFields({
      ...productFields,
      productCount
    })
  };

  const validateForm = () => {
    const minOrderMessage = `Мин. заказ ${minOrder ? minOrder : "1"}`;
    const notFilledMessage = "Не заполнено поле";

    const errors = {};

    if (!productFields.productCount) errors.productCount = notFilledMessage;
    if (productFields.productCount < minOrder || productFields.productCount === 0) errors.productCount = minOrderMessage;

    return errors;
  };

  const onAddOrderingProduct = () => {
    const errors = validateForm();

    if (Object.keys(errors).length) {
      setFieldsErrors(errors);
      return;
    }

    setFieldsErrors({});

    const list = orderingData.list.filter((item) => item.id !== product.id);

    list.push({
      ...product,
      ...productFields
    });

    const data = {
      list,
      filterProps: {
        branch: {
          label: branch.name,
          value: branch.id
        },
        supplier: {
          label: supplierDetails.name,
          value: supplierDetails.id
        }
      }
    };

    dispatch(
      orderingActions.addOrderingProductAction(data)
    );

    history.push('/main/warehouse/orders/ordering');
  };

  return (
    <div className="supplier-catalog__offers__details">
      <div className="supplier-catalog__offers__details-item">Минимальный заказ: {minOrder}/{unit.name}</div>
      <div className="supplier-catalog__offers__details-item">{product.vatRate ? `НДС: ${product.vatRate} %` : "Без НДС"}</div>
      <div className="supplier-catalog__offers__details-item">
        Способы доставки: {deliveryTypes.map((item, index) =>
          <span key={item.code}>{item.nameRu}{deliveryTypes.length > index + 1 && ", "}</span>
        )}
      </div>
      <div className="supplier-catalog__offers__details-form">
        <div className="supplier-catalog__offers__details-form-field">
          <FormControl variant="outlined" color="primary">
            <InputLabel>Ед. изм</InputLabel>
            <Select
              input={<OutlinedInput labelWidth={60} />}
              value={productFields.selectedUnit}
              onChange={onUnitChange}
            >
              {product.units.map((item) => <MenuItem value={item.unit.id} key={item.unit.id}>{item.unit.description}</MenuItem>)}
            </Select>
          </FormControl>
        </div>
        <div className={`supplier-catalog__offers__details-form-field ${fieldsErrors.productCount ? "form-field-error": ""}`}>
          <TextField
            label="Кол-во"
            variant="outlined"
            value={productFields.productCount ? productFields.productCount : ""}
            onChange={onProductCountChange}
          />
          {fieldsErrors.productCount !== "" && <div className="form-field-note">{fieldsErrors.productCount}</div>}
        </div>
        <div className="supplier-catalog__offers__details-form-field button-field">
          <button className="buy-button" onClick={onAddOrderingProduct}>
            <ShopBuySvg />
          </button>
        </div>
      </div>
      <div className="supplier-catalog__offers__details-item-total">
        <div className="supplier-catalog__offers__details-item-total-title">Итого:</div>
        <div className="supplier-catalog__offers__details-item-total-price">
          {formatPriceProduct(price * Number(productFields.productCount))} сум
        </div>
      </div>
    </div>
  )
};