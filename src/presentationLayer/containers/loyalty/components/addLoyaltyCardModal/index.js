import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  FormControl,
  RadioGroup,
  FormLabel,
  FormControlLabel,
  TextField,
  Radio,
  Checkbox,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormHelperText
} from "@material-ui/core";


import CustomDialog from "../../../../components/material-components/components/CustomDialog";
import {
  getLoyaltyCardDetails,
  getLoyaltyCardTypes,
  addLoyaltyCard,
  resetAddLoyaltyCard,
  updateLoyaltyCard,
  resetUpdateLoyaltyCard,
  resetLoyaltyCardDetails
} from "../../redux/actions";
import { cardTypesCodes } from "../../redux/constants";
import withNotification from "../../../../hocs/withNotification/WithNotification";
import NumberTextField from "../../../../components/Textfields/NumberTextField";


export const AddLoyaltyCardModal = withNotification((props) => {
  const { modalProps, setModalProps, callBack } = props;
  const { cardId } = modalProps;

  const { t } = useTranslation();
  const dispatch = useDispatch();

  const $loyaltyCardDetails = useSelector(state => state.get("loyalty").loyaltyCardDetails);
  const $loyaltyCardTypes = useSelector(state => state.get("loyalty").loyaltyCardTypes);
  const $addLoyaltyCard = useSelector(state => state.get("loyalty").addLoyaltyCard);
  const $updateLoyaltyCard = useSelector(state => state.get("loyalty").updateLoyaltyCard);

  const [formFields, setFormFields] = useState({ cardType: cardTypesCodes.CUMULATIVE });
  const [fieldsErrors, setFieldsErrors] = useState({});

  const loyaltyCardDetails = $loyaltyCardDetails.data;


  useEffect(() => {
    if (cardId) {
      dispatch(getLoyaltyCardDetails(cardId));
    }

    if (!$loyaltyCardTypes.data.length) {
      dispatch(getLoyaltyCardTypes());
    }
  }, []);

  useEffect(() => {
    if (cardId && loyaltyCardDetails) {
      setFormFields({
        cardType: loyaltyCardDetails.cardType.code,
        name: loyaltyCardDetails.name,
        minAmount: loyaltyCardDetails.minAmount,
        withCheck: loyaltyCardDetails.withCheck,
        creditAmount: loyaltyCardDetails.creditAmount,
        percent: loyaltyCardDetails.percent,
        firstTimeAccrual: loyaltyCardDetails.firstTimeAccrual,
      });
    }
  }, [loyaltyCardDetails]);

  useEffect(() => {
    if ($addLoyaltyCard.success) {
      props.success(t("loyalty.addCardSuccess"));
      if (callBack) {
        callBack();
      }
      closeModal();
    }
  }, [$addLoyaltyCard.success]);

  useEffect(() => {
    if ($updateLoyaltyCard.success) {
      props.success(t("loyalty.updateCardSuccess"));
      if (callBack) {
        callBack();
      }
      closeModal();
    }
  }, [$updateLoyaltyCard.success]);


  const closeModal = () => {
    setModalProps({ ...modalProps, visible: false });
  };

  const afterClose = () => {
    if (cardId) {
      dispatch(resetUpdateLoyaltyCard());
      dispatch(resetLoyaltyCardDetails());
    } else {
      dispatch(resetAddLoyaltyCard());
    }
    setModalProps({ ...modalProps, shouldRender: false, cardId: null });
  };

  const onFormFieldChange = (fields) => {
    setFormFields({ ...formFields, ...fields });
  };

  const onSubmit = (event) => {
    event.preventDefault();

    const notFilledMessage = t("common.notFilledMessage");
    const errors = {};

    if (!formFields.name) errors.name = notFilledMessage;
    if (!formFields.minAmount) errors.minAmount = notFilledMessage;

    if (formFields.cardType === cardTypesCodes.CREDIT) {
      if (!formFields.creditAmount) errors.creditAmount = notFilledMessage;
    } else {
      if (!formFields.percent) errors.percent = notFilledMessage;
    }

    if (Object.keys(errors).length) {
      setFieldsErrors(errors);
      return;
    }

    setFieldsErrors({});

    const data = {
      cardType: formFields.cardType,
      name: formFields.name,
      minAmount: formFields.minAmount,
      withCheck: !!formFields.withCheck,
    };

    if (formFields.cardType === cardTypesCodes.CREDIT) {
      data.creditAmount = formFields.creditAmount;
    } else {
      data.percent = formFields.percent;
      data.firstTimeAccrual = !!formFields.firstTimeAccrual;
    }

    if (cardId) {
      data.id = cardId;
      dispatch(updateLoyaltyCard(data));
    } else {
      dispatch(addLoyaltyCard(data));
    }
  };

  return (
    <CustomDialog
      open={modalProps.visible}
      onClose={closeModal}
      onExited={afterClose}
      fullWidth={true}
      maxWidth={"sm"}
      title={cardId ? t("loyalty.edit"): t("loyalty.addCard")}
      loading={$addLoyaltyCard.loading || $updateLoyaltyCard.loading || $loyaltyCardDetails.loading}
      error={$addLoyaltyCard.error || $updateLoyaltyCard.error}
    >
      <form onSubmit={onSubmit} noValidate autoComplete="off">
        <div>
          <div className="form-field">
            <FormControl component="fieldset">
              <FormLabel component="legend">{t("loyalty.addCardType")}</FormLabel>
              <RadioGroup
                value={formFields.cardType}
                onChange={(e) => onFormFieldChange({ cardType: e.target.value })}
              >
                <div>
                  {$loyaltyCardTypes.data.map((item) => (
                    <FormControlLabel
                      key={item.code}
                      value={item.code}
                      control={<Radio color="primary" />}
                      label={item.nameRu}
                    />
                  ))}
                </div>
              </RadioGroup>
            </FormControl>
          </div>
          <div className="form-field">
            <FormControl fullWidth component="fieldset">
              <TextField
                variant="outlined"
                label={`${t("loyalty.addCardName")} *`}
                value={formFields.name || ""}
                onChange={(e) => onFormFieldChange({ name: e.target.value })}
                error={!!fieldsErrors.name}
                helperText={fieldsErrors.name}
              />
            </FormControl>
          </div>
          {formFields.cardType !== cardTypesCodes.CREDIT && <div className="form-field">
            <FormControl fullWidth>
              <NumberTextField
                variant="outlined"
                label={`${t("loyalty.addCardPercent")} *`}
                value={formFields.percent}
                onChange={(e) => onFormFieldChange({ percent: e.target.value })}
                error={!!fieldsErrors.percent}
                helperText={fieldsErrors.percent}
              />
            </FormControl>
          </div>}
          <div className="form-field">
            <FormControl fullWidth component="fieldset">
              <NumberTextField
                variant="outlined"
                label={`${t("loyalty.addCardMinAmount")} *`}
                value={formFields.minAmount}
                onChange={(e) => onFormFieldChange({ minAmount: e.target.value })}
                error={!!fieldsErrors.minAmount}
                helperText={fieldsErrors.minAmount}
              />
            </FormControl>
          </div>
          {formFields.cardType === cardTypesCodes.CREDIT && <div className="form-field">
            <FormControl fullWidth component="fieldset">
              <NumberTextField
                variant="outlined"
                label={`${t("loyalty.addCardCreditAmount")} *`}
                value={formFields.creditAmount}
                onChange={(e) => onFormFieldChange({ creditAmount: e.target.value })}
                error={!!fieldsErrors.creditAmount}
                helperText={fieldsErrors.creditAmount}
              />
            </FormControl>
          </div>}
          <div className="form-field">
            {formFields.cardType !== cardTypesCodes.CREDIT && <div>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formFields.firstTimeAccrual}
                    color="primary"
                    onChange={(_, checked) => onFormFieldChange({ firstTimeAccrual: checked })}
                  />
                }
                label={t("loyalty.addCardFirstTime")}
              />
            </div>}
            <div>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formFields.withCheck}
                    color="primary"
                    onChange={(_, checked) => onFormFieldChange({ withCheck: checked })}
                  />
                }
                label={t("loyalty.addCardWithCheck")}
              />
            </div>
          </div>
        </div>
        <div className="custom-modal__buttons-row">
          <Button type="submit" onClick={onSubmit} color="primary">
            {cardId ? t("loyalty.save") : t("loyalty.add")}
          </Button>
        </div>
      </form>
    </CustomDialog>
  )
});

