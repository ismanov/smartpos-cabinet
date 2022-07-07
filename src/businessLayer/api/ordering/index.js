import Service from "../../core/service";
import url from '../url';

function OrderingApi() {
  Service.call(this);
}

OrderingApi.prototype = Object.create(Service.prototype);

// ORDERS
OrderingApi.prototype.getSuppliersItems = function (filter) {
  return this.request({url: `${url.base}suppliers/lookup${this.makeQueryParams(filter)}`, method: 'GET'});
};

OrderingApi.prototype.getBranchesItems = function (filter) {
  return this.request({url: `${url.base}supplier/branches/lookup${this.makeQueryParams(filter)}`, method: 'GET'});
};

OrderingApi.prototype.getPaymentsItems = function (filter) {
  return this.request({url: `${url.base}suppliers/payment-types${this.makeQueryParams(filter)}`, method: 'GET'});
};

OrderingApi.prototype.getDeliveryTypeItems = function (filter) {
  return this.request({url: `${url.base}suppliers/delivery-types${this.makeQueryParams(filter)}`, method: 'GET'});
};

OrderingApi.prototype.getProductsItems = function (filter) {
  return this.request({url: `${url.base}supplier/branch/products/lookup${this.makeQueryParams(filter)}`, method: 'GET'});
};

OrderingApi.prototype.createOrder = function (data) {
  return this.request({url: `${url.base}sales/orders`, data, method: 'POST'});
};

OrderingApi.prototype.updateOrder = function (data) {
  return this.request({url: `${url.base}sales/orders`, data, method: 'PUT'});
};

OrderingApi.prototype.deleteDraftOrder = function (id) {
  return this.request({url: `${url.base}sales/orders/${id}`, method: 'DELETE'});
};

export default OrderingApi;