import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {makeStyles} from "@material-ui/core/styles";
import {Grid} from '@material-ui/core';
import CustomTabs from "../../../components/material-components/components/CustomTabs/CustomTabs";
import { dailySalesChart } from "../../../components/material-components/variables/charts.js";
import ChartistGraph from "react-chartist";
import Card from "../../../components/material-components/components/Card/Card.js";
import CardHeader from "../../../components/material-components/components/Card/CardHeader.js";
import CardBody from "../../../components/material-components/components/Card/CardBody";
import dashboardStyles from "../../../../assets/jss/dashboardStyles";

import {setDashboardTab} from "../action";
import {useTranslation} from "react-i18next";

const useStyles = makeStyles(dashboardStyles);

const MainDiagram = () => {

    const classes = useStyles();
    const dynamics = useSelector(state => state.get('main').dynamics);
    const states = useSelector(state => state.get('main').states);
    const tab = useSelector(state => state.get('main').tab);
    const mode = useSelector(state => state.get('main').mode);
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const getAmountForMode = (selected, item) => {
        switch (selected) {
            case 0: // sales
                return item.amounts.salesTotal;
            case 1: // cash
                return item.amounts.salesCash;
            case 2: // card
                return item.amounts.salesCard;
            case 3: // discount
                return item.amounts.discount;
            case 4: // nds
                return item.amounts.nds;
            case 5: // excise
                return item.amounts.excise;
            case 6: // cheques
                return item.amounts.salesCount;
            case 7: // returns
                return item.amounts.returned;
            default:
                return item.amounts.salesTotal;
        }
    };

    const sortDataForGraphics = (numberOfGraphic) => {
        let seriesArr = [];
        let resData = {
            labels: [],
            series: [seriesArr]
        };

        dynamics.forEach((item) => {
            resData.labels.push(item.unit);
            seriesArr.push(getAmountForMode(numberOfGraphic, item))
        });
        return resData;
    };
    const formattedData = sortDataForGraphics(tab);

    return (
        <Grid container>
            {mode === 0 ? (
                <Grid container style={{marginTop: 30}}>
                    <Grid container spacing={3}>
                        <Grid item md={6} xs={12}>
                            <Card chart>
                                <CardHeader color="primary">
                                    <ChartistGraph
                                        className="ct-chart"
                                        data={sortDataForGraphics(0)}
                                        type="Line"
                                        options={{
                                            height: 300,
                                            showArea: true,
                                            low: Math.min(...sortDataForGraphics(0).series[0]),
                                            high: Math.max(...sortDataForGraphics(0).series[0]),
                                            chartPadding: {
                                                top: 20,
                                                right: 20,
                                                bottom: 60,
                                                left: 20
                                            },
                                        }
                                        }
                                        listener={dailySalesChart.animation}
                                    />
                                </CardHeader>
                                <CardBody>
                                    <h4 className={classes.cardTitle}>{`${t("home.sales")} - (${Number(states ? states.salesTotal : 0).format(2)} ${t("units.sum")})`}</h4>
                                </CardBody>
                            </Card>
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <Card chart>
                                <CardHeader color="primary">
                                    <ChartistGraph
                                        className="ct-chart"
                                        data={sortDataForGraphics(1)}
                                        type="Line"
                                        options={{
                                            height: 300,
                                            showArea: true,
                                            low: Math.min(...sortDataForGraphics(1).series[0]),
                                            high: Math.max(...sortDataForGraphics(1).series[0]),
                                            chartPadding: {
                                                top: 20,
                                                right: 20,
                                                bottom: 60,
                                                left: 20
                                            }
                                        }
                                        }
                                        listener={dailySalesChart.animation}
                                    />
                                </CardHeader>
                                <CardBody>
                                    <h4 className={classes.cardTitle}>{`${t("home.cashMoney")} - (${Number(states ? states.salesCash : 0).format(2)} ${t("units.sum")})`}</h4>
                                </CardBody>
                            </Card>
                        </Grid>
                    </Grid>
                    <Grid container style={{marginTop: 10}} spacing={3}>
                        <Grid item md={6} xs={12}>
                            <Card chart>
                                <CardHeader color="primary">
                                    <ChartistGraph
                                        className="ct-chart"
                                        data={sortDataForGraphics(2)}
                                        type="Line"
                                        options={{
                                            height: 300,
                                            showArea: true,
                                            low: Math.min(...sortDataForGraphics(2).series[0]),
                                            high: Math.max(...sortDataForGraphics(2).series[0]),
                                            chartPadding: {
                                                top: 20,
                                                right: 20,
                                                bottom: 60,
                                                left: 20
                                            }
                                        }}
                                        listener={dailySalesChart.animation}
                                    />
                                </CardHeader>
                                <CardBody>
                                    <h4 className={classes.cardTitle}>{`${t("home.card")} - (${Number(states ? states.salesCard : 0).format(2)} ${t("units.sum")})`}</h4>
                                </CardBody>
                            </Card>
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <Card chart>
                                <CardHeader color="primary">
                                    <ChartistGraph
                                        className="ct-chart"
                                        data={sortDataForGraphics(6)}
                                        type="Line"
                                        options={{
                                            height: 300,
                                            showArea: true,
                                            low: Math.min(...sortDataForGraphics(6).series[0]),
                                            high: Math.max(...sortDataForGraphics(6).series[0]),
                                            chartPadding: {
                                                top: 20,
                                                right: 20,
                                                bottom: 60,
                                                left: 20
                                            }
                                        }
                                        }
                                        listener={dailySalesChart.animation}
                                    />
                                </CardHeader>
                                <CardBody>
                                    <h4 className={classes.cardTitle}>{`${t("home.discounts")} - (${Number(states ? states.discount : 0)} ${t("units.sum")})`}</h4>
                                </CardBody>
                            </Card>
                        </Grid>
                    </Grid>
                    <Grid container style={{marginTop: 10}} spacing={3}>
                        <Grid item md={6} xs={12}>
                            <Card chart>
                                <CardHeader color="primary">
                                    <ChartistGraph
                                        className="ct-chart"
                                        data={sortDataForGraphics(4)}
                                        type="Line"
                                        options={{
                                            height: 300,
                                            showArea: true,
                                            low: Math.min(...sortDataForGraphics(4).series[0]),
                                            high: Math.max(...sortDataForGraphics(4).series[0]),
                                            chartPadding: {
                                                top: 20,
                                                right: 20,
                                                bottom: 60,
                                                left: 20
                                            }
                                        }
                                        }
                                        listener={dailySalesChart.animation}
                                    />
                                </CardHeader>
                                <CardBody>
                                    <h4 className={classes.cardTitle}>{`${t("home.nds")} - (${Number(states ? states.nds : 0).format(2)} ${t("units.sum")})`}</h4>
                                </CardBody>
                            </Card>
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <Card chart>
                                <CardHeader color="primary">
                                    <ChartistGraph
                                        className="ct-chart"
                                        data={sortDataForGraphics(5)}
                                        type="Line"
                                        options={{
                                            height: 300,
                                            showArea: true,
                                            low: Math.min(...sortDataForGraphics(5).series[0]),
                                            high: Math.max(...sortDataForGraphics(5).series[0]),
                                            chartPadding: {
                                                top: 20,
                                                right: 20,
                                                bottom: 60,
                                                left: 20
                                            }
                                        }}
                                        listener={dailySalesChart.animation}
                                    />
                                </CardHeader>
                                <CardBody>
                                    <h4 className={classes.cardTitle}>{`${t("home.excise")} - (${Number(states ? states.excise : 0)} ${t("units.sum")})`}</h4>
                                </CardBody>
                            </Card>
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <Card chart>
                                <CardHeader color="primary">
                                    <ChartistGraph
                                        className="ct-chart"
                                        data={sortDataForGraphics(3)}
                                        type="Line"
                                        options={{
                                            height: 300,
                                            showArea: true,
                                            low: Math.min(...sortDataForGraphics(3).series[0]),
                                            high: Math.max(...sortDataForGraphics(3).series[0]),
                                            chartPadding: {
                                                top: 20,
                                                right: 20,
                                                bottom: 60,
                                                left: 20
                                            }
                                        }
                                        }
                                        listener={dailySalesChart.animation}
                                    />
                                </CardHeader>
                                <CardBody>
                                    <h4 className={classes.cardTitle}>{`${t("home.cheques")} - (${Number(states ? states.salesCount : 0)} ${t("units.pcs")})`}</h4>
                                </CardBody>
                            </Card>
                        </Grid>                        
                        <Grid item md={6} xs={12}>
                            <Card chart>
                                <CardHeader color="primary">
                                    <ChartistGraph
                                        className="ct-chart"
                                        data={sortDataForGraphics(6)}
                                        type="Line"
                                        options={{
                                            height: 300,
                                            showArea: true,
                                            low: Math.min(...sortDataForGraphics(6).series[0]),
                                            high: Math.max(...sortDataForGraphics(6).series[0]),
                                            chartPadding: {
                                                top: 20,
                                                right: 20,
                                                bottom: 60,
                                                left: 20
                                            }
                                        }
                                        }
                                        listener={dailySalesChart.animation}
                                    />
                                </CardHeader>
                                <CardBody>
                                    <h4 className={classes.cardTitle}>{`${t("home.returns")} - (${Number(states ? states.returned : 0)} ${t("units.sum")})`}</h4>
                                </CardBody>
                            </Card>
                        </Grid>
                    </Grid>
                </Grid>
            ) : (
                <Grid container style={{marginTop: 30}}>
                    <CustomTabs
                        headerColor="primary"
                        onChange={(mode) => {
                            dispatch(setDashboardTab(mode));
                        }}
                        value={tab}
                        tabs={[
                            {
                                tabName: (
                                    <div className={'cm-tab-label'}>
                                        <div>
                                            {t("home.sales")}
                                        </div>
                                        <div>
                                            {states ? isNaN(Number(states.salesTotal)) ? 0 : Number(states.salesTotal).format(2) : 0}
                                        </div>
                                        <div>
                                            {t("units.sum")}
                                        </div>
                                    </div>
                                ),
                                tabContent: null
                            },
                            {
                                tabName: (
                                    <div className={'cm-tab-label'}>
                                        <div>
                                            {t("home.cashMoney")}
                                        </div>
                                        <div>
                                            {states ? isNaN(Number(states.salesCash)) ? 0 : Number(states.salesCash).format(2) : 0}
                                        </div>
                                        <div>
                                            {t("units.sum")}
                                        </div>
                                    </div>
                                ),
                                tabContent: null
                            },
                            {
                                tabName: (
                                    <div className={'cm-tab-label'}>
                                        <div>
                                            {t("home.card")}
                                        </div>
                                        <div>
                                            {states ? isNaN(Number(states.salesCard)) ? 0 : Number(states.salesCard).format(2) : 0}
                                        </div>
                                        <div>
                                            {t("units.sum")}
                                        </div>
                                    </div>
                                ),
                                tabContent: null
                            },
                            {
                                tabName: (
                                    <div className={'cm-tab-label'}>
                                        <div>
                                            {t("home.discounts")}
                                        </div>
                                        <div>
                                            {states ? isNaN(Number(states.discount)) ? 0 : Number(states.discount).format(2) : 0}
                                        </div>
                                        <div>
                                            {t("units.sum")}
                                        </div>
                                    </div>
                                ),
                                tabContent: null
                            },                         
                            {
                                tabName: (
                                    <div className={'cm-tab-label'}>
                                        <div>
                                            {t("home.nds")}
                                        </div>
                                        <div>
                                            {states ? isNaN(Number(states.nds)) ? 0 : Number(states.nds).format(2) : 0}
                                        </div>
                                        <div>
                                            {t("units.sum")}
                                        </div>
                                    </div>
                                ),
                                tabContent: null
                            },
                            {
                                tabName: (
                                    <div className={'cm-tab-label'}>
                                        <div>
                                            {t("home.excise")}
                                        </div>
                                        <div>
                                            {states ? isNaN(Number(states.excise)) ? 0 : Number(states.excise).format(2) : 0}
                                        </div>
                                        <div>
                                            {t("units.sum")}
                                        </div>
                                    </div>
                                ),
                                tabContent: null
                            },    
                            {
                                tabName: (
                                    <div className={'cm-tab-label'}>
                                        <div>
                                            {t("home.cheques")}
                                        </div>
                                        <div>
                                            {states ? isNaN(Number(states.salesCount)) ? 0 : Number(states.salesCount).format(0) : 0}
                                        </div>
                                        <div>
                                            {t("units.pcs")}
                                        </div>
                                    </div>
                                ),
                                tabContent: null
                            },                        
                            {
                                tabName: (
                                    <div className={'cm-tab-label'}>
                                        <div>
                                            {t("home.returns")}
                                        </div>
                                        <div>
                                            {states ? isNaN(Number(states.returned)) ? 0 : Number(states.returned).format(2) : 0}
                                        </div>
                                        <div>
                                            {t("units.sum")}
                                        </div>
                                    </div>
                                ),
                                tabContent: null
                            },                            
                        ]}
                    />

                    <Card chart>
                        <CardHeader color="invertedGreen">
                            <ChartistGraph
                                className="inverted-green"
                                data={formattedData}
                                type="Line"
                                options={{
                                    height: 300,
                                    showArea: false,
                                    low: Math.min(...formattedData.series[0]),
                                    high: Math.max(...formattedData.series[0]),
                                    chartPadding: {
                                        top: 20,
                                        right: 20,
                                        bottom: 60,
                                        left: 50
                                    }
                                }}
                                listener={dailySalesChart.animation}
                            />
                        </CardHeader>
                    </Card>
                </Grid>
            )}
        </Grid>
    )
};

export default MainDiagram;
