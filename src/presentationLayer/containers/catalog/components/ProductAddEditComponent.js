import React, { useState, useEffect } from "react";
import {
  Button,
  Checkbox,
  Grid,
  IconButton,
  MenuItem,
  TextField,
  Typography,
  makeStyles,
} from "@material-ui/core";
import { ArrowBackIosOutlined } from "@material-ui/icons";
import { withRouter } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import { useDispatch, useSelector } from "react-redux";
import SelectBox from "../../../components/Select";
import withNotification from "../../../hocs/withNotification/WithNotification";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { List, KeyboardArrowDown, KeyboardArrowUp } from "@material-ui/icons";
import { useTranslation } from "react-i18next";
import CircularProgress from "@material-ui/core/CircularProgress";
import numeral from "numeral";
import NumberTextField from "../../../components/Textfields/NumberTextField";
import {
  createProduct,
  fetchProductById,
  fetchUnitList,
  setSelectedCategoryId,
  updateProduct,
  fetchVatList,
  setDialogProduct,
} from "../my/actions";
import clsx from "clsx";

const useStyles = makeStyles(() => ({
  title: {
    marginTop: 30,
    marginLeft: 20,
  },
  content: {
    height: "calc(100% - 200px)",
    marginTop: 10,
    marginLeft: 20,
    marginRight: 20,
    padding: 15,
    overflowY: "auto",
    position: "relative",
    width: "100%",
    "&.title": {
      fontSize: 18,
      fontWeight: "bold",
    },
  },
  dndContainer: {
    marginTop: 15,
    border: "1px solid #eee",
    padding: "10px 25px",
    overflowY: "auto",
    height: "100%",
    borderRadius: 8,
  },
  dndItem: {
    display: "flex",
    flexFlow: "row",
    alignItems: "center",
    padding: "10px 20px",
    backgroundColor: "white",
    userSelect: "none",
    borderRadius: 8,
  },
  dndItemBase: {
    backgroundColor: "#009f3c33",
  },
  addArrowContainer: {
    display: "flex",
    flexFlow: "column",
    height: 60,
    marginLeft: 10,
  },
  addArrowItem: {
    height: 25,
    width: 25,
  },
}));

