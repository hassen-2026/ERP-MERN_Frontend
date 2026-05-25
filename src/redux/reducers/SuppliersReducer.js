import { createSupplier, deleteSupplier, getSuppliers, updateSupplier } from "../../services/supplierApi";

export const SET_SUPPLIERS = "SET_SUPPLIERS";
export const SET_SUPPLIERS_LOADING = "SET_SUPPLIERS_LOADING";
export const SET_SUPPLIERS_ERROR = "SET_SUPPLIERS_ERROR";
export const CLEAR_SUPPLIERS_ERROR = "CLEAR_SUPPLIERS_ERROR";
export const SET_SUPPLIERS_CREATING = "SET_SUPPLIERS_CREATING";
export const SET_SUPPLIERS_CREATE_ERROR = "SET_SUPPLIERS_CREATE_ERROR";
export const CLEAR_SUPPLIERS_CREATE_ERROR = "CLEAR_SUPPLIERS_CREATE_ERROR";
export const SET_SUPPLIERS_UPDATING = "SET_SUPPLIERS_UPDATING";
export const SET_SUPPLIERS_UPDATE_ERROR = "SET_SUPPLIERS_UPDATE_ERROR";
export const CLEAR_SUPPLIERS_UPDATE_ERROR = "CLEAR_SUPPLIERS_UPDATE_ERROR";
export const SET_SUPPLIERS_DELETING = "SET_SUPPLIERS_DELETING";
export const SET_SUPPLIERS_DELETE_ERROR = "SET_SUPPLIERS_DELETE_ERROR";
export const CLEAR_SUPPLIERS_DELETE_ERROR = "CLEAR_SUPPLIERS_DELETE_ERROR";

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

export const setSuppliers = (items) => ({ type: SET_SUPPLIERS, payload: items });
export const setSuppliersLoading = (loading) => ({ type: SET_SUPPLIERS_LOADING, payload: loading });
export const setSuppliersError = (error) => ({ type: SET_SUPPLIERS_ERROR, payload: error });
export const clearSuppliersError = () => ({ type: CLEAR_SUPPLIERS_ERROR });
export const setSuppliersCreating = (creating) => ({ type: SET_SUPPLIERS_CREATING, payload: creating });
export const setSuppliersCreateError = (error) => ({ type: SET_SUPPLIERS_CREATE_ERROR, payload: error });
export const clearSuppliersCreateError = () => ({ type: CLEAR_SUPPLIERS_CREATE_ERROR });
export const setSuppliersUpdating = (updating) => ({ type: SET_SUPPLIERS_UPDATING, payload: updating });
export const setSuppliersUpdateError = (error) => ({ type: SET_SUPPLIERS_UPDATE_ERROR, payload: error });
export const clearSuppliersUpdateError = () => ({ type: CLEAR_SUPPLIERS_UPDATE_ERROR });
export const setSuppliersDeleting = (deleting) => ({ type: SET_SUPPLIERS_DELETING, payload: deleting });
export const setSuppliersDeleteError = (error) => ({ type: SET_SUPPLIERS_DELETE_ERROR, payload: error });
export const clearSuppliersDeleteError = () => ({ type: CLEAR_SUPPLIERS_DELETE_ERROR });

const getSupplierList = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.suppliers)) return data.suppliers;
  if (Array.isArray(data?.results)) return data.results;
  return [];
};

const formatDateTime = (value) => {
  if (!value) return "-";
  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) return String(value);
  return parsedDate.toLocaleString("fr-FR");
};

const formatSupplier = (supplier, index) => {
  const firstName = supplier?.firstName || "";
  const lastName = supplier?.lastName || "";
  const fullName = `${firstName} ${lastName}`.trim() || supplier?.name || "Fournisseur";
  const createdAtSource = supplier?.createdAt ?? supplier?.created_at ?? null;
  const updatedAtSource = supplier?.updatedAt ?? supplier?.updated_at ?? null;

  return {
    id: supplier?.id ?? supplier?._id ?? `${index + 1}`,
    firstName,
    lastName,
    fullName,
    email: supplier?.email || "-",
    phone: supplier?.phone || "-",
    address: supplier?.address || "-",
    matriculeFiscale: supplier?.matriculeFiscale || "-",
    imageUrl: supplier?.imageUrl || "",
    country: supplier?.country || "-",
    city: supplier?.city || "-",
    createdAt: formatDateTime(createdAtSource),
    updatedAt: formatDateTime(updatedAtSource),
    createdAtIso: createdAtSource,
    updatedAtIso: updatedAtSource,
  };
};

