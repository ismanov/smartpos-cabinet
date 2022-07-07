import React from 'react';

import {Switch, Route} from 'react-router-dom';
import SignIn from './signin';
import Reset from './reset/reset';
import ResetConfirm from './reset/resetConfirm';
import mounted from "../../hocs/mounted";
import Particles from 'react-particles-js';
import Typed from 'react-typed';
import Footer from './component/footer';
import Header from './component/header';
import { Grid, makeStyles, Paper } from '@material-ui/core';
import authStyles from "../../../assets/jss/authStyles";
import './bootstrap-grid.min.css';

const useStyles = makeStyles(authStyles);

const Auth = () => {

    const classes = useStyles();

    return (
        <Grid container direction='column' className={classes.main}>
            <Header/>

            <Particles
                className={classes.particle_bg}
                params={{
                    fps_limit: 45,
                    particles: {

                        number: {
                            value: 150,
                        },
                        size: {
                            value: 3
                        },
                        line_linked: {
                            color: '#009f3c',
                            enable: true,
                            width: 1
                        },
                        shape: {
                            type: "circle",
                            stroke: {
                                color: "#009f3c",
                                width: 1
                            }
                        }
                    },
                    polygon: {
                        draw: {
                            stroke: {
                                width: 50,
                                color: '#009f3c'
                            }

                        }
                    },
                    interactivity: {
                        events: {
                            onhover: {
                                enable: true,
                                mode: "grab"
                            }
                        }
                    }
                }}
            />
            <Grid container className={classes.content} direction='row'>
                <Grid item xs={12} md={7} className={classes.info}>
                    <Grid container direction="column">
                        <Grid item xs={12} className={classes.typedContainer}>
                            <span className={classes.content_title}>SMARTPOS</span>
                            <Typed
                                strings={[
                                    ' - Современное решение для учета вашего бизнеса',
                                    ' - Стильный и максимально простой дизайн',
                                    ' - Подробные отчеты и фискальный чек'
                                ]}
                                typeSpeed={40}
                                backSpeed={50}
                                children
                                loop
                            >
                                <span className={classes.typed}/>
                            </Typed>
                        </Grid>
                        <Grid container direction='row' className={classes.infoContainer}>
                            <Grid item xs={12} md={6} className={classes.iconDescContainer}>
                                <div className={classes.iconDescIcon}>
                                    <img src={require('../../../assets/img/discs.png')} alt="easy-to-use" width={65}
                                         height={65}/>
                                </div>

                                <span className={classes.iconDescText}>Понятный интерфейс и стильный дизайн поможет вам быстро
                                    адаптироваться к системе
                                </span>
                            </Grid>
                            <Grid item xs={12} md={6} className={classes.iconDescContainer}>
                                <div className={classes.iconDescIcon}>
                                    <img src={require('../../../assets/img/cheque_desc.png')} alt="easy-to-use" width={65}
                                         height={65}/>
                                </div>

                                <span className={classes.iconDescText}>Понятный интерфейс и стильный дизайн поможет вам быстро
                                    адаптироваться к системе
                                </span>
                            </Grid>
                        </Grid>
                        <Grid container direction='row' className={classes.infoContainer}>
                            <Grid item xs={12} md={6} className={classes.iconDescContainer}>
                                <div className={classes.iconDescIcon}>
                                    <img src={require('../../../assets/img/graphics.png')} alt="easy-to-use" width={65}
                                         height={65}/>
                                </div>

                                <span className={classes.iconDescText}>Понятный интерфейс и стильный дизайн поможет вам быстро
                                    адаптироваться к системе
                                </span>
                            </Grid>
                            <Grid item xs={12} md={6} className={classes.iconDescContainer}>
                                <div className={classes.iconDescIcon}>
                                    <img src={require('../../../assets/img/graphics.png')} alt="easy-to-use" width={65}
                                         height={65}/>
                                </div>
                                <span className={classes.iconDescText}>Понятный интерфейс и стильный дизайн поможет вам быстро
                                    адаптироваться к системе
                                </span>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} md={5}>
                    <Grid container className={classes.pContainer}>
                        <Paper className={classes.paper}>
                            <Switch>
                                <Route exact path='/user/auth' component={SignIn}/>
                                {/*<Route path='/user/signup' component={SignUp} />*/}
                                {/*<Route path='/user/confirm' component={Confirm} />*/}
                                {/*<Route path='/user/setPassword' component={SetPassword} />*/}
                                <Route path='/user/reset' component={Reset}/>
                                <Route path='/user/reset-confirm' component={ResetConfirm}/>
                            </Switch>
                        </Paper>
                    </Grid>
                </Grid>
            </Grid>
            <Footer/>
        </Grid>
    )
};
export default mounted(Auth);
