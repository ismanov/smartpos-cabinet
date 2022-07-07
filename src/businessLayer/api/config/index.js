import Service from "../../core/service";
import url from '../url';

function Config() {
    Service.call(this);
}

Config.prototype = Object.create(Service.prototype);

Config.prototype.fetchBusinessType = function () {
    return this.request({url: `${url.company}/business-types`, method: 'GET' });
};

Config.prototype.fetchRegions = function () {
    return this.request({url: `${url.base}regions`, method: 'GET' });
};

Config.prototype.fetchCityForRegionId = function (id) {
    return this.request({url: `${url.base}cities/${id}`, method: 'GET' });
};

Config.prototype.fetchActivityTypeList = function () {
    return this.request({url: `${url.base}activity-types`, method: 'GET' });
};

Config.prototype.fetchPositionList = function () {
    return this.request({url: `${url.base}users/roles`, method: 'GET' });
};

Config.prototype.createCompany = function (company) {
    return this.request({url: `${url.company}`, data: company, method: 'POST' });
};

Config.prototype.updateCompany = function (company) {
    return this.request({url: `${url.owners}`, data: company, method: 'PUT' });
};

Config.prototype.addEmployee = function (employee) {
    return this.request({url: `${url.users}`, data: employee, method: 'POST' });
};

Config.prototype.fetchUserList = function (filter) {
    return this.request({url: `${url.users}${this.makeQueryParams(filter)}`, method: 'GET' });
};

Config.prototype.updateUser = function (employee) {
    return this.request({url: `${url.users}`, data: employee, method: 'PUT' });
};

Config.prototype.fetchBranchList = function (filter) {
    return this.request({url: `${url.branch}${this.makeQueryParams(filter)}`, method: 'GET' });
};

Config.prototype.createBranch = function (branch) {
    return this.request({url: `${url.branch}`, data: branch, method: 'POST' });
};

Config.prototype.removeBranch = function (branch) {
    return this.request({url: `${url.branch}/delete`, data: branch, method: 'PUT' });
};

Config.prototype.editBranch = function (branch) {
    return this.request({url: `${url.branch}`, data: branch, method: 'PUT' });
};

Config.prototype.fetchCatalogList = function () {
    return this.request({url: `${url.categories}/main`, method: 'GET' });
};
Config.prototype.saveCategories = function (categoryList) {
    return this.request({url: `${url.categories}/load-from-catalog`, data: categoryList, method: 'PUT' });
};

Config.prototype.getCurrentCompany = function () {
    return this.request({url: `${url.company}/current`, method: 'GET' });
};

export default Config;
