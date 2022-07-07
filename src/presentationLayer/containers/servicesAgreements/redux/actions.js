import Logic from "#businessLayer";
import axios from "axios";
import * as constants from "./constants";

let agreementsCancelToken = null;

export const getBranchesItems = () => {
  return (dispatch) => {
    dispatch({ type: constants.GET_SERVICE_BRANCHES_ITEMS });

    Logic.servicesAgreements
      .getBranchesItems()
      .then((response) => {
        dispatch({
          type: constants.GET_SERVICE_BRANCHES_ITEMS_SUCCESS,
          payload: response.data,
        });
      })
      .catch((error) => {
        dispatch({
          type: constants.GET_SERVICE_BRANCHES_ITEMS_ERROR,
          payload: error,
        });
      });
  };
};

export const getServiceAgreementsList = (params) => {
  return (dispatch) => {
    //agreementsCancelToken && agreementsCancelToken.cancel();
    agreementsCancelToken = axios.CancelToken.source();

    dispatch({ type: constants.GET_SERVICE_AGREEMENTS_LIST });

    Logic.servicesAgreements
      .getServiceAgreementsList(params, agreementsCancelToken.token)
      .then((response) => {
        dispatch({
          type: constants.GET_SERVICE_AGREEMENTS_LIST_SUCCESS,
          payload: response.data,
        });
      })
      .catch((error) => {
        dispatch({
          type: constants.GET_SERVICE_AGREEMENTS_LIST_ERROR,
          payload: error,
        });
      });
  };
};

export const updateServiceAgreementsListFilter = (payload) => {
  return {
    type: constants.UPDATE_SERVICE_AGREEMENTS_LIST_FILTER,
    payload,
  };
};

