import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import moment from "moment";

import * as actions from "../actions";

import Table from "../../../../components/Table/index";
import Pagination from "../../../../components/Pagination/Pagination";
import { Button } from "@material-ui/core";
import withNotification from "../../../../hocs/withNotification/WithNotification";

import { ArrivalListFilter } from "../organisms/arrival-list-filter";

const ArrivalList = withNotification((props) => {
  const dispatch = useDispatch();
  const currentBranchId = useSelector(
    (state) => state.get("dashboard").currentBranch
  );
  const currentUser = useSelector(
    (state) => state.get("dashboard").currentUser
  );
  const arrivalList = useSelector((state) => state.get("arrival").arrivalList);
  const arrivalListFilterProps = useSelector(
    (state) => state.get("arrival").arrivalListFilterProps
  );

  useEffect(
    () => {
      dispatch(
        actions.getArrivalListAction({
          branchId: currentBranchId,
          customerId: currentUser.companyId,
          ...arrivalListFilterProps,
          supplier: undefined,
          supplierId: arrivalListFilterProps.supplier
            ? arrivalListFilterProps.supplier.value
            : undefined,
        })
      );
    },
    [arrivalListFilterProps, currentBranchId]
  );

  const onFilterChange = (fields) => {
    dispatch(
      actions.updateArrivalListFilterPropsAction({ page: 0, ...fields })
    );
  };

  const onChangePagination = (page) => {
    onFilterChange({ page });
  };

  const onChangeSize = (size) => {
    onFilterChange({ size });
  };

  const headers = [
    {
      content: "Номер",
      key: "number",
    },
    {
      content: "Дата",
      key: "incomeDate",
    },
    {
      content: "Филиал",
      key: "branch",
    },
    {
      content: "Поставщик",
      key: "supplier",
    },
    {
      content: "Номер заказа",
      key: "purchaseOrder",
    },
  ];

  const data = arrivalList.data.content.map((arrival) => {
    return {
      id: arrival.id,
      number: (
        <Link to={`/main/warehouse/arrival/info/${arrival.id}`}>
          {arrival.incomeNumber}
        </Link>
      ),
      incomeDate: arrival.incomeDate
        ? moment(arrival.incomeDate).format("YYYY-MM-DD")
        : "",
      branch: arrival.branch.name,
      supplier: arrival.supplier ? arrival.supplier.name : "-",
      purchaseOrder: arrival.purchaseOrder ? (
        <Link to={`/main/warehouse/orders/list/${arrival.purchaseOrder.id}`}>
          {arrival.purchaseOrder.code}
        </Link>
      ) : (
        "-"
      ),
    };
  });

  return (
    <div className="custom-content-list">
      <div className="custom-content-list__head">
        <h1 className="section-h1">Приход товара</h1>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => props.history.push("/main/warehouse/arrival/add")}
        >
          Приходовать товары
        </Button>
      </div>
      <div className="custom-content-list__content">
        <ArrivalListFilter onFilterChange={onFilterChange} />
        <Table
          order={true}
          headers={headers}
          data={data}
          page={arrivalList.data.number}
          size={arrivalList.data.size}
          isLoading={arrivalList.loading}
        />
      </div>
      <div className="custom-content__pagination">
        <Pagination
          onPageChange={onChangePagination}
          onSizeChange={onChangeSize}
          disabled={arrivalList.loading}
          size={arrivalList.data.size}
          pagesCount={arrivalList.data.totalPages}
          current={arrivalList.data.number}
        />
      </div>
    </div>
  );
});

export default ArrivalList;
