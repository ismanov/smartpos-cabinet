import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";

import * as actions from "../actions";

import { ArrowBackIos } from "@material-ui/icons";
import { IconButton } from "@material-ui/core";
import SelectLookup from "react-select";
import DatePicker from "../../../../components/Pickers/datepicker";
import { disableOldDates } from "../../../../../utils/disableOldDates";
import { updateFilterSearch } from "../../../../../utils/debounceFilterSearch";
import { selectStyles, selectTheme } from "../../../../../utils/inputSelectOptions";

import { ArrivalCreateProducts } from "../organisms/arrival-create-products";
import { ArrivalCreateControls } from "../organisms/arrival-create-controls";

import "./styles.scss";

const nowDate = moment().format('YYYY-MM-DDTHH:mm:ss');

const ArrivalCreate = (props) => {
  const arrivalStore = useSelector(state => state.get("arrival"));
  const dispatch = useDispatch();

  const { arrivalCreateDetails } = arrivalStore;
  const { formFields, branchesItems, suppliersItems, ordersItems, orderDetails } = arrivalCreateDetails;

  const [ searchLookUp, setSearchLookUp ] = useState(false);

  useEffect(() => {
    dispatch(
      actions.getArrivalCreateBranchesItemsAction()
    );

    dispatch(
      actions.getArrivalCreateOrdersItemsAction()
    );

    dispatch(
      actions.getArrivalCreateSuppliersItemsAction()
    );

    return () => {
      dispatch(
        actions.resetArrivalCreateAction()
      );
    }
  }, []);

  useEffect(() => {
    if (orderDetails.data) {
      dispatch(
        actions.updateArrivalCreateFormFieldsAction({
          arrivalsItems: orderDetails.data.map((item) => {
            return {
              id: item.id,
              productId: item.product.id,
              name: item.product.name,
              qty: item.qty,
              costPrice: item.price,
              customerSalesPrice: item.customerSalesPrice ? item.customerSalesPrice : 0,
              markup: null,
              markupPercent: null,
              salesPrice: item.price,
              vatRate: item.vatRate,
              unit: {
                id: item.unit.id,
                name: item.unit.name
              },
            }
          })
        })
      )
    }
  }, [orderDetails.data]);

  const onBranchChange = (val) => {
    dispatch(
      actions.updateArrivalCreateFormFieldsAction({
        branch: val
      })
    );

    if (formFields.order) {
      dispatch(
        actions.getArrivalCreateOrderDetailsAction({
          id: formFields.order.value,
          branchId: val.value
        })
      );
    }
  };

  const onArrivalTypeChange = (val) => {
    dispatch(
      actions.updateArrivalCreateFormFieldsAction({
        arrivalType: val,
        supplier: null
      })
    )
  };

  const onSupplierChange = (val) => {
    // const errors = {...arrivalCreateErrors};
    // delete errors["supplier"];
    // setArrivalCreateErrors(errors);

    dispatch(
      actions.updateArrivalCreateFormFieldsAction({
        supplier: val
      })
    )
  };

  const onSupplierSearch = (value, e) => {
    if (e.action === "input-change") {
      setSearchLookUp(!!value);
      updateFilterSearch(() => {
        dispatch(
          actions.getArrivalCreateSuppliersItemsAction({search: value})
        )
      })
    }

    if (e.action === "menu-close" && searchLookUp) {
      setSearchLookUp(false);
      updateFilterSearch(() => {
        dispatch(
          actions.getArrivalCreateSuppliersItemsAction()
        )
      })
    }
  };

  const onOrderChange = (val) => {
    if (val) {
      dispatch(
        actions.getArrivalCreateOrderDetailsAction({
          id: val.value,
          branchId: formFields.branch.value
        })
      );

      dispatch(
        actions.updateArrivalCreateFormFieldsAction({
          order: val,
          supplier: {
            label: val.supplier.name,
            value: val.supplier.id
          }
        })
      );
    } else {
      dispatch(
        actions.updateArrivalCreateFormFieldsAction({
          order: val,
          supplier: null,
          arrivalsItems: []
        })
      );

      dispatch(
        actions.resetArrivalCreateOrderDetailsAction()
      )
    }
  };

  const onOrderSearch = (value, e) => {
    if (e.action === "input-change") {
      setSearchLookUp(!!value);
      updateFilterSearch(() => {
        dispatch(
          actions.getArrivalCreateOrdersItemsAction({
            status: "COMPLETED",
            search: value
          })
        )
      })
    }

    if (e.action === "menu-close" && searchLookUp) {
      setSearchLookUp(false);
      updateFilterSearch(() => {
        dispatch(
          actions.getArrivalCreateOrdersItemsAction({
            status: "COMPLETED",
          })
        )
      })
    }
  };

  const onChangeArrivalCreateDate = (date) => {
    dispatch(
      actions.updateArrivalCreateFormFieldsAction({
        incomeDate: moment(date).format('YYYY-MM-DDTHH:mm:ss')
      })
    );
  };

  return (
    <div className="arrival-create">
      <div className="custom-content-list__head2">
        <IconButton color="primary" onClick={() => props.history.push('/main/warehouse/arrival')}>
          <ArrowBackIos />
        </IconButton>
        <h1 className="section-h1">Приход</h1>
      </div>
      <div className="arrival-create__content">
        <div className="arrival-create__details">
          <div className="arrival-create__details__item lookup-field">
            <div className="lookup-field-title">Филиал</div>
            <SelectLookup
              isDisabled={formFields.arrivalType.value === "AUTOMATIC" && formFields.arrivalsItems.length}
              placeholder="Выберите филиал"
              onChange={onBranchChange}
              value={formFields.branch ? formFields.branch : ""}
              options={branchesItems.data.map(item => ({label: `${item.name}`, value: item.id}))}
              isClearable={false}
              isMulti={false}
              isSearchable={!formFields.branch}
              isLoading={branchesItems.loading}
              loadingMessage={() => "Идет поиск"}
              noOptionsMessage={() => "Ничего не найдено!"}
              styles={selectStyles()}
              theme={selectTheme}
            />
          </div>
          <div className="arrival-create__details__item sm-field lookup-field">
            <div className="lookup-field-title">Тип прихода</div>
            <SelectLookup
              isDisabled={formFields.arrivalsItems.length}
              onChange={onArrivalTypeChange}
              value={formFields.arrivalType}
              options={
                [
                  {label: "По товарам", value: "AUTOMATIC"},
                  {label: "По заказам", value: "ORDER"}
                ]
              }
              isClearable={false}
              isMulti={false}
              styles={selectStyles()}
              theme={selectTheme}
            />
          </div>
          {formFields.arrivalType.value === "ORDER" &&
            <div className="arrival-create__details__item sm-field lookup-field">
              <div className="lookup-field-title">Заказ</div>
              <SelectLookup
                isDisabled={!formFields.branch}
                placeholder="Выберите заказ"
                onChange={onOrderChange}
                value={formFields.order ? formFields.order : ""}
                options={ordersItems.data.map(item => ({label: `${item.number}`, value: item.id, supplier: item.supplier}))}
                onInputChange={onOrderSearch}
                isClearable={true}
                isMulti={false}
                isSearchable={!formFields.order}
                isLoading={ordersItems.loading}
                loadingMessage={() => "Идет поиск"}
                noOptionsMessage={() => "Ничего не найдено!"}
                styles={selectStyles()}
                theme={selectTheme}
              />
            </div>
          }
          <div className="arrival-create__details__item lookup-field">
            <div className="lookup-field-title">Поставщик</div>
            <SelectLookup
              placeholder="Выберите поставщика"
              isDisabled={formFields.arrivalType.value === "ORDER"}
              onChange={onSupplierChange}
              value={formFields.supplier ? formFields.supplier : ""}
              options={suppliersItems.data.map(item => ({label: `${item.name}`, value: item.id}))}
              onInputChange={onSupplierSearch}
              isClearable={true}
              isMulti={false}
              isSearchable={!formFields.supplier}
              isLoading={suppliersItems.loading}
              loadingMessage={() => "Идет поиск"}
              noOptionsMessage={() => "Ничего не найдено!"}
              styles={selectStyles()}
              theme={selectTheme}
            />
          </div>
          <div className="arrival-create__details__item sm-field form-field-title-wn-label">
            <div className="arrival-create__details__item-col">
              <div className="form-field-title-wn-label-title">
                Дата прихода
              </div>
              <DatePicker
                onChange={onChangeArrivalCreateDate}
                value={formFields.incomeDate ? formFields.incomeDate : nowDate}
                shouldDisableDate={disableOldDates}
              />
            </div>
          </div>
        </div>
        <ArrivalCreateProducts />
        <div className="arrival-create__controls">
          <ArrivalCreateControls />
        </div>
      </div>
    </div>
  )
};

export default ArrivalCreate;