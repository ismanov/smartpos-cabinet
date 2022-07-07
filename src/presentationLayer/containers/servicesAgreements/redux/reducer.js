import produce from "immer";
import { PaginationList } from "#businessLayer/models";
import * as constants from "./constants";
import { checkNull } from "../../../../utils/helpers";

const initState = {
  branchesItems: {
    loading: false,
    data: [],
    error: null,
  },
  servicesAgreementsList: {
    loading: false,
    data: [],
    error: null,
  },
  servicesAgreementsListFilter: {},
  servicesTariffs: {
    loading: false,
    data: [],
    error: null,
  },
  branchesCount: null,
  customerPublicOffer: {
    loading: false,
    loaded: false,
    data: null,
    error: null,
  },
  lastPublicOffer: {
    loading: false,
    data: null,
    error: null,
  },
  acceptPublicOffer: {
    loading: false,
    success: false,
    error: null,
  },
  createSubscribeAgreement: {
    loading: false,
    tariffId: null,
    success: false,
    error: null,
  },
  createCustomAgreement: {
    loading: false,
    successData: null,
    error: null,
  },
  serviceAgreementDetails: {
    loading: false,
    data: null,
    error: null,
  },
  updateAgreementServiceDesc: {
    loading: false,
    agreementId: null,
    data: null,
    error: null,
  },
  uploadAgreementFile: {
    loading: false,
    agreementId: null,
    data: null,
    error: null,
  },

  balance: null,
  quoteLoading: false,
  quoteError: null,
  quoteDetails: { loading: false, data: null, error: undefined },
  generatedQuote: { loading: false, data: null, error: undefined },

  // REPORT INITIAL STATE
  reportLoading: false,
  dataEntry: null,

  // PUBLIC OFFER INITIAL STATE
  publicOfferLoading: false,
  publicOfferData: null,

  // AGREEMENT INVOICES INITIAL STATE
  agreementInvoicesLoading: false,
  agreementInvoicesData: null,
  generatedInvoicesLoading: false,
  generatedInvoicesData: null,
};

