import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import * as actions from "../actions";

import debounce from "@material-ui/core/utils/debounce";
import { Check } from "@material-ui/icons";
import { FormControl, IconButton, InputLabel, MenuItem, OutlinedInput, Select, TextField } from "@material-ui/core";

import SelectLookup from "react-select";

import { formatPriceProduct } from "../../../../../../utils/format";
import {
  defineSelectedUnitParams
} from "../../../../catalog/supplier/organisms/supplier-catalog-offer-details";
import {selectStyles, selectTheme} from "../../../../../../utils/inputSelectOptions";

const updateFilterSearch = debounce((action) => {
  action();
}, 400);

export const AddNewProduct = () => {
  const orderingStore = useSelector(state => state.get("ordering"));
  const dispatch = useDispatch();

  const { productsItems } = orderingStore;

  const { ordering: orderingData, editingProducts } = orderingStore;

  const { list: productsList, filterProps } = orderingData;

  const [ currentProduct, setCurrentProduct ] = useState(null);
  const [ currentProductUnitParams, setCurrentProductUnitParams ] = useState({});
  const [ productFields, setProductFields ] = useState({});
  const [ fieldsErrors, setFieldsErrors ] = useState({});
  const [ searchLookUp, setSearchLookUp ] = useState(false);

  useEffect(() => {
    if (currentProduct) {
      setCurrentProduct(null);
      setProductFields({});
      setFieldsErrors({});
    }

    if (filterProps.branch) {
      dispatch(
        actions.getProductsItemsAction({
          companyId: filterProps.supplier.value,
          branchId: filterProps.branch.value
        })
      )
    } else {
      dispatch(
        actions.resetProductsItemsAction()
      )
    }
  }, [filterProps.supplier, filterProps.branch]);

  const onProductChange = (val) => {
    setProductFields({});
    setCurrentProduct(val);

    const edPr = {...editingProducts};
    if (val) {
      edPr["newProduct"] = 1;
    } else {
      delete edPr["newProduct"];
    }

    dispatch(
      actions.setEditingProductsAction(edPr)
    )
  };

  const onProductSearch = (value, e) => {
    if (e.action === "input-change") {
      setSearchLookUp(!!value);
      updateFilterSearch(() => {
        dispatch(
          actions.getProductsItemsAction({
            search: value,
            companyId: filterProps.supplier.value,
            branchId: filterProps.branch.value
          })
        )
      })
    }

    if (e.action === "menu-close" && searchLookUp) {
      setSearchLookUp(false);
      updateFilterSearch(() => {
        dispatch(
          actions.getProductsItemsAction({
            companyId: filterProps.supplier.value,
            branchId: filterProps.branch.value
          })
        )
      })
    }
  };

  const onUnitChange = (e) => {
    const unitId = e.target.value;

    setCurrentProductUnitParams(defineSelectedUnitParams(currentProduct.units, unitId));

    setProductFields({
      ...productFields,
      productCount: defineSelectedUnitParams(currentProduct.units, unitId).minOrder,
      selectedUnit: unitId
    })
  };

  const onCountChange = (e) => {
    const productCount = e.target.value.replace(/[^0-9]/g, '');

    let errors = {...fieldsErrors};

    setFieldsErrors(errors);

    setProductFields({
      ...productFields,
      productCount
    })
  };

  const validateForm = () => {
    const minOrderMessage = `Мин. заказ ${currentProductUnitParams.minOrder}`;
    const notFilledMessage = "Не заполнено поле";

    const errors = {};

    if (!productFields.productCount || productFields.productCount === "0") errors.productCount = notFilledMessage;
    if (productFields.productCount < currentProductUnitParams.minOrder) errors.productCount = minOrderMessage;

    return errors;
  };

  const onProductCreate = () => {
    const errors = validateForm();

    if (Object.keys(errors).length) {
      setFieldsErrors(errors);
      return;
    }

    let hasSame = false;

    const list = productsList.map((item) => {
      if (item.id === currentProduct.id && defineSelectedUnitParams(item.units, item.selectedUnit).id === defineSelectedUnitParams(currentProduct.units, productFields.selectedUnit).id) {
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
        ...currentProduct,
        ...productFields
      });
    }

    const data = {
      list,
      filterProps
    };

    dispatch(
      actions.addOrderingProductAction(data)
    );

    const edPr = {...editingProducts};
    delete edPr["newProduct"];

    dispatch(
      actions.setEditingProductsAction(edPr)
    );

    setCurrentProduct(null);
    setProductFields({});
    setFieldsErrors({});
  };

  return (
    <>
      <div className="ordering__products__item">
        <div className="ordering__products__item-field ordering__products__item-name lookup-field">
          <SelectLookup
            placeholder="Выберите товар"
            isDisabled={!filterProps.branch}
            onChange={onProductChange}
            value={currentProduct}
            onInputChange={onProductSearch}
            options={productsItems.list.map(item => ({...item, label: `${item.name}`, value: item.id}))}
            isClearable={true}
            isMulti={false}
            isSearchable={true}
            isLoading={productsItems.loading}
            noOptionsMessage={() => "Ничего не найдено!"}
            loadingMessage={() => "Идет поиск"}
            styles={selectStyles()}
            theme={selectTheme}
          />
        </div>
        <div className="ordering__products__item-field ordering__products__item-units">
          <FormControl fullWidth variant='outlined' style={{padding: 0}} disabled={!currentProduct}>
            <InputLabel>Ед. изм</InputLabel>
            <Select
              input={<OutlinedInput labelWidth={90}/>}
              value={productFields.selectedUnit !== undefined ? productFields.selectedUnit : ""}
              onChange={onUnitChange}
            >
              {currentProduct && currentProduct.units.map((item) => {
                return <MenuItem value={item.unit.id} key={item.unit.id}>{item.unit.description}</MenuItem>
              })}
            </Select>
          </FormControl>
        </div>
        <div className={`ordering__products__item-field ordering__products__item-amount ${fieldsErrors.productCount ? "field-error" : ""}`}>
          <TextField
            variant="outlined"
            label="Кол-во"
            fullWidth
            disabled={!currentProduct || productFields.selectedUnit === undefined}
            value={productFields.productCount ? productFields.productCount : ""}
            onChange={onCountChange}
          />
          {fieldsErrors.productCount !== "" && <div className="form-field-note">{fieldsErrors.productCount}</div>}
        </div>
        {productFields.selectedUnit !== undefined &&
          <>
            <div className="ordering__products__item-field ordering__products__item-price">
              <div>Цена за 1 {currentProductUnitParams.unit.name}: {formatPriceProduct(currentProductUnitParams.price)} сум</div>
              <div>НДС: {currentProduct.vatRate ? `${currentProduct.vatRate} %` : "Без НДС"}</div>
              <div>Мин. заказ: {currentProductUnitParams.minOrder}</div>
            </div>
            <div className="ordering__products__item-field ordering__products__item-total">
              Сумма: {formatPriceProduct(currentProductUnitParams.price * Number(productFields.productCount))} сум
            </div>
          </>
        }
        <div className="ordering__products__item-field ordering__products__item-delete">
          <div className="primary-btn-wr">
            <IconButton disabled={!currentProduct} onClick={onProductCreate}>
              <Check />
            </IconButton>
          </div>
        </div>
      </div>
    </>
  )
};