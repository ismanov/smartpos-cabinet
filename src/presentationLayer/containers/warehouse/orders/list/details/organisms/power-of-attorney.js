import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import * as actions from "../../actions";

import {
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField
} from "@material-ui/core";
import DatePicker from "../../../../../../components/Pickers/datepicker";
import { Print } from "@material-ui/icons";
import { printIframe } from "../../../../../../../utils/print";
import moment from "moment";
import withNotification from "../../../../../../hocs/withNotification/WithNotification";
import QuestionDialog from "../../../../../../components/Dialog/question";
import { disableOldDates } from "../../../../../../../utils/disableOldDates";

export const PowerOfAttorney =  withNotification((props) => {
  const ordersListStore = useSelector(state => state.get("ordersList"));
  const dispatch = useDispatch();

  const { powerOfAttorneyDetails, currentResponsiblePersonItems, createPowerOfAttorney, receiveOrder } = ordersListStore;

  const { orderDetailsData } = props;

  const [ formFields, setFormFields ] = useState({
    contractNumber: orderDetailsData.contract.number,
    contractStartDate: orderDetailsData.contract.startDate,
    responsiblePerson: {
      type: "NEW"
    }
  });

  const [ fieldsErrors, setFieldsErrors ] = useState({});

  const [ orderReceivedDialog, setOrderReceivedDialog ] = useState(false);

  useEffect(() => {
    dispatch(
      actions.getPowerOfAttorneyDetailsAction(orderDetailsData.id)
    )
  }, []);

  useEffect(() => {
    if (createPowerOfAttorney.success) {
      props.success('Доверенность создана');

      dispatch(
        actions.resetCreatePowerOfAttorneyAction()
      );

      dispatch(
        actions.getOrderDetailsAction(orderDetailsData.id)
      );

      dispatch(
        actions.getPowerOfAttorneyDetailsAction(orderDetailsData.id)
      )
    }
  }, [createPowerOfAttorney.success]);

  useEffect(() => {
    if (receiveOrder.success) {
      props.success('Товары получены');

      dispatch(
        actions.resetReceiveOrderAction()
      );

      dispatch(
        actions.getOrderDetailsAction(orderDetailsData.id)
      );

      dispatch(
        actions.getPowerOfAttorneyDetailsAction(orderDetailsData.id)
      )
    }
  }, [receiveOrder.success]);


  const onReceiveOrder = () => {
    const data = {
      id: orderDetailsData.id,
      status: {
        code: "RECEIVED"
      }
    };

    dispatch(
      actions.receiveOrderAction(data)
    )
  };

  const onPrintPowerOfAttorney = () => {
    printIframe('ifmcontentstoprint');
  };

  const onFormFieldChange = (prop, val, propChild) => {
    if (propChild) {
      setFormFields({
        ...formFields,
        [prop]: {
          ...formFields[prop],
          [propChild]: val
        }
      });
    } else {
      setFormFields({
        ...formFields,
        [prop]: val
      });
    }
  };

  const onPassportSeriesChange = (value) => {
    if (value.length < 3) {
      setFormFields({
        ...formFields,
        responsiblePerson: {
          ...formFields.responsiblePerson,
          passportSeries: value
        }
      });
    }
  };

  const onPassportNumberChange = (value) => {
    if (value.length < 8) {
      setFormFields({
        ...formFields,
        responsiblePerson: {
          ...formFields.responsiblePerson,
          passportNumber: value
        }
      });
    }
  };

  const onChangeDate = (prop, date, propChild) => {
    const dateFormat = moment(date).format('YYYY-MM-DDTHH:mm:ss');

    onFormFieldChange(prop, dateFormat, propChild);
  };

  const onStartDateChange = (date) => {
    const dateFormat = moment(date).format('YYYY-MM-DDTHH:mm:ss');

    const myObj = {
      startDate: dateFormat
    };

    if (!disableOldDates(dateFormat, formFields.expiryDate)) {
      myObj["expiryDate"] = null;
    }

    setFormFields({
      ...formFields,
      ...myObj
    });
  };

  const validateForm = () => {
    const notFilledMessage = "Не заполнено поле";
    const passportSeriesFilledMessage = "Кол-во симв. 2";
    const passportNumberFilledMessage = "Кол-во симв. 7";

    const errors = {};

    if (!formFields.startDate) errors.startDate = notFilledMessage;
    if (!formFields.expiryDate) errors.expiryDate = notFilledMessage;

    if (!formFields.responsiblePerson.fullName) errors.fullName = notFilledMessage;
    if (!formFields.responsiblePerson.position) errors.position = notFilledMessage;

    if (!formFields.responsiblePerson.passportSeries || formFields.responsiblePerson.passportSeries.length !== 2) errors.passportSeries = passportSeriesFilledMessage;
    if (!formFields.responsiblePerson.passportNumber || formFields.responsiblePerson.passportNumber.length !== 7) errors.passportNumber = passportNumberFilledMessage;

    if (!formFields.responsiblePerson.issueBy) errors.issueBy = notFilledMessage;
    if (!formFields.responsiblePerson.issueDate) errors.issueDate = notFilledMessage;

    return errors;
  };

  const onSubmit = () => {
    const errors = validateForm();

    if (Object.keys(errors).length) {
      setFieldsErrors(errors);
      return;
    }

    setFieldsErrors({});

    const data = {
      expiryDate: formFields.expiryDate,
      purchaseOrderId: orderDetailsData.id,
      responsiblePerson: {
        fullName: formFields.responsiblePerson.fullName,
        issueBy: formFields.responsiblePerson.issueBy,
        issueDate: formFields.responsiblePerson.issueDate,
        passportNumber: formFields.responsiblePerson.passportSeries + formFields.responsiblePerson.passportNumber,
        position: formFields.responsiblePerson.position
      },
      startDate: formFields.startDate
    };

    dispatch(
      actions.createPowerOfAttorneyAction(data)
    )
  };

  return (
    <div className="power-of-attorney">
      <div className="power-of-attorney__info">
        <div className="power-of-attorney__info__left">
          {Object.keys(powerOfAttorneyDetails.data).length > 0 &&
            <div>
              Статус доверенности: {powerOfAttorneyDetails.data.status.nameRu}
            </div>
          }
        </div>
        <div className="power-of-attorney__info__right">
          {(Object.keys(powerOfAttorneyDetails.data).length > 0 && orderDetailsData.status.code === "WAITING_FOR_CONFIRM_PRODUCT_RECEIVE") &&
            <div className="custom__popover">
              <Button
                variant="outlined"
                color="primary"
                onClick={() => setOrderReceivedDialog(true)}
              >
                Товары получены
              </Button>
              <QuestionDialog
                open={orderReceivedDialog}
                title=''
                message='Вы уверены что товары получены?'
                onPositive={() => {
                  onReceiveOrder();
                  setOrderReceivedDialog(false);
                }}
                onNegative={() => setOrderReceivedDialog(false)}
                onClose={() => setOrderReceivedDialog(false)}
              />
            </div>
          }
          {Object.keys(powerOfAttorneyDetails.data).length > 0 &&
            <IconButton color="primary" onClick={onPrintPowerOfAttorney}>
              <Print />
            </IconButton>
          }
        </div>
      </div>
      {!orderDetailsData.powerOfAttorney ?
        <div className="power-of-attorney__form">
          <div className="power-of-attorney__form__title">Доверенность</div>
          <div className="power-of-attorney__form__double-row">
            <div className={`power-of-attorney__form__item ${fieldsErrors.startDate ? "field-error": ""}`}>
              <DatePicker
                label="Дата начала"
                onChange={onStartDateChange}
                value={formFields.startDate || null}
                shouldDisableDate={(date) => disableOldDates(date, moment(formFields.contractStartDate).format('YYYY-MM-DD'))}
              />
              <div className="form-field-note">{fieldsErrors.startDate}</div>
            </div>
            <div className={`power-of-attorney__form__item ${fieldsErrors.expiryDate ? "field-error": ""}`}>
              <DatePicker
                label="Дата окончания"
                onChange={(date) => onChangeDate("expiryDate", date)}
                value={formFields.expiryDate || null}
                shouldDisableDate={(date) => disableOldDates(date, moment(formFields.startDate).format('YYYY-MM-DD'))}
              />
              <div className="form-field-note">{fieldsErrors.expiryDate}</div>
            </div>
          </div>
          <div className="power-of-attorney__form__double-row">
            <div className="power-of-attorney__form__item">
              <TextField
                disabled={true}
                variant="outlined"
                label="Номер договора"
                value={formFields.contractNumber}
              />
            </div>
            <div className="power-of-attorney__form__item">
              <DatePicker
                disabled={true}
                label="Дата договора"
                value={formFields.contractStartDate}
              />
            </div>
          </div>
          <div className="power-of-attorney__form__title">Ответственное лицо</div>
          <div className="power-of-attorney__form__triple-row">
            <div className="power-of-attorney__form__item">
              <FormControl fullWidth variant='outlined' style={{padding: 0}}>
                <InputLabel>Отв. лицо</InputLabel>
                <Select
                  input={<OutlinedInput labelWidth={150}/>}
                  value={formFields.responsiblePerson.type}
                  onChange={(e) => onFormFieldChange("responsiblePerson", e.target.value, "type")}
                >
                  <MenuItem value="NEW">Новый</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div className={`power-of-attorney__form__item ${fieldsErrors.fullName ? "field-error": ""}`}>
              <div>
                <TextField
                  variant="outlined"
                  label="ФИО"
                  value={formFields.responsiblePerson.fullName}
                  onChange={(e) => onFormFieldChange("responsiblePerson", e.target.value, "fullName")}
                />
                <div className="form-field-note">{fieldsErrors.fullName}</div>
              </div>
            </div>
            <div className={`power-of-attorney__form__item ${fieldsErrors.position ? "field-error": ""}`}>
              <div>
                <TextField
                  variant="outlined"
                  label="Должность"
                  value={formFields.responsiblePerson.position}
                  onChange={(e) => onFormFieldChange("responsiblePerson", e.target.value, "position")}
                />
                <div className="form-field-note">{fieldsErrors.position}</div>
              </div>
            </div>
          </div>
          <div className="power-of-attorney__form__title">Пасспортные данные</div>
          <div className="power-of-attorney__form__triple-row">
            <div className="power-of-attorney__form__item">
              <div className={`power-of-attorney__form__item-l ${fieldsErrors.passportSeries ? "field-error": ""}`}>
                <TextField
                  variant="outlined"
                  label="Серия"
                  value={formFields.responsiblePerson.passportSeries}
                  onChange={(e) => onPassportSeriesChange(e.target.value)}
                />
                <div className="form-field-note">{fieldsErrors.passportSeries}</div>
              </div>
              <div className={`power-of-attorney__form__item-r ${fieldsErrors.passportNumber ? "field-error": ""}`}>
                <TextField
                  variant="outlined"
                  label="Номер"
                  value={formFields.responsiblePerson.passportNumber}
                  onChange={(e) => onPassportNumberChange(e.target.value.replace(/[^0-9]/g, ''))}
                />
                <div className="form-field-note">{fieldsErrors.passportNumber}</div>
              </div>
            </div>
            <div className={`power-of-attorney__form__item ${fieldsErrors.issueBy ? "field-error": ""}`}>
              <div>
                <TextField
                  variant="outlined"
                  label="Кем выдан"
                  value={formFields.responsiblePerson.issueBy}
                  onChange={(e) => onFormFieldChange("responsiblePerson", e.target.value, "issueBy")}
                />
                <div className="form-field-note">{fieldsErrors.issueBy}</div>
              </div>
            </div>
            <div className={`power-of-attorney__form__item ${fieldsErrors.issueDate ? "field-error": ""}`}>
              <div>
                <DatePicker
                  label="Дата выдачи"
                  onChange={(date) => onChangeDate("responsiblePerson", date, "issueDate")}
                  value={formFields.responsiblePerson.issueDate || null}
                />
                <div className="form-field-note">{fieldsErrors.issueDate}</div>
              </div>
            </div>
          </div>
          <div className="power-of-attorney__form__submit">
            <Button variant="outlined" color="primary" onClick={onSubmit}>Сохранить</Button>
          </div>
        </div>
        :
        <iframe id="ifmcontentstoprint" width={'100%'} height={1300} srcDoc={powerOfAttorneyDetails.data.template} />
      }
    </div>
  )
});