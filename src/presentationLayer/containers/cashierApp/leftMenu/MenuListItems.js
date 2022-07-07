import React, {Fragment, useState, useEffect} from "react";
import {useTranslation} from "react-i18next";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from "@material-ui/core/Collapse";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import {Link} from "react-router-dom";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Tooltip from '@material-ui/core/Tooltip';
import Menu from '@material-ui/core/Menu';
import MenuList from './leftMenuList';

import {withRouter} from 'react-router-dom'

const useStyles = makeStyles(theme => ({
    listLinks: {
        display: "inherit",
        textDecoration: "none",
        color: "rgba(0, 0, 0, 0.87)",
        transition: 'balance 0.3s ease',
        "&:hover,&:focus": {
            color: theme.palette.primary.main
        }
    },
    currentCat: {
        color: theme.palette.primary.main
    }
}));

let menus;

const MainListItems = ({currentOwner, isMainMenuOpen, match}) => {
    useEffect(() => {
        if (!isMainMenuOpen) {
            setOpen('');
        }
    }, [isMainMenuOpen]);
    const classes = useStyles();
    const [open, setOpen] = useState('');
    const [menuOpen, setMenuOpen] = useState('');
    const [anchorEl, setAnchorEl] = React.useState(null);
    const handleClick = (id) => {
        setOpen(id === open ? '' : id);
    };
    const handleMenuOpen = (id) => {
        setMenuOpen(id);
    };
    const handleMenuClose = () => {
        setMenuOpen('');
    };
    const { t } = useTranslation();

    useEffect(() => {
        handleMenuClose();
    }, [match]);

    useEffect(() => {
        menus = MenuList(t);
    }, []);

    return (
        <Fragment>
            {
                menus && menus.filter(i => {
                    if (currentOwner && currentOwner.warehouseEnabled) {
                        return true
                    } else {
                        return i.id !== 2
                    }
                }).map((item, index) => {
                    return (item.menus && item.menus.length > 0 ? (
                        <div key={index}>
                            <ListItem aria-controls={`hidden-menu-${item.id}`} aria-haspopup="true" button
                                      style={{position: 'relative'}}
                                      onClick={(event) => {
                                          if (isMainMenuOpen) {
                                              handleClick(item.id);
                                          } else {
                                              setAnchorEl(event.currentTarget);
                                              handleMenuOpen(item.id);
                                          }
                                      }} className={open === item.id ? classes.currentCat : null}>
                                {isMainMenuOpen ? (
                                    <ListItemIcon>
                                        <item.icon/>
                                    </ListItemIcon>
                                ) : (
                                    <Tooltip title={item.categoryName} placement={'right'} arrow disabled>
                                        <ListItemIcon>
                                            <item.icon/>
                                        </ListItemIcon>
                                    </Tooltip>
                                )}
                                <ListItemText primary={item.categoryName}/>
                                {open === item.id ? <ExpandLess/> : <ExpandMore/>}
                            </ListItem>
                            <Menu
                                id={`hidden-menu-${item.id}`}
                                anchorEl={anchorEl}
                                keepMounted
                                open={menuOpen === item.id}
                                onClose={handleMenuClose}
                            >
                                {item.menus.map((hiddenItem, ind) => {
                                    return (
                                        <Link to={hiddenItem.to} className={classes.listLinks}
                                              key={`hidden-item-${ind}`}>
                                            <ListItem button className={classes.nested}>
                                                <ListItemText primary={hiddenItem.name}/>
                                            </ListItem>
                                        </Link>
                                    )
                                })}
                            </Menu>

                            <Collapse in={open === item.id} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    {item.menus.map((menuItem, itemIndex) => {
                                        return (
                                            <Link to={menuItem.to} className={classes.listLinks}
                                                  key={`menuItem-${itemIndex}`}>
                                                <ListItem button className={classes.nested}>

                                                    <ListItemText primary={menuItem.name} style={{color: menuItem.to.indexOf(location.pathname) >= 0 ? "#009f3c" : '#666'}}/>
                                                </ListItem>
                                            </Link>
                                        )
                                    })}
                                </List>
                            </Collapse>

                        </div>
                    ) : (
                        <Link to={item.to} className={classes.listLinks} key={index}>
                            <ListItem button>
                                <ListItemIcon>
                                    <img src={item.icon} alt=""/>
                                </ListItemIcon>
                                <ListItemText primary={item.categoryName}/>
                            </ListItem>
                        </Link>
                    ))
                })
            }
        </Fragment>
    );
};
export default withRouter(MainListItems);
