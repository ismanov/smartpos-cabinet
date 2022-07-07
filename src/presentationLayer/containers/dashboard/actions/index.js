import {
  CURRENT_USER,
  CURRENT_BRANCH,
  CURRENT_OWNER,
  COMMON_BRANCH_LIST,
  CURRENT_LANG,
} from "../reducer";
import Logic from "#businessLayer";

export const setCurrentLang = (lang) => ({
  type: CURRENT_LANG,
  payload: lang,
});

export const fetchCurrentUser = () => {
  return (dispatch) => {
    Logic.user
      .getCurrentUser()
      .then((response) => {
        dispatch({
          type: CURRENT_USER,
          payload: response.data,
        });
      })
      .catch(console.log);
  };
};

export const updateUser = (owner, onErr = null) => {
  return async (dispatch) => {
    try {
      await Logic.user.updateUser(owner);
      dispatch(fetchCurrentUser());
    } catch (error) {
      console.log(error);
      onErr && onErr(error);
    }
  };
};

export const fetchCurrentOwner = () => {
  return (dispatch) => {
    Logic.config
      .getCurrentCompany()
      .then((response) => {
        dispatch({
          type: CURRENT_OWNER,
          payload: response.data,
        });
      })
      .catch(console.log);
  };
};

export const fetchBranchList = () => {
  return (dispatch) => {
    Logic.branch
      .fetchSelectBoxBranchList()
      .then((response) => {
        dispatch({
          type: COMMON_BRANCH_LIST,
          payload: [{ name: "Все", id: -1 }, ...response.data],
        });
      })
      .catch(console.log);
  };
};

export const setCommonBranchId = (branch) => {
  return (dispatch) => {
    dispatch({
      type: CURRENT_BRANCH,
      payload: branch,
    });
  };
};
