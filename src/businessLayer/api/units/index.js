import Service from "../../core/service";
import url from '../url';

function Units() {
    Service.call(this);
}

Units.prototype = Object.create(Service.prototype);

Units.prototype.createProductUnit = function (unit) {
    return this.request({url: `${url.unit}}`, unit, method: 'POST'})
};

Units.prototype.fetchProductUnit = function (branchId, productId) {
    return this.request({ url: `${url.unit}/${productId}/${branchId}` })
};

export default Units;
