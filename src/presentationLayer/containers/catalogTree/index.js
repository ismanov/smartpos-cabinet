import React, {useEffect, useState} from 'react';
import { ArrowRightOutlined, MoreVertOutlined } from "@material-ui/icons";
import {IconButton, Checkbox, Grid, Button, Divider, Popover, CircularProgress, Tooltip} from "@material-ui/core";
import cn from 'classnames';
import {useTranslation} from "react-i18next";
import {makeStyles} from "@material-ui/core/styles";

var collapsed = [];
var selectedItems = [];

const useStyles = makeStyles((theme) => ({
    wrapper: {
        height: '100%'
    },
    item: {
        height: 45,
        cursor: 'pointer',
        paddingLeft: 15,
        display: 'flex',
        alignItems: 'center',
        flexFlow: 'row',
        '&.selected': {
            fontStyle: 'italic',
            fontWeight: 'bold',
            color: theme.palette.primary.main
        },
        '&.usual': {
            fontStyle: 'normal',
            fontWeight: 200,
            color: '#555'
        }
    },
    arrowClosed: {
        transform: 'rotate(0deg)'
    },
    arrowOpened: {
        transform: 'rotate(90deg)'
    },
    title: {
        fontSize: 16,
        marginLeft: 10,
        flexGrow: 1
    },
    keywordSelect: {
        backgroundColor: 'yellowgreen'
    },
    productCount: {
        fontSize: 14,
        marginLeft: 10,
        color: '#555',
        marginRight: 15
    },
    divider: {
        height: 1,
        backgroundColor: '#eee'
    },
    collapseItem: {
        paddingLeft: 25,
        transition: 'height 200 ease',
        '-webkit-transition': 'height 200 ease',
        '-moz-transition': 'height 200 ease',
        '-o-transition': 'height 200 ease',
        overflow: "hidden",
    },
    hide: {
        display: "none"
    }
}))

