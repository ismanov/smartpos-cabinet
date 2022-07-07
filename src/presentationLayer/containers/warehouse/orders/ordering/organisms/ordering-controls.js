import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import NavigationPrompt from "react-router-navigation-prompt";
import moment from "moment";

import * as actions from "../actions";
import * as constants from "../constants";

import { Button, CircularProgress, TextField } from '@material-ui/core';
import QuestionDialog from "../../../../../components/Dialog/question";
import CustomDialog from "../../../../../components/material-components/components/CustomDialog";
import { defineSelectedUnitParams } from "../../../../catalog/supplier/organisms/supplier-catalog-offer-details";

const nowDate = moment().format('YYYY-MM-DDTHH:mm:ss');

export const OrderingControls = (props) => {
  const { t } = useTranslation();
  const orderingStore = useSelector(state => state.get("ordering"));
  const dispatch = useDispatch();
  const history = useHistory();

  const { ordering: orderingData, createOrder, updateOrder, deleteDraftOrder, editingProducts } = orderingStore;
  const { list: productsList, filterProps } = orderingData;

  const { orderErrors, setOrderErrors, orderStatus, orderId } = props;

  const [ leavePage, setLeavePage ] = useState(null);
  const [ confirmDeleteDraft, setConfirmDeleteDraft ] = useState(false);
  const [ confirmReset, setConfirmReset ] = useState(false);
  const [ confirmDraft, setConfirmDraft ] = useState(false);
  const [ confirmOrdering, setConfirmOrdering ] = useState(false);

  useEffect(() => {
    return () => {
      onOrderingReset();
    }
  }, []);

  useEffect(() => {
    if ((createOrder.success || deleteDraftOrder.success) && !leavePage) {
      history.push('/main/warehouse/orders/list');
    }
  }, [ createOrder.success, deleteDraftOrder.success ]);

  useEffect(() => {
    if (leavePage && (createOrder.success)) {
      leavePage.leavePage();
    } // for leave and save draft
  }, [ leavePage, createOrder.success ]);

  const onCommentChange = (val) => {
    dispatch(
      actions.setOrderingFieldsAction({
        comment: val
      })
    );
  };

  const onOrderingReset = () => {
    setOrderErrors({});

    dispatch(
      actions.resetOrderingAction()
    )
  };

  const validateForm = () => {
    const errors = {...orderErrors};

    if (!filterProps.paymentCode) errors.paymentCode = true;
    if (!filterProps.deliveryCode) errors.deliveryCode = true;

    return errors;
  };

  const onCreateOrderData = (status) => {
    const errors = validateForm();

    if (Object.keys(errors).length) {
      if (status === constants.DRAFT) {
        setConfirmDraft(false);
      } else {
        setConfirmOrdering(false);
      }
      setOrderErrors(errors);
      return null;
    }

    setOrderErrors({});

    let total = 0;

    const orderItems = productsList.map((product) => {
      const selectedUnitParams = defineSelectedUnitParams(product.units, product.selectedUnit);

      const { unit, price } = selectedUnitParams;

      const costPrice = price * product.productCount;

      total = total + costPrice;

      return {
        id: product.orderItemId ? product.orderItemId : null,
        productId: product.id,
        qty: product.productCount,
        minOrder: selectedUnitParams.minOrder,
        name: product.name,
        unitId: unit.id,
        price,
        costPrice
      }
    });

    return {
      id: orderId ? orderId : undefined,
      supplierId: filterProps.supplier.value,
      branchId: filterProps.branch.value,
      orderDate: filterProps.orderDate ? filterProps.orderDate : nowDate,
      paymentType: {
        code: filterProps.paymentCode
      },
      deliveryType: {
        code: filterProps.deliveryCode
      },
      status: {
        code: status
      },
      note: {
        comment: filterProps.comment
      },
      orderItems,
      total
    }
  };

  const onConfirmOrder = () => {
    let status;

    if (orderStatus === constants.REVISED_BY_SUPPLIER) {
      status = constants.REVISED_BY_CLIENT;
    } else {
      status = constants.NEW;
    }

    const data = onCreateOrderData(status);

    if (data) {
      if (orderId) {
        dispatch(
          actions.updateOrderAction(data)
        )
      } else {
        dispatch(
          actions.createOrderAction(data)
        )
      }
    }
  };

  const onConfirmDraft = () => {
    const data = onCreateOrderData(constants.DRAFT);

    if (data) {
      if (orderId) {
        dispatch(
          actions.updateOrderAction(data)
        )
      } else {
        dispatch(
          actions.createOrderAction(data)
        )
      }
    }
  };

  const onConfirmDraftLeave = (onConfirm, onCancel) => {
    const data = onCreateOrderData(constants.DRAFT);

    if (data) {
      setLeavePage({
        leavePage: onConfirm
      });

      if (orderId) {
        dispatch(
          actions.updateOrderAction(data)
        )
      } else {
        dispatch(
          actions.createOrderAction(data)
        )
      }
    } else {
      onCancel();
    }
  };

  const onDeleteDraft = () => {
    dispatch(
      actions.deleteDraftOrderAction(orderId)
    )
  };

  return (
    <>
      <div className="ordering__controls">
        <div className="ordering-comment">
          <TextField
            variant='outlined'
            label="Оставьте комментарий"
            fullWidth
            multiline={true}
            rows={2}
            value={filterProps.comment || ""}
            onChange={(e) => onCommentChange(e.target.value)}
          />
        </div>
        <div className="ordering__controls__row">
          <div className="ordering__controls__left">
            {orderStatus === constants.NEW && <div className="custom__popover">
              <Button
                variant="outlined"
                color="primary"
                disabled={!productsList.length || Object.keys(editingProducts).length > 0}
                onClick={() => setConfirmReset(true)}
              >
                Очистить заказ
              </Button>
              <QuestionDialog
                open={confirmReset}
                title=''
                message='Вы действительно хотите очистить заказ?'
                onPositive={() => {
                  onOrderingReset();
                  setConfirmReset(false);
                }}
                onNegative={() => setConfirmReset(false)}
                onClose={() => setConfirmReset(false)}
              />
            </div>
            }
            {orderStatus === constants.DRAFT && <div className="custom__popover">
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => setConfirmDeleteDraft(true)}
              >
                Удалить черновик
              </Button>
              <CustomDialog
                open={confirmDeleteDraft}
                onClose={() => setConfirmDeleteDraft(false)}
                fullWidth={true}
                maxWidth="sm"
                title='Вы действительно хотите удалить черновик?'
                error={deleteDraftOrder.error}
              >
                {deleteDraftOrder.loading && <div className="abs-loader">
                  <CircularProgress color='primary'/>
                </div>}
                <div className="custom-modal__confirm">
                  <Button color='primary' onClick={() => setConfirmDeleteDraft(false)}> {t("common.no")} </Button>
                  <Button color='primary' onClick={onDeleteDraft}> {t("common.yes")} </Button>
                </div>
              </CustomDialog>
            </div>
            }
          </div>
          <div className="ordering__controls__right">
            {orderStatus !== constants.REVISED_BY_SUPPLIER &&
              <div className="custom__popover">
                <Button
                  variant="outlined"
                  color="primary"
                  disabled={!productsList.length || Object.keys(editingProducts).length > 0}
                  onClick={() => setConfirmDraft(true)}
                >
                  {orderStatus === constants.DRAFT ? "Обновить черновик" : "Сохранить как черновик"}
                </Button>
                <CustomDialog
                  open={confirmDraft}
                  onClose={() => setConfirmDraft(false)}
                  fullWidth={true}
                  maxWidth="sm"
                  title={`Вы действительно хотите ${orderStatus === constants.DRAFT ? "обновить" : "сохранить заказ как"} черновик?`}
                  error={orderId ? updateOrder.error : createOrder.error}
                  loading={createOrder.loading || updateOrder.loading}
                >
                  <div className="custom-modal__confirm">
                    <Button color='primary' onClick={() => setConfirmDraft(false)}> {t("common.no")} </Button>
                    <Button color='primary' onClick={onConfirmDraft}> {t("common.yes")} </Button>
                  </div>
                </CustomDialog>
              </div>
            }
            <div className="custom__popover">
              <Button
                variant="outlined"
                color="primary"
                disabled={!productsList.length || Object.keys(editingProducts).length > 0}
                onClick={() => setConfirmOrdering(true)}>
                Оформить
              </Button>
              <CustomDialog
                open={confirmOrdering}
                onClose={() => setConfirmOrdering(false)}
                fullWidth={true}
                maxWidth="sm"
                title="Вы действительно хотите оформить заказ?"
                error={orderId ? updateOrder.error : createOrder.error}
                loading={createOrder.loading || updateOrder.loading}
              >
                <div className="custom-modal__confirm">
                  <Button color='primary' onClick={() => setConfirmOrdering(false)}> {t("common.no")} </Button>
                  <Button color='primary' onClick={onConfirmOrder}> {t("common.yes")} </Button>
                </div>
              </CustomDialog>
            </div>
          </div>
        </div>
      </div>
      {orderStatus === constants.NEW &&
        <NavigationPrompt when={(crntLocation, nextLocation) =>
          (!nextLocation || !nextLocation.pathname.startsWith(crntLocation.pathname)) && productsList.length && !confirmOrdering && !confirmDraft && !confirmDeleteDraft
        }>
          {({onConfirm, onCancel}) => (
            <CustomDialog
              open={true}
              onClose={onCancel}
              fullWidth={true}
              maxWidth="sm"
              title="У вас есть несохраненный заказ"
              error={orderId ? updateOrder.error : createOrder.error}
            >
              <div className="ordering__controls-modal">
                <Button
                  variant="outlined"
                  color='primary'
                  onClick={() => {
                    onConfirm();
                  }}
                >
                  Очистить заказ
                </Button>
                <Button
                  variant="outlined"
                  color='primary'
                  onClick={() => {
                    onConfirmDraftLeave(onConfirm, onCancel)
                  }}
                >
                  Сохранить как черновик
                </Button>
                <Button variant="outlined" color='primary' onClick={onCancel}>Отмена</Button>
              </div>
            </CustomDialog>
          )}
        </NavigationPrompt>
      }
    </>
  )
};