import produce from "immer";
import { PaginationList } from "#businessLayer/models";
import * as constants from "./constants";

const initState = {
  loyaltyCardTypes: {
    loading: false,
    data: [],
    error: null
  },
  loyaltyPeriods: {
    loading: false,
    data: [],
    error: null
  },
  loyaltySystemStatuses: {
    loading: false,
    data: [],
    error: null
  },
  loyaltySystemsItems: {
    loading: false,
    data: null,
    error: null
  },
  loyaltyCards: {
    loading: false,
    data: new PaginationList(),
    params: {},
    error: null
  },
  loyaltyCardsFilter: {},
  loyaltyCardsStats: {
    loading: false,
    data: [],
    error: null
  },
  loyaltyCardDetails: {
    loading: false,
    data: null,
    error: null
  },
  addLoyaltyCard: {
    loading: false,
    success: false,
    error: null
  },
  updateLoyaltyCard: {
    loading: false,
    success: false,
    error: null
  },
  deleteLoyaltyCard: {
    loading: false,
    success: false,
    error: null
  },
  loyaltySystems: {
    loading: false,
    data: new PaginationList(),
    params: {},
    error: null
  },
  loyaltySystemsFilter: {},
  changeLoyaltySystemStatus: {
    loading: false,
    success: false,
    error: null
  },
  loyaltySystemDetails: {
    loading: false,
    data: null,
    error: null
  },
  addLoyaltySystemCards: {
    loading: false,
    data: [],
    error: null
  },
  addLoyaltySystemBranches: {
    loading: false,
    data: [],
    error: null
  },
  addLoyaltySystem: {
    loading: false,
    success: false,
    error: null
  },
  updateLoyaltySystem: {
    loading: false,
    success: false,
    error: null
  },
  loyaltyClients: {
    loading: false,
    data: new PaginationList(),
    params: {},
    error: null
  },
  loyaltyClientsFilter: {},
  loyaltyClientsStats: {
    loading: false,
    data: [],
    error: null
  },
  aPayUserDetails: {
    loading: false,
    data: null,
    error: null
  },
  loyaltyClientLevels: {
    loading: false,
    data: {},
    error: null
  },
  addLoyaltyClient: {
    loading: false,
    success: false,
    error: null
  },
};

