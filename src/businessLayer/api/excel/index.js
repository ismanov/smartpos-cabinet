import Service from "../../core/service";
import url from '../url';

function Excel() {
    Service.call(this);
}

Excel.prototype = Object.create(Service.prototype);

Excel.prototype.products = function (filter) {
    return this.request({url: `${url.report}sales-stats/products/excel${this.makeQueryParams(filter)}`, method: 'GET', responseType: 'blob'})
};

Excel.prototype.byOneProduct = function (filter) {
    return this.request({url: `${url.report}sales-dynamics/product/excel${this.makeQueryParams(filter)}`, method: 'GET', responseType: 'blob'})
};

Excel.prototype.byCategory = function (filter) {
    return this.request({url: `${url.report}sales-stats/categories/excel${this.makeQueryParams(filter)}`, method: 'GET', responseType: 'blob'})
};

Excel.prototype.chequeList = function (filter) {
    return this.request({url: `${url.report}receipts/excel${this.makeQueryParams(filter)}`, method: 'GET', responseType: 'blob'})
};

Excel.prototype.zReport = function (filter) {
    return this.request({url: `${url.report}shift/excel${this.makeQueryParams(filter)}`, method: 'GET', responseType: 'blob'})
};

export default Excel;
