import React from 'react';
import {TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, Grid} from '@material-ui/core'
import ErrorText from '../../../components/sptext/error';

const ConfirmDialog = (props) => {
    return (
        <Dialog {...props} fullWidth>
            <DialogTitle>{props.title}</DialogTitle>
            <DialogContent style={{padding: 15}}>
                <Grid item xs={12}>
                    <ErrorText 
                        text={props.error}
                    />
                </Grid>
                <Grid item xs={12} style={{marginTop: 15}}>
                    <TextField
                        inputProps={{
                            maxLength: 6
                        }}
                        fullWidth
                        variant='outlined'
                        color='primary'
                        label='Код подтверждения'
                        onChange={props.onCodeChange}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField 
                        fullWidth
                        variant='outlined'
                        color='primary'
                        multiline={true}
                        rows={3}
                        label='Опишите причину удаления'
                        onChange={props.onReasonChange}
                        style={{marginTop: 15}}
                    />
                </Grid>                
            </DialogContent>
            <DialogActions>
                <Button variant='text' color='primary' onClick={props.confirm}>Подтвердить</Button>
                <Button variant='text' color='primary' onClick={props.cancel}>Отменить</Button>
            </DialogActions>
        </Dialog>
    )
};

export default ConfirmDialog;