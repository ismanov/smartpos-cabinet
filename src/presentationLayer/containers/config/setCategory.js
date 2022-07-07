import React, {useEffect, useState} from 'react';
import {
    Grid, 
    Typography, 
    List, 
    ListItem, 
    ListItemIcon, 
    ListItemText, 
    ListItemSecondaryAction,
    Collapse,
    Divider,
    IconButton,
    Checkbox,
    CircularProgress
} from  '@material-ui/core';

import { ExpandLess, ExpandMore } from '@material-ui/icons';
import {useDispatch, useSelector} from 'react-redux';
import {fetchCatalogList, saveCategories} from "./actions";


const SetCategory = () => {

    const [update, setUpdate] = useState(true);
    const dispatch = useDispatch();
    const catalogList = useSelector(state => state.get('config').catalogList);
    const isLoading = useSelector(state => state.get('config').isLoading);

    useEffect(() => {
        dispatch(fetchCatalogList())
    }, []);


    const renderItems = (item, index) => {
        return (
            <div>
                <ListItem key={index} button onClick={() => {

                    const checkItem = (temp, checked) => {
                        temp.enabled = checked
                        if (temp.children.length !== 0) {
                            temp.children.forEach(item => checkItem(item, temp.enabled))
                        }
                    }
                    checkItem(item, !item.enabled)
                    setUpdate(!update);
                }}
                          style={{
                              color: '#555'
                          }}>
                    <ListItemIcon>
                        <Checkbox color='primary' checked={item.enabled}/>
                    </ListItemIcon>
                    <ListItemText primary={item.name}/>
                    <ListItemSecondaryAction>
                        <IconButton disableTouchRipple disableFocusRipple>
                            <Typography variant='h4' style={{fontSize: 14}}>
                                {item.productCount}
                            </Typography>
                        </IconButton>
                        <IconButton disableTouchRipple onClick={() => {
                            item.collapsed = !item.collapsed
                            setUpdate(!update);
                        }}>
                            {item.children && item.children.length === 0 ? '' : item.collapsed === true ? (<ExpandLess />) : (<ExpandMore />) }
                        </IconButton>
                    </ListItemSecondaryAction>
                </ListItem>
                <Divider />
                {
                    item.children && item.children.length !== 0 && item.children.map((i, n) => {
                        return (
                            <Collapse key={n} in={item.collapsed} unmountOnExit style={{marginLeft: 20}}>
                                <div style={{marginLeft: 20}}>
                                    {renderItems(i, n)}
                                </div>
                            </Collapse>
                        )
                    })
                }
            </div>
        )
    }

    const saveCategoryList = () => {
        dispatch(saveCategories(catalogList))
    }

    return(
        <Grid containe>
            <Grid container justify="center" style={{marginTop: 20}}>
                <Grid item>
                    <Typography variant='h4' style={{fontSize: 17}}> Каталог товаров </Typography>
                </Grid>
            </Grid>
            <Grid container style={{marginTop: 20}}>
                <List style={{width: '100%'}} disablePadding>
                    { catalogList.map((item, index) => renderItems(item, index)) }
                </List>
            </Grid>
            <Grid container justify="center" direction="row" alignItems="center" style={{
                display: isLoading ? 'flex' : 'none',
                marginTop: 20
            }}>
                <Grid item>
                    <CircularProgress variant='indeterminate'/>
                </Grid>
                <Grid item style={{paddingLeft: 10}}>
                    <Typography variant='overline' style={{fontSize: 16, marginRight: 12}}> Загрузка...</Typography>
                </Grid>
            </Grid>
        </Grid>
    )
}

export default SetCategory;