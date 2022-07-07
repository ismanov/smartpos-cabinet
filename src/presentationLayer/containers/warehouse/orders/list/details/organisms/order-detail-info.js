import React from "react";
import { useDispatch } from "react-redux";

import * as actions from "../../actions";

import { IconButton } from "@material-ui/core";
import { formatPriceProduct } from "../../../../../../../utils/format";

import { RefreshSvg } from "../../../../../../../assets/svg/svg-icons";
import moment from "moment";

export const OrderDetailInfo = ({ orderDetailsData }) => {
  const dispatch = useDispatch();

  const onRefreshOrder = () => {
    dispatch(
      actions.resetOrderDetailsAction()
    );

    dispatch(
      actions.getOrderDetailsAction(orderDetailsData.id)
    );
  };

  return (
    <div className="order-detail__info">
      <div className="order-detail__info__left">
        <div className="order-detail__info__item">
          <div className="order-detail__info__item-title">Статус заказа:</div>
          <div className="order-detail__info__item-body">{orderDetailsData.status.nameRu}</div>
        </div>
        <div className="order-detail__info__item">
          <div className="order-detail__info__item-title">Поставщик:</div>
          <div className="order-detail__info__item-body">{orderDetailsData.supplier.name}</div>
        </div>
        <div className="order-detail__info__item">
          <div className="order-detail__info__item-title">Сумма заказа:</div>
          <div className="order-detail__info__item-body">{formatPriceProduct(orderDetailsData.total)} сум</div>
        </div>
        <div className="order-detail__info__item">
          <div className="order-detail__info__item-title">Способ оплаты</div>
          <div className="order-detail__info__item-body">{orderDetailsData.paymentType.nameRu}</div>
        </div>
        <div className="order-detail__info__item">
          <div className="order-detail__info__item-title">Способ доставки</div>
          <div className="order-detail__info__item-body">{orderDetailsData.deliveryType.nameRu}</div>
        </div>
        <div className="order-detail__info__item">
          <div className="order-detail__info__item-title">Дата заказа</div>
          <div className="order-detail__info__item-body">{moment(orderDetailsData.orderDate).format('YYYY-MM-DD')}</div>
        </div>
      </div>
      <div className="order-detail__info__right">
        <IconButton
          color="primary"
          onClick={onRefreshOrder}
        >
          <RefreshSvg />
        </IconButton>
      </div>
    </div>
  )
};