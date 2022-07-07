import Logic from "#businessLayer";
import * as constants from "../constants";

// Orders-list
export const getOrdersListAction = (params) => {
  return dispatch => {
    dispatch({
      type: constants.GET_ORDERS_LIST_LOADING
    });
    Logic
      .ordersList
      .getOrdersList(params)
      .then(response => {
        dispatch({
          type: constants.GET_ORDERS_LIST,
          payload: response.data
        })
      })
      .catch(error => {
        dispatch({
          type: constants.GET_ORDERS_LIST_ERROR,
          payload: error.response.data
        });
      })
  }
};

export const updateOrdersListAction = (params) => {
  return dispatch => {
    dispatch({
      type: constants.UPDATE_ORDERS_LIST_FILTER_PROPS,
      payload: params
    });
  }
};

export const syncInvoicesAction = () => {
  return dispatch => {
    dispatch({
      type: constants.SYNC_INVOICES_LOADING
    });
    Logic
      .ordersList
      .syncInvoices()
      .then(response => {
        dispatch({
          type: constants.SYNC_INVOICES,
          payload: response
        })
      })
      .catch(error => {
        dispatch({
          type: constants.SYNC_INVOICES_ERROR,
          payload: error.response.data
        });
      })
  }
};

export const resetSyncInvoicesAction = () => {
  return dispatch => {
    dispatch({
      type: constants.RESET_SYNC_INVOICES,
    });
  }
};

export const downloadXlsAction = (params) => {
  return dispatch => {
    dispatch({
      type: constants.DOWNLOAD_XLS_LOADING
    });
    Logic
      .ordersList
      .downloadXls(params)
      .then(response => {
        dispatch({
          type: constants.DOWNLOAD_XLS,
          payload: response
        })
      })
      .catch(error => {
        dispatch({
          type: constants.DOWNLOAD_XLS_ERROR,
          payload: error.response.data
        });
      })
  }
};

export const resetDownloadXlsAction = () => {
  return dispatch => {
    dispatch({
      type: constants.RESET_DOWNLOAD_XLS,
    });
  }
};

export const getOrderStatusesAction = () => {
  return dispatch => {
    Logic
      .ordersList
      .getOrderStatuses()
      .then(response => {
        dispatch({
          type: constants.GET_ORDER_STATUSES,
          payload: response.data
        })
      })
      .catch(error => {
        dispatch({
          type: constants.GET_ORDER_STATUSES_ERROR,
          payload: error.response.data
        });
      })
  }
};

export const getOrderSubStatusesAction = (group) => {
  return dispatch => {
    Logic
      .ordersList
      .getOrderSubStatuses(group)
      .then(response => {
        dispatch({
          type: constants.GET_ORDER_SUB_STATUSES,
          payload: response.data
        })
      })
      .catch(error => {
        dispatch({
          type: constants.GET_ORDER_SUB_STATUSES_ERROR,
          payload: error.response.data
        });
      })
  }
};

export const resetOrderSubStatusesAction = () => {
  return dispatch => {
    dispatch({
      type: constants.RESET_ORDER_SUB_STATUSES,
    });
  }
};

export const getSuppliersItemsAction = (params) => {
  return dispatch => {
    dispatch({
      type: constants.GET_SUPPLIERS_ITEMS_LOADING,
      payload: params
    });
    Logic
      .ordersList
      .getSuppliersItemsList(params)
      .then(response => {
        dispatch({
          type: constants.GET_SUPPLIERS_ITEMS,
          payload: response.data
        })
      })
      .catch(error => {
        dispatch({
          type: constants.GET_SUPPLIERS_ITEMS_ERROR,
          payload: error.response.data
        });
      })
  }
};

// Orders-details
export const getOrderDetailsAction = (params) => {
  return dispatch => {
    dispatch({
      type: constants.GET_ORDER_DETAILS_LOADING,
      payload: params
    });
    Logic
      .ordersList
      .getOrderDetailsList(params)
      .then(response => {
        dispatch({
          type: constants.GET_ORDER_DETAILS,
          payload: response.data
        })
      })
      .catch(error => {
        dispatch({
          type: constants.GET_ORDER_DETAILS_ERROR,
          payload: {
            params,
            ...error.response.data
          }
        });
      })
  }
};

export const resetOrderDetailsAction = () => {
  return dispatch => {
    dispatch({
      type: constants.RESET_ORDER_DETAILS,
    });
  }
};

