import {
    CONFIG_BUSINESS_TYPE,
    CONFIG_REGION_LIST,
    CONFIG_VAT_LIST,
    CONFIG_CITY_LIST,
    CONFIG_CITY_LIVING_LIST,
    CONFIG_ACTIVITY_TYPE,
    CONFIG_LOADING,
    CONFIG_POSITION_LIST,
    CONFIG_EMPLOYEE_LIST,
    CONFIG_BRANCH_LIST,
    CONFIG_CATALOG
} from '../reducer';

import Logic from '#businessLayer';

export const fetchBusinessTypes = () => {
    return dispatch => {
        Logic
            .config
            .fetchBusinessType()
            .then(response => {
                dispatch({
                    type: CONFIG_BUSINESS_TYPE,
                    payload: response.data
                })
            })
            .catch(error => { console.log(error) })
    }
};

export const fetchRegionList = () => {
    return dispatch => {
        Logic
            .resource
            .fetchRegions()
            .then(response => {
                dispatch({
                    type: CONFIG_REGION_LIST,
                    payload: response.data
                })
            })
    }
};

export const fetchVatList = () => {
    return dispatch => {
        Logic
            .user
            .fetchVatList()
            .then(response => {
                dispatch({
                    type: CONFIG_VAT_LIST,
                    payload: response.data
                })
            })
    }
}

export const fetchCityListForRegionId = (regionId) => {
    return dispatch => {
        Logic
            .resource
            .fetchCityForRegionId(regionId)
            .then(response => {
                dispatch({
                    type: CONFIG_CITY_LIST,
                    payload: response.data
                })
            })
            .catch(error => { console.log(error) })
    }
};

export const fetchCityListForRegionIdLivingAddress = (regionId) => {
    return dispatch => {
        Logic
            .resource
            .fetchCityForRegionId(regionId)
            .then(response => {
                dispatch({
                    type: CONFIG_CITY_LIVING_LIST,
                    payload: response.data
                })
            })
            .catch(error => { console.log(error) })
    }
};


export const fetchActivityTypeList = () => {
    return dispatch => {
        Logic
            .resource
            .fetchActivityTypeList()
            .then(response => {
                dispatch({
                    type: CONFIG_ACTIVITY_TYPE,
                    payload: response.data
                })
            })
            .catch(error => {})
    }
};

export const createCompany = (props, company) => {
    return dispatch => {
        dispatch({
            type: CONFIG_LOADING,
            payload: true
        });
        Logic
            .config
            .createCompany(company)
            .then(response => {
                dispatch({
                    type: CONFIG_LOADING,
                    payload: false
                });
                if (response.status < 400) {
                    props.navigateToNext && props.navigateToNext()
                }
            })
            .catch(error => {
                dispatch({
                    type: CONFIG_LOADING,
                    payload: false
                });
                if (error.response && error.response.status === 409) {
                    alert("Нельзя создать второго владельца!")
                }
            })
    }
};

export const updateCompany = (company, props) => {
    return dispatch => {
        dispatch({
            type: CONFIG_LOADING,
            payload: true
        });
        Logic
            .config
            .createCompany(company)
            .then(response => {
                dispatch({
                    type: CONFIG_LOADING,
                    payload: false
                });
                if (response.status < 400) {
                    props.update && props.update(true)
                }
            })
            .catch(error => {
                dispatch({
                    type: CONFIG_LOADING,
                    payload: false
                });
                if (error.response && error.response.status === 409) {
                    alert("Нельзя создать второго владельца!")
                }
            })
    }
};

export const fetchPositionList = () => {
    return dispatch => {
        Logic
            .resource
            .fetchAuthorities()
            .then(response => {
                dispatch({
                    type: CONFIG_POSITION_LIST,
                    payload: response.data
                })
            })
    }
};

export const createEmployee = (employee) => {
    return async dispatch =>  {
        dispatch({
            type: CONFIG_LOADING,
            payload: true
        });
        try {
            await Logic.config.addEmployee(employee);
            let response = await Logic.config.fetchUserList();
            if (response.status < 400) {
                dispatch({
                    type: CONFIG_EMPLOYEE_LIST,
                    payload: response.data.content
                })
            }
            dispatch({
                type: CONFIG_LOADING,
                payload: false
            });
        } catch(error) {
            if (error.response && error.response.status !== 401) {
                if (error.response.status === 409) {
                    alert("Пользователь с таким номером уже существует!")
                } else {
                    alert(error)
                }
            }
            dispatch({
                type: CONFIG_LOADING,
                payload: false
            });
        }
    }
};

export const createEmployeeFromDialog = (employee, props) => {
    return async dispatch =>  {
        dispatch({
            type: CONFIG_LOADING,
            payload: true
        });
        try {
            await Logic.config.addEmployee(employee)
            dispatch({
                type: CONFIG_LOADING,
                payload: false
            });
        } catch(error) {
            if (error.response && error.response.status !== 401) {
                if (error.response.status === 409) {
                    alert("Пользователь с таким номером уже существует!")
                } else {
                    alert("Что то пошло не так, обратитесь к администратору!")
                }
            }
            dispatch({
                type: CONFIG_LOADING,
                payload: false
            });
        }
    }
};

