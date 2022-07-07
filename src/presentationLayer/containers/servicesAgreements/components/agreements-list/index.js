import React, { useState, useEffect, useMemo, useReducer } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import moment from "moment";

import {
  Button,
  FormControl,
  InputLabel,
  Popover,
  Select,
  IconButton,
  MenuItem,
  TextField,
} from "@material-ui/core";
import RefreshIcon from '@material-ui/icons/Refresh';
import CloseIcon from '@material-ui/icons/Close';
import withNotification from "../../../../hocs/withNotification/WithNotification";
import { MoreVert } from "@material-ui/icons";
import Table from "../../../../components/Table/index";
import QuestionDialog from "../../../../components/Dialog/question";
import { servicesAgreementsSelector } from "../../redux/reducer";
import {
  getBalance,
  getServiceAgreementsList,
  getServicesTariffs,
  updateServiceAgreementsListFilter,
} from "../../redux/actions";
import { systemsStatuses } from "../../../loyalty/redux/constants";
import { ServicePrice } from "../service-price";
import { getAgreementRecurring, getAgreementTariff } from "../../helper";
import SelectBox from "../../../../components/Select";
import SearchTextField from "../../../../components/Textfields/search";
import Status from "../agreement-card/components/Status";
import { checkNull } from "../../../../../utils/helpers";
import { checkNullScw } from "../agreement-card/components/agreement-report";

const initialState = {
  status: null,
  search: "",
  recurring: null,
  serviceType: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "STATUS":
      return { ...state, status: action.payload };
    case "SERVICE_TYPE":
      return { ...state, serviceType: action.payload };
    case "RECURRING":
      return { ...state, recurring: action.payload };
    case "SEARCH":
      return { ...state, search: action.payload };
    case "RESET":
      return { ...initialState };
    default:
      state.slice();
  }
};

