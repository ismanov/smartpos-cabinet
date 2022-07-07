import { DASHBOARD_MODE, DASHBOARD_DATE, DASHBOARD_DYNAMICS, DASHBOARD_STATES, DASHBOARD_TOP_PRODUCTS, DASHBOARD_TOP_EMPLOYEES, DASHBOARD_MAIN_LOADING, DASHBOARD_SELECTED_TAB } from '../reducer';
import Logic from '#businessLayer';
import moment from "moment";
import { formatForGranularity } from "#utils/format";

export const fetchSalesStats = ({branchId, from, to}) => {
    return dispatch => {
        Logic
            .analytics
            .fetchSalesStats({branchId, from, to})
            .then(response => {
                dispatch({
                    type: DASHBOARD_STATES,
                    payload: response.data
                })
            })
            .catch(console.log)
    }
};

export const fetchSalesDynamics = ({branchId, from, to, granularity}) => {
    return dispatch => {
        dispatch({
            type: DASHBOARD_MAIN_LOADING,
            payload: true
        });
        Logic
            .analytics
            .fetchSalesDynamics({branchId, from, to, granularity, es: true})
            .then(response => {
                let { data } = response;
                let f = moment(from);
                f.set({ hour: 0, minute: 0, second: 0, millisecond: 0});
                let t = moment(to);
                let result = [];

                while (f.isBefore(t)) {
                    let n = f.clone();
                    n.add(1, granularity);
                    if (n.isAfter(t)) {
                        n = t.clone()
                    }
                    let day = f.format(formatForGranularity(granularity));
                    let discount = 0;
                    let salesCount = 0;
                    let salesTotal = 0;
                    let salesCash = 0;
                    let salesCard = 0;
                    let nds = 0;
                    let excise = 0;
                    let returned = 0;

                    data.forEach(item => {
                        let dateTime = moment(item.dateTime);
                        if (dateTime.valueOf() >= f.valueOf() && dateTime.valueOf() < n.valueOf()) {
                            discount        += (item.discount || 0);
                            salesCount      += (item.salesCount || 0);
                            salesTotal      += (item.salesTotal || 0);
                            salesCash       += (item.salesCash || 0);
                            salesCard       += (item.salesCard || 0);
                            nds             += (item.nds || 0);
                            excise          += (item.excise || 0);
                            returned        += (item.returned || 0);
                        }
                    });
                    result.push({ unit: day, amounts: { discount, salesCount, salesTotal, salesCash, salesCard, nds, excise, returned }});
                    f.add(1, granularity)
                }
                dispatch({
                    type: DASHBOARD_DYNAMICS,
                    payload: result
                });
                dispatch({
                    type: DASHBOARD_MAIN_LOADING,
                    payload: false
                });
            })
            .catch(_ => {
                dispatch({
                    type: DASHBOARD_MAIN_LOADING,
                    payload: false
                });
            })
    }
};

export const fetchTopProducts = ({branchId, from, to}) => {
    return dispatch => {
        Logic
            .analytics
            .fetchSalesStatsProducts({branchId, page: 0, size: 3, from, to, orderBy: 'salesTotal', sortOrder: 'desc'})
            .then(response => {
                dispatch({
                    type: DASHBOARD_TOP_PRODUCTS,
                    payload: response.data.content
                })
            })
            .catch(error => {})
    }
};

export const fetchTopEmployees = ({branchId, from, to}) => {
    return dispatch => {
        Logic
            .analytics
            .fetchSalesStatsEmployee({branchId, page: 0, size: 3, from, to, orderBy: 'salesTotal', sortOrder: 'desc'})
            .then(response => {
                dispatch({
                    type: DASHBOARD_TOP_EMPLOYEES,
                    payload: response.data.content
                })
            })
            .catch(error => {})
    }
};


export const setDashboardMode = (mode) => {
    return dispatch => {
        dispatch({
            type: DASHBOARD_MODE,
            payload: mode
        })
    }
};

export const setDashboardDate = (date) => {
    return dispatch => {
        dispatch({
            type: DASHBOARD_DATE,
            payload: date
        })
    }
};

export const setDashboardTab = (tab) => {
    return dispatch => {
        dispatch({
            type: DASHBOARD_SELECTED_TAB,
            payload: tab
        })
    }
};
