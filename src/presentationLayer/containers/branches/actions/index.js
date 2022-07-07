import Logic from '#businessLayer'
import {
    BRANCH, BRANCH_ACTIVITY_TYPE_LIST,
    BRANCH_CITY_LIST, BRANCH_EMPLOYEES, BRANCH_LIST,
    BRANCH_LIST_SALES_DYNAMICS,
    BRANCH_LIST_SALES_STATS, BRANCH_LOADING,
    BRANCH_REGION_LIST,
    BRANCH_SALES_STATS,
    BRANCH_LIST_DATE_RANGE,
    BRANCH_LIST_SORT,
    BRANCH_DETAIL_DATE,
} from "../reducer";

import moment from "moment";

export const setBranchDetailDate = (date) => ({
    type: BRANCH_DETAIL_DATE,
    payload: date,
})


export const setBranchListSort = (sort) => ({
    type: BRANCH_LIST_SORT,
    payload: sort,
})

export const setBranchListDate = (range) => {
    return {
        type: BRANCH_LIST_DATE_RANGE,
        payload: range,
    }
};

export const fetchActivityTypes = () => {
    return dispatch => {
        Logic
            .resource
            .fetchActivityTypeList()
            .then(response => {
                dispatch({
                    type: BRANCH_ACTIVITY_TYPE_LIST,
                    payload: response.data
                })
            })
            .catch(console.log)
    }
};

export const fetchRegionList = () => {
    return dispatch => {
        Logic
            .resource
            .fetchRegions()
            .then(response => {
                dispatch({
                    type: BRANCH_REGION_LIST,
                    payload: response.data
                })
            })
            .catch(console.log)
    }
};

export const fetchCityList = (regionId) => {
    return dispatch => {
        Logic
            .resource
            .fetchCityForRegionId(regionId)
            .then(response => {
                dispatch({
                    type: BRANCH_CITY_LIST,
                    payload: response.data
                })
            })
            .catch(console.log)
    }
};

export const fetchSalesStats = ({from, to, branchId}) => {
    return dispatch => {
        Logic
            .analytics
            .fetchSalesStats({branchId, from, to})
            .then(response => {
                dispatch({
                    type: BRANCH_LIST_SALES_STATS,
                    payload: response.data
                })
            })
            .catch(console.log)
    }
};

export const  fetchSalesStatsForBranchId = ({branchId, from, to}) => {
    return dispatch => {
        Logic
            .analytics
            .fetchSalesStats({branchId, from, to})
            .then(response => {
                dispatch({
                    type: BRANCH_SALES_STATS,
                    payload: response.data
                })
            })
            .catch(console.log);
    }
};

export const clearBranchSalesStats = () => ({ type: BRANCH_SALES_STATS, payload: undefined });

