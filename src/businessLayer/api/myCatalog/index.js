import Service from "../../core/service";
import url from '../url';
import axios from "axios";


function MyCatalog() {
    Service.call(this);
}

MyCatalog.prototype = Object.create(Service.prototype);

MyCatalog.prototype.fetchMyCatalog = function (branchId) {
    return this.request({url: `${url.categories}/enabled${branchId !== undefined ? `?branchId=${branchId}` : ''}`, method: 'GET'});
};

MyCatalog.prototype.addCategory = function (category) {
    return this.request({url: `${url.categories}`, data: category, method: 'POST' });
};

MyCatalog.prototype.updateCategory = function (category) {
    return this.request({url: `${url.categories}`, data: category, method: 'PUT' });
};

MyCatalog.prototype.searchMyCatalog = function (filter, token) {
    return this.request({ url: `${url.categories}/search${this.makeQueryParams(filter)}`, method: 'GET', cancelToken: token})
};

MyCatalog.prototype.removeCategory = function (category) {
    let branchId = '';
    if (category.branchId !== undefined) {
        branchId = `?branchId=${category.branchId}`
    }
    return this.request({url: `${url.categories}/load-from-catalog${branchId}`, data: [category], method: 'PUT' });
};

MyCatalog.prototype.downloadTemplate = function(filter) {
    return this.request({url: `${url.base}product_excel_template${this.makeQueryParams(filter)}`, method: 'GET', responseType: 'blob'});
};

export default MyCatalog;
