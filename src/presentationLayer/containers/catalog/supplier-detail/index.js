import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";

import * as actions from "./actions";

import { SupplierDetailCategories } from "./organisms/supplier-categories";
import { SupplierDetailProducts } from "./organisms/supplier-detail-products";
import Pagination from "../../../components/Pagination/Pagination";

import "./supplier-detail.scss";

const SupplierDetail = (props) => {
  const supplierDetailStore = useSelector(state => state.get("supplierDetail"));

  const dispatch = useDispatch();

  const { supplierInfo, products, showSelectedProducts } = supplierDetailStore;

  const [ currentCategoryId, setCurrentCategoryId ] = useState(null);

  const supplierId = props.match.params.supplierId;

  useEffect(() => {
    dispatch(
      actions.getSupplierInfoAction({
        id: supplierId
      })
    )
  }, []);

  const onFilterChange = (fields) => {
    dispatch(
      actions.updateProductsFilterPropsAction({ page: 0, ...fields })
    );
  };

  const onChangePagination = (page) => {
    onFilterChange({ page });
  };

  const onChangeSize = (size) => {
    onFilterChange({ size });
  };

  return (
    <div className="supplier-detail">
      <h1 className="section-h1">{supplierInfo.data.name}</h1>
      <SupplierDetailCategories
        supplierId={supplierId}
        currentCategoryId={currentCategoryId}
        setCurrentCategoryId={setCurrentCategoryId}
        history={props.history}
      />
      <div className="supplier-detail__content">
        <SupplierDetailProducts currentCategoryId={currentCategoryId} />
      </div>
      <div className="custom-content__pagination">
        {!showSelectedProducts &&
          <Pagination
            onPageChange={onChangePagination}
            onSizeChange={onChangeSize}
            disabled={products.loading}
            size={products.data.size}
            pagesCount={products.data.totalPages}
            current={products.data.number}
          />
        }
      </div>
    </div>
  )
};

export default SupplierDetail;