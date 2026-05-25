import { createDevis, deleteDevis, getDevis, updateDevis } from "../../services/devisApi";

export const SET_DEVIS = "SET_DEVIS";
export const SET_DEVIS_LOADING = "SET_DEVIS_LOADING";
export const SET_DEVIS_ERROR = "SET_DEVIS_ERROR";
export const CLEAR_DEVIS_ERROR = "CLEAR_DEVIS_ERROR";
export const SET_DEVIS_CREATING = "SET_DEVIS_CREATING";
export const SET_DEVIS_CREATE_ERROR = "SET_DEVIS_CREATE_ERROR";
export const CLEAR_DEVIS_CREATE_ERROR = "CLEAR_DEVIS_CREATE_ERROR";
export const SET_DEVIS_UPDATING = "SET_DEVIS_UPDATING";
export const SET_DEVIS_UPDATE_ERROR = "SET_DEVIS_UPDATE_ERROR";
export const CLEAR_DEVIS_UPDATE_ERROR = "CLEAR_DEVIS_UPDATE_ERROR";
export const SET_DEVIS_DELETING = "SET_DEVIS_DELETING";
export const SET_DEVIS_DELETE_ERROR = "SET_DEVIS_DELETE_ERROR";
export const CLEAR_DEVIS_DELETE_ERROR = "CLEAR_DEVIS_DELETE_ERROR";

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

const getDevisList = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.devis)) return data.devis;
  if (Array.isArray(data?.results)) return data.results;
  return [];
};

const formatDateTime = (value) => {
  if (!value) return "-";
  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) return String(value);
  return parsedDate.toLocaleString("fr-FR");
};

const normalizeStatus = (status) => {
  const normalized = String(status || "DRAFT").toUpperCase();
  const labelMap = {
    DRAFT: "Brouillon",
    SENT: "Envoye",
    ACCEPTED: "Accepte",
    REJECTED: "Refuse",
  };
  return { value: normalized, label: labelMap[normalized] || normalized };
};

const formatClientName = (client) => client?.nom || client?.name || `${client?.firstName || ""} ${client?.lastName || ""}`.trim() || "-";

const computeTotalsFromItems = (items) => {
  let totalHT = 0;
  let tvaAmount = 0;

  (items || []).forEach((item) => {
    const quantity = Number(item?.quantity) || 0;
    const unitPrice = Number(item?.unitPrice) || 0;
    const tvaRate = Number(item?.product?.tvaRate ?? item?.product?.taxRate ?? item?.product?.rate ?? 0.19) || 0;
    const lineHT = quantity * unitPrice;
    totalHT += lineHT;
    tvaAmount += lineHT * tvaRate;
  });

  const roundedHT = Number(totalHT.toFixed(2));
  const roundedTVA = Number(tvaAmount.toFixed(2));
  return { totalHT: roundedHT, tvaAmount: roundedTVA, totalAmountTTC: Number((roundedHT + roundedTVA).toFixed(2)) };
};

const formatItem = (item, index) => {
  const quantity = Number(item?.quantity) || 0;
  const unitPrice = Number(item?.unitPrice) || 0;
  const productId = item?.productId ?? item?.product?._id ?? item?.product?.id ?? item?.product;

  return {
    id: item?.id ?? item?._id ?? `${index + 1}`,
    productId,
    productName: item?.product?.name || item?.product?.reference || "Produit",
    quantity,
    unitPrice,
    lineTotal: quantity * unitPrice,
  };
};

const generateCommandeNumber = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  return `CMD-${year}${month}${day}-${hours}${minutes}${seconds}`;
};

