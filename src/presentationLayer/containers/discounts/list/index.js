import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {withRouter} from 'react-router-dom';
import Table from '../../../components/Table/index';
import Pagination from '../../../components/Pagination/Pagination';
import { Grid, Button, Paper } from '@material-ui/core';
import SearchTextField from "../../../components/Textfields/search";
import {makeStyles} from "@material-ui/core/styles";
import styles
    from "../../../components/material-components/assets/jss/material-dashboard-react/views/dashboardStyle.js";
import Card from "../../../components/material-components/components/Card/Card";
import CardHeader from "../../../components/material-components/components/Card/CardHeader";
import CardIcon from "../../../components/material-components/components/Card/CardIcon";
import numeral from "numeral";
import Check from '@material-ui/icons/Ballot';
import Sales from '@material-ui/icons/AddShoppingCart';
import {useTranslation} from "react-i18next";
import SelectBox from "../../../components/SelectBox";
import { CardTravel } from '@material-ui/icons';
import moment from "moment";
import {
    fetchDiscountList, 
    fetchDiscountStats,
    setStatus, 
    setStartDate,
    setEndDate,
    setNds,
    setSort,

} from "./actions";
import DatePicker from "../../../components/Pickers/datepicker";

const useStyles = makeStyles(styles);

const DiscountList = props => {
    
    const [search, setSearch] = useState();
    const { t } = useTranslation();
    const currentBranch = useSelector(state => state.get("dashboard").currentBranch);
    const list = useSelector(state => state.get("discounts").list);
    const page = useSelector(state => state.get("discounts").page);
    const total = useSelector(state => state.get("discounts").total);
    const size = useSelector(state => state.get("discounts").size);
    const stats = useSelector(state => state.get("discounts").stats);
    const isLoading = useSelector(state => state.get("discounts").isLoading);
    const startDate = useSelector(state => state.get("discounts").startDate);
    const endDate = useSelector(state => state.get("discounts").endDate);
    const sort = useSelector(state => state.get("discounts").sort);
    const nds = useSelector(state => state.get("discounts").nds);
    const status = useSelector(state => state.get("discounts").status);

    const dispatch = useDispatch();

    const classes = useStyles();

    useEffect(() => {
        dispatch(fetchDiscountList(currentBranch, page, size, nds, status, search, startDate ? moment(startDate).format('YYYY-MM-DDTHH:mm:ss') : undefined, endDate ? moment(endDate).format('YYYY-MM-DDTHH:mm'): undefined, sort));
        dispatch(fetchDiscountStats(currentBranch, page, size, nds, status, search, startDate ? moment(startDate).format('YYYY-MM-DDTHH:mm:ss') : undefined, endDate ? moment(endDate).format('YYYY-MM-DDTHH:mm'): undefined));
    }, [currentBranch, search, sort, nds, status, startDate, endDate]);

    let headers = [
        {
            content: t("discount.discount_name_table"),
            sort: true,
            key: 'name'
        },
        {
            content: t("discount.discount_from"),
            sort: true,
            key: 'dateFrom'
        },
        {
            content: t("discount.discount_term"),
            sort: true,
            key: 'name',
            render: (value) => `${value.dateFrom ? moment(value.dateFrom).format("YYYY/MM/DD") : ''} - ${value.dateTo ? moment(value.dateTo).format("YYYY/MM/DD") : t("discount.no_limit")}`
        },
        {
            content: t("discount.hits"),
            sort: true,
            key: 'hits'
        },
        {
            content: t("discount.status"),
            sort: true,
            key: 'status'
        }
    ];

    return (
        <div className={classes.wrapper}>
            <div className={classes.title}>
                {t("discount.title")}
            </div>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={4}>
                    <Card>
                        <CardHeader color="primary" stats icon>
                            <CardIcon color="primary">
                                <CardTravel/>
                            </CardIcon>
                            <p className={classes.cardCategory}>{t("discount.active")}</p>
                            <h3 className={classes.cardTitle}>
                                {stats ? numeral(stats ? stats.activePromotions : 0).format('0,0') : 0}
                            </h3>
                        </CardHeader>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Card>
                        <CardHeader color="primary" stats icon>
                            <CardIcon color="primary">
                                <Check/>
                            </CardIcon>
                            <p className={classes.cardCategory}>{t("discount.past")}</p>
                            <h3 className={classes.cardTitle}>
                                {stats ? numeral(stats ? stats.finishedPromotions : 0).format('0,0') : '0' + ` ${t("common.sum")}`}
                            </h3>
                        </CardHeader>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Card>
                        <CardHeader color="primary" stats icon>
                            <CardIcon color="primary">
                                <Sales/>
                            </CardIcon>
                            <p className={classes.cardCategory}>{t("discount.count_of_hits")}</p>
                            <h3 className={classes.cardTitle}>
                                {stats ? numeral(stats ? stats.hitCount : 0).format('0,0') : '0' + ` ${t("common.sum")}`}
                            </h3>
                        </CardHeader>
                    </Card>
                </Grid>
            </Grid>
            <Paper style={{ minHeight: 500 }}>
                <Grid container style={{padding: 10}}>
                    <Grid item xs={6} md={2} >
                        <DatePicker
                            label={t("discount.startList")}
                            onChange={date => {
                                dispatch(setStartDate(moment(date).startOf('day').toDate()))
                            }}
                            value={startDate}
                            onClear={() => {
                                dispatch(setStartDate(null))
                            }}
                        />
                    </Grid>
                    <Grid item xs={6} md={2} style={{paddingLeft: 10}}>
                        <DatePicker
                            label={t("discount.end")}
                            onChange={date => {
                                dispatch(setEndDate(moment(date).endOf('day').toDate()))
                            }}
                            value={endDate}
                            onClear={() => {
                                dispatch(setEndDate(null))
                            }}
                        />
                    </Grid>
                    <Grid xs={6} md={3} style={{paddingLeft: 10}}>
                        <SearchTextField
                            onSearch={e => {
                                setSearch(e)
                            }}
                            onChange={e => {
                                setSearch(e);
                            }}
                            value={search}
                        />
                    </Grid>
                    <Grid item xs={6} md={2} style={{paddingLeft: 10}}>
                        <SelectBox
                            data={[
                                {
                                    key: 0,
                                    value: t("discount.has_vat")
                                },
                                {
                                    key: 1,
                                    value: t("discount.no_vat")
                                }
                            ]}
                            withReset={true}
                            itemKey="key"
                            itemValue="value"
                            value={nds}
                            label={t("discount.vat")}
                            onChange={(e) => {
                                dispatch(setNds(e.target.value))
                            }}
                        />
                    </Grid>
                    <Grid item xs={6} md={2} style={{paddingLeft: 10}}>
                        <SelectBox
                            data={[
                                {
                                    key: "ACTIVE",
                                    value: t("discount.active_key")
                                },
                                {
                                    key: "PLANNED",
                                    value: t("discount.planned_key")
                                },
                                {
                                    key: "ENDED",
                                    value: t("discount.ended_key")
                                },
                                {
                                    key: "PAUSED",
                                    value: t("discount.paused_key")
                                },
                                {
                                    key: "CANCELLED",
                                    value: t("discount.cancelled_key")
                                }
                            ]}
                            withReset={true}
                            itemKey="key"
                            itemValue="value"
                            label={t("discount.status")}
                            value={status}
                            onChange={(e) => {
                                dispatch(setStatus(e.target.value || undefined))

                            }}
                        />
                    </Grid>
                </Grid>

                <Grid container style={{marginTop: 15, marginBottom: 10}}>
                    <Grid item xs={8} style={{paddingLeft: 20, fontWeight: 'bold'}}>
                        { `${t("discount.all")}: ${'0'}` }
                    </Grid>
                    <Grid item xs={4} style={{textAlign: 'right', paddingRight: 20}}>
                        <Button
                            variant="outlined"
                            color="primary"
                            onClick={() => { props.history.push("/main/discounts/add") }}
                        > {t("discount.add")} </Button>
                    </Grid>
                </Grid>

                <Table
                    order={true}
                    headers={headers}
                    isLoading={isLoading}
                    data={list}
                    page={page}
                    size={size}
                    onItemClick={i => {
                        props.history.push(`/main/discounts/info/${i.id}`)
                    }}
                    onSort={(i, order) => {
                        dispatch(setSort({ col: i, order }));
                    }}
                    sort={sort}
                />
            </Paper>
            <Grid container direction="row" style={{marginTop: 30}}>
                <div style={{flex: 1}}>
                    <Pagination
                        onPageChange={page => {
                            dispatch(fetchDiscountList(currentBranch, page, size, nds, status, search, startDate ? moment(startDate).format('YYYY-MM-DDTHH:mm') : undefined, endDate ? moment(endDate).format('YYYY-MM-DDTHH:mm'): undefined));
                            dispatch(fetchDiscountStats(currentBranch, page, size, nds, status, search, startDate ? moment(startDate).format('YYYY-MM-DDTHH:mm') : undefined, endDate ? moment(endDate).format('YYYY-MM-DDTHH:mm'): undefined));
                        }}
                        onSizeChange={size => {
                            dispatch(fetchDiscountList(currentBranch, page, size, nds, status, search, startDate ? moment(startDate).format('YYYY-MM-DDTHH:mm') : undefined, endDate ? moment(endDate).format('YYYY-MM-DDTHH:mm'): undefined));
                            dispatch(fetchDiscountStats(currentBranch, page, size, nds, status, search, startDate ? moment(startDate).format('YYYY-MM-DDTHH:mm') : undefined, endDate ? moment(endDate).format('YYYY-MM-DDTHH:mm'): undefined));
                        }}
                        disabled={isLoading}
                        size={size}
                        pagesCount={total}
                        current={page}
                    />
                </div>
            </Grid>
        </div>
    )
};

export default withRouter(DiscountList);
