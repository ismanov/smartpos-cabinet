import React from "react";
import { ExpandedCustomAgreementService } from "../expanded-custom-agreement-service";
import { useTranslation } from "react-i18next";
import { PriceWrapper } from "../../../../../../components/PriceWrapper";
import { ServicePrice } from "../../../service-price";
import { getTariffPrice } from "../../../../helper";
import { CollapsibleTable } from "#components/CollapsibleTable";
import "./styles.scss";

export const CustomAgreementServices = (props) => {
  const { agreements, getAgreementDetails } = props;

  const { t } = useTranslation();

  const dataSource = agreements.agreements.map((item, index) => {
    console.log(item);
    return {
      id: item.id,
      key: item.id,
      num: <div className="w-s-n">{index + 1}</div>,
      serviceType: item && item.serviceType && item.serviceType.nameRu,
      description: <span>{item.description ? item.description : "-"}</span>,
    };
  });

  const headers = [
    {
      key: "serviceType",
      content: t("servicesAgreements.agreementCard.customCols.serviceType"),
    },
    {
      key: "description",
      content: "Описание",
    },
  ];

  return (
    <div className="custom-agreement-services">
      <h4 className="custom-agreement-services__head">
        {t("servicesAgreements.agreementCard.customServices")}
      </h4>
      <CollapsibleTable
        headers={headers}
        data={dataSource}
        expandable={{
          expandedRowRender: (agreement) => (
            <ExpandedCustomAgreementService
              agreement={agreement}
              getAgreementDetails={getAgreementDetails}
            />
          ),
        }}
      />
    </div>
  );
};
