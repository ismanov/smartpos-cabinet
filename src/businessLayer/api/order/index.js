import Service from "../../core/service";
import url from '../url';

function Order() {
    Service.call(this);
}

Order.prototype = Object.create(Service.prototype);

Order.prototype.fetchOrderList = function (filter) {
    return this.request({url: `${url.order}${this.makeQueryParams(filter)}`, method: 'GET' });
};

Order.prototype.fetchOrderById = function (orderId) {
    return this.request({url: `${url.order}/${orderId}`, method: 'GET' });
};

Order.prototype.updateOrder = function (order) {
    return this.request({ url: `${url.order}`, data: order, method: 'PUT' });
};

Order.prototype.deleteOrder = function (orderId) {
    return this.request({ url: `${url.order}/${orderId}`, method: 'DELETE' });
};

Order.prototype.createOrder = function (order) {
    return this.request({ url: `${url.order}`, data: order, method: 'POST' });
};

export default Order;
