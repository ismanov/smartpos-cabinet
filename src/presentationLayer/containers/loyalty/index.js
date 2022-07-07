import React from 'react';
import { Switch, Route } from 'react-router-dom';
import LoyaltyCards from "./components/cards";
import LoyaltySystems from "./components/systems";
import AddLoyaltySystem from "./components/add-system";
import Clients from "./components/clients";


export default (props) => {
  const { match } = props;

  return (
    <Switch>
      <Route
        exact
        path={`${match.path}/cards`}
        component={LoyaltyCards}
      />
      <Route
        exact
        path={`${match.path}/systems`}
        component={LoyaltySystems}
      />
      <Route
        exact
        path={`${match.path}/systems/add`}
        component={AddLoyaltySystem}
      />
      <Route
        exact
        path={`${match.path}/systems/:id`}
        component={AddLoyaltySystem}
      />
      <Route
        exact
        path={`${match.path}/clients`}
        component={Clients}
      />
    </Switch>
  )
};