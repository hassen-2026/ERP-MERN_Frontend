import {
  createBonCommande,
  getBonCommandes,
  updateBonCommandeLineQuantity,
} from "../../services/bonCommandeApi";

export const SET_BON_COMMANDES = "SET_BON_COMMANDES";
export const SET_BON_COMMANDES_LOADING = "SET_BON_COMMANDES_LOADING";
export const SET_BON_COMMANDES_ERROR = "SET_BON_COMMANDES_ERROR";
export const CLEAR_BON_COMMANDES_ERROR = "CLEAR_BON_COMMANDES_ERROR";
export const SET_BON_COMMANDES_CREATING = "SET_BON_COMMANDES_CREATING";
export const SET_BON_COMMANDES_CREATE_ERROR = "SET_BON_COMMANDES_CREATE_ERROR";
export const CLEAR_BON_COMMANDES_CREATE_ERROR = "CLEAR_BON_COMMANDES_CREATE_ERROR";
export const SET_BON_COMMANDES_UPDATING = "SET_BON_COMMANDES_UPDATING";
export const SET_BON_COMMANDES_UPDATE_ERROR = "SET_BON_COMMANDES_UPDATE_ERROR";
export const CLEAR_BON_COMMANDES_UPDATE_ERROR = "CLEAR_BON_COMMANDES_UPDATE_ERROR";

export const initialState = {
  items: [],
  loading: false,
  error: null,
  creating: false,
  createError: null,
  updating: false,
  updateError: null,
};

const getBonCommandeList = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.bonCommandes)) return data.bonCommandes;
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
  const normalized = String(status || "PENDING").toUpperCase();
  const labels = {
    PENDING: "En attente",
    PARTIALLY_DELIVERED: "Partiellement livré",
    DELIVERED: "Livré",
    CANCELLED: "Annulé",
  };
  return { value: normalized, label: labels[normalized] || normalized };
};

const computeTotalsFromLines = (lines) => {
  let totalHT = 0;
  let tvaAmount = 0;

  (lines || []).forEach((line) => {
    const quantity = Number(line?.requestedQuantity || 0);
    const unitPrice = Number(line?.commandeItem?.unitPrice || 0);
    const tvaRate = Number(line?.commandeItem?.product?.tvaRate ?? line?.commandeItem?.product?.taxRate ?? line?.commandeItem?.product?.rate ?? 0.19) || 0;
    const lineHT = quantity * unitPrice;
    totalHT += lineHT;
    tvaAmount += lineHT * tvaRate;
  });

  totalHT = Number(totalHT.toFixed(2));
  tvaAmount = Number(tvaAmount.toFixed(2));

  return {
    totalHT,
    tvaAmount,
    totalAmountTTC: Number((totalHT + tvaAmount).toFixed(2)),
  };
};

const formatLine = (line, index) => {
  const requestedQuantity = Number(line?.requestedQuantity || 0);
  const deliveredQuantity = Number(line?.deliveredQuantity || 0);
  const remainingQuantity = Number(line?.remainingQuantity || 0);
  const unitPrice = Number(line?.commandeItem?.unitPrice || 0);

  return {
    id: line?.id ?? line?._id ?? `${index + 1}`,
    commandeItemId: line?.commandeItem?._id ?? line?.commandeItem?.id ?? null,
    productId: line?.commandeItem?.product?._id ?? line?.commandeItem?.product?.id ?? null,
    productName: line?.commandeItem?.product?.name || line?.commandeItem?.product?.reference || "Produit",
    productReference: line?.commandeItem?.product?.reference || "-",
    commandeNumber: line?.commandeItem?.commande?.commandeNumber || "-",
    requestedQuantity,
    deliveredQuantity,
    remainingQuantity,
    unitPrice,
    lineTotal: requestedQuantity * unitPrice,
    status: String(line?.status || "PENDING").toUpperCase(),
    statusLabel: normalizeStatus(line?.status).label,
  };
};

const formatBonCommande = (item, index) => {
  const status = normalizeStatus(item?.status);
  const lines = Array.isArray(item?.lines) ? item.lines.map(formatLine) : [];
  const totals = computeTotalsFromLines(lines);
  const totalHT = Number(item?.totalHT ?? totals.totalHT) || 0;
  const tvaAmount = Number(item?.tvaAmount ?? totals.tvaAmount) || 0;
  const totalAmountTTC = Number(item?.totalAmountTTC ?? item?.totalAmount ?? totals.totalAmountTTC) || 0;

  return {
    id: item?.id ?? item?._id ?? `${index + 1}`,
    bonNumber: item?.bonNumber || `BC-${index + 1}`,
    date: formatDateTime(item?.date),
    dateIso: item?.date || null,
    status: status.value,
    statusLabel: status.label,
    commandeId: item?.commande?._id ?? item?.commande?.id ?? item?.commande,
    commandeNumber: item?.commande?.commandeNumber || "-",
    note: item?.note || "",
    lines,
    lineCount: lines.length,
    remainingLinesCount: lines.filter((line) => line.remainingQuantity > 0).length,
    totalRequested: lines.reduce((sum, line) => sum + line.requestedQuantity, 0),
    totalDelivered: lines.reduce((sum, line) => sum + line.deliveredQuantity, 0),
    totalHT,
    tvaAmount,
    totalAmountTTC,
    totalAmountDisplay: totalAmountTTC.toLocaleString("fr-TN", { style: "currency", currency: "TND" }),
    createdByName:
      `${item?.createdBy?.firstName || ""} ${item?.createdBy?.lastName || ""}`.trim() ||
      item?.createdBy?.email ||
      "-",
    createdAt: formatDateTime(item?.createdAt),
    updatedAt: formatDateTime(item?.updatedAt),
  };
};

