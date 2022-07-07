import Logic from '#businessLayer';
import axios from "axios";
import * as constants from "./constants";

const CancelToken = axios.CancelToken;
let cardsListSource = CancelToken.source();
let cardsListStatsSource = CancelToken.source();
let systemsListSource = CancelToken.source();
let clientsListSource = CancelToken.source();

export const getLoyaltyCardTypes = () => {
  return dispatch => {
    dispatch({ type: constants.GET_LOYALTY_CARD_TYPES });

    Logic.loyalty.getLoyaltyCardTypes()
      .then(response => {
        dispatch({
          type: constants.GET_LOYALTY_CARD_TYPES_SUCCESS,
          payload: response.data
        });
      })
      .catch((error) => {
        dispatch({ type: constants.GET_LOYALTY_CARD_TYPES_ERROR, payload: error });
      });
  }
};

export const getLoyaltyPeriods = () => {
  return dispatch => {
    dispatch({ type: constants.GET_LOYALTY_PERIODS });

    Logic.loyalty.getLoyaltyPeriods()
      .then(response => {
        dispatch({
          type: constants.GET_LOYALTY_PERIODS_SUCCESS,
          payload: response.data
        });
      })
      .catch((error) => {
        dispatch({ type: constants.GET_LOYALTY_PERIODS_ERROR, payload: error });
      });
  }
};

export const getLoyaltySystemStatuses = () => {
  return dispatch => {
    dispatch({ type: constants.GET_LOYALTY_SYSTEM_STATUSES });

    Logic.loyalty.getLoyaltySystemStatuses()
      .then(response => {
        dispatch({
          type: constants.GET_LOYALTY_SYSTEM_STATUSES_SUCCESS,
          payload: response.data
        });
      })
      .catch((error) => {
        dispatch({ type: constants.GET_LOYALTY_SYSTEM_STATUSES_ERROR, payload: error });
      });
  }
};

export const getLoyaltySystemsItems = () => {
  return dispatch => {
    dispatch({ type: constants.GET_LOYALTY_SYSTEMS_ITEMS });

    Logic.loyalty.getLoyaltySystemsItems()
      .then(response => {
        dispatch({
          type: constants.GET_LOYALTY_SYSTEMS_ITEMS_SUCCESS,
          payload: response.data
        });
      })
      .catch((error) => {
        dispatch({ type: constants.GET_LOYALTY_SYSTEMS_ITEMS_ERROR, payload: error });
      });
  }
};

// Cards

export const getLoyaltyCardsList = (params) => {
  return dispatch => {
    cardsListSource.cancel('Остановить запрос!');
    cardsListSource = CancelToken.source();
    dispatch({ type: constants.GET_LOYALTY_CARDS });

    Logic.loyalty.getLoyaltyCardsList(params, cardsListSource.token)
      .then(response => {
        dispatch({
          type: constants.GET_LOYALTY_CARDS_SUCCESS,
          payload: response.data,
          params
        });
      })
      .catch((error) => {
        dispatch({ type: constants.GET_LOYALTY_CARDS_ERROR, payload: error });
      });
  }
};

export const updateLoyaltyCardsListFilter = (payload) => {
  return {
    type: constants.UPDATE_LOYALTY_CARDS_FILTER,
    payload
  };
};

export const resetLoyaltyCardsListFilter = () => {
  return {
    type: constants.RESET_LOYALTY_CARDS_FILTER,
  };
};

export const getLoyaltyCardsStats = (params) => {
  return dispatch => {
    cardsListStatsSource.cancel('Остановить запрос!');
    cardsListStatsSource = CancelToken.source();
    dispatch({ type: constants.GET_LOYALTY_CARDS_STATS });

    Logic.loyalty.getLoyaltyCardsStats(params, cardsListStatsSource.token)
      .then(response => {
        dispatch({
          type: constants.GET_LOYALTY_CARDS_STATS_SUCCESS,
          payload: response.data
        });
      })
      .catch((error) => {
        dispatch({ type: constants.GET_LOYALTY_CARDS_STATS_ERROR, payload: error });
      });
  }
};

export const getLoyaltyCardDetails = (cardId) => {
  return dispatch => {
    dispatch({ type: constants.GET_LOYALTY_CARD_DETAILS });

    Logic.loyalty.getLoyaltyCardDetails(cardId)
      .then(response => {
        dispatch({
          type: constants.GET_LOYALTY_CARD_DETAILS_SUCCESS,
          payload: response.data
        });
      })
      .catch((error) => {
        dispatch({ type: constants.GET_LOYALTY_CARD_DETAILS_ERROR, payload: error });
      });
  }
};

export const resetLoyaltyCardDetails = () => {
  return {
    type: constants.RESET_LOYALTY_CARD_DETAILS,
  };
};