export const confirmOrderAction = (params) => {
  return dispatch => {
    dispatch({
      type: constants.CONFIRM_ORDER_LOADING,
      payload: params
    });
    Logic
      .ordersList
      .confirmOrder(params)
      .then(response => {
        dispatch({
          type: constants.CONFIRM_ORDER,
          payload: response.data
        })
      })
      .catch(error => {
        dispatch({
          type: constants.CONFIRM_ORDER_ERROR,
          payload: {
            params,
            ...error.response.data
          }
        });
      })
  }
};

export const resetConfirmOrderAction = () => {
  return dispatch => {
    dispatch({
      type: constants.RESET_CONFIRM_ORDER,
    });
  }
};

export const rejectOrderAction = (params) => {
  return dispatch => {
    dispatch({
      type: constants.REJECT_ORDER_LOADING,
      payload: params
    });
    Logic
      .ordersList
      .rejectOrder(params)
      .then(response => {
        dispatch({
          type: constants.REJECT_ORDER,
          payload: response.data
        })
      })
      .catch(error => {
        dispatch({
          type: constants.REJECT_ORDER_ERROR,
          payload: {
            params,
            ...error.response.data
          }
        });
      })
  }
};

export const resetRejectOrderAction = () => {
  return dispatch => {
    dispatch({
      type: constants.RESET_REJECT_ORDER,
    });
  }
};

export const getContractDetailsAction = (params) => {
  return dispatch => {
    dispatch({
      type: constants.GET_CONTRACT_DETAILS_LOADING,
      payload: params
    });
    Logic
      .ordersList
      .getContractDetails(params)
      .then(response => {
        dispatch({
          type: constants.GET_CONTRACT_DETAILS,
          payload: response.data
        })
      })
      .catch(error => {
        dispatch({
          type: constants.GET_CONTRACT_DETAILS_ERROR,
          payload: {
            params,
            ...error.response.data
          }
        });
      })
  }
};

export const confirmContractAction = (params) => {
  return dispatch => {
    dispatch({
      type: constants.CONFIRM_CONTRACT_LOADING
    });
    Logic
      .ordersList
      .confirmContract(params)
      .then(() => {
        dispatch({
          type: constants.CONFIRM_CONTRACT,
        })
      })
      .catch(error => {
        dispatch({
          type: constants.CONFIRM_CONTRACT_ERROR,
          payload: error.response.data
        });
      })
  }
};

export const resetConfirmContractAction = () => {
  return dispatch => {
    dispatch({
      type: constants.RESET_CONFIRM_CONTRACT,
    });
  }
};

export const rejectContractAction = (params) => {
  return dispatch => {
    dispatch({
      type: constants.REJECT_CONTRACT_LOADING
    });
    Logic
      .ordersList
      .rejectContract(params)
      .then(() => {
        dispatch({
          type: constants.REJECT_CONTRACT,
        })
      })
      .catch(error => {
        dispatch({
          type: constants.REJECT_CONTRACT_ERROR,
          payload: error.response.data
        });
      })
  }
};

export const resetRejectContractAction = () => {
  return dispatch => {
    dispatch({
      type: constants.RESET_REJECT_CONTRACT,
    });
  }
};

export const expiredContractAction = (params) => {
  return dispatch => {
    dispatch({
      type: constants.EXPIRED_CONTRACT_LOADING
    });
    Logic
      .ordersList
      .expiredContract(params)
      .then(() => {
        dispatch({
          type: constants.EXPIRED_CONTRACT,
        })
      })
      .catch(error => {
        dispatch({
          type: constants.EXPIRED_CONTRACT_ERROR,
          payload: error.response.data
        });
      })
  }
};

export const resetExpiredContractAction = () => {
  return dispatch => {
    dispatch({
      type: constants.RESET_EXPIRED_CONTRACT,
    });
  }
};

export const getInvoicePaymentDetailsAction = (params) => {
  return dispatch => {
    dispatch({
      type: constants.GET_INVOICE_PAYMENT_DETAILS_LOADING,
      payload: params
    });
    Logic
      .ordersList
      .getInvoicePaymentDetails(params)
      .then(response => {
        dispatch({
          type: constants.GET_INVOICE_PAYMENT_DETAILS,
          payload: response.data
        })
      })
      .catch(error => {
        dispatch({
          type: constants.GET_INVOICE_PAYMENT_DETAILS_ERROR,
          payload: {
            params,
            ...error.response.data
          }
        });
      })
  }
};