const ProductAddEditComponent = (props) => {
  const [product, setProduct] = useState({ custom: true });
  const [categoryError, setCategoryError] = useState(false);
  const [nameError, setNameError] = useState();
  const [vatBarcodeError, setVatBarcodeError] = useState();
  const [barcodeError, setBarcodeError] = useState();
  const [tinError, setTinError] = useState();
  const [unitCount, setUnitCount] = useState();
  const [units, setUnits] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [unit, setUnit] = useState();
  const [unitError, setUnitError] = useState(false);
  const [priceError, setPriceError] = useState(false);

  const currentBranch = useSelector(
    (state) => state.get("dashboard").currentBranch
  );
  const myCatalog = useSelector((state) => state.get("myCatalog").myCatalog);
  const isLoading = useSelector(
    (state) => state.get("myCatalog").isDialogLoading
  );
  const dialogProduct = useSelector(
    (state) => state.get("myCatalog").dialogProduct
  );
  const unitList = useSelector((state) => state.get("myCatalog").unitList);
  const productLoading = useSelector(
    (state) => state.get("myCatalog").productListLoading
  );
  const vatList = useSelector((state) => state.get("myCatalog").vatList);

  const dispatch = useDispatch();
  const classes = useStyles();

  const { t } = useTranslation();

  useEffect(
    () => {
      dispatch(fetchUnitList());
      dispatch(fetchVatList());
    },
    [dispatch]
  );

  useEffect(
    () => {
      if (props.current) {
        dispatch(fetchProductById(props.current.id, currentBranch));
      }
    },
    [currentBranch, dispatch, props]
  );

  useEffect(
    () => {
      if (dialogProduct) {
        console.log("dialog");

        if (dialogProduct.units && dialogProduct.units.length > 0) {
          let index = 0;
          let firstTime = true;
          let uList = dialogProduct.units.map((u, i) => {
            let found = unitList && unitList.find((u1) => u1.id === u.unitId);
            if (u.coefficient < 1 && firstTime) {
              index = i;
              firstTime = false;
            }
            return {
              isBase: u.base,
              coefficient: u.coefficient,
              unit: found,
              count: u.count,
            };
          });
          setUnits(uList);
        }
        if (dialogProduct.vatRate === null) {
          setProduct({ ...dialogProduct });
        } else {
          let vat = vatList.find((v) => v.percent === dialogProduct.vatRate);
          if (vat) {
            setProduct({ ...dialogProduct, vatRate: vat.id });
          } else {
            setProduct({ ...dialogProduct });
          }
        }
      }
    },
    [dialogProduct, unitList, vatList]
  );

  useEffect(
    () => {
      if (!props.open) {
        dispatch(setDialogProduct(undefined));
        setProduct({ custom: true });
        setUnits([]);
      }
    },
    [dispatch, props.open]
  );

  useEffect(
    () => {
      if (props.categoryId !== undefined && product) {
        setProduct({ ...product, categoryDTO: { id: props.categoryId } });
      }
    },
    [product, props.categoryId]
  );

  const calculateCoeff = (units) => {
    if (units && units.length > 1) {
      let index = 0;
      units.forEach((u, i) => {
        if (u && u.isBase) {
          index = i;
          return;
        }
      });
      if (index > 0 && index !== units.length - 1) {
        for (let i = index - 1; i >= 0; i--) {
          if (units[i] && units[i + 1]) {
            units[i].coefficient =
              parseFloat(units[i + 1].coefficient || 1.0) / units[i].count;
          }
        }
        for (let i = index + 1; i < units.length; i++) {
          if (units[i] && units[i - 1]) {
            units[i].coefficient =
              parseFloat(units[i - 1].coefficient || 1.0) * units[i].count;
          }
        }
      } else if (index === 0) {
        for (let i = 1; i < units.length; i++) {
          if (units[i] && units[i - 1]) {
            units[i].coefficient =
              parseFloat(units[i - 1].coefficient || 1.0) * units[i].count;
          }
        }
      } else if (index === units.length - 1) {
        for (let i = index - 1; i >= 0; i--) {
          if (units[i + 1] && units[i]) {
            units[i].coefficient =
              parseFloat(units[i + 1].coefficient || 1.0) / units[i].count;
          }
        }
      }
    }
    setUnits([...units]);
  };

  const renderCatalogMenu = (catalog) => {
    if (catalog && catalog.length !== 0) {
      let nextStep = 0;
      let result = [];
      const form = (items) => {
        items.forEach((item) => {
          if (item.children && item.children.length !== 0) {
            result.push({ ...item, nesting: nextStep++ });
            form(item.children);
          } else {
            result.push({ ...item, nesting: nextStep });
          }
          if (items.indexOf(item) === items.length - 1 && nextStep > 0) {
            nextStep--;
          }
        });
      };
      form(catalog);
      return result.map((item, index) => {
        return (
          <MenuItem key={index} value={item.id}>
            <Typography
              variant="h4"
              style={{
                fontSize: 16,
                color: "#555",
                paddingLeft: `${item.nesting * 15}px`,
              }}
            >
              {item.name}
            </Typography>
          </MenuItem>
        );
      });
    }
  };

  const onClose = (success) => {
    setProduct({ custom: true });
    props.onDialogClose && props.onDialogClose(success);
  };

  const onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }
    const items = reorder(units, result.source.index, result.destination.index);

    calculateCoeff(items);
  };

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  if (isLoading) {
    return (
      <Grid container justify="center" style={{ padding: 20 }}>
        <CircularProgress variant="indeterminate" color="primary" />
      </Grid>
    );
  }

  return (
    <Grid container style={{ height: "100vh", position: "relative" }}>
      <Grid
        container
        direction="row"
        alignItems="center"
        className={classes.title}
      >
        <IconButton
          color="primary"
          onClick={() => {
            dispatch(setSelectedCategoryId(undefined));
            props.onBack && props.onBack();
          }}
        >
          <ArrowBackIosOutlined />
        </IconButton>
        <div style={{ marginLeft: 10, fontWeight: "bold" }}>
          {" "}
          {t("productAddEdit.title")}{" "}
        </div>
      </Grid>
      <Paper className={classes.content}>
        <Grid container direction="row">
          <Grid item xs={12} md={6}>
            <div className={classes.title}>
              {t("productAddEdit.about_product")}
            </div>
            <Grid container direction="column">
              <Grid item xs={12} style={{ marginTop: 30 }}>
                <SelectBox
                  label={t("productAddEdit.group")}
                  customItems={true}
                  disabled={product && !product.custom}
                  error={categoryError}
                  labelWidth={100}
                  value={
                    product && product.categoryDTO ? product.categoryDTO.id : ""
                  }
                  onChange={(event) => {
                    setProduct({
                      ...product,
                      categoryDTO: { id: event.target.value },
                    });
                    setCategoryError(false);
                  }}
                >
                  {myCatalog && renderCatalogMenu(myCatalog)}
                </SelectBox>
              </Grid>
              <Grid item xs={12} style={{ marginTop: 10 }}>
                <TextField
                  error={nameError && nameError !== ""}
                  disabled={product && !product.custom}
                  variant="outlined"
                  fullWidth
                  label={t("productAddEdit.product_name")}
                  helperText={nameError}
                  value={product ? product.name : ""}
                  onChange={(event) => {
                    setNameError(undefined);
                    setProduct({ ...product, name: event.target.value });
                  }}
                />
              </Grid>
              <Grid item xs={12} style={{ marginTop: 10 }}>
                <TextField
                  type="number"
                  variant="outlined"
                  fullWidth
                  label={t("productAddEdit.tinPinFL")}
                  value={product ? product.committentTin : ""}
                  error={tinError && tinError !== ""}
                  helperText={tinError}
                  onChange={(event) => {
                    let matches = event.target.value;

                    if (matches) {
                      if (matches.length < 15) {
                        setProduct({ ...product, committentTin: matches });
                        setTinError(undefined);
                      }
                    } else {
                      setProduct({ ...product, committentTin: undefined });
                      setTinError(undefined);
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} style={{ marginTop: 10 }}>
                <TextField
                  variant="outlined"
                  fullWidth
                  label={t("productAddEdit.barCode")}
                  disabled={product && !product.custom}
                  value={product ? product.barcode : ""}
                  error={barcodeError && barcodeError !== ""}
                  helperText={barcodeError}
                  onChange={(event) => {
                    let matches = (event.target.value || "").match(/(\d+)/);
                    if (matches) {
                      setProduct({ ...product, barcode: matches[0] });
                      setBarcodeError(undefined);
                    } else {
                      setProduct({ ...product, barcode: "" });
                      setBarcodeError(undefined);
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12} style={{ marginTop: 10 }}>
                <TextField
                  error={vatBarcodeError && vatBarcodeError !== ""}
                  helperText={vatBarcodeError}
                  variant="outlined"
                  fullWidth
                  type="number"
                  label="ИКПУ"
                  value={product ? product.vatBarcode : ""}
                  onChange={(event) => {
                    if (event.target.value.length < 18)
                      setProduct({
                        ...product,
                        vatBarcode: event.target.value,
                      });
                    if (vatBarcodeError && vatBarcodeError !== "")
                      setVatBarcodeError(undefined);
                  }}
                />
              </Grid>
              <Grid container justify="center" style={{ marginTop: 10 }}>
                <Grid item xs={6}>
                  <SelectBox
                    label={t("common.unit")}
                    itemKey="id"
                    itemValue="name"
                    error={unitError}
                    disabled={units.length > 1}
                    data={unitList}
                    value={product && product.unit ? product.unit.id : ""}
                    onChange={(event) => {
                      let found = unitList.find(
                        (u) => u.id === event.target.value
                      );
                      setProduct({ ...product, unit: found });
                      setUnitError(false);
                      setUnits([
                        {
                          isBase: true,
                          unit: { ...found },
                          count: 1,
                          coefficient: 1.0,
                        },
                      ]);
                      setEditMode(false);
                    }}
                  />
                </Grid>

                <Grid
                  item
                  xs={3}
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <Checkbox
                    color="primary"
                    checked={product.favorite === true}
                    onChange={() => {
                      setProduct({ ...product, favorite: !product.favorite });
                    }}
                  />{" "}
                  <span style={{ marginLeft: 10, fontWeight: "bold" }}>
                    {" "}
                    {t("productAddEdit.favorite")}{" "}
                  </span>
                </Grid>
                <Grid
                  item
                  xs={3}
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <Checkbox
                    color="primary"
                    checked={!!product.hasMark}
                    onChange={() => {
                      setProduct({ ...product, hasMark: !product.hasMark });
                    }}
                  />{" "}
                  <span style={{ marginLeft: 10, fontWeight: "bold" }}>
                    {" "}
                    {t("productAddEdit.mark")}{" "}
                  </span>
                </Grid>
              </Grid>
              <div
                style={{
                  display: unitError ? "block" : "none",
                  color: "red",
                  fontSize: 12,
                }}
              >
                {" "}
                {t("productAddEdit.select_unit")}{" "}
              </div>
              <Grid item xs={12} style={{ marginTop: 10 }}>
                <NumberTextField
                  fullWidth
                  variant="outlined"
                  label={t("productAddEdit.sale_price")}
                  value={product ? product.salesPrice : ""}
                  error={priceError}
                  helperText={
                    priceError ? t("productAddEdit.enter_price") : undefined
                  }
                  onChange={(event) => {
                    console.log("eeee", event.target.value);
                    setPriceError(false);
                    let price = parseFloat(event.target.value);
                    setProduct({
                      ...product,
                      salesPrice: isNaN(price) ? "" : `${price}`,
                    });
                    calculateCoeff(units);
                  }}
                />
              </Grid>
              {/* <Grid item xs={12} style={{marginTop: 10}}>
                                <SelectBox
                                    label={t("productAddEdit.social_title")}
                                    itemKey='id'
                                    itemValue='name'
                                    disabled={product && !product.custom}
                                    value={product && product.noVat ? 0 : 1}
                                    data={[
                                        {
                                            id: 0,
                                            name: t("productAddEdit.social")
                                        },
                                        {
                                            id: 1,
                                            name: t("productAddEdit.no_social")
                                        }
                                    ]}
                                    onChange={event => {
                                        setProduct({...product, noVat: event.target.value == 0});
                                    }}
                                />
                            </Grid> */}
              <Grid item xs={12} style={{ marginTop: 10 }}>
                <SelectBox
                  label="НДС"
                  itemKey="id"
                  itemValue="name"
                  // disabled={!!props.current}
                  value={product && product.vatRate ? product.vatRate : -1}
                  data={[
                    {
                      id: -1,
                      name: "Без НДС",
                    },
                    ...vatList.map((v) => ({
                      id: v.id,
                      name: `${v.name} - ${v.percent}%`,
                    })),
                  ]}
                  onChange={(event) => {
                    let vat =
                      event.target.value === -1 ? null : event.target.value;
                    setProduct({
                      ...product,
                      vatRate: vat,
                      noVat: vat === null,
                    });
                  }}
                />
              </Grid>
              <Grid container justify="flex-end" style={{ marginTop: 25 }}>
                <Grid item>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      console.log(">>>>>>>>>  click");
                      let error = false;
                      if (
                        !product.categoryDTO ||
                        product.categoryDTO.id === undefined
                      ) {
                        setCategoryError(t("productAddEdit.select_category"));
                        error = true;
                      }
                      if (!product.name) {
                        setNameError(t("productAddEdit.enter_name"));
                        error = true;
                      }
                      if (
                        !product.vatBarcode ||
                        (product.vatBarcode && product.vatBarcode.length !== 17)
                      ) {
                        setVatBarcodeError("Введите 17-значный ИКПУ код.");
                        error = true;
                      }
                      if (!product.barcode) {
                        setBarcodeError(t("productAddEdit.enter_barcode"));
                        error = true;
                      }
                      if (
                        product.committentTin &&
                        ![14, 9].includes(product.committentTin.length)
                      ) {
                        setTinError(t("productAddEdit.enter_tin"));
                        error = true;
                      }
                      if (!product.unit) {
                        setUnitError(true);
                        error = true;
                      }
                      if (!product.salesPrice) {
                        setPriceError(true);
                        error = true;
                      }
                      if (error) return;
                      let p = { ...product };
                      if (p.vatRate) {
                        let vat = (vatList || []).find(
                          (v) => v.id === p.vatRate
                        );
                        if (vat) {
                          p.vatRate = vat.percent;
                        } else {
                          p.vatRate = null;
                        }
                      } else {
                        p.vatRate = null;
                      }
                      if (units.length > 0) {
                        let order = 0;
                        p.units = units
                          .filter((u) => u !== undefined)
                          .map((u) => {
                            return {
                              coefficient: u.coefficient,
                              count: u.count,
                              sorder: order++,
                              unitId: u.unit.id,
                              base: u.isBase,
                            };
                          });
                      }

                      if (props.current) {
                        dispatch(updateProduct(p, onClose, currentBranch));
                      } else {
                        dispatch(createProduct(p, onClose, currentBranch));
                      }
                      dispatch(setSelectedCategoryId(undefined));
                    }}
                    disabled={productLoading || editMode}
                  >
                    {props.current ? t("common.update") : t("common.save")}
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid
            item
            xs={12}
            md={6}
            style={{
              paddingLeft: 10,
              display: product.unit ? "block" : "none",
            }}
          >
            <Grid item xs={12} className={classes.title}>
              {t("productAddEdit.units")}
            </Grid>
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="droppable">
                {(provided) => {
                  return (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={classes.dndContainer}
                    >
                      {units.map((u, i) => {
                        if (u && u.isBase) {
                          return (
                            <Draggable key={i} draggableId={`${i}`} index={i}>
                              {(provided, snapshot) => {
                                return (
                                  <div
                                    {...provided.draggableProps}
                                    ref={provided.innerRef}
                                    className={clsx(
                                      classes.dndItem,
                                      classes.dndItemBase
                                    )}
                                    style={{
                                      ...provided.draggableProps.style,
                                      marginTop: 10,
                                      border: snapshot.isDragging
                                        ? "2px solid #ff3955"
                                        : "1px solid #009f3c",
                                    }}
                                  >
                                    <div>{i + 1}.</div>
                                    <div
                                      {...provided.dragHandleProps}
                                      style={{
                                        marginLeft: 10,
                                        display: "flex",
                                        alignItems: "center",
                                      }}
                                    >
                                      <List color="primary" />{" "}
                                    </div>
                                    <div
                                      style={{
                                        marginLeft: 10,
                                        minWidth: 380,
                                        flexGrow: 1,
                                      }}
                                    >
                                      {t("productAddEdit.base_unit")} -{" "}
                                      {u.unit && u.unit.name}.
                                    </div>
                                    {editMode ? (
                                      undefined
                                    ) : (
                                      <div>
                                        {" "}
                                        1 {u.unit && u.unit.name} -{" "}
                                        {numeral(
                                          Number(product.salesPrice) || 0
                                        ).format("0,0.0000")}{" "}
                                        &nbsp; {t("common.sum")}{" "}
                                      </div>
                                    )}
                                    {editMode ? (
                                      undefined
                                    ) : (
                                      <div
                                        className={classes.addArrowContainer}
                                      >
                                        <KeyboardArrowUp
                                          color="primary"
                                          className={classes.addArrowItem}
                                          onClick={() => {
                                            let a = [...units];
                                            a.splice(i, 0, undefined);
                                            setUnits(a);
                                            setEditMode(true);
                                          }}
                                        />
                                        <KeyboardArrowDown
                                          color="primary"
                                          className={classes.addArrowItem}
                                          style={{ marginTop: 10 }}
                                          onClick={() => {
                                            if (i === units.length - 1) {
                                              let a = [...units];
                                              a.push(undefined);
                                              setUnits(a);
                                            } else {
                                              let a = [...units];
                                              a.splice(i + 1, 0, undefined);
                                              setUnits(a);
                                            }
                                            setEditMode(true);
                                          }}
                                        />
                                      </div>
                                    )}
                                  </div>
                                );
                              }}
                            </Draggable>
                          );
                        } else {
                          let mainIndex = 0;
                          units.forEach((a, index) => {
                            if (a && a.isBase) {
                              mainIndex = index;
                            }
                          });

                          if (u) {
                            let srcUnit, destUnit;
                            let price = 0.0;
                            if (i < mainIndex) {
                              if (units[i + 1]) {
                                srcUnit = units[i + 1].unit;
                              } else {
                                srcUnit = units[i + 2].unit;
                              }
                              destUnit = u.unit;
                              if (i === 0) {
                              }
                            } else {
                              srcUnit = u.unit;
                              if (units[i - 1]) {
                                destUnit = units[i - 1].unit;
                              } else {
                                destUnit = units[i - 2].unit;
                              }
                            }
                            return (
                              <Draggable key={i} draggableId={`${i}`} index={i}>
                                {(provided, snapshot) => {
                                  return (
                                    <div
                                      {...provided.draggableProps}
                                      ref={provided.innerRef}
                                      className={classes.dndItem}
                                      style={{
                                        marginTop: 10,
                                        border: snapshot.isDragging
                                          ? "2px solid #ff3955"
                                          : "1px solid #009f3c",
                                        ...provided.draggableProps.style,
                                      }}
                                    >
                                      <div>{i + 1}.</div>
                                      <div
                                        {...provided.dragHandleProps}
                                        style={{
                                          marginLeft: 10,
                                          display: "flex",
                                          alignItems: "center",
                                        }}
                                      >
                                        {" "}
                                        <List color="primary" />{" "}
                                      </div>
                                      <div
                                        style={{
                                          marginLeft: 10,
                                          minWidth: 380,
                                          flexGrow: 1,
                                        }}
                                      >
                                        {`1 ${srcUnit &&
                                          srcUnit.name} - ${numeral(
                                          Number(u.count)
                                        ).format("0,0.0000")} ${destUnit &&
                                          destUnit.name}`}
                                      </div>
                                      {editMode ? (
                                        undefined
                                      ) : (
                                        <div>
                                          {" "}
                                          1{" "}
                                          {destUnit && srcUnit
                                            ? u.coefficient > 1
                                              ? srcUnit.name
                                              : destUnit.name
                                            : "-"}{" "}
                                          -{" "}
                                          {numeral(
                                            Number(
                                              (u.coefficient || 0) *
                                                (product.salesPrice || 0)
                                            )
                                          ).format("0,0.0000")}{" "}
                                          {t("common.sum")}{" "}
                                        </div>
                                      )}
                                      {!editMode ? (
                                        <Button
                                          color="secondary"
                                          onClick={() => {
                                            let u = [...units];
                                            u.splice(i, 1);
                                            calculateCoeff(u);
                                          }}
                                          style={{ marginLeft: 10 }}
                                        >
                                          {" "}
                                          {t("common.delete")}{" "}
                                        </Button>
                                      ) : (
                                        undefined
                                      )}
                                      {editMode ? (
                                        undefined
                                      ) : (
                                        <div
                                          className={classes.addArrowContainer}
                                        >
                                          <KeyboardArrowUp
                                            color="primary"
                                            className={classes.addArrowItem}
                                            onClick={() => {
                                              let a = [...units];
                                              a.splice(i, 0, undefined);
                                              setUnits(a);
                                              setEditMode(true);
                                            }}
                                          />
                                          <KeyboardArrowDown
                                            color="primary"
                                            className={classes.addArrowItem}
                                            style={{ marginTop: 10 }}
                                            onClick={() => {
                                              if (i === units.length - 1) {
                                                let a = [...units];
                                                a.push(undefined);
                                                setUnits(a);
                                              } else {
                                                let a = [...units];
                                                a.splice(i + 1, 0, undefined);
                                                setUnits(a);
                                              }
                                              setEditMode(true);
                                            }}
                                          />
                                        </div>
                                      )}
                                    </div>
                                  );
                                }}
                              </Draggable>
                            );
                          } else {
                            return (
                              <Draggable key={i} draggableId={`${i}`} index={i}>
                                {(provided, snapshot) => {
                                  return (
                                    <div
                                      {...provided.draggableProps}
                                      ref={provided.innerRef}
                                      className={classes.dndItem}
                                      style={{
                                        marginTop: 10,
                                        border: snapshot.isDragging
                                          ? "2px solid #ff3955"
                                          : "1px solid #009f3c",
                                        ...provided.draggableProps.style,
                                      }}
                                    >
                                      <div>{i + 1}.</div>
                                      <div
                                        {...provided.dragHandleProps}
                                        style={{
                                          marginLeft: 10,
                                          display: "flex",
                                          alignItems: "center",
                                        }}
                                      >
                                        {" "}
                                        <List color="primary" />{" "}
                                      </div>
                                      {i < mainIndex ? (
                                        <div
                                          style={{
                                            display: "flex",
                                            flexFlow: "row",
                                            flexGrow: 1,
                                            alignItems: "center",
                                          }}
                                        >
                                          <div style={{ marginLeft: 10 }}>
                                            1 {units[i + 1].unit.name} =
                                          </div>
                                          <div
                                            style={{
                                              marginLeft: 10,
                                              width: 150,
                                            }}
                                          >
                                            <TextField
                                              variant="standard"
                                              fullWidth
                                              value={unitCount}
                                              onChange={(event) => {
                                                setUnitCount(
                                                  parseFloat(
                                                    event.target.value
                                                  ) || "0"
                                                );
                                              }}
                                            />
                                          </div>
                                          <div
                                            style={{
                                              marginLeft: 10,
                                              width: 150,
                                            }}
                                          >
                                            <SelectBox
                                              label={t("common.unit")}
                                              itemKey="id"
                                              itemValue="name"
                                              data={unitList.filter(
                                                (a) =>
                                                  a.id !== product.unit.id &&
                                                  !units.find(
                                                    (u) =>
                                                      u &&
                                                      u.unit &&
                                                      u.unit.id === a.id
                                                  )
                                              )}
                                              value={unit}
                                              onChange={(event) => {
                                                setUnit(event.target.value);
                                              }}
                                            />
                                          </div>
                                        </div>
                                      ) : (
                                        <div
                                          style={{
                                            display: "flex",
                                            flexFlow: "row",
                                            flexGrow: 1,
                                            alignItems: "center",
                                          }}
                                        >
                                          <div style={{ marginLeft: 10 }}>
                                            {" "}
                                            1{" "}
                                          </div>
                                          <div
                                            style={{
                                              marginLeft: 10,
                                              width: 250,
                                            }}
                                          >
                                            <SelectBox
                                              label={t("common.unit")}
                                              itemKey="id"
                                              itemValue="name"
                                              data={unitList.filter(
                                                (a) =>
                                                  a.id !== product.unit.id &&
                                                  !units.find(
                                                    (u) =>
                                                      u &&
                                                      u.unit &&
                                                      u.unit.id === a.id
                                                  )
                                              )}
                                              value={unit}
                                              onChange={(event) => {
                                                setUnit(event.target.value);
                                              }}
                                            />
                                          </div>{" "}
                                          =
                                          <div
                                            style={{
                                              marginLeft: 10,
                                              width: 150,
                                            }}
                                          >
                                            <TextField
                                              variant="standard"
                                              fullWidth
                                              value={unitCount}
                                              onChange={(event) => {
                                                setUnitCount(
                                                  parseFloat(
                                                    event.target.value
                                                  ) || "0"
                                                );
                                              }}
                                            />
                                          </div>
                                          <div style={{ marginLeft: 10 }}>
                                            {units[i - 1].unit.name}
                                          </div>
                                        </div>
                                      )}
                                      <Button
                                        color="primary"
                                        style={{ marginLeft: 10 }}
                                        disabled={
                                          unit === undefined ||
                                          !unitCount ||
                                          unitCount <= 0
                                        }
                                        onClick={() => {
                                          let found = unitList.find(
                                            (a) => a.id === unit
                                          );
                                          let newUnit = {
                                            unit: found,
                                            count: unitCount,
                                            isBase: false,
                                          };
                                          let a = [...units];
                                          a.splice(i, 0, newUnit);
                                          a = a.filter((u) => u !== undefined);
                                          setUnits(a);
                                          calculateCoeff(a);
                                          setUnit(undefined);
                                          setUnitCount(undefined);
                                          setEditMode(false);
                                        }}
                                      >
                                        {t("productAddEdit.save_abbr")}
                                      </Button>
                                      <Button
                                        color="secondary"
                                        style={{ marginLeft: 10 }}
                                        onClick={() => {
                                          let a = [...units];
                                          a = a.filter((u) => u !== undefined);
                                          setUnits(a);
                                          setUnit(undefined);
                                          setUnitCount(undefined);
                                          setEditMode(false);
                                        }}
                                      >
                                        {t("productAddEdit.cancel_abbr")}
                                      </Button>
                                    </div>
                                  );
                                }}
                              </Draggable>
                            );
                          }
                        }
                      })}
                    </div>
                  );
                }}
              </Droppable>
            </DragDropContext>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
};

export default withRouter(withNotification(ProductAddEditComponent));
