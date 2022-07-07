import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import moment from "moment";

import Pagination from '../../../../components/Pagination/Pagination';
import { Button, Grid, IconButton, Popover } from '@material-ui/core';
import Table from '../../../../components/Table/index';
import {
  getLoyaltySystemsList,
  updateLoyaltySystemsListFilter,
  getLoyaltySystemStatuses,
  changeLoyaltySystemStatus,
  resetChangeLoyaltySystemStatus,
} from "../../redux/actions";
import { CumulativeCardSvg, DiscountCardSvg, CreditCardSvg } from "../../../../../assets/icons";
import { cardTypesCodes, systemsStatuses } from "../../redux/constants";
import withNotification from "../../../../hocs/withNotification/WithNotification";
import { MoreVert } from "@material-ui/icons";
import QuestionDialog from "../../../../components/Dialog/question";
import SearchTextField from "../../../../components/Textfields/search";
import SelectBox from "../../../../components/SelectBox";

const statsIcons = {
  [cardTypesCodes.CUMULATIVE]: <CumulativeCardSvg />,
  [cardTypesCodes.DISCOUNT]: <DiscountCardSvg />,
  [cardTypesCodes.CREDIT]: <CreditCardSvg />,
};

export default withNotification((props) => {
  const { match, history } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const $loyaltySystems = useSelector(state => state.get("loyalty").loyaltySystems);
  const $loyaltySystemsFilter = useSelector(state => state.get("loyalty").loyaltySystemsFilter);
  const $loyaltySystemStatuses = useSelector(state => state.get("loyalty").loyaltySystemStatuses);
  const $changeLoyaltySystemStatus = useSelector(state => state.get("loyalty").changeLoyaltySystemStatus);
  // const $loyaltySystemsStats = useSelector(state => state.get("loyalty").loyaltySystemsStats);

  const [popoverEl, setPopoverEl] = useState(null);
  const [confirmChangeStatus, setConfirmChangeStatus] = useState(null);

  const { data: loyaltySystemsData, loading: loyaltySystemsLoading, params: loyaltySystemsParams } = $loyaltySystems;

  const getList = () => {
    dispatch(getLoyaltySystemsList($loyaltySystemsFilter));
    // dispatch(getLoyaltySystemsStats($loyaltySystemsFilter));
  };

  useEffect(() => {
    if (!$loyaltySystemStatuses.data.length) {
      dispatch(getLoyaltySystemStatuses());
    }
  }, []);

  useEffect(() => {
    getList();
  }, [$loyaltySystemsFilter]);

  useEffect(() => {
    if ($changeLoyaltySystemStatus.success) {
      getList();
      props.success(t("loyalty.changeSystemStatusSuccess"));

      dispatch(resetChangeLoyaltySystemStatus());
    }
  }, [$changeLoyaltySystemStatus.success]);

  const onFilterChange = (fields) => {
    dispatch(updateLoyaltySystemsListFilter({ page: 0, ...fields }));
  };

  const onChangePagination = (page) => {
    onFilterChange({ page });
  };


  const onChangeSize = (size) => {
    onFilterChange({ size });
  };

  const onPopoverMenuClose = () => {
    setPopoverEl(null);
  };

  const onChangeStatus = (id, status) => {
    dispatch(changeLoyaltySystemStatus({ id, name: status }));
    onPopoverMenuClose();
  };

  const onPopoverMenuClick = (event, item) => {
    setPopoverEl({ anchorEl: event.currentTarget, item });
  };

  const renderPopoverContent = (item) => {
    return (<div className="custom__popover">
      {item.status && item.status.code === systemsStatuses.INACTIVE && (<div>
        <Button onClick={() => onChangeStatus(item.id, systemsStatuses.ACTIVE)}>{t("loyalty.activateSystem")}</Button>
      </div>)}
      {(!item.status || item.status.code === systemsStatuses.ACTIVE) && (<div>
        <Button color="secondary" onClick={() => setConfirmChangeStatus(item.id)}>{t("loyalty.deactivateSystem")}</Button>
        <QuestionDialog
          open={!!confirmChangeStatus}
          title='Опасно!'
          message='Вы действительно хотите изменить статус?'
          onPositive={() => {
            onChangeStatus(item.id, systemsStatuses.INACTIVE);
            onPopoverMenuClose();
            setConfirmChangeStatus(null);
          }}
          onNegative={() => setConfirmChangeStatus(null)}
          onClose={() => setConfirmChangeStatus(null)}
        />
      </div>)}
    </div>);
  };

  const data = loyaltySystemsData.content.map((item) => ({
    id: item.id,
    name: <Link to={`${match.url}/${item.id}`}>{item.name}</Link>,
    cardType: item.cardType.nameRu,
    status: item.status ? item.status.name: "",
    createdDate: moment(item.createdDate).format("DD.MM.YYYY HH:mm:ss"),
    createdBy: item.creator,
    actions: (
      <div>
        <IconButton onClick={(event) => onPopoverMenuClick(event, item)}>
          <MoreVert />
        </IconButton>
      </div>
    )
  }));

  const headers = [
    {
      content: t("loyalty.systemName"),
      key: 'name',
    },
    {
      content: t("loyalty.systemType"),
      key: 'cardType',
    },
    {
      content: t("loyalty.systemStatus"),
      key: 'status',
    },
    {
      content: t("loyalty.systemCreatedDate"),
      key: 'createdDate',
    },
    {
      content: t("loyalty.systemCreator"),
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
          <h1>{t("loyalty.loyaltySystems")}</h1>
        </div>
      </div>
      {/*{!!$loyaltySystemsStats.data.length && <div className="custom-content__stats">*/}
      {/*  {$loyaltySystemsStats.data.map((item) => (*/}
      {/*    <StatItem*/}
      {/*      name={item.cardType.nameRu}*/}
      {/*      value={item.cardCount.toLocaleString('ru')}*/}
      {/*      icon={statsIcons[item.cardType.code]}*/}
      {/*      onClick={() => onFilterChange({ cardType: item.cardType.code })}*/}
      {/*      active={$loyaltySystemsFilter.cardType === item.cardType.code}*/}
      {/*    />*/}
      {/*  ))}*/}
      {/*</div>}*/}

      
      <div className="filter-block">
        <div className="filter-block__item">
          <SelectBox
            withReset={true}
            itemKey="code"
            itemValue="name"
            label={t("loyalty.systemsFilterStatus")}
            value={$loyaltySystemsFilter.status}
            data={$loyaltySystemStatuses.data.map(item => ({ code: item.code, name: item.name }))}
            onChange={(e) => onFilterChange({ status: e.target.value })}
          />
        </div>
      </div>

      <div className="custom-content__total">
        <div className="custom-content__total__left">
          {t("loyalty.systemsTotal")} <strong>{loyaltySystemsData.totalElements}</strong>
        </div>
        <div className="custom-content__total__right">
          <Button
            variant="contained"
            color="primary"
            onClick={() => history.push(`${match.url}/add`)}
          >
            {t("loyalty.createSystem")}
          </Button>
        </div>
      </div>
      <div className="custom-content__table u-fancy-scrollbar">
        <Table
          order={true}
          page={loyaltySystemsData.number}
          size={loyaltySystemsData.size}
          openPathWithId={false}
          headers={headers}
          data={data}
          isLoading={loyaltySystemsLoading}
        />
        <Popover
          open={Boolean(popoverEl)}
          anchorEl={popoverEl ? popoverEl.anchorEl : null}
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
          {popoverEl ? renderPopoverContent(popoverEl.item) : null}
        </Popover>
      </div>
      <div className="custom-content__pagination">
        <Pagination
          onPageChange={onChangePagination}
          onSizeChange={onChangeSize}
          disabled={loyaltySystemsLoading}
          size={loyaltySystemsData.size}
          pagesCount={loyaltySystemsData.totalPages}
          current={loyaltySystemsData.number}
        />
      </div>
    </div>
  )
});
