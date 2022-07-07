import Logic from '#businessLayer';

import {TEMPLATE, ACTIVITY_TYPE_LIST, BANK_REQUISITES} from "../reducer";
import { CURRENT_OWNER } from '../../dashboard/reducer'


export const fetchTemplate = () => {
    return dispatch => {
        Logic
            .template
            .fetchTemplate()
            .then(response => {
                dispatch({
                    type: TEMPLATE,
                    payload: response.data
                })
            })
            .catch(error => {
                if (error.response && error.response.status === 404) {
                    dispatch({
                        type: TEMPLATE,
                        payload: undefined
                    })
                } else {
                    console.error(error)
                }
            })
    }
};

export const saveTemplate = (template, props) => {
    return async dispatch => {
        try {
            await Logic.template.saveTemplate(template);
            let response = await Logic.template.fetchTemplate();
            dispatch({
                type: TEMPLATE,
                payload: response.data
            })
        } catch(error) {
            console.log(error);
        }
    }
};

export const removeTemplate = (id, callback) => {
    return async dispatch => {
        try {
            await Logic.template.removeTemplate(id);
            callback && callback()
        } catch (error) {
            console.log(error)
        }
    }
};

export const fetchActivityTypeList = () => {
    return dispatch => {
        Logic
            .resource
            .fetchActivityTypeList()
            .then(response => {
                dispatch({
                    type: ACTIVITY_TYPE_LIST,
                    payload: response.data
                })
            })
            .catch(console.log)
    }
};

export const fetchBankRequisites = () => {
    return dispatch => {
        Logic
            .user
            .fetchBankRequisites()
            .then(response => {
                dispatch({
                    type: BANK_REQUISITES,
                    payload: response.data
                })
            })
            .catch(error => {
                if (error && error.response && error.response.status === 400) {
                    dispatch({ type: BANK_REQUISITES, payload: undefined })
                }
            })
    }
};

export const createBankRequisites = (br) => {
    return async dispatch => {
        await Logic.user.createBankRequisite(br);
        let response = await Logic.user.fetchBankRequisites();
        dispatch({
            type: BANK_REQUISITES,
            payload: response.data
        });
    }
};

export const updateBankRequisites = (br) => {
    return async dispatch => {
        try {
            await Logic.user.updateBankRequisite(br);
            let response = await Logic.user.fetchBankRequisites();
            dispatch({
                type: BANK_REQUISITES,
                payload: response.data
            });
        } catch(error) {

        }
    }
};

export const updateOwner = (owner, props) => {
    return async dispatch => {
        try {
            await Logic.user.updateCurrentOwner(owner)
            let response = await Logic.config.getCurrentCompany();
            dispatch({
                type: CURRENT_OWNER,
                payload: response.data
            });
            props.onDialogClose && props.onClose()
        } catch(error) {
            console.log(error)
        }
    }
};