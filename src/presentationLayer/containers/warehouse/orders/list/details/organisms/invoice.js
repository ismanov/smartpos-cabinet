import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import * as actions from "../../actions";

import withNotification from "../../../../../../hocs/withNotification/WithNotification";
import {Button, CircularProgress, IconButton} from "@material-ui/core";
import { Print } from "@material-ui/icons";
import { printIframe } from "../../../../../../../utils/print";

export const Invoice =  withNotification((props) => {
  const ordersListStore = useSelector(state => state.get("ordersList"));
  const dispatch = useDispatch();

  const { invoiceDetails, checkInvoiceStatus } = ordersListStore;

  const { orderId } = props;
  
  useEffect(() => {
    dispatch(
      actions.getInvoiceDetailsAction(orderId)
    )
  }, []);

  useEffect(() => {
    if (checkInvoiceStatus.success) {
      props.success('Статус обновлен');

      dispatch(
        actions.getOrderDetailsAction(orderId)
      );

      dispatch(
        actions.getInvoiceDetailsAction(orderId)
      );

      dispatch(
        actions.resetCheckInvoiceStatusAction()
      );
    }
  }, [checkInvoiceStatus.success]);

  const onCheckInvoiceStatus = () => {
    dispatch(
      actions.checkInvoiceStatusAction(invoiceDetails.data.id)
    )
  };

  const onPrintInvoice = () => {
    printIframe('ifmcontentstoprint');
  };

  return (
    <div className="order-invoice">
      {invoiceDetails.loading && <div className="abs-loader">
        <CircularProgress color='primary'/>
      </div>}
      {Object.keys(invoiceDetails.data).length > 0 &&
        <>
          <div className="order-invoice__info">
            <div className="order-invoice__info__left">
              <div>
                Статус счет фактуры: {invoiceDetails.data.status.nameRu}
              </div>
            </div>
            <div className="order-invoice__info__right">
              <Button
                disabled={checkInvoiceStatus.loading}
                variant="outlined"
                color='primary'
                onClick={onCheckInvoiceStatus}
              >
                Проверить статус
              </Button>
              <IconButton color="primary" onClick={onPrintInvoice}>
                <Print />
              </IconButton>
            </div>
          </div>
          <iframe id="ifmcontentstoprint" width={'100%'} height={700} srcDoc={invoiceDetails.data.template}/>
        </>
      }
    </div>
  )
});