import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { withRouter } from "react-router-dom";

import * as supplierDetailActions from "../../../../catalog/supplier-detail/actions";

import CustomDialog from "../../../../../components/material-components/components/CustomDialog";
import { SupplierDetailCategories } from "../../../../catalog/supplier-detail/organisms/supplier-categories";
import { SupplierDetailProducts } from "../../../../catalog/supplier-detail/organisms/supplier-detail-products";

const SupplierCatalogModalView = (props) => {
  const orderingStore = useSelector((state) => state.get("ordering"));
  const dispatch = useDispatch();

  const { modalProps, setModalProps, filterProps } = props;

  const [currentCategoryId, setCurrentCategoryId] = useState(null);

  useEffect(() => {
    dispatch(
      supplierDetailActions.getSupplierInfoAction({
        id: filterProps.supplier.value,
      })
    );

    dispatch(
      supplierDetailActions.addSelectedProductsAction(
        orderingStore.ordering.list
      )
    );

    dispatch(
      supplierDetailActions.setCategoriesBranchAction(filterProps.branch)
    );
  }, []);

  const closeModal = () => {
    setModalProps({ ...modalProps, visible: false });

    dispatch(supplierDetailActions.showSelectedProductsAction(false));
  };

  const afterClose = () => {
    setModalProps({ ...modalProps, shouldRender: false });
  };

  return (
    <CustomDialog
      open={modalProps.visible}
      onClose={closeModal}
      onExited={afterClose}
      fullWidth={true}
      maxWidth={false}
      title="Каталог"
    >
      <div className="supplier-detail supplier-detail-modal">
        <SupplierDetailCategories
          supplierId={filterProps.supplier.value}
          currentCategoryId={currentCategoryId}
          setCurrentCategoryId={setCurrentCategoryId}
          history={props.history}
          isModal={true}
          closeModal={closeModal}
        />
        <div className="supplier-detail__content">
          <SupplierDetailProducts
            currentCategoryId={currentCategoryId}
            isModal={true}
          />
        </div>
      </div>
    </CustomDialog>
  );
};

export default withRouter(SupplierCatalogModalView);
