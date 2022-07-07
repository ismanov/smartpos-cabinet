import Logic from '#businessLayer';
import {  Z_REPORT_LOADING, Z_REPORT_LIST, Z_REPORT_STATS, Z_REPORT_DATE, Z_REPORT_CASHIERS, Z_REPORT_EMPLOYEE, Z_REPORT_SORT, } from '../reducer';
import FileDownload from 'js-file-download'
import moment from 'moment';

export const setSort = (sort) => ({
    type: Z_REPORT_SORT,
    payload: sort,
})

export const setEmployee = (employeeId) => ({
    type: Z_REPORT_EMPLOYEE,
    payload: employeeId,
});

export const fetchZReport = ({page, size, branchId, sort, from, to, search, cashierId})  => {
    return dispatch => {
        dispatch({
            type: Z_REPORT_LOADING,
            payload: true
        });
        Logic
            .report
            .fetchZReport({
                page, 
                size, 
                branchId, 
                orderBy: sort ? sort.col : undefined, 
                sortOrder: sort ? sort.order : undefined,
                userId: cashierId,
                from,
                to,
                search
            })
            .then(response => {
                dispatch({
                    type: Z_REPORT_LOADING,
                    payload: false
                });
                dispatch({
                    type: Z_REPORT_LIST,
                    payload: response.data
                })
            })
            .catch(console.log)
    }
};

export const fetchZReportStats = ({page, size, branchId, from, to}) => {
    return dispatch => {
        Logic
            .report
            .fetchZReportStats({page, size, branchId, from, to})
            .then(response => {
                dispatch({
                    type: Z_REPORT_STATS,
                    payload: response.data
                })
            })
            .catch(console.log)
    }
};

export const fetchCashiers = (branchId) => {
    return dispatch => {
        Logic
            .employee
            .fetchCashiers(branchId)
            .then(response => {
                dispatch({
                    type: Z_REPORT_CASHIERS,
                    payload: response.data.content
                })
            })
            .catch(console.log)
    }
};

export const setDate = (date) => {
    return {
        type: Z_REPORT_DATE,
        payload: date
    }
};

export const downloadZReport = (filter) => {
    return () => {
        Logic
            .excel
            .zReport(filter)
            .then(response => {
                FileDownload(response.data, `Z-Отчет-${moment().format("YYYY/MM/DD")}.xlsx`);
            })
            .catch(console.log)
    }
}