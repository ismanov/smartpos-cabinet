import React, {useState} from 'react';
import {TextField, InputAdornment, IconButton} from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';


/**
 * @deprecated
 * use ../button.js
 */
const PasswordTextField = (props) => {
    const [visibility, setVisibility] = useState(false);
    return (<TextField 
        {...props}
        fullWidth
        variant="outlined"
        label={props.label || 'Пароль'} 
        type={visibility === true ? 'text' : 'password'}
        InputProps={{
            endAdornment: 
                <InputAdornment position="end">
                    <IconButton onClick={() => setVisibility(!visibility)}>
                        { visibility === true ? <Visibility/> : <VisibilityOff/>}                                                 
                    </IconButton>                                        
                </InputAdornment>
        }}
    />)
};

export default PasswordTextField;

