import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import * as actions from "../actions";

import {
  CircularProgress,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField
} from "@material-ui/core";
import { Close, Edit, Check } from "@material-ui/icons";
import {
  defineSelectedUnitParams
} from "../../supplier/organisms/supplier-catalog-offer-details";
import { formatPriceProduct } from "../../../../../utils/format";

export const SupplierDetailProductsSelectedItems = ({ selectedProducts, product, index }) => {
  const dispatch = useDispatch();

  const [ productFields, setProductFields ] = useState({
    selectedUnit: product.selectedUnit,
    productCount: product.productCount
  });
  const [ fieldsErrors, setFieldsErrors ] = useState({});

  const [ loading, setLoading ] = useState(false);
  const [ editMode, setEditMode ] = useState(false);

  const {
    minOrder: currentUnitMinOrder,
    unit: currentUnit,
    price: currentUnitPrice,
  } = defineSelectedUnitParams(product.units, productFields.selectedUnit);

  useEffect(() => {
    if (product.productCount !== productFields.productCount) {
      setProductFields({
        selectedUnit: product.selectedUnit,
        productCount: product.productCount
      });
    }
  }, [product.productCount]);

  useEffect(() => {
    let successAddedProduct;

    if (loading) {
      successAddedProduct = setTimeout(() => {
        setLoading(false);
        setEditMode(false);
      }, 700)
    }

    return () => {
      clearTimeout(successAddedProduct);
    }
  }, [loading]);

  const onUnitChange = (e) => {
    const unitId = e.target.value;

    setProductFields({
      selectedUnit: unitId,
      productCount: defineSelectedUnitParams(product.units, unitId).minOrder
    })
  };

  const onProductCountChange = (e) => {
    setProductFields({
      ...productFields,
      productCount: e.target.value.replace(/[^0-9]/g, '')
    })
  };

  const validateForm = () => {
    const minOrderMessage = `??????. ?????????? ${currentUnitMinOrder}`;
    const notFilledMessage = "???? ?????????????????? ????????";

    const errors = {};

    if (!productFields.productCount || productFields.productCount === 0) errors.productCount = notFilledMessage;
    if (productFields.productCount < currentUnitMinOrder) errors.productCount = minOrderMessage;

    return errors;
  };

  const onProductEdit = () => {
    const errors = validateForm();

    if (Object.keys(errors).length) {
      setFieldsErrors(errors);
      return;
    }

    setFieldsErrors({});

    setLoading(true);

    let mySelArr = [...selectedProducts];

    selectedProducts.forEach((item) => {
      let currentItem = item;
      const currentItemSelectedUnitId = defineSelectedUnitParams(currentItem.units, currentItem.selectedUnit).id;
      const editableProductSelectedUnitId = defineSelectedUnitParams(product.units, productFields.selectedUnit).id;
      const defaultEditableProductSelectedUnitId = defineSelectedUnitParams(product.units, product.selectedUnit).id;

      if (currentItem.id === product.id) {
        if (currentItemSelectedUnitId === editableProductSelectedUnitId && currentItemSelectedUnitId !== defaultEditableProductSelectedUnitId) {
          mySelArr = selectedProducts.filter((filtredProduct) => defineSelectedUnitParams(filtredProduct.units, filtredProduct.selectedUnit).id !== defaultEditableProductSelectedUnitId); // remove editableProduct

          mySelArr = mySelArr.map((mappedProduct) => {
            let currentMappedProduct = {...mappedProduct};

            if (defineSelectedUnitParams(currentMappedProduct.units, currentMappedProduct.selectedUnit).id === editableProductSelectedUnitId) {
              currentMappedProduct = {
                ...product,
                ...productFields,
                productCount: currentMappedProduct.productCount + productFields.productCount
              }
            }

            return currentMappedProduct;
          }); // concat editableProduct with same product
        } else if (currentItemSelectedUnitId === defaultEditableProductSelectedUnitId) { // if changed editableProduct
          mySelArr = mySelArr.map((mappedProduct) => {
            let currentMappedProduct = {...mappedProduct};

            if (defineSelectedUnitParams(currentMappedProduct.units, currentMappedProduct.selectedUnit).id === defaultEditableProductSelectedUnitId) {
              currentMappedProduct = {
                ...product,
                ...productFields
              }
            }

            return currentMappedProduct;
          }) // change params of editableProduct
        }
      }
    });

    dispatch(
      actions.addSelectedProductsAction(mySelArr)
    );
  };

  const onDeleteProduct = () => {
    const list = selectedProducts.filter((item) => defineSelectedUnitParams(item.units, item.selectedUnit).id !== defineSelectedUnitParams(product.units, product.selectedUnit).id);

    if (!list.length) {
      dispatch(
        actions.showSelectedProductsAction(false)
      )
    }

    dispatch(
      actions.addSelectedProductsAction(list)
    );
  };

  return (
    <div className="supplier-detail__products__list__item">
      {loading && <div className="abs-loader">
        <CircularProgress color='primary'/>
      </div>}
      <div className="supplier-detail__products__list__item-name">
        {index + 1}. {product.name}
      </div>
      <div className="supplier-detail__products__list__item-units">
        <FormControl fullWidth variant='outlined' style={{padding: 0}} disabled={!editMode}>
          <InputLabel>????. ??????</InputLabel>
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
          disabled={!editMode}
          label="??????-????"
          variant="outlined"
          value={productFields.productCount ? productFields.productCount : ""}
          onChange={onProductCountChange}
        />
        {fieldsErrors.productCount !== "" && <div className="form-field-note">{fieldsErrors.productCount}</div>}
      </div>
      <div className="supplier-detail__products__list__item-price">
        <div>???????? ???? 1 {currentUnit.name}: {formatPriceProduct(currentUnitPrice)} ??????</div>
        <div>{product.vatRate ? `??????: ${product.vatRate} %` : "?????? ??????"}</div>
        <div>??????. ??????????: {currentUnitMinOrder ? currentUnitMinOrder : "1"}</div>
      </div>
      <div className="supplier-detail__products__list__item-total">
        ??????????: {formatPriceProduct(currentUnitPrice * Number(productFields.productCount))} ??????
      </div>
      <div className="supplier-detail__products__list__item-button">
        <div className="primary-btn-wr">
          {editMode ?
            <IconButton onClick={onProductEdit}>
              <Check />
            </IconButton>
            :
            <IconButton onClick={() => setEditMode(true)}>
              <Edit />
            </IconButton>
          }
        </div>
        <div className="delete-btn-wr">
          <IconButton onClick={onDeleteProduct}>
            <Close />
          </IconButton>
        </div>
      </div>
    </div>
  )
};