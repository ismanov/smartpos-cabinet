import React from "react";
import { useSelector } from "react-redux";

import { CircularProgress } from "@material-ui/core";
import { SupplierDetailProductsItem } from "./supplier-detail-products-item";
import { SupplierDetailProductsSelectedItems } from "./supplier-detail-products-selected-items";
import { defineSelectedUnitParams } from "../../supplier/organisms/supplier-catalog-offer-details";

export const SupplierDetailProducts = ({ currentCategoryId, isModal }) => {
  const supplierDetailStore = useSelector(state => state.get("supplierDetail"));

  const { products, selectedProducts, showSelectedProducts } = supplierDetailStore;

  const productsRender = products.data.content.map((product, index) => {
    return (
      <SupplierDetailProductsItem
        selectedProducts={selectedProducts}
        product={product}
        index={index}
        key={product.id}
        pageSize={products.data.pageable.pageSize}
        pageNumber={products.data.pageable.pageNumber}
      />
    )
  });

  const selectedProductsRender = selectedProducts.map((product, index) => {
    return (
      <SupplierDetailProductsSelectedItems selectedProducts={selectedProducts} product={product} index={index} key={defineSelectedUnitParams(product.units, product.selectedUnit).id} />
    )
  });

  return (
    <div className="supplier-detail__products">
      <div className="supplier-detail__products-in">
        {products.loading && <div className="abs-loader">
          <CircularProgress color='primary'/>
        </div>}
        {currentCategoryId || showSelectedProducts ?
          <div className="supplier-detail__products__list">
            {productsRender.length && !showSelectedProducts ?
              productsRender
            : showSelectedProducts ?
              selectedProductsRender
            :
              <div className="empty-icon-block">Список пуст !</div>
            }
          </div>
        :
          <div className="supplier-detail__warning">
            {isModal ? "Выберите категорию" : "Выберите филиал и категорию"}
          </div>
        }
      </div>
    </div>
  )
};