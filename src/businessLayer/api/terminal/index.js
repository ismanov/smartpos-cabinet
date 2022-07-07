import Service from "../../core/service";
import url from '../url';

function Terminal() {
    Service.call(this);
}

Terminal.prototype = Object.create(Service.prototype);

Terminal.prototype.fetchTerminalsByBranchId = function(filter) {
    return this.request({url: `${url.terminal}/choose${this.makeQueryParams(filter)}`, method: 'GET'})
};

export default Terminal;
