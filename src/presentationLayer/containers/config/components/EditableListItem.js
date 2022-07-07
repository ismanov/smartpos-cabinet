import React from 'react';
import {
    ListItem,
    ListItemText,
    IconButton,
    ListItemSecondaryAction
} from '@material-ui/core';
import {
    DeleteOutline,
    EditOutlined
} from '@material-ui/icons'

const EditableListItem = (props) => {
    return (
        <ListItem {...props}>
            <ListItemText>
                {props.children}
            </ListItemText>
            <ListItemSecondaryAction>
                <IconButton edge="end" color='inherit' style={{color: '#DC4848', display: `${props.disableRemove === true ? 'none' : 'inline-block'}`}} onClick={() => props.onRemove && props.onRemove(props.value)}>
                    <DeleteOutline />
                </IconButton>
                <IconButton edge="end" color='inherit' style={{color: '#009F3C', display: `${props.disableEdit === true ? 'none' : ''}`}} onClick={() => props.onEdit && props.onEdit(props.value)}>
                    <EditOutlined />
                </IconButton>
            </ListItemSecondaryAction>
        </ListItem>
    )
}

export default EditableListItem;