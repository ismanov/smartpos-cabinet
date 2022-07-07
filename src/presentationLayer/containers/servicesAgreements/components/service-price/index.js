import React from "react";
import {
  getAgreementPrice,
  getTariffPrice,
  getTariffRecurringModel,
} from "../../helper";
import { PriceWrapper } from "#components/PriceWrapper";

export const ServicePrice = (props) => {
  const { agreement, tariff } = props;

  let price = 0;
  let recurring;

  if (agreement) {
    if (!!agreement.total) price = agreement.total;
    else price = getAgreementPrice(agreement);
    recurring = getTariffRecurringModel(agreement.xizmat);
  } else if (tariff) {
    price = getTariffPrice(tariff);
    recurring = getTariffRecurringModel(tariff);
  }

  return (
    <>
      <PriceWrapper price={price} />
      {recurring}
    </>
  );
};