export const updateEmployee = (employee) => {
    return async dispatch => {
        dispatch({
            type: CONFIG_LOADING,
            payload: true
        });
        try {
            await Logic.config.updateUser(employee)
            let response = await Logic.config.fetchUserList();
            if (response.status < 400) {
                dispatch({
                    type: CONFIG_EMPLOYEE_LIST,
                    payload: response.data.content
                })
            }
            dispatch({
                type: CONFIG_LOADING,
                payload: false
            });
        } catch(error) {
            dispatch({
                type: CONFIG_LOADING,
                payload: false
            });
            if (error.response && error.response.status !== 401) {
                if (error.response.status === 409) {
                    alert("Пользователь с таким номером уже существует!")
                } else {
                    alert("Что то пошло не так, обратитесь к администратору!")
                }
            }
        }
    }
};

export const fetchUserList = () => {
    return dispatch => {
        Logic
            .config
            .fetchUserList()
            .then(response => {
                dispatch({
                    type: CONFIG_EMPLOYEE_LIST,
                    payload: response.data.content
                })
            })
            .catch(error => {})
    }
};

export const fetchBranchList = (page, size) => {
    return dispatch => {
        Logic
            .config
            .fetchBranchList(page, size)
            .then(response => {
                dispatch({
                    type: CONFIG_BRANCH_LIST,
                    payload: response.data.content
                })
            })
            .catch(error => {})
    }
};

export const createBranch = (branch) => {
    return async dispatch => {
        dispatch({
            type: CONFIG_LOADING,
            payload: true
        });
        try {
            await Logic.config.createBranch(branch);
            let response = await Logic.config.fetchBranchList();
            if (response.status < 400) {
                dispatch({
                    type: BRANCH_LIST,
                    payload: response.data.content
                })
            }
            dispatch({
                type: CONFIG_LOADING,
                payload: false
            });
        } catch(error) {
            if (error.response && error.response.status !== 401) {
                alert(error.message)
            }
            dispatch({
                type: CONFIG_LOADING,
                payload: false
            });
        }
    }
};

export const removeBranch = (branch) => {
    return async dispatch => {
        dispatch({
            type: CONFIG_LOADING,
            payload: true
        });
        try {
            await Logic.config.removeBranch(branch);
            let response = await Logic.config.fetchBranchList();
            if (response.status < 400) {
                dispatch({
                    type: CONFIG_BRANCH_LIST,
                    payload: response.data.content
                })
            }
            dispatch({
                type: CONFIG_LOADING,
                payload: false
            });
        } catch(error) {
            if (error.response && error.response.status !== 401) {
                alert(error.message)
            }
            dispatch({
                type: CONFIG_LOADING,
                payload: false
            });
        }
    }
};

export const editBranch = (branch) => {
    return  async dispatch => {
        dispatch({
            type: CONFIG_LOADING,
            payload: true
        });
        try {
            await Logic.config.editBranch(branch);
            let response = await Logic.config.fetchBranchList();
            if (response.status < 400) {
                dispatch({
                    type: CONFIG_BRANCH_LIST,
                    payload: response.data
                })
            }
            dispatch({
                type: CONFIG_LOADING,
                payload: false
            });
        } catch(error) {
            if (error.response && error.response.status !== 401) {
                alert(error.message)
            }
            dispatch({
                type: CONFIG_LOADING,
                payload: false
            });
        }
    }
};

export const fetchCatalogList = () => {
    return dispatch => {
        dispatch({
            type: CONFIG_LOADING,
            payload: true
        });
        Logic
            .config
            .fetchCatalogList()
            .then(response => {
                dispatch({
                    type: CONFIG_LOADING,
                    payload: false
                });
                if (response.status < 400) {
                    dispatch({
                        type: CONFIG_CATALOG,
                        payload: response.data
                    })
                }
            })
            .catch(error => {
                if (error.response.status !== 401) {
                    alert(error);
                    dispatch({
                        type: CONFIG_LOADING,
                        payload: false
                    })
                }
            })
    }
};

export const saveCategories = (categoryList) => {
    return dispatch => {
        dispatch({
            type: CONFIG_LOADING,
            payload: true
        });
        Logic
            .config
            .saveCategories(categoryList)
            .then(response => {
                dispatch({
                    type: CONFIG_LOADING,
                    payload: false
                });
                window.location = '/main'
            })
            .catch(error => {
                if (error.response.status !== 401) {
                    alert(error)
                    dispatch({
                        type: CONFIG_LOADING,
                        payload: false
                    })
                }
            })
    }
};

export const getCurrentOwner = () => {
    return dispatch => {
        dispatch({
            type: CONFIG_LOADING,
            payload: true
        });
        Logic
            .config
            .getCurrentCompany()
            .then(response => {
                if (response.data) {
                    window.location = '/main'
                }
                dispatch({
                    type: CONFIG_LOADING,
                    payload: false
                })
            })
            .catch(error => {
                if (error.response.status === 404) {
                    window.location = '/init-config';
                    dispatch({
                        type: CONFIG_LOADING,
                        payload: false
                    })
                } else if (error.response.status !== 401) {
                    alert(error);
                    dispatch({
                        type: CONFIG_LOADING,
                        payload: false
                    })
                }
            })
    }
};
