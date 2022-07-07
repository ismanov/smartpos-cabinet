import React, {useEffect} from 'react';
import { Grid, Typography, Paper } from '@material-ui/core';
import { useDispatch, useSelector} from 'react-redux';
import Table from '../../../components/table';
import { fetchBranchList } from '../actions';
import Pagination from '../../../components/Pagination/Pagination';
import SalesStats from './stats';
import SalesDynamics from './dynamics';
import Filter from './filter';
import {useTranslation} from "react-i18next";
import { withRouter } from 'react-router-dom';

export default withRouter((props) => {
    
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const branchList = useSelector(state => state.get("branch").list);
    const page = useSelector(state => state.get("branch").page);
    const size = useSelector(state => state.get("branch").size);
    const total = useSelector(state => state.get("branch").total);
    const sort = useSelector(state => state.get("branch").sort);
    const totalElements = useSelector(state => state.get("branch").totalElements);
    const isLoading = useSelector(state => state.get("branch").isLoading);

    useEffect(() => { updateList() }, [sort]);
    const updateList = () => {
        dispatch(fetchBranchList({page: page || 0, size: size || 20, sort}))
    };

    return (
        <Grid container justify='center'>
            <Grid container style={{marginTop:  10}}>
                <Grid item>
                    <Typography variant='h4' style={{color: '#555', fontSize: 20, fontWeight: 'bold', marginLeft: 10}}> {t("branches.title")} </Typography>
                </Grid>
            </Grid>
            <Filter onUpdate={() => {
                updateList()
            }} />
            <SalesStats />
            <SalesDynamics />
            <Paper style={{width: '100%', padding: 15, marginTop: 20}}>
                <Grid container justify='center'>
                    <Grid item xs={12}>
                        <Table
                            order={true}
                            onItemClick={row => {
                                props.history.push(`/main/branches/${row.id}`)
                            }}
                            columns={
                                [{
                                    content: t("branches.branchName"),
                                    sort: true,
                                    key: 'name'
                                },
                                    {
                                        content: t("branches.address"),
                                        sort: true,
                                        key: 'address'
                                    },
                                    {
                                        content: t("branches.empCount"),
                                        sort: true,
                                        key: 'usersCount'
                                    }]
                            }
                            data={branchList}
                            isLoading={isLoading}
                            page={page}
                            size={size}
                            onSort={sort => setSort(sort)}
                            sort={sort}
                        />
                    </Grid>
                </Grid>
            </Paper>

            <Grid container style={{marginTop: 20}}>
                <Grid item>
                    <Typography variant='h4' style={{color: '#555', fontSize: 16}}>{t("branches.total")}: <span style={{fontWeight: 'bold'}}> {totalElements} </span> </Typography>
                </Grid>
            </Grid>
            <Grid container justify='flex-start' style={{border: '1px solid #eee', padding: 15, marginTop: 20, marginBottom: 20}}>
                <Grid item style={{marginTop: -16}}>
                    <Pagination
                        disabled={isLoading}
                        onPageChange={(page) => {
                            dispatch(fetchBranchList({page, size: size || 0, sort}))
                        }}
                        onSizeChange={(size) => {
                            dispatch(fetchBranchList({page: page || 0, size, sort}))
                        }}
                        pagesCount={total}
                        current={page || 0}
                        size={size || 20}
                    />
                </Grid>
            </Grid>
        </Grid>
    )
});

