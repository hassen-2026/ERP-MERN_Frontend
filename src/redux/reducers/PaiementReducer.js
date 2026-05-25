import {
  createPaiement,
  deletePaiement,
  getPaiementById,
  getPaiements,
} from "../../services/paiementApi";
import { fetchFactures } from "./FactureReducer";

export const SET_PAIEMENTS = "SET_PAIEMENTS";
export const SET_PAIEMENTS_LOADING = "SET_PAIEMENTS_LOADING";
export const SET_PAIEMENTS_ERROR = "SET_PAIEMENTS_ERROR";
export const CLEAR_PAIEMENTS_ERROR = "CLEAR_PAIEMENTS_ERROR";
export const SET_PAIEMENTS_CREATING = "SET_PAIEMENTS_CREATING";
export const SET_PAIEMENTS_CREATE_ERROR = "SET_PAIEMENTS_CREATE_ERROR";
export const CLEAR_PAIEMENTS_CREATE_ERROR = "CLEAR_PAIEMENTS_CREATE_ERROR";
export const SET_PAIEMENTS_DELETING = "SET_PAIEMENTS_DELETING";
export const SET_PAIEMENTS_DELETE_ERROR = "SET_PAIEMENTS_DELETE_ERROR";
export const CLEAR_PAIEMENTS_DELETE_ERROR = "CLEAR_PAIEMENTS_DELETE_ERROR";
export const SET_PAIEMENT_CURRENT = "SET_PAIEMENT_CURRENT";
export const SET_PAIEMENT_LOADING = "SET_PAIEMENT_LOADING";
export const SET_PAIEMENT_ERROR = "SET_PAIEMENT_ERROR";
export const CLEAR_PAIEMENT_ERROR = "CLEAR_PAIEMENT_ERROR";

export const initialState = {
  items: [],
  loading: false,
  error: null,
  creating: false,
  createError: null,
  deleting: false,
  deleteError: null,
  current: null,
  currentLoading: false,
  currentError: null,
};

const getPaiementList = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.paiements)) return data.paiements;
  if (Array.isArray(data?.payments)) return data.payments;
  if (Array.isArray(data?.results)) return data.results;
  return [];
};

const formatDateTime = (value) => {
  if (!value) return "-";
  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) return String(value);
  return parsedDate.toLocaleString("fr-FR");
};

const formatCurrency = (value) => {
  const numeric = Number(value) || 0;
  return numeric.toLocaleString("fr-TN", { style: "currency", currency: "TND" });
};

const normalizeType = (type) => {
  const normalized = String(type || "INCOMING").toUpperCase();
  const labelMap = {
    INCOMING: "Entrant",
  };
  return { value: normalized, label: labelMap[normalized] || normalized };
};

const normalizePaymentMethod = (method) => {
  const normalized = String(method || "OTHER").toUpperCase();
  const labelMap = {
    CASH: "Cash",
    CARD: "Carte",
    BANK_TRANSFER: "Virement",
    MOBILE_MONEY: "Mobile money",
    OTHER: "Autre",
  };
  return { value: normalized, label: labelMap[normalized] || normalized };
};

const formatPaiement = (paiement, index) => {
  const type = normalizeType(paiement?.type);
  const paymentMethod = normalizePaymentMethod(paiement?.paymentMethod);
  const amount = Number(paiement?.amount) || 0;
  const factureTotalAmountTTC = Number(paiement?.facture?.totalAmountTTC) || 0;
  const fallbackUnpaidAmount = Math.max(factureTotalAmountTTC - amount, 0);

  return {
    id: paiement?.id ?? paiement?._id ?? `${index + 1}`,
    date: formatDateTime(paiement?.date),
    dateIso: paiement?.date || null,
    amount,
    amountDisplay: formatCurrency(amount),
    type: type.value,
    typeLabel: type.label,
    paymentMethod: paymentMethod.value,
    paymentMethodLabel: paymentMethod.label,
    factureId: paiement?.facture?._id ?? paiement?.facture?.id ?? paiement?.facture,
    factureNumber: paiement?.facture?.invoiceNumber || "-",
    factureTotalAmountTTC,
    factureTotalAmountTTCDisplay: formatCurrency(factureTotalAmountTTC),
    facturePaymentStatus: paiement?.facture?.paymentStatus || "-",
    facturePaidAmount: amount,
    facturePaidAmountDisplay: formatCurrency(amount),
    factureUnpaidAmount: fallbackUnpaidAmount,
    factureUnpaidAmountDisplay: formatCurrency(fallbackUnpaidAmount),
    note: paiement?.note || "",
    createdByName:
      `${paiement?.createdBy?.firstName || ""} ${paiement?.createdBy?.lastName || ""}`.trim() ||
      paiement?.createdBy?.email ||
      "-",
    createdAt: formatDateTime(paiement?.createdAt),
    updatedAt: formatDateTime(paiement?.updatedAt),
  };
};