const formatDevis = (devis, index) => {
  const status = normalizeStatus(devis?.status);
  const items = Array.isArray(devis?.items) ? devis.items.map(formatItem) : [];
  const totals = computeTotalsFromItems(items);
  const totalAmount = Number(devis?.totalAmountTTC ?? devis?.totalAmount ?? totals.totalAmountTTC) || 0;
  const commandeId = devis?.commande?._id ?? devis?.commande?.id ?? devis?.commande ?? null;
  const currencyCode = String(devis?.currencyCode || "TND").toUpperCase();
  const exchangeRateToTnd = Number(devis?.exchangeRateToTnd || 0);
  const originalCurrencyTotals = devis?.originalCurrencyTotals || null;

  return {
    id: devis?.id ?? devis?._id ?? `${index + 1}`,
    quoteNumber: devis?.quoteNumber || devis?.reference || "-",
    date: formatDateTime(devis?.date),
    dateIso: devis?.date || null,
    status: status.value,
    statusLabel: status.label,
    clientId: devis?.client?._id ?? devis?.client?.id ?? devis?.client,
    clientName: formatClientName(devis?.client),
    createdByName: `${devis?.createdBy?.firstName || ""} ${devis?.createdBy?.lastName || ""}`.trim() || devis?.createdBy?.email || "-",
    file: devis?.file || "",
    currencyCode,
    exchangeRateToTnd,
    originalCurrencyTotals,
    totalAmount,
    totalAmountDisplay: totalAmount.toLocaleString("fr-TN", { style: "currency", currency: "TND" }),
    totalHT: Number(devis?.totalHT ?? totals.totalHT) || 0,
    tvaAmount: Number(devis?.tvaAmount ?? totals.tvaAmount) || 0,
    totalAmountTTC: totalAmount,
    items,
    itemsCount: items.length,
    commandeId,
    canConvertToCommande: status.value === "ACCEPTED" && !commandeId,
    createdAt: formatDateTime(devis?.createdAt),
    updatedAt: formatDateTime(devis?.updatedAt),
  };
};

const buildDevisPayload = (payload) => {
  const quoteNumber = String(payload?.quoteNumber || payload?.documentNumber || "").trim();
  const commandeNumber = String(payload?.commandeNumber || "").trim();

  const items = Array.isArray(payload?.items)
    ? payload.items
        .map((item) => {
          const quantity = Number(item?.quantity);
          const unitPrice = Number(item?.unitPrice);
          const product = String(item?.productId || item?.product || "").trim();

          if (!product || !Number.isFinite(quantity) || quantity <= 0 || !Number.isFinite(unitPrice) || unitPrice < 0) {
            return null;
          }

          return { productId: product, product, quantity, unitPrice };
        })
        .filter(Boolean)
    : [];

  const requestPayload = {
    date: payload?.date || undefined,
    status: String(payload?.status || "DRAFT").toUpperCase(),
    file: String(payload?.file || "").trim(),
    clientId: String(payload?.clientId || payload?.client || "").trim(),
    currencyCode: String(payload?.currencyCode || "TND").trim().toUpperCase(),
    exchangeRateToTnd: Number(payload?.exchangeRateToTnd || 0) || undefined,
    originalCurrencyTotals: payload?.originalCurrencyTotals || undefined,
    items,
  };

  if (quoteNumber) {
    requestPayload.quoteNumber = quoteNumber;
  }

  if (commandeNumber) {
    requestPayload.commandeNumber = commandeNumber;
  } else if (requestPayload.status === "ACCEPTED") {
    // Fallback for backend conversion flows that require commandeNumber.
    requestPayload.commandeNumber = generateCommandeNumber();
  }

  return requestPayload;
};

export const setDevis = (items) => ({ type: SET_DEVIS, payload: items });
export const setDevisLoading = (loading) => ({ type: SET_DEVIS_LOADING, payload: loading });
export const setDevisError = (error) => ({ type: SET_DEVIS_ERROR, payload: error });
export const clearDevisError = () => ({ type: CLEAR_DEVIS_ERROR });
export const setDevisCreating = (creating) => ({ type: SET_DEVIS_CREATING, payload: creating });
export const setDevisCreateError = (error) => ({ type: SET_DEVIS_CREATE_ERROR, payload: error });
export const clearDevisCreateError = () => ({ type: CLEAR_DEVIS_CREATE_ERROR });
export const setDevisUpdating = (updating) => ({ type: SET_DEVIS_UPDATING, payload: updating });
export const setDevisUpdateError = (error) => ({ type: SET_DEVIS_UPDATE_ERROR, payload: error });
export const clearDevisUpdateError = () => ({ type: CLEAR_DEVIS_UPDATE_ERROR });
export const setDevisDeleting = (deleting) => ({ type: SET_DEVIS_DELETING, payload: deleting });
export const setDevisDeleteError = (error) => ({ type: SET_DEVIS_DELETE_ERROR, payload: error });
export const clearDevisDeleteError = () => ({ type: CLEAR_DEVIS_DELETE_ERROR });

