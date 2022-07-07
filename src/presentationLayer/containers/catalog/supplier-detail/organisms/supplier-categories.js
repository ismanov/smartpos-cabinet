import React, { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import debounce from "@material-ui/core/utils/debounce";

import * as actions from "../actions";
import * as orderingActions from "../../../warehouse/orders/ordering/actions";

import { Checkbox, FormControlLabel, TextField, Button } from "@material-ui/core";
import SelectLookup from "react-select";
import { DropdownArrSvg } from "../../../../../assets/svg/svg-icons";

import { SupplierCategoriesTree } from "./supplier-categories-tree";

import { selectStyles, selectTheme } from "../../../../../utils/inputSelectOptions";

const updateFilterSearch = debounce((action) => {
  action();
}, 400);

function useOutsideClicked(ref, setShowMenu, setSearchCategoryKeyword) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setShowMenu(false);
        setSearchCategoryKeyword("");
      } else {
        setShowMenu(true);
      }
    }

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
}

export const SupplierDetailCategories = ({ supplierId, currentCategoryId, setCurrentCategoryId, history, isModal, closeModal }) => {
  const orderingStore = useSelector(state => state.get("ordering"));
  const supplierDetailStore = useSelector(state => state.get("supplierDetail"));
  const dispatch = useDispatch();

  const { supplierInfo, productsFilterProps, categories, currentBranch, branchesItems, selectedProducts, showSelectedProducts } = supplierDetailStore;

  const categoriesMenuRef = useRef(null);

  const [ searchCategoryKeyword, setSearchCategoryKeyword ] = useState("");
  const [ searchProductKeyword, setSearchProductKeyword ] = useState("");
  const [ showMenu, setShowMenu ] = useState(false);
  const [ categoryPlaceholder, setCategoryPlaceholder ] = useState("Выберите категорию");

  useOutsideClicked(categoriesMenuRef, setShowMenu, setSearchCategoryKeyword);

  useEffect(() => {
    if (currentBranch) {
      dispatch(
        actions.getCategoriesListAction({
          branchId: currentBranch.value
        })
      );
    }

    dispatch(
      actions.getBranchesItemsAction({ companyId: supplierId })
    );

    return () => {
      dispatch(
        actions.resetSupplierDetailAction()
      );
    }
  }, []);

  useEffect(() => {
    if (currentCategoryId) {
      dispatch(
        actions.getProductsAction({
          ...productsFilterProps,
          companyId: supplierId,
          branchId: currentBranch.value,
          categoryId: currentCategoryId
        })
      )
    }
  }, [productsFilterProps]);

  const onBranchChange = (val) => {
    dispatch(
      actions.setCategoriesBranchAction(val)
    );

    dispatch(
      actions.resetProductsAction()
    );

    setCategoryPlaceholder("Выберите категорию");

    setCurrentCategoryId(null);
    setSearchProductKeyword("");

    if (val) {
      dispatch(
        actions.getCategoriesListAction({
          branchId: val.value
        })
      );
    } else {
      dispatch(
        actions.resetCategoriesListAction()
      )
    }
  };

  const onBranchSearch = (value, e) => {
    if (value) {
      updateFilterSearch(() => {
        dispatch(
          actions.getBranchesItemsAction({ companyId: supplierId, search: value })
        )
      })
    } else if (!currentBranch && e.action === "menu-close") {
      dispatch(
        actions.getBranchesItemsAction({ companyId: supplierId })
      )
    }
  };

  const onProductSearch = (e) => {
    const value = e.target.value;

    setSearchProductKeyword(value);

    updateFilterSearch(() => {
      dispatch(
        actions.getProductsAction({
          companyId: supplierId,
          branchId: currentBranch.value,
          categoryId: currentCategoryId,
          search: value
        })
      )
    })
  };

  const onCategoryClick = (category) => {
    setCurrentCategoryId(category.id);
    setSearchCategoryKeyword("");
    setSearchProductKeyword("");
    setCategoryPlaceholder(category.name);
    setShowMenu(false);

    dispatch(
      actions.getProductsAction({
        companyId: supplierId,
        branchId: currentBranch.value,
        categoryId: category.id
      })
    )
  };

  const onShowSelectedProducts = (e) => {
    dispatch(
      actions.showSelectedProductsAction(e.target.checked)
    )
  };

  const onAddOrderingProduct = () => {
    const data = {
      list: selectedProducts,
      filterProps: {
        ...orderingStore.ordering.filterProps, // if on order page
        branch: currentBranch,
        supplier: {
          label: supplierInfo.data.name,
          value: supplierInfo.data.id
        }
      }
    };

    dispatch(
      orderingActions.addOrderingProductAction(data)
    );

    if (isModal) {
      closeModal()
    } else {
      history.push('/main/warehouse/orders/ordering');
    }
  };

  return (
    <div className="supplier-categories">
      <div className="supplier-categories-filter">
        <div className="supplier-categories-filter-item lookup-field">
          <SelectLookup
            placeholder="Выберите филиал"
            isDisabled={selectedProducts.length || isModal}
            onChange={onBranchChange}
            value={currentBranch}
            onInputChange={onBranchSearch}
            options={branchesItems.list.map(item => ({label: `${item.name}`, value: item.id}))}
            isClearable={true}
            isMulti={false}
            isSearchable={!currentBranch}
            isLoading={branchesItems.loading}
            loadingMessage={() => "Идет поиск"}
            noOptionsMessage={() => "Ничего не найдено!"}
            styles={selectStyles()}
            theme={selectTheme}
          />
        </div>
        <div className={`supplier-categories-filter-item ${showSelectedProducts ? "disabled-filter-item" : ""}`}>
          <div ref={categoriesMenuRef}>
            <div className="filter-category-search">
              <TextField
                fullWidth
                placeholder={categoryPlaceholder}
                onChange={(e) => setSearchCategoryKeyword(e.target.value)}
                value={searchCategoryKeyword}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <DropdownArrSvg />
                  )
                }}
              />
            </div>
            <div className={`supplier-categories-menu ${showMenu ? "opened-menu": ""}`}>
              <SupplierCategoriesTree
                data={categories.list}
                keyword={searchCategoryKeyword}
                isLoading={categories.loading}
                onItemClicked={onCategoryClick}
                selected={currentCategoryId}
                showProductCount
                itemClickable
              />
            </div>
          </div>
        </div>
        <div className={`supplier-categories-filter-item ${showSelectedProducts || !currentCategoryId ? "disabled-filter-item" : ""}`}>
          <div className="filter-search">
            <TextField
              fullWidth
              placeholder="Поиск по товарам"
              onChange={onProductSearch}
              value={searchProductKeyword}
              variant="outlined"
            />
          </div>
        </div>
        <div className="supplier-categories-filter-item button-field">
          {selectedProducts.length > 0 &&
            <FormControlLabel
              control={<Checkbox color="primary"/>}
              label={`Выбранные товары (${selectedProducts.length})`}
              checked={showSelectedProducts}
              onChange={onShowSelectedProducts}
            />
          }
          <Button variant="outlined" color="primary" disabled={!selectedProducts.length && !isModal} onClick={onAddOrderingProduct}>
            {isModal ? "Обновить заказ" : "Добавить к заказу"}
          </Button>
        </div>
      </div>
    </div>
  )
};