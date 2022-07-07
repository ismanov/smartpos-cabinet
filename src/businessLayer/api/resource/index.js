import Service from "../../core/service";
import url from '../url';

function Resource() {
    Service.call(this);
}

Resource.prototype = Object.create(Service.prototype);

Resource.prototype.fetchActivityTypeList = function () {
    return this.request({url: `${url.base}activity-types`, method: 'GET'})
};

Resource.prototype.fetchAuthorities = function () {
    return this.request({url: `${url.base}authorities`, method: 'GET'})
};

Resource.prototype.fetchBusinessType = function () {
    return this.request({url: `${url.company}/business-types`, method: 'GET'})
};

Resource.prototype.fetchRegions = function () {
    return this.request({url: `${url.base}regions`, method: 'GET'})
};

Resource.prototype.fetchCityForRegionId = function (id) {
    return this.request({url: `${url.base}cities/${id}`, method: 'GET'})
};

Resource.prototype.fetchPositionList = function () {
    return this.request({url: `${url.employee}/roles`, method: 'GET'})
};

Resource.prototype.fetchUnitList = function () {
    return this.request({url: `${url.base}product/units`, method: 'GET'})
};

Resource.prototype.fetchUnitListWithCoeff = function (productId, branchId, withBalance) {
    return this.request({url: `${url.base}product/productUnits/${productId}/${branchId}${this.makeQueryParams({withBalance})}`, method: 'GET'})
};

Resource.prototype.fetchPackageTypeList = function () {
    return this.request({url: `${url.base}product/package-types`, method: 'GET'})
};

Resource.prototype.fetchUnitsForProductId = function(productId, branchId, withBalance) {
    return this.request({url: `${url.base}product/productUnits/${productId}/${branchId}${this.makeQueryParams({withBalance})}`, method: 'GET'})
};

Resource.prototype.fetchVatList = function() {
    return this.request({ url: `${url.base}company/vat`, method: 'GET' })
}

export default Resource;
