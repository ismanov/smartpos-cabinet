import React, { useState } from "react";
import { Row, PairRow } from "#components/containers/detailpage/DetailSection";
import withNotification from "#hocs/withNotification/WithNotification";
import { useDispatch, useSelector } from "react-redux";
import UserAddEditDialog from "../employee/components/AddEditDialog";
import ChangePassword from "../settings/components/ChangePassword";
import Detail from "../../components/containers/detail";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
  Typography,
  makeStyles,
} from "@material-ui/core";
import PhoneTextField from "../../components/Textfields/phone";
import { useTranslation } from "react-i18next";
import { fetchCurrentUser, updateUser } from "../dashboard/actions";
import { changePassword } from "./actions";
import { Alert } from "@material-ui/lab";

const useStyles = makeStyles(() => ({
  header: {
    fontWeight: 20,
    fontSize: 20,
    marginTop: 20,
    marginLeft: 10,
  },
  content: {
    width: "50%",
    marginTop: 20,
    marginLeft: 10,
    overflow: "visible",
    padding: 15,
  },
  wrapper: {
    display: "block",
  },
}));

const Profile = (props) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [telegramLogin, setTelegramLogin] = useState();
  const [telegramLoginDialog, setTelegramLoginDialog] = useState(false);
  const [err, setErr] = useState(false);
  const currentUser = useSelector(
    (state) => state.get("dashboard").currentUser
  );
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const classes = useStyles();
  return (
    <div className={classes.wrapper}>
      <UserAddEditDialog
        title={t("profile.userProfile")}
        open={openDialog}
        phoneDisabled={true}
        onClose={(update) => {
          setOpenDialog(false);
          if (update === true) {
            dispatch(fetchCurrentUser());
            props.success(t("profile.changedSuccess"));
          }
          setOpenDialog(false);
        }}
        isProfileEdit={true}
        currentEmployee={currentUser}
      />
      <ChangePassword
        open={openPasswordDialog}
        onClose={() => {
          setOpenPasswordDialog(false);
        }}
        onValue={(currentPass, newPass) => {
          dispatch(changePassword(currentPass, newPass, props));
        }}
      />
      <Dialog
        open={telegramLoginDialog}
        fullWidth={true}
        onClose={() => {
          setTelegramLogin(undefined);
          setTelegramLoginDialog(false);
        }}
      >
        <DialogTitle>{t("profile.changeTelegramAccount")}</DialogTitle>
        <DialogContent>
          <Grid container style={{ padding: 15 }}>
            <Grid container style={{ marginTop: 20 }}>
              <PhoneTextField
                value={telegramLogin}
                onPhoneChange={(valid, phone) => {
                  setTelegramLogin(phone);
                }}
                style={{ marginTop: 15 }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            variant="text"
            color="primary"
            onClick={() => {
              setTelegramLogin(undefined);
              setTelegramLoginDialog(false);
            }}
          >
            {t("profile.cancel")}
          </Button>
          <Button
            variant="text"
            color="primary"
            disabled={telegramLogin && telegramLogin.length < 12}
            onClick={() => {
              let owner = { ...currentUser, telegramLogin };
              dispatch(updateUser(owner, setErr));
              setTelegramLogin(undefined);
              setTelegramLoginDialog(false);
            }}
          >
            {t("profile.change")}
          </Button>
        </DialogActions>
      </Dialog>

      <div className={classes.header}> {t("profile.title")} </div>
      {err &&
        err.response && (
          <Alert severity="error">{err.response.data.title}</Alert>
        )}

      <Paper className={classes.content}>
        <Detail
          header={{
            title: t("profile.userData"),
            // buttonTitle: 'Изменить Профиль'
          }}
          // headerClick={() => this.setState({openDialog: true})}
        >
          <Row
            title={t("profile.lastName")}
            value={
              currentUser ? currentUser.fullName.lastName : t("profile.notSet")
            }
            style={{ marginLeft: 20 }}
          />
          <Row
            title={t("profile.name")}
            value={
              currentUser ? currentUser.fullName.firstName : t("profile.notSet")
            }
            style={{ marginLeft: 20 }}
          />
          <Row
            title={t("profile.middleName")}
            value={
              currentUser
                ? currentUser.fullName.patronymic
                : t("profile.notSet")
            }
            style={{ marginLeft: 20 }}
          />
          <Row
            title={t("profile.phone")}
            value={currentUser ? `+${currentUser.login}` : t("profile.notSet")}
            style={{ marginLeft: 20 }}
          />

          <PairRow
            title={t("profile.password")}
            value="**************"
            actionTitle={t("profile.changePassword")}
            style={{ marginLeft: 20 }}
            rowAction={() => {
              setOpenPasswordDialog(true);
            }}
          />
          {currentUser && currentUser.authorities.includes("ROLE_OWNER") ? (
            <>
              <PairRow
                title={t("profile.accessToTg")}
                value={
                  currentUser && currentUser.telegramLogin
                    ? currentUser.telegramLogin
                    : t("profile.no")
                }
                actionTitle={t("profile.changeTgAccount")}
                style={{ marginLeft: 20 }}
                rowAction={() => {
                  setTelegramLogin(currentUser.telegramLogin);
                  setTelegramLoginDialog(true);
                }}
              />

              <div
                style={{
                  marginTop: 20,
                  marginLeft: 20,
                  flexFlow: "row",
                  display: "flex",
                }}
              >
                <div style={{ flexGrow: 1, flexFlow: "column" }}>
                  <Typography
                    variant="h4"
                    style={{ fontSize: 13, color: "#AAA" }}
                  >
                    {t("profile.tgBot")}
                  </Typography>
                  <Typography
                    variant="h4"
                    style={{ fontSize: 16, color: "#666", marginTop: 4 }}
                  >
                    {process.env.NODE_ENV === "development" ? (
                      <a href="https://t.me/smartpos_dev_bot">
                        @smartpos_dev_bot
                      </a>
                    ) : (
                      <a href="https://t.me/smartpostrade_bot">
                        @smartpostrade_bot
                      </a>
                    )}
                  </Typography>
                </div>
              </div>
            </>
          ) : (
            undefined
          )}
        </Detail>
      </Paper>
    </div>
  );
};

export default withNotification(Profile);
