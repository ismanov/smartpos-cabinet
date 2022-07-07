import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  FormControl,
  FormGroup,
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
  FormHelperText,
} from "@material-ui/core";
import { Alert } from '@material-ui/lab';

import CustomDialog from "../../../../components/material-components/components/CustomDialog";
import {
  getLoyaltyCardTypes,
  getLoyaltySystemsItems,

  getAPayUserDetails,
  resetAPayUserDetails,

  getLoyaltyClientLevels,
  resetLoyaltyClientLevels,

  addLoyaltyClient,
  resetAddLoyaltyClient,
} from "../../redux/actions";
import { cardTypesCodes } from "../../redux/constants";
import withNotification from "../../../../hocs/withNotification/WithNotification";
import PhoneTextField from "../../../../components/Textfields/phone";
import SelectBox from "../../../../components/Select";
import "./styles.scss";

const systemsFieldsByType = {
  [cardTypesCodes.CUMULATIVE]: "cumulativeLoyaltyId",
  [cardTypesCodes.DISCOUNT]: "discountLoyaltyId",
  [cardTypesCodes.CREDIT]: "creditLoyaltyId",
};

const levelsFieldsByType = {
  [cardTypesCodes.CUMULATIVE]: "cumulativeCardId",
  [cardTypesCodes.DISCOUNT]: "discountCardId",
  [cardTypesCodes.CREDIT]: "creditCardId",
};

