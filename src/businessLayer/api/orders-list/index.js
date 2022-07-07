import Service from "../../core/service";
import url from '../url';

function OrdersListApi() {
  Service.call(this);
}

OrdersListApi.prototype = Object.create(Service.prototype);

OrdersListApi.prototype.getOrdersList = function (filter) {
  return this.request({url: `${url.base}sales/orders${this.makeQueryParams(filter)}`, method: 'GET'});
};

OrdersListApi.prototype.syncInvoices = function () {
  return this.request({url: `${url.base}invoices/sync`, method: 'GET'});
};

OrdersListApi.prototype.downloadXls = function (filter) {
  return this.request({url: `${url.base}sales/orders/export${this.makeQueryParams(filter)}`, method: 'GET', responseType: 'blob'});
};

OrdersListApi.prototype.getOrderStatuses = function () {
  return this.request({url: `${url.base}sales/orders/status/groups`, method: 'GET'});
};

OrdersListApi.prototype.getOrderSubStatuses = function (group) {
  return this.request({url: `${url.base}sales/orders/statuses-by-group/${group}`, method: 'GET'});
};

OrdersListApi.prototype.getSuppliersItemsList = function (filter) {
  return this.request({url: `${url.base}suppliers/lookup${this.makeQueryParams(filter)}`, method: 'GET'});
};

OrdersListApi.prototype.getOrderDetailsList = function (id) {
  return this.request({url: `${url.base}sales/orders/${id}`, method: 'GET'});
};

OrdersListApi.prototype.confirmOrder = function (data) {
  return this.request({url: `${url.base}purchase/orders/status`, data, method: 'PUT'});
};

OrdersListApi.prototype.rejectOrder = function (data) {
  return this.request({url: `${url.base}purchase/orders/status`, data, method: 'PUT'});
};

OrdersListApi.prototype.uploadContract = function(file, filter) {
  let data = new FormData();
  data.append('file', file);
  return this.request({url: `${url.base}contracts/document/upload/${filter.id}`, data, headers: { 'Content-Type': 'multipart/form-data' }, method: 'POST'})
};

OrdersListApi.prototype.getContractDetails = function (id) {
  return this.request({url: `${url.base}contracts/by-purchase-order/${id}`, method: 'GET'});
};

OrdersListApi.prototype.confirmContract = function (data) {
  return this.request({url: `${url.base}contracts/status`, data, method: 'PUT'});
};

OrdersListApi.prototype.rejectContract = function (data) {
  return this.request({url: `${url.base}contracts/status`, data, method: 'PUT'});
};

OrdersListApi.prototype.expiredContract = function (data) {
  return this.request({url: `${url.base}contracts/status`, data, method: 'PUT'});
};

OrdersListApi.prototype.getInvoicePaymentDetails = function (id) {
  return this.request({url: `${url.base}invoice-payments/by-purchase-order/${id}`, method: 'GET'});
};

OrdersListApi.prototype.uploadInvoicePayment = function(file, filter) {
  let data = new FormData();
  data.append('file', file);
  return this.request({url: `${url.base}invoice-payments/document/upload/${filter.id}`, data, headers: { 'Content-Type': 'multipart/form-data' }, method: 'POST'})
};

OrdersListApi.prototype.confirmInvoicePayment = function (data) {
  return this.request({url: `${url.base}invoice-payments`, data, method: 'PUT'});
};

OrdersListApi.prototype.getPowerOfAttorneyDetails = function (id) {
  return this.request({url: `${url.base}power-of-attorneys/by-purchase-order/${id}`, method: 'GET'});
};

OrdersListApi.prototype.getCurrentResponsiblePersonItems = function (id) {
  return this.request({url: `${url.base}power-of-attorneys/by-purchase-order/${id}`, method: 'GET'});
};

OrdersListApi.prototype.createPowerOfAttorney = function (data) {
  return this.request({url: `${url.base}power-of-attorneys`, data, method: 'POST'});
};

OrdersListApi.prototype.receiveOrder = function (data) {
  return this.request({url: `${url.base}purchase/orders/status`, data, method: 'PUT'});
};

OrdersListApi.prototype.getInvoiceDetails = function (id) {
  return this.request({url: `${url.base}invoices/by-purchase-order/${id}`, method: 'GET'});
};

OrdersListApi.prototype.checkInvoiceStatus = function (id) {
  return this.request({url: `${url.base}invoices/check-xfile-status/${id}`, method: 'GET'});
};

export default OrdersListApi;