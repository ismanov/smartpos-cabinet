import React from 'react';
import {Grid, Typography, Button} from '@material-ui/core';

const DetailSection = (props) => {
    let { header, footer } = props;    
    return (
        <Grid container style={{
            ...props.style,
            border: '1px solid #eee',
            padding: 10,
            display: 'flex'
        }}
        direction='column'>
            <Grid container direction='row' style={{
                display: header && header.disabled && header.disabled === true ? 'none' : 'flex',
                marginLeft: 10
            }}>
                <Grid item style={{flex: 1}}>
                    <Typography variant='h4' style={{fontSize: 18, color: '#555', fontWeight: 'bold'}}>
                        {header ? header.title || '' : ''}
                    </Typography>
                </Grid>
                <Grid item>
                    <Button color='primary' onClick={props.headerClick}>
                        {header ? header.buttonTitle || '' : ''}
                    </Button>
                </Grid>
            </Grid>
            <Grid container xs={12} style={{marginTop: 10, overflow: 'auto'}}>
                {props.children}
            </Grid>
            <Grid container justify='flex-end' style={{marginTop: 10, display: footer && footer.disabled && footer.disabled === true ? 'none' : 'flex'}}>
                <Grid item style={{marginTop: 10}}>
                    <Button color='primary' onClick={props.footerClick} style={{fontSize: 12}}>{footer ? footer.title || '' : ''}</Button>
                </Grid>
            </Grid>
        </Grid>
    )
};

export const Row = (props) => {
    return (
        <div style={{ display: 'flex', flexFlow: 'column', marginLeft: 20, marginTop: 8, ...props.style }}>
            <Typography variant='h4' style={{fontSize: 13, color: '#AAA'}}>{props.title}</Typography>
            <Typography variant='h4' style={{fontSize: 16, color: '#666', marginTop: 4}}>{props.value}</Typography>
        </div>
    )
}

export const PairRow = (props) => {
    return (
        <div style={{...props.style, marginTop: 10, marginLeft: 20, flexFlow: 'row', display: 'flex', ...props.style}}>
            <div style={{flexGrow: 1, flexFlow: 'column'}}>
                <Typography variant='h4' style={{fontSize: 13, color: '#AAA'}}>{props.title}</Typography>
                <Typography variant='h4' style={{fontSize: 16, color: '#666', marginTop: 4}}>{props.value}</Typography>
            </div>
            <div style={{padding: '0 20px'}}>
                <Button color='primary' onClick={props.rowAction} style={{fontSize: 14}}>{props.actionTitle || ''}</Button>
            </div>
        </div>
    )
}

export default DetailSection;