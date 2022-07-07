import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import * as actions from "../actions";

import { OrderDetailInfo } from "./organisms/order-detail-info";
import { OrderSteps } from "./organisms/order-steps";

import { CircularProgress, IconButton } from "@material-ui/core";
import { ArrowBackIos } from "@material-ui/icons";

const OrderDetails = (props) => {
  const ordersListStore = useSelector(state => state.get("ordersList"));
  const dispatch = useDispatch();


  const { orderDetails } = ordersListStore;
  const orderId = props.match.params.orderId;

  useEffect(() => {
    dispatch(
      actions.getOrderDetailsAction(orderId)
    );

    return () => {
      dispatch(
        actions.resetOrderDetailsAction()
      )
    }
  }, []);

  return (
    <div className="order-detail">
      <div className="order-detail__head">
        <IconButton color="primary" onClick={() => props.history.push('/main/warehouse/orders/list')}>
          <ArrowBackIos />
        </IconButton>
        <h1 className="section-h1">Заказ №: {orderDetails.data.number}</h1>
      </div>
      <div className="order-detail__in">
        {orderDetails.loading && <div className="abs-loader">
          <CircularProgress color='primary'/>
        </div>}
        {Object.keys(orderDetails.data).length > 0 &&
         <>
           <OrderDetailInfo orderDetailsData={orderDetails.data} />
           <OrderSteps orderDetailsData={orderDetails.data} />
         </>
        }
      </div>
    </div>
  )
};

export default OrderDetails;