import React from "react";

import { formatPriceProduct } from "../../../../../../utils/format";
import { AddNewProduct } from "./add-new-product";

import { OrderingProductsItems } from "./ordering-products-items";
import { defineSelectedUnitParams } from "../../../../catalog/supplier/organisms/supplier-catalog-offer-details";

export const OrderingProducts = (props) => {
  const { productsList } = props;

  let allTotal = 0;

  const renderProducts = productsList.map((product, index) => {
    const { price: currentUnitPrice, id: unitProductId } = defineSelectedUnitParams(product.units, product.selectedUnit);

    const productTotal = currentUnitPrice * product.productCount;

    allTotal = allTotal + productTotal;

    return (
      <OrderingProductsItems
        key={unitProductId}
        productKey={unitProductId}
        selectedProducts={productsList}
        product={product}
        index={index}
      />
    )
  });

  return (
    <>
      <div className="ordering__products">
        {renderProducts}
      </div>
      <AddNewProduct />
      {renderProducts.length > 0 &&
      <div className="ordering__products__total">
        Итого: {formatPriceProduct(allTotal)} сум
      </div>
      }
    </>
  )
};