export const getServicesTariffs = (params) => {
  return (dispatch) => {
    dispatch({ type: constants.GET_SERVICES_TARIFFS });

    Logic.servicesAgreements
      .getServicesTariffs(params)
      .then((response) => {
        dispatch({
          type: constants.GET_SERVICES_TARIFFS_SUCCESS,
          payload: response.data,
        });
      })
      .catch((error) => {
        dispatch({
          type: constants.GET_SERVICES_TARIFFS_ERROR,
          payload: error,
        });
      });
  };
};
export const getBalance = (tin) => {
  return (dispatch) => {
    Logic.servicesAgreements
      .getBalance(tin)
      .then((response) => {
        dispatch({
          type: "SET_BALANCE",
          payload: response.data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
};

export const getBranchesCount = (params) => {
  return (dispatch) => {
    dispatch({ type: constants.GET_BRANCHES_COUNT });

    Logic.servicesAgreements
      .getBranchesCount(params)
      .then((response) => {
        dispatch({
          type: constants.GET_BRANCHES_COUNT_SUCCESS,
          payload: response.data,
        });
      })
      .catch((error) => {
        dispatch({ type: constants.GET_BRANCHES_COUNT_ERROR, payload: error });
      });
  };
};

// Public offer

export const getCustomerPublicOffer = (tin) => {
  return (dispatch) => {
    dispatch({ type: constants.GET_CUSTOMER_PUBLIC_OFFER });

    Logic.servicesAgreements
      .getCustomerPublicOffer(tin)
      .then((response) => {
        dispatch({
          type: constants.GET_CUSTOMER_PUBLIC_OFFER_SUCCESS,
          payload: response.data,
        });
      })
      .catch((error) => {
        dispatch({
          type: constants.GET_CUSTOMER_PUBLIC_OFFER_ERROR,
          payload: error,
        });
      });
  };
};

export const resetCustomerPublicOffer = () => {
  return {
    type: constants.RESET_CUSTOMER_PUBLIC_OFFER,
  };
};

export const getLastPublicOffer = () => {
  return (dispatch) => {
    dispatch({ type: constants.GET_LAST_PUBLIC_OFFER });

    Logic.servicesAgreements
      .getLastPublicOffer()
      .then((response) => {
        dispatch({
          type: constants.GET_LAST_PUBLIC_OFFER_SUCCESS,
          payload: response.data,
        });
      })
      .catch((error) => {
        dispatch({
          type: constants.GET_LAST_PUBLIC_OFFER_ERROR,
          payload: error,
        });
      });
  };
};

export const acceptPublicOffer = (data) => {
  return (dispatch) => {
    dispatch({ type: constants.ACCEPT_PUBLIC_OFFER });

    Logic.servicesAgreements
      .acceptPublicOffer(data)
      .then((response) => {
        dispatch({
          type: constants.ACCEPT_PUBLIC_OFFER_SUCCESS,
          payload: response.data,
        });
      })
      .catch((error) => {
        dispatch({ type: constants.ACCEPT_PUBLIC_OFFER_ERROR, payload: error });
      });
  };
};

export const resetAcceptPublicOffer = () => {
  return {
    type: constants.RESET_ACCEPT_PUBLIC_OFFER,
  };
};

// Create Agreement

export const createSubscribeAgreement = (data) => {
  return (dispatch) => {
    dispatch({ type: constants.CREATE_SUBSCRIBE_AGREEMENT, payload: data });

    Logic.servicesAgreements
      .createSubscribeAgreement(data)
      .then((response) => {
        dispatch({
          type: constants.CREATE_SUBSCRIBE_AGREEMENT_SUCCESS,
          payload: response.data,
        });
      })
      .catch((error) => {
        dispatch({
          type: constants.CREATE_SUBSCRIBE_AGREEMENT_ERROR,
          payload: error,
        });
      });
  };
};

export const resetCreateSubscribeAgreement = () => {
  return {
    type: constants.RESET_CREATE_SUBSCRIBE_AGREEMENT,
  };
};

export const createCustomAgreement = (data) => {
  return (dispatch) => {
    dispatch({ type: constants.CREATE_CUSTOM_AGREEMENT, payload: data });

    Logic.servicesAgreements
      .createCustomAgreement(data)
      .then((response) => {
        dispatch({
          type: constants.CREATE_CUSTOM_AGREEMENT_SUCCESS,
          payload: response.data,
        });
      })
      .catch((error) => {
        dispatch({
          type: constants.CREATE_CUSTOM_AGREEMENT_ERROR,
          payload: error,
        });
      });
  };
};

export const resetCreateCustomAgreement = () => {
  return {
    type: constants.RESET_CREATE_CUSTOM_AGREEMENT,
  };
};

export const getServiceAgreementDetails = (id) => {
  return (dispatch) => {
    dispatch({ type: constants.GET_SERVICE_AGREEMENT_DETAILS });

    Logic.servicesAgreements
      .getServiceAgreementDetails(id)
      .then((response) => {
        dispatch({
          type: constants.GET_SERVICE_AGREEMENT_DETAILS_SUCCESS,
          payload: response.data,
        });
      })
      .catch((error) => {
        dispatch({
          type: constants.GET_SERVICE_AGREEMENT_DETAILS_ERROR,
          payload: error,
        });
      });
  };
};

export const resetServiceAgreementDetails = () => {
  return {
    type: constants.RESET_SERVICE_AGREEMENT_DETAILS,
  };
};

export const updateAgreementServiceDesc = (data) => {
  return (dispatch) => {
    dispatch({ type: constants.UPDATE_AGREEMENT_SERVICE_DESC, payload: data });

    Logic.servicesAgreements
      .updateAgreementServiceDesc(data)
      .then((response) => {
        dispatch({
          type: constants.UPDATE_AGREEMENT_SERVICE_DESC_SUCCESS,
          payload: response.data,
        });
      })
      .catch((error) => {
        dispatch({
          type: constants.UPDATE_AGREEMENT_SERVICE_DESC_ERROR,
          payload: error,
        });
      });
  };
};

export const resetUpdateAgreementServiceDesc = () => {
  return {
    type: constants.RESET_UPDATE_AGREEMENT_SERVICE_DESC,
  };
};

export const uploadAgreementFile = (data) => {
  return (dispatch) => {
    dispatch({ type: constants.UPLOAD_AGREEMENT_FILE, payload: data });

    Logic.servicesAgreements
      .uploadAgreementFile(data)
      .then((response) => {
        dispatch({
          type: constants.UPLOAD_AGREEMENT_FILE_SUCCESS,
          payload: response.data,
        });
      })
      .catch((error) => {
        dispatch({
          type: constants.UPLOAD_AGREEMENT_FILE_ERROR,
          payload: error,
        });
      });
  };
};

export const resetUploadAgreementFile = () => {
  return {
    type: constants.RESET_UPLOAD_AGREEMENT_FILE,
  };
};

// QUOTE start

export const fetchQuoteDetails = (quoteId) => {
  const qD = { loading: false, data: null, error: undefined };
  return (dispatch) => {
    dispatch({ type: "SET_QUOTE_DETAILS", payload: { ...qD, loading: true } });

    Logic.servicesAgreements
      .fetchQuoteDetails(quoteId)
      .then((response) => {
        dispatch({
          type: "SET_QUOTE_DETAILS",
          payload: { ...qD, data: response.data, loading: false },
        });
      })
      .catch((error) => {
        dispatch({ type: "SET_QUOTE_DETAILS", payload: { ...qD, error } });
      });
  };
};
export const fetchGeneratedQuote = (quoteId) => {
  const qD = { loading: false, data: null, error: undefined };
  return (dispatch) => {
    dispatch({
      type: "SET_GENERATED_QUOTE",
      payload: { ...qD, loading: true },
    });

    Logic.servicesAgreements
      .fetchGeneratedQuote(quoteId)
      .then((response) => {
        dispatch({
          type: "SET_GENERATED_QUOTE",
          payload: { ...qD, data: response.data, loading: false },
        });
      })
      .catch((error) => {
        dispatch({ type: "SET_GENERATED_QUOTE", payload: { ...qD, error } });
      });
  };
};

export const changeQuoteStatus = (data, onSuccess = null, onError = null) => {
  return (dispatch) => {
    dispatch({
      type: "SET_QUOTE_LOADING",
      payload: true,
    });

    Logic.servicesAgreements
      .changeQuoteStatus(data)
      .then((response) => {
        dispatch(fetchQuoteDetails(data.id));
        onSuccess && onSuccess();
      })
      .catch((error) => {
        onError && onError(error);
      })
      .finally(() =>
        dispatch({
          type: "SET_QUOTE_LOADING",
          payload: false,
        })
      );
  };
};

export const uploadQuoteFile = (data, onSuccess = null, onError = null) => {
  return (dispatch) => {
    dispatch({
      type: "SET_QUOTE_LOADING",
      payload: true,
    });

    Logic.servicesAgreements
      .uploadQuoteFile(data)
      .then((response) => {
        onSuccess && onSuccess();
      })
      .catch((error) => {
        onError && onError(error);
      })
      .finally(() =>
        dispatch({
          type: "SET_QUOTE_LOADING",
          payload: false,
        })
      );
  };
};
// end

// report actions start >>>

export const fetchDataEntryByAgreementId = (agreementId, onError = null) => {
  return (dispatch) => {
    dispatch({
      type: "SET_REPORT_LOADING",
      payload: true,
    });

    Logic.servicesAgreements
      .fetchDataEntryByAgreementId(agreementId)
      .then((response) => {
        dispatch({
          type: "SET_DATA_ENTRY",
          payload: response.data,
        });
      })
      .catch((error) => {
        onError && onError(error);
      })
      .finally(() =>
        dispatch({
          type: "SET_REPORT_LOADING",
          payload: false,
        })
      );
  };
};

export const ApproveDataEntryStatus = (
  data,
  onSuccess = null,
  onError = null
) => {
  return (dispatch) => {
    dispatch({
      type: "SET_REPORT_LOADING",
      payload: true,
    });

    Logic.servicesAgreements
      .ApproveDataEntryStatus(data)
      .then((response) => {
        onSuccess && onSuccess();
      })
      .catch((error) => {
        onError && onError(error);
      })
      .finally(() =>
        dispatch({
          type: "SET_REPORT_LOADING",
          payload: false,
        })
      );
  };
};

// end

// Public Offer start >>>

export const fetchCustomerPublicOffer = (agreementId, onError = null) => {
  return (dispatch) => {
    dispatch({
      type: "SET_PUBLIC_OFFER_LOADING",
      payload: true,
    });

    Logic.servicesAgreements
      .fetchCustomerPublicOffer(agreementId)
      .then((response) => {
        dispatch({
          type: "SET_PUBLIC_OFFER_DATA",
          payload: response.data,
        });
      })
      .catch((error) => {
        onError && onError(error);
      })
      .finally(() =>
        dispatch({
          type: "SET_PUBLIC_OFFER_LOADING",
          payload: false,
        })
      );
  };
};

// end

// Agreement invoices start >>>

export const fetchAgreementInvoices = (data, onError = null) => {
  return (dispatch) => {
    dispatch({
      type: "SET_AGREEMENT_INVOICES_LOADING",
      payload: true,
    });

    Logic.servicesAgreements
      .fetchAgreementInvoices(data)
      .then((response) => {
        dispatch({
          type: "SET_AGREEMENT_INVOICES_DATA",
          payload: response.data,
        });
      })
      .catch((error) => {
        onError && onError(error);
      })
      .finally(() =>
        dispatch({
          type: "SET_AGREEMENT_INVOICES_LOADING",
          payload: false,
        })
      );
  };
};

export const fetchGeneratedInvoice = (invoiceId, onError = null) => {
  return (dispatch) => {
    dispatch({
      type: "SET_GENERATED_INVOICES_LOADING",
      payload: true,
    });

    Logic.servicesAgreements
      .fetchGeneratedInvoice(invoiceId)
      .then((response) => {
        dispatch({
          type: "SET_GENERATED_INVOICES_DATA",
          payload: response.data,
        });
      })
      .catch((error) => {
        onError && onError(error);
      })
      .finally(() =>
        dispatch({
          type: "SET_GENERATED_INVOICES_LOADING",
          payload: false,
        })
      );
  };
};

// end
