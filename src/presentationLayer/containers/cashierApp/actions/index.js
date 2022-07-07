import LogicContainer from "../../../../businessLayer";

import { CASHIER_CURRENT_BRANCH } from "../reducer";

export const fetchCurrentBranch = () => {
    return dispatch => {
        LogicContainer
            .branch
            .fetchCurrentBranch()
            .then(response => {
                dispatch({
                    type: CASHIER_CURRENT_BRANCH,
                    payload: response.data.id
                })
            })
            .catch(console.log)
    }
};