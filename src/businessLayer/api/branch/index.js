import Service from "../../core/service";
import url from '../url';

function Branch() {
    Service.call(this);
}

Branch.prototype = Object.create(Service.prototype);

Branch.prototype.fetchBranchList = function (filter) {
    return this.request({url: `${url.branch}${this.makeQueryParams(filter)}`, method: 'GET' });
};

Branch.prototype.fetchSelectBoxBranchList = function () {
    return this.request({ url: `${url.branch}/selectbox` })
};

Branch.prototype.createBranch = function (branch) {
    return this.request({url: `${url.branch}`, data: branch, method: 'POST'});
};

Branch.prototype.updateBranch = function (branch) {
    return this.request({url: `${url.branch}`, data: branch, method: 'PUT'});
};

Branch.prototype.removeBranch = function (branch) {
    return this.request({url: `${url.branch}/${branch.id}`, method: 'DELETE'});
};

Branch.prototype.fetchBranchById = function(branchId) {
    return this.request({url: `${url.branch}/${branchId}`, method: 'GET'});
};

Branch.prototype.fetchCurrentBranch = function() {
    return this.request({url: `${url.branch}/current`, method: 'GET'});
};

export default Branch;