const buildSupplierPayload = (payload) => ({
  firstName: String(payload?.firstName || "").trim(),
  lastName: String(payload?.lastName || "").trim(),
  email: String(payload?.email || "").trim(),
  phone: String(payload?.phone || "").trim(),
  address: String(payload?.address || "").trim(),
  matriculeFiscale: String(payload?.matriculeFiscale || "").trim(),
  imageUrl: String(payload?.imageUrl || "").trim(),
  country: String(payload?.country || "").trim(),
  city: String(payload?.city || "").trim(),
});

export const fetchSuppliers = (params = {}) => {
  return async (dispatch) => {
    dispatch(setSuppliersLoading(true));
    dispatch(clearSuppliersError());

    try {
      const data = await getSuppliers(params);
      const items = getSupplierList(data).map(formatSupplier);

      dispatch(setSuppliers(items));
      dispatch(setSuppliersLoading(false));

      return { success: true, items };
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Erreur lors du chargement des fournisseurs.";

      dispatch(setSuppliersError(errorMessage));
      dispatch(setSuppliersLoading(false));

      return { success: false, error: errorMessage };
    }
  };
};

export const createSupplierThunk = (payload) => {
  return async (dispatch) => {
    dispatch(setSuppliersCreating(true));
    dispatch(clearSuppliersCreateError());

    try {
      const requestPayload = buildSupplierPayload(payload);
      const data = await createSupplier(requestPayload);
      await dispatch(fetchSuppliers());
      dispatch(setSuppliersCreating(false));

      return { success: true, data };
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Erreur lors de l'enregistrement du fournisseur.";
      dispatch(setSuppliersCreateError(errorMessage));
      dispatch(setSuppliersCreating(false));

      return { success: false, error: errorMessage };
    }
  };
};

export const updateSupplierThunk = (id, payload) => {
  return async (dispatch) => {
    dispatch(setSuppliersUpdating(true));
    dispatch(clearSuppliersUpdateError());

    try {
      const requestPayload = buildSupplierPayload(payload);
      const data = await updateSupplier(id, requestPayload);
      await dispatch(fetchSuppliers());
      dispatch(setSuppliersUpdating(false));

      return { success: true, data };
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Erreur lors de la mise à jour du fournisseur.";
      dispatch(setSuppliersUpdateError(errorMessage));
      dispatch(setSuppliersUpdating(false));

      return { success: false, error: errorMessage };
    }
  };
};

export const deleteSupplierThunk = (id) => {
  return async (dispatch) => {
    dispatch(setSuppliersDeleting(true));
    dispatch(clearSuppliersDeleteError());

    try {
      const data = await deleteSupplier(id);
      await dispatch(fetchSuppliers());
      dispatch(setSuppliersDeleting(false));

      return { success: true, data };
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Erreur lors de la suppression du fournisseur.";
      dispatch(setSuppliersDeleteError(errorMessage));
      dispatch(setSuppliersDeleting(false));

      return { success: false, error: errorMessage };
    }
  };
};

function SuppliersReducer(state = initialState, action) {
  switch (action.type) {
    case SET_SUPPLIERS:
      return { ...state, items: action.payload };
    case SET_SUPPLIERS_LOADING:
      return { ...state, loading: action.payload };
    case SET_SUPPLIERS_ERROR:
      return { ...state, error: action.payload };
    case CLEAR_SUPPLIERS_ERROR:
      return { ...state, error: null };
    case SET_SUPPLIERS_CREATING:
      return { ...state, creating: action.payload };
    case SET_SUPPLIERS_CREATE_ERROR:
      return { ...state, createError: action.payload };
    case CLEAR_SUPPLIERS_CREATE_ERROR:
      return { ...state, createError: null };
    case SET_SUPPLIERS_UPDATING:
      return { ...state, updating: action.payload };
    case SET_SUPPLIERS_UPDATE_ERROR:
      return { ...state, updateError: action.payload };
    case CLEAR_SUPPLIERS_UPDATE_ERROR:
      return { ...state, updateError: null };
    case SET_SUPPLIERS_DELETING:
      return { ...state, deleting: action.payload };
    case SET_SUPPLIERS_DELETE_ERROR:
      return { ...state, deleteError: action.payload };
    case CLEAR_SUPPLIERS_DELETE_ERROR:
      return { ...state, deleteError: null };
    default:
      return state;
  }
}

export default SuppliersReducer;
