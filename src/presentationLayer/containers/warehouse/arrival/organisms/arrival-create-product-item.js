import React, {useEffect} from "react";
import { useDispatch } from "react-redux";

import * as actions from "../actions";

import { formatPriceProduct } from "../../../../../utils/format";
import { TextField } from "@material-ui/core";

export const ArrivalCreateProductsItems = (props) => {
  const { formFields, product, index: currentIndex } = props;

  const dispatch = useDispatch();

  const onMarkUpChange = (val) => {
    const updItems = [];
    const markupPercent = 100 * Number(val) / product.costPrice;

    formFields.arrivalsItems.forEach((item, index) => {
      let currentItem = {...item};

      if (index === currentIndex) {
        currentItem = {
          ...item,
          salesPrice: product.costPrice + Number(val),
          markup: val,
          markupPercent
        }
      }

      updItems.push(currentItem);
    });

    dispatch(
      actions.updateArrivalCreateFormFieldsAction({
        arrivalsItems: updItems
      })
    )
  };

  const onMarkUpPercentChange = (val) => {
    const updItems = [];

    formFields.arrivalsItems.forEach((item, index) => {
      let currentItem = {...item};
      let markup = product.costPrice * Number(val !== "." ? val : 0) / 100;

      if (index === currentIndex) {
        currentItem = {
          ...item,
          salesPrice: product.costPrice + markup,
          markupPercent: Number(val),
          markup
        }
      }

      updItems.push(currentItem);
    });

    dispatch(
      actions.updateArrivalCreateFormFieldsAction({
        arrivalsItems: updItems
      })
    )
  };

  const onSalesPriceChange = (val) => {
    const updItems = [];

    formFields.arrivalsItems.forEach((item, index) => {
      let currentItem = {...item};
      const markup = Number(val) - product.costPrice;
      const markupPercent = 100 * markup / product.costPrice;

      if (index === currentIndex) {
        currentItem = {
          ...item,
          salesPrice: Number(val) ? Number(val) : "",
          markupPercent: Number(val) ? Number(markupPercent) : "",
          markup: Number(val) ? Number(markup) : ""
        }
      }

      updItems.push(currentItem);
    });

    dispatch(
      actions.updateArrivalCreateFormFieldsAction({
        arrivalsItems: updItems
      })
    )
  };

  return (
    <div className="arrival-create__products__item">
      <div className="arrival-create__products__item-left">
        <div className="arrival-create__products-name">{currentIndex + 1}. {product.name}</div>
        <div className="arrival-create__products-unit">{product.unit.name}</div>
        <div className="arrival-create__products-qty">{formatPriceProduct(product.qty)}</div>
        <div className="arrival-create__products-costprice">{formatPriceProduct(product.costPrice)} сум/{product.unit.name}</div>
        <div className="arrival-create__products-vat">
          {product.vatRate ?
            `НДС: ${product.vatRate}%`
            : "Без НДС"
          }
          <br />
          {formatPriceProduct(product.customerSalesPrice)} сум/{product.unit.name}
        </div>
      </div>
      <div className="arrival-create__products__item-right">
        <div className="arrival-create__products-charge">
          <div className="arrival-create__products-charge-markup">
            <TextField
              label="Сумма"
              variant="outlined"
              value={product.markup ? product.markup : ""}
              onChange={(e) => onMarkUpChange(e.target.value.replace(/[^0-9]/g, ''))}
            />
          </div>
          <div className="arrival-create__products-charge-del">/</div>
          <div className="arrival-create__products-charge-percent">
            <TextField
              label="Процент"
              variant="outlined"
              value={product.markupPercent ? product.markupPercent : ""}
              onChange={(e) => onMarkUpPercentChange(e.target.value.replace(/[^0-9.]/g, ''))}
            />
          </div>
        </div>
        <div className="arrival-create__products-salesprice">
          <TextField
            label="Прод. цена"
            variant="outlined"
            value={product.salesPrice ? product.salesPrice : ""}
            onChange={(e) => onSalesPriceChange(e.target.value.replace(/[^0-9]/g, ''))}
          />
        </div>
      </div>
    </div>
  )
};