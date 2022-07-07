import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from 'react-router-dom';
import moment from "moment";

import * as actions from "../actions";

import {Button, CircularProgress, TextField} from "@material-ui/core";
import withNotification from "../../../../hocs/withNotification/WithNotification";

const nowDate = moment().format('YYYY-MM-DDTHH:mm:ss');

export const ArrivalCreateControls = withNotification( (props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const arrivalCreateDetails = useSelector(state => state.get("arrival").arrivalCreateDetails);

  const { formFields, addArrivalsByOrder, addArrivalsByProduct } = arrivalCreateDetails;

  useEffect(() => {
    if (addArrivalsByOrder.success || addArrivalsByProduct.success) {
      props.success('Товары оприходованы');

      history.push('/main/warehouse/arrival');
    }
  }, [addArrivalsByOrder.success, addArrivalsByProduct.success]);

  const onCommentChange = (val) => {
    dispatch(
      actions.updateArrivalCreateFormFieldsAction({
        description: val
      })
    );
  };

  // const validateForm = () => {
  //   const notFilledMessage = "Не заполнено поле";
  //
  //   const errors = {};
  //
  //   if (!formFields.supplier) errors.supplier = notFilledMessage;
  //
  //   return errors;
  // };

  const onAddArrivals = () => {
    // const errors = validateForm();
    //
    // if (Object.keys(errors).length) {
    //   setArrivalCreateErrors(errors);
    //   return;
    // }
    //
    // setArrivalCreateErrors({});

    const data = {
      supplierId: formFields.supplier ? formFields.supplier.value : undefined,
      branchId: formFields.branch.value,
      description: formFields.description,
      incomeDate: formFields.incomeDate ? formFields.incomeDate : nowDate,
      purchaseOrderId: formFields.arrivalType.value === "ORDER" ? formFields.order.value : undefined,
      items: formFields.arrivalsItems.map((item) => {
        return {
          orderItemId: item.id,
          costPrice: item.costPrice,
          productId: item.productId,
          qty: item.qty,
          markup: item.markup ? item.markup : undefined,
          salesPrice: item.salesPrice ? item.salesPrice : item.customerSalesPrice,
          unitId: item.unit.id
        }
      })
    };

    if (formFields.arrivalType.value === "ORDER") {
      dispatch(
        actions.addArrivalsByOrderAction(data)
      );
    } else {
      dispatch(
        actions.addArrivalsByProductAction(data)
      );
    }
  };

  return (
    <>
      {(addArrivalsByOrder.loading || addArrivalsByProduct.loading) && <div className="abs-loader">
        <CircularProgress color='primary'/>
      </div>}
      <div className="arrival-create__comment">
        <TextField
          variant='outlined'
          label="Оставьте комментарий"
          fullWidth
          multiline={true}
          rows={2}
          value={formFields.description || ""}
          onChange={(e) => onCommentChange(e.target.value)}
        />
      </div>
      <div className="arrival-create__add">
        <Button
          variant="outlined"
          color="primary"
          disabled={!formFields.arrivalsItems.length || Object.keys(formFields.editingProducts).length > 0}
          onClick={onAddArrivals}
        >
          Приходовать
        </Button>
      </div>
    </>
  )
});