export const fetchSalesDynamics = ({granularity, from, to, branchId}) => {
    return dispatch => {
        Logic
            .analytics
            .fetchSalesDynamics({branchId, from, to, granularity})
            .then(response => {
                let fromTime = moment(from);
                let toTime = moment(to);
                let result = [];
                const {data} = response;
                switch(granularity) {
                    case 'HOUR':
                        while(fromTime.isBefore(toTime)) {
                            if (data && data.length !== 0) {
                                let found = data.find(item => item.dateTime === fromTime.format('YYYY-MM-DDTHH:mm:ss'))
                                result.push({
                                    x: fromTime.format('DD MMM, HH:mm'),
                                    y: found ? found.salesTotal : 0
                                })
                            } else  {
                                result.push({
                                    x: fromTime.format('DD MMM, HH:mm'),
                                    y: 0
                                })
                            }
                            fromTime = fromTime.add(1, 'hour')
                        }
                        break
                    case 'DAY':
                        while(fromTime.isBefore(toTime)) {
                            if (data && data.length !== 0) {
                                let found = data.find(item => moment(item.dateTime).format('YYYY-MM-DD') === fromTime.format('YYYY-MM-DD'))
                                result.push({
                                    x: fromTime.format('DD MMM, YYYY'),
                                    y: found ? found.salesTotal : 0
                                })
                            } else  {
                                result.push({
                                    x: fromTime.format('DD MMM, YYYY'),
                                    y: 0
                                })
                            }
                            fromTime = fromTime.add(1, 'day')
                        }
                        break;
                    case 'WEEK':
                        fromTime = fromTime.startOf('isoWeek');
                        while(fromTime.isBefore(toTime)) {

                            if (data && data.length !== 0) {
                                let found = data.find(item => moment(item.dateTime).format('YYYY-MM-DD') === fromTime.format('YYYY-MM-DD'))
                                result.push({
                                    x: fromTime.format('DD MMM, YYYY'),
                                    y: found ? found.salesTotal : 0
                                })
                            } else  {
                                result.push({
                                    x: fromTime.format('DD MMM, YYYY'),
                                    y: 0
                                })
                            }
                            fromTime = fromTime.add(1, 'week')
                        }
                        break;
                    case 'MONTH':
                        while(fromTime.isBefore(toTime)) {
                            if (data && data.length > 0) {
                                let found = data.find(item => moment(item.dateTime).format('YYYY-MM') === fromTime.format('YYYY-MM'));
                                result.push({
                                    x: fromTime.format('MMM, YYYY'),
                                    y: found ? found.salesTotal : 0
                                })
                            } else  {
                                result.push({
                                    x: fromTime.format('MMM, YYYY'),
                                    y: 0
                                })
                            }
                            fromTime = fromTime.add(1, 'month')
                        }
                        break;
                    default:
                        break
                }
                dispatch({
                    type: BRANCH_LIST_SALES_DYNAMICS,
                    payload: result
                })
            })
            .catch(console.log)

    }
};

export const fetchBranchList = ({page, size, sort}) => {
    return dispatch => {
        Logic
            .branch
            .fetchBranchList({page, size, orderBy: sort ? sort.col : undefined, sortOrder: sort ? sort.order: undefined})
            .then(response => {                
                dispatch({
                    type: BRANCH_LIST,
                    payload: response.data
                })
            })
            .catch(console.log)
    }
};

export const fetchBranchById = (id) => {
    return dispatch => {
        Logic
            .branch
            .fetchBranchById(id)
            .then(response => {
                dispatch({
                    type: BRANCH,
                    payload: response.data
                })
            })
            .catch(console.log)
    }
};

export const clearCityList = () => {
    return {
        type: BRANCH_CITY_LIST,
        payload: []
    }
};

export const createBranch = (branch, fn) => {
    return dispatch => {
        dispatch({
            type: BRANCH_LOADING,
            payload: true
        });
        Logic
            .branch
            .createBranch(branch)
            .then(_ => {
                dispatch({
                    type: BRANCH_LOADING,
                    payload: false
                });
                fn && fn();
                dispatch(clearCityList());
            })
            .catch(console.log)
    }
};

export const updateBranch = (branch, onFinish) => {
    return dispatch => {
        dispatch({
            type: BRANCH_LOADING,
            payload: true
        });
        Logic
            .branch
            .updateBranch(branch)
            .then(_ => {
                dispatch({
                    type: BRANCH_LOADING,
                    payload: false
                });
                onFinish && onFinish();
                dispatch(clearCityList());
            })
            .catch(console.log)
    }
};

export const removeBranch = (branch, redirect, props) => {
    return dispatch => {
        dispatch({
            type: BRANCH_LOADING,
            payload: true
        });
        Logic
            .branch
            .removeBranch(branch)
            .then(_ => {
                dispatch({
                    type: BRANCH_LOADING,
                    payload: false
                });
                redirect && redirect()
            })
            .catch(error => {
                if (error.response && error.response.status === 400) {
                    alert('Ошибка! Невозможно удалить фискального филиала!')                    
                } else if (error.response && error.response.status === 404) {
                    alert('Ошибка! Филиал не найден!')                    
                } else {
                    alert(error.toString())                    
                }
            })
    }
};



export const fetchEmployeesForBranchId = (branchId) => {
    return dispatch => {
        Logic
            .employee
            .fetchEmployeeList(0, 100000, 'ALL', branchId)
            .then(response => {
                dispatch({
                    type: BRANCH_EMPLOYEES,
                    payload: response.data.content
                })
            })
            .catch(console.log)
    }
};
