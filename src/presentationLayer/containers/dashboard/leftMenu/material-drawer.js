import React, { useEffect } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import { Link } from "react-router-dom";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import Grid from "@material-ui/core/Grid";
import { Button, Typography, Popover, Hidden } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import logo from "../../../../assets/img/logo_full.svg";
import MainListItems from "./MainListItems";
import config from "../../../../../package";
import AccountInfo from "../components/accountInfo";
import {
  ExitToAppOutlined,
  PeopleOutlined,
  SettingsOutlined,
} from "@material-ui/icons";
import {
  fetchCurrentUser,
  fetchCurrentOwner,
  fetchBranchList,
  setCommonBranchId,
  setCurrentLang,
} from "../actions";
import SelectBox from "../../../components/Select";
import { withRouter } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import i18n from "../../../../i18n";
import memory from "../../../../coreLayer/services/memory";

const drawerWidth = 280;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
    justifyContent: "space-between",
  },
  toolbarIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: "none",
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
  },
  container: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    height: "calc(100% - 64px)",
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  fixedHeight: {
    height: 240,
  },
  btn_logo_wrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  switchLang: {
    marginRight: 15,
  },
  switchLangItem: {
    minWidth: 0,
    lineHeight: 1,
    padding: "5px 5px 4px",
  },
  switchLangItemActive: {
    fontWeight: 800,
  },
}));

const langsItems = [{ name: "RU", code: "ru" }, { name: "UZ", code: "uz" }];

let popupMenu;

const MaterialDrawer = (props) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [popoverOpen, setPopoverOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState();
  const commonBranchList = useSelector(
    (state) => state.get("dashboard").commonBranchList
  );
  const lang = useSelector((state) => state.get("dashboard").lang);
  const currentBranch = useSelector(
    (state) => state.get("dashboard").currentBranch
  );
  const currentUser = useSelector(
    (state) => state.get("dashboard").currentUser
  );
  const currentOwner = useSelector(
    (state) => state.get("dashboard").currentOwner
  );
  const dispatch = useDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    popupMenu = [
      {
        title: t("toolbar.profile"),
        icon: <PeopleOutlined />,
      },
      {
        title: t("toolbar.settings"),
        icon: <SettingsOutlined />,
      },
      {
        title: t("toolbar.logout"),
        icon: <ExitToAppOutlined />,
      },
    ];
  }, []);

  useEffect(
    () => {
      changeLanguage(lang);
    },
    [lang]
  );

  useEffect(
    () => {
      dispatch(fetchCurrentUser());
      dispatch(fetchCurrentOwner());
      dispatch(fetchBranchList());
    },
    [dispatch]
  );

  useEffect(
    () => {
      let found = commonBranchList.find((c) => c.id === currentBranch);
      if (!found) {
        dispatch(setCommonBranchId(undefined));
      }
    },
    [commonBranchList]
  );

  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };
  const currentLang = localStorage.getItem("i18nextLng") || "ru";

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        color={"white"}
        position="absolute"
        className={clsx(classes.appBar, open && classes.appBarShift)}
      >
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={clsx(
              classes.menuButton,
              open && classes.menuButtonHidden
            )}
          >
            <MenuIcon />
          </IconButton>
          <Hidden smDown>
            <Link to={"/main"}>
              <img src={logo} alt="logo" />
            </Link>
          </Hidden>
          <Grid
            container
            justify="flex-end"
            alignItems="center"
            direction="row"
          >
            <div className={classes.switchLang}>
              {langsItems.map((item) => (
                <Button
                  key={item.code}
                  color="primary"
                  size="small"
                  className={`${classes.switchLangItem} ${
                    currentLang === item.code
                      ? classes.switchLangItemActive
                      : ""
                  }`}
                  onClick={() => {
                    dispatch(setCurrentLang(item.code));
                  }}
                >
                  {item.name}
                </Button>
              ))}
            </div>
            <Grid item xs={5} md={3} lg={2} style={{ marginRight: 20 }}>
              <SelectBox
                label="????????????"
                labelWidth={70}
                itemKey="id"
                itemValue="name"
                data={commonBranchList || []}
                value={currentBranch || -1}
                onChange={(event) => {
                  dispatch(
                    setCommonBranchId(
                      event.target.value === -1 ? undefined : event.target.value
                    )
                  );
                }}
                style={{ height: 45 }}
              />
            </Grid>

            <AccountInfo
              companyName={currentUser && currentUser.branchName}
              fullName={currentUser && currentUser.fullName.name}
              onClick={(event) => {
                setPopoverOpen(true);
                setAnchorEl(event.currentTarget);
              }}
              isLoading={!currentUser}
            />
          </Grid>
          <Popover
            open={popoverOpen}
            anchorEl={anchorEl}
            onClose={() => {
              setPopoverOpen(false);
            }}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          >
            <Grid style={{ width: 220 }}>
              <List style={{ width: "100%" }}>
                {popupMenu &&
                  popupMenu.map((item, index) => (
                    <div key={index}>
                      <Button
                        onClick={() => {
                          switch (index) {
                            case 0:
                              props.history.push("/main/profile");
                              break;
                            case 1:
                              props.history.push("/main/settings");
                              break;
                            case 2:
                              memory.clearAll();
                              window.location = "/user/auth";
                              break;
                            default:
                              break;
                          }
                          setPopoverOpen(false);
                          setAnchorEl(undefined);
                        }}
                        fullWidth
                        style={{
                          paddingLeft: 20,
                          paddingRight: 20,
                          paddingTop: 10,
                          paddingBottom: 10,
                        }}
                      >
                        <Grid container direction="row" alignItems="center">
                          <Grid item xs={2}>
                            <Grid container alignItems="center">
                              {item.icon}
                            </Grid>
                          </Grid>
                          <Grid item xs={10} style={{ paddingLeft: 10 }}>
                            <Grid container justify="flex-start">
                              <Typography variant="h4" style={{ fontSize: 14 }}>
                                {item.title}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Button>
                      <Divider light />
                    </div>
                  ))}
              </List>
            </Grid>
          </Popover>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
      >
        <div className={classes.toolbarIcon}>
          <sub style={{ marginLeft: 15 }}>????????????: v{config.version} </sub>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List>
          <MainListItems currentOwner={currentOwner} isMainMenuOpen={open} />
        </List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Grid container className={classes.container}>
          <Grid item xs={12}>
            {props.children}
          </Grid>
        </Grid>
      </main>
    </div>
  );
};

export default withRouter(MaterialDrawer);
