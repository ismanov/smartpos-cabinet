import { combineReducers }                  from 'redux-immutable';

import signInReducer                        from '../../presentationLayer/containers/auth/signin/hooks/redux/reducer';
import supplierReducer                      from '../../presentationLayer/containers/suppliers/reducer';
import chequesByDiscountReducer             from '../../presentationLayer/containers/reports/chequesByDiscount/reducer';
import balanceReducer                       from '../../presentationLayer/containers/warehouse/balance/reducer';
import dashboardReducer                     from '../../presentationLayer/containers/dashboard/reducer';
import mainReducer                          from '../../presentationLayer/containers/main/reducer';
import branchReducer                        from '../../presentationLayer/containers/branches/reducer';
import employeeReducer                      from '../../presentationLayer/containers/employee/redux';
import balanceCardReducer                   from '../../presentationLayer/containers/warehouse/balanceCard/reducer';
import balanceByDayReducer                  from '../../presentationLayer/containers/warehouse/balanceByDay/reducer';
import discountsReducer                     from '../../presentationLayer/containers/discounts/list/reducer';
import discountInfoReducer                  from '../../presentationLayer/containers/discounts/showDiscount/reducer';
import myCatalogReducer                     from '../../presentationLayer/containers/catalog/my/reducer';
import singleCatalogReducer                 from '../../presentationLayer/containers/catalog/single/reducer';
import supplierCatalogReducer               from '../../presentationLayer/containers/catalog/supplier/reducer';
import supplierDetailReducer                from '../../presentationLayer/containers/catalog/supplier-detail/reducer';
import adjustmentReducer                    from '../../presentationLayer/containers/warehouse/adjustment/reducer';
import saveChequeReducer                    from '../../presentationLayer/containers/saveCheque/reducer';
import settingsReducer                      from '../../presentationLayer/containers/settings/reducer';
import incomeReducer                        from '../../presentationLayer/containers/warehouse/incomes/reducer';
import arrivalReducer                       from '../../presentationLayer/containers/warehouse/arrival/reducer';
import cashierMainReducer                   from '../../presentationLayer/containers/cashierApp/reducer';
import chequeReducer                        from '../../presentationLayer/containers/reports/cheques/reducer';
import zReportReducer                       from '../../presentationLayer/containers/reports/zReport/reducer';
import orderReducer                         from '../../presentationLayer/containers/warehouse/order/reducer';
import orderingReducer                      from '../../presentationLayer/containers/warehouse/orders/ordering/reducer';
import ordersListReducer                    from '../../presentationLayer/containers/warehouse/orders/list/reducer';
import cashTransactionReducer               from '../../presentationLayer/containers/reports/cashTransactions/reducer';
import reportByOneProductReducer            from '../../presentationLayer/containers/reports/byOneProduct/reducer';
import reportByCashiersReducer              from '../../presentationLayer/containers/reports/byCashiers/reducer';
import reportByCategoryReducer              from '../../presentationLayer/containers/reports/byCategory/reducer'
import reportByProductReducer               from '../../presentationLayer/containers/reports/byProduct/reducer';
import signUpReducer                        from '../../presentationLayer/containers/auth/signup/reducer';
import setPasswordReducer                   from '../../presentationLayer/containers/auth/setPassword/reducer';
import resetReducer                         from '../../presentationLayer/containers/auth/reset/reducer';
import confirmReducer                       from '../../presentationLayer/containers/auth/confirm/reducer';
import loyaltyReducer                       from '../../presentationLayer/containers/loyalty/redux/reducer';
import servicesAgreementsReducer            from '../../presentationLayer/containers/servicesAgreements/redux/reducer';
import transferReducer                      from '../../presentationLayer/containers/warehouse/transfers/reducer';
import pricingReducer                       from '../../presentationLayer/containers/warehouse/pricing/balance/reducer';

import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import immutableTransform from 'redux-persist-transform-immutable'

const reducersObject = {
    pricing: pricingReducer,
    supplier: supplierReducer,
    transfer: transferReducer,
    confirm: confirmReducer,
    reset: resetReducer,
    signUp: signUpReducer,
    setPassword: setPasswordReducer,
    reportByProduct: reportByProductReducer,
    reportByCategory: reportByCategoryReducer,
    reportByCashiers: reportByCashiersReducer,
    reportByOneProduct: reportByOneProductReducer,
    employee: employeeReducer,
    branch: branchReducer,
    myCatalog: myCatalogReducer,
    single: singleCatalogReducer,
    supplierCatalog: supplierCatalogReducer,
    supplierDetail: supplierDetailReducer,
    productBalance: balanceReducer,
    balanceCard: balanceCardReducer,
    balanceByDay: balanceByDayReducer,
    adjustment: adjustmentReducer,
    main: mainReducer,
    signIn: signInReducer,
    dashboard: dashboardReducer,
    discounts: discountsReducer,
    discountInfo: discountInfoReducer,
    saveCheque: saveChequeReducer,
    settings: settingsReducer,
    income: incomeReducer,
    arrival: arrivalReducer,
    cashier: cashierMainReducer,
    cheque: chequeReducer,
    chequesByDiscount: chequesByDiscountReducer,
    zReport: zReportReducer,
    order: orderReducer,
    ordering: orderingReducer,
    ordersList: ordersListReducer,
    loyalty: loyaltyReducer,
    servicesAgreements: servicesAgreementsReducer,
    cashTransaction: cashTransactionReducer,
};

const blackList = new Map();
blackList.set("arrival", []);
blackList.set("ordering", []);
blackList.set("supplierCatalog", []);
blackList.set("supplierDetail", []);
blackList.set("ordersList", []);
blackList.set("loyalty", []);
blackList.set("signIn", ["isLoading"]);
blackList.set("zReport", ["date"]);
blackList.set("chequesByDiscount", ["date"]);
blackList.set("cheque", ["date"]);
blackList.set("discounts", ["startDate", "endDate"]);
blackList.set("main", ["date"]);
blackList.set("balanceByDay", ["date"]);
blackList.set("branch", ["listDate", "detailDate"]);
blackList.set("servicesAgreements", []);


export default combineReducers(Object.keys(reducersObject).reduce((acc, key) => {
    let blackListKeys = Array.from(blackList.keys());

    if (blackListKeys.includes(key)) {
        if (blackList.get(key).length) {
            acc[key] = persistReducer({
                transforms: [immutableTransform()],
                key: key,
                storage: storage,
                blacklist: blackList.get(key)
            }, reducersObject[key])
        } else {
            acc[key] = reducersObject[key]
        }
    } else {
        acc[key] = persistReducer({
            transforms: [immutableTransform()],
            key: key,
            storage: storage,
        }, reducersObject[key])
    }
    return acc
}, {}));
