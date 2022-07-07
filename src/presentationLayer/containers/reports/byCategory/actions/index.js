import Logic from '#businessLayer';
import { REPORT_CATEGORY_STATS, REPORT_CATEGORY_LIST, REPORT_CATEGORY_LOADING } from '../reducer';
import FileDownload from "js-file-download";

export const byCategory = ({ branchId, from, to }) => {
    return dispatch => {
        dispatch({
            type: REPORT_CATEGORY_LOADING,
            payload: true
        })
        Logic
            .report
            .reportByCategories({branchId, from, to})
            .then(response => {
                dispatch({
                    type: REPORT_CATEGORY_LIST,
                    payload: response.data,

                });
                dispatch({
                    type: REPORT_CATEGORY_LOADING,
                    payload: false
                })
            })
            .catch(error => {
                dispatch({
                    type: REPORT_CATEGORY_LOADING,
                    payload: false
                })
                console.log(error)
            })
    }
};

export const byCategoryStats = ({ branchId, from, to }) => {
    return dispatch => {
        Logic
            .report
            .reportByCategoriesStats({branchId, from, to})
            .then(response => {
                dispatch({
                    type: REPORT_CATEGORY_STATS,
                    payload: response.data,

                });
            })
            .catch(console.log)
    }
};

export const byCategoryExcel = ({ branchId, from, to }) => {
    return () => {
        Logic
            .excel
            .byCategory({branchId, from, to})
            .then(response => { FileDownload(response.data, 'report_by_all_category.xlsx'); })
            .catch(error => {})

    }
}
