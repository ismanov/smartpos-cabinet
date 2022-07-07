import React from 'react';
import {Grid} from '@material-ui/core';
import styles from './style.scss';

/**
 * @deprecated
 * use ../button.js
 */
const CenteredContentPage = (props) => {
    return (
        <Grid className={styles.container} {...props} container justify='center' alignItems='center' style={{paddingTop: '15vh', ...props.style}}>
            <Grid item xs={10} xl={3} md={5}>
                {props.children}
            </Grid>
        </Grid>        
    )
}
export default CenteredContentPage;
