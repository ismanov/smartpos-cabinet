import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Button, FormControl, TextField } from "@material-ui/core";

import * as actions from "../../actions";

import CustomDialog from "../../../../../../components/material-components/components/CustomDialog";
import withNotification from "../../../../../../hocs/withNotification/WithNotification";


export const RejectContractModal = withNotification((props) => {
  const { t } = useTranslation();
  const { orderId, contractId, modalProps, setModalProps } = props;

  const ordersListStore = useSelector(state => state.get("ordersList"));

  const dispatch = useDispatch();

  const { rejectContract } = ordersListStore;

  const [formFields, setFormFields] = useState({});
  const [fieldsErrors, setFieldsErrors] = useState({});

  useEffect(() => {
    if (rejectContract.success) {
      props.success("Договор отклонен");

      closeModal();

      dispatch(
        actions.resetRejectContractAction()
      );

      dispatch(
        actions.getOrderDetailsAction(orderId)
      );

      dispatch(
        actions.getContractDetailsAction(orderId)
      );
    }
  }, [rejectContract.success]);


  const closeModal = () => {
    setModalProps({ ...modalProps, visible: false });
  };

  const afterClose = () => {
    setModalProps({ ...modalProps, shouldRender: false });
  };

  const onFormFieldChange = (fields) => {
    setFormFields({ ...formFields, ...fields });
  };

  const onSubmit = (event) => {
    event.preventDefault();

    const notFilledMessage = t("common.notFilledMessage");
    const errors = {};

    if (!formFields.reason) errors.reason = notFilledMessage;

    if (Object.keys(errors).length) {
      setFieldsErrors(errors);
      return;
    }

    setFieldsErrors({});

    const data = {
      id: contractId,
      status: {
        code: "REJECTED"
      },
      reason: formFields.reason
    };

    dispatch(
      actions.rejectContractAction(data)
    )
  };

  return (
    <CustomDialog
      open={modalProps.visible}
      onClose={closeModal}
      onExited={afterClose}
      fullWidth={true}
      maxWidth={"sm"}
      title="Отклонение договора"
      loading={rejectContract.loading}
      error={rejectContract.error}
    >
      <form onSubmit={onSubmit} noValidate autoComplete="off">
        <div>
          <div className="form-field form-field-textarea">
            <FormControl fullWidth component="fieldset">
              <TextField
                multiline={true}
                variant="outlined"
                label="Причина"
                value={formFields.reason || ""}
                onChange={(e) => onFormFieldChange({ reason: e.target.value })}
                error={!!fieldsErrors.reason}
                helperText={fieldsErrors.reason}
              />
            </FormControl>
          </div>
        </div>
        <div className="custom-modal__buttons-row">
          <Button type="submit" onClick={onSubmit} color="primary">
            Отправить
          </Button>
        </div>
      </form>
    </CustomDialog>
  )
});

