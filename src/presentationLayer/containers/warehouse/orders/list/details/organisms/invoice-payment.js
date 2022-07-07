import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import * as actions from "../../actions";

import {Button, CircularProgress, IconButton, Tooltip} from "@material-ui/core";
import { CloudUpload, Print } from "@material-ui/icons";
import Logic from "../../../../../../../businessLayer";
import withNotification from "../../../../../../hocs/withNotification/WithNotification";
import QuestionDialog from "../../../../../../components/Dialog/question";
import { printIframe } from "../../../../../../../utils/print";

export const InvoicePayment = withNotification( (props) => {
  const ordersListStore = useSelector(state => state.get("ordersList"));
  const dispatch = useDispatch();

  const { invoicePaymentDetails, confirmInvoicePayment } = ordersListStore;

  const { orderId } = props;

  const [ uploadInvoicePaymentloading, setUploadInvoicePaymentloading ] = useState(false);
  const [ confirmInvoicePaymentDialog, setConfirmInvoicePaymentDialog ] = useState(false);

  useEffect(() => {
    dispatch(
      actions.getInvoicePaymentDetailsAction(orderId)
    )
  }, []);

  useEffect(() => {
    if (confirmInvoicePayment.success) {
      props.success('Счет на оплату принят');

      dispatch(
        actions.resetConfirmInvoicePaymentAction()
      );

      dispatch(
        actions.getOrderDetailsAction(orderId)
      );

      dispatch(
        actions.getInvoicePaymentDetailsAction(orderId)
      );
    }
  }, [confirmInvoicePayment.success]);

  const onConfirmInvoicePayment = () => {
    dispatch(
      actions.confirmInvoicePaymentAction({
        id: invoicePaymentDetails.data.id,
        status: {
          code: "ACCEPTED"
        }
      })
    );
  };

  const onPrintInvoicePayment = () => {
    printIframe('ifmcontentstoprint');
  };

   return (
    <div className="order-invoice-payment">
      {(invoicePaymentDetails.loading || confirmInvoicePayment.loading || uploadInvoicePaymentloading) && <div className="abs-loader">
        <CircularProgress color='primary'/>
      </div>}
      {Object.keys(invoicePaymentDetails.data).length > 0 &&
        <>
          <div className="order-invoice-payment__info">
            <div className="order-invoice-payment__info__left">
              <div className="contract-details__item">
                Статус счета на оплату: {invoicePaymentDetails.data.status.nameRu}
              </div>
              {invoicePaymentDetails.data.document &&
                <div className="contract-details__item">
                  <a href={invoicePaymentDetails.data.document.path} target="_blank">Посмотреть прикрепленный файл</a>
                </div>
              }
            </div>
            <div className="order-invoice-payment__info__right">
              <>
                <Tooltip title="Прикрепить файл счета на оплату">
                  <IconButton
                    color="primary"
                    onClick={() => {
                      document.getElementById('file').click();
                    }}
                  >
                    <CloudUpload />
                  </IconButton>
                </Tooltip>
                <input
                  id="file"
                  type="file"
                  style={{display: 'none'}}
                  onChange={(e) => {
                    setUploadInvoicePaymentloading(true);

                    Logic
                      .ordersList
                      .uploadInvoicePayment(e.target.files[0], { id: invoicePaymentDetails.data.id })
                      .then(response => {
                        setUploadInvoicePaymentloading(false);
                        props.success('Файл прикреплен');
                        dispatch(
                          actions.getOrderDetailsAction(orderId)
                        );

                        dispatch(
                          actions.getInvoicePaymentDetailsAction(orderId)
                        )
                      })
                      .catch(error => {
                        setUploadInvoicePaymentloading(false);
                        props.error(error.toString());
                      });
                  }}
                />
              </>
              {invoicePaymentDetails.data.status.code !== "ACCEPTED" &&
                <div className="custom__popover">
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => setConfirmInvoicePaymentDialog(true)}
                  >
                    Подтвердить
                  </Button>
                  <QuestionDialog
                    open={confirmInvoicePaymentDialog}
                    title=''
                    message='Вы действительно хотите подтвердить счет на оплату?'
                    onPositive={() => {
                      onConfirmInvoicePayment();
                      setConfirmInvoicePaymentDialog(false);
                    }}
                    onNegative={() => setConfirmInvoicePaymentDialog(false)}
                    onClose={() => setConfirmInvoicePaymentDialog(false)}
                  />
                </div>
              }
              <IconButton color="primary" onClick={onPrintInvoicePayment}>
                <Print />
              </IconButton>
            </div>
          </div>
          <iframe id="ifmcontentstoprint" width={'100%'} height={800} srcDoc={invoicePaymentDetails.data.template} />
        </>
      }
    </div>
   )
});