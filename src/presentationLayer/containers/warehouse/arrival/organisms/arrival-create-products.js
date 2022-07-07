import React from "react";
import { useSelector } from "react-redux";

import { AutomaticArrivalCreate } from "./automatic-arrival-create";
import { AutomaticArrivalCreateProductsItems } from "./automatic-arrival-create-products-items";
import { ArrivalCreateProductsItems } from "./arrival-create-product-item";

import { formatPriceProduct } from "../../../../../utils/format";
import { CircularProgress } from "@material-ui/core";

export const ArrivalCreateProducts = () => {
  const arrivalStore = useSelector(state => state.get("arrival"));

  const { arrivalCreateDetails } = arrivalStore;
  const { formFields, orderDetails } = arrivalCreateDetails;

  const renderOrderProducts = () => {
    const products = formFields.arrivalsItems;

    return products.map((product, index) => {
      return (
        <ArrivalCreateProductsItems
          formFields={formFields}
          product={product}
          index={index}
          key={index}
        />
      )
    })
  };

  const automaticProducts = () => {
    const products = formFields.arrivalsItems;

    return products.map((product, index) => {
      return (
        <AutomaticArrivalCreateProductsItems
          formFields={formFields}
          product={product}
          index={index}
          key={index}
        />
      )
    })
  };

  const productsTotal = () => {
    const products = formFields.arrivalsItems;
    let total = 0;

    products.forEach((item) => {
      total = total + (Number(item.qty) * Number(item.costPrice ? item.costPrice : 0));
    });

    return `${formatPriceProduct(total)} сум`;
  };

  return (
    <div className="arrival-create__products">
      {orderDetails.loading && <div className="abs-loader">
        <CircularProgress color='primary'/>
      </div>}
      <div className="arrival-create__products__total">Общая сумма прихода: {productsTotal()}</div>
      <div className="arrival-create__products__head">
        <div className="arrival-create__products__head-left">
          <div className="arrival-create__products-name">Наименование товара</div>
          <div className="arrival-create__products-unit">Ед. Изм.</div>
          <div className="arrival-create__products-qty">Количество</div>
          <div className="arrival-create__products-costprice">Себестоимость</div>
          <div className="arrival-create__products-vat">НДС/Прод.Цена</div>
        </div>
        <div className="arrival-create__products__head-right">
          <div className="arrival-create__products-charge">Наценка (Сумма/Процент)</div>
          <div className="arrival-create__products-salesprice">Продажная цена</div>
          {formFields.arrivalType.value === "AUTOMATIC" &&
            <div className="arrival-create__products-action">Операции</div>
          }
        </div>
      </div>
      <div>
        {formFields.arrivalType.value === "ORDER" ?
          <>
            <div>
              {renderOrderProducts()}
            </div>
            <div className="arrival-create__empty">
              {!formFields.arrivalsItems.length && "Выберите заказ"}
            </div>
          </>
          :
          <>
            <div>
              {automaticProducts()}
            </div>
            <AutomaticArrivalCreate />
          </>
        }
      </div>
    </div>
  )
};