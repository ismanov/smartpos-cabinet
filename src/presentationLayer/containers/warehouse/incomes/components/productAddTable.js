import React, { useState, useEffect } from "react";
import {
  Grid,
  TextField,
  Table,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  IconButton,
  Hidden,
  Typography,
} from "@material-ui/core";
import { DeleteOutlined, AddOutlined } from "@material-ui/icons";
import Select from "react-select";
import { useSelector } from "react-redux";
import SelectBox from "../../../../components/Select";
import { useTranslation } from "react-i18next";
import Logic from "#businessLayer";
import axios from "axios";

const CancelToken = axios.CancelToken;
var source = CancelToken.source();

const ProductAddTable = (props) => {
  const [rows, setRows] = useState([]);
  const owner = useSelector((state) => state.get("dashboard").currentOwner);

  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [productList, setProductList] = useState([]);
  const [unitList, setUnitList] = useState([]);
  const [product, setProduct] = useState();
  const [productError, setProductError] = useState();
  const [unit, setUnit] = useState();
  const [unitError, setUnitError] = useState(false);
  const [qty, setQty] = useState();
  const [cost, setCost] = useState();
  const [markup, setMarkup] = useState();
  const [markupPercent, setMarkupPercent] = useState();
  const [salesPrice, setSalesPrice] = useState();
  const [qtyError, setQtyError] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState();

  const [changeBy, setChangeBy] = useState();

  const { t } = useTranslation();

  useEffect(
    () => {
      setSelectedProduct(undefined);
      setProductList([]);
      setProduct();
      setUnit(undefined);
      setUnitList([]);
    },
    [props.branchId]
  );
  useEffect(
    () => {
      props.onProductListChanged && props.onProductListChanged([...rows]);
    },
    [rows]
  );

  useEffect(
    () => {
      calculateMarkup(changeBy);
    },
    [cost, markup, markupPercent, salesPrice, changeBy]
  );

  const calculateMarkup = (changeBy) => {
    if (cost) {
      let nds = 1;
      if (product && !product.noVat && owner && owner.ndsPercent) {
        nds = 1 + Number(parseFloat(owner.ndsPercent) / 100);
      }
      switch (changeBy) {
        case 0: // cost
          setSalesPrice(Number(((markup || 0) + cost) * nds).toFixed(2));
          setMarkupPercent(
            Number((100 * Number(markup)) / Number(cost)).toFixed(2)
          );
          break;
        case 1: // markup percentage
          setSalesPrice(
            Number(
              (Number(cost) + (Number(markupPercent) * Number(cost)) / 100) *
                nds
            ).toFixed(2)
          );
          setMarkup(
            Number((Number(cost) * Number(markupPercent)) / 100).toFixed(2)
          );
          break;
        case 2: // markup amount
          setSalesPrice(
            Number((Number(markup) + Number(cost)) * nds).toFixed(2)
          );
          setMarkupPercent(
            Number((100 * Number(markup)) / Number(cost)).toFixed(2)
          );
          break;
        case 3: // sales price
          setMarkupPercent(
            Number((Number(salesPrice) / Number(cost) - 1) * 100 * nds).toFixed(
              2
            )
          );
          setMarkup(Number(Number(salesPrice) - Number(cost)).toFixed(2));
          break;
        default:
          break;
      }
    }
  };

  const addIncomeProduct = () => {
    if (!(product && product.id)) {
      setProductError(true);
      return;
    }

    if (!unit) {
      setUnitError(true);
      return;
    }

    if (isNaN(qty) || !Number(qty)) {
      setQtyError(t("incomeDetail.enter_qty"));
      return;
    }

    setRows([
      {
        product,
        productId: product.id,
        costPrice: cost,
        totalCost: Number(cost) * Number(qty),
        markup,
        salesPrice,
        qty,
        unit,
      },
      ...rows,
    ]);

    setUnitList([]);
    setProduct(undefined);
    setProductError(false);
    setQtyError(undefined);
    setQty(undefined);
    setCost(undefined);
    setMarkup(undefined);
    setMarkupPercent(undefined);
    setSalesPrice(undefined);
    setSelectedProduct(undefined);
    setUnit(undefined);
  };

  return (
    <Grid container style={{ overflowY: "visible" }}>
      <Table>
        <TableHead style={{ backgroundColor: "#eee", color: "#555" }}>
          <TableCell style={{ fontWeight: "bold", padding: 15, margin: 0 }}>
            {t("incomeDetail.product_name")}
          </TableCell>
          <TableCell style={{ fontWeight: "bold", padding: 0 }}>
            {t("common.unit")}
          </TableCell>
          <TableCell style={{ fontWeight: "bold", padding: 0 }}>
            {t("common.qty")}
          </TableCell>
          <TableCell style={{ fontWeight: "bold", padding: 0 }}>
            {t("incomeDetail.cost")}
          </TableCell>
          <TableCell style={{ fontWeight: "bold", padding: 0 }}>
            {t("incomeDetail.additional")}
          </TableCell>
          <TableCell style={{ fontWeight: "bold", padding: 0 }}>
            {t("incomeDetail.procent")}
          </TableCell>
          <TableCell style={{ fontWeight: "bold", padding: 0 }}>
            {t("incomeDetail.salePrice")}
          </TableCell>
          <TableCell style={{ fontWeight: "bold", padding: 0 }}>
            {t("incomeDetail.operations")}
          </TableCell>
        </TableHead>
        <TableBody>
          {rows &&
            rows.map((product, index) => {
              return (
                <TableRow key={index} style={{ padding: 0 }}>
                  <TableCell style={{ padding: 0 }}>
                    <div>{product.product.name}</div>
                  </TableCell>
                  <TableCell style={{ padding: 0 }}>
                    <div style={{ width: 100 }}>
                      {product.unit ? product.unit.name : "-"}
                    </div>
                  </TableCell>
                  <TableCell style={{ padding: 0 }}>
                    <div style={{ width: 100 }}>{product.qty || 0}</div>
                  </TableCell>
                  <TableCell style={{ padding: 0 }}>
                    <div>{product.costPrice || 0}</div>
                  </TableCell>
                  <TableCell style={{ padding: 0 }}>
                    <div style={{ fontSize: 12, color: "#555" }}>
                      {!product.product.noVat && owner && owner.ndsPercent
                        ? `${t("incomeDetail.nds")} - ${owner.ndsPercent}%`
                        : t("incomeDetail.noNds")}
                    </div>
                    <div>
                      {`${
                        product.unit && product.unit.price
                          ? product.unit.price
                          : 0
                      } ${t("common.sum")}${
                        product.unit && product.unit.name
                          ? "/" + product.unit.name
                          : ""
                      }`}
                    </div>
                    {/*<div>*/}
                    {/*    {product.totalCost || 0}*/}
                    {/*</div>*/}
                  </TableCell>
                  <TableCell>
                    <div style={{ width: 200 }}>{product.markup || 0}</div>
                  </TableCell>
                  <TableCell>
                    <div style={{ width: 150 }}>{product.salesPrice || 0}</div>
                  </TableCell>
                  <TableCell style={{ padding: 0 }}>
                    <IconButton
                      onClick={() => {
                        let list = [...rows];
                        list.splice(index, 1);
                        setRows([...list]);
                      }}
                    >
                      <DeleteOutlined color="inherit" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}

          <TableRow style={{ marginTop: 5 }}>
            <TableCell
              variant="body"
              style={{ width: "30%", padding: "10px 15px" }}
            >
              <div>
                <Select
                  placeholder={t("incomeDetail.select_product")}
                  onChange={(id) => {
                    console.log("id", id);
                    let found = productList.find(
                      (item) => item.id === id.value
                    );
                    if (found) {
                      setProduct(found);
                      setSelectedProduct(id);
                      setProductError(false);
                      setUnit(undefined);
                      Logic.resource
                        .fetchUnitsForProductId(id.value, props.branchId)
                        .then((response) => {
                          setUnitList(response.data);
                        });
                    }
                    if (!id) {
                      setSelectedProduct(undefined);
                      setProductError(false);
                      setUnit(undefined);
                      setUnitList([]);
                    }
                  }}
                  value={selectedProduct || ""}
                  onInputChange={(input) => {
                    setProductError(false);

                    if (input.length >= 2) {
                      setIsSearchLoading(true);
                      Logic.product
                        .fetchProductListForKeyword(
                          {
                            search: input,
                            withBalance: true,
                            branchId: props.branchId,
                          },
                          source.token
                        )
                        .then((response) => {
                          setIsSearchLoading(false);
                          setProductList(response.data);
                        });
                    } else {
                      setProductList([]);
                    }
                  }}
                  options={productList.map((item) => ({
                    label: `${item.name}; ${t("incomeDetail.barcode")}: ${
                      item.barcode
                    }`,
                    value: item.id,
                  }))}
                  isClearable={true}
                  isMulti={false}
                  isSearchable={true}
                  isLoading={isSearchLoading}
                  noOptionsMessage={() => t("incomeDetail.nothing_found")}
                  loadingMessage={() => t("incomeDetail.searching")}
                  styles={{
                    control: (styles) => ({
                      ...styles,
                      width: "100%",
                      height: 54,
                    }),
                  }}
                />
                <Typography
                  color="secondary"
                  variant="subtitle1"
                  style={{
                    fontSize: 12,
                    display: productError === true ? "flex" : "none",
                  }}
                >
                  Выберите товар
                </Typography>
              </div>
            </TableCell>
            <TableCell
              style={{ width: "10%", padding: "10px 10px 10px 0px", margin: 0 }}
            >
              <SelectBox
                label={t("common.unit")}
                disabled={!props.branchId || !selectedProduct}
                data={unitList}
                itemKey="id"
                itemValue="name"
                error={unitError}
                value={unit ? unit.id : ""}
                onChange={(event) => {
                  let id = event.target.value;
                  let found = unitList.find((u) => u.id === id);
                  setUnit(found);
                  setUnitError(false);
                }}
              />
            </TableCell>
            <TableCell
              style={{ width: "10%", padding: "10px 10px 10px 0px", margin: 0 }}
            >
              <TextField
                variant="outlined"
                fullWidth
                placeholder={t("incomeDetail.qty_abbr")}
                error={qtyError && qtyError !== ""}
                helperText={qtyError}
                value={parseFloat(qty)}
                type="number"
                onChange={(event) => {
                  setQty(
                    isNaN(Number(event.target.value)) ||
                    Number(event.target.value) < 0
                      ? "0"
                      : event.target.value
                  );
                  setQtyError(undefined);
                }}
              />
            </TableCell>
            <TableCell
              style={{ width: "10%", padding: "10px 10px 10px 0px", margin: 0 }}
            >
              <TextField
                variant="outlined"
                fullWidth
                placeholder={t("incomeDetail.cost_abbr")}
                onChange={(event) => {
                  setChangeBy(0);
                  setCost(
                    isNaN(Number(event.target.value)) ||
                    Number(event.target.value) < 0
                      ? "0"
                      : event.target.value
                  );
                }}
                value={parseFloat(cost)}
                type="number"
              />
            </TableCell>
            <TableCell
              style={{ width: "10%", padding: "10px 10px 10px 0px", margin: 0 }}
            >
              <div style={{ fontSize: 12, color: "#555" }}>
                {selectedProduct &&
                !selectedProduct.noVat &&
                owner &&
                owner.ndsPercent
                  ? `${t("incomeDetail.nds")} - ${owner.ndsPercent}%`
                  : t("incomeDetail.noNds")}
              </div>
              <div>
                {`${unit && unit.price ? unit.price : 0} ${t("common.sum")}${
                  unit && unit.name ? "/" + unit.name : ""
                }`}
              </div>
            </TableCell>
            <TableCell
              style={{ width: "20%", padding: "10px 10px 10px 0px", margin: 0 }}
            >
              <Grid container direction="row">
                <Grid item lg={5} md={12}>
                  <TextField
                    variant="outlined"
                    fullWidth
                    placeholder={t("incomeDetail.summa")}
                    onChange={(event) => {
                      setChangeBy(2);
                      setMarkup(
                        isNaN(Number(event.target.value)) ||
                        Number(event.target.value) < 0
                          ? "0"
                          : event.target.value
                      );
                    }}
                    value={parseFloat(markup)}
                    type="number"
                  />
                </Grid>
                <Grid item xs={1}>
                  <Hidden mdDown>
                    <Grid container justify="center" alignItems="center">
                      <Typography
                        variant="h4"
                        style={{ fontSize: 25, color: "#999", marginTop: 12 }}
                      >
                        /
                      </Typography>
                    </Grid>
                  </Hidden>
                </Grid>
                <Grid item lg={6} md={12}>
                  <TextField
                    variant="outlined"
                    fullWidth
                    placeholder={t("incomeDetail.percent")}
                    onChange={(event) => {
                      setChangeBy(1);
                      setMarkupPercent(
                        isNaN(Number(event.target.value)) ||
                        Number(event.target.value) < 0
                          ? "0"
                          : event.target.value
                      );
                    }}
                    value={parseFloat(markupPercent)}
                    type="number"
                  />
                </Grid>
              </Grid>
            </TableCell>
            <TableCell style={{ width: "10%", padding: "10px 10px 10px 0px" }}>
              <TextField
                variant="outlined"
                fullWidth
                placeholder={t("incomeDetail.sale_price_abbr")}
                onChange={(event) => {
                  setChangeBy(3);
                  setSalesPrice(
                    isNaN(Number(event.target.value)) ||
                    Number(event.target.value) < 0
                      ? "0"
                      : event.target.value
                  );
                }}
                value={parseFloat(salesPrice)}
                type="number"
              />
            </TableCell>
            <TableCell style={{ width: "5%", padding: "10px 10px 10px 0px" }}>
              <IconButton onClick={addIncomeProduct}>
                <AddOutlined color="primary" />
              </IconButton>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Grid>
  );
};

export default ProductAddTable;