const reducer = (state = initState, action) => {
  switch (action.type) {
    case constants.GET_LOYALTY_CARD_TYPES:
      return produce(state, draftState => {
        draftState.loyaltyCardTypes.loading = true;
      });
    case constants.GET_LOYALTY_CARD_TYPES_SUCCESS:
      return produce(state, draftState => {
        draftState.loyaltyCardTypes.loading = false;
        draftState.loyaltyCardTypes.data = action.payload;
        draftState.loyaltyCardTypes.error = null;
      });
    case constants.GET_LOYALTY_CARD_TYPES_ERROR:
      return produce(state, draftState => {
        draftState.loyaltyCardTypes.loading = false;
        draftState.loyaltyCardTypes.data = [];
        draftState.loyaltyCardTypes.error = action.payload;
      });

    case constants.GET_LOYALTY_PERIODS:
      return produce(state, draftState => {
        draftState.loyaltyPeriods.loading = true;
      });
    case constants.GET_LOYALTY_PERIODS_SUCCESS:
      return produce(state, draftState => {
        draftState.loyaltyPeriods.loading = false;
        draftState.loyaltyPeriods.data = action.payload;
        draftState.loyaltyPeriods.error = null;
      });
    case constants.GET_LOYALTY_PERIODS_ERROR:
      return produce(state, draftState => {
        draftState.loyaltyPeriods.loading = false;
        draftState.loyaltyPeriods.data = [];
        draftState.loyaltyPeriods.error = action.payload;
      });

    case constants.GET_LOYALTY_SYSTEM_STATUSES:
      return produce(state, draftState => {
        draftState.loyaltySystemStatuses.loading = true;
      });
    case constants.GET_LOYALTY_SYSTEM_STATUSES_SUCCESS:
      return produce(state, draftState => {
        draftState.loyaltySystemStatuses.loading = false;
        draftState.loyaltySystemStatuses.data = action.payload;
        draftState.loyaltySystemStatuses.error = null;
      });
    case constants.GET_LOYALTY_SYSTEM_STATUSES_ERROR:
      return produce(state, draftState => {
        draftState.loyaltySystemStatuses.loading = false;
        draftState.loyaltySystemStatuses.data = [];
        draftState.loyaltySystemStatuses.error = action.payload;
      });

    case constants.GET_LOYALTY_SYSTEMS_ITEMS:
      return produce(state, draftState => {
        draftState.loyaltySystemsItems.loading = true;
      });
    case constants.GET_LOYALTY_SYSTEMS_ITEMS_SUCCESS:
      return produce(state, draftState => {
        draftState.loyaltySystemsItems.loading = false;
        draftState.loyaltySystemsItems.data = action.payload;
        draftState.loyaltySystemsItems.error = null;
      });
    case constants.GET_LOYALTY_SYSTEMS_ITEMS_ERROR:
      return produce(state, draftState => {
        draftState.loyaltySystemsItems.loading = false;
        draftState.loyaltySystemsItems.data = null;
        draftState.loyaltySystemsItems.error = action.payload;
      });

    case constants.GET_LOYALTY_CARDS:
      return produce(state, draftState => {
        draftState.loyaltyCards.loading = true;
      });
    case constants.GET_LOYALTY_CARDS_SUCCESS:
      return produce(state, draftState => {
        draftState.loyaltyCards.loading = false;
        draftState.loyaltyCards.data = action.payload;
        draftState.loyaltyCards.params = action.params;
        draftState.loyaltyCards.error = null;
      });
    case constants.GET_LOYALTY_CARDS_ERROR:
      return produce(state, draftState => {
        draftState.loyaltyCards.loading = false;
        draftState.loyaltyCards.data = { ...initState.loyaltyCards.data };
        draftState.loyaltyCards.params = {};
        draftState.loyaltyCards.error = action.payload;
      });
    case constants.UPDATE_LOYALTY_CARDS_FILTER:
      return produce(state, draftState => {
        draftState.loyaltyCardsFilter = { ...state.loyaltyCardsFilter, ...action.payload };
      });
    case constants.RESET_LOYALTY_CARDS_FILTER:
      return produce(state, draftState => {
        draftState.loyaltyCardsFilter = {};
      });

    case constants.GET_LOYALTY_CARDS_STATS:
      return produce(state, draftState => {
        draftState.loyaltyCardsStats.loading = true;
      });
    case constants.GET_LOYALTY_CARDS_STATS_SUCCESS:
      return produce(state, draftState => {
        draftState.loyaltyCardsStats.loading = false;
        draftState.loyaltyCardsStats.data = action.payload;
        draftState.loyaltyCardsStats.error = null;
      });
    case constants.GET_LOYALTY_CARDS_STATS_ERROR:
      return produce(state, draftState => {
        draftState.loyaltyCardsStats.loading = false;
        draftState.loyaltyCardsStats.data = [];
        draftState.loyaltyCardsStats.error = action.payload;
      });

    case constants.GET_LOYALTY_CARD_DETAILS:
      return produce(state, draftState => {
        draftState.loyaltyCardDetails.loading = true;
      });
    case constants.GET_LOYALTY_CARD_DETAILS_SUCCESS:
      return produce(state, draftState => {
        draftState.loyaltyCardDetails.loading = false;
        draftState.loyaltyCardDetails.data = action.payload;
        draftState.loyaltyCardDetails.error = null;
      });
    case constants.GET_LOYALTY_CARD_DETAILS_ERROR:
      return produce(state, draftState => {
        draftState.loyaltyCardDetails.loading = false;
        draftState.loyaltyCardDetails.data = null;
        draftState.loyaltyCardDetails.error = action.payload;
      });
    case constants.RESET_LOYALTY_CARD_DETAILS:
      return produce(state, draftState => {
        draftState.loyaltyCardDetails = { ...initState.loyaltyCardDetails };
      });

    case constants.ADD_LOYALTY_CARD:
      return produce(state, draftState => {
        draftState.addLoyaltyCard.loading = true;
      });
    case constants.ADD_LOYALTY_CARD_SUCCESS:
      return produce(state, draftState => {
        draftState.addLoyaltyCard.loading = false;
        draftState.addLoyaltyCard.success = true;
        draftState.addLoyaltyCard.error = null;
      });
    case constants.ADD_LOYALTY_CARD_ERROR:
      return produce(state, draftState => {
        draftState.addLoyaltyCard.loading = false;
        draftState.addLoyaltyCard.success = false;
        draftState.addLoyaltyCard.error = action.payload;
      });
    case constants.RESET_ADD_LOYALTY_CARD:
      return produce(state, draftState => {
        draftState.addLoyaltyCard = { ...initState.addLoyaltyCard };
      });

    case constants.UPDATE_LOYALTY_CARD:
      return produce(state, draftState => {
        draftState.updateLoyaltyCard.loading = true;
      });
    case constants.UPDATE_LOYALTY_CARD_SUCCESS:
      return produce(state, draftState => {
        draftState.updateLoyaltyCard.loading = false;
        draftState.updateLoyaltyCard.success = true;
        draftState.updateLoyaltyCard.error = null;
      });
    case constants.UPDATE_LOYALTY_CARD_ERROR:
      return produce(state, draftState => {
        draftState.updateLoyaltyCard.loading = false;
        draftState.updateLoyaltyCard.success = false;
        draftState.updateLoyaltyCard.error = action.payload;
      });
    case constants.RESET_UPDATE_LOYALTY_CARD:
      return produce(state, draftState => {
        draftState.updateLoyaltyCard = { ...initState.updateLoyaltyCard };
      });

    case constants.DELETE_LOYALTY_CARD:
      return produce(state, draftState => {
        draftState.deleteLoyaltyCard.loading = true;
      });
    case constants.DELETE_LOYALTY_CARD_SUCCESS:
      return produce(state, draftState => {
        draftState.deleteLoyaltyCard.loading = false;
        draftState.deleteLoyaltyCard.success = true;
        draftState.deleteLoyaltyCard.error = null;
      });
    case constants.DELETE_LOYALTY_CARD_ERROR:
      return produce(state, draftState => {
        draftState.deleteLoyaltyCard.loading = false;
        draftState.deleteLoyaltyCard.success = false;
        draftState.deleteLoyaltyCard.error = action.payload;
      });
    case constants.RESET_DELETE_LOYALTY_CARD_ERROR:
      return produce(state, draftState => {
        draftState.deleteLoyaltyCard = { ...initState.deleteLoyaltyCard };
      });


    case constants.GET_LOYALTY_SYSTEMS:
      return produce(state, draftState => {
        draftState.loyaltySystems.loading = true;
      });
    case constants.GET_LOYALTY_SYSTEMS_SUCCESS:
      return produce(state, draftState => {
        draftState.loyaltySystems.loading = false;
        draftState.loyaltySystems.data = action.payload;
        draftState.loyaltySystems.params = action.params;
        draftState.loyaltySystems.error = null;
      });
    case constants.GET_LOYALTY_SYSTEMS_ERROR:
      return produce(state, draftState => {
        draftState.loyaltySystems.loading = false;
        draftState.loyaltySystems.data = { ...initState.loyaltySystems.data };
        draftState.loyaltySystems.params = {};
        draftState.loyaltySystems.error = action.payload;
      });
    case constants.UPDATE_LOYALTY_SYSTEMS_FILTER:
      return produce(state, draftState => {
        draftState.loyaltySystemsFilter = { ...state.loyaltySystemsFilter, ...action.payload };
      });
    case constants.RESET_LOYALTY_SYSTEMS_FILTER:
      return produce(state, draftState => {
        draftState.loyaltySystemsFilter = {};
      });

    case constants.CHANGE_LOYALTY_SYSTEM_STATUS:
      return produce(state, draftState => {
        draftState.changeLoyaltySystemStatus.loading = true;
      });
    case constants.CHANGE_LOYALTY_SYSTEM_STATUS_SUCCESS:
      return produce(state, draftState => {
        draftState.changeLoyaltySystemStatus.loading = false;
        draftState.changeLoyaltySystemStatus.success = true;
        draftState.changeLoyaltySystemStatus.error = null;
      });
    case constants.CHANGE_LOYALTY_SYSTEM_STATUS_ERROR:
      return produce(state, draftState => {
        draftState.changeLoyaltySystemStatus.loading = false;
        draftState.changeLoyaltySystemStatus.success = false;
        draftState.changeLoyaltySystemStatus.error = action.payload;
      });
    case constants.RESET_CHANGE_LOYALTY_SYSTEM_STATUS:
      return produce(state, draftState => {
        draftState.changeLoyaltySystemStatus = { ...initState.changeLoyaltySystemStatus };
      });

    case constants.GET_LOYALTY_SYSTEM_DETAILS:
      return produce(state, draftState => {
        draftState.loyaltySystemDetails.loading = true;
      });
    case constants.GET_LOYALTY_SYSTEM_DETAILS_SUCCESS:
      return produce(state, draftState => {
        draftState.loyaltySystemDetails.loading = false;
        draftState.loyaltySystemDetails.data = action.payload;
        draftState.loyaltySystemDetails.error = null;
      });
    case constants.GET_LOYALTY_SYSTEM_DETAILS_ERROR:
      return produce(state, draftState => {
        draftState.loyaltySystemDetails.loading = false;
        draftState.loyaltySystemDetails.data = null;
        draftState.loyaltySystemDetails.error = action.payload;
      });
    case constants.RESET_LOYALTY_SYSTEM_DETAILS:
      return produce(state, draftState => {
        draftState.loyaltySystemDetails = { ...initState.loyaltySystemDetails };
      });

    case constants.GET_ADD_LOYALTY_SYSTEM_CARDS:
      return produce(state, draftState => {
        draftState.addLoyaltySystemCards.loading = true;
        draftState.addLoyaltySystemCards.data = [];
      });
    case constants.GET_ADD_LOYALTY_SYSTEM_CARDS_SUCCESS:
      return produce(state, draftState => {
        draftState.addLoyaltySystemCards.loading = false;
        draftState.addLoyaltySystemCards.data = action.payload;
        draftState.addLoyaltySystemCards.error = null;
      });
    case constants.GET_ADD_LOYALTY_SYSTEM_CARDS_ERROR:
      return produce(state, draftState => {
        draftState.addLoyaltySystemCards.loading = false;
        draftState.addLoyaltySystemCards.data = [];
        draftState.addLoyaltySystemCards.error = action.payload;
      });

    case constants.GET_ADD_LOYALTY_SYSTEM_BRANCHES:
      return produce(state, draftState => {
        draftState.addLoyaltySystemBranches.loading = true;
        draftState.addLoyaltySystemBranches.data = [];
      });
    case constants.GET_ADD_LOYALTY_SYSTEM_BRANCHES_SUCCESS:
      return produce(state, draftState => {
        draftState.addLoyaltySystemBranches.loading = false;
        draftState.addLoyaltySystemBranches.data = action.payload;
        draftState.addLoyaltySystemBranches.error = null;
      });
    case constants.GET_ADD_LOYALTY_SYSTEM_BRANCHES_ERROR:
      return produce(state, draftState => {
        draftState.addLoyaltySystemBranches.loading = false;
        draftState.addLoyaltySystemBranches.data = [];
        draftState.addLoyaltySystemBranches.error = action.payload;
      });

    case constants.ADD_LOYALTY_SYSTEM:
      return produce(state, draftState => {
        draftState.addLoyaltySystem.loading = true;
      });
    case constants.ADD_LOYALTY_SYSTEM_SUCCESS:
      return produce(state, draftState => {
        draftState.addLoyaltySystem.loading = false;
        draftState.addLoyaltySystem.success = true;
        draftState.addLoyaltySystem.error = null;
      });
    case constants.ADD_LOYALTY_SYSTEM_ERROR:
      return produce(state, draftState => {
        draftState.addLoyaltySystem.loading = false;
        draftState.addLoyaltySystem.success = false;
        draftState.addLoyaltySystem.error = action.payload;
      });
    case constants.RESET_ADD_LOYALTY_SYSTEM:
      return produce(state, draftState => {
        draftState.addLoyaltySystem = { ...initState.addLoyaltySystem };
      });

    case constants.UPDATE_LOYALTY_SYSTEM:
      return produce(state, draftState => {
        draftState.updateLoyaltySystem.loading = true;
      });
    case constants.UPDATE_LOYALTY_SYSTEM_SUCCESS:
      return produce(state, draftState => {
        draftState.updateLoyaltySystem.loading = false;
        draftState.updateLoyaltySystem.success = true;
        draftState.updateLoyaltySystem.error = null;
      });
    case constants.UPDATE_LOYALTY_SYSTEM_ERROR:
      return produce(state, draftState => {
        draftState.updateLoyaltySystem.loading = false;
        draftState.updateLoyaltySystem.success = false;
        draftState.updateLoyaltySystem.error = action.payload;
      });
    case constants.RESET_UPDATE_LOYALTY_SYSTEM:
      return produce(state, draftState => {
        draftState.updateLoyaltySystem = { ...initState.updateLoyaltySystem };
      });

    case constants.GET_LOYALTY_CLIENTS:
      return produce(state, draftState => {
        draftState.loyaltyClients.loading = true;
      });
    case constants.GET_LOYALTY_CLIENTS_SUCCESS:
      return produce(state, draftState => {
        draftState.loyaltyClients.loading = false;
        draftState.loyaltyClients.data = action.payload;
        draftState.loyaltyClients.params = action.params;
        draftState.loyaltyClients.error = null;
      });
    case constants.GET_LOYALTY_CLIENTS_ERROR:
      return produce(state, draftState => {
        draftState.loyaltyClients.loading = false;
        draftState.loyaltyClients.data = { ...initState.loyaltyClients.data };
        draftState.loyaltyClients.params = {};
        draftState.loyaltyClients.error = action.payload;
      });
    case constants.UPDATE_LOYALTY_CLIENTS_FILTER:
      return produce(state, draftState => {
        draftState.loyaltyClientsFilter = { ...state.loyaltyClientsFilter, ...action.payload };
      });
    case constants.RESET_LOYALTY_CLIENTS_FILTER:
      return produce(state, draftState => {
        draftState.loyaltyClientsFilter = {};
      });
    case constants.GET_A_PAY_USER_DETAILS:
      return produce(state, draftState => {
        draftState.aPayUserDetails.loading = true;
      });
    case constants.GET_A_PAY_USER_DETAILS_SUCCESS:
      return produce(state, draftState => {
        draftState.aPayUserDetails.loading = false;
        draftState.aPayUserDetails.data = action.payload;
        draftState.aPayUserDetails.error = null;
      });
    case constants.GET_A_PAY_USER_DETAILS_ERROR:
      return produce(state, draftState => {
        draftState.aPayUserDetails.loading = false;
        draftState.aPayUserDetails.data = null;
        draftState.aPayUserDetails.error = action.payload;
      });
    case constants.RESET_A_PAY_USER_DETAILS:
      return produce(state, draftState => {
        draftState.aPayUserDetails = { ...initState.aPayUserDetails };
      });

    case constants.GET_LOYALTY_CLIENT_LEVELS:
      return produce(state, draftState => {
        draftState.loyaltyClientLevels.loading = true;
      });
    case constants.GET_LOYALTY_CLIENT_LEVELS_SUCCESS:
      return produce(state, draftState => {
        draftState.loyaltyClientLevels.loading = false;
        draftState.loyaltyClientLevels.data[action.payload.loyaltyType] = action.payload.data;
        draftState.loyaltyClientLevels.error = null;
      });
    case constants.GET_LOYALTY_CLIENT_LEVELS_ERROR:
      return produce(state, draftState => {
        draftState.loyaltyClientLevels.loading = false;
        draftState.loyaltyClientLevels.error = action.payload;
      });
    case constants.RESET_LOYALTY_CLIENT_LEVELS:
      return produce(state, draftState => {
        draftState.loyaltyClientLevels = { ...initState.loyaltyClientLevels };
      });

    case constants.ADD_LOYALTY_CLIENT:
      return produce(state, draftState => {
        draftState.addLoyaltyClient.loading = true;
      });
    case constants.ADD_LOYALTY_CLIENT_SUCCESS:
      return produce(state, draftState => {
        draftState.addLoyaltyClient.loading = false;
        draftState.addLoyaltyClient.success = true;
        draftState.addLoyaltyClient.error = null;
      });
    case constants.ADD_LOYALTY_CLIENT_ERROR:
      return produce(state, draftState => {
        draftState.addLoyaltyClient.loading = false;
        draftState.addLoyaltyClient.success = false;
        draftState.addLoyaltyClient.error = action.payload;
      });
    case constants.RESET_ADD_LOYALTY_CLIENT:
      return produce(state, draftState => {
        draftState.addLoyaltyClient = { ...initState.addLoyaltyClient };
      });
    default:
      return state;
  }

};

export default reducer;
