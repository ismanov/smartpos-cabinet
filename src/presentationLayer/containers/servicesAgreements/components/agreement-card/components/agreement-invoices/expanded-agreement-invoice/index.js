/* eslint-disable jsx-a11y/iframe-has-title */
import React, { useEffect } from "react";
import "./styles.scss";
import { useDispatch, useSelector } from "react-redux";
import { fetchGeneratedInvoice } from "./../../../../../redux/actions";
import { servicesAgreementsSelector } from "./../../../../../redux/reducer";
import { PrinterSvg } from "../../../../../../../../assets/icons";
import { printIframe } from "./../../../../../../../../utils/print";

export const ExpandedAgreementInvoice = (props) => {
  const { invoiceId } = props;
  const dispatch = useDispatch();

  const generatedInvoiceData = useSelector(
    servicesAgreementsSelector("generatedInvoicesData")
  );
  const generatedInvoiceLoading = useSelector(
    servicesAgreementsSelector("generatedInvoicesLoading")
  );

  useEffect(() => {
    dispatch(fetchGeneratedInvoice(invoiceId));
  }, []);

  if (!generatedInvoiceData) {
    return null;
  }

  return (
    <div className="expanded-agreement-invoice">
      <div className="current-order__document-btns">
        <button className="btn-icon" onClick={() => printIframe("divToPrint")}>
          <PrinterSvg size="25" />
        </button>
      </div>
      <iframe
        id="divToPrint"
        width="100%"
        height="1000px"
        srcDoc={generatedInvoiceData}
      />
      {generatedInvoiceLoading && <div className="abs-loader" />}
    </div>
  );
};
