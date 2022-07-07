import React, {useEffect, useState} from "react";
import {CircularProgress, TextField} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete/Autocomplete";
import Logic from "#businessLayer";
import {useTranslation} from "react-i18next";
import axios from "axios";

const CancelToken = axios.CancelToken;
var source = CancelToken.source();

const ProductSelectBox = props => {

    const { t } = useTranslation();

    const [productSearchOpen, setProductSearchOpen] = useState(false);
    const [productList, setProductList] = useState([]);
    const [productSearchLoading, setProductSearchLoading] = useState(false);

    useEffect(() => {
        if (props.value) {
            Logic
                .product
                .fetchProductListForKeyword({search: props.value.name || '', withBalance: false, branchId: props.branchId}, source.token)
                .then(response => {
                    setProductList(response.data);
                    setProductSearchLoading(false);

                })
                .catch(_ => {
                    setProductSearchLoading(false);
                })
        }
    }, [props.branchId]);

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
            getOptionLabel={(option) => option.name}
            options={(() => {
                if (productList) {
                    if (props.value) {
                        let found = productList.find(p => p.id === props.value.id);                        
                        if (!found) {                            
                            return [...productList, props.value].filter(Boolean)
                        } else {
                            return productList
                        }
                    } else {
                        return productList
                    }
                };
                if (props.options) return props.options;
                return []
            })()}
            loading={productSearchLoading}
            onChange={(e, v) => {
                props.onProductSelect && props.onProductSelect(v)                
            }}
            value={props.value}
            noOptionsText={t("common.empty_list")}
            renderInput={(params) => (
                <TextField
                    {...params}
                    fullWidth
                    label={t("balance.product")}
                    variant="outlined"
                    onChange={e => {

                        if (!e.target.value)  {
                            setProductList([]);
                        } else {
                            setProductSearchLoading(true);
                            Logic
                                .product
                                .fetchProductListForKeyword({search: e.target.value, withBalance: false, branchId: props.branchId}, source.token)
                                .then(response => {
                                    setProductList(response.data);
                                    setProductSearchLoading(false);
                                })
                                .catch(_ => {
                                    setProductSearchLoading(false);
                                })
                        }
                    }}
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <React.Fragment>
                                {productSearchLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                            </React.Fragment>
                        ),
                    }}
                />
            )}
        />
    )
};

export default ProductSelectBox;