const enrichFactureBalanceFields = (items) => {
  const factureStats = {};

  items.forEach((item) => {
    const factureId = String(item?.factureId || "").trim();
    if (!factureId) return;

    if (!factureStats[factureId]) {
      factureStats[factureId] = {
        total: Number(item?.factureTotalAmountTTC) || 0,
        paid: 0,
      };
    }

    factureStats[factureId].paid += Number(item?.amount) || 0;
  });

  return items.map((item) => {
    const factureId = String(item?.factureId || "").trim();
    if (!factureId || !factureStats[factureId]) return item;

    const total = Number(factureStats[factureId].total) || 0;
    const paid = Number(factureStats[factureId].paid) || 0;
    const unpaid = Math.max(total - paid, 0);

    return {
      ...item,
      facturePaidAmount: paid,
      facturePaidAmountDisplay: formatCurrency(paid),
      factureUnpaidAmount: unpaid,
      factureUnpaidAmountDisplay: formatCurrency(unpaid),
      factureTotalAmountTTC: total,
      factureTotalAmountTTCDisplay: formatCurrency(total),
    };
  });
};

const buildPaiementPayload = (payload) => {
  const amount = Number(payload?.amount);

  return {
    date: payload?.date || undefined,
    amount: Number.isFinite(amount) && amount >= 0 ? amount : undefined,
    type: "INCOMING",
    paymentMethod: String(payload?.paymentMethod || "OTHER").toUpperCase(),
    factureId: String(payload?.factureId || payload?.facture || "").trim() || undefined,
    note: String(payload?.note || "").trim(),
  };
};

export const setPaiements = (items) => ({ type: SET_PAIEMENTS, payload: items });
export const setPaiementsLoading = (loading) => ({ type: SET_PAIEMENTS_LOADING, payload: loading });
export const setPaiementsError = (error) => ({ type: SET_PAIEMENTS_ERROR, payload: error });
export const clearPaiementsError = () => ({ type: CLEAR_PAIEMENTS_ERROR });
export const setPaiementsCreating = (creating) => ({ type: SET_PAIEMENTS_CREATING, payload: creating });
export const setPaiementsCreateError = (error) => ({ type: SET_PAIEMENTS_CREATE_ERROR, payload: error });
export const clearPaiementsCreateError = () => ({ type: CLEAR_PAIEMENTS_CREATE_ERROR });
export const setPaiementsDeleting = (deleting) => ({ type: SET_PAIEMENTS_DELETING, payload: deleting });
export const setPaiementsDeleteError = (error) => ({ type: SET_PAIEMENTS_DELETE_ERROR, payload: error });
export const clearPaiementsDeleteError = () => ({ type: CLEAR_PAIEMENTS_DELETE_ERROR });
export const setPaiementCurrent = (paiement) => ({ type: SET_PAIEMENT_CURRENT, payload: paiement });
export const setPaiementLoading = (loading) => ({ type: SET_PAIEMENT_LOADING, payload: loading });
export const setPaiementError = (error) => ({ type: SET_PAIEMENT_ERROR, payload: error });
export const clearPaiementError = () => ({ type: CLEAR_PAIEMENT_ERROR });

