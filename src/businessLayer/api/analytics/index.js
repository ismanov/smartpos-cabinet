import Service from "../../core/service";
import url from '../url';

function Analytics() {
    Service.call(this);
}

Analytics.prototype = Object.create(Service.prototype);

Analytics.prototype.fetchSalesDynamics = function (filter) {
    return this.request({url: `${url.analytics}sales-dynamics${this.makeQueryParams(filter)}`, method: 'GET'})
};

Analytics.prototype.fetchSalesStats = function (filter) {
    return this.request({url: `${url.analytics}sales-stats${this.makeQueryParams(filter)}`, method: 'GET'})
};

Analytics.prototype.fetchSalesStatsProducts = function (filter) {
    return this.request({ url: `${url.analytics}sales-stats/products${this.makeQueryParams(filter)}`, method: 'GET' });
};

Analytics.prototype.fetchSalesStatsEmployee = function (filter) {
    return this.request({url: `${url.analytics}sales-stats/users${this.makeQueryParams(filter)}`, method: 'GET'});
};

export default Analytics;
