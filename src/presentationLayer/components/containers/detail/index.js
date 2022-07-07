import React from 'react';
import styles from './Detail.module.scss';
import { Button } from '@material-ui/core';

/**
 * @deprecated
 * use ../button.js
 */
export default (props) => (
    <div className={styles.wrapper} style={{...props.style}}>
        <div className={styles.header}>
            <div className={styles.title}>
                {props.header.title}
            </div>
            <Button
                color='primary'
                className={styles.button}
                style={{
                    display: props.header && props.header.buttonTitle ? 'block' : 'none'
                }}
                onClick={() => props.headerClick && props.headerClick()}

            >
                {props.header.buttonTitle}
            </Button>
        </div>
        <div className={styles.content} style={{
            height: `calc(100% - 20px - ${props.header && props.header.title ? 30 : 0}px - ${props.footer && props.footer.buttonTitle ? 50 : 0}px)`
        }}>
            {props.children}
        </div>
        <div className={styles.footer} style={{display: props.footer && props.footer.buttonTitle ? 'block': 'none'}}>
            <div className={styles.content}>
                <Button color='primary' onClick={() => props.footerClick && props.footerClick()}>
                    {props.footer && props.footer.buttonTitle}
                </Button>
            </div>
        </div>
    </div>
);