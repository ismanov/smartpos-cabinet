import Service from "../../core/service";
import url from '../url';

function Supplier() {
    Service.call(this);
}

Supplier.prototype = Object.create(Service.prototype);

Supplier.prototype.fetchSupplierList = function (filter) {
    return this.request({url: `${url.contractors}${this.makeQueryParams(filter)}`, method: 'GET'})
};

Supplier.prototype.createSupplier = function (supplier) {
    return this.request({ url: `${url.contractors}`, data: supplier, method: 'POST' });
};

Supplier.prototype.updateSupplier = function (supplier) {
    return this.request({ url: `${url.contractors}`, data: supplier, method: 'PUT' });
};

Supplier.prototype.removeSupplier = function (supplierId) {
    return this.request({ url: `${url.contractors}/${supplierId}`, method: 'DELETE' });
};

export default Supplier;
