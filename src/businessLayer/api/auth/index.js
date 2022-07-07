import Service from "../../core/service";
import url from '../url';

function Auth() {
    Service.call(this);
}

Auth.prototype = Object.create(Service.prototype);

Auth.prototype.authenticate = function (username, password) {
    return this.simpleRequest({url: `${url.base}login`, data: { username, password, rememberMe: true }, method: 'POST'});
};

Auth.prototype.registerViaSMS = function (phoneNumber) {
    return this.request({url: `${url.base}register-sms`, data: { login: phoneNumber }, method: 'POST'});
};

Auth.prototype.confirmCode = function (phoneNumber, confirmationCode, password) {
    return this.request({url: `${url.base}activate-sms`, data: {login: phoneNumber, key: confirmationCode, newPassword: password}, method: 'POST'});
};

Auth.prototype.resetPasswordSendMessage = function (phone) {
    return this.request({url: `${url.account}reset-password/init`, data: phone, method: 'POST',  headers: {'Content-Type': 'application/json'}});
};

Auth.prototype.resetPasswordConfirm = function(confirmObject) {
    return this.request({url: `${url.account}reset-password/finish`, data: confirmObject, method: 'POST' });
};

export default Auth;
