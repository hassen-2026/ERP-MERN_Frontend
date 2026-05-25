import { createClient, deleteClient, getClients, updateClient } from "../../services/clientApi";

export const SET_CLIENTS = "SET_CLIENTS";
export const SET_CLIENTS_LOADING = "SET_CLIENTS_LOADING";
export const SET_CLIENTS_ERROR = "SET_CLIENTS_ERROR";
export const CLEAR_CLIENTS_ERROR = "CLEAR_CLIENTS_ERROR";
export const SET_CLIENTS_CREATING = "SET_CLIENTS_CREATING";
export const SET_CLIENTS_CREATE_ERROR = "SET_CLIENTS_CREATE_ERROR";
export const CLEAR_CLIENTS_CREATE_ERROR = "CLEAR_CLIENTS_CREATE_ERROR";
export const SET_CLIENTS_UPDATING = "SET_CLIENTS_UPDATING";
export const SET_CLIENTS_UPDATE_ERROR = "SET_CLIENTS_UPDATE_ERROR";
export const CLEAR_CLIENTS_UPDATE_ERROR = "CLEAR_CLIENTS_UPDATE_ERROR";
export const SET_CLIENTS_DELETING = "SET_CLIENTS_DELETING";
export const SET_CLIENTS_DELETE_ERROR = "SET_CLIENTS_DELETE_ERROR";
export const CLEAR_CLIENTS_DELETE_ERROR = "CLEAR_CLIENTS_DELETE_ERROR";

export const initialState = {
  items: [],
  loading: false,
  error: null,
  creating: false,
  createError: null,
  updating: false,
  updateError: null,
  deleting: false,
  deleteError: null,
};

const getClientList = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.clients)) return data.clients;
  if (Array.isArray(data?.results)) return data.results;
  return [];
};

const formatDateTime = (value) => {
  if (!value) return "-";
  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) return String(value);
  return parsedDate.toLocaleString("fr-FR");
};

const formatClient = (client, index) => {
  const name = client?.nom || client?.name || "Client";

  return {
    id: client?.id ?? client?._id ?? `${index + 1}`,
    nom: client?.nom || client?.name || "-",
    email: client?.email || "-",
    telephone: client?.telephone || client?.phone || "-",
    adresse: client?.adresse || client?.address || "-",
    fullName: name,
    phone: client?.telephone || client?.phone || "-",
    address: client?.adresse || client?.address || "-",
    createdAt: formatDateTime(client?.createdAt),
    updatedAt: formatDateTime(client?.updatedAt),
  };
};

const buildClientPayload = (payload) => ({
  nom: String(payload?.nom || payload?.name || "").trim(),
  email: String(payload?.email || payload?.mail || "").trim(),
  telephone: String(payload?.telephone || payload?.phone || "").trim(),
  adresse: String(payload?.adresse || payload?.address || "").trim(),
});

export const setClients = (items) => ({ type: SET_CLIENTS, payload: items });
export const setClientsLoading = (loading) => ({ type: SET_CLIENTS_LOADING, payload: loading });
export const setClientsError = (error) => ({ type: SET_CLIENTS_ERROR, payload: error });
export const clearClientsError = () => ({ type: CLEAR_CLIENTS_ERROR });
export const setClientsCreating = (creating) => ({ type: SET_CLIENTS_CREATING, payload: creating });
export const setClientsCreateError = (error) => ({ type: SET_CLIENTS_CREATE_ERROR, payload: error });
export const clearClientsCreateError = () => ({ type: CLEAR_CLIENTS_CREATE_ERROR });
export const setClientsUpdating = (updating) => ({ type: SET_CLIENTS_UPDATING, payload: updating });
export const setClientsUpdateError = (error) => ({ type: SET_CLIENTS_UPDATE_ERROR, payload: error });
export const clearClientsUpdateError = () => ({ type: CLEAR_CLIENTS_UPDATE_ERROR });
export const setClientsDeleting = (deleting) => ({ type: SET_CLIENTS_DELETING, payload: deleting });
export const setClientsDeleteError = (error) => ({ type: SET_CLIENTS_DELETE_ERROR, payload: error });
export const clearClientsDeleteError = () => ({ type: CLEAR_CLIENTS_DELETE_ERROR });

export const fetchClients = (params = {}) => {
  return async (dispatch) => {
    dispatch(setClientsLoading(true));
    dispatch(clearClientsError());

    try {
      const data = await getClients(params);
      const items = getClientList(data).map(formatClient);
      dispatch(setClients(items));
      dispatch(setClientsLoading(false));
      return { success: true, items };
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Erreur lors du chargement des clients.";
      dispatch(setClientsError(errorMessage));
      dispatch(setClientsLoading(false));
      return { success: false, error: errorMessage };
    }
  };
};

export const createClientThunk = (payload) => {
  return async (dispatch) => {
    dispatch(setClientsCreating(true));
    dispatch(clearClientsCreateError());

    try {
      const data = await createClient(buildClientPayload(payload));
      await dispatch(fetchClients());
      dispatch(setClientsCreating(false));
      return { success: true, data };
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Erreur lors de la creation du client.";
      dispatch(setClientsCreateError(errorMessage));
      dispatch(setClientsCreating(false));
      return { success: false, error: errorMessage };
    }
  };
};

export const updateClientThunk = (id, payload) => {
  return async (dispatch) => {
    dispatch(setClientsUpdating(true));
    dispatch(clearClientsUpdateError());

    try {
      const data = await updateClient(id, buildClientPayload(payload));
      await dispatch(fetchClients());
      dispatch(setClientsUpdating(false));
      return { success: true, data };
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Erreur lors de la mise a jour du client.";
      dispatch(setClientsUpdateError(errorMessage));
      dispatch(setClientsUpdating(false));
      return { success: false, error: errorMessage };
    }
  };
};

export const deleteClientThunk = (id) => {
  return async (dispatch) => {
    dispatch(setClientsDeleting(true));
    dispatch(clearClientsDeleteError());

    try {
      const data = await deleteClient(id);
      await dispatch(fetchClients());
      dispatch(setClientsDeleting(false));
      return { success: true, data };
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Erreur lors de la suppression du client.";
      dispatch(setClientsDeleteError(errorMessage));
      dispatch(setClientsDeleting(false));
      return { success: false, error: errorMessage };
    }
  };
};

function ClientReducer(state = initialState, action) {
  switch (action.type) {
    case SET_CLIENTS:
      return { ...state, items: action.payload };
    case SET_CLIENTS_LOADING:
      return { ...state, loading: action.payload };
    case SET_CLIENTS_ERROR:
      return { ...state, error: action.payload };
    case CLEAR_CLIENTS_ERROR:
      return { ...state, error: null };
    case SET_CLIENTS_CREATING:
      return { ...state, creating: action.payload };
    case SET_CLIENTS_CREATE_ERROR:
      return { ...state, createError: action.payload };
    case CLEAR_CLIENTS_CREATE_ERROR:
      return { ...state, createError: null };
    case SET_CLIENTS_UPDATING:
      return { ...state, updating: action.payload };
    case SET_CLIENTS_UPDATE_ERROR:
      return { ...state, updateError: action.payload };
    case CLEAR_CLIENTS_UPDATE_ERROR:
      return { ...state, updateError: null };
    case SET_CLIENTS_DELETING:
      return { ...state, deleting: action.payload };
    case SET_CLIENTS_DELETE_ERROR:
      return { ...state, deleteError: action.payload };
    case CLEAR_CLIENTS_DELETE_ERROR:
      return { ...state, deleteError: null };
    default:
      return state;
  }
}

export default ClientReducer;