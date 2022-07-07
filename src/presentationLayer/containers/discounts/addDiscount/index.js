import React, { useState, useRef, useEffect } from "react";
import { withRouter } from "react-router-dom";
import {
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  IconButton,
  Paper,
  TextField,
  Tooltip,
  withStyles,
} from "@material-ui/core";
import { ArrowBackIos } from "@material-ui/icons";
import { useTranslation } from "react-i18next";
import DatePicker from "../../../components/Pickers/datepicker";
import SelectBox from "../../../components/SelectBox";
import DaysPopover from "./components/daysPopover";
import WeekdaysPopover, { weekdays } from "./components/weekdaysPopover";
import { useDispatch, useSelector } from "react-redux";
import ConditionsComponent from "./components/ConditionsComponent";
import BonusComponent from "./components/BonusComponent";
import withNotification from "../../../hocs/withNotification/WithNotification";
import { createDiscount } from "../list/actions";
import moment from "moment";
import QuestionIcon from "./components/QuestionIcon";

const LightTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: "rgba(0, 0, 0, 0.87)",
    boxShadow: theme.shadows[1],
    fontSize: 11,
  },
}))(Tooltip);

const AddDiscount = (props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const currentBranch = useSelector(
    (state) => state.get("dashboard").currentBranch
  );
  const isLoading = useSelector((state) => state.get("discounts").isLoading);

  const [dayMode, setDayMode] = useState(0);
  const [daysAnchorElement, setDaysAnchorElement] = useState(null);
  const [weekdaysAnchorElement, setWeekdaysAnchorElement] = useState(null);
  const [weekdaysSelected, setWeekdaysSelected] = useState([]);
  const [selected, setSelected] = useState([]);
  const [daysTitle, setDaysTitle] = useState();
  const [conditionList, setConditionList] = useState([]);
  const [bonusList, setBonusList] = useState([]);
  const [discountName, setDiscountName] = useState();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);
  const [nds, setNds] = useState(true);
  const [repeatCount, setRepeatCount] = useState(false);
  const [repeatCountEnabled, setRepeatCountEnabled] = useState(false);

  const daysOpen = Boolean(daysAnchorElement);
  const weekDaysOpen = Boolean(weekdaysAnchorElement);

  useEffect(
    () => {
      if (dayMode === 2) {
        let title = selected.length === 31 ? t("discount.every_day") : "";
        if (!title) {
          setDaysTitle(`${t("discount.selected_days")}: ${selected.length}`);
        } else {
          setDaysTitle(title);
        }
      } else if (dayMode === 1) {
        let title =
          weekdaysSelected.length === 7 ? t("discount.every_day") : "";
        if (!title) {
          title = weekdaysSelected
            .map((s) => {
              let f = weekdays(t).find((w) => w.value === s);
              if (f) {
                return f.abbr;
              } else {
                return "";
              }
            })
            .join(", ");
        }
        setDaysTitle(title);
      }
    },
    [selected, weekdaysSelected, dayMode]
  );

  useEffect(
    () => {
      setConditionList([]);
      setBonusList([]);
    },
    [currentBranch]
  );

  useEffect(
    () => {
      let enabled = true;
      console.log(conditionList);
      let filtered = conditionList.filter((c) => c.discountType === 1);
      if (filtered.length === 0 && conditionList.length) {
        conditionList.forEach((c) => {
          if (!c.to) {
            enabled = false;
            return;
          }
        });
      } else {
        enabled = false;
      }

      setRepeatCountEnabled(enabled);
      if (!enabled) {
        setRepeatCount(false);
      }
    },
    [conditionList]
  );

  const getBasketMaxSum = () => {
    let result = 0;
    conditionList.filter((c) => c.discountType === 1).forEach((c) => {
      if (c.to) {
        if (Number(c.to) > result) {
          result = Number(c.to);
        }
      } else {
        if (Number(c.from) > result) {
          result = Number(c.from);
        }
      }
    });
    return result;
  };

  const getProductMaxSum = () => {
    return conditionList.reduce((acc, c) => acc + c.unit && c.unit.price, 0);
  };

  // conditions
  const isBasketSelected =
    conditionList.filter((d) => d.discountType === 1).length > 0;

  let filteredConditionList = conditionList.filter((f) => {
    let found = bonusList.find(
      (b) =>
        b.item.product &&
        f.product &&
        f.unit &&
        b.item.unit &&
        b.item.product.id === f.product.id &&
        f.unit.id === b.item.unit.id
    );
    return !found;
  });

  if (
    bonusList.length &&
    bonusList.filter((d) => d.item.discountType === 0).length > 0
  ) {
    filteredConditionList = filteredConditionList.filter(
      (f) => f.discountType !== 1
    );
  }

  const isBonusBasketVisibility =
    bonusList.filter((d) => d.item.discountType === 1).length === 0;

  const isValid = () => {
    if (!discountName) return false;
    let filteredConditions = conditionList.filter((c) => {
      return (
        (c.discountType === 0 && c.product && c.unit && c.from) ||
        (c.discountType === 1 && c.from)
      );
    });
    if (!filteredConditions.length) return false;

    let filteredBonuses = bonusList.filter((b) => {
      return (b.toAllQty || b.count) && b.discount && b.unit >= 0;
    });
    if (dayMode === 1 && !weekdaysSelected.length) return false;
    if (dayMode === 2 && !selected.length) return false;
    if (
      endDate &&
      moment(startDate).format("YYYY-mm-dd") !==
        moment(endDate).format("YYYY-mm-dd") &&
      moment(startDate).isAfter(moment(endDate))
    )
      return false;
    return filteredBonuses.length;
  };

  if (currentBranch === undefined) {
    return (
      <Grid container>
        <Grid container style={{ marginTop: 15 }}>
          <Paper style={{ width: "100%", padding: 20 }}>
            <p
              style={{
                fontSize: 15,
                fontWeight: 600,
                color: "#777",
                textAlign: "center",
              }}
            >
              {t("discount.select_branch")}
            </p>
          </Paper>
        </Grid>
      </Grid>
    );
  }

  return (
    <Grid container>
      <DaysPopover
        open={daysOpen}
        anchorEl={daysAnchorElement}
        onClose={() => {
          setDaysAnchorElement(null);
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        onDaysSelected={(selected) => {
          setSelected(selected);
        }}
        value={selected}
      />

      <WeekdaysPopover
        open={weekDaysOpen}
        anchorEl={weekdaysAnchorElement}
        onClose={() => {
          setWeekdaysAnchorElement(null);
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        onDaysSelected={(selected) => {
          setWeekdaysSelected(selected);
        }}
        value={weekdaysSelected}
      />

      <Grid container alignItems="center" style={{ marginTop: 10 }}>
        <Grid item>
          <IconButton
            color="primary"
            onClick={() => {
              props.history.goBack();
            }}
          >
            <ArrowBackIos />
          </IconButton>
        </Grid>
        <Grid item style={{ fontWeight: "bold" }}>
          {t("discount.add_discount")}
        </Grid>
      </Grid>
      <Grid container style={{ marginTop: 15 }}>
        <Paper style={{ width: "100%", padding: 20 }}>
          <p style={{ fontSize: 15, fontWeight: 600, color: "#777" }}>
            {t("discount.common_info")}
          </p>

          <Grid container style={{ marginTop: 20 }}>
            <Grid item xs={3}>
              <TextField
                variant="outlined"
                label={t("discount.discount_name")}
                fullWidth
                InputProps={{
                  maxLength: 60,
                }}
                inputProps={{
                  maxLength: 60,
                }}
                onChange={(e) => {
                  setDiscountName(e.target.value);
                }}
              />
            </Grid>
          </Grid>

          <Grid container style={{ marginTop: 20 }}>
            <Grid item xs={3}>
              <DatePicker
                label={t("discount.start")}
                onChange={(date) => {
                  setStartDate(date);
                  if (endDate) {
                    let s = moment(date);
                    let e = moment(endDate);
                    if (e.isBefore(s)) {
                      setEndDate(date);
                    }
                  }
                }}
                disablePast
                value={startDate}
              />
            </Grid>

            <Grid item xs={3} style={{ paddingLeft: 10 }}>
              <DatePicker
                label={t("discount.end")}
                onChange={(date) => {
                  let s = moment(startDate);
                  let e = moment(date);
                  if (e.isBefore(s)) {
                    setEndDate(startDate);
                  } else {
                    setEndDate(date);
                  }
                }}
                value={endDate}
                disablePast
                onClear={() => {
                  setEndDate(null);
                }}
              />
            </Grid>
          </Grid>
          <Grid container style={{ marginTop: 20 }}>
            <Grid item xs={3}>
              <SelectBox
                itemKey="id"
                itemValue="name"
                data={[
                  {
                    id: 0,
                    name: t("discount.every_day"),
                  },
                  {
                    id: 1,
                    name: t("discount.week_day"),
                  },
                  {
                    id: 2,
                    name: t("discount.days"),
                  },
                ]}
                label={t("discount.repeat")}
                onChange={(e) => {
                  setDaysTitle("");
                  setDayMode(e.target.value || 0);
                }}
                value={dayMode}
              />
            </Grid>
            {dayMode === 1 ? (
              <Grid item xs={3} style={{ paddingLeft: 10 }}>
                <TextField
                  InputProps={{ readOnly: true }}
                  fullWidth
                  variant="outlined"
                  label={t("discount.week_day")}
                  onClick={(e) => {
                    setWeekdaysAnchorElement(e.currentTarget);
                  }}
                  value={daysTitle || ""}
                />
              </Grid>
            ) : (
              undefined
            )}
            {dayMode === 2 ? (
              <Grid item xs={3} style={{ paddingLeft: 10 }}>
                <TextField
                  InputProps={{ readOnly: true }}
                  fullWidth
                  variant="outlined"
                  label={t("discount.days")}
                  onClick={(e) => {
                    setDaysAnchorElement(e.currentTarget);
                  }}
                  value={daysTitle || ""}
                />
              </Grid>
            ) : (
              undefined
            )}
          </Grid>

          <hr style={{ marginTop: 20 }} />
          <Grid container style={{ marginTop: 20 }}>
            <Grid item md={6} xs={12}>
              <ConditionsComponent
                branchId={currentBranch}
                type="add"
                disableBasket={isBasketSelected}
                onAction={(item) => {
                  setConditionList([...conditionList, { ...item }]);
                }}
                selectedProductIds={conditionList.map(
                  (c) => c.product && c.product.id
                )}
              />
              {conditionList &&
                conditionList.map((c, i) => {
                  let disabled = false;
                  if (c.discountType === 0) {
                    let f = bonusList.filter(
                      (b) =>
                        b.item.discountType === 0 &&
                        b.item.product.id === c.product.id &&
                        b.item.unit.id === c.unit.id
                    );
                    disabled = f.length > 0;
                  } else {
                    let f = bonusList.filter((b) => b.item.discountType === 1);
                    disabled = f.length > 0;
                  }

                  return (
                    <Grid container style={{ marginTop: 20 }}>
                      <ConditionsComponent
                        current={c}
                        branchId={currentBranch}
                        disableBasket={isBasketSelected}
                        disabled={disabled}
                        onAction={(item) => {
                          console.log("testwst", item);
                          let c = [...conditionList];
                          c[i] = { ...item };
                          setConditionList(c);
                        }}
                        onRemove={(_) => {
                          let c = [...conditionList];
                          c.splice(i, 1);
                          setConditionList(c);
                        }}
                      />
                    </Grid>
                  );
                })}
            </Grid>
            {conditionList.length ? (
              <Grid item md={6} xs={12} style={{ paddingLeft: 20 }}>
                {isBonusBasketVisibility && filteredConditionList.length ? (
                  <BonusComponent
                    data={filteredConditionList}
                    branchId={currentBranch}
                    type="add"
                    onAction={(item) => {
                      setBonusList([...bonusList, { ...item }]);
                    }}
                    conditions={conditionList}
                    productMaxSum={getProductMaxSum()}
                    basketMaxSum={getBasketMaxSum()}
                  />
                ) : (
                  undefined
                )}
                {bonusList &&
                  bonusList.map((c, i) => {
                    let f = conditionList.find((t) => {
                      if (c.item.discountType === 0) {
                        return (
                          t.product &&
                          t.product.id === c.item.product.id &&
                          t.unit &&
                          t.unit.id === c.item.unit.id
                        );
                      } else {
                        return t.discountType === c.item.discountType;
                      }
                    });
                    let l =
                      c.item.discountType === 0
                        ? [...filteredConditionList, f]
                        : [f];

                    return (
                      <Grid container style={{ marginTop: 20 }}>
                        <BonusComponent
                          data={l}
                          current={c}
                          branchId={currentBranch}
                          onAction={(item) => {
                            let b = [...bonusList];
                            b[i] = { ...item };
                            setBonusList(b);
                          }}
                          onRemove={(_) => {
                            let b = [...bonusList];
                            b.splice(i, 1);
                            setBonusList(b);
                          }}
                          conditions={conditionList}
                          productMaxSum={getProductMaxSum()}
                          basketMaxSum={getBasketMaxSum()}
                        />
                      </Grid>
                    );
                  })}
              </Grid>
            ) : (
              undefined
            )}
          </Grid>
          <Grid container style={{ marginTop: 20 }} alignItems="center">
            <FormControlLabel
              control={
                <Checkbox
                  color="primary"
                  inputProps={{ "aria-label": "primary checkbox" }}
                />
              }
              label={t("discount.nds_desc")}
              style={{ color: "#555" }}
              checked={nds}
              onChange={(e) => {
                setNds(!nds);
              }}
            />
            <LightTooltip
              title={
                <React.Fragment
                  style={{
                    backgroundColor: "#f8f8f8",
                  }}
                >
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: "bold",
                      fontStyle: "italic",
                    }}
                  >
                    {" "}
                    {t("discount.tooltip_title")}{" "}
                  </div>
                  <br />
                  {t("discount.account_nds_desc")
                    .split("\n")
                    .map((w) => (
                      <div style={{ fontSize: 12, marginTop: 5 }}>{w}</div>
                    ))}
                </React.Fragment>
              }
              placement="right"
              style={{ marginLeft: -15 }}
            >
              <IconButton>
                <QuestionIcon />
              </IconButton>
            </LightTooltip>
          </Grid>
          <Grid container style={{ marginTop: 10 }} alignItems="center">
            <FormControlLabel
              control={
                <Checkbox
                  color="primary"
                  inputProps={{ "aria-label": "primary checkbox" }}
                />
              }
              label={t("discount.repeat_desc")}
              style={{ color: "#555" }}
              disabled={!repeatCountEnabled}
              checked={repeatCount}
              onChange={(e) => {
                setRepeatCount(!repeatCount);
              }}
            />
            <LightTooltip
              title={
                <React.Fragment
                  style={{
                    backgroundColor: "#f8f8f8",
                  }}
                >
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: "bold",
                      fontStyle: "italic",
                    }}
                  >
                    {" "}
                    {t("discount.tooltip_title")}{" "}
                  </div>
                  <br />
                  {t("discount.bonus_desc")
                    .split("\n")
                    .map((w) => (
                      <div style={{ fontSize: 12, marginTop: 5 }}>{w}</div>
                    ))}
                </React.Fragment>
              }
              placement="right"
              style={{ marginLeft: -15 }}
            >
              <IconButton>
                <QuestionIcon />
              </IconButton>
            </LightTooltip>
          </Grid>
          <Grid container>
            <div
              style={{
                fontSize: 12,
                color: "#aaa",
                marginLeft: 25,
                marginTop: -8,
              }}
            >
              {t("discount.checkboxDescription")}
            </div>
          </Grid>
        </Paper>
        <Grid
          container
          style={{ marginTop: 20, marginBottom: 20 }}
          justify="flex-end"
        >
          <Grid item xs={2}>
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              onClick={() => {
                props.history.goBack();
              }}
            >
              {" "}
              {t("common.cancel")}{" "}
            </Button>
          </Grid>
          <Grid item xs={2} style={{ paddingLeft: 10 }}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              disabled={!isValid() || isLoading}
              onClick={() => {
                let repeatType, s;
                switch (dayMode) {
                  case 0:
                    repeatType = "DAILY";
                    s = undefined;
                    break;
                  case 1:
                    repeatType = "WEEKDAYS";
                    s = weekdaysSelected;
                    break;
                  case 2:
                    repeatType = "MONTH_DAYS";
                    s = selected;
                    break;
                  default:
                    break;
                }

                let discount = {
                  branchId: currentBranch,
                  countRepetitions: repeatCount,
                  includeVAT: nds,
                  name: discountName,
                  repeatType: repeatType,
                  repeats: s,
                  dateFrom: startDate
                    ? moment(startDate).format("YYYY-MM-DDTHH:mm")
                    : undefined,
                  dateTo: endDate
                    ? moment(endDate).format("YYYY-MM-DDTHH:mm")
                    : undefined,
                  bonuses: bonusList.map((b, i) => {
                    return {
                      bonusAmount: b.discount,
                      bonusOn: b.item.discountType === 0 ? "PRODUCT" : "BASKET",
                      bonusProductId:
                        b.item.discountType === 0
                          ? b.item.product.id
                          : undefined,
                      bonusType: b.unit === 0 ? "PERCENTAGE" : "AMOUNT",
                      productCount: b.count,
                      unitId:
                        b.item.discountType === 0 ? b.item.unit.id : undefined,
                      allProducts: b.toAllQty,
                      sortIndex: i + 1,
                    };
                  }),
                  conditions: conditionList.map((c, i) => {
                    return {
                      amount: c.from,
                      amountTo: c.to,
                      unitId: c.discountType === 0 ? c.unit.id : undefined,
                      promotedProductId:
                        c.discountType === 0 ? c.product.id : undefined,
                      promotionOn: c.discountType === 0 ? "PRODUCT" : "BASKET",
                      sortIndex: i + 1,
                    };
                  }),
                };
                dispatch(createDiscount(discount, props));
              }}
            >
              {" "}
              {t("common.add")}{" "}
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default withRouter(withNotification(AddDiscount));
