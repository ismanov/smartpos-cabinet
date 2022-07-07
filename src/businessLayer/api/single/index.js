import Service from "../../core/service";
import url from "../url";

function Single() {
  Service.call(this);
}

Single.prototype = Object.create(Service.prototype);

Single.prototype.fetchSingleCatalogList = function(filter) {
  return this.request({
    url: `${url.categories}/main${this.makeQueryParams(filter)}`,
    method: "GET",
  });
};

Single.prototype.saveCategories = function(categoryList, branchId) {
  return this.request({
    url: `${url.categories}/load-from-catalog?branchId=${branchId}`,
    data: categoryList,
    method: "PUT",
  });
};

Single.prototype.transferCatalog = function(fromBranchId, toBranchIds) {
  return this.request({
    url: `${url.categories}/transfer-catalog`,
    data: { fromBranchId, toBranchIds },
    method: "PUT",
  });
};

export default Single;
