import React, {useEffect, useMemo, useState} from 'react';
import produce from "immer";
import {
    List, Checkbox, ListItem,
    ListItemText, Collapse, ListItemIcon,
    ListItemAvatar, Button, ListItemSecondaryAction,
    IconButton, CircularProgress, Paper,
    makeStyles, Grid
} from '@material-ui/core';
import {ArrowRightOutlined} from '@material-ui/icons';
import {useDispatch, useSelector} from 'react-redux';
import {FolderOutlined} from '@material-ui/icons';
import cn from 'classnames';
import BranchList from '../../components/branchList';
import withNotification from "../../../hocs/withNotification/WithNotification";
import SaveIcon from '@material-ui/icons/Save';
import Tooltip from '@material-ui/core/Tooltip';
import {useTranslation} from "react-i18next";
import {fetchCatalogList, saveSingleCategory, setBranchId,} from "./actions";

const useStyles = makeStyles(() => ({
    container: {
        paddingTop: 20
    },
    title: {
        fontWeight: 'bold',
        fontSize: 18,
        marginTop: 20
    },
    filter: {
        marginTop: 15
    },
    content: {
        padding: 20,
        width: '100%'
    },
    productCount: {
        fontWeight: 'bold',
        fontSize: 15,
        fontStyle: 'italic'
    },
    avatar: {
        display: 'flex',
        flexFlow: 'row',
        alignItems: 'center'
    },
    arrow: {
        transform: 'rotate(0deg)',
        width: 56,
        height: 56,
        display: 'flex',
        alignItems: 'center'
    },
    opened: {
        transform: 'rotate(90deg)'
    }
}))

const SingleCatalog = props => {

    const dispatch = useDispatch();
    const isLoading = useSelector(state => state.get("single").isLoading);
    const catalogList = useSelector(state => state.get("single").catalogList);
    const branchId = useSelector(state => state.get("single").branchId);
    const { t } = useTranslation();
    const [collapsed, setCollapsed] = useState([]);
    const [checkedList, setCheckedList] = useState([]);
    const classes = useStyles();

    useEffect(() => {
        if (branchId >= 0) { dispatch(fetchCatalogList(branchId)) }
    }, [branchId]);

    useEffect(() => {
        let ch = [];
        let initCheckBox = (list) => {
            for (let c of list) {
                if (c.enabled) {
                    ch.push(c.id);
                }
                if (c.children && c.children.length) {
                    initCheckBox(c.children);
                }
            }
        };
        initCheckBox(catalogList);
        setCheckedList(ch);
    }, [catalogList]);

    const onItemClick = (item) => {
        let c = [...collapsed];
        if (c.indexOf(item.id) >= 0) {
            c.splice(c.indexOf(item.id), 1);
        } else {
            c.push(item.id);
        }
        setCollapsed(c);
    };

    const renderItems = (catalog, t) => {
        if (catalog && catalog.length !== 0) {
            return catalog.map((item, index) => {
                return (
                    <div key={index} style={{width: '100%'}}>
                        <ListItem style={{cursor: 'pointer'}}>
                            <ListItemAvatar>
                                <div className={classes.avatar}>
                                    <div className={cn(classes.arrow, collapsed.indexOf(item.id) >= 0 ? classes.opened : undefined)}>
                                        {item.children && item.children.length !== 0 ? (
                                            <IconButton onClick={() => onItemClick(item)}>
                                                <ArrowRightOutlined/>
                                            </IconButton>
                                        ) : undefined}
                                    </div>
                                    <Checkbox
                                        color='primary'
                                        checked={checkedList.indexOf(item.id) >= 0}

                                        onChange={(event, checked) => {
                                            let c = [...checkedList];
                                            if (checked) {
                                                c.push(item.id);
                                            } else {
                                                c.splice(c.indexOf(item.id), 1);
                                            }
                                            const checkItem = (i) => {
                                                if (checked) {
                                                    c.push(i.id);
                                                } else {
                                                    c.splice(c.indexOf(i.id), 1);
                                                }
                                                // i.enabled = checked;
                                                i.children && i.children.forEach(k => {
                                                    if (checked) {
                                                        c.push(k.id);
                                                    } else {
                                                        c.splice(c.indexOf(k.id), 1);
                                                    }
                                                    // k.enabled = checked;
                                                    if (k.children && k.children.length !== 0) {
                                                        checkItem(k)
                                                    }
                                                })
                                            };
                                            checkItem(item);
                                            setCheckedList(c);
                                        }}
                                    />
                                </div>

                            </ListItemAvatar>
                            <ListItemIcon onClick={() => onItemClick(item)}>
                                <FolderOutlined color='inherit' style={{color: '#009F3C', marginLeft: 15}}/>
                            </ListItemIcon>
                            <ListItemText style={{color: '#555'}}
                                          onClick={() => onItemClick(item)}> {item.name} </ListItemText>
                            <ListItemSecondaryAction>
                                <div className={classes.productCount}>{item.productCount} {t("units.pcs")}</div>
                            </ListItemSecondaryAction>
                        </ListItem>
                        {
                            item.children && item.children.length !== 0 ? (
                                <Collapse in={collapsed.indexOf(item.id) >= 0} style={{paddingLeft: 20}} addEndListener={() => {}}>
                                    {
                                        renderItems(item.children, t)
                                    }
                                </Collapse>
                            ) : undefined
                        }
                    </div>
                )
            })
        }
    };

    return (
        <Grid container className={classes.container}>
            <Grid container className={classes.title}> {t("single.title")} </Grid>
            <Grid container direction="row">

            </Grid>
            <Grid container className={classes.filter}>
                <Grid item xs={2}>
                    <BranchList
                        skipAllBranch={true}
                        value={branchId}
                        onChange={branchId => {
                            dispatch(setBranchId(branchId));                            
                        }}
                    />
                </Grid>
                <Grid item xs={10}>
                    <Grid container justify="flex-end" style={{alignItems: 'center'}}>
                        {isLoading ? (
                            <Grid item>
                                <CircularProgress color='primary'/>
                            </Grid>
                        ) : undefined}
                        <Grid item style={{marginLeft: 10}}>
                            <Tooltip title={t("common.save")} arrow placement={'bottom'}>
                                <Button color='primary'
                                        variant='outlined'
                                        disabled={isLoading}
                                        style={{height: 50}}
                                        onClick={() => {
                                            let catList = produce(catalogList, draftCatalogList => {
                                                const setCheckbox = (list) => {
                                                    for (let c of list) {
                                                        c.enabled = checkedList.indexOf(c.id) >= 0;
                                                        c.children && c.children.forEach(k => {
                                                            k.enabled = checkedList.indexOf(k.id) >= 0;
                                                            if (k.children && k.children.length !== 0) {
                                                                setCheckbox(k.children)
                                                            }
                                                        })
                                                    }
                                                };
                                                setCheckbox(draftCatalogList);
                                            });
                                            dispatch(saveSingleCategory(catList, branchId));
                                            props.success(t("single.success_message"))
                                        }}
                                > <SaveIcon/> </Button>
                            </Tooltip>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Grid container style={{marginTop: 20}}>
                <Paper className={classes.content}>
                    { branchId >= 0 ? (
                        <List>
                            {renderItems(catalogList, t)}
                        </List>
                    ) : (
                        <Grid container alignItems='center' justify='center'>
                            <Grid item> {t("transferAddEdit.select_branch")} </Grid>
                        </Grid>
                    )}
                </Paper>
            </Grid>

        </Grid>
    )
};

export default withNotification(SingleCatalog);
