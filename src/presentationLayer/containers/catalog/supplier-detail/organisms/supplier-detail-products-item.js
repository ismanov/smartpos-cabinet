import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import * as actions from "../actions";

import { FormControl, IconButton, InputLabel, MenuItem, OutlinedInput, Select, TextField } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import {
  defineSelectedUnitParams
} from "../../supplier/organisms/supplier-catalog-offer-details";
import { formatPriceProduct } from "../../../../../utils/format";
import { getBaseUnitParams } from "../../../../../utils/getBaseUnitParams";
import withNotification from "../../../../hocs/withNotification/WithNotification";

export const SupplierDetailProductsItem = withNotification( (props) => {
  const dispatch = useDispatch();

  const { selectedProducts, product, pageSize, pageNumber, index } = props;

  const baseUnit = getBaseUnitParams(product.units);

  const [ productFields, setProductFields ] = useState({
    selectedUnit: baseUnit.unit.id,
    productCount: baseUnit.minOrder
  });
  const [ fieldsErrors, setFieldsErrors ] = useState({});
  const [ loading, setLoading ] = useState(false);

  const {
    minOrder: currentUnitMinOrder,
    unit: currentUnit,
    price: currentUnitPrice,
  } = defineSelectedUnitParams(product.units, productFields.selectedUnit);

  let successAddedProduct;

  useEffect(() => {
    if (loading) {
      successAddedProduct = setTimeout(() => {
        props.success("Товар добавлен");
        setLoading(false);
      }, 700);
    }

    return () => {
      clearTimeout(successAddedProduct);
    }
  }, [loading]);

  const onUnitChange = (e) => {
    const unitId = e.target.value;

    setProductFields({
      selectedUnit: unitId,
      productCount: defineSelectedUnitParams(product.units, unitId).minOrder,
    })
  };

  const onProductCountChange = (e) => {
    setProductFields({
      ...productFields,
      productCount: e.target.value.replace(/[^0-9]/g, '')
    })
  };

  const validateForm = () => {
    const minOrderMessage = `Мин. заказ ${currentUnitMinOrder}`;
    const notFilledMessage = "Не заполнено поле";

    const errors = {};

    if (!productFields.productCount || productFields.productCount === 0) errors.productCount = notFilledMessage;
    if (productFields.productCount < currentUnitMinOrder) errors.productCount = minOrderMessage;

    return errors;
  };

  const onProductAdd = () => {
    const errors = validateForm();

    if (Object.keys(errors).length) {
      setFieldsErrors(errors);
      return;
    }

    setFieldsErrors({});

    let hasSame = false;

    const list = selectedProducts.map((item) => {
      if (item.id === product.id && defineSelectedUnitParams(item.units, item.selectedUnit).id === defineSelectedUnitParams(item.units, productFields.selectedUnit).id) {
        hasSame = true;

        return {
          ...item,
          productCount: Number(productFields.productCount) + Number(item.productCount)
        }
      }

      return item;
    });

    if (!hasSame) {
      list.push({
        ...product,
        ...productFields
      });
    }

    dispatch(
      actions.addSelectedProductsAction(list)
    );

    setLoading(true);
  };

  return (
    <div className="supplier-detail__products__list__item">
      <div className="supplier-detail__products__list__item-name">
        {(pageSize * pageNumber) + index + 1}. {product.name}
      </div>
      <div className="supplier-detail__products__list__item-units">
        <FormControl fullWidth variant='outlined' style={{padding: 0}}>
          <InputLabel>Ед. изм</InputLabel>
          <Select
            input={<OutlinedInput labelWidth={90} />}
            value={productFields.selectedUnit}
            onChange={onUnitChange}
          >
            {product.units.map((item) => <MenuItem value={item.unit.id} key={item.unit.id}>{item.unit.description}</MenuItem>)}
          </Select>
        </FormControl>
      </div>
      <div className={`supplier-detail__products__list__item-count ${fieldsErrors.productCount ? "form-field-error": ""}`}>
        <TextField
          label="Кол-во"
          variant="outlined"
          value={productFields.productCount ? productFields.productCount : ""}
          onChange={onProductCountChange}
        />
        {fieldsErrors.productCount !== "" && <div className="form-field-note">{fieldsErrors.productCount}</div>}
      </div>
      <div className="supplier-detail__products__list__item-price">
        <div>Цена за 1 {currentUnit.name}: {formatPriceProduct(currentUnitPrice)} сум</div>
        <div>{product.vatRate ? `НДС: ${product.vatRate} %` : "Без НДС"}</div>
        <div>Мин. заказ: {currentUnitMinOrder ? currentUnitMinOrder : "1"}</div>
      </div>
      <div className="supplier-detail__products__list__item-total">
        Сумма: {formatPriceProduct(currentUnitPrice * Number(productFields.productCount))} сум
      </div>
      <div className="supplier-detail__products__list__item-button">
        <div className="primary-btn-wr">
          <IconButton disabled={loading} onClick={onProductAdd}>
            <Add />
          </IconButton>
        </div>
      </div>
    </div>
  )
});