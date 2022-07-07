import Logic from "#businessLayer";
import React, { useEffect, useState } from "react";
import InputMask from "react-input-mask";
import PinInput from "react-pin-input";
import "./styles.scss";
import { Grid, TextField, Button, CircularProgress } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert/Alert";
import { checkNull } from "../../../utils/helpers";
import { useDispatch, useSelector } from "react-redux";
import { servicesAgreementsSelector } from "./../servicesAgreements/redux/reducer";
import { getBalance } from "../servicesAgreements/redux/actions";
import withNotification from "../../hocs/withNotification/WithNotification";
import { withRouter } from "react-router-dom";

const initErrValid = {
  pan: false,
  expiry: false,
  amount: false,
  smsCode: false,
};
const Payment = (props) => {
  const { match, history } = props;
  console.log(props);
  const dispatch = useDispatch();
  const [step, setStep] = useState(1);
  const [smsCode, setSmsCode] = useState("");
  const [resData, setResData] = useState(null);

  const [pan, setPan] = useState();
  const [expiry, setExpiry] = useState();
  const [amount, setAmount] = useState();

  const [countDownActive, setCountDownActive] = useState(false);
  const [createPaymentError, setCreatePaymentError] = useState(null);
  const [acceptPaymentError, setAcceptPaymentError] = useState(null);
  const [loading, setLoading] = useState(false);
  const balance = useSelector(servicesAgreementsSelector("balance"));

  const $currentOwner = useSelector(
    (state) => state.get("dashboard").currentOwner
  );
  const clientTin = $currentOwner && $currentOwner.inn;

  const [errorValid, setErrorValid] = useState(initErrValid);

  useEffect(() => {}, []);
  useEffect(
    () => {
      clientTin && dispatch(getBalance(clientTin));
    },
    [clientTin]
  );

  const onResendActivationKeyClick = () => {};
  const onFinish = () => {
    const errors = initErrValid;
    const parsedExpiry = getDigitsNums(expiry || "--/--");
    const parsedPan = getDigitsNums(pan || "---- ---- ---- ----");
    if (step === 1) {
      if (!validatePan(parsedPan)) {
        errors.pan = true;
      }
      if (!validateExpiry(parsedExpiry)) {
        errors.expiry = true;
      }
      if (isNaN(Number(amount))) {
        errors.amount = true;
      }
      if (errors.amount || errors.expiry || errors.pan) {
        setErrorValid(errors);
        return;
      }
      setLoading(true);
      Logic.servicesAgreements
        .createTransaction({
          amount,
          expiry: String(
            parsedExpiry[0] +
              parsedExpiry[1] +
              parsedExpiry[2] +
              parsedExpiry[3]
          ),
          pan: parsedPan,
          tin: clientTin,
        })
        .then((result) => {
          if (checkNull(result, "data", "status") === "PENDING") {
            setResData(result.data);
            setStep(2);
            setCountDownActive(true);
            setAcceptPaymentError(null);
            setCreatePaymentError(null);
          }
        })
        .catch(async (err) => {
          setCreatePaymentError(err.response.data);
        })
        .finally(() => setLoading(false));
    } else if (step === 2) {
      if (!smsCode || smsCode.length !== 5) {
        setErrorValid((prev) => ({ ...prev, smsCode: true }));
        return;
      } else setErrorValid(initErrValid);

      Logic.servicesAgreements
        .confirmTransaction({
          billId: checkNull(resData, "id"),
          confirmationKey: smsCode,
          transactionId: checkNull(resData, "localId"),
        })
        .then(() => {
          props.success("Oплата прошла успешно");
          setTimeout(() => {
            setLoading(false);
            history.push("/main/services-agreements");
          }, 1200);
        })
        .catch(async (err) => {
          setAcceptPaymentError(err.response.data);
        });
      //.finally(() => setLoading(false));
    }
  };

  const renderByStep = () => {
    if (step === 1) {
      return (
        <>
          <Grid item xs={5}>
            <InputMask
              mask="9999 9999 9999 9999"
              placeholder="---- ---- ---- ----"
              maskChar="-"
              onChange={(e) => setPan(e.target.value)}
              onBlur={() => {
                setErrorValid((prev) => ({
                  ...prev,
                  pan: !validatePan(getDigitsNums(pan)),
                }));
              }}
            >
              {(inputProps) => (
                <TextField
                  {...inputProps}
                  error={errorValid.pan}
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                  id="pan"
                  name="pan"
                  label="Номер карты"
                  helperText={errorValid.pan ? "Заполните поле" : ""}
                  variant="outlined"
                  style={{ width: "100%" }}
                />
              )}
            </InputMask>
          </Grid>
          <Grid item xs={3}>
            <InputMask
              mask="99 / 99"
              placeholder="-- / --"
              maskChar="-"
              onChange={(e) => setExpiry(e.target.value)}
              onBlur={() => {
                setErrorValid((prev) => ({
                  ...prev,
                  expiry: !validateExpiry(getDigitsNums(expiry)),
                }));
              }}
            >
              {(inputProps) => (
                <TextField
                  {...inputProps}
                  error={errorValid.expiry}
                  id="expiry"
                  name="expiry"
                  required
                  label="Номер карты"
                  helperText={errorValid.expiry ? "Заполните поле" : ""}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                  style={{ width: "100%" }}
                />
              )}
            </InputMask>
          </Grid>

          <Grid item xs={8}>
            <TextField
              error={errorValid.amount}
              id="amount"
              required
              name="amount"
              InputLabelProps={{
                shrink: true,
                inputMode: "numeric",
                pattern: "[0-9]*",
              }}
              placeholder="Введите сумму"
              label="Сумма перевода"
              variant="outlined"
              helperText={errorValid.amount ? "Incorrect entry" : ""}
              onChange={(e) => {
                setAmount(e.target.value);
              }}
              onBlur={() => {
                setErrorValid((prev) => ({
                  ...prev,
                  amount: isNaN(Number(amount)),
                }));
              }}
              style={{ width: "100%" }}
            />
          </Grid>
        </>
      );
    } else if (step === 2) {
      return (
        <>
          <SmsCodeField
            codeSize={5}
            setErrorToFalse={() =>
              setErrorValid((prev) => ({ ...prev, smsCode: false }))
            }
            phoneNum={checkNull(resData, "maskedPhoneNumber")}
            onChange={setSmsCode}
            error={errorValid.smsCode}
            countDownActive={countDownActive}
            onTimerFinish={() => setCountDownActive(false)}
            onResendClick={onResendActivationKeyClick}
            inputStyle={{ width: "56px", marginRight: "20px" }}
          />
        </>
      );
    } else return null;
  };

  return (
    <div className="custom-content loyalty-cards">
      <Grid container xs={8} direction="row" spacing={3}>
        {createPaymentError && (
          <Grid item xs={12}>
            <div className="CKBP__error">
              <Alert severity="error">
                {createPaymentError.title.split(":")[1]}
              </Alert>
            </div>
          </Grid>
        )}
        {acceptPaymentError && (
          <Grid item xs={12}>
            <div className="CKBP__error">
              <Alert severity="error">
                {acceptPaymentError.title.split(":")[1]}
              </Alert>
            </div>
          </Grid>
        )}
        {loading && (
          <div className="abs-loader">
            <CircularProgress />
          </div>
        )}

        {balance && (
          <Grid item xs={12}>
            <div className="CKBP__client-info">
              <div className="CKBP__client-info__item">
                <strong>Баланс:</strong> <PriceWrapper price={balance} />
              </div>
            </div>
          </Grid>
        )}

        {renderByStep()}

        <Grid item xs={8}>
          <Button
            disabled={
              (errorValid.amount || errorValid.expiry || errorValid.pan) &&
              step === 1
            }
            variant="contained"
            color="primary"
            onClick={() => onFinish()}
          >
            {step === 1 ? "Продолжить" : "Подтвердить"}
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

const validatePan = (num) => num.length === 16;
const validateExpiry = (num) => num.length === 4;

const PriceWrapper = ({ price }) => {
  if (!price) {
    return null;
  }

  return (
    <span className="w-s-n">
      <strong>{price.toLocaleString("ru")}</strong> сум
    </span>
  );
};

export const formatNumber = (price = 0) => {
  const n = String(price),
    p = n.indexOf(".");

  return n.replace(
    /\d(?=(?:\d{3})+(?:\.|$))/g,
    (m, i) => (p < 0 || i < p ? `${m} ` : m)
  );
};

export const getDigitsNums = (phone) => {
  return phone.replace(/\D/g, "");
};

export const SmsCodeField = (props) => {
  const {
    className = "",
    codeSize = 5,
    timerSeconds = 59,
    onChange,
    error,
    countDownActive,
    onTimerFinish,
    phoneNum,
    setErrorToFalse,
    inputStyle = {},
  } = props;

  const [pinCodeComplete, setPinCodeComplete] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const timerTime = useCountDown({
    start: countDownActive,
    onTimerFinish,
    seconds: timerSeconds,
  });

  useEffect(
    () => {
      if (error) {
        setShowWarning(true);
        const id = setTimeout(() => {
          setErrorToFalse();
          setShowWarning(false);
        }, 5000);
        return () => clearTimeout(id);
      }
    },
    [error]
  );

  const onSmsCodeChange = (value) => {
    onChange(value);

    if (value.length === codeSize) {
      setPinCodeComplete(true);
    } else {
      setPinCodeComplete(false);
    }
  };

  const onComplete = (value) => {
    onSmsCodeChange(value);
  };

  return (
    <>
      <Grid item xs={12}>
        <div
          className={`SCF__pinCode ${
            pinCodeComplete ? "SCF__pinCodeComplete" : ""
          } ${error ? "SCF__pinCodeError" : ""} ${className}`}
        >
          <PinInput
            length={codeSize}
            initialValue=""
            type="numeric"
            inputStyle={{
              borderColor: "#d9d9d9",
              width: "52px",
              height: "48px",
              margin: "0 16px 0 0",
              ...inputStyle,
            }}
            inputFocusStyle={{ borderColor: "#908DE1" }}
            onChange={onSmsCodeChange}
            onComplete={onComplete}
          />
        </div>
      </Grid>

      <Grid item xs={12}>
        <Grid item xs={6}>
          {showWarning && (
            <Alert className="SCF__alert" severity="warning">
              <div>Заполните поле</div>
            </Alert>
          )}
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Grid item xs={6}>
          <Alert className="SCF__alert" severity="info">
            <>
              <div>СМС было отправлено на номер {phoneNum}</div>
              <div>
                Срок действия кода 00:
                {timerTime < 10 ? `0${timerTime}` : timerTime}
              </div>
              {/*{!countDownActive && <div className="SCF__resendBtn" onClick={onResendHandler}>*/}
              {/*  Отправить СМС еще раз*/}
              {/*  {$resendKey && $resendKey.loading && <span className="SCF__resendBtnLoading">*/}
              {/*    <Spin indicator={antLoadingIcon} />*/}
              {/*  </span>}*/}
              {/*</div>}*/}
            </>
          </Alert>
        </Grid>
      </Grid>
    </>
  );
};

function useCountDown({ start, onTimerFinish, seconds = 60 }) {
  const [count, setCount] = useState(seconds);

  useEffect(
    () => {
      let interval;
      if (start) {
        interval = setInterval(() => {
          if (count <= 0) {
            onTimerFinish && onTimerFinish();
            clearInterval(interval);
          } else {
            setCount((value) => value - 1);
          }
        }, 1000);
      }

      return () => {
        clearInterval(interval);
      };
    },
    [start, count]
  );

  useEffect(
    () => {
      if (start && count === 0) {
        setCount(seconds);
      }
    },
    [start]
  );

  return count;
}

export default withRouter(withNotification(Payment));
