import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";

import * as actions from "../actions";

import { formatPriceProduct } from "../../../../../utils/format";

import Table from "../../../../components/Table/index";
import { ArrowBackIos } from "@material-ui/icons";
import { IconButton } from "@material-ui/core";

const ArrivalInfo = (props) => {
  const currentUser = useSelector(
    (state) => state.get("dashboard").currentUser
  );
  const arrivalInfo = useSelector((state) => state.get("arrival").arrivalInfo);

  const dispatch = useDispatch();

  useEffect(() => {
    const arrivalId = props.match.params.id;

    dispatch(actions.getArrivalInfoAction(arrivalId));

    return () => {
      dispatch(actions.resetArrivalInfoAction());
    };
  }, []);

  const headers = [
    {
      content: "Наименование товара",
      key: "name",
    },
    {
      content: "Стоимость",
      key: "costPrice",
    },
    {
      content: "Количество",
      key: "qty",
    },
    {
      content: "Ед. Изм.",
      key: "unit",
    },
    {
      content: "Сумма",
      key: "total",
    },
  ];

  let arrivalTotal = 0;

  const data = arrivalInfo.data
    ? arrivalInfo.data.items.map((product) => {
        const total = product.qty * product.costPrice;
        arrivalTotal = arrivalTotal + total;

        return {
          id: product.id,
          name: product.product.name,
          costPrice: `${formatPriceProduct(product.costPrice)} сум`,
          qty: formatPriceProduct(product.qty),
          unit: product.unit.name,
          total: `${formatPriceProduct(total)} сум`,
        };
      })
    : [];

  return (
    <div className="arrival-info">
      <div className="custom-content-list__head2">
        <IconButton
          color="primary"
          onClick={() => props.history.push("/main/warehouse/arrival")}
        >
          <ArrowBackIos />
        </IconButton>
        <h1 className="section-h1">Приход</h1>
      </div>
      <div className="custom-content-list__info">
        <div className="custom-content-list__info__head">
          {arrivalInfo.data && arrivalInfo.data.incomeNumber}
        </div>
        {arrivalInfo.data && (
          <div className="custom-content-list__info__in">
            <div className="custom-content-list__info__in__item">
              <div className="custom-content-list__info__in__item-title">
                Заказ создал
              </div>
              <div className="custom-content-list__info__in__item-body">
                {currentUser.login}
              </div>
            </div>
            <div className="custom-content-list__info__in__item">
              <div className="custom-content-list__info__in__item-title">
                Дата
              </div>
              <div className="custom-content-list__info__in__item-body">
                {moment(arrivalInfo.data.incomeDate).format("DD/MM/YYYY")}
              </div>
            </div>
            <div className="custom-content-list__info__in__item">
              <div className="custom-content-list__info__in__item-title">
                Поставщик
              </div>
              <div className="custom-content-list__info__in__item-body">
                {arrivalInfo.data.supplier
                  ? arrivalInfo.data.supplier.name
                  : "-"}
              </div>
            </div>
            <div className="custom-content-list__info__in__item">
              <div className="custom-content-list__info__in__item-title">
                Филиал
              </div>
              <div className="custom-content-list__info__in__item-body">
                {arrivalInfo.data.branch.name}
              </div>
            </div>
            <div className="custom-content-list__info__in__item">
              <div className="custom-content-list__info__in__item-title">
                Номер заказа
              </div>
              <div className="custom-content-list__info__in__item-body">
                {arrivalInfo.data.purchaseOrder
                  ? arrivalInfo.data.purchaseOrder.code
                  : "-"}
              </div>
            </div>
            <div className="custom-content-list__info__in__item">
              <div className="custom-content-list__info__in__item-title">
                Сумма
              </div>
              <div className="custom-content-list__info__in__item-body">
                {formatPriceProduct(arrivalTotal)} сум
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="custom-content-list__content-title">Список товаров</div>
      <div className="custom-content-list__content">
        <Table
          order={true}
          headers={headers}
          data={data}
          isLoading={arrivalInfo.loading}
        />
      </div>
    </div>
  );
};

export default ArrivalInfo;
