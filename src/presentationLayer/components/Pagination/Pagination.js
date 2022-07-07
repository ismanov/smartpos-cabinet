import React, {useState, useEffect} from 'react';
import {Grid, Typography, IconButton} from '@material-ui/core';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons';
import styles from './Pagination.module.scss';
import TextButton from "../Buttons/text";
import SelectBox from "../SelectBox";


/**
 * @deprecated
 * use ../button.js
 */
const Pagination = (props) => {

    let [current, setCurrent] = useState(0);
    let [inputPage, setInputPage] = useState(0);
    let [size, setSize] = useState(20);
    let content = [];

    useEffect(() => {
        if (props.current !== undefined && props.current >= 0) {
            setCurrent(props.current);
            setInputPage(props.current+1);
        }
    }, [props.current]);

    useEffect(() => {
        setSize(props.size || 0)
    }, [props.size]);

    content.push(
        <Grid item>
            <IconButton color='primary' disabled={current === 0 || props.disabled} onClick={() => {
                setCurrent(current-1);
                setInputPage(current);
                props.onPageChange && props.onPageChange(current-1);
            }}>
                <KeyboardArrowLeft />
            </IconButton>
        </Grid>
    );

    if (!props.pagesCount) return false;

    if ((props.pagesCount || 0) <= 7) {
        for(let i = 0; i < (props.pagesCount || 0); i++) {
            content.push(
                <Grid  item>
                    <IconButton disabled={props.disabled} style={{marginLeft: 5}} onClick={() => {
                            setCurrent(i);
                            setInputPage(i+1);
                            props.onPageChange && props.onPageChange(i)
                        }}>
                        <Typography variant='h4' color='inherit' style={{
                            fontSize: 16,
                            color: current === i ? '#009f3c' : '#555'
                        }}>{i+1}</Typography>
                    </IconButton>
                </Grid>
            )
        }
    } else {
        if (current-4 >= 0 && current + 4 < props.pagesCount) {
            for (let i = current-3; i <= current+1; i++) {
                content.push(
                    <Grid  item>
                        <IconButton disabled={props.disabled} style={{marginLeft: 5}} onClick={() => {
                                setCurrent(i);
                                setInputPage(i+1);
                                props.onPageChange && props.onPageChange(i)
                            }}>
                            <Typography variant='h4' color='inherit' style={{
                                fontSize: 16,
                                color: current === i ? '#009f3c' : '#555'
                            }}>{i+1}</Typography>
                        </IconButton>
                    </Grid>
                )
            }
            content.push(
                <Grid  item>
                    <Typography variant='h4' color='inherit' style={{
                        fontSize: 16,
                        color: '#555'
                    }}> .... </Typography>
                </Grid>
            );
            content.push(
                <Grid  item>
                    <IconButton disabled={props.disabled} style={{marginLeft: 5}} onClick={() => {
                            setCurrent(props.pagesCount-1);
                            setInputPage(props.pagesCount);
                            props.onPageChange && props.onPageChange(props.pagesCount-1)
                        }}>
                        <Typography variant='h4' color='inherit' style={{
                            fontSize: 16,
                            color: '#555'
                        }}>{props.pagesCount-1}</Typography>
                    </IconButton>
                </Grid>
            )
        } else if (current-4 < 0) {
            for (let i = 0; i < 4; i++) {
                content.push(
                    <Grid  item>
                        <IconButton disabled={props.disabled} style={{marginLeft: 5}} onClick={() => {
                                setCurrent(i);
                                setInputPage(i+1);
                                props.onPageChange && props.onPageChange(i);
                            }}>
                            <Typography variant='h4' color='inherit' style={{
                                fontSize: 16,
                                color: current === i ? '#009f3c' : '#555'
                            }}>{i+1}</Typography>
                        </IconButton>
                    </Grid>
                )
            }
            if (current === 3) {
                content.push(
                    <Grid  item>
                        <IconButton disabled={props.disabled} style={{marginLeft: 5}} onClick={() => {
                                setCurrent(4);
                                setInputPage(5);
                                props.onPageChange && props.onPageChange(4);
                            }}>
                            <Typography variant='h4' color='inherit' style={{
                                fontSize: 16,
                                color: '#555'
                            }}>5</Typography>
                        </IconButton>
                    </Grid>
                )
            }
            content.push(
                <Grid  item>
                    <Typography variant='h4' color='inherit' style={{
                        fontSize: 16,
                        color: '#555'
                    }}> .... </Typography>
                </Grid>
            );
            content.push(
                <Grid  item>
                    <IconButton disabled={props.disabled} style={{marginLeft: 5}} onClick={() => {
                            setCurrent(props.pagesCount-1);
                            setInputPage(props.pagesCount);
                            props.onPageChange && props.onPageChange(props.pagesCount-1);
                        }}>
                        <Typography variant='h4' color='inherit' style={{
                            fontSize: 16,
                            color: '#555'
                        }}>{props.pagesCount}</Typography>
                    </IconButton>
                </Grid>
            )
        } else if(current + 4 >= props.pagesCount) {
            content.push(
                <Grid  item>
                    <IconButton disabled={props.disabled} style={{marginLeft: 5}} onClick={() => {
                            setCurrent(0);
                            setInputPage(1);
                            props.onPageChange && props.onPageChange(0);
                        }}>
                        <Typography variant='h4' color='inherit' style={{
                            fontSize: 16,
                            color: '#555'
                        }}>1</Typography>
                    </IconButton>
                </Grid>
            );
            content.push(
                <Grid  item>
                    <Typography variant='h4' color='inherit' style={{
                        fontSize: 16,
                        color: '#555'
                    }}> .... </Typography>
                </Grid>
            );
            for (let i = props.pagesCount-5; i < props.pagesCount; i++) {
                content.push(
                    <Grid  item>
                        <IconButton disabled={props.disabled} style={{marginLeft: 5}} onClick={() => {
                                setCurrent(i);
                                setInputPage(i+1);
                                props.onPageChange && props.onPageChange(i);
                            }}>
                            <Typography variant='h4' color='inherit' style={{
                                fontSize: 16,
                                color: current === i ? '#009f3c' : '#555'
                            }}>{i+1}</Typography>
                        </IconButton>
                    </Grid>
                )
            }
        }
    }

    content.push(
        <Grid item style={{display: props.pagesCount === 0 ? 'none' : 'flex'}}>
            <IconButton style={{marginLeft: 5}} color='primary' disabled={current === (props.pagesCount-1) || props.disabled} onClick={() => {
                setCurrent(current+1);
                setInputPage(current+2);
                props.onPageChange && props.onPageChange(current+1);
            }}>
                <KeyboardArrowRight />
            </IconButton>
        </Grid>
    );
    return (
        <Grid
            container
            alignItems='center'
            style={{...props.style, height: 30, color: '#009f3c', visibility: props.pagesCount === 0 ? 'hidden' : 'visible'}}
            direction='row'>
            {content}
            {
                props.pagesCount >= 10 ? (
                    <div className={`${styles.go_to_page} fast-change-page`}>
                        <input
                            className={styles.small_input}
                            value={inputPage}
                            onChange={e => {
                                let page = parseInt(e.target.value);
                                page = isNaN(page) ? 1 : page;
                                page = page < 1 ? 1 : page;
                                page = page > props.pagesCount ? props.pagesCount : page;
                                setInputPage(page);
                            }}
                        />
                        <TextButton
                            title="Перейти"
                            style={{marginLeft: 10}}
                            onClick={() => {
                                setCurrent(inputPage-1);
                                setInputPage(inputPage);
                                props.onPageChange && props.onPageChange(inputPage-1);
                            }}
                        />

                    </div>
                ) : undefined
            }
            <div className="page-size-change" style={{width: 150}}>
                <SelectBox
                    style={{height: 35, fontSize: 13, border: 'none', marginLeft: 10}}
                    data={[
                        {
                            key: 20,
                            value: '20 стр'
                        },
                        {
                            key: 50,
                            value: '50 стр'
                        },
                        {
                            key: 100,
                            value: '100 стр'
                        }
                    ]}                    
                    itemKey="key"
                    itemValue="value"
                    value={size}
                    onChange={(e) => {
                        setSize(e.target.value);
                        props.onSizeChange && props.onSizeChange(e.target.value);
                    }}
                />
            </div>

        </Grid>
    )
};

export default Pagination;
