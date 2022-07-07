import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";

import * as actions from "./actions";
import * as constants from "./constants";

import { Button, FormControl, InputLabel, MenuItem, OutlinedInput, Select } from "@material-ui/core";
import SelectLookup from "react-select";

import SupplierCatalogModal from "./organisms/supplier-catalog-modal";
import { OrderingProducts } from "./organisms/ordering-products";
import { OrderingControls } from "./organisms/ordering-controls";
import DatePicker from "../../../../components/Pickers/datepicker";
import { dateDiffernce } from "../../../../../utils/dateDiffernce";
import { disableOldDates } from "../../../../../utils/disableOldDates";
import { updateFilterSearch } from "../../../../../utils/debounceFilterSearch";
import { selectStyles, selectTheme } from "../../../../../utils/inputSelectOptions";

import "./ordering.scss";

const selectedOptions = (options) => {
  const locOptions = [];

  options.forEach((option) => {
    if (option.selected) {
      locOptions.push(option);
    }
  });

  return locOptions;
};

const nowDate = moment().format('YYYY-MM-DDTHH:mm:ss');

const Ordering = (props) => {
  const orderingStore = useSelector(state => state.get("ordering"));
  const dispatch = useDispatch();

  const { orderDataToEdit } = props;

  const orderStatus = orderDataToEdit ? orderDataToEdit.statusCode : constants.NEW;

  const { ordering: orderingData, suppliersItems, branchesItems, paymentsItems, deliveryTypeItems } = orderingStore;
  const { list: productsList, filterProps } = orderingData;

  const [ supplierModalProps, setSupplierModalProps ] = useState({
    visible: false,
    shouldRender: false,
  });
  const [ orderErrors, setOrderErrors ] = useState({});
  const [ searchLookUp, setSearchLookUp ] = useState(false);

  useEffect(() => {
    dispatch(
      actions.getSuppliersItemsAction()
    );

    if (filterProps.supplier) {
      dispatch(
        actions.getBranchesItemsAction({ companyId: filterProps.supplier.value })
      );

      dispatch(
        actions.getPaymentsItemsAction({ id: filterProps.supplier.value })
      );

      dispatch(
        actions.getDeliveryTypeItemsAction({ id: filterProps.supplier.value })
      );
    }

    if (orderDataToEdit) {
      dispatch(
        actions.getBranchesItemsAction({ companyId: orderDataToEdit.filterProps.supplier.value })
      );

      dispatch(
        actions.getPaymentsItemsAction({ id: orderDataToEdit.filterProps.supplier.value })
      );

      dispatch(
        actions.getDeliveryTypeItemsAction({ id: orderDataToEdit.filterProps.supplier.value })
      );

      dispatch(
        actions.addOrderingProductAction({
          filterProps: orderDataToEdit.filterProps,
          list: orderDataToEdit.list
        })
      );
    }
  }, []);

  const onPaymentFiledChange = (prop, val) => {
    dispatch(
      actions.setOrderingFieldsAction({
        [prop]: val
      })
    );

    const locOrderErrors = {...orderErrors};
    delete locOrderErrors["paymentCode"];

    setOrderErrors(locOrderErrors);
  };

  const onDeliveryTypeChange = (prop, val) => {
    dispatch(
      actions.setOrderingFieldsAction({
        [prop]: val
      })
    );

    const locOrderErrors = {...orderErrors};
    delete locOrderErrors["deliveryCode"];

    setOrderErrors(locOrderErrors);
  };

  const onSupplierChange = (prop, val) => {
    if (val) {
      dispatch(
        actions.getBranchesItemsAction({ companyId: val.value })
      );

      dispatch(
        actions.getPaymentsItemsAction({ id: val.value })
      );

      dispatch(
        actions.getDeliveryTypeItemsAction({ id: val.value })
      );
    }

    dispatch(
      actions.setOrderingFieldsAction({
        supplier: val,
        branch: null,
        paymentCode: null,
        deliveryCode: null
      })
    );
  };

  const onSupplierSearch = (value, e) => {
    if (e.action === "input-change") {
      setSearchLookUp(!!value);
      updateFilterSearch(() => {
        dispatch(
          actions.getSuppliersItemsAction({search: value})
        );
      })
    }

    if (e.action === "menu-close" && searchLookUp) {
      setSearchLookUp(false);
      updateFilterSearch(() => {
        dispatch(
          actions.getSuppliersItemsAction()
        );
      })
    }
  };

  const onBranchChange = (prop, val) => {
    dispatch(
      actions.setOrderingFieldsAction({
        branch: val
      })
    );
  };

  const onBranchSearch = (value, e) => {
    if (e.action === "input-change") {
      setSearchLookUp(!!value);
      updateFilterSearch(() => {
        dispatch(
          actions.getBranchesItemsAction({ companyId: filterProps.supplier.value, search: value })
        );
      });
    }

    if (e.action === "menu-close" && searchLookUp) {
      setSearchLookUp(false);
      updateFilterSearch(() => {
        dispatch(
          actions.getBranchesItemsAction({ companyId: filterProps.supplier.value })
        );
      })
    }
  };

  const onChangeOrderDate = (date) => {
    const orderDate = moment(date).format('YYYY-MM-DDTHH:mm:ss');

    dispatch(
      actions.setOrderingFieldsAction({
        orderDate
      })
    );

    const locOrderErrors = {...orderErrors};

    if (dateDiffernce(nowDate, orderDate) < 0) {
      locOrderErrors.orderDate = "Дата должна быть не позже сегодняшнего дня";
    } else {
      delete locOrderErrors["orderDate"];
    }

    setOrderErrors(locOrderErrors);
  };

  const onSupplierCatalogClick = () => {
    setSupplierModalProps({ visible: true, shouldRender: true });
  };

  return (
    <div className="ordering">
      {!orderDataToEdit && <h1 className="section-h1">Оформление заказа</h1>}
      <div className="ordering__content">
        <div className="ordering__details">
          <div className="ordering__details__item lookup-field">
            <div className="lookup-field-title">Поставщик</div>
            <SelectLookup
              placeholder="Выберите поставщика"
              isDisabled={productsList.length || orderDataToEdit}
              onChange={(e) => onSupplierChange("supplier", e)}
              value={filterProps.supplier ? filterProps.supplier : ""}
              onInputChange={onSupplierSearch}
              options={suppliersItems.list.map(item => ({label: `${item.name}`, value: item.id}))}
              isClearable={true}
              isMulti={false}
              isSearchable={!filterProps.supplier}
              isLoading={suppliersItems.loading}
              loadingMessage={() => "Идет поиск"}
              noOptionsMessage={() => "Ничего не найдено!"}
              styles={selectStyles()}
              theme={selectTheme}
            />
          </div>
          <div className="ordering__details__item lookup-field branch-field">
            <div className="branch-field-item">
              <div className="lookup-field-title">Филиал</div>
              <SelectLookup
                placeholder="Выберите филиал"
                isDisabled={!filterProps.supplier || productsList.length || orderDataToEdit}
                onChange={(e) => onBranchChange("branch", e)}
                value={filterProps.branch ? filterProps.branch : ""}
                onInputChange={onBranchSearch}
                options={branchesItems.list.map(item => ({label: `${item.name}`, value: item.id}))}
                isClearable={true}
                isMulti={false}
                isSearchable={!filterProps.branch}
                isLoading={branchesItems.loading}
                loadingMessage={() => "Идет поиск"}
                noOptionsMessage={() => "Ничего не найдено!"}
                styles={selectStyles()}
                theme={selectTheme}
              />
            </div>
            <Button disabled={!filterProps.branch} variant="outlined" color="primary" onClick={onSupplierCatalogClick}>
              Каталог
            </Button>
          </div>
          <div className="ordering__details__item ordering__details__item-row">
            <div className={`ordering__details__item-col ${orderErrors.paymentCode ? "field-error" : ""}`}>
              <FormControl fullWidth variant='outlined' style={{padding: 0}} disabled={paymentsItems.length === 0}>
                <InputLabel>Способ оплаты</InputLabel>
                <Select
                  input={<OutlinedInput labelWidth={150}/>}
                  value={filterProps.paymentCode || ""}
                  onChange={(e) => onPaymentFiledChange("paymentCode", e.target.value)}
                >
                  {selectedOptions(paymentsItems).map((item) => <MenuItem value={item.code} key={item.code}>{item.name}</MenuItem>)}
                </Select>
              </FormControl>
            </div>
            <div className={`ordering__details__item-col ${orderErrors.deliveryCode ? "field-error" : ""}`}>
              <FormControl fullWidth variant='outlined' style={{padding: 0}} disabled={deliveryTypeItems.length === 0}>
                <InputLabel>Способ доставки</InputLabel>
                <Select
                  input={<OutlinedInput labelWidth={150}/>}
                  value={filterProps.deliveryCode || ""}
                  onChange={(e) => onDeliveryTypeChange("deliveryCode", e.target.value)}
                >
                  {selectedOptions(deliveryTypeItems).map((item) => <MenuItem value={item.code} key={item.code}>{item.name}</MenuItem>)}
                </Select>
              </FormControl>
            </div>
          </div>
          <div className="ordering__details__item">
            <div className={`ordering__details__item-col ${orderErrors.orderDate ? "field-error" : ""}`}>
              <DatePicker
                label="Дата заказа"
                onChange={onChangeOrderDate}
                value={filterProps.orderDate ? filterProps.orderDate : nowDate}
                shouldDisableDate={disableOldDates}
              />
              {orderErrors.orderDate !== "" && <div className="form-field-note">{orderErrors.orderDate}</div>}
            </div>
          </div>
        </div>
        <OrderingProducts productsList={productsList} />
        <OrderingControls
          orderErrors={orderErrors}
          setOrderErrors={setOrderErrors}
          orderStatus={orderStatus}
          orderId={orderDataToEdit ? orderDataToEdit.orderId : null}
        />
      </div>
      {supplierModalProps.shouldRender && <SupplierCatalogModal
        modalProps={supplierModalProps}
        setModalProps={setSupplierModalProps}
        filterProps={filterProps}
      />}
    </div>
  )
};

export default Ordering;