import Service from "../../core/service";
import url from '../url';

function SupplierCatalogApi() {
  Service.call(this);
}

SupplierCatalogApi.prototype = Object.create(Service.prototype);

// CATALOG
SupplierCatalogApi.prototype.getOffersList = function (filter) {
  return this.request({url: `${url.base}suppliers/by-product${this.makeQueryParams(filter)}`, method: 'GET'});
};

SupplierCatalogApi.prototype.getVatItems = function () {
  return this.request({url: `${url.base}company/vat`, method: 'GET'});
};

// SUPPLIER DETAIL
SupplierCatalogApi.prototype.getSupplierInfo = function (filter) {
  return this.request({url: `${url.base}suppliers${this.makeQueryParams(filter)}`, method: 'GET'});
};

SupplierCatalogApi.prototype.getCategoriesList = function (filter) {
  return this.request({url: `${url.base}supplier/categories/tree${this.makeQueryParams(filter)}`, method: 'GET'});
};

SupplierCatalogApi.prototype.getBranchesItems = function (filter) {
  return this.request({url: `${url.base}supplier/branches/lookup${this.makeQueryParams(filter)}`, method: 'GET'});
};

SupplierCatalogApi.prototype.getProducts = function (filter) {
  return this.request({url: `${url.base}supplier/branch/products/lookup${this.makeQueryParams(filter)}`, method: 'GET'});
};

export default SupplierCatalogApi;
