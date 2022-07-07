import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";
import moment from "moment";

import Pagination from '../../../../components/Pagination/Pagination';
import { Button, IconButton, Popover } from '@material-ui/core';
import Table from '../../../../components/Table/index';
import {
  getLoyaltyCardsList,
  getLoyaltyCardsStats,
  updateLoyaltyCardsListFilter,
  resetDeleteLoyaltyCard, deleteLoyaltyCard
} from "../../redux/actions";
import { AddLoyaltyCardModal } from "../addLoyaltyCardModal";
import { CumulativeCardSvg, DiscountCardSvg, CreditCardSvg } from "../../../../../assets/icons";
import { StatItem } from "../../../../components/material-components/components/StatItem";
import { cardTypesCodes } from "../../redux/constants";
import withNotification from "../../../../hocs/withNotification/WithNotification";
import { MoreVert } from "@material-ui/icons";
import QuestionDialog from "../../../../components/Dialog/question";
import "./styles.scss";


const statsIcons = {
  [cardTypesCodes.CUMULATIVE]: <CumulativeCardSvg />,
  [cardTypesCodes.DISCOUNT]: <DiscountCardSvg />,
  [cardTypesCodes.CREDIT]: <CreditCardSvg />,
};

export default withNotification((props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const $loyaltyCards = useSelector(state => state.get("loyalty").loyaltyCards);
  const $loyaltyCardsFilter = useSelector(state => state.get("loyalty").loyaltyCardsFilter);
  const $loyaltyCardsStats = useSelector(state => state.get("loyalty").loyaltyCardsStats);
  const $deleteLoyaltyCard = useSelector(state => state.get("loyalty").deleteLoyaltyCard);

  const [addModalProps, setAddModalProps] = useState({
    visible: false,
    shouldRender: false,
    cardId: null,
  });
  const [popoverEl, setPopoverEl] = React.useState(null);
  const [confirmDelete, setConfirmDelete] = React.useState(null);

  const { data: loyaltyCardsData, loading: loyaltyCardsLoading } = $loyaltyCards;

  const getList = () => {
    dispatch(getLoyaltyCardsList($loyaltyCardsFilter));
    dispatch(getLoyaltyCardsStats($loyaltyCardsFilter));
  };

  useEffect(() => {
    getList();
  }, [$loyaltyCardsFilter]);

  useEffect(() => {
    if ($deleteLoyaltyCard.success) {
      props.success("Карта лояльности удалена");
      dispatch(resetDeleteLoyaltyCard());
      getList();
    }
  }, [$deleteLoyaltyCard.success]);


  const onFilterChange = (fields) => {
    dispatch(updateLoyaltyCardsListFilter({ page: 0, ...fields }));
  };

  const onCardTypeClick = (type) => {
    const cardType = $loyaltyCardsFilter.cardType === type ? undefined: type;
    onFilterChange({ cardType });
  };

  const onChangePagination = (page) => {
    onFilterChange({ page });
  };

  const onChangeSize = (size) => {
    onFilterChange({ size });
  };

  const onPopoverMenuClick = (event, id) => {
    setPopoverEl({ anchorEl: event.currentTarget, id });
  };

  const onPopoverMenuClose = () => {
    setPopoverEl(null);
  };

  const onAddClick = () => {
    setAddModalProps({ visible: true, shouldRender: true });
  };

  const onEditClick = (cardId) => {
    onPopoverMenuClose();
    setAddModalProps({ visible: true, shouldRender: true, cardId });
  };

  const onDeleteClick = (cardId) => {
    dispatch(deleteLoyaltyCard(cardId));
  };

  const renderPopoverContent = (itemId) => {
    return (<div className="custom__popover">
      <div>
        <Button onClick={() => onEditClick(itemId)}>{t("loyalty.updateCard")}</Button>
      </div>
      <div>
        <Button color="secondary" onClick={() => setConfirmDelete(itemId)}>{t("loyalty.deleteCard")}</Button>
        <QuestionDialog
          open={!!confirmDelete}
          title='Опасно!'
          message='Вы действительно хотите удалить?'
          onPositive={() => {
            onDeleteClick(itemId);
            onPopoverMenuClose();
            setConfirmDelete(null);
          }}
          onNegative={() => setConfirmDelete(null)}
          onClose={() => setConfirmDelete(null)}
        />
      </div>
    </div>);
  };

  const data = loyaltyCardsData.content.map((item) => ({
    id: item.id,
    name: item.name,
    cardType: item.cardType.nameRu,
    percent: item.percent,
    clientsAmount: item.clientsAmount,
    createdDate: moment(item.createdDate).format("DD.MM.YYYY HH:mm:ss"),
    createdBy: item.creator,
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
      content: t("loyalty.cardName"),
      key: 'name',
    },
    {
      content: t("loyalty.cardType"),
      key: 'cardType',
    },
    {
      content: t("loyalty.cardPercent"),
      key: 'percent',
    },
    {
      content: t("loyalty.cardClientsAmount"),
      key: 'clientsAmount',
    },
    {
      content: t("loyalty.cardCreatedDate"),
      key: 'createdDate',
    },
    {
      content: t("loyalty.cardCreatedBy"),
      key: 'createdBy',
    },
    {
      content: "",
      key: "actions"
    }
  ];

  return (
    <div className="custom-content loyalty-cards">
      <div className="custom-content__header">
        <div className="custom-content__header__left-inner">
          <h1>{t("loyalty.loyaltyCards")}</h1>
        </div>
      </div>
      {!!$loyaltyCardsStats.data.length && <div className="custom-content__stats">
        {$loyaltyCardsStats.data.map((item) => (
          <StatItem
            name={item.cardType.nameRu}
            value={item.cardCount.toLocaleString('ru')}
            icon={statsIcons[item.cardType.code]}
            onClick={() => onCardTypeClick(item.cardType.code)}
            active={$loyaltyCardsFilter.cardType === item.cardType.code}
          />
        ))}
      </div>}

      <div className="custom-content__total">
        <div className="custom-content__total__left">
          {t("loyalty.cardsTotal")} <strong>{loyaltyCardsData.totalElements}</strong>
        </div>
        <div className="custom-content__total__right">
          <Button variant="contained" color="primary" onClick={onAddClick}>
            {t("loyalty.addCard")}
          </Button>
        </div>
      </div>
      <div className="custom-content__table u-fancy-scrollbar">
        <Table
          order={true}
          page={loyaltyCardsData.number}
          size={loyaltyCardsData.size}
          openPathWithId={false}
          headers={headers}
          data={data}
          isLoading={loyaltyCardsLoading}
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
          disabled={loyaltyCardsLoading}
          size={loyaltyCardsData.size}
          pagesCount={loyaltyCardsData.totalPages}
          current={loyaltyCardsData.number}
        />
      </div>
      {addModalProps.shouldRender && <AddLoyaltyCardModal
        modalProps={addModalProps}
        setModalProps={setAddModalProps}
        callBack={getList}
      />}
    </div>
  )
});
