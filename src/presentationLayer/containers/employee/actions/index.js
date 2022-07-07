import LogicContainer from "#businessLayer";
import {
  EMPLOYEE_LIST_LOADING,
  CASHIERS,
  EMPLOYEE,
  EMPLOYEE_LIST,
  EMPLOYEE_LOADING,
  EMPLOYEE_STATS,
  EMPLOYEE_ERROR,
  EMPLOYEE_ROLE,
  POSITION_LIST,
  EMPLOYEE_LIST_SORT,
} from "../redux";

export const setSort = (sort) => ({
  type: EMPLOYEE_LIST_SORT,
  payload: sort,
});

export const setRole = (role) => ({
  type: EMPLOYEE_ROLE,
  payload: role,
});

export const fetchEmployeeList = (page, size, role, branchId, sort) => {
  return (dispatch) => {
    let dismissed = role === "DISMISSED";
    dispatch({
      type: EMPLOYEE_LIST_LOADING,
      payload: true,
    });
    LogicContainer.employee
      .fetchEmployeeList({
        page,
        size,
        roles: role !== "ALL" && role !== "DISMISSED" ? role : undefined,
        branchId,
        orderBy: sort ? sort.col : undefined,
        sortOrder: sort ? sort.order : undefined,
        dismissed,
      })
      .then((response) => {
        dispatch({
          type: EMPLOYEE_LIST,
          payload: response.data,
        });
        dispatch({
          type: EMPLOYEE_LIST_LOADING,
          payload: false,
        });
      })
      .catch((error) => {
        dispatch({
          type: EMPLOYEE_LIST_LOADING,
          payload: false,
        });
        console.log(error);
      });
  };
};

export const fetchCashiers = (branchId) => {
  return (dispatch) => {
    LogicContainer.employee
      .fetchCashiers(branchId)
      .then((response) => {
        dispatch({
          type: CASHIERS,
          payload: response.data.content,
        });
      })
      .catch(console.log);
  };
};
export const updateEmployee = (employee, props) => {
  return async (dispatch) => {
    dispatch({
      type: EMPLOYEE_LOADING,
      payload: true,
    });
    LogicContainer.employee
      .updateEmployee(employee)
      .then((response) => {
        if (response.status < 400) {
          props.onClose && props.onClose(true);
        }
        dispatch({
          type: EMPLOYEE_LOADING,
          payload: false,
        });
      })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          dispatch({
            type: EMPLOYEE_ERROR,
            payload: "Такой номер уже существует!",
          });
        } else {
          dispatch({
            type: EMPLOYEE_ERROR,
            payload: error.message,
          });
        }
        dispatch({
          type: EMPLOYEE_LOADING,
          payload: false,
        });
      });
  };
};

export const dismissEmployee = (id, props) => {
  return (_) => {
    LogicContainer.employee
      .dismissEmployee(id)
      .then((_) => {
        props.history && props.history.goBack();
      })
      .catch(console.log);
  };
};

export const createEmployee = (employee, props) => {
  return async (dispatch) => {
    dispatch({
      type: EMPLOYEE_LOADING,
      payload: true,
    });
    LogicContainer.employee
      .createEmployee(employee)
      .then((response) => {
        if (response.status < 400) {
          props.onClose(true);
          dispatch({
            type: EMPLOYEE_LOADING,
            payload: false,
          });
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          dispatch({
            type: EMPLOYEE_ERROR,
            payload: "Такой номер уже существует!",
          });
        } else {
          dispatch({
            type: EMPLOYEE_ERROR,
            payload: error.message,
          });
        }
        dispatch({
          type: EMPLOYEE_LOADING,
          payload: false,
        });
      });
  };
};

export const fetchEmployeeById = (id) => {
  return (dispatch) => {
    LogicContainer.employee
      .fetchEmployeeForId(id)
      .then((response) => {
        dispatch({
          type: EMPLOYEE,
          payload: response.data,
        });
      })
      .catch(console.log);
  };
};

export const fetchEmployeeStats = (id) => {
  return (dispatch) => {
    LogicContainer.employee
      .employeeStats(id)
      .then((response) => {
        console.log("response", response);
        dispatch({
          type: EMPLOYEE_STATS,
          payload: response.data,
        });
      })
      .catch(console.log);
  };
};

export const fetchPositionList = () => {
  return (dispatch) => {
    LogicContainer.resource
      .fetchPositionList()
      .then((response) => {
        dispatch({
          type: POSITION_LIST,
          payload: response.data,
        });
      })
      .catch(console.log);
  };
};

export const clearError = () => {
  return {
    type: EMPLOYEE_ERROR,
    payload: "",
  };
};
