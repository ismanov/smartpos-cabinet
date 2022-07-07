import React from 'react';
import {Route, Redirect, Router} from 'react-router-dom';
import Dashboard from '../dashboard';
import Auth from '../auth';
import memory from '#services/memory';
import { createBrowserHistory } from 'history';
import CashierApp from "../cashierApp";

const Root = () => {
    return (
        <div style={{ height: '100vh' }}>
            <Router history={createBrowserHistory()}>
                <Route exact path='/' render={() => {
                    if (memory.get('token')) {
                        let userString = memory.get('currentUser');
                        let currentUser = JSON.parse(userString);
                        if (currentUser && (currentUser.authorities || []).includes('ROLE_CASHIER')) {
                            return <Redirect to='/cashier' />
                        }
                        return <Redirect to='/main' />
                    } else {
                        return <Redirect to='/user/auth' />
                    }
                }} />
                <Route path='/main' render={() => {
                    if (memory.get('token')) {
                        let userString = memory.get('currentUser');
                        let currentUser = JSON.parse(userString);
                        if (currentUser && (currentUser.authorities || []).includes('ROLE_CASHIER')) {
                            return <Redirect to='/cashier' />
                        }
                        return <Dashboard />
                    } else {
                        return <Redirect to='/user/auth' />
                    }
                }}/>
                <Route path='/cashier' render={() => {
                    if (memory.get('token')) {
                        return <CashierApp />
                    } else {
                        return <Redirect to='/user/auth' />
                    }
                }} />
                <Route path='/user' component={() => <Auth />} />
                {/*<Route path='/init-config' render={() => (memory.get('token') ?*/}
                {/*    <Grid container justify="center" style={{height: '100vh'}}>*/}
                {/*        <Grid item md={9} lg={6}>*/}
                {/*            <Config />*/}
                {/*        </Grid>*/}
                {/*    </Grid> : <Redirect to='/user/auth'/>)*/}
                {/*} />*/}
            </Router>
        </div>
    )

};

export default Root;