export const fetchDevis = (params = {}) => {
  return async (dispatch) => {
    dispatch(setDevisLoading(true));
    dispatch(clearDevisError());

    try {
      const data = await getDevis(params);
      const items = getDevisList(data).map(formatDevis);
      dispatch(setDevis(items));
      dispatch(setDevisLoading(false));
      return { success: true, items };
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Erreur lors du chargement des devis.";
      dispatch(setDevisError(errorMessage));
      dispatch(setDevisLoading(false));
      return { success: false, error: errorMessage };
    }
  };
};

export const createDevisThunk = (payload) => {
  return async (dispatch) => {
    dispatch(setDevisCreating(true));
    dispatch(clearDevisCreateError());

    try {
      const data = await createDevis(buildDevisPayload(payload));
      await dispatch(fetchDevis());
      dispatch(setDevisCreating(false));
      return { success: true, data };
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Erreur lors de la creation du devis.";
      dispatch(setDevisCreateError(errorMessage));
      dispatch(setDevisCreating(false));
      return { success: false, error: errorMessage };
    }
  };
};

export const updateDevisThunk = (id, payload) => {
  return async (dispatch) => {
    dispatch(setDevisUpdating(true));
    dispatch(clearDevisUpdateError());

    try {
      const data = await updateDevis(id, buildDevisPayload(payload));
      await dispatch(fetchDevis());
      dispatch(setDevisUpdating(false));
      return { success: true, data };
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Erreur lors de la mise a jour du devis.";
      dispatch(setDevisUpdateError(errorMessage));
      dispatch(setDevisUpdating(false));
      return { success: false, error: errorMessage };
    }
  };
};

export const deleteDevisThunk = (id) => {
  return async (dispatch) => {
    dispatch(setDevisDeleting(true));
    dispatch(clearDevisDeleteError());

    try {
      const data = await deleteDevis(id);
      await dispatch(fetchDevis());
      dispatch(setDevisDeleting(false));
      return { success: true, data };
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Erreur lors de la suppression du devis.";
      dispatch(setDevisDeleteError(errorMessage));
      dispatch(setDevisDeleting(false));
      return { success: false, error: errorMessage };
    }
  };
};

function DevisReducer(state = initialState, action) {
  switch (action.type) {
    case SET_DEVIS:
      return { ...state, items: action.payload };
    case SET_DEVIS_LOADING:
      return { ...state, loading: action.payload };
    case SET_DEVIS_ERROR:
      return { ...state, error: action.payload };
    case CLEAR_DEVIS_ERROR:
      return { ...state, error: null };
    case SET_DEVIS_CREATING:
      return { ...state, creating: action.payload };
    case SET_DEVIS_CREATE_ERROR:
      return { ...state, createError: action.payload };
    case CLEAR_DEVIS_CREATE_ERROR:
      return { ...state, createError: null };
    case SET_DEVIS_UPDATING:
      return { ...state, updating: action.payload };
    case SET_DEVIS_UPDATE_ERROR:
      return { ...state, updateError: action.payload };
    case CLEAR_DEVIS_UPDATE_ERROR:
      return { ...state, updateError: null };
    case SET_DEVIS_DELETING:
      return { ...state, deleting: action.payload };
    case SET_DEVIS_DELETE_ERROR:
      return { ...state, deleteError: action.payload };
    case CLEAR_DEVIS_DELETE_ERROR:
      return { ...state, deleteError: null };
    default:
      return state;
  }
}

export default DevisReducer;