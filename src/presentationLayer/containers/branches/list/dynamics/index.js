import React from 'react';
import {useSelector} from 'react-redux';
import {Grid, Typography, Paper} from "@material-ui/core";
import Card from "../../../../components/material-components/components/Card/Card";
import CardHeader from "../../../../components/material-components/components/Card/CardHeader";
import ChartistGraph from "react-chartist";
import {dailySalesChart} from "../../../../components/material-components/variables/charts";
import {useTranslation} from "react-i18next";

export default () => {

    const salesDynamics = useSelector(state => state.get("branch").salesDynamics);
    const { t } = useTranslation();

    const sortDataForGraphics = () => {
        let seriesArr = [];
        let resData = {
            labels: [],
            series: [seriesArr]
        };
        salesDynamics.forEach((item) => {
            resData.labels.push(item.x);
            seriesArr.push(item.y)
        });
        return resData;
    };

    let formattedData;
    if (salesDynamics) {
        formattedData = sortDataForGraphics();
    }
    return <Paper style={{marginTop: 30, width: '100%'}}>
        <Grid container justify='center'>
            <Grid item xs={12} style={{
                padding: 15,
                border: '1px solid #eee',
                color: '#555',
                height: 390
            }}>{salesDynamics ? (
                <>
                    <Grid container>
                        <Grid item style={{marginLeft: 25}}>
                            <Typography variant='h4' style={{fontSize: 20, fontWeight: 'bold', color: '#555'}}>
                                {t("branches.salesDynamics")}
                            </Typography>
                        </Grid>
                    </Grid>

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
                                        left: 20
                                    }
                                }}
                                listener={dailySalesChart.animation}
                            />
                        </CardHeader>
                    </Card>
                </>
            ) : null}
            </Grid>
        </Grid>
    </Paper>


};
