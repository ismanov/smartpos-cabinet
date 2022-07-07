import React from "react";
import { Container, makeStyles } from "@material-ui/core";
import LeftContent from "./components/left-content";
import RightContent from "./components/right-content";

const useStyles = makeStyles(() => ({
  container: {
    width: "100%",
    height: "100%",
    display: "flex",
    padding: 0,
    backgroundColor: "#FCFCFC",
  },
  leftContent: {
    width: "30.8vw",
    height: "100%",
    borderRight: "solid 1px #E5E5E5",
  },
  rightContent: {
    width: "69.1%",
    height: "100%",
  },
}));

const Sale = () => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <div className={classes.leftContent}>
        <LeftContent />
      </div>
      <div className={classes.rightContent}>
        <RightContent />
      </div>
    </div>
  );
};

export default Sale;
