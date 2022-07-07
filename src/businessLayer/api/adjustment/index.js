import Service from "../../core/service";
import url from '../url';

function Adjustment() {
    Service.call(this);
}

Adjustment.prototype = Object.create(Service.prototype);

Adjustment.prototype.fetchAdjustmentList = function (filter) {
    return this.request({url: `${url.warehouse}/stock-adjustments${this.makeQueryParams(filter)}`, method: 'GET'})
};

Adjustment.prototype.createAdjustment = function (adjustment) {
    return this.request({ url: `${url.warehouse}/stock-adjustments`, data: adjustment, method: 'POST' });
};

export default Adjustment;
