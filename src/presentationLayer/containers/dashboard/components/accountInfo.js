import React from 'react';
import { Grid, Typography, Hidden } from '@material-ui/core';
import {
    PersonOutlineRounded,
    ExpandMoreOutlined,
} from '@material-ui/icons';


class AccountInfo extends React.Component {

    render() {
        return (
            <div
                {...this.props}
                style={{
                    marginTop: 10,
                    marginBottom: 10,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    flexFlow: 'row'

                }}>

                <Grid item xs={3}>
                    <Grid container justify='center' alignItems='center' style={{width: 50, height: 50, border: '1px solid #aaa', borderRadius: '1000px'}}>
                        {
                            this.props.avatar || <PersonOutlineRounded color='inherit' style={{color: '#aaa'}}/>
                        }
                    </Grid>

                </Grid>
                <Hidden smDown>
                    <Grid item xs={8} style={{paddingLeft: 10, paddingRight: 10, overflowX: 'hidden'}}>
                        {
                            this.props.isLoading === false ? (
                                <Grid container direction='column'>
                                    <Grid item>
                                        <Typography variant='caption' noWrap style={{fontSize: 13, color: '#555'}}>{this.props.fullName || 'Неизвестно'}</Typography>
                                    </Grid>
                                    <Grid item style={{marginTop: 3}}>
                                        <Typography variant='caption' noWrap style={{fontSize: 12, color: '#555', fontWeight: 'bold'}}>{this.props.companyName || 'Неизвестно'}</Typography>
                                    </Grid>
                                </Grid>
                            ) : (
                                <Grid container direction='column'>
                                    <Typography variant='caption' noWrap style={{fontSize: 13, color: '#555'}}>Загружается...</Typography>
                                </Grid>
                            )
                        }

                    </Grid>
                    <Grid item xs={1}>
                        <ExpandMoreOutlined color='primary' style={{width: 25, height: 20}}/>
                    </Grid>
                </Hidden>
            </div>

        )
    }
}

export default AccountInfo;
