import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import * as actions from "../actions";

import SearchTextField from "../../../../components/Textfields/search";
import { updateFilterSearch } from "../../../../../utils/debounceFilterSearch";
import SelectLookup from "react-select";
import { selectStyles, selectTheme } from "../../../../../utils/inputSelectOptions";

export const ArrivalListFilter = ({ onFilterChange }) => {
  const dispatch = useDispatch();
  const arrivalListFilterProps = useSelector(state => state.get("arrival").arrivalListFilterProps);
  const suppliersItems = useSelector(state => state.get("arrival").arrivalListSuppliersItems);

  const [ searchValue, setSearchValue ] = useState(arrivalListFilterProps.search);
  const [ searchLookUp, setSearchLookUp ] = useState(false);

  useEffect(() => {
    dispatch(
      actions.getArrivalListSuppliersItemsAction()
    )
  }, []);

  const onSearchChange = (search) => {
    setSearchValue(search);

    updateFilterSearch(() => {
      onFilterChange({
        search,
      })
    })
  };

  const onSupplierChange = (supplier) => {
    onFilterChange({
      supplier
    })
  };

  const onSupplierSearch = (value, e) => {
    if (e.action === "input-change") {
      setSearchLookUp(!!value);
      updateFilterSearch(() => {
        dispatch(
          actions.getArrivalListSuppliersItemsAction({search: value})
        )
      })
    }

    if (e.action === "menu-close" && searchLookUp) {
      setSearchLookUp(false);
      updateFilterSearch(() => {
        dispatch(
          actions.getArrivalListSuppliersItemsAction()
        )
      })
    }
  };

  return (
    <div className="filter-block">
      <div className="filter-block__item">
        <SearchTextField
          value={searchValue || ""}
          onSearch={onSearchChange}
          onChange={onSearchChange}
        />
      </div>
      <div className="filter-block__item lookup-field suppliers-field">
        <SelectLookup
          placeholder="Выберите поставщика"
          onChange={onSupplierChange}
          value={arrivalListFilterProps.supplier ? arrivalListFilterProps.supplier : ""}
          options={suppliersItems.data.map(item => ({label: `${item.name}`, value: item.id}))}
          onInputChange={onSupplierSearch}
          isClearable={true}
          isMulti={false}
          isSearchable={!arrivalListFilterProps.supplier}
          isLoading={suppliersItems.loading}
          loadingMessage={() => "Идет поиск"}
          noOptionsMessage={() => "Ничего не найдено!"}
          styles={selectStyles()}
          theme={selectTheme}
        />
      </div>
    </div>
  )
};