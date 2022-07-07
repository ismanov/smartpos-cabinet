import Service from "../../core/service";
import url from '../url';

function Discounts() {
    Service.call(this);
}

Discounts.prototype = Object.create(Service.prototype);

Discounts.prototype.fetchDiscountList = function (filters, cancelToken) {
    return this.request({url: `${url.discounts}branchPromotions${this.makeQueryParams(filters)}`, method: 'GET', cancelToken });
};

Discounts.prototype.fetchDiscountSelectbox = function(filters, cancelToken) {    
    return this.request({url: `${url.discounts}lookup${this.makeQueryParams(filters)}`, method: 'GET', cancelToken})
}

Discounts.prototype.fetchDiscountStats = function (filters, cancelToken) {
    return this.request({url: `${url.discounts}promotionStats${this.makeQueryParams(filters)}`, method: 'GET', cancelToken });
};

Discounts.prototype.createDiscount = function (discount) {
    return this.request({url: `${url.discounts}create`, data: discount, method: 'POST' });
};

Discounts.prototype.fetchDiscountById = function (id) {
    return this.request({url: `${url.discounts}byId/${id}`, method: 'GET' });
};

Discounts.prototype.changeStatus = function (id, status) {
    return this.request({url: `${url.discounts}changestatus/${id}?status=${status}`, method: 'PUT'})
};

Discounts.prototype.updateDiscount = function (discount) {
    return this.request({url: `${url.discounts}update`, data: discount, method: 'PUT'})
};

export default Discounts;
