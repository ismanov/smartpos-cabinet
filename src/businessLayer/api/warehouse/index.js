import Service from "../../core/service";
import url from '../url';

function Warehouse() {
    Service.call(this);
}

Warehouse.prototype = Object.create(Service.prototype);

Warehouse.prototype.fetchProductBalance = function (filter) {
    return this.request({url: `${url.warehouse}/register${this.makeQueryParams(filter)}`, method: 'GET'})
};

Warehouse.prototype.fetchProductBalanceByDay = function (filter) {
    return this.request({url: `${url.warehouse}/register/history${this.makeQueryParams(filter)}`, method: 'GET'})
};

Warehouse.prototype.fetchProductBalanceStats = function (filter) {
    return this.request({url: `${url.warehouse}/register/stats${this.makeQueryParams(filter)}`, method: 'GET'})
};

Warehouse.prototype.fetchProductBalanceById = function(filter) {
    return this.request({ url: `${url.warehouse}/register/product${this.makeQueryParams(filter)}` })
};

Warehouse.prototype.fetchCurrentProductBalance = function (filter) {
    return this.request({url: `${url.warehouse}/register/current${this.makeQueryParams(filter)}`, method: 'GET'})
};

export default Warehouse;
