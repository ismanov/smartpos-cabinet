import React, { useState } from "react";
import { useDispatch } from "react-redux";

import * as actions from "../actions";

import { formatPriceProduct } from "../../../../../utils/format";
import {Check, DeleteOutlined, Edit} from "@material-ui/icons";
import {IconButton, TextField} from "@material-ui/core";

export const AutomaticArrivalCreateProductsItems = (props) => {
  const { formFields, product, index: currentIndex } = props;

  const dispatch = useDispatch();

  const [ editMode, setEditMode ] = useState(false);
  const [ productFields, setProductFields ] = useState({});
  const [ fieldsErrors, setFieldsErrors ] = useState({});

  const onEditProductClick = () => {
    dispatch(
      actions.updateArrivalCreateFormFieldsAction({
        editingProducts: {
          ...formFields.editingProducts,
          [currentIndex]: 1
        }
      })
    );
    setEditMode(true);
    setProductFields({
      costPrice: product.costPrice,
      markup: product.markup,
      markupPercent: product.markupPercent,
      salesPrice: product.salesPrice
    })
  };

  const onCostPriceChange = (e) => {
    const costPrice = e.target.value.replace(/[^0-9]/g, '');

    setProductFields({
      ...productFields,
      costPrice: Number(costPrice) > 0 ? costPrice : "",
      markup: 0,
      markupPercent: 0,
      salesPrice: Number(costPrice) > 0 ? costPrice : ""
    })
  };

  const onMarkUpChange = (e) => {
    const markup = e.target.value.replace(/[^0-9]/g, '');
    const markupPercent = 100 * Number(markup) / Number(productFields.costPrice);

    setProductFields({
      ...productFields,
      markup,
      markupPercent: parseInt(markupPercent * 100) / 100,
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
      markupPercent = parseInt(markupPercent * 100) / 100;
    }

    setProductFields({
      ...productFields,
      markup,
      markupPercent,
      salesPrice
    })
  };

  const validateForm = () => {
    const notFilledMessage = "Не заполнено поле";

    const errors = {};

    if (!productFields.costPrice) errors.costPrice = notFilledMessage;

    return errors;
  };

  const onSaveProductEdit = () => {
    const errors = validateForm();

    if (Object.keys(errors).length) {
      setFieldsErrors(errors);
      return;
    }

    setFieldsErrors({});

    const arrivalsItems = formFields.arrivalsItems.map((item, index) => {
      let currentItem = {...item};

      if (index === currentIndex) {
        currentItem = {
          ...currentItem,
          costPrice: productFields.costPrice,
          markup: productFields.markup,
          markupPercent: productFields.markupPercent,
          salesPrice: productFields.salesPrice
        }
      }

      return currentItem;
    });

    const editingProducts = {
      ...formFields.editingProducts
    };

    delete editingProducts[currentIndex];

    dispatch(
      actions.updateArrivalCreateFormFieldsAction({
        arrivalsItems,
        editingProducts
      })
    );

    setEditMode(false);
  };

  const onDeleteProduct = () => {
    const arrivalsItems = formFields.arrivalsItems.filter((item, index) => index !== currentIndex);

    dispatch(
      actions.updateArrivalCreateFormFieldsAction({
        arrivalsItems
      })
    )
  };

  return (
    <div className="arrival-create__products__item">
      <div className="arrival-create__products__item-left">
        <div className="arrival-create__products-name">{currentIndex + 1}. {product.name}</div>
        <div className="arrival-create__products-unit">{product.unit.name}</div>
        <div className="arrival-create__products-qty">{formatPriceProduct(product.qty)}</div>
        <div className={`arrival-create__products-costprice ${fieldsErrors.costPrice ? "field-error" : ""}`}>
          {editMode ?
            <>
              <TextField
                label="Себест."
                variant="outlined"
                value={productFields.costPrice ? productFields.costPrice : ""}
                onChange={onCostPriceChange}
              />
              {fieldsErrors.costPrice !== "" && <div className="form-field-note">{fieldsErrors.costPrice}</div>}
            </>
            :
            <>{product.costPrice ? `${formatPriceProduct(product.costPrice)} сум/${product.unit.name}` : "0"}</>
          }
        </div>
        <div className="arrival-create__products-vat">
          {product.vatRate ?
            `НДС: ${product.vatRate}%`
            : "Без НДС"
          }
          <br />
          {formatPriceProduct(product.unit.unitPrice)} сум/{product.unit.name}
        </div>
      </div>
      <div className="arrival-create__products__item-right">
        <div className="arrival-create__products-charge">
          {editMode ?
            <>
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
            </>
            :
            <>{product.salesPrice && product.salesPrice !== product.costPrice ? `${product.markup} сум / ${product.markupPercent} %` : "-"}</>
          }
        </div>
        <div className="arrival-create__products-salesprice">
          {editMode ?
            <TextField
              label="Прод. цена"
              variant="outlined"
              value={productFields.salesPrice ? productFields.salesPrice : ""}
              onChange={onSalesPriceChange}
            />
            :
            <>{product.salesPrice ? `${formatPriceProduct(product.salesPrice)} сум` : "-"}</>
          }
        </div>
        <div className="arrival-create__products-action">
          {editMode ?
            <div className="primary-btn-wr">
              <IconButton onClick={onSaveProductEdit}>
                <Check />
              </IconButton>
            </div>
            :
            <div className="primary-btn-wr">
              <IconButton onClick={onEditProductClick}>
                <Edit />
              </IconButton>
            </div>
          }
          <div className="delete-btn-wr">
            <IconButton onClick={onDeleteProduct}>
              <DeleteOutlined color='inherit'/>
            </IconButton>
          </div>
        </div>
      </div>
    </div>
  )
};