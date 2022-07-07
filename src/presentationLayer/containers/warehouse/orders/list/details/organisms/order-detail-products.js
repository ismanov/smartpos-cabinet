import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import * as actions from "../../actions";
import * as constants from "../constatns";

import Ordering from "../../../ordering";
import { OrderDetailProductsTable } from "./order-detail-products-table";
import { Button, CircularProgress } from "@material-ui/core";
import { dateDiffernce } from "../../../../../../../utils/dateDiffernce";

import withNotification from "../../../../../../hocs/withNotification/WithNotification";
import QuestionDialog from "../../../../../../components/Dialog/question";
import { RejectOrderModal } from "./reject-order-modal";
import * as orderingActions from "../../../ordering/actions";
import moment from "moment";

export const OrderDetailProducts = withNotification((props) => {
  const ordersListStore = useSelector(state => state.get("ordersList"));
  const orderingStore = useSelector(state => state.get("ordering"));
  const dispatch = useDispatch();

  const { confirmOrder } = ordersListStore;
  const { updateOrder, deleteDraftOrder } = orderingStore;
  const { orderDetailsData } = props;

  const [ editMode, setEditMode ] = useState(false);
  const [ confirmOrderDialog, setConfirmOrderDialog ] = useState(false);
  const [ addModalProps, setAddModalProps ] = useState({
    visible: false,
    shouldRender: false
  });

  useEffect(() => {
    if (updateOrder.success) {
      setEditMode(false);

      dispatch(
        actions.getOrderDetailsAction(orderDetailsData.id)
      );
    }
  }, [updateOrder.success]);

  useEffect(() => {
    if (confirmOrder.success) {
      props.success('Заказ принят');

      dispatch(
        actions.resetConfirmOrderAction()
      );

      dispatch(
        actions.getOrderDetailsAction(orderDetailsData.id)
      );
    }
  }, [confirmOrder.success]);

  useEffect(() => {
    if (deleteDraftOrder.success) {
      props.success("Черновик удален");

      dispatch(
        orderingActions.resetDeleteDraftOrderAction()
      );
    }
  }, [ deleteDraftOrder.success ]);

  const list = orderDetailsData.orderItems.map((item) => {
    return {
      ...item,
      selectedUnit: item.unit.id,
      orderItemId: item.id,
      id: item.product.id,
      name: item.product.name,
      productCount: item.qty,
      units: item.units.map((unit) => {
        return {
          ...unit,
          minOrder: unit.unit.id === item.unit.id ? item.minOrder : unit.minOrder,
          price: unit.unit.id === item.unit.id ? item.price : unit.price
        }
      })
    }
  });

  const notesData = orderDetailsData.notes.map((note) => {
    return (
      <div className="order-detail__products__notes__item" key={note.id}>
        <div className="order-detail__products__notes__item__title">
          {note.createdBy}
          <span>{moment(note.createdDate).format('YYYY-MM-DD')}</span>
        </div>
        <div className="order-detail__products__notes__item__body">
          {note.comment}
        </div>
      </div>
    )
  });

  const orderDataToEdit = {
    orderId: orderDetailsData.id,
    statusCode: orderDetailsData.status.code,
    filterProps: {
      supplier: {
        value: orderDetailsData.supplier.id,
        label: orderDetailsData.supplier.name
      },
      branch: {
        value: orderDetailsData.branch.id,
        label: orderDetailsData.branch.name
      },
      paymentCode: orderDetailsData.paymentType.code,
      deliveryCode: orderDetailsData.deliveryType.code,
      orderDate: orderDetailsData.orderDate,
      expectedOrderDate: orderDetailsData.expectedDate,
      orderingDaysCount: dateDiffernce(orderDetailsData.orderDate, orderDetailsData.expectedDate),
      comment: orderDetailsData.description
    },
    list
  };

  const onConfirmOrder = () => {
    const data = {
      id: orderDetailsData.id,
      status: {
        code: "APPROVED"
      }
    };

    dispatch(
      actions.confirmOrderAction(data)
    )
  };

  const onRejectOrder = () => {
    setAddModalProps({ visible: true, shouldRender: true });
  };

  return (
    <div className="order-detail__products">
      {confirmOrder.loading && <div className="abs-loader">
        <CircularProgress color='primary'/>
      </div>}
      {(orderDetailsData.status.code === constants.DRAFT || orderDetailsData.status.code === constants.REVISED_BY_SUPPLIER) && !editMode &&
        <div className="order-detail__products__actions">
          {orderDetailsData.status.code === constants.REVISED_BY_SUPPLIER &&
            <>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => setConfirmOrderDialog(true)}
              >
                Принять
              </Button>
              <QuestionDialog
                open={confirmOrderDialog}
                title=''
                message='Вы действительно хотите принять заказ?'
                onPositive={() => {
                  onConfirmOrder();
                  setConfirmOrderDialog(false);
                }}
                onNegative={() => setConfirmOrderDialog(false)}
                onClose={() => setConfirmOrderDialog(false)}
              />
            </>
          }
          <Button
            variant="outlined"
            color="primary"
            onClick={() => setEditMode(true)}
          >
            Редактировать
          </Button>
          {orderDetailsData.status.code === constants.REVISED_BY_SUPPLIER &&
            <Button
              variant="outlined"
              color="secondary"
              onClick={onRejectOrder}
            >
              Отклонить
            </Button>
          }
        </div>
      }
      {editMode &&
        <div className="order-detail__products__actions">
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => setEditMode(false)}
          >
            Отменить редактирование
          </Button>
        </div>
      }
      {editMode ? <Ordering orderDataToEdit={orderDataToEdit} /> : <OrderDetailProductsTable />}
      {notesData.length > 0 &&
        <>
          <div className="order-detail__products__notes-head">Комментарии</div>
          <div className={`order-detail__products__notes ${notesData.length % 2 === 0 ? "notes-odd" : "notes-even"}`}>
            {notesData}
          </div>
        </>
      }
      {addModalProps.shouldRender && <RejectOrderModal
        orderId={orderDetailsData.id}
        modalProps={addModalProps}
        setModalProps={setAddModalProps}
      />}
    </div>
  )
});