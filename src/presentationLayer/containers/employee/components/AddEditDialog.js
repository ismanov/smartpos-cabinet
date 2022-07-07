import React, { useState, useEffect } from "react";
import {
  Grid,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  TextField,
} from "@material-ui/core";
import PhoneTextField from "../../../components/Textfields/phone";
import ErrorText from "../../../components/sptext/error";
import { useDispatch, useSelector } from "react-redux";
import SelectBox from "../../../components/Select";
import {
  clearError,
  createEmployee,
  fetchPositionList,
  updateEmployee,
} from "../actions";
import withNotification from "../../../hocs/withNotification/WithNotification";
import { Formik, Form, Field } from "formik";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { fetchBranchList } from "../../branches/actions";

const EmployeeAddEditDialog = (props) => {
  // redux
  const formRef = React.useRef();
  const branchList = useSelector((state) => state.get("branch").list);
  const positionList = useSelector(
    (state) => state.get("employee").positionList
  );
  const isLoading = useSelector((state) => state.get("employee").isLoading);
  const errorText = useSelector((state) => state.get("employee").errorText);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const handleClose = () => {
    formRef.current && formRef.current.resetForm();
    props.onClose && props.onClose();
  };

  useEffect(
    () => {
      if (props.open && !positionList.length) {
        dispatch(fetchPositionList());
      }

      if (props.open && !branchList.length) {
        dispatch(fetchBranchList({ page: 0, size: 1000 }));
      }

      if (!props.open) {
        handleClose && handleClose();
        dispatch(clearError());
      }
    },
    [props.open]
  );

  return (
    <Formik
      innerRef={formRef}
      enableReinitialize={true}
      initialValues={
        props.currentEmployee
          ? {
              branchId: props.currentEmployee.branchId,
              firstName:
                props.currentEmployee.fullName &&
                props.currentEmployee.fullName.firstName,
              lastName:
                props.currentEmployee.fullName &&
                props.currentEmployee.fullName.lastName,
              middleName:
                props.currentEmployee.fullName &&
                props.currentEmployee.fullName.patronymic,
              authorities: props.currentEmployee.authorities,
              phoneNumber: props.currentEmployee.login,
            }
          : {
              branchId: undefined,
              firstName: "",
              lastName: "",
              middleName: "",
              authorities: [],
              phoneNumber: "",
            }
      }
      validationSchema={() =>
        Yup.object().shape({
          branchId: Yup.number().required(),
          firstName: Yup.string()
            .min(2)
            .required(),
          lastName: Yup.string()
            .min(2)
            .required(),
          authorities: Yup.array()
            .min(1)
            .required(),
          phoneNumber: Yup.string()
            .min(12)
            .max(12)
            .matches("^998")
            .required(),
        })
      }
      onSubmit={(values) => {
        let emp = {
          branchId: values.branchId,
          fullName: {
            firstName: values.firstName,
            lastName: values.lastName,
            patronymic: values.middleName,
          },
          authorities: values.authorities,
          login: values.phoneNumber,
        };

        if (props.currentEmployee) {
          dispatch(
            updateEmployee({ ...emp, id: props.currentEmployee.id }, props)
          );
        } else {
          dispatch(createEmployee(emp, props));
        }
      }}
    >
      {({ isValid, dirty, handleSubmit }) => (
        <Form>
          <Dialog {...props} fullWidth>
            <DialogTitle>
              {props.currentEmployee
                ? t("employeeDialog.edit_employee")
                : t("employeeDialog.add_employee")}
            </DialogTitle>
            <DialogContent>
              <Grid container>
                <Grid container>
                  <ErrorText text={errorText} />
                </Grid>
                {props.isProfileEdit ? (
                  ""
                ) : (
                  <Grid
                    container
                    direction="row"
                    style={{
                      marginTop: 15,
                      display:
                        props.currentEmployee &&
                        (props.currentEmployee.authorities || []).indexOf(
                          "ROLE_OWNER"
                        ) >= 0
                          ? "none"
                          : "",
                    }}
                  >
                    <Grid item xs={6}>
                      <Field name="branchId">
                        {({
                          field: { value },
                          form: { setFieldValue, errors },
                        }) => (
                          <SelectBox
                            label={t("employeeDialog.branch")}
                            data={branchList}
                            itemKey="id"
                            itemValue="name"
                            error={errors.branchId}
                            value={value}
                            onChange={(event) => {
                              dispatch(clearError());
                              setFieldValue("branchId", event.target.value);
                            }}
                          />
                        )}
                      </Field>
                    </Grid>
                    <Grid
                      item
                      xs={6}
                      style={{
                        paddingLeft: 10,
                        display:
                          props.currentEmployee &&
                          (props.currentEmployee.authorities || []).indexOf(
                            "ROLE_OWNER"
                          ) >= 0
                            ? "none"
                            : "",
                      }}
                    >
                      <Field name="authorities">
                        {({
                          field: { value },
                          form: { setFieldValue, errors },
                        }) => (
                          <SelectBox
                            label={t("employeeDialog.position")}
                            data={positionList}
                            itemKey="roleCode"
                            itemValue="nameRu"
                            error={errors.authorities}
                            value={value.length && value[0]}
                            onChange={(event) => {
                              dispatch(clearError());
                              setFieldValue("authorities", [
                                event.target.value,
                              ]);
                            }}
                          />
                        )}
                      </Field>
                    </Grid>
                  </Grid>
                )}
                <Grid container style={{ marginTop: 15 }}>
                  <Field name="lastName">
                    {({
                      field: { value },
                      form: { setFieldValue, errors },
                    }) => (
                      <TextField
                        fullWidth
                        variant="outlined"
                        label={t("employeeDialog.lastName")}
                        value={value}
                        error={errors.lastName}
                        helperText={
                          errors.lastName && t("employeeDialog.lastNameError")
                        }
                        onChange={(event) => {
                          setFieldValue("lastName", event.target.value);
                          dispatch(clearError());
                        }}
                      />
                    )}
                  </Field>
                </Grid>
                <Grid container style={{ marginTop: 15 }}>
                  <Field name="firstName">
                    {({
                      field: { value },
                      form: { setFieldValue, errors },
                    }) => (
                      <TextField
                        fullWidth
                        variant="outlined"
                        label={t("employeeDialog.firstName")}
                        value={value}
                        error={errors.firstName}
                        helperText={
                          errors.firstName && t("employeeDialog.firstNameError")
                        }
                        onChange={(event) => {
                          setFieldValue("firstName", event.target.value);
                        }}
                      />
                    )}
                  </Field>
                </Grid>
                <Grid container style={{ marginTop: 15 }}>
                  <Field name="middleName">
                    {({
                      field: { value },
                      form: { setFieldValue, errors },
                    }) => (
                      <TextField
                        fullWidth
                        variant="outlined"
                        label={t("employeeDialog.middleName")}
                        value={value}
                        onChange={(event) => {
                          setFieldValue("middleName", event.target.value);
                        }}
                      />
                    )}
                  </Field>
                </Grid>
                {props.isProfileEdit ? (
                  undefined
                ) : (
                  <Field name="phoneNumber">
                    {({
                      field: { value },
                      form: { setFieldValue, errors },
                    }) => (
                      <Grid container style={{ marginTop: 15 }}>
                        <PhoneTextField
                          value={value}
                          onPhoneChange={(isValid, phoneNumber) => {
                            setFieldValue("phoneNumber", phoneNumber);
                          }}
                          error={errors.phoneNumber}
                        />
                        <Grid
                          item
                          xs={12}
                          style={{
                            display: errors.phoneNumber ? "block" : "none",
                          }}
                        >
                          <div
                            style={{ fontSize: 12, color: "red", marginTop: 4 }}
                          >
                            {" "}
                            {t("employeeDialog.wrongFormat")}{" "}
                          </div>
                        </Grid>
                      </Grid>
                    )}
                  </Field>
                )}
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button
                color="primary"
                disabled={isLoading}
                onClick={() => {
                  dispatch(clearError());
                  handleClose && handleClose();
                }}
              >
                {t("common.cancel")}
              </Button>
              <Button
                color="primary"
                type="submit"
                disabled={!(isValid && dirty && !isLoading)}
                onClick={handleSubmit}
              >
                {props.currentEmployee ? t("common.update") : t("common.add")}
              </Button>
            </DialogActions>
          </Dialog>
        </Form>
      )}
    </Formik>
  );
};

export default withNotification(EmployeeAddEditDialog);
