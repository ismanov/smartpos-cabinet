import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import * as actions from "../actions";

import {
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField
} from "@material-ui/core";
import {SearchOutlined} from "@material-ui/icons";
import { updateFilterSearch } from "../../../../../utils/debounceFilterSearch";

export const SupplierCatalogOffersFilter = ({ onFilterPropsChange }) => {
  const dispatch = useDispatch();
  const offersListFilterProps = useSelector(state => state.get("supplierCatalog").offersListFilterProps);
  const vatItems = useSelector(state => state.get("supplierCatalog").vatItems);

  const [ searchValue, setSearchValue ] = useState(offersListFilterProps.search);

  useEffect(() => {
    dispatch(
      actions.getVatItemsAction()
    )
  }, []);

  const onFilterChange = (prop, value) => {
    onFilterPropsChange({
      page: 0,
      [prop]: value === "All" ? undefined : value
    })
  };

  const onFilterSearchChange = (e) => {
    const value = e.target.value;

    setSearchValue(value);
    updateFilterSearch(() => {
      dispatch(
        actions.updateOffersListFilterPropsAction({
          page: 0,
          search: value
        })
      )
    });
  };

  const onFilterCheckboxChange = (prop, value) => {
    onFilterChange(prop, value ? value : undefined);
  };

  return (
    <div className="supplier-catalog__filter">
      <div className="supplier-catalog__filter-item filter-search">
        <TextField
          value={searchValue || ""}
          placeholder="Поиск по товарам"
          onChange={onFilterSearchChange}
          variant="outlined"
          InputProps={{
            startAdornment: (
              <SearchOutlined color="primary" />
            )
          }}
        />
      </div>
      <div className="supplier-catalog__filter-item">
        <FormControl fullWidth variant='outlined'>
          <InputLabel>НДС</InputLabel>
          <Select
            input={<OutlinedInput labelWidth={40} />}
            value={offersListFilterProps.vatRate === undefined ? "All" : offersListFilterProps.vatRate}
            onChange={(e) => onFilterChange("vatRate", e.target.value)}
          >
            <MenuItem value="All">Все</MenuItem>
            <MenuItem value={0}>Без НДС</MenuItem>
            {vatItems.map((item) => <MenuItem value={item.percent}>НДС - {item.percent}%</MenuItem>)}
          </Select>
        </FormControl>
      </div>
      <div className="supplier-catalog__filter-item">
        <FormControl fullWidth variant='outlined'>
          <InputLabel>Доставка</InputLabel>
          <Select
            input={<OutlinedInput labelWidth={70} />}
            value={offersListFilterProps.deliveryType ? offersListFilterProps.deliveryType : "All"}
            onChange={(e) => onFilterChange("deliveryType", e.target.value)}
          >
            <MenuItem value="All">Все</MenuItem>
            <MenuItem value="DELIVERY">Доставка</MenuItem>
            <MenuItem value="EXPRESS_DELIVERY">Срочная доставка</MenuItem>
            <MenuItem value="SELF_PICKUP">Самовывоз</MenuItem>
          </Select>
        </FormControl>
      </div>
      <div className="supplier-catalog__filter-item">
        <FormControlLabel
          control={<Checkbox color="primary"/>}
          label="Мои поставщики"
          checked={offersListFilterProps.mySupplier ? offersListFilterProps.mySupplier : false}
          onChange={(e) => onFilterCheckboxChange("mySupplier", e.target.checked)}
        />
      </div>
    </div>
  )
};