export default withNotification((props) => {
  const { match, history } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const $agreementsList = useSelector(
    servicesAgreementsSelector("servicesAgreementsList")
  );
  const balance = useSelector(servicesAgreementsSelector("balance"));

  const servicesTariffs = useSelector(
    servicesAgreementsSelector("servicesTariffs")
  );
  console.log(servicesTariffs);

  const [popoverEl, setPopoverEl] = useState(null);
  const [confirmChangeStatus, setConfirmChangeStatus] = useState(null);
  const [search, setSearch] = useState("");
  const [service, setService] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [status, setStatus] = useState("");
  const [onFilter, setOnFilter] = useState(false);
  const [filterItems, dsp] = useReducer(reducer, initialState);
  const { loading: agreementsListLoading } = $agreementsList;

  const agreementsList = useMemo(
    () =>
      $agreementsList.data.filter(
        (item) =>
          (!filterItems.serviceType ||
            checkNull(item, "serviceType", "code") ===
              filterItems.serviceType) &&
          (!filterItems.status ||
            checkNull(item, "status", "code") === filterItems.status) &&
          (checkNull(filterItems, "recurring") === null ||
            String(checkNull(item, "xizmat", "recurring")) ===
              String(checkNull(filterItems, "recurring"))) &&
          checkNullScw(item, "", "agreementNumber")
            .toLowerCase()
            .includes(filterItems.search.toLowerCase())
      ),
    [$agreementsList.data, filterItems]
  );

  const servicesFilterData = useMemo(
    () =>
      ($agreementsList.data || []).reduce(
        (acc, item) => {
          if (!!acc && !acc.codes.includes(item && item.serviceType.code)) {
            return {
              items: [...acc.items, item],
              codes: [...acc.codes, item.serviceType.code],
            };
          }
          return { ...acc };
        },
        { items: [], codes: [] }
      ),
    [$agreementsList.data]
  );

  const statusFilterData = useMemo(
    () =>
      ($agreementsList.data || []).reduce(
        (acc, item) => {
          if (!!acc && !acc.codes.includes(checkNull(item, "status", "code"))) {
            return {
              items: [...acc.items, item],
              codes: [...acc.codes, checkNull(item, "status", "code")],
            };
          }
          return { ...acc };
        },
        { items: [], codes: [] }
      ),
    [$agreementsList.data]
  );

  useEffect(
    () => {
      const id = setTimeout(() => {
        setOnFilter((prev) => !prev);
      }, 500);
      return () => clearTimeout(id);
    },
    [filterItems]
  );

  const getList = () => {
    dispatch(getServiceAgreementsList({}));
  };

  useEffect(() => {
    getList();
    dispatch(getServicesTariffs());
  }, []);
  useEffect(
    () => {
      props.tin && dispatch(getBalance(props.tin));
    },
    [dispatch, props.tin]
  );

  const onFilterChange = (fields) => {
    dispatch(updateServiceAgreementsListFilter({ page: 0, ...fields }));
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

  const onPopoverMenuClick = (event, item) => {
    setPopoverEl({ anchorEl: event.currentTarget, item });
  };

  const renderPopoverContent = (item) => {
    return (
      <div className="custom__popover">
        {item.status &&
          item.status.code === systemsStatuses.INACTIVE && (
            <div>
              {/*<Button onClick={() => onChangeStatus(item.id, systemsStatuses.ACTIVE)}>{t("loyalty.activateSystem")}</Button>*/}
            </div>
          )}
        {(!item.status || item.status.code === systemsStatuses.ACTIVE) && (
          <div>
            {/*<Button color="secondary" onClick={() => setConfirmChangeStatus(item.id)}>{t("loyalty.deactivateSystem")}</Button>*/}
            <QuestionDialog
              open={!!confirmChangeStatus}
              title="Опасно!"
              message="Вы действительно хотите изменить статус?"
              onPositive={() => {
                //onChangeStatus(item.id, systemsStatuses.INACTIVE);
                onPopoverMenuClose();
                setConfirmChangeStatus(null);
              }}
              onNegative={() => setConfirmChangeStatus(null)}
              onClose={() => setConfirmChangeStatus(null)}
            />
          </div>
        )}
      </div>
    );
  };

  const data = agreementsList
    .filter((item) => {
      return (
        item.agreementNumber.toLowerCase().includes(search.toLowerCase()) &&
        (!service ||
          (item && item.serviceType && item.serviceType.nameRu) === service) &&
        (!serviceType || getAgreementRecurring(item) === serviceType) &&
        (!status || (item.status && item.status.nameRu) === status)
      );
    })
    .map((item) => {
      return {
        id: item.id,
        agreementNumber: (
          <Link to={`${match.url}/${item.id}`}>{item.agreementNumber}</Link>
        ),
        serviceType: item.serviceType && item.serviceType.nameRu,
        tariff: getAgreementTariff(item),
        recurring: getAgreementRecurring(item),
        price: <ServicePrice agreement={item} />,
        firstActivatedDate: item.firstActivatedDate
          ? moment(item.firstActivatedDate).format("DD.MM.YYYY")
          : "-",
        lastPeriodEnd: item.lastPeriodEnd
          ? moment(item.lastPeriodEnd).format("DD.MM.YYYY")
          : "-",
        status: item.status && (
          <Status status={convertStatus(item.status.code)}>
            {item.status.nameRu}
          </Status>
        ),
        actions: (
          <div>
            <IconButton onClick={(event) => onPopoverMenuClick(event, item)}>
              <MoreVert />
            </IconButton>
          </div>
        ),
      };
    });

  const headers = [
    {
      key: "agreementNumber",
      content: t("servicesAgreements.listColumns.agreementNumber"),
    },
    {
      key: "serviceType",
      content: t("servicesAgreements.listColumns.serviceType"),
    },
    {
      key: "tariff",
      content: t("servicesAgreements.listColumns.tariff"),
    },
    {
      key: "recurring",
      content: t("servicesAgreements.listColumns.recurring"),
    },
    {
      key: "price",
      content: t("servicesAgreements.listColumns.price"),
    },
    {
      key: "firstActivatedDate",
      content: t("servicesAgreements.listColumns.firstActivatedDate"),
    },
    {
      key: "lastPeriodEnd",
      content: t("servicesAgreements.listColumns.lastPeriodEnd"),
    },
    {
      key: "status",
      content: t("servicesAgreements.listColumns.status"),
    },
    // {
    //   key: "actions",
    //   content: "",
    // }
  ];

  return (
    <div className="custom-content loyalty-cards">
      <div className="custom-content__header">
        <div className="custom-content__header__left-inner">
          <h1>
            {t("servicesAgreements.listHead")} (
            {t("servicesAgreements.listTotal")}:
            <strong>{agreementsList.length}</strong>)
          </h1>
        </div>
        <div className="custom-content__total">
          <div className="custom-content__total__right">
            {balance ? (
              <span style={{ margin: "0 30px" }}>
                Баланс:{" "}
                <NavLink to="/main/payment">
                  <b style={{ fontWeight: 600 }}>
                    {balance.toLocaleString("ru")}
                  </b>{" "}
                </NavLink>
                сум
              </span>
            ) : null}
            <Button
              variant="contained"
              color="primary"
              onClick={() => history.push(`${match.url}/add`)}
            >
              {t("servicesAgreements.addAgreement.btn")}
            </Button>
          </div>
        </div>
      </div>
      {/*<div className="filter-block">*/}
      {/*  <div className="filter-block__item">*/}
      {/*    <SelectBox*/}
      {/*      withReset={true}*/}
      {/*      itemKey="code"*/}
      {/*      itemValue="name"*/}
      {/*      label={t("loyalty.systemsFilterStatus")}*/}
      {/*      value={$agreementsListFilter.status}*/}
      {/*      data={$loyaltySystemStatuses.data.map(item => ({ code: item.code, name: item.name }))}*/}
      {/*      onChange={(e) => onFilterChange({ status: e.target.value })}*/}
      {/*    />*/}
      {/*  </div>*/}
      {/*</div>*/}

      <div className="custom-content__filter_selects_container">
        <div className="filter_selects_item">
          <FormControl variant="outlined" fullWidth>
            <InputLabel id="demo-simple-select-filled-label">
              Выберите услугу
            </InputLabel>
            <Select
              labelId="demo-simple-select-filled-label"
              id="demo-simple-select-filled"
              //value={age}
              label="Услуга"
              value={filterItems.serviceType}
              onChange={(serviceType) => {
                dsp({
                  type: "SERVICE_TYPE",
                  payload: serviceType.target.value,
                });
              }}
            >
              {(servicesFilterData.items || []).map((item) => (
                <MenuItem value={item && item.serviceType.code} key={item.id}>
                  {item && item.serviceType.nameRu}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="filter_selects_item">
          <FormControl variant="outlined" fullWidth>
            <InputLabel id="demo-simple-select-filled-label">
              Выберите тип услуги
            </InputLabel>
            <Select
              labelId="demo-simple-select-filled-label"
              id="demo-simple-select-filled"
              //value={age}
              label="Тип"
              value={filterItems.recurring }
              onChange={(e) =>
                dsp({ type: "RECURRING", payload: e.target.value })
              }
            >
              {[
                { val: true, name: "Повторяющийся" },
                { val: false, name: "Разовый" },
              ].map((item) => (
                <MenuItem value={item.val} key={item.name}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="filter_selects_item">
          <FormControl variant="outlined" fullWidth>
            <InputLabel id="demo-simple-select-filled-label">
              Выберите статус
            </InputLabel>
            <Select
              labelId="demo-simple-select-filled-label"
              id="demo-simple-select-filled"
              //value={age}
              label="Статус"
              value={filterItems.status }
              onChange={(e) => dsp({ type: "STATUS", payload: e.target.value })}
            >
              {(statusFilterData.items || []).map((item) => (
                <MenuItem value={item && item.status.code} key={item.id}>
                  {item && item.status.nameRu}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="filter_selects_item">
          <TextField
            id="outlined-basic"
            label={t("productList.search_by_product")}
            variant="outlined"
            value={filterItems.search }
            onChange={(e) => {
              console.log(e.target.value);
              dsp({ type: "SEARCH", payload: e.target.value });
            }}
          />
        </div>
        <div className="filter-block__item filter-block__buttons">
      <IconButton aria-label="delete" color="primary" onClick={()=>dsp({type: 'RESET'})}>
        <CloseIcon />
      </IconButton>
      <IconButton aria-label="delete" color="primary" onClick={getList} >
        <RefreshIcon />
      </IconButton>
          </div>
      </div>
      <div className="custom-content__table u-fancy-scrollbar">
        <Table
          order={true}
          openPathWithId={false}
          headers={headers}
          data={data}
          isLoading={agreementsListLoading}
          align="left"
        />
        <Popover
          open={Boolean(popoverEl)}
          anchorEl={popoverEl ? popoverEl.anchorEl : null}
          onClose={onPopoverMenuClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        >
          {popoverEl ? renderPopoverContent(popoverEl.item) : null}
        </Popover>
      </div>
    </div>
  );
});

const convertStatus = (status) => {
  switch (status) {
    case "ACTIVE":
      return "SUCCESS";
    case "INACTIVE":
      return "ERROR";
    default:
      return status;
  }
};
