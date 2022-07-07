import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {
    Grid, Chip, Button, Dialog,
    DialogTitle, DialogContent,
    DialogActions, List, ListItem,
    ListItemIcon, Checkbox, ListItemText, 
    Divider
} from '@material-ui/core';

const SphereChoose = props => {
    const [selected, setSelected] = useState([]);
    const [dialog, setDialog] = useState(false);
    const [tempSelected, setTempSelected] = useState([]);

    const activityType = useSelector(state => state.get('settings').activityTypeList);

    const clear = () => {
        setTempSelected([]);
        setSelected([]);
    }

    useEffect(() => {
        if (selected && selected.length === 0) {
            setSelected(props.activityList)
            setTempSelected(props.activityList || []);
        }
    }, [props.activityList])



    const renderItems = () => {
        let mappedSelection = (tempSelected || []).map(s => s.id)
        return (
            <List>
                {
                    activityType && activityType.map((type, index) => {
                        if (!type.parentId) {
                            return (
                                <div key={index}>
                                    <ListItem dense button>
                                        <ListItemIcon>
                                            <Checkbox
                                                id={type.id}
                                                color='primary'
                                                edge="start"
                                                disableRipple
                                                onChange={() => {
                                                    let temp = [...tempSelected];
                                                    let found = temp.find(t => t.id === type.id);
                                                    if (found) {
                                                        temp = temp.filter(t => t.id !== type.id && t.parentId !== type.id)
                                                    } else {
                                                        temp.push(type);
                                                        activityType.forEach(t => { if (t.parentId === type.id && mappedSelection.indexOf(t.id) < 0) { temp.push(t) } })
                                                    }
                                                    setTempSelected(temp);

                                                }}
                                                checked={mappedSelection.indexOf(type.id) >= 0}
                                            />
                                        </ListItemIcon>
                                        <ListItemText primary={type.name}/>
                                    </ListItem>
                                    <Divider light />
                                    {
                                        activityType.filter(i => i.parentId === type.id).map((subItem, subIndex) => {
                                            return (
                                                <div key={index*100+subIndex} style={{marginLeft: 25}}>
                                                    <ListItem dense button>
                                                        <ListItemIcon>
                                                            <Checkbox
                                                                id={subItem.id}
                                                                color='primary'
                                                                edge="start"
                                                                disableRipple
                                                                checked={mappedSelection.indexOf(subItem.id) >= 0}
                                                                onChange={() => {
                                                                    let temp = [...tempSelected];
                                                                    let found = temp.find(t => t.id === subItem.id);
                                                                    if (found) {
                                                                        let f = temp.find(t => t.parentId === subItem.parentId && t.id !== subItem.id);
                                                                        if (f) {
                                                                            temp = temp.filter(t => t.id !== subItem.id)
                                                                        } else {
                                                                            temp = temp.filter(t => t.id !== subItem.id && t.id !== subItem.parentId)
                                                                        }
                                                                    } else {
                                                                        temp.push(subItem);
                                                                        let found = temp.find(t => t.id === subItem.parentId);
                                                                        if (!found) {
                                                                            let p = activityType.find(t => t.id === subItem.parentId);
                                                                            temp.push(p)
                                                                        }
                                                                    }
                                                                    setTempSelected(temp);
                                                                }}
                                                            />
                                                        </ListItemIcon>
                                                        <ListItemText primary={subItem.name}/>
                                                    </ListItem>
                                                    <Divider light />
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            )
                        } else {
                            return false
                        }
                    })
                }
            </List>
        )
    }

    return (
        <Grid container direction='column'>
            <Dialog
                disableEscapeKeyDown
                fullWidth
                onClose={() => {
                    setDialog(false);
                    setTempSelected([...selected]);

                }}
                open={dialog}
            >
                <DialogTitle>Вид деятельности</DialogTitle>
                <DialogContent dividers>
                    {
                        renderItems()
                    }
                </DialogContent>
                <DialogActions>
                    <Button variant='text' color='primary' onClick={()  => {
                        setDialog(false);
                        setSelected([...tempSelected])
                        props.onActivityTypeSelected && props.onActivityTypeSelected([...tempSelected])

                    }}>OK</Button>
                    <Button variant='text' color='primary' onClick={() => {
                        setDialog(false);
                        setTempSelected([...selected]);
                    }}>CANCEL</Button>
                </DialogActions>
            </Dialog>
            <Grid container justify='center'>
                <Button color='primary' onClick={() => {
                    setDialog(true)
                }}>+ДОБАВИТЬ СФЕРУ ДЕЯТЕЛЬНОСТИ</Button>
            </Grid>
            <Grid container style={{marginTop: 6}}>
                <div style={{ width: '100%', marginTop: 10 }}>
                    {
                        selected && selected.map((item, index) => (
                                <Chip
                                    color='primary'
                                    key={index}
                                    variant='outlined'
                                    label={item.name}
                                    style={{marginLeft: 10}}
                                    onDelete={() => {
                                        let temp = [...selected];
                                        let type = temp[index];
                                        if (!type.parentId) {
                                            temp = temp.filter(t => t.id !== item.id && t.parentId !== item.id)
                                        } else {
                                            let found = temp.find(t => t.parentId === item.parentId && t.id !== item.id);
                                            if (found) {
                                                temp = temp.filter(t => t.id !== item.id)
                                            } else {
                                                temp = temp.filter(t => t.id !== item.id && t.id !== item.parentId)
                                            }
                                        }
                                        setSelected(temp);
                                        setTempSelected(temp)
                                        props.onActivityTypeSelected && props.onActivityTypeSelected(temp)
                                    }}
                                />
                            )
                        )
                    }
                </div>
            </Grid>
        </Grid>
    )
}



export default SphereChoose;