export const addLoyaltyCard = (data) => {
  return dispatch => {
    dispatch({ type: constants.ADD_LOYALTY_CARD });

    Logic.loyalty.addLoyaltyCard(data)
      .then(response => {
        dispatch({
          type: constants.ADD_LOYALTY_CARD_SUCCESS,
          payload: response.data
        });
      })
      .catch((error) => {
        dispatch({ type: constants.ADD_LOYALTY_CARD_ERROR, payload: error.response.data });
      });
  }
};

export const resetAddLoyaltyCard = () => {
  return {
    type: constants.RESET_ADD_LOYALTY_CARD,
  };
};

export const updateLoyaltyCard = (data) => {
  return dispatch => {
    dispatch({ type: constants.UPDATE_LOYALTY_CARD });

    Logic.loyalty.updateLoyaltyCard(data)
      .then(response => {
        dispatch({
          type: constants.UPDATE_LOYALTY_CARD_SUCCESS,
          payload: response.data
        });
      })
      .catch((error) => {
        dispatch({ type: constants.UPDATE_LOYALTY_CARD_ERROR, payload: error.response.data });
      });
  }
};

export const resetUpdateLoyaltyCard = () => {
  return {
    type: constants.RESET_UPDATE_LOYALTY_CARD,
  };
};

export const deleteLoyaltyCard = (id) => {
  return dispatch => {
    dispatch({ type: constants.DELETE_LOYALTY_CARD });

    Logic.loyalty.deleteLoyaltyCard(id)
      .then(response => {
        dispatch({
          type: constants.DELETE_LOYALTY_CARD_SUCCESS,
          payload: response.data
        });
      })
      .catch((error) => {
        dispatch({ type: constants.DELETE_LOYALTY_CARD_ERROR, payload: error.response.data });
      });
  }
};

export const resetDeleteLoyaltyCard = () => {
  return {
    type: constants.RESET_DELETE_LOYALTY_CARD_ERROR,
  };
};

// Systems

export const getLoyaltySystemsList = (params) => {
  return dispatch => {
    systemsListSource.cancel('Остановить запрос!');
    systemsListSource = CancelToken.source();
    dispatch({ type: constants.GET_LOYALTY_SYSTEMS });

    Logic.loyalty.getLoyaltySystemsList(params, systemsListSource.token)
      .then(response => {
        dispatch({
          type: constants.GET_LOYALTY_SYSTEMS_SUCCESS,
          payload: response.data,
          params
        });
      })
      .catch((error) => {
        dispatch({ type: constants.GET_LOYALTY_SYSTEMS_ERROR, payload: error });
      });
  }
};

export const updateLoyaltySystemsListFilter = (payload) => {
  return {
    type: constants.UPDATE_LOYALTY_SYSTEMS_FILTER,
    payload
  };
};

export const resetLoyaltySystemsListFilter = () => {
  return {
    type: constants.RESET_LOYALTY_SYSTEMS_FILTER,
  };
};

export const changeLoyaltySystemStatus = (data) => {
  return dispatch => {
    dispatch({ type: constants.CHANGE_LOYALTY_SYSTEM_STATUS });

    Logic.loyalty.changeLoyaltySystemStatus(data)
      .then(response => {
        dispatch({
          type: constants.CHANGE_LOYALTY_SYSTEM_STATUS_SUCCESS,
          payload: response.data
        });
      })
      .catch((error) => {
        dispatch({ type: constants.CHANGE_LOYALTY_SYSTEM_STATUS_ERROR, payload: error });
      });
  }
};

export const resetChangeLoyaltySystemStatus = () => {
  return {
    type: constants.RESET_CHANGE_LOYALTY_SYSTEM_STATUS,
  };
};

export const getLoyaltySystemDetails = (id) => {
  return dispatch => {
    dispatch({ type: constants.GET_LOYALTY_SYSTEM_DETAILS });

    Logic.loyalty.getLoyaltySystemDetails(id)
      .then(response => {
        dispatch({
          type: constants.GET_LOYALTY_SYSTEM_DETAILS_SUCCESS,
          payload: response.data
        });
      })
      .catch((error) => {
        dispatch({ type: constants.GET_LOYALTY_SYSTEM_DETAILS_ERROR, payload: error });
      });
  }
};

export const resetLoyaltySystemDetails = () => {
  return {
    type: constants.RESET_LOYALTY_SYSTEM_DETAILS,
  };
};

export const getAddLoyaltySystemCards = (params) => {
  return dispatch => {
    dispatch({ type: constants.GET_ADD_LOYALTY_SYSTEM_CARDS });

    Logic.loyalty.getAddLoyaltySystemCards(params)
      .then(response => {
        dispatch({
          type: constants.GET_ADD_LOYALTY_SYSTEM_CARDS_SUCCESS,
          payload: response.data
        });
      })
      .catch((error) => {
        dispatch({ type: constants.GET_ADD_LOYALTY_SYSTEM_CARDS_ERROR, payload: error });
      });
  }
};

