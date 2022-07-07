import Service from "../../core/service";
import url from '../url';

function Transfer() {
    Service.call(this);
}

Transfer.prototype = Object.create(Service.prototype);

Transfer.prototype.fetchAllTransfers = function (filter) {
    return this.request({url: `${url.transfer}${this.makeQueryParams(filter)}`, method: 'GET'})
};

Transfer.prototype.createTransfer = function (transfer) {
    return this.request({ url: `${url.transfer}/send`, data: transfer, method: 'POST' })
};

Transfer.prototype.requestTransfer = function (transfer) {
    return this.request({url: `${url.transfer}/request`, data: transfer, method: 'POST'})
};

Transfer.prototype.approveTransfer = function (transfer) {
    return this.request({ url: `${url.transfer}/approve`, data: transfer, method: 'PUT' });
};

Transfer.prototype.cancelTransfer = function (transfer) {
    return this.request({ url: `${url.transfer}/cancel`, data: transfer, method: 'PUT' });
};

Transfer.prototype.fetchTransferById = function (id) {
    return this.request({ url: `${url.transfer}/${id}`, method: 'GET' });
};

export default Transfer;
