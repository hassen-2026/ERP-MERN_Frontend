import { createCommande, deleteCommande, getCommandes, updateCommande } from "../../services/commandeApi";

export const SET_COMMANDES = "SET_COMMANDES";
export const SET_COMMANDES_LOADING = "SET_COMMANDES_LOADING";
export const SET_COMMANDES_ERROR = "SET_COMMANDES_ERROR";
export const CLEAR_COMMANDES_ERROR = "CLEAR_COMMANDES_ERROR";
export const SET_COMMANDES_CREATING = "SET_COMMANDES_CREATING";
export const SET_COMMANDES_CREATE_ERROR = "SET_COMMANDES_CREATE_ERROR";
export const CLEAR_COMMANDES_CREATE_ERROR = "CLEAR_COMMANDES_CREATE_ERROR";
export const SET_COMMANDES_UPDATING = "SET_COMMANDES_UPDATING";
export const SET_COMMANDES_UPDATE_ERROR = "SET_COMMANDES_UPDATE_ERROR";
export const CLEAR_COMMANDES_UPDATE_ERROR = "CLEAR_COMMANDES_UPDATE_ERROR";
export const SET_COMMANDES_DELETING = "SET_COMMANDES_DELETING";
export const SET_COMMANDES_DELETE_ERROR = "SET_COMMANDES_DELETE_ERROR";
export const CLEAR_COMMANDES_DELETE_ERROR = "CLEAR_COMMANDES_DELETE_ERROR";

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

const getCommandeList = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.commandes)) return data.commandes;
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
    CONFIRMED: "Confirmee",
    PARTIALLY_DELIVERED: "Partiellement livree",
    DELIVERED: "Livree",
    CANCELLED: "Annulee",
  };
  return { value: normalized, label: labelMap[normalized] || normalized };
};

const formatClientName = (client) => client?.nom || client?.name || `${client?.firstName || ""} ${client?.lastName || ""}`.trim() || "-";

const computeTotalsFromItems = (items) => {
  let totalHT = 0;
  let tvaAmount = 0;

  (items || []).forEach((item) => {
    const orderedQuantity = Number(item?.orderedQuantity ?? item?.quantity) || 0;
    const unitPrice = Number(item?.unitPrice) || 0;
    const tvaRate = Number(item?.product?.tvaRate ?? item?.product?.taxRate ?? item?.product?.rate ?? 0.19) || 0;
    const lineHT = orderedQuantity * unitPrice;
    totalHT += lineHT;
    tvaAmount += lineHT * tvaRate;
  });

  const roundedHT = Number(totalHT.toFixed(2));
  const roundedTVA = Number(tvaAmount.toFixed(2));
  return { totalHT: roundedHT, tvaAmount: roundedTVA, totalAmountTTC: Number((roundedHT + roundedTVA).toFixed(2)) };
};

const formatItem = (item, index) => {
  const orderedQuantity = Number(item?.orderedQuantity ?? item?.quantity) || 0;
  const deliveredQuantity = Number(item?.deliveredQuantity) || 0;
  const pendingQuantity = Number(item?.pendingQuantity ?? (orderedQuantity - deliveredQuantity)) || 0;
  const unitPrice = Number(item?.unitPrice) || 0;
  const productId = item?.productId ?? item?.product?._id ?? item?.product?.id ?? item?.product;

  return {
    id: item?.id ?? item?._id ?? `${index + 1}`,
    productId,
    productName: item?.product?.name || item?.product?.reference || "Produit",
    productReference: item?.product?.reference || "-",
    quantity: orderedQuantity,
    orderedQuantity,
    deliveredQuantity,
    pendingQuantity,
    unitPrice,
    lineTotal: orderedQuantity * unitPrice,
    status: String(item?.status || "PENDING").toUpperCase(),
    statusLabel:
      String(item?.status || "PENDING").toUpperCase() === "DELIVERED"
        ? "Livré"
        : String(item?.status || "PENDING").toUpperCase() === "PARTIALLY_DELIVERED"
          ? "Partiellement livré"
          : "En attente",
    deliveredAt: item?.deliveredAt ? formatDateTime(item.deliveredAt) : "-",
    deliveredByName: `${item?.deliveredBy?.firstName || ""} ${item?.deliveredBy?.lastName || ""}`.trim() || item?.deliveredBy?.email || "-",
  };
};

