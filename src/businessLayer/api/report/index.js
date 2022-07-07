import Service from "../../core/service";
import url from "../url";

function Report() {
  Service.call(this);
}

Report.prototype = Object.create(Service.prototype);

Report.prototype.fetchChequeList = function(filter) {
  return this.request({
    url: `${url.receipt}${this.makeQueryParams(filter)}`,
    method: "GET",
  });
};

Report.prototype.fetchPaymentTypes = function() {
  return this.request({ url: `${url.receipt}/payment-types`, method: "GET" });
};

Report.prototype.fetchCashOperationsChequeList = function(filter) {
  return this.request({
    url: `${url.receipt}/operation${this.makeQueryParams(filter)}`,
    method: "GET",
  });
};

Report.prototype.fetchZReport = function(filter) {
  return this.request({
    url: `${url.base}shifts/report${this.makeQueryParams(filter)}`,
    method: "GET",
  });
};

Report.prototype.fetchZReport = function(filter) {
  return this.request({
    url: `${url.base}shifts/report${this.makeQueryParams(filter)}`,
    method: "GET",
  });
};

Report.prototype.fetchZReportStats = function(filter) {
  return this.request({
    url: `${url.base}shifts/report/stats${this.makeQueryParams(filter)}`,
    method: "GET",
  });
};

Report.prototype.fetchChequeStatus = function() {
  return this.request({ url: `${url.receipt}/statuses`, method: "GET" });
};

Report.prototype.fetchTerminals = function(filter) {
  return this.request({
    url: `/api/terminal/choose${this.makeQueryParams(filter)}`,
    method: "GET",
  });
};

Report.prototype.fetchChequeOperationStatus = function() {
  return this.request({
    url: `${url.receipt}/statuses/operation`,
    method: "GET",
  });
};

Report.prototype.fetchChequeById = function(id) {
  return this.request({ url: `${url.receipt}/getById/${id}`, method: "GET" });
};

Report.prototype.fetchChequeListByUID = function(uid) {
  return this.request({ url: `${url.receipt}/${uid}`, method: "GET" });
};

Report.prototype.fetchDiscountChequeList = function(filter) {
  return this.request({
    url: `${url.receipt}/promotions${this.makeQueryParams(filter)}`,
  });
};

Report.prototype.reportByProducts = function(filter) {
  return this.request({
    url: `${url.analytics}sales-stats/products${this.makeQueryParams(filter)}`,
    method: "GET",
  });
};

Report.prototype.reportByOneProduct = function(filter) {
  return this.request({
    url: `${url.analytics}sales-dynamics/product${this.makeQueryParams(
      filter
    )}`,
    method: "GET",
  });
};

Report.prototype.reportByCategories = function(filter) {
  return this.request({
    url: `${url.analytics}sales-stats/categories${this.makeQueryParams(
      filter
    )}`,
    method: "GET",
  });
};

Report.prototype.reportByCategoriesStats = function(filter) {
  return this.request({
    url: `${url.analytics}sales-stats/categories/stat${this.makeQueryParams(
      filter
    )}`,
    method: "GET",
  });
};

Report.prototype.reportByCashiers = function(filter) {
  return this.request({
    url: `${url.analytics}sales-stats/users${this.makeQueryParams(filter)}`,
    method: "GET",
  });
};

Report.prototype.cashTransactionStats = function(filter) {
  return this.request({
    url: `${url.receipt}/statistics/statuses${this.makeQueryParams(filter)}`,
    method: "GET",
  });
};

Report.prototype.receiptStats = function(filter) {
  return this.request({
    url: `${url.receipt}/stat${this.makeQueryParams(filter)}`,
    method: "GET",
  });
};

Report.prototype.getProductStats = function(filter) {
  return this.request({
    url: `${
      url.base
    }analytics/sales-stats/products/header${this.makeQueryParams(filter)}`,
    method: "GET",
  });
};

export default Report;
