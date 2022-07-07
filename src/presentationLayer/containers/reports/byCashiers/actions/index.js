import Logic from '#businessLayer';
import { REPORT_BY_CASHIERS_LIST, REPORT_BY_CASHIERS_LIST_LOADING, REPORT_BY_CASHIERS_LIST_SORT, } from '../reducer';

export const setSort = (sort) => ({
    type: REPORT_BY_CASHIERS_LIST_SORT,
    payload: sort,
})

export const byCashiers = ({branchId, from, to, page, size, sort}) => {
    return dispatch => {
        dispatch({
            type: REPORT_BY_CASHIERS_LIST_LOADING,
            payload: true
        })        
        Logic
            .report
            .reportByCashiers({branchId, from, to, page, size, orderBy: sort ? sort.col : undefined, sortOrder: sort ? sort.order : undefined})
            .then(response => {
                dispatch({
                    type: REPORT_BY_CASHIERS_LIST,
                    payload: response.data
                })
                dispatch({
                    type: REPORT_BY_CASHIERS_LIST_LOADING,
                    payload: false
                })
            })
            .catch(error => {
                dispatch({
                    type: REPORT_BY_CASHIERS_LIST_LOADING,
                    payload: false
                })
                console.log(error)
            })
    }
};