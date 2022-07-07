import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import * as actions from "../actions";

import { FormControl, IconButton, InputLabel, MenuItem, OutlinedInput, Select, TextField } from "@material-ui/core";
import SelectLookup from "react-select";
import { formatPriceProduct } from "../../../../../utils/format";
import { AddOutlined } from "@material-ui/icons";
import { updateFilterSearch } from "../../../../../utils/debounceFilterSearch";
import { selectStyles, selectTheme } from "../../../../../utils/inputSelectOptions";

export const AutomaticArrivalCreate = () => {
  const arrivalStore = useSelector(state => state.get("arrival"));
  const dispatch = useDispatch();

  const { arrivalCreateDetails } = arrivalStore;
  const { formFields, productsItems, productUnits } = arrivalCreateDetails;

  const [ productFields, setProductFields ] = useState({});
  const [ fieldsErrors, setFieldsErrors ] = useState({});
  const [ searchLookUp, setSearchLookUp ] = useState(false);

  const branchId = formFields.branch ? formFields.branch.value : undefined;

  useEffect(() => {
    return () => {
      dispatch(
        actions.updateArrivalCreateFormFieldsAction({
          editingProducts: {}
        })
      );

      dispatch(
        actions.resetArrivalCreateProductUnitsAction()
      );
    }
  }, []);

  useEffect(() => {
    if (branchId) {
      dispatch(
        actions.getArrivalCreateProductsItemsAction({
          branchId
        })
      );
    }
  }, [branchId]);

  useEffect(() => {
    if (branchId) {
      setProductFields({});
      setFieldsErrors({});
      dispatch(
        actions.resetArrivalCreateProductUnitsAction()
      );
    }
  }, [branchId]);

  const onProductFieldChange = (prop, val) => {
    setProductFields({
      ...productFields,
      [prop]: val
    })
  };

  const onProductChange = (val) => {
    setProductFields(val ? { currentProduct: val } : {});
    setFieldsErrors({});

    if (val) {
      dispatch(
        actions.getArrivalCreateProductUnitsAction({
          productId: val.value,
          branchId: formFields.branch.value
        })
      );

      dispatch(
        actions.updateArrivalCreateFormFieldsAction({
          editingProducts: {
            ...formFields.editingProducts,
            currentProduct: 1
          }
        })
      );

    } else {
      dispatch(
        actions.resetArrivalCreateProductUnitsAction()
      );

      const editingProducts = {...formFields.editingProducts};
      delete editingProducts["currentProduct"];

      dispatch(
        actions.updateArrivalCreateFormFieldsAction({
          editingProducts
        })
      );
    }
  };

  const onProductSearch = (value, e) => {
    if (e.action === "input-change") {
      setSearchLookUp(!!value);
      updateFilterSearch(() => {
        dispatch(
          actions.getArrivalCreateProductsItemsAction({
            search: value,
            branchId: formFields.branch.value
          })
        )
      })
    }

    if (e.action === "menu-close" && searchLookUp) {
      setSearchLookUp(false);
      updateFilterSearch(() => {
        dispatch(
          actions.getArrivalCreateProductsItemsAction({
            branchId: formFields.branch.value
          })
        )
      })
    }
  };

  const onUnitChange = (e) => {
    const unitId = e.target.value;
    let unitName = "";
    let unitPrice = 0;

    productUnits.data.forEach((item) => {
      if (item.id === unitId) {
        unitName = item.name;
        unitPrice = item.price;
      }
    });

    setProductFields({
      ...productFields,
      unitId,
      unitName,
      unitPrice
    })
  };

  const onCostPriceChange = (e) => {
    const costPrice = e.target.value.replace(/[^0-9]/g, '');

    setProductFields({
      ...productFields,
      costPrice: Number(costPrice) > 0 ? Number(costPrice) : "",
      markup: "",
      markupPercent: "",
      salesPrice: Number(costPrice) > 0 ? Number(costPrice) : ""
    })
  };

  const onMarkUpChange = (e) => {
    const markup = e.target.value.replace(/[^0-9]/g, '');
    const markupPercent = 100 * Number(markup) / Number(productFields.costPrice);

    setProductFields({
      ...productFields,
      markup,
      markupPercent,
      salesPrice: Number(productFields.costPrice) + Number(markup)
    })
  };

  const onMarkUpPercentChange = (e) => {
    const markupPercent = e.target.value.replace(/[^0-9.]/g, '');
    const markup = Number(productFields.costPrice) * Number(markupPercent !== "." ? markupPercent : 0) / 100;

    setProductFields({
      ...productFields,
      markup,
      markupPercent,
      salesPrice: Number(productFields.costPrice) + Number(markup)
    })
  };

  const onSalesPriceChange = (e) => {
    const salesPrice = e.target.value.replace(/[^0-9]/g, '');
    let markup;
    let markupPercent;

    if (productFields.costPrice) {
      markup = Number(salesPrice) - Number(productFields.costPrice);
      markupPercent = 100 * markup / Number(productFields.costPrice);
    }

    setProductFields({
      ...productFields,
      markup: Number(salesPrice) > 0 ? Number(markup) : "",
      markupPercent: Number(salesPrice) > 0 ? Number(markupPercent) : "",
      salesPrice: Number(salesPrice) > 0 ? Number(salesPrice) : ""
    })
  };

  const validateForm = () => {
    const notFilledMessage = "Не заполнено поле";
    const hasSame = "Товар с выбранной ед. изм. уже добавлен";

    const errors = {};

    if (!productFields.qty) errors.qty = notFilledMessage;
    if (!productFields.costPrice) errors.costPrice = notFilledMessage;
    if (!productFields.unitId) {
      errors.unit = notFilledMessage;
    } else {
      formFields.arrivalsItems.forEach((item) => {
        if (item.productId === productFields.currentProduct.value && item.unit.id === productFields.unitId) {
          errors.unit = hasSame;
        }
      });
    }

    return errors;
  };

  const onAddProduct = () => {
    const errors = validateForm();

    if (Object.keys(errors).length) {
      setFieldsErrors(errors);
      return;
    }

    setFieldsErrors({});

    dispatch(
      actions.resetArrivalCreateProductUnitsAction()
    );

    const arrivalsItems = [
      ...formFields.arrivalsItems,
      {
        productId: productFields.currentProduct.value,
        name: productFields.currentProduct.label,
        qty: Number(productFields.qty),
        costPrice: productFields.costPrice,
        customerSalesPrice: productFields.unitPrice ? productFields.unitPrice : 0,
        markup: productFields.markup,
        markupPercent: productFields.markupPercent,
        salesPrice: productFields.salesPrice,
        vatRate: productFields.currentProduct.vatRate,
        unit: {
          id: productFields.unitId,
          name: productFields.unitName,
          unitPrice: productFields.unitPrice
        }
      }
    ];

    const editingProducts = {...formFields.editingProducts};
    delete editingProducts["currentProduct"];

    dispatch(
      actions.updateArrivalCreateFormFieldsAction({
        arrivalsItems,
        editingProducts
      })
    );

    setProductFields({});
  };

  return (
    <div className="automatic-arrival-create">
      <div className="automatic-arrival-create-left">
        <div className="arrival-create__products-name lookup-field">
          <SelectLookup
            placeholder="Выберите товар"
            onChange={onProductChange}
            isDisabled={!formFields.branch}
            value={productFields.currentProduct ? formFields.currentProduct : ""}
            options={productsItems.data.map(item => ({label: `${item.name}`, value: item.id, vatRate: item.vatRate}))}
            onInputChange={onProductSearch}
            isClearable={true}
            isMulti={false}
            isSearchable={!productFields.currentProduct}
            isLoading={productsItems.loading}
            loadingMessage={() => "Идет поиск"}
            noOptionsMessage={() => "Ничего не найдено!"}
            styles={selectStyles()}
            theme={selectTheme}
          />
        </div>
        <div className={`arrival-create__products-unit ${fieldsErrors.unit ? "field-error" : ""}`}>
          <FormControl fullWidth variant='outlined' style={{padding: 0}} disabled={!productUnits.data.length || productUnits.loading}>
            <InputLabel>Ед. изм</InputLabel>
            <Select
              input={<OutlinedInput labelWidth={90} />}
              value={productFields.unitId !== undefined ? productFields.unitId : ""}
              onChange={onUnitChange}
            >
              {productUnits.data.map((item) => <MenuItem value={item.id} key={item.id}>{item.name}</MenuItem>)}
            </Select>
          </FormControl>
          {fieldsErrors.unit !== "" && <div className="form-field-note">{fieldsErrors.unit}</div>}
        </div>
        <div className={`arrival-create__products-qty ${fieldsErrors.qty ? "field-error" : ""}`}>
          <TextField
            label="Кол-во"
            variant="outlined"
            disabled={!productFields.currentProduct}
            value={productFields.qty ? productFields.qty : ""}
            onChange={(e) => onProductFieldChange("qty", e.target.value.replace(/[^0-9]/g, ''))}
          />
          {fieldsErrors.qty !== "" && <div className="form-field-note">{fieldsErrors.qty}</div>}
        </div>
        <div className={`arrival-create__products-costprice ${fieldsErrors.costPrice ? "field-error" : ""}`}>
          <TextField
            label="Себест."
            variant="outlined"
            disabled={!productFields.currentProduct}
            value={productFields.costPrice ? productFields.costPrice : ""}
            onChange={onCostPriceChange}
          />
          {fieldsErrors.costPrice !== "" && <div className="form-field-note">{fieldsErrors.costPrice}</div>}
        </div>
        <div className="arrival-create__products-vat">
          {(productFields.currentProduct && productFields.currentProduct.vatRate) ?
            `НДС: ${productFields.currentProduct.vatRate}%`
            : "Без НДС"
          }
          <br />
          {formatPriceProduct(productFields.unitPrice ? productFields.unitPrice : 0)} сум{productFields.unitName ? `/${productFields.unitName}` : ""}
        </div>
      </div>
      <div className="automatic-arrival-create-right">
        <div className="arrival-create__products-charge">
          <div className="arrival-create__products-charge-markup">
            <TextField
              label="Сумма"
              variant="outlined"
              disabled={!productFields.costPrice}
              value={productFields.markup ? productFields.markup : ""}
              onChange={onMarkUpChange}
            />
          </div>
          <div className="arrival-create__products-charge-del">/</div>
          <div className="arrival-create__products-charge-percent">
            <TextField
              label="Процент"
              variant="outlined"
              disabled={!productFields.costPrice}
              value={productFields.markupPercent ? productFields.markupPercent : ""}
              onChange={onMarkUpPercentChange}
            />
          </div>
        </div>
        <div className="arrival-create__products-salesprice">
          <TextField
            label="Прод. цена"
            variant="outlined"
            disabled={!productFields.currentProduct}
            value={productFields.salesPrice ? productFields.salesPrice : ""}
            onChange={onSalesPriceChange}
          />
        </div>
        <div className="arrival-create__products-action primary-btn-wr">
          <IconButton disabled={!productFields.currentProduct} onClick={onAddProduct}>
            <AddOutlined color='primary'/>
          </IconButton>
        </div>
      </div>
    </div>
  )
};