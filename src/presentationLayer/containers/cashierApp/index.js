import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import MaterialDrawer from "./leftMenu/materialDrawer";
import SaveCheque from "../saveCheque";
import Cheques from "#containers/reports/cheques";
import ZReport from "#containers/reports/zReport";
import Sale from "./components/sale/index";

const CashierApp = () => {
  return (
    <MaterialDrawer>
      <Switch>
        <Route
          exact
          path="/cashier"
          component={() => <Redirect to="/cashier/cheques" />}
        />
        <Route path="/cashier/cheques" component={Cheques} />
        <Route path="/cashier/save-cheque" component={SaveCheque} />
        <Route path="/cashier/z-report" component={ZReport} />
        <Route path="/cashier/sale" component={Sale} />
      </Switch>
    </MaterialDrawer>
  );
};

export default CashierApp;