export const fetchPaiements = (params = {}) => {
  return async (dispatch) => {
    dispatch(setPaiementsLoading(true));
    dispatch(clearPaiementsError());

    try {
      const data = await getPaiements(params);
      const items = enrichFactureBalanceFields(getPaiementList(data).map(formatPaiement));
      dispatch(setPaiements(items));
      dispatch(setPaiementsLoading(false));
      return { success: true, items };
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Erreur lors du chargement des paiements.";
      dispatch(setPaiementsError(errorMessage));
      dispatch(setPaiementsLoading(false));
      return { success: false, error: errorMessage };
    }
  };
};

export const fetchPaiementById = (id) => {
  return async (dispatch, getState) => {
    dispatch(setPaiementLoading(true));
    dispatch(clearPaiementError());

    try {
      const data = await getPaiementById(id);
      const rawCurrent = formatPaiement(data);
      const allItems = getState?.()?.paiements?.items || [];
      const current = enrichFactureBalanceFields([...allItems, rawCurrent]).find(
        (item) => String(item?.id || "") === String(rawCurrent?.id || ""),
      ) || rawCurrent;
      dispatch(setPaiementCurrent(current));
      dispatch(setPaiementLoading(false));
      return { success: true, data: current };
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Erreur lors du chargement du paiement.";
      dispatch(setPaiementError(errorMessage));
      dispatch(setPaiementCurrent(null));
      dispatch(setPaiementLoading(false));
      return { success: false, error: errorMessage };
    }
  };
};

export const createPaiementThunk = (payload) => {
  return async (dispatch) => {
    dispatch(setPaiementsCreating(true));
    dispatch(clearPaiementsCreateError());

    try {
      const data = await createPaiement(buildPaiementPayload(payload));
      await dispatch(fetchPaiements());
      await dispatch(fetchFactures());
      dispatch(setPaiementsCreating(false));
      return { success: true, data };
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Erreur lors de la creation du paiement.";
      dispatch(setPaiementsCreateError(errorMessage));
      dispatch(setPaiementsCreating(false));
      return { success: false, error: errorMessage };
    }
  };
};

export const deletePaiementThunk = (id) => {
  return async (dispatch) => {
    dispatch(setPaiementsDeleting(true));
    dispatch(clearPaiementsDeleteError());

    try {
      const data = await deletePaiement(id);
      await dispatch(fetchPaiements());
      await dispatch(fetchFactures());
      dispatch(setPaiementsDeleting(false));
      return { success: true, data };
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Erreur lors de la suppression du paiement.";
      dispatch(setPaiementsDeleteError(errorMessage));
      dispatch(setPaiementsDeleting(false));
      return { success: false, error: errorMessage };
    }
  };
};

function PaiementReducer(state = initialState, action) {
  switch (action.type) {
    case SET_PAIEMENTS:
      return { ...state, items: action.payload };
    case SET_PAIEMENTS_LOADING:
      return { ...state, loading: action.payload };
    case SET_PAIEMENTS_ERROR:
      return { ...state, error: action.payload };
    case CLEAR_PAIEMENTS_ERROR:
      return { ...state, error: null };
    case SET_PAIEMENTS_CREATING:
      return { ...state, creating: action.payload };
    case SET_PAIEMENTS_CREATE_ERROR:
      return { ...state, createError: action.payload };
    case CLEAR_PAIEMENTS_CREATE_ERROR:
      return { ...state, createError: null };
    case SET_PAIEMENTS_DELETING:
      return { ...state, deleting: action.payload };
    case SET_PAIEMENTS_DELETE_ERROR:
      return { ...state, deleteError: action.payload };
    case CLEAR_PAIEMENTS_DELETE_ERROR:
      return { ...state, deleteError: null };
    case SET_PAIEMENT_CURRENT:
      return { ...state, current: action.payload };
    case SET_PAIEMENT_LOADING:
      return { ...state, currentLoading: action.payload };
    case SET_PAIEMENT_ERROR:
      return { ...state, currentError: action.payload };
    case CLEAR_PAIEMENT_ERROR:
      return { ...state, currentError: null };
    default:
      return state;
  }
}

export default PaiementReducer;