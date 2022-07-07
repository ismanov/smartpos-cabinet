import Logic from "#businessLayer";
import React, { useState, useEffect } from "react";
import { Grid, Button } from "@material-ui/core";
import { Delete, Add } from "@material-ui/icons";
import SelectBox from "../../../../components/SelectBox";
import { useTranslation } from "react-i18next";
import NumberTextField from "../../../../components/Textfields/NumberTextField";
import ProductSelectBoxInBranch from "../../../components/productInBranchSelector";
import numeral from "numeral";

const ConditionsComponent = (props) => {
  const { t } = useTranslation();
  const { branchId } = props;
  const [current, setCurrent] = useState({ discountType: 0, from: 1 });
  const [unitList, setUnitList] = useState([]);

  useEffect(
    () => {
      if (props.type === "add") {
        setCurrent({ discountType: 0, from: 1 });
      }
    },
    [branchId]
  );

  useEffect(
    () => {
      if (props.current) {
        setCurrent({ ...props.current });
        if (props.current.unit) {
          setUnitList([props.current.unit]);
        }
      }
    },
    [props.current]
  );

  const isValid = () => {
    if (current.discountType === undefined) return false;
    if (current.discountType === 0 && !current.product) return false;
    if (current.discountType === 0 && !current.unit) return false;
    return current.from >= 1;
  };

  let list = (() => {
    if (
      (!props.current && props.disableBasket) ||
      (props.current && props.current.discountType !== 1 && props.disableBasket)
    ) {
      return [
        {
          id: 0,
          name: t("common.product"),
        },
      ];
    } else {
      return [
        {
          id: 0,
          name: t("common.product"),
        },
        {
          id: 1,
          name: t("common.basket"),
        },
      ];
    }
  })();

  return (
    <Grid container style={{ borderRight: "1px solid #eee" }}>
      <p
        style={{ fontWeight: 600, fontSize: 16, color: "#777", marginTop: 20 }}
      >
        {" "}
        {t("discount.conditions")}{" "}
      </p>
      <Grid container style={{ marginTop: 10 }}>
        <Grid xs={9}>
          <SelectBox
            itemKey="id"
            itemValue="name"
            label={t("discount.discountType")}
            data={list}
            disabled={props.disabled}
            onChange={(item) => {
              let c = {
                ...current,
                discountType: item.target.value,
                product: undefined,
                unit: undefined,
              };
              setCurrent(c);
              if (props.type !== "add" && Object.keys(current).length > 2) {
                props.onAction && props.onAction(c);
              }
            }}
            value={current.discountType}
          />
        </Grid>
      </Grid>
      {current.discountType === 0 ? (
        <Grid container style={{ marginTop: 20 }}>
          <Grid xs={7} style={{ paddingRight: 10 }}>
            <ProductSelectBoxInBranch
              disabled={props.disabled}
              branchId={branchId}
              onProductSelect={(product) => {
                if (
                  product &&
                  (props.selectedProductIds || []).includes(product.id)
                ) {
                  return;
                }

                if (product) {
                  let c = { ...current, product };
                  setCurrent(c);
                  if (props.type !== "add" && Object.keys(c).length > 2) {
                    props.onAction && props.onAction(c);
                  }
                  Logic.resource
                    .fetchUnitListWithCoeff(product.id, props.branchId)
                    .then((response) => {
                      let list = response.data;
                      setUnitList(list);

                      if (list.length === 1) {
                        let unit = list[0];
                        setCurrent({ ...c, unit });
                      } else {
                        list.forEach((u) => {
                          if (u.base) {
                            setCurrent({ ...c, unit: u });
                          }
                        });
                      }
                    });
                } else {
                  setUnitList([]);
                  setCurrent({
                    ...current,
                    unit: undefined,
                    product: undefined,
                  });
                }
              }}
              value={
                current.product
                  ? { id: current.product.id, name: current.product.name }
                  : { name: "" }
              }
            />
          </Grid>
          <Grid xs={2}>
            <SelectBox
              disabled={props.disabled || unitList.length === 1}
              itemKey="id"
              itemValue="name"
              data={unitList}
              label={t("discount.unit")}
              onChange={(e) => {
                let c = {
                  ...current,
                  unit: unitList.find((u) => u.id === e.target.value),
                };
                setCurrent(c);

                if (props.type !== "add" && Object.keys(c).length > 2) {
                  props.onAction && props.onAction(c);
                }
              }}
              value={current.unit ? current.unit.id : undefined}
            />
          </Grid>
        </Grid>
      ) : (
        undefined
      )}
      {current.unit ? (
        <Grid container style={{ marginTop: 4, fontSize: 12, color: "#ccc" }}>
          {t("discount.price")}:{" "}
          {numeral(current.unit.price || 0).format("0,0.00")} {t("common.sum")}
        </Grid>
      ) : (
        undefined
      )}

      <Grid container style={{ marginTop: 15 }}>
        <Grid item xs={4}>
          <NumberTextField
            fullWidth
            variant="outlined"
            disabled={props.disabled}
            label={
              current.discountType === 0
                ? t("discount.from")
                : t("discount.basket_from")
            }
            onChange={(e) => {
              let c = { ...current, from: e.target.value };
              setCurrent(c);
              if (props.type !== "add" && Object.keys(c).length > 2) {
                props.onAction && props.onAction(c);
              }
            }}
            onBlur={() => {
              let from = !Number(current.from) ? "1" : current.from;
              if (current.to) {
                from =
                  Number(current.to) < Number(current.from)
                    ? Number(current.to)
                    : Number(current.from);
              }
              let c = { ...current, from };
              setCurrent(c);
              if (props.type !== "add" && Object.keys(c).length > 2) {
                props.onAction && props.onAction(c);
              }
            }}
            value={current.from || ""}
          />
        </Grid>
        <Grid item xs={5} style={{ paddingLeft: 10 }}>
          <NumberTextField
            fullWidth
            variant="outlined"
            disabled={props.disabled}
            label={
              current.discountType === 0
                ? t("discount.to")
                : t("discount.basket_to")
            }
            onChange={(e) => {
              let c = { ...current, to: e.target.value };
              setCurrent(c);
              if (props.type !== "add" && Object.keys(c).length > 2) {
                props.onAction && props.onAction(c);
              }
            }}
            value={current.to || ""}
            onBlur={() => {
              if (current.to && Number(current.to) < Number(current.from)) {
                let c = { ...current, to: current.from };
                setCurrent(c);
                if (props.type !== "add" && Object.keys(c).length > 2) {
                  props.onAction && props.onAction(c);
                }
              }
            }}
          />
        </Grid>
      </Grid>
      <Grid container style={{ marginTop: 10 }}>
        <Grid item xs={9}>
          <Button
            disabled={props.disabled || (props.type === "add" && !isValid())}
            variant="contained"
            color={props.type === "add" ? "primary" : "secondary"}
            fullWidth
            onClick={() => {
              if (props.type === "add") {
                props.onAction && props.onAction({ ...current });
              } else {
                props.onRemove && props.onRemove(current);
              }
              setCurrent({ discountType: 0 });
            }}
            startIcon={props.type === "add" ? <Add /> : <Delete />}
          >
            {props.type === "add"
              ? t("incomeDetail.add")
              : t("discount.remove")}
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ConditionsComponent;
