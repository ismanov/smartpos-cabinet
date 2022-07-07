import produce from "immer";
import * as constants from "../constants";
import { PageableList } from "../../../../../../utils/pageable-list";

const moment = require('moment');
const dateFormat = "YYYY-MM-DDTHH:mm:ss";

const initialState = {
  ordersList: {
    loading: false,
    data: new PageableList(),
    error: null
  },
  ordersListFilterProps: {
    from: moment().subtract(1, 'month').startOf('day').format(dateFormat),
    to: moment().endOf('day').format(dateFormat),
  },
  syncInvoices: {
    loading: false,
    success: false,
    error: null
  },
  downloadXls: {
    loading: false,
    data: null,
    filename: null,
    error: null
  },
  orderStatuses: [],
  orderSubStatuses: [],
  suppliersItems: {
    loading: false,
    data: [],
    error: null
  },
  orderDetails: {
    loading: false,
    data: {},
    error: null
  },
  confirmOrder: {
    loading: false,
    success: false,
    error: null
  },
  rejectOrder: {
    loading: false,
    success: false,
    error: null
  },
  contractDetails: {
    loading: false,
    data: {},
    error: null
  },
  confirmContract: {
    loading: false,
    success: false,
    error: null
  },
  rejectContract: {
    loading: false,
    success: false,
    error: null
  },
  expiredContract: {
    loading: false,
    success: false,
    error: null
  },
  invoicePaymentDetails: {
    loading: false,
    data: {},
    error: null
  },
  confirmInvoicePayment: {
    loading: false,
    success: false,
    error: null
  },
  powerOfAttorneyDetails: {
    loading: false,
    data: {},
    error: null
  },
  currentResponsiblePersonItems: [],
  createPowerOfAttorney: {
    loading: false,
    success: false,
    error: null
  },
  receiveOrder: {
    loading: false,
    success: false,
    error: null
  },
  invoiceDetails: {
    loading: false,
    data: {},
    error: null
  },
  checkInvoiceStatus: {
    loading: false,
    success: false,
    error: null
  }
};

