import Logic from "#businessLayer";
import { SINGLE_CATALOG, SINGLE_CATALOG_LOADING, SINGLE_CATALOG_BRANCH_ID, } from '../reducer';

export const setBranchId = (branchId) => ({
    type: SINGLE_CATALOG_BRANCH_ID,
    payload: branchId,
})

export const fetchCatalogList = (branchId) => {
    return dispatch => {
        dispatch({
            type: SINGLE_CATALOG_LOADING,
            payload: true
        });
        Logic
            .single
            .fetchSingleCatalogList({branchId})
            .then(response => {
                dispatch({
                    type: SINGLE_CATALOG_LOADING,
                    payload: false
                });
                dispatch({
                    type: SINGLE_CATALOG,
                    payload: response.data
                })
            })
            .catch(error => {
                console.log(error);
                dispatch({
                    type: SINGLE_CATALOG_LOADING,
                    payload: false
                });
            })
    }
};

export const saveSingleCategory = (categoryList, branchId) => {
    return async dispatch => {
        dispatch({
            type: SINGLE_CATALOG_LOADING,
            payload: false
        });
        try {
            await Logic.single.saveCategories(categoryList, branchId);
            let response = await Logic.single.fetchSingleCatalogList({branchId});
            dispatch({
                type: SINGLE_CATALOG,
                payload: response.data
            });
            dispatch({
                type: SINGLE_CATALOG_LOADING,
                payload: false
            });
        } catch (error) {
            dispatch({
                type: SINGLE_CATALOG_LOADING,
                payload: false
            });
            console.log(error);
        }
    }
};
