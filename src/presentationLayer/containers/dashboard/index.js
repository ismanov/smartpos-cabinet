import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import DashboardMain from "#containers/main";
import EmployeeList from "#containers/employee/list";
import EmployeeDetail from "#containers/employee/detail";
import BranchList from "#containers/branches/list";
import BranchDetail from "#containers/branches/detail";
import MyCatalog from "#containers/catalog/my";
import SingleCatalog from "#containers/catalog/single";
import SupplierCatalog from "#containers/catalog/supplier";
import SupplierDetail from "#containers/catalog/supplier-detail";
import WarehouseAll from "#containers/warehouse/balance";
import WarehouseIncomes from "#containers/warehouse/incomes/list";
import WarehouseArrivalList from "#containers/warehouse/arrival/list";
import WarehouseArrivalCreate from "#containers/warehouse/arrival/arrival-create";
import WarehouseArrivalInfo from "#containers/warehouse/arrival/arrival-info";
import WarehouseTransfers from "#containers/warehouse/transfers/list";
import WarehouseTransferDetail from "#containers/warehouse/transfers/detail";
import WarehouseTransferOrder from "#containers/warehouse/transfers/order";
import SupplierList from "#containers/suppliers/list";
import IncomeAdd from "#containers/warehouse/incomes/detail";
import IncomeInfo from "../warehouse/incomes/info";
import Settings from "#containers/settings";
import Profile from "#containers/profile";
import Order from "#containers/warehouse/order/detail";
import AddOrder from "#containers/warehouse/order/add";
import Ordering from "#containers/warehouse/orders/ordering";
import OrderListNew from "#containers/warehouse/orders/list";
import OrderDetails from "#containers/warehouse/orders/list/details";
import OrderList from "#containers/warehouse/order/list";
import AdjustmentList from "#containers/warehouse/adjustment/list";
import AddEditAdjustment from "#containers/warehouse/adjustment/addEdit";
import TransferOrderDetail from "#containers/warehouse/transfers/order/card";
import Pricing from "#containers/warehouse/pricing/balance";
import Cheques from "#containers/reports/cheques";
import ByProduct from "#containers/reports/byProduct";
import ByOneProduct from "#containers/reports/byOneProduct";
import ByCategory from "#containers/reports/byCategory";
import ByCashiers from "#containers/reports/byCashiers";
import BalanceCard from "#containers/warehouse/balanceCard";
import SaveCheque from "#containers/saveCheque";
import BalanceByDay from "#containers/warehouse/balanceByDay";
import CashTransactions from "#containers/reports/cashTransactions";
import ZReport from "#containers/reports/zReport";
import DiscountList from "#containers/discounts/list";
import AddDiscount from "#containers/discounts/addDiscount";
import InfoDiscount from "#containers/discounts/showDiscount";
import Loyalty from "#containers/loyalty";
import ChequesByDiscount from "#containers/reports/chequesByDiscount";
import ServicesAgreements from "#containers/servicesAgreements";

import MaterialDrawer from "./leftMenu/material-drawer";
import { withRouter } from "react-router-dom";
import Payment from "../payment";

const Dashboard = () => {
  return (
    <MaterialDrawer>
      <Switch>
        <Route
          exact
          path="/main"
          component={() => <Redirect to="/main/dashboard" />}
        />
        <Route path="/main/dashboard" component={DashboardMain} />
        <Route exact path="/main/employees" component={EmployeeList} />
        <Route path="/main/employees/:employeeId" component={EmployeeDetail} />
        <Route exact path="/main/branches" component={BranchList} />
        <Route path="/main/branches/:branchId" component={BranchDetail} />
        <Route path="/main/catalog/my" component={MyCatalog} />
        <Route path="/main/catalog/single" component={SingleCatalog} />
        <Route
          exact
          path="/main/catalog/supplier"
          component={SupplierCatalog}
        />
        <Route
          path="/main/catalog/supplier/:supplierId"
          component={SupplierDetail}
        />
        <Route path="/main/warehouse/all" component={WarehouseAll} />
        <Route path="/main/warehouse/balanceByDay" component={BalanceByDay} />
        <Route
          exact
          path="/main/warehouse/incomes"
          component={WarehouseIncomes}
        />
        <Route path="/main/warehouse/incomes/add" component={IncomeAdd} />
        <Route
          path="/main/warehouse/incomes/info/:incomeId"
          component={IncomeInfo}
        />
        <Route
          exact
          path="/main/warehouse/arrival"
          component={WarehouseArrivalList}
        />
        <Route
          path="/main/warehouse/arrival/add"
          component={WarehouseArrivalCreate}
        />
        <Route
          path="/main/warehouse/arrival/info/:id"
          component={WarehouseArrivalInfo}
        />
        <Route
          exact
          path="/main/warehouse/transfers"
          component={WarehouseTransfers}
        />
        <Route
          path="/main/warehouse/transfers/single/:transferId"
          component={WarehouseTransferDetail}
        />
        <Route
          exact
          path="/main/warehouse/transfers/order/single/:transferId"
          component={WarehouseTransferOrder}
        />
        <Route
          exact
          path="/main/warehouse/transfers/order/card/:transferId"
          component={TransferOrderDetail}
        />
        <Route path="/main/warehouse/suppliers" component={SupplierList} />
        <Route path="/main/profile" component={Profile} />
        <Route path="/main/settings" component={Settings} />
        <Route exact path="/main/warehouse/orders" component={OrderList} />
        <Route path="/main/warehouse/orders/card/:orderId" component={Order} />
        <Route
          exact
          path="/main/warehouse/orders/new/:orderId"
          component={AddOrder}
        />
        <Route
          exact
          path="/main/warehouse/orders/ordering"
          component={Ordering}
        />
        <Route
          exact
          path="/main/warehouse/orders/list"
          component={OrderListNew}
        />
        <Route
          exact
          path="/main/warehouse/orders/list/:orderId"
          component={OrderDetails}
        />
        <Route
          exact
          path="/main/warehouse/adjustment"
          component={AdjustmentList}
        />
        <Route
          path="/main/warehouse/adjustment/add"
          component={AddEditAdjustment}
        />
        <Route path="/main/warehouse/pricing/all" component={Pricing} />
        <Route path="/main/report/cheques" component={Cheques} />
        <Route
          path="/main/report/chequeByDiscount"
          component={ChequesByDiscount}
        />
        <Route
          path="/main/report/cashTransactions"
          component={CashTransactions}
        />
        <Route path="/main/report/all" component={Pricing} />
        <Route path="/main/report/products" component={ByProduct} />
        <Route path="/main/report/byOneProduct" component={ByOneProduct} />
        <Route path="/main/report/byCategory" component={ByCategory} />
        <Route path="/main/report/byCashiers" component={ByCashiers} />
        <Route path="/main/report/z-report" component={ZReport} />
        <Route path="/main/warehouse/balanceCard" component={BalanceCard} />
        <Route path="/main/save-cheque" component={SaveCheque} />
        <Route path="/main/discounts/all" component={DiscountList} />
        <Route path="/main/discounts/add" component={AddDiscount} />
        <Route
          path="/main/discounts/info/:discountId"
          component={InfoDiscount}
        />
        <Route path="/main/loyalty" component={Loyalty} />
        <Route
          path="/main/services-agreements"
          component={ServicesAgreements}
        />
        <Route path="/main/payment" component={Payment} />
      </Switch>
    </MaterialDrawer>
  );
};

export default withRouter(Dashboard);
