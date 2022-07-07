import Service from "../../core/service";
import url from '../url';

function Loyalty() {
  Service.call(this);
}

Loyalty.prototype = Object.create(Service.prototype);

Loyalty.prototype.getLoyaltyCardTypes = function () {
  return this.request({
    url: "/api/v1/loyal/card/types",
    method: 'GET',
  });
};

Loyalty.prototype.getLoyaltyPeriods = function () {
  return this.request({
    url: "/api/v1/card/loyalty/periods",
    method: 'GET',
  });
};

Loyalty.prototype.getLoyaltySystemStatuses = function () {
  return this.request({
    url: "/api/v1/card/loyalty/statuses",
    method: 'GET',
  });
};

Loyalty.prototype.getLoyaltySystemsItems = function () {
  return this.request({
    url: "/api/v1/card/loyalty/systems",
    method: 'GET',
  });
};

Loyalty.prototype.getLoyaltyCardsList = function (params, cancelToken) {
  return this.request({
    url: "/api/v1/loyal/card",
    method: 'GET',
    params,
    cancelToken
  });
};

Loyalty.prototype.getLoyaltyCardsStats = function (params, cancelToken) {
  return this.request({
    url: "/api/v1/loyal/card/statistics",
    method: 'GET',
    params,
    cancelToken
  });
};

Loyalty.prototype.getLoyaltyCardDetails = function (id) {
  return this.request({
    url: `/api/v1/loyal/card/${id}`,
    method: 'GET',
  });
};

Loyalty.prototype.addLoyaltyCard = function (data) {
  return this.request({
    url: "/api/v1/loyal/card",
    method: 'POST',
    data
  });
};

Loyalty.prototype.updateLoyaltyCard = function (data) {
  return this.request({
    url: "/api/v1/loyal/card",
    method: 'PUT',
    data
  });
};

Loyalty.prototype.deleteLoyaltyCard = function (id) {
  return this.request({
    url: `/api/v1/loyal/card/${id}`,
    method: 'DELETE',
  });
};

Loyalty.prototype.getLoyaltySystemsList = function (params, cancelToken) {
  return this.request({
    url: "/api/v1/card/loyalty/list",
    method: 'GET',
    params,
    cancelToken
  });
};

Loyalty.prototype.changeLoyaltySystemStatus = function (data) {
  return this.request({
    url: "/api/v1/card/loyalty/update",
    method: 'PUT',
    data,
  });
};

Loyalty.prototype.getLoyaltySystemDetails = function (id) {
  return this.request({
    url: `/api/v1/card/loyalty/${id}`,
    method: 'GET',
  });
};

Loyalty.prototype.getAddLoyaltySystemCards = function (params) {
  return this.request({
    url: "/api/v1/loyal/card/type",
    method: 'GET',
    params
  });
};

Loyalty.prototype.getAddLoyaltySystemBranches = function (params) {
  return this.request({
    url: "/api/v1/card/loyalty/branches",
    method: 'GET',
    params
  });
};

Loyalty.prototype.addLoyaltySystem = function (data) {
  return this.request({
    url: "/api/v1/card/loyalty",
    method: 'POST',
    data
  });
};

Loyalty.prototype.updateLoyaltySystem = function (data) {
  return this.request({
    url: "/api/v1/card/loyalty",
    method: 'PUT',
    data
  });
};

Loyalty.prototype.getLoyaltyClients = function (params, cancelToken) {
  return this.request({
    url: "/api/v1/user/card",
    method: 'GET',
    params,
    cancelToken
  });
};

Loyalty.prototype.getAPayUserDetails = function (login) {
  return this.request({
    url: `/api/v1/user/card/user/${login}`,
    method: 'GET',
  });
};

Loyalty.prototype.getLoyaltyClientLevels = function (id) {
  return this.request({
    url: `/api/v1/card/loyalty/system/${id}`,
    method: 'GET',
  });
};

Loyalty.prototype.addLoyaltyClient = function (data) {
  return this.request({
    url: "/api/v1/user/card",
    method: 'POST',
    data
  });
};


export default Loyalty;
