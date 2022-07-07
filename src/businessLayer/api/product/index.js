import Service from "../../core/service";
import url from '../url';

function Product() {
    Service.call(this);
}

Product.prototype = Object.create(Service.prototype);

Product.prototype.fetchProductListForCategoryId = function (filter, cancelToken) {
    return this.request({url: `${url.products}/page/web${this.makeQueryParams(filter)}`, method: 'GET', cancelToken})
};

Product.prototype.createProduct = function (product) {
    return this.request({url: `${url.products}`, data: product, method: 'POST'});
};

Product.prototype.updateProduct = function (product) {
    return this.request({url: `${url.products}`, data: product, method: 'PUT'});
};

Product.prototype.updatePrice = function (product) {
    return this.request({url: `${url.products}/set-price`, data: product, method: 'PUT'});
};

Product.prototype.removeProduct = function (product, branchId) {
    let qp = '';
    if (branchId !== undefined) {
        qp = `?branchId=${branchId}`
    }
    return this.request({url: `${url.products}/${product.id}${qp}`, method: 'DElETE'});
};

Product.prototype.fetchProductListForKeyword = function(filter, cancelToken) {
    return this.request({url: `${url.products}/search${this.makeQueryParams(filter)}`, method: 'GET', cancelToken});
};

Product.prototype.fetchProductListForKeywordInBranch = function(filter, cancelToken) {
    return this.request({url: `${url.products}/searchinbranch${this.makeQueryParams(filter)}`, method: 'GET', cancelToken});
};

Product.prototype.fetchProductPricingHistory = function (id, branchId) {
    let qp = '';
    if (branchId !== undefined) {
        qp = `?branchId=${branchId}`
    }
    return this.request({url: `${url.products}/${id}/price-history${qp}`, method: 'GET'})
};

Product.prototype.fetchProductById = function(id, branchId) {
    return this.request({ url: `${url.products}/${id}${this.makeQueryParams({branchId})}`, method: 'GET'})
};

Product.prototype.importProducts = function(file, filter) {
    let data = new FormData();
    data.append('uploadFile', file);
    return this.request({url: `${url.products}/import${this.makeQueryParams(filter)}`, data, headers: { 'Content-Type': 'multipart/form-data' }, method: 'POST', responseType: 'blob'})
};

Product.prototype.importProductsRef = function(file, filter) {
    let data = new FormData();
    data.append('uploadFile', file);
    return this.request({url: `${url.products}/import/ref${this.makeQueryParams(filter)}`, data, headers: { 'Content-Type': 'multipart/form-data' }, method: 'POST', responseType: 'blob'})
};

Product.prototype.changeCategoryPrice = function(branchId, categoryId, percentAmount, decrease) {
    return this.request({
        url: `${url.products}/set-price-category/`, 
        data: { 
            branchId, 
            categoryId,
            coefficient: percentAmount,
            decrease
        }, 
        method: 'PUT'});
};

Product.prototype.setVatBatch = function(branchId, categoryId, nds) {
    return this.request({
        url: `${url.products}/set-vat/batch`,
        data: {
            branchId, 
            categoryId,
            vatRate: nds,
        },
        method: 'PUT'
    })
}

Product.prototype.setMarkBatch = function(branchId, categoryId, hasMark) {
    return this.request({
        url: `${url.products}/set-mark/batch`,
        data: {
            branchId, 
            categoryId,
            hasMark,
        },
        method: 'PUT'
    })
}

export default Product;
