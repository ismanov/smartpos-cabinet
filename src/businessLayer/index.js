import Analytics                from "./api/analytics";
import Auth                     from "./api/auth";
import Branch                   from './api/branch';
import Employee                 from "./api/employee";
import Adjustment               from "./api/adjustment";
import Config                   from "./api/config";
import Income                   from "./api/income";
import Arrival                  from "./api/arrival";
import MyCatalog                from "./api/myCatalog";
import Order                    from "./api/order";
import OrderingApi              from "./api/ordering";
import OrdersListApi            from "./api/orders-list";
import Product                  from "./api/product";
import Resource                 from "./api/resource";
import Single                   from "./api/single";
import SupplierCatalogApi       from "./api/supplier-catalog";
import Supplier                 from "./api/supplier";
import Template                 from "./api/template";
import User                     from "./api/user";
import Warehouse                from "./api/warehouse";
import Report                   from "./api/report";
import Excel                    from "./api/excel";
import Transfer                 from "./api/transfer";
import Units                    from "./api/units";
import Discounts                from './api/discounts';
import Terminal                 from './api/terminal';
import Cheque                   from './api/cheque';
import Loyalty                  from './api/loyalty';
import ServicesAgreements       from './api/servicesAgreements';

const LogicContainer = {
    adjustment:         new Adjustment(),
    analytics:          new Analytics(),
    auth:               new Auth(),
    branch:             new Branch(),
    config:             new Config(),
    employee:           new Employee(),
    excel:              new Excel(),
    income:             new Income(),
    arrival:            new Arrival(),
    myCatalog:          new MyCatalog(),
    order:              new Order(),
    ordering:           new OrderingApi(),
    ordersList:         new OrdersListApi(),
    product:            new Product(),
    resource:           new Resource(),
    report:             new Report(),
    single:             new Single(),
    supplierCatalog:    new SupplierCatalogApi(),
    supplier:           new Supplier(),
    template:           new Template(),
    transfer:           new Transfer(),
    user:               new User(),
    warehouse:          new Warehouse(),
    units:              new Units(),
    discounts:          new Discounts(),
    terminal:           new Terminal(),
    cheque:             new Cheque(),
    loyalty:            new Loyalty(),
    servicesAgreements: new ServicesAgreements(),
};

export default LogicContainer;
