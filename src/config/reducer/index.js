import { combineReducers }      from 'redux-immutable';

import loginReducer             from '#redux/auth/reducer';
import configReducer            from '#redux/config/reducer';
import commonReducer            from '#redux/common/reducer';
import smartposReducer          from '#redux/smartpos/reducer';
// import employeeReducer          from '#redux/employee/reducer';
// import branchReducer            from '#redux/branch/reducer';
import resourceReducer          from '#redux/resources/reducer';
import myCatalogReducer         from '#redux/myCatalog/reducer';
import productReducer           from '#redux/product/reducer';
import singleCatalogReducer     from '#redux/single/reducer';
// import productBalanceReducer    from '#redux/productBalance/reducer';
import balanceReducer           from '../../presentationLayer/containers/warehouse/balance/reducer';
import supplierReducer          from '#redux/supplier/reducer';
import incomeReducer            from '#redux/income/reducer';
import currentUserReducer       from '#redux/currentUser/reducer';
import templateReducer          from '#redux/template/reducer';
import orderReducer             from '#redux/orders/reducer';
import adjustmentReducer        from '#redux/adjustment/reducer';
import transferReducer          from '#redux/transfer/reducer';
// import mainReducer              from '#redux/main/reducer';
import reportReducer            from '#redux/report/reducer';
import filterReducer            from '#redux/filters/reducer';
import appStateReducer          from '#redux/appState/reducer';
import unitReducer              from '#redux/unit/reducer';
import signInReducer            from '../../presentationLayer/containers/auth/signin/reducer';
import dashboardReducer         from '../../presentationLayer/containers/dashboard/reducer';
import mainReducer              from '../../presentationLayer/containers/main/reducer';
import branchReducer            from '../../presentationLayer/containers/branches/list/reducer';
import employeeReducer          from '../../presentationLayer/containers/employee/redux';
import balanceCardReducer       from '../../presentationLayer/containers/warehouse/balanceCard/reducer';
import balanceByDayReducer      from '../../presentationLayer/containers/warehouse/balanceByDay/reducer';
import discountsReducer         from '../../presentationLayer/containers/discounts/list/reducer';

export default combineReducers({
    login: loginReducer,
    config: configReducer,
    common: commonReducer,
    smartpos: smartposReducer,
    employee: employeeReducer,
    branch: branchReducer,
    resources: resourceReducer,
    myCatalog: myCatalogReducer,
    product: productReducer,
    single: singleCatalogReducer,
    productBalance: balanceReducer,
    balanceCard: balanceCardReducer,
    balanceByDay: balanceByDayReducer,
    supplier: supplierReducer,
    income: incomeReducer,
    currentUser: currentUserReducer,
    template: templateReducer,
    order: orderReducer,
    adjustment: adjustmentReducer,
    transfer: transferReducer,
    main: mainReducer,
    report: reportReducer,
    filter: filterReducer,
    appState: appStateReducer,
    unit: unitReducer,
    signIn: signInReducer,
    dashboard: dashboardReducer,
    discounts: discountsReducer
});