export const AddLoyaltyClientModal = withNotification((props) => {
  const { modalProps, setModalProps, callBack } = props;

  const { t } = useTranslation();
  const dispatch = useDispatch();

  const $loyaltyCardTypes = useSelector(state => state.get("loyalty").loyaltyCardTypes);
  const $loyaltySystemsItems = useSelector(state => state.get("loyalty").loyaltySystemsItems);
  const $loyaltyClientLevels = useSelector(state => state.get("loyalty").loyaltyClientLevels);
  const $aPayUserDetails = useSelector(state => state.get("loyalty").aPayUserDetails);

  const $addLoyaltyClient = useSelector(state => state.get("loyalty").addLoyaltyClient);

  const loyaltyCardTypes = $loyaltyCardTypes.data;
  const { data: aPayUserDetails, error: aPayUserDetailsError } = $aPayUserDetails;

  const [formFields, setFormFields] = useState({ [cardTypesCodes.CUMULATIVE]: true });
  const [fieldsErrors, setFieldsErrors] = useState({});

  console.log("$loyaltyClientLevels", $loyaltyClientLevels);

  const systemName = {
    [cardTypesCodes.CUMULATIVE]: t("loyalty.addClientCUMULATIVESystem"),
    [cardTypesCodes.DISCOUNT]: t("loyalty.addClientDISCOUNTSystem"),
    [cardTypesCodes.CREDIT]: t("loyalty.addClientCREDITSystem"),
  };

  useEffect(() => {
    if (!loyaltyCardTypes.length) {
      dispatch(getLoyaltyCardTypes());
    }
    if (!$loyaltySystemsItems.data) {
      dispatch(getLoyaltySystemsItems());
    }
  }, []);

  useEffect(() => {
    if ($addLoyaltyClient.success) {
      props.success(t("loyalty.addClientSuccess"));
      if (callBack) {
        callBack();
      }
      closeModal();
    }
  }, [$addLoyaltyClient.success]);


  const closeModal = () => {
    setModalProps({ ...modalProps, visible: false });
  };

  const afterClose = () => {
    dispatch(resetAddLoyaltyClient());
    dispatch(resetAPayUserDetails());
    dispatch(resetLoyaltyClientLevels());
    setModalProps({ ...modalProps, shouldRender: false });
  };

  const onFormFieldChange = (fields) => {
    setFormFields({ ...formFields, ...fields });
  };

  const onLoginChange = (_, login) => {
    onFormFieldChange({ login });

    if (login.length === 12) {
      dispatch(getAPayUserDetails(login));
    } else {
      dispatch(resetAPayUserDetails());
    }
  };

  const onSystemChange = (systemId, systemField, loyaltyType) => {
    onFormFieldChange({ [systemField]: systemId });

    if (systemId) {
      dispatch(getLoyaltyClientLevels(systemId, loyaltyType));
    }
  };

  const onSubmit = (event) => {
    event.preventDefault();

    const notFilledMessage = t("common.notFilledMessage");
    const errors = {};

    if (!formFields.login || formFields.login.length !== 12) errors.login = notFilledMessage;
    if (!aPayUserDetails) errors.login = "Пользователь не найден";
    if (!formFields.description) errors.description = notFilledMessage;

    let findAnyCardType = false;
    loyaltyCardTypes.forEach((item) => {
      if (formFields[item.code]) {
        findAnyCardType = true;

        const systemField = systemsFieldsByType[item.code];
        const levelField = levelsFieldsByType[item.code];
        if (!formFields[systemField]) errors[systemField] = notFilledMessage;
        if (!formFields[levelField]) errors[levelField] = notFilledMessage;
      }
    });

    if (!findAnyCardType) {
      errors.cardType = notFilledMessage;
    }

    setFieldsErrors(errors);

    if (Object.keys(errors).length) {
      return;
    }



    const data = {
      cardUserDTO: aPayUserDetails,
      description: formFields.description,
    };

    loyaltyCardTypes.forEach((item) => {
      if (formFields[item.code]) {
        const systemField = systemsFieldsByType[item.code];
        const levelField = levelsFieldsByType[item.code];

        data[systemField] = formFields[systemField];
        data[levelField] = formFields[levelField];
      }
    });

    console.log("addLoyaltyClient", data);

    dispatch(addLoyaltyClient(data));
  };

  return (
    <CustomDialog
      className="add-loyalty-client"
      open={modalProps.visible}
      onClose={closeModal}
      onExited={afterClose}
      fullWidth={true}
      maxWidth="sm"
      title={t("loyalty.addClient")}
      error={$addLoyaltyClient.error}
    >
      <form onSubmit={onSubmit} noValidate autoComplete="off">
        <div>
          <div className="form-field">
            <FormControl component="fieldset" error={!!fieldsErrors.cardType}>
              <FormLabel component="legend">{t("loyalty.addCardType")}</FormLabel>
              <FormGroup row>
                {loyaltyCardTypes.map((item) => (
                  <FormControlLabel
                    key={item.code}
                    control={
                      <Checkbox
                        checked={!!formFields[item.code]}
                        onChange={(event) => onFormFieldChange({ [item.code]: event.target.checked })}
                        color="primary"
                      />
                    }
                    label={item.nameRu}
                  />
                ))}
              </FormGroup>
              {fieldsErrors.cardType && <FormHelperText>{fieldsErrors.cardType}</FormHelperText>}
            </FormControl>
          </div>
          <div className="form-field">
            <FormControl fullWidth component="fieldset">
              <PhoneTextField
                value={formFields.login}
                onPhoneChange={onLoginChange}
                error={!!fieldsErrors.login}
                helperText={fieldsErrors.login}
              />
            </FormControl>
            {aPayUserDetails && <div className="add-loyalty-client__user_info">
              <Alert severity="info">
                {aPayUserDetails.firstName} {aPayUserDetails.lastName}
              </Alert>
            </div>}
            {aPayUserDetailsError && <div className="add-loyalty-client__user_error">
              <Alert severity="error">
                {aPayUserDetailsError.title}
              </Alert>
            </div>}
          </div>

          {!!$loyaltySystemsItems.data && loyaltyCardTypes.map((item) => {
            const loyaltyType = item.code;
            const systems = $loyaltySystemsItems.data[loyaltyType] || [];
            const systemField = systemsFieldsByType[loyaltyType];

            const levels = $loyaltyClientLevels.data[loyaltyType] || [];
            const levelField = levelsFieldsByType[loyaltyType];

            return (
              <>
                <div key={item.code} className="form-field">
                  <SelectBox
                    itemKey="id"
                    itemValue="name"
                    labelWidth={180}
                    label={systemName[loyaltyType]}
                    data={systems.map(item => ({ id: item.id, name: item.name }))}
                    onChange={(event) => onSystemChange(event.target.value, systemField, loyaltyType)}
                    value={formFields[systemField]}
                    error={!!fieldsErrors[systemField]}
                    helperText={fieldsErrors[systemField]}
                    disabled={!formFields[loyaltyType]}
                  />
                </div>
                <div key={item.code} className="form-field">
                  <SelectBox
                    itemKey="id"
                    itemValue="name"
                    labelWidth={240}
                    label={`${t("loyalty.addClientLevel")} (${item.nameRu} ${t("loyalty.addClientLevel2")})`}
                    data={levels.map(item => ({ id: item.id, name: `${item.name} ${item.percent ? item.percent+ "%" : ""}` }))}
                    onChange={(event) => onFormFieldChange({ [levelField]: event.target.value })}
                    value={formFields[levelField]}
                    error={!!fieldsErrors[levelField]}
                    helperText={fieldsErrors[levelField]}
                    disabled={!formFields[loyaltyType]}
                  />
                </div>
              </>
            );
          })}

          <div className="form-field">
            <FormControl fullWidth component="fieldset">
              <TextField
                variant="outlined"
                label={t("loyalty.addClientDescription")}
                value={formFields.description}
                onChange={(e) => onFormFieldChange({ description: e.target.value })}
                error={!!fieldsErrors.description}
                helperText={fieldsErrors.description}
                multiline
                rows={4}
              />
            </FormControl>
          </div>
        </div>
        <div className="custom-modal__buttons-row">
          <Button type="submit" onClick={onSubmit} color="primary">{t("loyalty.addClientSubmit")}</Button>
        </div>
      </form>
    </CustomDialog>
  )
});