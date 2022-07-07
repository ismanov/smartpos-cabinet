import React, { useState } from "react";
import { makeStyles } from "@material-ui/core";
import {
  StarIcon,
  ScannerIcon,
  ScanningIcon,
  MoneyIcon,
} from "./../../../../../../../assets/icons/index";
import clsx from "clsx";

const useStyles = makeStyles(() => ({
  container: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  header: {
    width: "100%",
    height: "13vh",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 14%",
    borderBottom: "solid 1px #E5E5E5",
  },
  headerItemBox: {
    width: "69px",
    height: "69px",
    border: "solid 1px #E5E5E5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  active: {
    background:
      "linear-gradient(180deg, rgba(20, 167, 108, 0.2) 0%, rgba(20, 167, 108, 0) 100%)",
  },
  body: {
    flexGrow: 1,
    width: "100%",
  },
  footer: {
    width: "100%",
    height: "13vh",
    borderTop: "solid 1px #E5E5E5",
    padding: 15,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  footerColumn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    color: "#B0B0B0",
    fontWeight: 600,
  },
  flexCenter: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  fontSize14: {
    fontSize: 14,
    marginTop: 15,
    lineHeight: "16px",
  },
  disabledColor: {
    color: "#B0B0B0",
  },
  fontSize16: {
    fontSize: "16px",
    lineHeight: "19px",
  },
  fontSize25: {
    fontSize: 25,
    lineHeight: "29px",
  },
}));

const LeftContent = () => {
  const classes = useStyles();
  const [link, setLink] = useState();
  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <div
          className={clsx(classes.headerItemBox, {
            [classes.active]: link === "star",
          })}
          onClick={() => setLink("star")}
        >
          <div />
          <StarIcon />
        </div>
        <div
          className={clsx(classes.headerItemBox, {
            [classes.active]: link === "money",
          })}
          onClick={() => setLink("money")}
        >
          <MoneyIcon />
        </div>
        <div
          className={clsx(classes.headerItemBox, {
            [classes.active]: link === "scanning",
          })}
          onClick={() => setLink("scanning")}
        >
          <ScanningIcon />
        </div>
      </div>
      <div className={clsx(classes.body, classes.flexCenter)}>
        <ScannerIcon />
        <span className={clsx(classes.fontSize14, classes.disabledColor)}>
          Отсканируйте товар или добавьте из каталога
        </span>
      </div>
      <div className={classes.footer}>
        <div className={classes.footerColumn}>
          <span className={classes.fontSize16}>СУММА</span>
          <span className={classes.fontSize25}>0 СУМ</span>
        </div>
        <div className={classes.footerColumn}>
          <span className={classes.fontSize16}>К ОПЛАТЕ</span>
          <span className={classes.fontSize25}>0 СУМ</span>
        </div>
      </div>
    </div>
  );
};

export default LeftContent;
