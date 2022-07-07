const SmartposUrl = function () {
    this.base           = '/api/';
    this.company         = this.base + 'company';
    this.users          = this.base + 'users';
    this.analytics      = this.base + 'analytics/';
    this.branch         = this.base + 'branches';
    this.employee       = this.base + 'users';
    this.warehouse      = this.base + 'warehouse';
    this.categories     = this.base + 'categories';
    this.order          = this.warehouse + '/purchase-order';
    this.products       = this.base + 'products';
    this.contractors    = this.base + 'contractors';
    this.template       = this.base + 'receipt-template';
    this.report         = this.base + 'report/';
    this.receipt        = this.base + 'receipt';
    this.transfer       = this.warehouse + '/transfer';
    this.account        = this.base + 'account/';
    this.unit           = this.base + 'product/productUnits';
    this.discounts      = this.base + "promotions/";
    this.terminal       = this.base + "terminal";
    this.receipt        = this.base + "receipt";
};

export default new SmartposUrl();
