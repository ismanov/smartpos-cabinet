import Service from "../../core/service";
import url from '../url';

function Income() {
    Service.call(this);
}

Income.prototype = Object.create(Service.prototype);

Income.prototype.createIncome = function (income) {
    return this.request({url: `${url.warehouse}/income-of-product`, data: income, method: 'POST' });
};

Income.prototype.fetchIncomeList = function (filter) {
    return this.request({ url: `${url.warehouse}/income-of-product${this.makeQueryParams(filter)}`, method: 'GET' })
};

Income.prototype.fetchIncomeById = function (id) {
    return this.request({url: `${url.warehouse}/income-of-product/${id}`})
};

export default Income;