const formatCommande = (commande, index) => {
  const status = normalizeStatus(commande?.status);
  const items = Array.isArray(commande?.items) ? commande.items.map(formatItem) : [];
  const totals = computeTotalsFromItems(items);
  const totalAmount = Number(commande?.totalAmountTTC ?? commande?.totalAmount ?? totals.totalAmountTTC) || 0;
  const currencyCode = String(commande?.currencyCode || "TND").toUpperCase();
  const exchangeRateToTnd = Number(commande?.exchangeRateToTnd || 0);
  const originalCurrencyTotals = commande?.originalCurrencyTotals || null;

  return {
    id: commande?.id ?? commande?._id ?? `${index + 1}`,
    commandeNumber: commande?.commandeNumber || commande?.commandNumber || commande?.orderNumber || `CMD-${index + 1}`,
    date: formatDateTime(commande?.date),
    dateIso: commande?.date || null,
    status: status.value,
    statusLabel: status.label,
    clientId: commande?.client?._id ?? commande?.client?.id ?? commande?.client,
    clientName: formatClientName(commande?.client),
    managedByName: `${commande?.managedBy?.firstName || ""} ${commande?.managedBy?.lastName || ""}`.trim() || commande?.managedBy?.email || "-",
    currencyCode,
    exchangeRateToTnd,
    originalCurrencyTotals,
    totalAmount,
    totalAmountDisplay: totalAmount.toLocaleString("fr-TN", { style: "currency", currency: "TND" }),
    totalHT: Number(commande?.totalHT ?? totals.totalHT) || 0,
    tvaAmount: Number(commande?.tvaAmount ?? totals.tvaAmount) || 0,
    totalAmountTTC: totalAmount,
    items,
    itemsCount: items.length,
    stockApplied: Boolean(commande?.stockApplied),
    factureId: commande?.facture?._id ?? commande?.facture?.id ?? null,
    factureNumber: commande?.facture?.invoiceNumber || commande?.facture?.invoice || "-",
    factureStatus: commande?.facture?.paymentStatus || "-",
    createdAt: formatDateTime(commande?.createdAt),
    updatedAt: formatDateTime(commande?.updatedAt),
  };
};

const buildCommandePayload = (payload) => {
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

  return {
    date: payload?.date || undefined,
    status: String(payload?.status || "DRAFT").toUpperCase(),
    clientId: String(payload?.clientId || payload?.client || "").trim(),
    currencyCode: String(payload?.currencyCode || "TND").trim().toUpperCase(),
    exchangeRateToTnd: Number(payload?.exchangeRateToTnd || 0) || undefined,
    originalCurrencyTotals: payload?.originalCurrencyTotals || undefined,
    items,
  };
};

export const setCommandes = (items) => ({ type: SET_COMMANDES, payload: items });
export const setCommandesLoading = (loading) => ({ type: SET_COMMANDES_LOADING, payload: loading });
export const setCommandesError = (error) => ({ type: SET_COMMANDES_ERROR, payload: error });
export const clearCommandesError = () => ({ type: CLEAR_COMMANDES_ERROR });
export const setCommandesCreating = (creating) => ({ type: SET_COMMANDES_CREATING, payload: creating });
export const setCommandesCreateError = (error) => ({ type: SET_COMMANDES_CREATE_ERROR, payload: error });
export const clearCommandesCreateError = () => ({ type: CLEAR_COMMANDES_CREATE_ERROR });
export const setCommandesUpdating = (updating) => ({ type: SET_COMMANDES_UPDATING, payload: updating });
export const setCommandesUpdateError = (error) => ({ type: SET_COMMANDES_UPDATE_ERROR, payload: error });
export const clearCommandesUpdateError = () => ({ type: CLEAR_COMMANDES_UPDATE_ERROR });
export const setCommandesDeleting = (deleting) => ({ type: SET_COMMANDES_DELETING, payload: deleting });
export const setCommandesDeleteError = (error) => ({ type: SET_COMMANDES_DELETE_ERROR, payload: error });
export const clearCommandesDeleteError = () => ({ type: CLEAR_COMMANDES_DELETE_ERROR });

