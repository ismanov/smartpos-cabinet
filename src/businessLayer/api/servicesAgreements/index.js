import Service from "../../core/service";
import url from "../url";

function ServicesAgreements() {
  Service.call(this);
}

ServicesAgreements.prototype = Object.create(Service.prototype);

ServicesAgreements.prototype.getBranchesItems = function() {
  return this.request({
    method: "GET",
    url: "/api/branches/selectbox",
  });
};

ServicesAgreements.prototype.getServiceAgreementsList = function(
  params,
  cancelToken
) {
  return this.request({
    method: "GET",
    url: "/api/billing-services/agreements",
    params,
    cancelToken,
  });
};

ServicesAgreements.prototype.getServicesTariffs = function(params) {
  return this.request({
    method: "GET",
    url: "/api/billing-services/xizmats" + (params || ""),
  });
};

ServicesAgreements.prototype.getBranchesCount = function(params) {
  return this.request({
    method: "GET",
    url: "/api/branches/count-by-tin",
    params,
  });
};

ServicesAgreements.prototype.getBalance = function(tin) {
  return this.request({
    method: "GET",
    url: `/api/admin/billing-services/balance/tin/${tin}`,
  });
};

ServicesAgreements.prototype.getCustomerPublicOffer = function(tin) {
  return this.request({
    method: "GET",
    url: `/api/admin/billing-services/customer-public-offer/tin/${tin}`,
  });
};

ServicesAgreements.prototype.getLastPublicOffer = function() {
  return this.request({
    method: "GET",
    url: "/api/admin/billing-services/get-last-active-offer",
  });
};

ServicesAgreements.prototype.acceptPublicOffer = function(data) {
  return this.request({
    method: "POST",
    url: "/api/admin/billing-services/customer-public-offer/create-by-tin",
    data,
  });
};

ServicesAgreements.prototype.createSubscribeAgreement = function(data) {
  return this.request({
    method: "POST",
    url: "/api/billing-services/agreements",
    data,
  });
};

ServicesAgreements.prototype.createCustomAgreement = function(data) {
  return this.request({
    method: "POST",
    url: "/api/billing-services/multi-agreements",
    data,
  });
};

ServicesAgreements.prototype.getServiceAgreementDetails = function(id) {
  return this.request({
    method: "GET",
    url: `/api/billing-services/agreements/${id}`,
  });
};

// quotes >  start
ServicesAgreements.prototype.fetchQuoteDetails = function(id) {
  return this.request({
    method: "GET",
    url: `/api/quote/${id}`,
  });
};

ServicesAgreements.prototype.fetchGeneratedQuote = function(quoteId) {
  return this.request({
    method: "GET",
    url: `/api/quote/${quoteId}/template`,
  });
};

ServicesAgreements.prototype.changeQuoteStatus = function(data) {
  return this.request({
    method: "PUT",
    url: `/api/quote/${data.id}/change-status`,
    data,
  });
};

ServicesAgreements.prototype.uploadQuoteFile = function(data) {
  return this.request({
    method: "POST",
    url: `/api/quote/${data.id}/upload`,
    data: data.file,
  });
};

// end

// report APIes start>>

ServicesAgreements.prototype.fetchDataEntryByAgreementId = function(
  agreementId
) {
  return this.request({
    method: "GET",
    url: `/api/data-entry/${agreementId}`,
  });
};

ServicesAgreements.prototype.ApproveDataEntryStatus = function(data) {
  return this.request({
    method: "PUT",
    url: "/api/data-entry/approve",
    data,
  });
};

// end

ServicesAgreements.prototype.getAgreementList = function(id) {
  return this.request({
    method: "GET",
    url: `/api/billing-services/agreements-by-tin/${id}`,
  });
};

ServicesAgreements.prototype.updateAgreementServiceDesc = function({
  id,
  note,
}) {
  return this.request({
    method: "POST",
    url: `/api/billing-services/agreements/${id}/update-note`,
    data: note,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

ServicesAgreements.prototype.uploadAgreementFile = function({ data }) {
  return this.request({
    method: "POST",
    url: "/api/billing-services/attachment/add",
    data,
  });
};

//  Public Offer  start >>>

ServicesAgreements.prototype.fetchCustomerPublicOffer = function(tin) {
  return this.request({
    method: "GET",
    url: `/api/admin/billing-services/customer-public-offer/tin/${tin}`,
  });
};

//  Agreement invoices  start >>>

ServicesAgreements.prototype.fetchAgreementInvoices = function({
  quoteId,
  params,
}) {
  return this.request({
    method: "GET",
    url: `/api/billing-invoice/get-by-quote-id/${quoteId}${
      params ? "?" + params : ""
    }`,
  });
};

ServicesAgreements.prototype.fetchGeneratedInvoice = function(invoiceId) {
  return this.request({
    method: "GET",
    url: `/api/billing-invoice/${invoiceId}/template`,
  });
};

// payment api

ServicesAgreements.prototype.createTransaction = function(data) {
  return this.request({
    method: "POST",
    url: "/api/apay/create-transaction",
    data,
  });
};

ServicesAgreements.prototype.confirmTransaction = function(data) {
  return this.request({
    method: "POST",
    url: "/api/apay/confirm-transaction",
    data,
  });
};

export default ServicesAgreements;