const reducer = (state = initialState, action) => {
  switch(action.type) {
    case constants.GET_ORDERS_LIST_LOADING:
      return produce(state, draftState => {
        draftState.ordersList.loading = true
      });
    case constants.GET_ORDERS_LIST:
      return produce(state, draftState => {
        draftState.ordersList = {
          loading: false,
          data: action.payload,
          error: null
        }
      });
    case constants.GET_ORDERS_LIST_ERROR:
      return produce(state, draftState => {
        draftState.ordersList = {
          loading: false,
          data: new PageableList(),
          error: action.payload
        }
      });
    case constants.UPDATE_ORDERS_LIST_FILTER_PROPS:
      return produce(state, draftState => {
        draftState.ordersListFilterProps = {
          ...state.ordersListFilterProps,
          ...action.payload
        }
      });
    case constants.SYNC_INVOICES_LOADING:
      return produce(state, draftState => {
        draftState.syncInvoices.loading = true;
      });
    case constants.SYNC_INVOICES:
      return produce(state, draftState => {
        draftState.syncInvoices = {
          loading: false,
          success: true,
          error: null
        }
      });
    case constants.SYNC_INVOICES_ERROR:
      return produce(state, draftState => {
        draftState.syncInvoices = {
          loading: false,
          success: false,
          error: action.payload
        }
      });
    case constants.RESET_SYNC_INVOICES:
      return produce(state, draftState => {
        draftState.syncInvoices = initialState.syncInvoices;
      });
    case constants.DOWNLOAD_XLS_LOADING:
      return produce(state, draftState => {
        draftState.downloadXls.loading = true;
      });
    case constants.DOWNLOAD_XLS:
      return produce(state, draftState => {
        draftState.downloadXls = {
          loading: false,
          data: action.payload.data,
          filename: action.payload.headers["content-disposition"],
          error: null
        }
      });
    case constants.DOWNLOAD_XLS_ERROR:
      return produce(state, draftState => {
        draftState.downloadXls = {
          loading: false,
          data: null,
          filename: null,
          error: action.payload
        }
      });
    case constants.RESET_DOWNLOAD_XLS:
      return produce(state, draftState => {
        draftState.downloadXls = initialState.downloadXls;
      });
    case constants.GET_ORDER_STATUSES:
      return produce(state, draftState => {
        draftState.orderStatuses = action.payload
      });
    case constants.GET_ORDER_SUB_STATUSES:
      return produce(state, draftState => {
        draftState.orderSubStatuses = action.payload
      });
    case constants.RESET_ORDER_SUB_STATUSES:
      return produce(state, draftState => {
        draftState.orderSubStatuses = initialState.orderSubStatuses
      });
    case constants.GET_SUPPLIERS_ITEMS_LOADING:
      return produce(state, draftState => {
        draftState.suppliersItems.loading = true;
      });
    case constants.GET_SUPPLIERS_ITEMS:
      return produce(state, draftState => {
        draftState.suppliersItems = {
          loading: false,
          data: action.payload.content,
          error: null
        }
      });
    case constants.GET_SUPPLIERS_ITEMS_ERROR:
      return produce(state, draftState => {
        draftState.suppliersItems = {
          loading: false,
          data: [],
          error: action.payload
        }
      });
    case constants.GET_ORDER_DETAILS_LOADING:
      return produce(state, draftState => {
        draftState.orderDetails.loading = true;
      });
    case constants.GET_ORDER_DETAILS:
      return produce(state, draftState => {
        draftState.orderDetails = {
          loading: false,
          data: action.payload,
          error: null
        }
      });
    case constants.GET_ORDER_DETAILS_ERROR:
      return produce(state, draftState => {
        draftState.orderDetails = {
          loading: false,
          data: {},
          error: action.payload
        }
      });
    case constants.RESET_ORDER_DETAILS:
      return initialState;
    case constants.CONFIRM_ORDER_LOADING:
      return produce(state, draftState => {
        draftState.confirmOrder.loading = true
      });
    case constants.CONFIRM_ORDER:
      return produce(state, draftState => {
        draftState.confirmOrder = {
          loading: false,
          success: true,
          error: null
        }
      });
    case constants.CONFIRM_ORDER_ERROR:
      return produce(state, draftState => {
        draftState.confirmOrder = {
          loading: false,
          success: false,
          error: action.payload
        }
      });
    case constants.RESET_CONFIRM_ORDER:
      return produce(state, draftState => {
        draftState.confirmOrder = {
          loading: false,
          success: false,
          error: null
        }
      });
    case constants.REJECT_ORDER_LOADING:
      return produce(state, draftState => {
        draftState.rejectOrder.loading = true
      });
    case constants.REJECT_ORDER:
      return produce(state, draftState => {
        draftState.rejectOrder = {
          loading: false,
          success: true,
          error: null
        }
      });
    case constants.REJECT_ORDER_ERROR:
      return produce(state, draftState => {
        draftState.rejectOrder = {
          loading: false,
          success: false,
          error: action.payload
        }
      });
    case constants.RESET_REJECT_ORDER:
      return produce(state, draftState => {
        draftState.rejectOrder = {
          loading: false,
          success: false,
          error: null
        }
      });
    case constants.GET_CONTRACT_DETAILS_LOADING:
      return produce(state, draftState => {
        draftState.contractDetails.loading = true
      });
    case constants.GET_CONTRACT_DETAILS:
      return produce(state, draftState => {
        draftState.contractDetails = {
          loading: false,
          data: action.payload,
          error: null
        }
      });
    case constants.GET_CONTRACT_DETAILS_ERROR:
      return produce(state, draftState => {
        draftState.contractDetails = {
          loading: false,
          data: {},
          error: action.payload
        }
      });
    case constants.CONFIRM_CONTRACT_LOADING:
      return produce(state, draftState => {
        draftState.confirmContract.loading = true
      });
    case constants.CONFIRM_CONTRACT:
      return produce(state, draftState => {
        draftState.confirmContract = {
          loading: false,
          success: true,
          error: null
        }
      });
    case constants.CONFIRM_CONTRACT_ERROR:
      return produce(state, draftState => {
        draftState.confirmContract = {
          loading: false,
          success: false,
          error: action.payload
        }
      });
    case constants.RESET_CONFIRM_CONTRACT:
      return produce(state, draftState => {
        draftState.confirmContract = {
          loading: false,
          success: false,
          error: null
        }
      });
    case constants.REJECT_CONTRACT_LOADING:
      return produce(state, draftState => {
        draftState.rejectContract.loading = true
      });
    case constants.REJECT_CONTRACT:
      return produce(state, draftState => {
        draftState.rejectContract = {
          loading: false,
          success: true,
          error: null
        }
      });
    case constants.REJECT_CONTRACT_ERROR:
      return produce(state, draftState => {
        draftState.rejectContract = {
          loading: false,
          success: false,
          error: action.payload
        }
      });
    case constants.RESET_REJECT_CONTRACT:
      return produce(state, draftState => {
        draftState.rejectContract = {
          loading: false,
          success: false,
          error: null
        }
      });
    case constants.EXPIRED_CONTRACT_LOADING:
      return produce(state, draftState => {
        draftState.expiredContract.loading = true
      });
    case constants.EXPIRED_CONTRACT:
      return produce(state, draftState => {
        draftState.expiredContract = {
          loading: false,
          success: true,
          error: null
        }
      });
    case constants.EXPIRED_CONTRACT_ERROR:
      return produce(state, draftState => {
        draftState.expiredContract = {
          loading: false,
          success: false,
          error: action.payload
        }
      });
    case constants.RESET_EXPIRED_CONTRACT:
      return produce(state, draftState => {
        draftState.expiredContract = {
          loading: false,
          success: false,
          error: null
        }
      });
    case constants.GET_INVOICE_PAYMENT_DETAILS_LOADING:
      return produce(state, draftState => {
        draftState.invoicePaymentDetails.loading = true
      });
    case constants.GET_INVOICE_PAYMENT_DETAILS:
      return produce(state, draftState => {
        draftState.invoicePaymentDetails = {
          loading: false,
          data: action.payload,
          error: null
        }
      });
    case constants.GET_INVOICE_PAYMENT_DETAILS_ERROR:
      return produce(state, draftState => {
        draftState.invoicePaymentDetails = {
          loading: false,
          data: {},
          error: action.payload
        }
      });
    case constants.CONFIRM_INVOICE_PAYMENT_LOADING:
      return produce(state, draftState => {
        draftState.confirmInvoicePayment.loading = true
      });
    case constants.CONFIRM_INVOICE_PAYMENT:
      return produce(state, draftState => {
        draftState.confirmInvoicePayment = {
          loading: false,
          success: true,
          error: null
        }
      });
    case constants.CONFIRM_INVOICE_PAYMENT_ERROR:
      return produce(state, draftState => {
        draftState.confirmInvoicePayment = {
          loading: false,
          success: false,
          error: action.payload
        }
      });
    case constants.RESET_CONFIRM_INVOICE_PAYMENT:
      return produce(state, draftState => {
        draftState.confirmInvoicePayment = {
          loading: false,
          success: false,
          error: null
        }
      });
    case constants.GET_POWER_OF_ATTORNEY_DETAILS_LOADING:
      return produce(state, draftState => {
        draftState.powerOfAttorneyDetails.loading = true
      });
    case constants.GET_POWER_OF_ATTORNEY_DETAILS:
      return produce(state, draftState => {
        draftState.powerOfAttorneyDetails = {
          loading: false,
          data: action.payload,
          error: null
        }
      });
    case constants.GET_POWER_OF_ATTORNEY_DETAILS_ERROR:
      return produce(state, draftState => {
        draftState.powerOfAttorneyDetails = {
          loading: false,
          data: {},
          error: action.payload
        }
      });
    case constants.GET_CURRENT_RESPONSIBLE_PERSON_ITEMS:
      return produce(state, draftState => {
        draftState.currentResponsiblePersonItems = action.payload
      });
    case constants.CREATE_POWER_OF_ATTORNEY_LOADING:
      return produce(state, draftState => {
        draftState.createPowerOfAttorney.loading = true
      });
    case constants.CREATE_POWER_OF_ATTORNEY:
      return produce(state, draftState => {
        draftState.createPowerOfAttorney = {
          loading: false,
          success: true,
          error: null
        }
      });
    case constants.CREATE_POWER_OF_ATTORNEY_ERROR:
      return produce(state, draftState => {
        draftState.createPowerOfAttorney = {
          loading: false,
          success: false,
          error: action.payload
        }
      });
    case constants.RESET_CREATE_POWER_OF_ATTORNEY:
      return produce(state, draftState => {
        draftState.createPowerOfAttorney = {
          loading: false,
          success: false,
          error: null
        }
      });
    case constants.RECEIVE_ORDER_LOADING:
      return produce(state, draftState => {
        draftState.receiveOrder.loading = true
      });
    case constants.RECEIVE_ORDER:
      return produce(state, draftState => {
        draftState.receiveOrder = {
          loading: false,
          success: true,
          error: null
        }
      });
    case constants.RECEIVE_ORDER_ERROR:
      return produce(state, draftState => {
        draftState.receiveOrder = {
          loading: false,
          success: false,
          error: action.payload
        }
      });
    case constants.RESET_RECEIVE_ORDER:
      return produce(state, draftState => {
        draftState.receiveOrder = {
          loading: false,
          success: false,
          error: null
        }
      });
    case constants.GET_INVOICE_DETAILS_LOADING:
      return produce(state, draftState => {
        draftState.invoiceDetails.loading = true
      });
    case constants.GET_INVOICE_DETAILS:
      return produce(state, draftState => {
        draftState.invoiceDetails = {
          loading: false,
          data: action.payload,
          error: null
        }
      });
    case constants.GET_INVOICE_DETAILS_ERROR:
      return produce(state, draftState => {
        draftState.invoiceDetails = {
          loading: false,
          data: {},
          error: action.payload
        }
      });
    case constants.CHECK_INVOICE_STATUS_LOADING:
      return produce(state, draftState => {
        draftState.checkInvoiceStatus.loading = true;
      });
    case constants.CHECK_INVOICE_STATUS:
      return produce(state, draftState => {
        draftState.checkInvoiceStatus = {
          loading: false,
          success: true,
          error: null
        }
      });
    case constants.CHECK_INVOICE_STATUS_ERROR:
      return produce(state, draftState => {
        draftState.checkInvoiceStatus = {
          loading: false,
          success: false,
          error: action.payload
        }
      });
    case constants.RESET_CHECK_INVOICE_STATUS:
      return produce(state, draftState => {
        draftState.checkInvoiceStatus = initialState.checkInvoiceStatus;
      });
    default:
      return state
  }
};

export default reducer;