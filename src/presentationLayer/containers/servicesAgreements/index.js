import React from "react";
import { useSelector } from "react-redux";
import { Switch, Route } from "react-router-dom";
import AgreementsList from "./components/agreements-list";
import AddAgreement from "./components/add-agreement";
import { AgreementCard } from "./components/agreement-card";

export default (props) => {
  const { match } = props;

  const $currentOwner = useSelector(
    (state) => state.get("dashboard").currentOwner
  );
  const tin = $currentOwner && $currentOwner.inn;

  if (!tin) {
    return (
      <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <h2>Проверьте, есть ли у компании ИНН</h2>
      </div>
    );
  }

  const backUrl = match.url;

  return (
    <Switch>
      <Route
        exact
        path={match.path}
        render={(props) => <AgreementsList {...props} tin={tin} />}
        tin={tin}
      />
      <Route
        exact
        path={`${match.path}/add`}
        render={(props) => (
          <AddAgreement {...props} tin={tin} backUrl={backUrl} />
        )}
      />
      <Route
        path={`${match.path}/:agreementId`}
        render={(props) => (
          <AgreementCard {...props} tin={tin} backUrl={backUrl} />
        )}
      />
    </Switch>
  );
};
