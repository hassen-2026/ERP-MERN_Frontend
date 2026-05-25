import {
  deleteFacture,
  getFactureById,
  getFactures,
  updateFacture,
} from "../../services/factureApi";

export const SET_FACTURES = "SET_FACTURES";
export const SET_FACTURE_CURRENT = "SET_FACTURE_CURRENT";
export const SET_FACTURE_LOADING = "SET_FACTURE_LOADING";
export const SET_FACTURE_ERROR = "SET_FACTURE_ERROR";
export const CLEAR_FACTURE_ERROR = "CLEAR_FACTURE_ERROR";
export const SET_FACTURES_LOADING = "SET_FACTURES_LOADING";
export const SET_FACTURES_ERROR = "SET_FACTURES_ERROR";
export const CLEAR_FACTURES_ERROR = "CLEAR_FACTURES_ERROR";
export const SET_FACTURES_UPDATING = "SET_FACTURES_UPDATING";
export const SET_FACTURES_UPDATE_ERROR = "SET_FACTURES_UPDATE_ERROR";
export const CLEAR_FACTURES_UPDATE_ERROR = "CLEAR_FACTURES_UPDATE_ERROR";
export const SET_FACTURES_DELETING = "SET_FACTURES_DELETING";
export const SET_FACTURES_DELETE_ERROR = "SET_FACTURES_DELETE_ERROR";
export const CLEAR_FACTURES_DELETE_ERROR = "CLEAR_FACTURES_DELETE_ERROR";

export const initialState = {
  items: [],
  current: null,
  loading: false,
  error: null,
  listLoading: false,
  listError: null,
  currentLoading: false,
  currentError: null,
  updating: false,
  updateError: null,
  deleting: false,
  deleteError: null,
};

const getFactureList = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.factures)) return data.factures;
  if (Array.isArray(data?.results)) return data.results;
  return [];
};

const formatDateTime = (value) => {
  if (!value) return "-";
  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) return String(value);
  return parsedDate.toLocaleString("fr-FR");
};

const normalizePaymentStatus = (status) => {
  const normalized = String(status || "UNPAID").toUpperCase();
  const labelMap = {
    UNPAID: "Impayee",
    PARTIAL: "Partiellement payee",
    PAID: "Payee",
    CANCELLED: "Annulee",
  };
  return { value: normalized, label: labelMap[normalized] || normalized };
};

const formatFacture = (facture) => {
  if (!facture) return null;

  const paymentStatus = normalizePaymentStatus(facture.paymentStatus);
  const items = Array.isArray(facture.items)
    ? facture.items.map((item, index) => {
        const quantity = Number(item?.quantity) || 0;
        const unitPrice = Number(item?.unitPrice) || 0;
        const lineTotal = Number(item?.lineTotal ?? quantity * unitPrice) || 0;
        return {
          id: item?.id ?? item?._id ?? `${index + 1}`,
          productName: item?.product?.name || item?.product?.reference || "Produit",
          productReference: item?.product?.reference || "-",
          quantity,
          unitPrice,
          lineTotal,
        };
      })
    : [];

  const subTotal = items.reduce((sum, item) => sum + Number(item.lineTotal || 0), 0);
  const totalAmountTTC = Number(facture.totalAmountTTC) || subTotal;
  const tvaAmount = Math.max(0, totalAmountTTC - subTotal);

  return {
    id: facture?.id ?? facture?._id,
    invoiceNumber: facture?.invoiceNumber || "-",
    date: formatDateTime(facture?.date),
    dateIso: facture?.date || null,
    paymentStatus: paymentStatus.value,
    paymentStatusLabel: paymentStatus.label,
    totalAmountTTC,
    subTotal,
    tvaAmount,
    clientName: facture?.client?.name || "-",
    clientPhone: facture?.client?.phone || "-",
    clientAddress: facture?.client?.address || "-",
    commandeId: facture?.commande?._id ?? facture?.commande?.id ?? facture?.commande,
    commandeNumber: facture?.commande?.commandeNumber || "-",
    transporterName: facture?.transporter?.name || "-",
    transporterPlate: facture?.transporter?.plateNumber || "-",
    file: facture?.file || "",
    createdByName:
      `${facture?.createdBy?.firstName || ""} ${facture?.createdBy?.lastName || ""}`.trim() ||
      facture?.createdBy?.email ||
      "-",
    items,
  };
};

