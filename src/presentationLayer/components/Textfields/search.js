import React, {useState} from 'react';
import {TextField, IconButton} from '@material-ui/core';
import {SearchOutlined} from '@material-ui/icons';
import Tooltip from '@material-ui/core/Tooltip';


/**
 * @deprecated
 * use ../button.js
 */
const SearchTextField = (props) => {
    const [text, setText] = useState(undefined)
    return <TextField
        {...props}
        value={props.value !== undefined ? props.value : text}
        fullWidth
        placeholder={props.label || 'Поиск'}
        onChange={event => {
            setText(event.target.value);
            props.onChange && props.onChange(event.target.value)
        }}
        label={props.label || 'Поиск'}
        variant='outlined'
        InputProps={{
            startAdornment: (
                <Tooltip arrow title={props.tooltipTitle || 'Поиск'}>
                    <IconButton onClick={() => props.onSearch && props.onSearch(text)}>
                        <SearchOutlined color='primary'/>
                    </IconButton>
                </Tooltip>
            )
        }}
        onKeyPress={event => {
            if (event.key === 'Enter') {
                props.onSearch && props.onSearch(text)
            }
        }}
    />
};

export default SearchTextField;
