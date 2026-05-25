import {
  createTransporter,
  deleteTransporter,
  getTransporters,
  updateTransporter,
} from "../../services/transporterApi";

export const SET_TRANSPORTERS = "SET_TRANSPORTERS";
export const SET_TRANSPORTERS_LOADING = "SET_TRANSPORTERS_LOADING";
export const SET_TRANSPORTERS_ERROR = "SET_TRANSPORTERS_ERROR";
export const CLEAR_TRANSPORTERS_ERROR = "CLEAR_TRANSPORTERS_ERROR";
export const SET_TRANSPORTERS_CREATING = "SET_TRANSPORTERS_CREATING";
export const SET_TRANSPORTERS_CREATE_ERROR = "SET_TRANSPORTERS_CREATE_ERROR";
export const CLEAR_TRANSPORTERS_CREATE_ERROR = "CLEAR_TRANSPORTERS_CREATE_ERROR";
export const SET_TRANSPORTERS_UPDATING = "SET_TRANSPORTERS_UPDATING";
export const SET_TRANSPORTERS_UPDATE_ERROR = "SET_TRANSPORTERS_UPDATE_ERROR";
export const CLEAR_TRANSPORTERS_UPDATE_ERROR = "CLEAR_TRANSPORTERS_UPDATE_ERROR";
export const SET_TRANSPORTERS_DELETING = "SET_TRANSPORTERS_DELETING";
export const SET_TRANSPORTERS_DELETE_ERROR = "SET_TRANSPORTERS_DELETE_ERROR";
export const CLEAR_TRANSPORTERS_DELETE_ERROR = "CLEAR_TRANSPORTERS_DELETE_ERROR";

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

const getTransporterList = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.transporters)) return data.transporters;
  if (Array.isArray(data?.results)) return data.results;
  return [];
};

const formatDateTime = (value) => {
  if (!value) return "-";
  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) return String(value);
  return parsedDate.toLocaleString("fr-FR");
};

const formatTransporter = (item, index) => ({
  id: item?.id ?? item?._id ?? `${index + 1}`,
  name: item?.name || "-",
  plateNumber: item?.plateNumber || "-",
  cin: item?.cin || "-",
  photoProfile: item?.photoProfile || "",
  createdAt: formatDateTime(item?.createdAt),
  updatedAt: formatDateTime(item?.updatedAt),
});

const buildTransporterPayload = (payload) => ({
  name: String(payload?.name || "").trim(),
  plateNumber: String(payload?.plateNumber || "").trim(),
  cin: String(payload?.cin || "").trim(),
  photoProfile: String(payload?.photoProfile || "").trim(),
});

export const setTransporters = (items) => ({ type: SET_TRANSPORTERS, payload: items });
export const setTransportersLoading = (loading) => ({ type: SET_TRANSPORTERS_LOADING, payload: loading });
export const setTransportersError = (error) => ({ type: SET_TRANSPORTERS_ERROR, payload: error });
export const clearTransportersError = () => ({ type: CLEAR_TRANSPORTERS_ERROR });
export const setTransportersCreating = (creating) => ({ type: SET_TRANSPORTERS_CREATING, payload: creating });
export const setTransportersCreateError = (error) => ({ type: SET_TRANSPORTERS_CREATE_ERROR, payload: error });
export const clearTransportersCreateError = () => ({ type: CLEAR_TRANSPORTERS_CREATE_ERROR });
export const setTransportersUpdating = (updating) => ({ type: SET_TRANSPORTERS_UPDATING, payload: updating });
export const setTransportersUpdateError = (error) => ({ type: SET_TRANSPORTERS_UPDATE_ERROR, payload: error });
export const clearTransportersUpdateError = () => ({ type: CLEAR_TRANSPORTERS_UPDATE_ERROR });
export const setTransportersDeleting = (deleting) => ({ type: SET_TRANSPORTERS_DELETING, payload: deleting });
export const setTransportersDeleteError = (error) => ({ type: SET_TRANSPORTERS_DELETE_ERROR, payload: error });
export const clearTransportersDeleteError = () => ({ type: CLEAR_TRANSPORTERS_DELETE_ERROR });

