import Service from "../../core/service";
import url from '../url';

function ArrivalApi() {
  Service.call(this);
}

ArrivalApi.prototype = Object.create(Service.prototype);

ArrivalApi.prototype.getArrivalList = function (filter) {
  return this.request({url: `${url.base}income-of-products${this.makeQueryParams(filter)}`, method: 'GET'});
};

ArrivalApi.prototype.getArrivalCreateBranches = function () {
  return this.request({url: `${url.base}branches/selectbox`, method: 'GET'});
};

ArrivalApi.prototype.getSuppliersItems = function (filter) {
  return this.request({url: `${url.base}suppliers/lookup${this.makeQueryParams(filter)}`, method: 'GET'});
};

ArrivalApi.prototype.getArrivalCreateProducts = function (filter) {
  return this.request({url: `${url.base}purchase/orders/${filter.id}/${filter.branchId}/items`, method: 'GET'});
};

ArrivalApi.prototype.getArrivalCreateOrders = function () {
  return this.request({url: `${url.base}sales/orders/completed`, method: 'GET'});
};

ArrivalApi.prototype.getArrivalCreateProductsItems = function (filter) {
  return this.request({url: `${url.base}products/searchinbranch${this.makeQueryParams(filter)}`, method: 'GET'});
};

ArrivalApi.prototype.getArrivalCreateProductUnits = function (filter) {
  return this.request({url: `${url.base}product/productUnits/${filter.productId}/${filter.branchId}`, method: 'GET'});
};

ArrivalApi.prototype.addArrivalsByOrder = function (data) {
  return this.request({url: `${url.base}income-of-products/by-order`, data, method: 'POST'});
};

ArrivalApi.prototype.addArrivalsByProduct = function (data) {
  return this.request({url: `${url.base}income-of-products/by-product`, data, method: 'POST'});
};

ArrivalApi.prototype.getArrivalInfo = function (id) {
  return this.request({url: `${url.base}income-of-products/${id}`, method: 'GET'});
};

export default ArrivalApi;