import Logic from "#businessLayer";
import {
  CHEQUE_LIST_LOADING,
  CHEQUE_LIST,
  CHEQUE_LIST_STATUS,
  SELECTED_CHEQUE,
  CHEQUE_LOADING,
  CHEQUE_LIST_DATE,
  DRAFT_CHEQUES_FLAG,
  CHEQUES_PAYMENT_TYPES,
  CHEQUE_STATS,
  CHEQUE_LIST_EMPLOYEE,
  CHEQUE_LIST_OPERATION,
  CHEQUE_LIST_PT,
  CHEQUE_LIST_SORT,
  CHEQUE_LIST_TERMINAL,
  TERMINALS_LIST,
} from "../reducer";
import FileDownload from "js-file-download";
import moment from "moment";

export const setSort = (sort) => ({
  type: CHEQUE_LIST_SORT,
  payload: sort,
});

export const setPaymentType = (paymentType) => ({
  type: CHEQUE_LIST_PT,
  payload: paymentType,
});

export const setOperation = (operation) => ({
  type: CHEQUE_LIST_OPERATION,
  payload: operation,
});

export const setTerminal = (terminal) => ({
  type: CHEQUE_LIST_TERMINAL,
  payload: terminal,
});

export const setEmployeeId = (employeeId) => ({
  type: CHEQUE_LIST_EMPLOYEE,
  payload: employeeId,
});

export const fetchChequeList = ({
  page,
  size,
  branchId,
  sort,
  search,
  from,
  to,
  status,
  terminalId,
  paymentTypes,
  userId,
}) => {
  return (dispatch) => {
    dispatch({
      type: CHEQUE_LIST_LOADING,
      payload: true,
    });
    Logic.report
      .fetchChequeList({
        page,
        size,
        branchId,
        orderBy: sort ? sort.col : undefined,
        sortOrder: sort ? sort.order : undefined,
        search,
        terminalId,
        from,
        to,
        status,
        paymentTypes,
        userId,
      })
      .then((response) => {
        dispatch({
          type: CHEQUE_LIST_LOADING,
          payload: false,
        });
        dispatch({
          type: CHEQUE_LIST,
          payload: response.data,
        });
      })
      .catch((error) => {
        dispatch({
          type: CHEQUE_LIST_LOADING,
          payload: false,
        });
        console.log(error);
      });
  };
};

const paymentTypes = {
  CASH: "Наличные",
  CARD: "Карта",
  UZCARD: "UZCARD",
  HUMO: "HUMO",
  LOYALTY_CARD: "Карта лояльности",
  NDS: "НДС",
  DISCOUNT: "Акции",
  EXCISE: "Акциз",
  OTHER: "Другое",
};

export const deleteChequeById = (id, filter) => {
  return (dispatch) => {
    Logic.cheque.deleteChequeById(id).then(() => {
      dispatch(fetchChequeList(filter));
    });
  };
};

export const fetchPaymentTypes = () => {
  return (dispatch) => {
    Logic.report
      .fetchPaymentTypes()
      .then((response) => {
        dispatch({
          type: CHEQUES_PAYMENT_TYPES,
          payload: response.data.map((pt) => ({
            key: pt,
            value: paymentTypes[pt],
          })),
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
};

export const fetchChequeStatuses = () => {
  return (dispatch) => {
    Logic.report
      .fetchChequeStatus()
      .then((response) => {
        dispatch({
          type: CHEQUE_LIST_STATUS,
          payload: response.data,
        });
      })
      .catch(console.log);
  };
};

export const fetchTerminals = (filter) => {
  return (dispatch) => {
    Logic.report
      .fetchTerminals(filter)
      .then((response) => {
        dispatch({
          type: TERMINALS_LIST,
          payload: response.data ? response.data.data : undefined,
        });
      })
      .catch(console.log);
  };
};

export const fetchChequeById = (id) => {
  return (dispatch) => {
    if (id) {
      dispatch({
        type: CHEQUE_LOADING,
        payload: true,
      });
      Logic.report
        .fetchChequeById(id)
        .then((response) => {
          dispatch({
            type: SELECTED_CHEQUE,
            payload: response.data,
          });
          dispatch({
            type: CHEQUE_LOADING,
            payload: false,
          });
        })
        .catch((error) => {
          alert(error);
          dispatch({
            type: CHEQUE_LOADING,
            payload: false,
          });
        });
    } else {
      dispatch({
        type: SELECTED_CHEQUE,
        payload: undefined,
      });
    }
  };
};

export const setDate = (date) => {
  return (dispatch) => {
    dispatch({
      type: CHEQUE_LIST_DATE,
      payload: date,
    });
  };
};

export const setDraftCheques = (flag) => {
  return (dispatch) => {
    dispatch({
      type: DRAFT_CHEQUES_FLAG,
      payload: flag,
    });
  };
};

export const fetchReceiptStats = (filter) => {
  return (dispatch) => {
    Logic.report.receiptStats(filter).then((response) => {
      dispatch({
        type: CHEQUE_STATS,
        payload: response.data,
      });
    });
  };
};

export const downloadChequeList = (filter) => {
  return () => {
    Logic.excel
      .chequeList(filter)
      .then((response) => {
        FileDownload(
          response.data,
          `Чеки-${moment().format("YYYY/MM/DD")}.xlsx`
        );
      })
      .catch(console.log);
  };
};