const reducer = (state = initState, action) => {
  switch (action.type) {
    case constants.GET_SERVICE_BRANCHES_ITEMS:
      return produce(state, (draftState) => {
        draftState.branchesItems.loading = true;
      });
    //REPORT REDUCER
    case "SET_REPORT_LOADING":
      return produce(state, (draftState) => {
        draftState.reportLoading = action.payload;
      });
    case "SET_DATA_ENTRY":
      return produce(state, (draftState) => {
        draftState.dataEntry = action.payload;
      });
    // PUBLIC OFFER REDUCER
    case "SET_PUBLIC_OFFER_LOADING":
      return produce(state, (draftState) => {
        draftState.publicOfferLoading = action.payload;
      });
    case "SET_PUBLIC_OFFER_DATA":
      return produce(state, (draftState) => {
        draftState.publicOfferData = action.payload;
      });

    // INVOICES REDUCER
    case "SET_AGREEMENT_INVOICES_LOADING":
      return produce(state, (draftState) => {
        draftState.agreementInvoicesLoading = action.payload;
      });
    case "SET_AGREEMENT_INVOICES_DATA":
      return produce(state, (draftState) => {
        draftState.agreementInvoicesData = action.payload;
      });
    case "SET_BALANCE":
      return produce(state, (draftState) => {
        draftState.balance = action.payload;
      });
    case "SET_GENERATED_INVOICES_LOADING":
      return produce(state, (draftState) => {
        draftState.generatedInvoicesLoading = action.payload;
      });
    case "SET_GENERATED_INVOICES_DATA":
      return produce(state, (draftState) => {
        draftState.generatedInvoicesData = action.payload;
      });

    // QUOTE
    case "SET_QUOTE_DETAILS":
      return produce(state, (draftState) => {
        draftState.quoteDetails = action.payload;
      });
    case "SET_GENERATED_QUOTE":
      return produce(state, (draftState) => {
        draftState.generatedQuote = action.payload;
      });
    case "SET_QUOTE_LOADING":
      return produce(state, (draftState) => {
        draftState.quoteLoading = action.payload;
      });
    case "SET_QUOTE_ERROR":
      return produce(state, (draftState) => {
        draftState.quoteError = action.payload;
      });
    case constants.GET_SERVICE_BRANCHES_ITEMS_SUCCESS:
      return produce(state, (draftState) => {
        draftState.branchesItems.loading = false;
        draftState.branchesItems.data = action.payload;
        draftState.branchesItems.error = null;
      });
    case constants.GET_SERVICE_BRANCHES_ITEMS_ERROR:
      return produce(state, (draftState) => {
        draftState.branchesItems.loading = false;
        draftState.branchesItems.data = [];
        draftState.branchesItems.error = action.payload.response.data;
      });
    case constants.GET_SERVICE_AGREEMENTS_LIST:
      return produce(state, (draftState) => {
        draftState.servicesAgreementsList.loading = true;
      });
    case constants.GET_SERVICE_AGREEMENTS_LIST_SUCCESS:
      return produce(state, (draftState) => {
        draftState.servicesAgreementsList.loading = false;
        draftState.servicesAgreementsList.data = action.payload;
        draftState.servicesAgreementsList.error = null;
      });
    case constants.GET_SERVICE_AGREEMENTS_LIST_ERROR:
      return produce(state, (draftState) => {
        draftState.servicesAgreementsList.loading = false;
        draftState.servicesAgreementsList.data = [];
        draftState.servicesAgreementsList.error = action.payload.response.data;
      });
    case constants.UPDATE_SERVICE_AGREEMENTS_LIST_FILTER:
      return produce(state, (draftState) => {
        // draftState.servicesAgreementsListFilter = { ...state.servicesAgreementsListFilter, ...action.payload };
        Object.assign(draftState.servicesAgreementsListFilter, action.payload);
      });
    case constants.RESET_SERVICE_AGREEMENTS_LIST_FILTER:
      return produce(state, (draftState) => {
        draftState.servicesAgreementsListFilter = {};
      });

    case constants.GET_SERVICES_TARIFFS:
      return produce(state, (draftState) => {
        draftState.servicesTariffs.loading = true;
      });
    case constants.GET_SERVICES_TARIFFS_SUCCESS:
      return produce(state, (draftState) => {
        draftState.servicesTariffs.loading = false;
        draftState.servicesTariffs.data = action.payload;
        draftState.servicesTariffs.error = null;
      });
    case constants.GET_SERVICES_TARIFFS_ERROR:
      return produce(state, (draftState) => {
        draftState.servicesTariffs.loading = false;
        draftState.servicesTariffs.data = [];
        draftState.servicesTariffs.error = action.payload.response.data;
      });

    case constants.GET_BRANCHES_COUNT_SUCCESS:
      return produce(state, (draftState) => {
        draftState.branchesCount = action.payload;
      });

    case constants.GET_CUSTOMER_PUBLIC_OFFER:
      return produce(state, (draftState) => {
        draftState.customerPublicOffer.loading = true;
      });
    case constants.GET_CUSTOMER_PUBLIC_OFFER_SUCCESS:
      return produce(state, (draftState) => {
        draftState.customerPublicOffer.loading = false;
        draftState.customerPublicOffer.loaded = true;
        draftState.customerPublicOffer.data = action.payload;
        draftState.customerPublicOffer.error = null;
      });
    case constants.GET_CUSTOMER_PUBLIC_OFFER_ERROR:
      return produce(state, (draftState) => {
        draftState.customerPublicOffer.loading = false;
        draftState.customerPublicOffer.loaded = true;
        draftState.customerPublicOffer.data = null;
        draftState.customerPublicOffer.error = action.payload.response.data;
      });
    case constants.RESET_CUSTOMER_PUBLIC_OFFER:
      return produce(state, (draftState) => {
        draftState.customerPublicOffer = { ...initState.customerPublicOffer };
      });

    case constants.GET_LAST_PUBLIC_OFFER:
      return produce(state, (draftState) => {
        draftState.lastPublicOffer.loading = true;
      });
    case constants.GET_LAST_PUBLIC_OFFER_SUCCESS:
      return produce(state, (draftState) => {
        draftState.lastPublicOffer.loading = false;
        draftState.lastPublicOffer.data = action.payload;
        draftState.lastPublicOffer.error = null;
      });
    case constants.GET_LAST_PUBLIC_OFFER_ERROR:
      return produce(state, (draftState) => {
        draftState.lastPublicOffer.loading = false;
        draftState.lastPublicOffer.data = null;
        draftState.lastPublicOffer.error = action.payload.response.data;
      });

    case constants.ACCEPT_PUBLIC_OFFER:
      return produce(state, (draftState) => {
        draftState.acceptPublicOffer.loading = true;
      });
    case constants.ACCEPT_PUBLIC_OFFER_SUCCESS:
      return produce(state, (draftState) => {
        draftState.acceptPublicOffer.loading = false;
        draftState.acceptPublicOffer.success = true;
        draftState.acceptPublicOffer.error = null;
      });
    case constants.ACCEPT_PUBLIC_OFFER_ERROR:
      return produce(state, (draftState) => {
        draftState.acceptPublicOffer.loading = false;
        draftState.acceptPublicOffer.success = false;
        draftState.acceptPublicOffer.error = action.payload.response.data;
      });
    case constants.RESET_ACCEPT_PUBLIC_OFFER:
      return produce(state, (draftState) => {
        draftState.acceptPublicOffer = { ...initState.acceptPublicOffer };
      });

    case constants.CREATE_SUBSCRIBE_AGREEMENT:
      return produce(state, (draftState) => {
        draftState.createSubscribeAgreement.loading = true;
        draftState.createSubscribeAgreement.tariffId = action.payload.xizmat.id;
      });
    case constants.CREATE_SUBSCRIBE_AGREEMENT_SUCCESS:
      return produce(state, (draftState) => {
        draftState.createSubscribeAgreement.loading = false;
        draftState.createSubscribeAgreement.success = true;
        draftState.createSubscribeAgreement.error = null;
      });
    case constants.CREATE_SUBSCRIBE_AGREEMENT_ERROR:
      return produce(state, (draftState) => {
        draftState.createSubscribeAgreement.loading = false;
        draftState.createSubscribeAgreement.success = false;
        draftState.createSubscribeAgreement.error =
          action.payload.response.data;
      });
    case constants.RESET_CREATE_SUBSCRIBE_AGREEMENT:
      return produce(state, (draftState) => {
        draftState.createSubscribeAgreement = {
          ...initState.createSubscribeAgreement,
        };
      });

    case constants.CREATE_CUSTOM_AGREEMENT:
      return produce(state, (draftState) => {
        draftState.createCustomAgreement.loading = true;
      });
    case constants.CREATE_CUSTOM_AGREEMENT_SUCCESS:
      return produce(state, (draftState) => {
        draftState.createCustomAgreement.loading = false;
        draftState.createCustomAgreement.successData = action.payload;
        draftState.createCustomAgreement.error = null;
      });
    case constants.CREATE_CUSTOM_AGREEMENT_ERROR:
      return produce(state, (draftState) => {
        draftState.createCustomAgreement.loading = false;
        draftState.createCustomAgreement.successData = null;
        draftState.createCustomAgreement.error = action.payload.response.data;
      });
    case constants.RESET_CREATE_CUSTOM_AGREEMENT:
      return produce(state, (draftState) => {
        draftState.createCustomAgreement = {
          ...initState.createCustomAgreement,
        };
      });

    case constants.GET_SERVICE_AGREEMENT_DETAILS:
      return produce(state, (draftState) => {
        draftState.serviceAgreementDetails.loading = true;
      });
    case constants.GET_SERVICE_AGREEMENT_DETAILS_SUCCESS:
      return produce(state, (draftState) => {
        draftState.serviceAgreementDetails.loading = false;
        draftState.serviceAgreementDetails.data = action.payload;
        draftState.serviceAgreementDetails.error = null;
      });
    case constants.GET_SERVICE_AGREEMENT_DETAILS_ERROR:
      return produce(state, (draftState) => {
        draftState.serviceAgreementDetails.loading = false;
        draftState.serviceAgreementDetails.data = null;
        draftState.serviceAgreementDetails.error = checkNull(
          action,
          "payload",
          "response",
          "data"
        );
      });
    case constants.RESET_SERVICE_AGREEMENT_DETAILS:
      return produce(state, (draftState) => {
        draftState.serviceAgreementDetails = {
          ...initState.serviceAgreementDetails,
        };
      });

    case constants.UPDATE_AGREEMENT_SERVICE_DESC:
      return produce(state, (draftState) => {
        draftState.updateAgreementServiceDesc.loading = true;
        draftState.updateAgreementServiceDesc.agreementId = action.payload.id;
      });
    case constants.UPDATE_AGREEMENT_SERVICE_DESC_SUCCESS:
      return produce(state, (draftState) => {
        draftState.updateAgreementServiceDesc.loading = false;
        draftState.updateAgreementServiceDesc.success = true;
        draftState.updateAgreementServiceDesc.error = null;
      });
    case constants.UPDATE_AGREEMENT_SERVICE_DESC_ERROR:
      return produce(state, (draftState) => {
        draftState.updateAgreementServiceDesc.loading = false;
        draftState.updateAgreementServiceDesc.success = false;
        draftState.updateAgreementServiceDesc.error =
          action.payload.response.data;
      });
    case constants.RESET_UPDATE_AGREEMENT_SERVICE_DESC:
      return produce(state, (draftState) => {
        draftState.updateAgreementServiceDesc = {
          ...initState.updateAgreementServiceDesc,
        };
      });

    case constants.UPLOAD_AGREEMENT_FILE:
      return produce(state, (draftState) => {
        draftState.uploadAgreementFile.loading = true;
        draftState.uploadAgreementFile.agreementId = action.payload.id;
      });
    case constants.UPLOAD_AGREEMENT_FILE_SUCCESS:
      return produce(state, (draftState) => {
        draftState.uploadAgreementFile.loading = false;
        draftState.uploadAgreementFile.success = true;
        draftState.uploadAgreementFile.error = null;
      });
    case constants.UPLOAD_AGREEMENT_FILE_ERROR:
      return produce(state, (draftState) => {
        draftState.uploadAgreementFile.loading = false;
        draftState.uploadAgreementFile.success = false;
        draftState.uploadAgreementFile.error = action.payload.response.data;
      });
    case constants.RESET_UPLOAD_AGREEMENT_FILE:
      return produce(state, (draftState) => {
        draftState.uploadAgreementFile = { ...initState.uploadAgreementFile };
      });
    default:
      return state;
  }
};

export const servicesAgreementsSelector = (prop) => {
  return (state) => state.get("servicesAgreements")[prop];
};

export default reducer;