export const confirmInvoicePaymentAction = (params) => {
  return dispatch => {
    dispatch({
      type: constants.CONFIRM_INVOICE_PAYMENT_LOADING
    });
    Logic
      .ordersList
      .confirmInvoicePayment(params)
      .then(() => {
        dispatch({
          type: constants.CONFIRM_INVOICE_PAYMENT,
        })
      })
      .catch(error => {
        dispatch({
          type: constants.CONFIRM_INVOICE_PAYMENT_ERROR,
          payload: error.response.data
        });
      })
  }
};

export const resetConfirmInvoicePaymentAction = () => {
  return dispatch => {
    dispatch({
      type: constants.RESET_CONFIRM_INVOICE_PAYMENT,
    });
  }
};

export const getPowerOfAttorneyDetailsAction = (params) => {
  return dispatch => {
    dispatch({
      type: constants.GET_POWER_OF_ATTORNEY_DETAILS_LOADING,
      payload: params
    });
    Logic
      .ordersList
      .getPowerOfAttorneyDetails(params)
      .then(response => {
        dispatch({
          type: constants.GET_POWER_OF_ATTORNEY_DETAILS,
          payload: response.data
        })
      })
      .catch(error => {
        dispatch({
          type: constants.GET_POWER_OF_ATTORNEY_DETAILS_ERROR,
          payload: {
            params,
            ...error.response.data
          }
        });
      })
  }
};

export const getCurrentResponsiblePersonItemsAction = (params) => {
  return dispatch => {
    Logic
      .ordersList
      .getCurrentResponsiblePersonItems(params)
      .then(response => {
        dispatch({
          type: constants.GET_CURRENT_RESPONSIBLE_PERSON_ITEMS,
          payload: response.data
        })
      })
  }
};

export const createPowerOfAttorneyAction = (params) => {
  return dispatch => {
    dispatch({
      type: constants.CREATE_POWER_OF_ATTORNEY_LOADING
    });
    Logic
      .ordersList
      .createPowerOfAttorney(params)
      .then(() => {
        dispatch({
          type: constants.CREATE_POWER_OF_ATTORNEY,
        })
      })
      .catch(error => {
        dispatch({
          type: constants.CREATE_POWER_OF_ATTORNEY_ERROR,
          payload: error.response.data
        });
      })
  }
};

export const resetCreatePowerOfAttorneyAction = () => {
  return dispatch => {
    dispatch({
      type: constants.RESET_CREATE_POWER_OF_ATTORNEY,
    });
  }
};

export const receiveOrderAction = (params) => {
  return dispatch => {
    dispatch({
      type: constants.RECEIVE_ORDER_LOADING
    });
    Logic
      .ordersList
      .receiveOrder(params)
      .then(() => {
        dispatch({
          type: constants.RECEIVE_ORDER,
        })
      })
      .catch(error => {
        dispatch({
          type: constants.RECEIVE_ORDER_ERROR,
          payload: error.response.data
        });
      })
  }
};

export const resetReceiveOrderAction = () => {
  return dispatch => {
    dispatch({
      type: constants.RESET_RECEIVE_ORDER,
    });
  }
};

export const getInvoiceDetailsAction = (params) => {
  return dispatch => {
    dispatch({
      type: constants.GET_INVOICE_DETAILS_LOADING,
      payload: params
    });
    Logic
      .ordersList
      .getInvoiceDetails(params)
      .then(response => {
        dispatch({
          type: constants.GET_INVOICE_DETAILS,
          payload: response.data
        })
      })
      .catch(error => {
        dispatch({
          type: constants.GET_INVOICE_DETAILS_ERROR,
          payload: {
            params,
            ...error.response.data
          }
        });
      })
  }
};

export const checkInvoiceStatusAction = (id) => {
  return dispatch => {
    dispatch({
      type: constants.CHECK_INVOICE_STATUS_LOADING
    });
    Logic
      .ordersList
      .checkInvoiceStatus(id)
      .then(response => {
        dispatch({
          type: constants.CHECK_INVOICE_STATUS,
          payload: response
        })
      })
      .catch(error => {
        dispatch({
          type: constants.CHECK_INVOICE_STATUS_ERROR,
          payload: error.response.data
        });
      })
  }
};

export const resetCheckInvoiceStatusAction = () => {
  return dispatch => {
    dispatch({
      type: constants.RESET_CHECK_INVOICE_STATUS,
    });
  }
};