const buildFactureUpdatePayload = (payload) => {
  const nextPayload = {};

  if (payload?.date !== undefined) nextPayload.date = payload.date || undefined;
  if (payload?.file !== undefined) nextPayload.file = String(payload.file || "").trim();
  if (payload?.paymentStatus !== undefined) {
    nextPayload.paymentStatus = String(payload.paymentStatus || "UNPAID").toUpperCase();
  }

  if (payload?.totalAmountTTC !== undefined) {
    const total = Number(payload.totalAmountTTC);
    if (Number.isFinite(total) && total >= 0) nextPayload.totalAmountTTC = total;
  }

  if (payload?.invoiceNumber !== undefined) {
    const invoiceNumber = String(payload.invoiceNumber || "").trim();
    if (invoiceNumber) nextPayload.invoiceNumber = invoiceNumber;
  }

  if (payload?.clientId !== undefined) {
    const clientId = String(payload.clientId || "").trim();
    if (clientId) nextPayload.client = clientId;
  }

  if (payload?.commandeId !== undefined) {
    const commandeId = String(payload.commandeId || "").trim();
    if (commandeId) nextPayload.commande = commandeId;
  }

  if (payload?.transporterId !== undefined) {
    const transporterId = String(payload.transporterId || "").trim();
    if (transporterId) nextPayload.transporter = transporterId;
  }

  if (Array.isArray(payload?.items)) {
    nextPayload.items = payload.items
      .map((item) => {
        const product = String(item?.productId || item?.product || "").trim();
        const quantity = Number(item?.quantity);
        const unitPrice = Number(item?.unitPrice);

        if (!product || !Number.isFinite(quantity) || quantity <= 0 || !Number.isFinite(unitPrice) || unitPrice < 0) {
          return null;
        }

        return {
          product,
          quantity,
          unitPrice,
          lineTotal: quantity * unitPrice,
        };
      })
      .filter(Boolean);
  }

  return nextPayload;
};

export const setFactures = (items) => ({ type: SET_FACTURES, payload: items });
export const setFactureCurrent = (facture) => ({ type: SET_FACTURE_CURRENT, payload: facture });
export const setFactureLoading = (loading) => ({ type: SET_FACTURE_LOADING, payload: loading });
export const setFactureError = (error) => ({ type: SET_FACTURE_ERROR, payload: error });
export const clearFactureError = () => ({ type: CLEAR_FACTURE_ERROR });
export const setFacturesLoading = (loading) => ({ type: SET_FACTURES_LOADING, payload: loading });
export const setFacturesError = (error) => ({ type: SET_FACTURES_ERROR, payload: error });
export const clearFacturesError = () => ({ type: CLEAR_FACTURES_ERROR });
export const setFacturesUpdating = (updating) => ({ type: SET_FACTURES_UPDATING, payload: updating });
export const setFacturesUpdateError = (error) => ({ type: SET_FACTURES_UPDATE_ERROR, payload: error });
export const clearFacturesUpdateError = () => ({ type: CLEAR_FACTURES_UPDATE_ERROR });
export const setFacturesDeleting = (deleting) => ({ type: SET_FACTURES_DELETING, payload: deleting });
export const setFacturesDeleteError = (error) => ({ type: SET_FACTURES_DELETE_ERROR, payload: error });
export const clearFacturesDeleteError = () => ({ type: CLEAR_FACTURES_DELETE_ERROR });

