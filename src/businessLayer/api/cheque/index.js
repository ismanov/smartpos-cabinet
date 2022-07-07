import Service from "../../core/service";
import url from '../url';

function Cheque() {
    Service.call(this);
}

Cheque.prototype = Object.create(Service.prototype);

Cheque.prototype.createCheque = function (cheque) {
    return this.request({url: `${url.receipt}/web/send`, data: cheque, method: 'POST'})
};

Cheque.prototype.deleteChequeById = function (id) {
    return this.request({url: `${url.receipt}/${id}`, method: "DELETE"});
}

Cheque.prototype.fetchPaymentTypes = function () {
    return this.request({url: `${url.receipt}/web/send`})
};

export default Cheque;