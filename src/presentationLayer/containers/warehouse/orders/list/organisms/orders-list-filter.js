import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";

import * as actions from "../actions";

import { TextField } from "@material-ui/core";
import DateRangePicker from "../../../../../components/Pickers/daterange";
import SelectBox from "../../../../../components/Select";
import { selectStyles, selectTheme } from "../../../../../../utils/inputSelectOptions";
import SelectLookup from "react-select";
import { updateFilterSearch } from "../../../../../../utils/debounceFilterSearch";
import SearchTextField from "../../../../../components/Textfields/search";

const dateFormat = "YYYY-MM-DDTHH:mm:ss";

export const OrdersListFilter = ({ onFilterChange }) => {
  const ordersListStore = useSelector(state => state.get("ordersList"));
  const dispatch = useDispatch();

  const { ordersListFilterProps, orderStatuses, orderSubStatuses, suppliersItems } = ordersListStore;

  const [ searchValue, setSearchValue ] = useState("");
  const [ searchLookUp, setSearchLookUp ] = useState(false);

  const getSuppliers = (params) => {
    dispatch(
      actions.getSuppliersItemsAction(params)
    )
  };

  useEffect(() => {
    dispatch(
      actions.getOrderStatusesAction()
    );

    getSuppliers()
  }, []);

  const onOrderSearch = (search) => {
    setSearchValue(search);

    updateFilterSearch(() => {
      onFilterChange({
        search: search
      })
    })
  };

  const onDateChange = (range, isReset) => {
    let from = range ? moment(range.startDate).format('YYYY-MM-DDTHH:mm:ss') : undefined;
    let to = range ? moment(range.endDate).format('YYYY-MM-DDTHH:mm:ss') : undefined;

    if (isReset) {
      from = moment().subtract(1, 'month').startOf('day').format(dateFormat);
      to = moment().endOf('day').format(dateFormat);
    }

    onFilterChange({
      from,
      to,
    })
  };

  const onSupplierChange = (supplier) => {
    onFilterChange({
      supplier,
      supplierId: supplier ? supplier.value : undefined
    })
  };

  const onSupplierSearch = (value, e) => {
    if (e.action === "input-change") {
      setSearchLookUp(!!value);
      updateFilterSearch(() => {
        getSuppliers({search: value})
      })
    }

    if (e.action === "menu-close" && searchLookUp) {
      setSearchLookUp(false);
      updateFilterSearch(() => {
        getSuppliers()
      })
    }
  };

  const onStatusChange = (e) => {
    const groupStatus = e.target.value;

    if (groupStatus && groupStatus !== "ALL") {
      dispatch(
        actions.getOrderSubStatusesAction(groupStatus)
      )
    } else {
      dispatch(
        actions.resetOrderSubStatusesAction()
      )
    }

    onFilterChange({
      page: 0,
      groupStatus: groupStatus === "ALL" ? undefined : groupStatus,
      status: undefined
    });
  };

  const onSubStatusChange = (e) => {
    const status = e.target.value;

    onFilterChange({
      page: 0,
      status: status === "ALL" ? undefined : status
    });
  };

  const getSubStatusValue = () => {
    let value = "ALL";
    const { status, groupStatus } = ordersListFilterProps;

    if (status) {
      value = status;
    } else if (groupStatus && orderSubStatuses.length === 1) {
      value = orderSubStatuses[0].code;
    }

    return value;
  };

  return (
    <div className="orderlist__filter">
      <div className="orderlist__filter__item">
        <DateRangePicker
          position={'flex-start'}
          onChange={onDateChange}
          value={{
            startDate: ordersListFilterProps.from,
            endDate: ordersListFilterProps.to
          }}
        />
      </div>
      <div className="orderlist__filter__item lookup-field suppliers-field">
        <SelectLookup
          placeholder="Выберите поставщика"
          onChange={onSupplierChange}
          value={ordersListFilterProps.supplier ? ordersListFilterProps.supplier : ""}
          options={suppliersItems.data.map(item => ({label: `${item.name}`, value: item.id}))}
          onInputChange={onSupplierSearch}
          isClearable={true}
          isMulti={false}
          isSearchable={!ordersListFilterProps.supplier}
          isLoading={suppliersItems.loading}
          loadingMessage={() => "Идет поиск"}
          noOptionsMessage={() => "Ничего не найдено!"}
          styles={selectStyles()}
          theme={selectTheme}
        />
      </div>
      <div className="orderlist__filter__item">
        <SelectBox
          label="Статус"
          value={ordersListFilterProps.groupStatus ? ordersListFilterProps.groupStatus : "ALL"}
          data={[
            {nameRu: "Все", code: "ALL", notificationAction: "ALL"},
            ...orderStatuses
          ]}
          itemKey='code'
          itemValue='nameRu'
          onChange={onStatusChange}
        />
      </div>
      <div className="orderlist__filter__item sub-statuses">
        <SelectBox
          disabled={!ordersListFilterProps.groupStatus || orderSubStatuses.length < 2}
          label="Под-статус"
          value={getSubStatusValue()}
          data={[
            {nameRu: "Все", code: "ALL", notificationAction: "ALL"},
            ...orderSubStatuses
          ]}
          itemKey='code'
          itemValue='nameRu'
          onChange={onSubStatusChange}
        />
      </div>
      <div className="orderlist__filter__item">
        <div className="filter-search">
          <SearchTextField
            value={searchValue || ""}
            onSearch={onOrderSearch}
            onChange={onOrderSearch}
          />
        </div>
      </div>
    </div>
  )
};