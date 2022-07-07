import Service from "../../core/service";
import url from '../url';

function Template() {
    Service.call(this);
}

Template.prototype = Object.create(Service.prototype);

Template.prototype.fetchTemplate = function () {
    return this.request({url: `${url.template}`, method: 'GET'})
};

Template.prototype.saveTemplate = function (template) {
    return this.request({url: `${url.template}`, data: template, method: 'PUT'})
};

Template.prototype.removeTemplate = function (id) {
    return this.request({url: `${url.template}/${id}`, method: 'DELETE'})
};


export default Template;