export const fetchTransporters = (params = {}) => {
  return async (dispatch) => {
    dispatch(setTransportersLoading(true));
    dispatch(clearTransportersError());

    try {
      const data = await getTransporters(params);
      const items = getTransporterList(data).map(formatTransporter);
      dispatch(setTransporters(items));
      dispatch(setTransportersLoading(false));
      return { success: true, items };
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Erreur lors du chargement des transporteurs.";
      dispatch(setTransportersError(errorMessage));
      dispatch(setTransportersLoading(false));
      return { success: false, error: errorMessage };
    }
  };
};

export const createTransporterThunk = (payload) => {
  return async (dispatch) => {
    dispatch(setTransportersCreating(true));
    dispatch(clearTransportersCreateError());

    try {
      const data = await createTransporter(buildTransporterPayload(payload));
      await dispatch(fetchTransporters());
      dispatch(setTransportersCreating(false));
      return { success: true, data };
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Erreur lors de la création du transporteur.";
      dispatch(setTransportersCreateError(errorMessage));
      dispatch(setTransportersCreating(false));
      return { success: false, error: errorMessage };
    }
  };
};

export const updateTransporterThunk = (id, payload) => {
  return async (dispatch) => {
    dispatch(setTransportersUpdating(true));
    dispatch(clearTransportersUpdateError());

    try {
      const data = await updateTransporter(id, buildTransporterPayload(payload));
      await dispatch(fetchTransporters());
      dispatch(setTransportersUpdating(false));
      return { success: true, data };
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Erreur lors de la mise à jour du transporteur.";
      dispatch(setTransportersUpdateError(errorMessage));
      dispatch(setTransportersUpdating(false));
      return { success: false, error: errorMessage };
    }
  };
};

export const deleteTransporterThunk = (id) => {
  return async (dispatch) => {
    dispatch(setTransportersDeleting(true));
    dispatch(clearTransportersDeleteError());

    try {
      const data = await deleteTransporter(id);
      await dispatch(fetchTransporters());
      dispatch(setTransportersDeleting(false));
      return { success: true, data };
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Erreur lors de la suppression du transporteur.";
      dispatch(setTransportersDeleteError(errorMessage));
      dispatch(setTransportersDeleting(false));
      return { success: false, error: errorMessage };
    }
  };
};

function TransportersReducer(state = initialState, action) {
  switch (action.type) {
    case SET_TRANSPORTERS:
      return { ...state, items: action.payload };
    case SET_TRANSPORTERS_LOADING:
      return { ...state, loading: action.payload };
    case SET_TRANSPORTERS_ERROR:
      return { ...state, error: action.payload };
    case CLEAR_TRANSPORTERS_ERROR:
      return { ...state, error: null };
    case SET_TRANSPORTERS_CREATING:
      return { ...state, creating: action.payload };
    case SET_TRANSPORTERS_CREATE_ERROR:
      return { ...state, createError: action.payload };
    case CLEAR_TRANSPORTERS_CREATE_ERROR:
      return { ...state, createError: null };
    case SET_TRANSPORTERS_UPDATING:
      return { ...state, updating: action.payload };
    case SET_TRANSPORTERS_UPDATE_ERROR:
      return { ...state, updateError: action.payload };
    case CLEAR_TRANSPORTERS_UPDATE_ERROR:
      return { ...state, updateError: null };
    case SET_TRANSPORTERS_DELETING:
      return { ...state, deleting: action.payload };
    case SET_TRANSPORTERS_DELETE_ERROR:
      return { ...state, deleteError: action.payload };
    case CLEAR_TRANSPORTERS_DELETE_ERROR:
      return { ...state, deleteError: null };
    default:
      return state;
  }
}

export default TransportersReducer;
