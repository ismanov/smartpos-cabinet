import React, { useEffect, useState } from "react";
import { CircularProgress, TextField } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete/Autocomplete";
import Logic from "#businessLayer";
import { useTranslation } from "react-i18next";
import axios from "axios";

const CancelToken = axios.CancelToken;
var source = CancelToken.source();

const ProductSelectBoxInBranch = (props) => {
  const { t } = useTranslation();

  const [productSearchOpen, setProductSearchOpen] = useState(false);
  const [productList, setProductList] = useState([]);
  const [productSearchLoading, setProductSearchLoading] = useState(false);
  const [product, setProduct] = useState();

  useEffect(
    () => {
      if (props.value) {
        let search = props.value.name || "";
        Logic.product
          .fetchProductListForKeywordInBranch(
            {
              search: search && search.length >= 2 ? search : undefined,
              withBalance: false,
              branchId: props.branchId,
            },
            source.token
          )
          .then((response) => {
            setProductList(response.data);
            setProductSearchLoading(false);
          })
          .catch((_) => {
            setProductSearchLoading(false);
          });
      }
    },
    [props.branchId]
  );

  return (
    <Autocomplete
      {...props}
      id="products-saerch"
      open={productSearchOpen}
      onOpen={() => {
        setProductSearchOpen(true);
      }}
      onClose={() => {
        setProductSearchOpen(false);
      }}
      getOptionSelected={(option, value) => option.name === value.name}
      getOptionLabel={(option) => option.name}
      options={productList || props.options}
      loading={productSearchLoading}
      onChange={(e, v) => {
        props.onProductSelect && props.onProductSelect(v);
        setProduct(v);
      }}
      noOptionsText={t("common.empty_list")}
      renderInput={(params) => (
        <TextField
          {...params}
          fullWidth
          label={t("balance.product")}
          variant="outlined"
          onChange={(e) => {
            if (!e.target.value) {
              setProductList([]);
            } else {
              setProductSearchLoading(true);
              let search = e.target.value;
              Logic.product
                .fetchProductListForKeywordInBranch(
                  {
                    search: search && search.length >= 2 ? search : undefined,
                    withBalance: false,
                    branchId: props.branchId,
                  },
                  source.token
                )
                .then((response) => {
                  setProductList(response.data);
                  setProductSearchLoading(false);
                })
                .catch((_) => {
                  setProductSearchLoading(false);
                });
            }
          }}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {productSearchLoading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
    />
  );
};

export default ProductSelectBoxInBranch;
