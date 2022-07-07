import React, { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from "react-router-dom";

import * as actions from "../actions";
import * as SupplierDetailActions from "../../supplier-detail/actions";

import { CircularProgress, Accordion, AccordionSummary, AccordionDetails, Typography } from "@material-ui/core";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import Pagination from "../../../../components/Pagination/Pagination";
import { formatPriceProduct } from "../../../../../utils/format";

import { SupplierCatalogOffersFilter } from "./supplier-catalog-offers-filter";
import { SupplierCatalogOfferDetails } from "./supplier-catalog-offer-details";
import {getBaseUnitParams} from "../../../../../utils/getBaseUnitParams";

export const SupplierCatalogOffersView = (props) => {
  const orderingStore = useSelector(state => state.get("ordering"));
  const supplierCatalogProductsStore = useSelector(state => state.get("supplierCatalog"));
  const dispatch = useDispatch();

  const { ordering: orderingData } = orderingStore;
  const { offersList, offersListFilterProps } = supplierCatalogProductsStore;

  const { data: offersData, loading, error } = offersList;
  const {
    content: offers,
    totalPages: offersTotalPages,
    size: offersPageSize,
    number: offersPageNumber
  } = offersData;

  useEffect(() => {
    dispatch(
      actions.getOffersListAction(offersListFilterProps)
    )
  }, [offersListFilterProps]);

  const onGotoSupplier = (offer) => {
    dispatch(
      SupplierDetailActions.setCategoriesBranchAction({
        label: offer.branch.name,
        value: offer.branch.id
      })
    );

    props.history.push(`/main/catalog/supplier/${offer.id}`);
  };

  const offersRender = offers.map((offer) => {
    return (
      <div className="supplier-catalog__offers__item" key={offer.product.id + offer.branch.id}>
        <div className="supplier-catalog__offers__item-supplier">
          <span onClick={() => onGotoSupplier(offer)}>{offer.businessType.nameRu} "{offer.name}"</span>
        </div>
        <div className="supplier-catalog__offers__item-name">
          {offer.branch.name}
        </div>
        <div className="supplier-catalog__offers__item-name">
          {offer.product.name}
        </div>
        <div className="supplier-catalog__offers__item-price">
          {formatPriceProduct(offer.product.salesPrice)} сум/{getBaseUnitParams(offer.product.units).unit.name}
        </div>
        <Accordion className="accordion-simple">
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>
              <span className="accordion-simple__more">Подробнее</span>
              <span className="accordion-simple__hide">Скрыть</span>
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <SupplierCatalogOfferDetails
              supplierDetails={offer}
              dispatch={dispatch}
              history={props.history}
              orderingData={orderingData}
            />
          </AccordionDetails>
        </Accordion>
      </div>
    )
  });

  const onFilterPropsChange = (fields) => {
    dispatch(
      actions.updateOffersListFilterPropsAction({ page: 0, ...fields })
    );
  };

  const onPageChange = (page) => {
    onFilterPropsChange({ page });
  };

  const onChangeSize = (size) => {
    onFilterPropsChange({ size });
  };

  return (
    <>
      <div className="custom-content-list__content">
        <div className="supplier-catalog__offers">
          <SupplierCatalogOffersFilter onFilterPropsChange={onFilterPropsChange} />
          <div className="supplier-catalog__offers__title">Предложения:</div>
          <div className="supplier-catalog__offers__list">
            {loading && <div className="abs-loader">
              <CircularProgress color='primary'/>
            </div>}
            {offersRender.length === 0 && <div className="empty-icon-block">Список пуст !</div>}
            {offersRender}
            {(offersRender.length > 0 && offersRender.length % 2 === 0) &&
              <div className="supplier-catalog__offers__item-empty"></div>
            }
          </div>
        </div>
      </div>
      <div className="custom-content__pagination">
        <Pagination
          onPageChange={onPageChange}
          onSizeChange={onChangeSize}
          disabled={loading}
          size={offersPageSize}
          pagesCount={offersTotalPages}
          current={offersPageNumber}
        />
      </div>
    </>
  )
};

export const SupplierCatalogOffers = withRouter(SupplierCatalogOffersView);