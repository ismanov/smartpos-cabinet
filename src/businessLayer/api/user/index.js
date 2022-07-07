import Service from "../../core/service";
import url from '../url';

function User() {
    Service.call(this);
}

User.prototype = Object.create(Service.prototype);

User.prototype.setPassword = function (currentPassword, newPassword) {
    return this.request({url: `${url.base}account/change-password`,
        data: {
            currentPassword,
            newPassword
        }, method: 'POST'})
};

User.prototype.getCurrentUser = function () {
    return this.request({url: `${url.employee}/current`, method: 'GET'})
};

User.prototype.updateUser = function (user) {
    return this.request({url: `${url.employee}`, data: user, method: 'PUT'})
};

User.prototype.updateCurrentOwner = function (owner) {
    return this.request({url: `${url.company}`, data: owner, method: 'PUT'})
};

User.prototype.fetchBankRequisites = function (filter) {
    return this.request({ url: `${url.company}/bank_account${this.makeQueryParams(filter)}`, method: 'GET' });
};

User.prototype.fetchVatList = function() {
    return this.request({ url: `${url.company}/vat`, method: 'GET' })
};

User.prototype.createBankRequisite = function (bankRequisite) {
    return this.request({ url: `${url.company}/bank_account`, data: bankRequisite, method: 'POST' });
};

User.prototype.updateBankRequisite = function (bankRequisite) {
    return this.request({ url: `${url.company}/bank_account`, data: bankRequisite, method: 'PUT' });
};

export default User;
