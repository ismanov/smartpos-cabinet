import React from "react";
import { makeStyles } from "@material-ui/core";

import { Switch, Route } from "react-router-dom";
import Catalog from "./catalog/index";

const BASE_PATH = "/cashier/sale/";

const useStyles = makeStyles(() => ({
  container: {
    width: "100%",
    height: "100%",
  },
}));

const RightContent = () => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <Switch>
        <Route path={BASE_PATH} component={Catalog} />
        <Route path={`${BASE_PATH}/:id`} component={Catalog} />
      </Switch>
    </div>
  );
};

export default RightContent;
