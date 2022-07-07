import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from "react-router-dom";
import { useTranslation } from "react-i18next";
import moment from "moment";

import Pagination from '../../../../components/Pagination/Pagination';
import { Button, Checkbox, IconButton, Popover } from '@material-ui/core';
import Table from '../../../../components/Table/index';
import {
  getLoyaltyClients,
  getLoyaltyCardsStats,
  updateLoyaltyCardsListFilter,
  getLoyaltySystem,
  resetDeleteLoyaltyCard, deleteLoyaltyCard, updateLoyaltyClientsFilter
} from "../../redux/actions";
import { AddLoyaltyClientModal } from "../addLoyaltyClientModal";
import { CumulativeCardSvg, DiscountCardSvg, CreditCardSvg } from "../../../../../assets/icons";
import { StatItem } from "../../../../components/material-components/components/StatItem";
import { cardTypesCodes } from "../../redux/constants";
import withNotification from "../../../../hocs/withNotification/WithNotification";
import { MoreVert } from "@material-ui/icons";
import QuestionDialog from "../../../../components/Dialog/question";
import "./styles.scss";
import SearchTextField from "../../../../components/Textfields/search";
import Confirm from "../../../../components/Confirm";


const statsIcons = {
  [cardTypesCodes.CUMULATIVE]: <CumulativeCardSvg />,
  [cardTypesCodes.DISCOUNT]: <DiscountCardSvg />,
  [cardTypesCodes.CREDIT]: <CreditCardSvg />,
};

export default withNotification((props) => {
  const { match } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const $loyaltyClients = useSelector(state => state.get("loyalty").loyaltyClients);
  const $loyaltyClientsFilter = useSelector(state => state.get("loyalty").loyaltyClientsFilter);
  const $loyaltyClientsStats = useSelector(state => state.get("loyalty").loyaltyClientsStats);
  const $deleteLoyaltyCard = useSelector(state => state.get("loyalty").deleteLoyaltyCard);

  const [addModalProps, setAddModalProps] = useState({
    visible: false,
    shouldRender: false,
  });
  const [popoverEl, setPopoverEl] = useState(null);

  const { data: loyaltyClientsData, loading: loyaltyClientsLoading, params: loyaltyClientsParams } = $loyaltyClients;

  const getList = () => {
    dispatch(getLoyaltyClients($loyaltyClientsFilter));
    // dispatch(getLoyaltyCardsStats($loyaltyClientsFilter));
  };

  useEffect(() => {
    getList();
  }, [$loyaltyClientsFilter]);

  // useEffect(() => {
  //   if ($deleteLoyaltyCard.success) {
  //     props.success("Карта лояльности удалена");
  //     dispatch(resetDeleteLoyaltyCard());
  //     getList();
  //   }
  // }, [$deleteLoyaltyCard.success]);


  const onFilterChange = (fields) => {
    dispatch(updateLoyaltyClientsFilter({ page: 0, ...fields }));
  };

  const onSearchChange = (search) => {
    onFilterChange({
      search,
    });
  };

  const onChangePagination = (page) => {
    onFilterChange({ page });
  };

  const onChangeSize = (size) => {
    onFilterChange({ size });
  };

  const onAddClick = () => {
    setAddModalProps({ visible: true, shouldRender: true });
  };

  const onDeleteClick = (id) => {
    // dispatch(deleteLoyaltyCard(id));
  };

  const onPopoverMenuClick = (event, id) => {
    setPopoverEl({ anchorEl: event.currentTarget, id });
  };

  const onPopoverMenuClose = () => {
    setPopoverEl(null);
  };

  const renderPopoverContent = (itemId) => {
    return (<div className="custom__popover">
      <Confirm
        title="Вы действительно хотите удалить?"
        onPositive={() => {
          onDeleteClick(itemId);
          onPopoverMenuClose();
        }}
      >
        <Button color="secondary">Удалить</Button>
      </Confirm>
    </div>);
  };

  const data = loyaltyClientsData.content.map((item) => ({
    id: item.id,
    phoneNumber: item.phoneNumber,
    userName: item.userName,
    cumulative: item.cumulativePercent ? <div className="green">{item.cumulativePercent}%</div>: t("common.absent"),
    discount: item.discountPercent ? <div className="green">{item.discountPercent}%</div>: t("common.absent"),
    credit: item.creditPercent ? <div className="green">{item.creditPercent}%</div>: t("common.absent"),
    actions: (
      <div>
        <IconButton onClick={(event) => onPopoverMenuClick(event, item.id)}>
          <MoreVert />
        </IconButton>
      </div>
    )
  }));

  const headers = [
    {
      content: t("loyalty.clientsPhone"),
      key: 'phoneNumber',
    },
    {
      content: t("loyalty.clientsName"),
      key: 'userName',
    },
    {
      content: t("loyalty.clientsCumulative"),
      key: 'cumulative',
    },
    {
      content: t("loyalty.clientsDiscount"),
      key: 'discount',
    },
    {
      content: t("loyalty.clientsCredit"),
      key: 'credit',
    },
    {
      content: "",
      key: "actions"
    }
  ];


  return (
    <div className="custom-content loyalty-clients">
      <div className="custom-content__header">
        <div className="custom-content__header__left-inner">
          <h1>{t("loyalty.clients")}</h1>
        </div>
      </div>
      {/*{!!$loyaltyClientsStats.data.length && <div className="custom-content__stats">*/}
      {/*  {$loyaltyClientsStats.data.map((item) => (*/}
      {/*    <StatItem*/}
      {/*      name={item.cardType.nameRu}*/}
      {/*      value={item.cardCount.toLocaleString('ru')}*/}
      {/*      icon={statsIcons[item.cardType.code]}*/}
      {/*      onClick={() => onFilterChange({ cardType: item.cardType.code })}*/}
      {/*      active={$loyaltyClientsFilter.cardType === item.cardType.code}*/}
      {/*    />*/}
      {/*  ))}*/}
      {/*</div>}*/}

      <div className="filter-block">
        <div className="filter-block__item">
          <SearchTextField
            onSearch={onSearchChange}
            onChange={onSearchChange}
            value={$loyaltyClientsFilter.search}
          />
        </div>
      </div>

      <div className="custom-content__total">
        <div className="custom-content__total__left">
          {t("loyalty.clientsTotal")} <strong>{loyaltyClientsData.totalElements}</strong>
        </div>
        <div className="custom-content__total__right">
          <Button variant="contained" color="primary" onClick={onAddClick}>
            {t("loyalty.addClient")}
          </Button>
        </div>
      </div>
      <div className="custom-content__table u-fancy-scrollbar">
        <Table
          order={true}
          page={loyaltyClientsData.number}
          size={loyaltyClientsData.size}
          openPathWithId={false}
          headers={headers}
          data={data}
          isLoading={loyaltyClientsLoading}
        />
        <Popover
          open={Boolean(popoverEl)}
          anchorEl={popoverEl ? popoverEl.anchorEl: null}
          onClose={onPopoverMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          {popoverEl ? renderPopoverContent(popoverEl.id): null}
        </Popover>
      </div>
      <div className="custom-content__pagination">
        <Pagination
          onPageChange={onChangePagination}
          onSizeChange={onChangeSize}
          disabled={loyaltyClientsLoading}
          size={loyaltyClientsData.size}
          pagesCount={loyaltyClientsData.totalPages}
          current={loyaltyClientsData.number}
        />
      </div>
      {addModalProps.shouldRender && <AddLoyaltyClientModal
        modalProps={addModalProps}
        setModalProps={setAddModalProps}
        callBack={getList}
      />}
    </div>
  )
});
