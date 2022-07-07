import Service from "../../core/service";
import url from '../url';

function Employee() {
    Service.call(this);
}

Employee.prototype = Object.create(Service.prototype);

Employee.prototype.fetchEmployeeList = function (filter) {
    return this.request({url: `${url.employee}${this.makeQueryParams(filter)}`, method: 'GET' });
};

Employee.prototype.createEmployee = function (employee) {
    return this.request({ url: `${url.employee}`, data: employee, method: 'POST' });
};

Employee.prototype.updateEmployee = function (employee) {
    return this.request({ url: `${url.employee}`, data: employee, method: 'PUT' });
};

Employee.prototype.fetchCashiers  = function (branchId) {
    return this.request({ url: `${url.employee}${this.makeQueryParams({page: 0, size: 10000000, role: 'CASHIER', branchId})}`, method: 'GET' });
};

Employee.prototype.employeeStats = function (id) {
    return this.request({ url: `${url.analytics}sales-stats/employee/stat${this.makeQueryParams({userId: id})}`, method: 'GET' })
};

Employee.prototype.fetchEmployeeForId = function (id) {
    return this.request({url: `${url.employee}/${id}`, method: 'GET'})
};

Employee.prototype.dismissEmployee = function (id) {
    return this.request({ url: `${url.employee}/${id}`, method: 'DELETE' });
};

export default Employee;
