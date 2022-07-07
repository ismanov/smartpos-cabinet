import React from "react";
import moment from "moment";
import { getAgreementRecurring, getAgreementTariff } from "../../../../helper";
import { DATA_ENTRY } from "../../../../constants";
import { CustomAgreementServices } from "../custom-agreement-services";
import { ServicePrice } from "../../../service-price";
import { useTranslation } from "react-i18next";

export const AgreementDetails = (props) => {
  const { data, getAgreementDetails } = props;

  const { t } = useTranslation();

  return (
    <div className="agreement-card__details-wrap">
      <div className="agreement-card__details">
        <div className="agreement-card__details__block">
          <div className="agreement-card__details__title">
            {t("servicesAgreements.listColumns.serviceType")}
          </div>
          <div className="agreement-card__details__value">
            {data && data.serviceType && data.serviceType.nameRu}
          </div>
        </div>
        <div className="agreement-card__details__block">
          <div className="agreement-card__details__title">
            {t("servicesAgreements.listColumns.tariff")}
          </div>
          <div className="agreement-card__details__value">
            {getAgreementTariff(data)}
          </div>
        </div>
        <div className="agreement-card__details__block">
          <div className="agreement-card__details__title">
            {t("servicesAgreements.listColumns.recurring")}
          </div>
          <div className="agreement-card__details__value">
            {getAgreementRecurring(data)}
          </div>
        </div>
        <div className="agreement-card__details__block">
          <div className="agreement-card__details__title">
            {t("servicesAgreements.listColumns.status")}
          </div>
          <div className="agreement-card__details__value">
            {data.status && data.status.nameRu}
          </div>
        </div>
        <div className="agreement-card__details__block">
          <div className="agreement-card__details__title">
            {t("servicesAgreements.listColumns.firstActivatedDate")}
          </div>
          <div className="agreement-card__details__value">
            {data.firstActivatedDate
              ? moment(data.firstActivatedDate).format("DD.MM.YYYY")
              : "-"}
          </div>
        </div>
        <div className="agreement-card__details__block">
          <div className="agreement-card__details__title">
            {t("servicesAgreements.listColumns.lastPeriodEnd")}
          </div>
          <div className="agreement-card__details__value">
            {data.lastPeriodEnd
              ? moment(data.lastPeriodEnd).format("DD.MM.YYYY")
              : "-"}
          </div>
        </div>
        <div className="agreement-card__details__block">
          <div className="agreement-card__details__title">
            {t("servicesAgreements.listColumns.price")}
          </div>
          <div className="agreement-card__details__value">
            <ServicePrice agreement={data} />
          </div>
        </div>
      </div>
      {data.serviceType &&
        data.serviceType.code === DATA_ENTRY && (
          <CustomAgreementServices
            agreements={data}
            getAgreementDetails={getAgreementDetails}
          />
        )}
    </div>
  );
};
