import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

import * as actions from "./actions";

import { SupplierCatalogOffers } from "./organisms/supplier-catalog-offers";

import "./supplier-catalog.scss";

const SupplierCatalog = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(
        actions.resetSupplierCatalogAction()
      )
    }
  }, []);

  return (
    <div className="custom-content-list">
      <div className="custom-content-list__head">
        <h1 className="section-h1">Каталог поставщиков</h1>
      </div>
      <SupplierCatalogOffers />
    </div>
  )
};

export default SupplierCatalog;