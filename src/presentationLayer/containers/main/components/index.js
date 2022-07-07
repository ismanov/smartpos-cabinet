import React from 'react';
import SectionForm from "../../../components/sectionForm";
import { CircularProgress } from "@material-ui/core";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import useDimensions from 'react-use-dimensions';
import {useTranslation} from "react-i18next";



const BarSection = (props) => {
    const [ref, { width }] = useDimensions();
    const { t } = useTranslation();
    return (
        <SectionForm
            title={props.title}
            icon={props.icon}
        >
            {props.isLoading ? (
                <div style={{
                    height: 300,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#8f8f8f',
                    fontSize: 15
                }}>
                    <CircularProgress color="primary"/>
                </div>
            ) : (
                props.data && props.data.length > 0 ? (
                    <div ref={ref}>
                        <BarChart
                            width={width}
                            height={300}
                            data={props.data || []}
                            margin={{
                                top: 5, right: 30, left: 15, bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="4 4" />
                            <XAxis dataKey="x" style={{fontSize: 12}}/>
                            <YAxis style={{fontSize: 12}}/>
                            <Tooltip />
                            <Bar dataKey="y" fill="#009f3c" />
                        </BarChart>
                    </div>
                    ) : (
                    <div style={{
                        height: 300,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#8f8f8f',
                        fontSize: 15
                    }}>
                        {t("common.empty_list")}
                    </div>
                    )
                )
            }
        </SectionForm>
    )
};

export default BarSection;