const TreeView = props => {
    const [update, setUpdate] = useState(false);
    const { t } = useTranslation();
    const [anchorEl, setAnchorEl] = useState();
    const [menuOpen, setMenuOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState();
    const classes = useStyles();

    useEffect(() => {
        collapsed = [];
        selectedItems = [];
    }, [])

    if (props.isLoading) {
        return (
            <Grid container alignItems="center" justify="center" className={classes.wrapper} direction="row">
                <Grid item>
                    <CircularProgress variant='indeterminate' />
                </Grid>
                <Grid item style={{marginLeft: 20}}>
                    {t("myCatalog.loading")}
                </Grid>
            </Grid>
        )
    }

    if (!props.data || props.data.length === 0) {
        return (
            <Grid container className={classes.wrapper} alignItems="center" justify="center">
                {t("myCatalog.emptyList")}
            </Grid>
        )
    }

    const selectItem = (item) => {
        selectedItems.push(item.id);
        item.children && item.children.forEach(i => {
            if (selectedItems.indexOf(i.id) < 0) {
                selectedItems.push(i.id)
            }
            if (i.children && i.children.length !== 0) {
                selectItem(i)
            }
        })
    }

    const unselectItem = (item) => {
        selectedItems.splice(selectedItems.indexOf(item.id), 1);
        item.children && item.children.forEach(i => {
            if (selectedItems.indexOf(i.id) >= 0) {
                selectedItems.splice(selectedItems.indexOf(i.id), 1)
            }
            if (i.children && i.children.length !== 0) {
                unselectItem(i)
            }
        })
    }

    const isContainsTheKeyword = (category, keyword) => {
        if (category.name.toLowerCase().indexOf(keyword.toLowerCase()) >= 0) {
            return true
        }
        for (let i = 0; i < category.children.length; i++) {
            let child = category.children[i];
            if (
                child.name.toLowerCase().indexOf(keyword.toLowerCase()) >= 0 ||
                (child.children.length > 0 && isContainsTheKeyword(child, keyword))
            ) {
                return true
            }
        }
        return false
    }

    const filterCatalog = (catalog, keyword) => {
        if (catalog.length !== 0) {
            let result = [];
            catalog.forEach(item => {
                if (isContainsTheKeyword(item, keyword)) {
                    result.push(item)
                }
            });
            return result
        } else {
            return []
        }
    }

    const renderItems = (data) => {
        if (!data) return false;
        let c = window.location.search ? Number(window.location.search.split("=")[1]) : undefined;
        return data.map(item => {
            return (
                <div>
                    <div className={cn(classes.item, c === item.id ? 'selected' : 'usual')}>
                        {item.children && item.children.length !== 0  ? (
                            <IconButton
                                className={collapsed.indexOf(item.id) >= 0 ? classes.arrowOpened : classes.arrowClosed}
                                onClick={() => {
                                    if (collapsed.indexOf(item.id) >= 0) {
                                        collapsed.splice(collapsed.indexOf(item.id), 1)
                                    } else {
                                        collapsed.push(item.id)
                                    }
                                    setUpdate(!update);
                                }}
                            >
                                <ArrowRightOutlined />
                            </IconButton>
                        ) : (<div style={{width: 45}} />)}

                        <div className={!props.checkbox ? classes.hide : undefined} style={{marginLeft: 2}}>
                            <Checkbox
                                color='primary'
                                onChange={() => {
                                    if (selectedItems.indexOf(item.id) < 0) {
                                        selectItem(item)
                                    } else {
                                        unselectItem(item)
                                    }
                                    setUpdate(!update)
                                    props.onSelected && props.onSelected(selectedItems);

                                }}
                                checked={selectedItems.indexOf(item.id) >= 0}
                            />
                        </div>

                        <div
                            className={cn(
                                classes.title,
                                props.keyword && item.name.toLowerCase().indexOf(props.keyword.toLowerCase()) >= 0 ? classes.keywordSelect : undefined
                            )}
                            onClick={() => {
                                if (!props.itemClickable) return;
                                props.onItemClicked && props.onItemClicked(item)
                            }}
                        > {item.name} </div>
                        {
                            props.showProductCount ? (
                                <div className={classes.productCount}>
                                    {item.productCount} {t("units.pcs")}.
                                </div>
                            ) : undefined
                        }
                        {
                            props.options ? (
                                <div style={{marginRight: 15}}>
                                    <Tooltip title={t("common.operations")}>
                                        <IconButton onClick={event => {
                                            setAnchorEl(event.currentTarget);
                                            setMenuOpen(true);
                                            setSelectedItem(item)
                                        }}>
                                            <MoreVertOutlined />
                                        </IconButton>
                                    </Tooltip>

                                </div>
                            ) : undefined
                        }
                    </div>
                    <div className={classes.divider} />
                    {
                        item.children ? (
                            <div
                                className={cn(classes.collapseItem)}
                                style={{
                                    height: collapsed.indexOf(item.id) >= 0 ? 'auto' : 0
                                }}
                            >
                                { renderItems(item.children) }
                            </div>
                        ) : undefined
                    }
                </div>
            )
        })
    }

    return (
        <div className={classes.wrapper}>
            <Popover
                id='popup'
                anchorEl={anchorEl}
                open={Boolean(anchorEl) && menuOpen === true}
                keepMounted
                onClose={() => {
                    setMenuOpen(false);
                    setAnchorEl(undefined);
                }}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <Grid container style={{
                    width: 220,
                    padding: '20px, 0',
                    backgroundColor: '#fff'
                }} direction='column'>
                    {
                        props.options && props.options.map((item, index) => {
                            return (
                                <Grid key={index} container direction='column'>
                                    <Grid item style={{width: '100%'}}>
                                        <Button variant='text' fullWidth style={{height: 45, fontSize: 14}}
                                                onClick={() => {
                                                    props.onOperationClick && props.onOperationClick({item: selectedItem, index})
                                                    setAnchorEl(undefined);
                                                    setMenuOpen(false);
                                                    setSelectedItem(undefined);
                                                }}
                                        >{item}</Button>
                                    </Grid>
                                    <Divider light={true} variant='fullWidth' />
                                </Grid>
                            )
                        })
                    }
                </Grid>
            </Popover>
            <Grid container>
                <Grid item xs={12}>
                    {renderItems(filterCatalog(props.data, props.keyword))}
                </Grid>
            </Grid>
        </div>
    )
}

export default TreeView;