export const getAddLoyaltySystemBranches = (params) => {
  return dispatch => {
    dispatch({ type: constants.GET_ADD_LOYALTY_SYSTEM_BRANCHES });

    Logic.loyalty.getAddLoyaltySystemBranches(params)
      .then(response => {
        dispatch({
          type: constants.GET_ADD_LOYALTY_SYSTEM_BRANCHES_SUCCESS,
          payload: response.data
        });
      })
      .catch((error) => {
        dispatch({ type: constants.GET_ADD_LOYALTY_SYSTEM_BRANCHES_ERROR, payload: error });
      });
  }
};

export const addLoyaltySystem = (data) => {
  return dispatch => {
    dispatch({ type: constants.ADD_LOYALTY_SYSTEM });

    Logic.loyalty.addLoyaltySystem(data)
      .then(response => {
        dispatch({
          type: constants.ADD_LOYALTY_SYSTEM_SUCCESS,
          payload: response.data
        });
      })
      .catch((error) => {
        dispatch({ type: constants.ADD_LOYALTY_SYSTEM_ERROR, payload: error.response.data });
      });
  }
};

export const resetAddLoyaltySystem = () => {
  return {
    type: constants.RESET_ADD_LOYALTY_SYSTEM,
  };
};


export const updateLoyaltySystem = (data) => {
  return dispatch => {
    dispatch({ type: constants.UPDATE_LOYALTY_SYSTEM });

    Logic.loyalty.updateLoyaltySystem(data)
      .then(response => {
        dispatch({
          type: constants.UPDATE_LOYALTY_SYSTEM_SUCCESS,
          payload: response.data
        });
      })
      .catch((error) => {
        dispatch({ type: constants.UPDATE_LOYALTY_SYSTEM_ERROR, payload: error.response.data });
      });
  }
};

export const resetUpdateLoyaltySystem = () => {
  return {
    type: constants.RESET_UPDATE_LOYALTY_SYSTEM,
  };
};

// Clients

export const getLoyaltyClients = (params) => {
  return dispatch => {
    clientsListSource.cancel('Остановить запрос!');
    clientsListSource = CancelToken.source();
    dispatch({ type: constants.GET_LOYALTY_CLIENTS });

    Logic.loyalty.getLoyaltyClients(params, clientsListSource.token)
      .then(response => {
        dispatch({
          type: constants.GET_LOYALTY_CLIENTS_SUCCESS,
          payload: response.data,
          params
        });
      })
      .catch((error) => {
        dispatch({ type: constants.GET_LOYALTY_CLIENTS_ERROR, payload: error });
      });
  }
};

export const updateLoyaltyClientsFilter = (payload) => {
  return {
    type: constants.UPDATE_LOYALTY_CLIENTS_FILTER,
    payload
  };
};

export const resetLoyaltyClientsFilter = () => {
  return {
    type: constants.RESET_LOYALTY_CLIENTS_FILTER,
  };
};

export const getAPayUserDetails = (login) => {
  return dispatch => {
    dispatch({ type: constants.GET_A_PAY_USER_DETAILS });

    Logic.loyalty.getAPayUserDetails(login)
      .then(response => {
        dispatch({
          type: constants.GET_A_PAY_USER_DETAILS_SUCCESS,
          payload: response.data
        });
      })
      .catch((error) => {
        dispatch({ type: constants.GET_A_PAY_USER_DETAILS_ERROR, payload: error });
      });
  }
};

export const resetAPayUserDetails = () => {
  return {
    type: constants.RESET_A_PAY_USER_DETAILS,
  };
};

export const getLoyaltyClientLevels = (systemId, loyaltyType) => {
  return dispatch => {
    dispatch({ type: constants.GET_LOYALTY_CLIENT_LEVELS });

    Logic.loyalty.getLoyaltyClientLevels(systemId)
      .then(response => {
        dispatch({
          type: constants.GET_LOYALTY_CLIENT_LEVELS_SUCCESS,
          payload: {
            loyaltyType,
            data: response.data,
          }
        });
      })
      .catch((error) => {
        dispatch({ type: constants.GET_LOYALTY_CLIENT_LEVELS_ERROR, payload: error });
      });
  }
};

export const resetLoyaltyClientLevels = () => {
  return {
    type: constants.RESET_LOYALTY_CLIENT_LEVELS,
  };
};

export const addLoyaltyClient = (data) => {
  return dispatch => {
    dispatch({ type: constants.ADD_LOYALTY_CLIENT });

    Logic.loyalty.addLoyaltyClient(data)
      .then(response => {
        dispatch({
          type: constants.ADD_LOYALTY_CLIENT_SUCCESS,
          payload: response.data
        });
      })
      .catch((error) => {
        dispatch({ type: constants.ADD_LOYALTY_CLIENT_ERROR, payload: error.response.data });
      });
  }
};

export const resetAddLoyaltyClient = () => {
  return {
    type: constants.RESET_ADD_LOYALTY_CLIENT,
  };
};