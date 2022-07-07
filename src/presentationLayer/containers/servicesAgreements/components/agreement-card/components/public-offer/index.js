/* eslint-disable jsx-a11y/iframe-has-title */
import React, { useEffect } from "react";
import { servicesAgreementsSelector } from "./../../../../redux/reducer";
import { useDispatch, useSelector } from "react-redux";
import { fetchCustomerPublicOffer } from "./../../../../redux/actions";
import { CircularProgress } from "@material-ui/core";
import { printIframe } from "./../../../../../../../utils/print";
import { PrinterSvg } from "../../../../../../../assets/icons";

export const PublicOffer = (props) => {
  const { tin } = props;
  const dispatch = useDispatch();

  const customerPublicOffer = useSelector(
    servicesAgreementsSelector("publicOfferData")
  );
  const customerPublicOfferLoading = useSelector(
    servicesAgreementsSelector("publicOfferLoading")
  );

  useEffect(() => {
    dispatch(fetchCustomerPublicOffer(tin));
  }, []);

  const onPrintDocumentClick = (id) => {
    printIframe(id);
  };

  return (
    <div className="current-order">
      <div className="current-order__document">
        <div className="current-order__document-btns">
          <button onClick={() => onPrintDocumentClick("divToPrint")}>
            <PrinterSvg size="24" />
          </button>
        </div>
        {customerPublicOffer && (
          <iframe
            id="divToPrint"
            width="100%"
            height="1000px"
            srcDoc={customerPublicOffer.publicOfferContent}
          />
        )}
        {customerPublicOfferLoading && (
          <div className="abs-loader">
            <CircularProgress />
          </div>
        )}
      </div>
    </div>
  );
};