export const fetchFactures = (params = {}) => {
  return async (dispatch) => {
    dispatch(setFacturesLoading(true));
    dispatch(clearFacturesError());

    try {
      const data = await getFactures(params);
      const items = getFactureList(data).map(formatFacture);
      dispatch(setFactures(items));
      dispatch(setFacturesLoading(false));
      return { success: true, items };
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Erreur lors du chargement des factures.";
      dispatch(setFacturesError(errorMessage));
      dispatch(setFacturesLoading(false));
      return { success: false, error: errorMessage };
    }
  };
};

export const fetchFactureById = (id) => {
  return async (dispatch) => {
    dispatch(setFactureLoading(true));
    dispatch(clearFactureError());

    try {
      const data = await getFactureById(id);
      const current = formatFacture(data);
      dispatch(setFactureCurrent(current));
      dispatch(setFactureError(null));
      dispatch(setFactureLoading(false));
      return { success: true, data: current };
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Erreur lors du chargement de la facture.";
      dispatch(setFactureError(errorMessage));
      dispatch(setFactureCurrent(null));
      dispatch(setFactureLoading(false));
      return { success: false, error: errorMessage };
    }
  };
};

export const updateFactureThunk = (id, payload) => {
  return async (dispatch) => {
    dispatch(setFacturesUpdating(true));
    dispatch(clearFacturesUpdateError());

    try {
      const data = await updateFacture(id, buildFactureUpdatePayload(payload));
      const formatted = formatFacture(data);
      dispatch(setFactureCurrent(formatted));
      dispatch(setFacturesUpdating(false));
      await dispatch(fetchFactures());
      return { success: true, data: formatted };
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Erreur lors de la mise a jour de la facture.";
      dispatch(setFacturesUpdateError(errorMessage));
      dispatch(setFacturesUpdating(false));
      return { success: false, error: errorMessage };
    }
  };
};

export const deleteFactureThunk = (id) => {
  return async (dispatch) => {
    dispatch(setFacturesDeleting(true));
    dispatch(clearFacturesDeleteError());

    try {
      const data = await deleteFacture(id);
      dispatch(setFacturesDeleting(false));
      await dispatch(fetchFactures());
      return { success: true, data };
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Erreur lors de la suppression de la facture.";
      dispatch(setFacturesDeleteError(errorMessage));
      dispatch(setFacturesDeleting(false));
      return { success: false, error: errorMessage };
    }
  };
};

function FactureReducer(state = initialState, action) {
  switch (action.type) {
    case SET_FACTURES:
      return { ...state, items: action.payload };
    case SET_FACTURE_CURRENT:
      return { ...state, current: action.payload };
    case SET_FACTURE_LOADING:
      return { ...state, loading: action.payload, currentLoading: action.payload };
    case SET_FACTURE_ERROR:
      return { ...state, error: action.payload, currentError: action.payload };
    case CLEAR_FACTURE_ERROR:
      return { ...state, error: null, currentError: null };
    case SET_FACTURES_LOADING:
      return { ...state, listLoading: action.payload };
    case SET_FACTURES_ERROR:
      return { ...state, listError: action.payload };
    case CLEAR_FACTURES_ERROR:
      return { ...state, listError: null };
    case SET_FACTURES_UPDATING:
      return { ...state, updating: action.payload };
    case SET_FACTURES_UPDATE_ERROR:
      return { ...state, updateError: action.payload };
    case CLEAR_FACTURES_UPDATE_ERROR:
      return { ...state, updateError: null };
    case SET_FACTURES_DELETING:
      return { ...state, deleting: action.payload };
    case SET_FACTURES_DELETE_ERROR:
      return { ...state, deleteError: action.payload };
    case CLEAR_FACTURES_DELETE_ERROR:
      return { ...state, deleteError: null };
    default:
      return state;
  }
}

export default FactureReducer;