const buildBonCommandePayload = (payload) => {
  const lines = Array.isArray(payload?.lines)
    ? payload.lines
        .map((line) => ({
          commandeItemId: String(line?.commandeItemId || line?.commandeItem || "").trim(),
          quantity: Number(line?.quantity),
        }))
        .filter((line) => line.commandeItemId && Number.isFinite(line.quantity) && line.quantity > 0)
    : [];

  return {
    commandeId: String(payload?.commandeId || "").trim(),
    date: payload?.date || undefined,
    note: String(payload?.note || "").trim(),
    lines,
  };
};

export const setBonCommandes = (items) => ({ type: SET_BON_COMMANDES, payload: items });
export const setBonCommandesLoading = (loading) => ({ type: SET_BON_COMMANDES_LOADING, payload: loading });
export const setBonCommandesError = (error) => ({ type: SET_BON_COMMANDES_ERROR, payload: error });
export const clearBonCommandesError = () => ({ type: CLEAR_BON_COMMANDES_ERROR });
export const setBonCommandesCreating = (creating) => ({ type: SET_BON_COMMANDES_CREATING, payload: creating });
export const setBonCommandesCreateError = (error) => ({ type: SET_BON_COMMANDES_CREATE_ERROR, payload: error });
export const clearBonCommandesCreateError = () => ({ type: CLEAR_BON_COMMANDES_CREATE_ERROR });
export const setBonCommandesUpdating = (updating) => ({ type: SET_BON_COMMANDES_UPDATING, payload: updating });
export const setBonCommandesUpdateError = (error) => ({ type: SET_BON_COMMANDES_UPDATE_ERROR, payload: error });
export const clearBonCommandesUpdateError = () => ({ type: CLEAR_BON_COMMANDES_UPDATE_ERROR });

export const fetchBonCommandes = (params = {}) => {
  return async (dispatch) => {
    dispatch(setBonCommandesLoading(true));
    dispatch(clearBonCommandesError());

    try {
      const data = await getBonCommandes(params);
      const items = getBonCommandeList(data).map(formatBonCommande);
      dispatch(setBonCommandes(items));
      dispatch(setBonCommandesLoading(false));
      return { success: true, items };
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Erreur lors du chargement des bons de commande.";
      dispatch(setBonCommandesError(errorMessage));
      dispatch(setBonCommandesLoading(false));
      return { success: false, error: errorMessage };
    }
  };
};

export const createBonCommandeThunk = (payload) => {
  return async (dispatch) => {
    dispatch(setBonCommandesCreating(true));
    dispatch(clearBonCommandesCreateError());

    try {
      const data = await createBonCommande(buildBonCommandePayload(payload));
      await dispatch(fetchBonCommandes());
      dispatch(setBonCommandesCreating(false));
      return { success: true, data };
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Erreur lors de la création du bon de commande.";
      dispatch(setBonCommandesCreateError(errorMessage));
      dispatch(setBonCommandesCreating(false));
      return { success: false, error: errorMessage };
    }
  };
};

export const updateBonCommandeLineQuantityThunk = (bonId, lineId, quantity) => {
  return async (dispatch) => {
    dispatch(setBonCommandesUpdating(true));
    dispatch(clearBonCommandesUpdateError());

    try {
      const data = await updateBonCommandeLineQuantity(bonId, lineId, { quantity: Number(quantity) });
      await dispatch(fetchBonCommandes());
      dispatch(setBonCommandesUpdating(false));
      return { success: true, data };
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Erreur lors de la mise à jour de la ligne du bon de commande.";
      dispatch(setBonCommandesUpdateError(errorMessage));
      dispatch(setBonCommandesUpdating(false));
      return { success: false, error: errorMessage };
    }
  };
};

function BonCommandeReducer(state = initialState, action) {
  switch (action.type) {
    case SET_BON_COMMANDES:
      return { ...state, items: action.payload };
    case SET_BON_COMMANDES_LOADING:
      return { ...state, loading: action.payload };
    case SET_BON_COMMANDES_ERROR:
      return { ...state, error: action.payload };
    case CLEAR_BON_COMMANDES_ERROR:
      return { ...state, error: null };
    case SET_BON_COMMANDES_CREATING:
      return { ...state, creating: action.payload };
    case SET_BON_COMMANDES_CREATE_ERROR:
      return { ...state, createError: action.payload };
    case CLEAR_BON_COMMANDES_CREATE_ERROR:
      return { ...state, createError: null };
    case SET_BON_COMMANDES_UPDATING:
      return { ...state, updating: action.payload };
    case SET_BON_COMMANDES_UPDATE_ERROR:
      return { ...state, updateError: action.payload };
    case CLEAR_BON_COMMANDES_UPDATE_ERROR:
      return { ...state, updateError: null };
    default:
      return state;
  }
}

export default BonCommandeReducer;
