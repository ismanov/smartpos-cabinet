import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import AddSubscribeAgreement from "./add-subscribe-agreement";
import AddCustomAgreement from "./add-custom-agreement";

import {
  getCustomerPublicOffer,
  getServicesTariffs,
  resetCustomerPublicOffer,
} from "../../redux/actions";
import { servicesAgreementsSelector } from "../../redux/reducer";

import { IconButton } from "@material-ui/core";
import { ArrowBackIos } from "@material-ui/icons";
import { PublicOfferModal } from "../publicOfferModal";
import "./styles.scss";
import { getBranchesCount } from "./../../redux/actions";

export default (props) => {
  const { tin, backUrl, history } = props;

  const { t } = useTranslation();
  const dispatch = useDispatch();

  const $tariffsItems = useSelector(
    servicesAgreementsSelector("servicesTariffs")
  );
  const $branchesCount = useSelector(
    servicesAgreementsSelector("branchesCount")
  );

  const { data: tariffsItems, loading: tariffsItemsLoading } = $tariffsItems;

  const [subscribeServicesMap, setSubscribeServicesMap] = useState({});
  const [customServicesMap, setCustomServicesMap] = useState({});
  const [tariffsDataEntry, setTariffsDataEntry] = useState([]);

  const [publicOfferModalProps, setPublicOfferModalProps] = useState({
    visible: false,
    shouldRender: false,
  });

  useEffect(() => {
    dispatch(getCustomerPublicOffer(tin));
    dispatch(getBranchesCount({ tin }));
    return () => {
      dispatch(resetCustomerPublicOffer());
    };
  }, []);
  useEffect(
    () => {
      dispatch(
        getServicesTariffs(
          `?branchInstance=${$branchesCount ? $branchesCount : 1}`
        )
      );
    },
    [$branchesCount]
  );

  useEffect(
    () => {
      const subscribeServices = {};
      const customServices = {};
      const tariffDE = [];

      tariffsItems.forEach((tariff) => {
        const serviceCode =
          tariff && tariff.serviceType ? tariff.serviceType.code : "";
        if (serviceCode === "DATA_ENTRY") {
          tariffDE.push(tariff);
        }

        if (serviceCode.indexOf("CUSTOM_") === 0) {
          if (customServices[serviceCode]) {
            customServices[serviceCode].tariffs.push(tariff);
          } else {
            customServices[serviceCode] = {
              serviceType: tariff.serviceType,
              tariffs: [tariff],
            };
          }
        } else {
          if (subscribeServices[serviceCode]) {
            subscribeServices[serviceCode].tariffs.push(tariff);
          } else {
            subscribeServices[serviceCode] = {
              serviceType: tariff.serviceType,
              tariffs: [tariff],
            };
          }
        }
      });

      setSubscribeServicesMap(subscribeServices);
      setCustomServicesMap(customServices);
      setTariffsDataEntry(tariffDE);
    },

    [tariffsItems]
  );

  const showPublicOfferModal = (callBack) => {
    setPublicOfferModalProps({
      ...publicOfferModalProps,
      visible: true,
      shouldRender: true,
      tin,
      callBack,
    });
  };

  return (
    <div className="custom-content add-agreement">
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
            <h1>{t("servicesAgreements.addAgreement.head")}</h1>
          </div>
        </div>
      </div>

      <AddSubscribeAgreement
        services={subscribeServicesMap}
        servicesLoading={tariffsItemsLoading}
        showPublicOfferModal={showPublicOfferModal}
        tin={tin}
        backUrl={backUrl}
        history={history}
      />
      <AddCustomAgreement
        services={customServicesMap}
        tariffsDataEntry={{
          serviceType: "DATA_ENTRY",
          tariffs: tariffsDataEntry,
        }}
        servicesLoading={tariffsItemsLoading}
        showPublicOfferModal={showPublicOfferModal}
        tin={tin}
        backUrl={backUrl}
        history={history}
      />

      {publicOfferModalProps.shouldRender && (
        <PublicOfferModal
          modalProps={publicOfferModalProps}
          setModalProps={setPublicOfferModalProps}
        />
      )}
    </div>
  );
};
