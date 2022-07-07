import React, { useEffect, useState } from "react";
import { useStore } from "effector-react";
import { Link, Switch, Route, NavLink } from "react-router-dom";
import { CircularProgress, IconButton } from "@material-ui/core";
import { ArrowBackIos } from "@material-ui/icons";
import { AgreementDetails } from "./components/agreement-details";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { servicesAgreementsSelector } from "../../redux/reducer";
import {
  getServiceAgreementDetails,
  resetServiceAgreementDetails,
} from "../../redux/actions";
import Menu from "@material-ui/core/MenuList";
import MenuItem from "@material-ui/core/MenuItem";
import "./styles.scss";
import { AgreementQuote } from "./components/agreement-quote";
import { PublicOffer } from "./components/public-offer/index";
import { AgreementInvoices } from "./components/agreement-invoices";
import Report from "./components/agreement-report";
import { checkNull } from "../../../../../utils/helpers";
import { DATA_ENTRY } from "./../../redux/constants";

export const AgreementCard = (props) => {
  const { match, history, tin, backUrl } = props;
  const agreementId = match.params.agreementId;

  const { t } = useTranslation();
  const dispatch = useDispatch();

  const $agreementDetails = useSelector(
    servicesAgreementsSelector("serviceAgreementDetails")
  );
  const {
    data: agreementDetails,
    loading: agreementDetailsLoading,
    error: agreementDetailsError,
  } = $agreementDetails;

  const openedTabFromUrl = match.url;
  const [openedTab, setOpenedTab] = useState(openedTabFromUrl || "/");

  const getAgreementDetails = () => {
    dispatch(getServiceAgreementDetails(agreementId));
  };

  useEffect(
    () => {
      getAgreementDetails();

      return () => {
        dispatch(resetServiceAgreementDetails());
      };
    },
    [agreementId]
  );
  useEffect(
    () => {
      setOpenedTab(window.location.pathname.split(agreementId)[1] || "/");
    },
    [window.location.href]
  );

  return (
    <div className="agreement-card">
      {agreementDetails && (
        <>
          <div className="custom-content__header">
            <div className="custom-content__header__left">
              <IconButton
                color="primary"
                onClick={() => {
                  props.history.push(backUrl);
                }}
              >
                <ArrowBackIos />
              </IconButton>
              <div className="custom-content__header__left-inner">
                <h1>
                  {t("servicesAgreements.agreementCard.head")}:{" "}
                  {agreementDetails.agreementNumber}
                </h1>
              </div>
              {/*<Status color={getStatusColor(agreementDetails.status.code)} size="large">*/}
              {/*  {agreementDetails.status.nameRu}*/}
              {/*</Status>*/}
            </div>
          </div>

          <div className="agreement-card__body">
            <div className="agreement-card__side">
              <Menu
                className="agreement-card__navigation"
                selectedKeys={[openedTab]}
                mode="vertical"
                triggerSubMenuAction="click"
              >
                <Link to={match.url}>
                  <div className="agreement-card__navigation__item">
                    <MenuItem key="/" selected={openedTab === "/"}>
                      <span>Детали</span>
                    </MenuItem>
                  </div>
                </Link>
                <Link to={`${match.url}/public-offer`}>
                  <div className="agreement-card__navigation__item">
                    <MenuItem
                      key="/public-offer"
                      selected={openedTab === "/public-offer"}
                    >
                      Публичная оферта
                    </MenuItem>
                  </div>
                </Link>
                <Link to={`${match.url}/quote`}>
                  <div className="agreement-card__navigation__item">
                    <MenuItem key="/quote" selected={openedTab === "/quote"}>
                      Счет на оплату
                    </MenuItem>
                  </div>
                </Link>
                <Link to={`${match.url}/invoices`}>
                  <div className="agreement-card__navigation__item">
                    <MenuItem
                      key="/invoices"
                      selected={openedTab === "/invoices"}
                    >
                      Счет фактуры
                    </MenuItem>
                  </div>
                </Link>
                {checkNull(agreementDetails, "serviceType", "code") ===
                  DATA_ENTRY && (
                  <Link to={`${match.url}/report`}>
                    <div className="agreement-card__navigation__item">
                      <MenuItem
                        key="/report"
                        selected={openedTab === "/report"}
                      >
                        Отчет
                      </MenuItem>
                    </div>
                  </Link>
                )}
              </Menu>
            </div>
            <div className="agreement-card__content">
              <Switch>
                <Route
                  exact
                  path={match.url}
                  render={(props) => (
                    <AgreementDetails
                      {...props}
                      data={agreementDetails}
                      loading={agreementDetailsLoading}
                      getAgreementDetails={getAgreementDetails}
                    />
                  )}
                />
                <Route
                  exact
                  path={`${match.url}/public-offer`}
                  render={(props) => <PublicOffer {...props} tin={tin} />}
                />
                <Route
                  exact
                  path={`${match.url}/report`}
                  render={(props) => (
                    <Report
                      {...props}
                      agreementId={agreementDetails.id}
                      agreementDetails={agreementDetails}
                    />
                  )}
                />
                <Route
                  exact
                  path={`${match.url}/quote`}
                  render={(props) => (
                    <AgreementQuote
                      {...props}
                      getAgreementDetails={getAgreementDetails}
                      quoteId={agreementDetails.quoteId}
                    />
                  )}
                />
                <Route
                  exact
                  path={`${match.url}/invoices`}
                  render={(props) => (
                    <AgreementInvoices
                      {...props}
                      quoteId={agreementDetails.quoteId}
                    />
                  )}
                />
              </Switch>
            </div>
          </div>
        </>
      )}
      {/*{agreementDetailsError && <div className="custom-content__error">*/}
      {/*  <Alert message={agreementDetailsError.message} type="error" />*/}
      {/*</div>}*/}
      {agreementDetailsLoading && (
        <div className="agreement-card__loader">
          <CircularProgress color="primary" />
        </div>
      )}
    </div>
  );
};