export const fetchCommandes = (params = {}) => {
  return async (dispatch) => {
    dispatch(setCommandesLoading(true));
    dispatch(clearCommandesError());

    try {
      const data = await getCommandes(params);
      const items = getCommandeList(data).map(formatCommande);
      dispatch(setCommandes(items));
      dispatch(setCommandesLoading(false));
      return { success: true, items };
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Erreur lors du chargement des commandes.";
      dispatch(setCommandesError(errorMessage));
      dispatch(setCommandesLoading(false));
      return { success: false, error: errorMessage };
    }
  };
};

export const createCommandeThunk = (payload) => {
  return async (dispatch) => {
    dispatch(setCommandesCreating(true));
    dispatch(clearCommandesCreateError());

    try {
      const data = await createCommande(buildCommandePayload(payload));
      await dispatch(fetchCommandes());
      dispatch(setCommandesCreating(false));
      return { success: true, data };
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Erreur lors de la creation de la commande.";
      dispatch(setCommandesCreateError(errorMessage));
      dispatch(setCommandesCreating(false));
      return { success: false, error: errorMessage };
    }
  };
};

export const updateCommandeThunk = (id, payload) => {
  return async (dispatch) => {
    dispatch(setCommandesUpdating(true));
    dispatch(clearCommandesUpdateError());

    try {
      const data = await updateCommande(id, buildCommandePayload(payload));
      await dispatch(fetchCommandes());
      dispatch(setCommandesUpdating(false));
      return { success: true, data };
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Erreur lors de la mise a jour de la commande.";
      dispatch(setCommandesUpdateError(errorMessage));
      dispatch(setCommandesUpdating(false));
      return { success: false, error: errorMessage };
    }
  };
};

export const deleteCommandeThunk = (id) => {
  return async (dispatch) => {
    dispatch(setCommandesDeleting(true));
    dispatch(clearCommandesDeleteError());

    try {
      const data = await deleteCommande(id);
      await dispatch(fetchCommandes());
      dispatch(setCommandesDeleting(false));
      return { success: true, data };
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Erreur lors de la suppression de la commande.";
      dispatch(setCommandesDeleteError(errorMessage));
      dispatch(setCommandesDeleting(false));
      return { success: false, error: errorMessage };
    }
  };
};

function CommandeReducer(state = initialState, action) {
  switch (action.type) {
    case SET_COMMANDES:
      return { ...state, items: action.payload };
    case SET_COMMANDES_LOADING:
      return { ...state, loading: action.payload };
    case SET_COMMANDES_ERROR:
      return { ...state, error: action.payload };
    case CLEAR_COMMANDES_ERROR:
      return { ...state, error: null };
    case SET_COMMANDES_CREATING:
      return { ...state, creating: action.payload };
    case SET_COMMANDES_CREATE_ERROR:
      return { ...state, createError: action.payload };
    case CLEAR_COMMANDES_CREATE_ERROR:
      return { ...state, createError: null };
    case SET_COMMANDES_UPDATING:
      return { ...state, updating: action.payload };
    case SET_COMMANDES_UPDATE_ERROR:
      return { ...state, updateError: action.payload };
    case CLEAR_COMMANDES_UPDATE_ERROR:
      return { ...state, updateError: null };
    case SET_COMMANDES_DELETING:
      return { ...state, deleting: action.payload };
    case SET_COMMANDES_DELETE_ERROR:
      return { ...state, deleteError: action.payload };
    case CLEAR_COMMANDES_DELETE_ERROR:
      return { ...state, deleteError: null };
    default:
      return state;
  }
}

export default CommandeReducer;