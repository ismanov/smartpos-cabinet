import React, {useEffect, useReducer} from 'react';
import {Grid, IconButton} from '@material-ui/core';
import RangePicker from "#components/Pickers/daterange";
import moment from "moment";
import {defineGranularity} from "#utils/format";
import {BarChart, ShowChart} from "@material-ui/icons";
import { setDashboardDate,  setDashboardMode } from '../action';
import { fetchSalesStats, fetchSalesDynamics, fetchTopProducts, fetchTopEmployees } from '../action';


import {withRouter} from 'react-router-dom';
import {useDispatch, useSelector} from "react-redux";

export default withRouter(() => {

    const currentBranch = useSelector(state => state.get('dashboard').currentBranch);
    const date = useSelector(state => state.get('main').date);
    const mode = useSelector(state => state.get('main').mode);
    const dispatch = useDispatch();

    const updateList = () => {
        dispatch(fetchSalesStats({
            branchId: currentBranch,
            from: date.startDate,
            to: date.endDate,
            granularity: defineGranularity({from: new Date(date.startDate), to: new Date(date.endDate)})
        }));
        dispatch(fetchSalesDynamics({
            branchId: currentBranch,
            from: date.startDate,
            to: date.endDate,
            granularity: defineGranularity({from: new Date(date.startDate), to: new Date(date.endDate)})
        }));
        dispatch(fetchTopProducts({
            branchId: currentBranch,
            from: date.startDate,
            to: date.endDate,
        }));
        dispatch(fetchTopEmployees({
            branchId: currentBranch,
            from: date.startDate,
            to: date.endDate,
        }));
    };

    useEffect(() => { updateList() }, [currentBranch, date]);

    return (
        <Grid container direction='row' alignItems='center' style={{paddingLeft: 10, paddingRight: 10}}>
            <Grid container xs={4} direction='row'>
                <Grid item>
                    <IconButton
                        style={{
                            color: mode === 1 ? '#009f3c' : '#a0afa0',
                            borderColor: mode === 1 ? '#009f3c' : '#a0afa0',
                            borderWidth: 1,
                            borderRadius: 1000,
                            borderStyle: "solid"
                        }}
                        onClick={() => {
                            dispatch(setDashboardMode(1));
                        }}
                    >
                        <ShowChart/>
                    </IconButton>
                </Grid>
                <Grid item style={{marginLeft: 10}}>
                    <IconButton
                        style={{
                            color: mode === 0 ? '#009f3c' : '#a0afa0',
                            borderColor: mode === 0 ? '#009f3c' : '#a0afa0',
                            borderWidth: 1,
                            borderRadius: 1000,
                            borderStyle: "solid"
                        }}
                        onClick={() => {
                            dispatch(setDashboardMode(0));
                        }}
                    >
                        <BarChart/>
                    </IconButton>
                </Grid>
            </Grid>
            <Grid item xs={8}>
                <Grid container justify='flex-end' direction='row' alignItems='center'>
                    <Grid item>
                        <RangePicker
                            onChange={range => {
                                let {startDate, endDate} = range;
                                const s = moment(startDate).startOf('day').format('YYYY-MM-DDTHH:mm:ss');
                                const e = moment(endDate).endOf('day').format('YYYY-MM-DDTHH:mm:ss');
                                dispatch(setDashboardDate({
                                    startDate: s,
                                    endDate: e
                                }));
                            }}
                            value={date}
                        />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
});
