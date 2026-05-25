import {
  createAchat,
  deleteAchat,
  getAchats,
  receiveAchat,
  updateAchat,
} from "../../services/achatApi";

export const SET_ACHATS = "SET_ACHATS";
export const SET_ACHATS_LOADING = "SET_ACHATS_LOADING";
export const SET_ACHATS_ERROR = "SET_ACHATS_ERROR";
export const CLEAR_ACHATS_ERROR = "CLEAR_ACHATS_ERROR";
export const SET_ACHATS_CREATING = "SET_ACHATS_CREATING";
export const SET_ACHATS_CREATE_ERROR = "SET_ACHATS_CREATE_ERROR";
export const CLEAR_ACHATS_CREATE_ERROR = "CLEAR_ACHATS_CREATE_ERROR";
export const SET_ACHATS_UPDATING = "SET_ACHATS_UPDATING";
export const SET_ACHATS_UPDATE_ERROR = "SET_ACHATS_UPDATE_ERROR";
export const CLEAR_ACHATS_UPDATE_ERROR = "CLEAR_ACHATS_UPDATE_ERROR";
export const SET_ACHATS_DELETING = "SET_ACHATS_DELETING";
export const SET_ACHATS_DELETE_ERROR = "SET_ACHATS_DELETE_ERROR";
export const CLEAR_ACHATS_DELETE_ERROR = "CLEAR_ACHATS_DELETE_ERROR";
export const SET_ACHATS_RECEIVING = "SET_ACHATS_RECEIVING";
export const SET_ACHATS_RECEIVE_ERROR = "SET_ACHATS_RECEIVE_ERROR";
export const CLEAR_ACHATS_RECEIVE_ERROR = "CLEAR_ACHATS_RECEIVE_ERROR";

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
  receiving: false,
  receiveError: null,
};

export const setAchats = (items) => ({ type: SET_ACHATS, payload: items });
export const setAchatsLoading = (loading) => ({ type: SET_ACHATS_LOADING, payload: loading });
export const setAchatsError = (error) => ({ type: SET_ACHATS_ERROR, payload: error });
export const clearAchatsError = () => ({ type: CLEAR_ACHATS_ERROR });
export const setAchatsCreating = (creating) => ({ type: SET_ACHATS_CREATING, payload: creating });
export const setAchatsCreateError = (error) => ({ type: SET_ACHATS_CREATE_ERROR, payload: error });
export const clearAchatsCreateError = () => ({ type: CLEAR_ACHATS_CREATE_ERROR });
export const setAchatsUpdating = (updating) => ({ type: SET_ACHATS_UPDATING, payload: updating });
export const setAchatsUpdateError = (error) => ({ type: SET_ACHATS_UPDATE_ERROR, payload: error });
export const clearAchatsUpdateError = () => ({ type: CLEAR_ACHATS_UPDATE_ERROR });
export const setAchatsDeleting = (deleting) => ({ type: SET_ACHATS_DELETING, payload: deleting });
export const setAchatsDeleteError = (error) => ({ type: SET_ACHATS_DELETE_ERROR, payload: error });
export const clearAchatsDeleteError = () => ({ type: CLEAR_ACHATS_DELETE_ERROR });
export const setAchatsReceiving = (receiving) => ({ type: SET_ACHATS_RECEIVING, payload: receiving });
export const setAchatsReceiveError = (error) => ({ type: SET_ACHATS_RECEIVE_ERROR, payload: error });
export const clearAchatsReceiveError = () => ({ type: CLEAR_ACHATS_RECEIVE_ERROR });

const getAchatList = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.achats)) return data.achats;
  if (Array.isArray(data?.results)) return data.results;
  return [];
};

const formatMoney = (value) => {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return { display: "-", numeric: 0 };
  }

  return {
    display: numericValue.toLocaleString("fr-TN", { style: "currency", currency: "TND" }),
    numeric: numericValue,
  };
};

const computeTotalsFromItems = (items) => {
  let totalHT = 0;
  let tvaAmount = 0;

  (items || []).forEach((item) => {
    const quantity = Number(item?.quantity) || 0;
    const unitCost = Number(item?.unitCost) || 0;
    const tvaRate = Number(item?.product?.tvaRate ?? item?.product?.taxRate ?? item?.product?.rate ?? 0.19) || 0;
    const lineHT = quantity * unitCost;
    totalHT += lineHT;
    tvaAmount += lineHT * tvaRate;
  });

  const roundedHT = Number(totalHT.toFixed(2));
  const roundedTVA = Number(tvaAmount.toFixed(2));
  return { totalHT: roundedHT, tvaAmount: roundedTVA, totalAmountTTC: Number((roundedHT + roundedTVA).toFixed(2)) };
};

const formatDateTime = (value) => {
  if (!value) return "-";

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return String(value);
  }

  return parsedDate.toLocaleString("fr-FR");
};

const normalizeStatus = (status) => {
  const normalized = String(status || "PENDING").toUpperCase();

  if (normalized === "RECEIVED") {
    return { value: "RECEIVED", label: "Réceptionnée" };
  }

  if (normalized === "CANCELLED") {
    return { value: "CANCELLED", label: "Annule" };
  }

  if (normalized === "PARTIALLY_RECEIVED") {
    return { value: "PARTIALLY_RECEIVED", label: "Partiellement réceptionnée" };
  }

  return { value: "PENDING", label: "En attente" };
};

const formatItem = (item, index) => {
  const quantity = Number(item?.quantity) || 0;
  const unitCost = Number(item?.unitCost) || 0;
  const receivedQuantity = Math.min(Number(item?.receivedQuantity) || 0, quantity);
  const pendingQuantity = Math.max(quantity - receivedQuantity, 0);
  const lineTotalValue = quantity * unitCost;
  const unitCostMoney = formatMoney(unitCost);
  const lineTotalMoney = formatMoney(lineTotalValue);
  const productId = item?.productId ?? item?.product?._id ?? item?.product?.id ?? item?.product;
  const itemStatus = String(item?.status || (receivedQuantity >= quantity && quantity > 0 ? "RECEIVED" : receivedQuantity > 0 ? "PARTIALLY_RECEIVED" : "PENDING")).toUpperCase();

  const itemStatusMap = normalizeStatus(itemStatus);

  return {
    id: item?.id ?? item?._id ?? `${index + 1}`,
    productId,
    productName: item?.product?.name || item?.product?.reference || "Produit",
    quantity,
    unitCost,
    receivedQuantity,
    pendingQuantity,
    unitCostDisplay: unitCostMoney.display,
    lineTotalValue,
    lineTotalDisplay: lineTotalMoney.display,
    status: itemStatusMap.value,
    statusLabel: itemStatusMap.label,
  };
};

const formatAchat = (achat, index) => {
  const items = Array.isArray(achat?.items) ? achat.items.map(formatItem) : [];
  const derivedStatus = items.length > 0 && items.every((item) => item.status === "RECEIVED")
    ? "RECEIVED"
    : items.some((item) => item.status === "RECEIVED" || item.status === "PARTIALLY_RECEIVED")
      ? "PARTIALLY_RECEIVED"
      : achat?.status;
  const status = normalizeStatus(derivedStatus);
  const supplierName =
    achat?.supplier?.name ||
    `${achat?.supplier?.firstName || ""} ${achat?.supplier?.lastName || ""}`.trim() ||
    "-";

  const totals = computeTotalsFromItems(items);
  const exchangeRateToTnd = Number(achat?.exchangeRateToTnd || 0);
  const originalCurrencyTotal = Number(achat?.originalCurrencyTotals?.totalAmountTTC || 0);
  const currencyCode = String(achat?.currencyCode || "TND").toUpperCase();

  let totalAmountValue = Number(achat?.totalAmountTTC ?? achat?.totalAmount ?? totals.totalAmountTTC) || 0;
  if (currencyCode !== "TND" && Number.isFinite(exchangeRateToTnd) && exchangeRateToTnd > 0 && originalCurrencyTotal > 0) {
    totalAmountValue = Number((originalCurrencyTotal * exchangeRateToTnd).toFixed(3));
  }
  const totalMoney = formatMoney(totalAmountValue);

  return {
    id: achat?.id ?? achat?._id ?? `${index + 1}`,
    purchaseNumber: achat?.purchaseNumber || achat?.reference || "-",
    date: formatDateTime(achat?.date),
    dateIso: achat?.date || null,
    status: status.value,
    statusLabel: status.label,
    supplierId: achat?.supplier?._id ?? achat?.supplier?.id ?? achat?.supplier,
    supplierName,
    supplierEmail: achat?.supplier?.email || "-",
    createdById: achat?.createdBy?._id ?? achat?.createdBy?.id ?? achat?.createdBy,
    createdByName:
      `${achat?.createdBy?.firstName || ""} ${achat?.createdBy?.lastName || ""}`.trim() ||
      achat?.createdBy?.email ||
      "-",
    itemCount: items.length,
    items,
    totalHT: Number(achat?.totalHT ?? totals.totalHT) || 0,
    tvaAmount: Number(achat?.tvaAmount ?? totals.tvaAmount) || 0,
    totalAmount: totalMoney.display,
    totalAmountValue: totalMoney.numeric,
    totalAmountTTC: totalMoney.numeric,
    totalAmountTTDisplay: totalMoney.display,
    currencyCode,
    exchangeRateToTnd,
    ocrSource: achat?.ocrSource || "",
    createdAt: formatDateTime(achat?.createdAt),
    updatedAt: formatDateTime(achat?.updatedAt),
  };
};

const buildItemPayload = (item) => {
  const product = String(item?.productId || item?.product || "").trim();
  const quantity = Number(item?.quantity);
  const unitCost = Number(item?.unitCost);

  if (!product || !Number.isFinite(quantity) || quantity <= 0 || !Number.isFinite(unitCost) || unitCost < 0) {
    return null;
  }

  return {
    product,
    quantity,
    unitCost,
  };
};

const buildAchatPayload = (payload) => {
  const normalizedItems = Array.isArray(payload?.items)
    ? payload.items.map(buildItemPayload).filter(Boolean)
    : [];

  const requestPayload = {
    purchaseNumber: String(payload?.purchaseNumber || "").trim(),
    supplierId: String(payload?.supplierId || payload?.supplier || "").trim(),
    status: String(payload?.status || "PENDING").toUpperCase(),
    items: normalizedItems,
    ocrSource: String(payload?.ocrSource || "").trim(),
  };

  if (payload?.date) {
    requestPayload.date = payload.date;
  }

  return requestPayload;
};

export const fetchAchats = (params = {}) => {
  return async (dispatch) => {
    dispatch(setAchatsLoading(true));
    dispatch(clearAchatsError());

    try {
      const data = await getAchats(params);
      const items = getAchatList(data).map(formatAchat);

      dispatch(setAchats(items));
      dispatch(setAchatsLoading(false));

      return { success: true, items };
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Erreur lors du chargement des achats.";

      dispatch(setAchatsError(errorMessage));
      dispatch(setAchatsLoading(false));

      return { success: false, error: errorMessage };
    }
  };
};

export const createAchatThunk = (payload) => {
  return async (dispatch) => {
    dispatch(setAchatsCreating(true));
    dispatch(clearAchatsCreateError());

    try {
      const requestPayload = buildAchatPayload(payload);
      const data = await createAchat(requestPayload);
      await dispatch(fetchAchats());
      dispatch(setAchatsCreating(false));

      return { success: true, data };
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Erreur lors de la creation de l'achat.";

      dispatch(setAchatsCreateError(errorMessage));
      dispatch(setAchatsCreating(false));

      return { success: false, error: errorMessage };
    }
  };
};

export const updateAchatThunk = (id, payload) => {
  return async (dispatch) => {
    dispatch(setAchatsUpdating(true));
    dispatch(clearAchatsUpdateError());

    try {
      const requestPayload = buildAchatPayload(payload);
      const data = await updateAchat(id, requestPayload);
      await dispatch(fetchAchats());
      dispatch(setAchatsUpdating(false));

      return { success: true, data };
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Erreur lors de la mise a jour de l'achat.";

      dispatch(setAchatsUpdateError(errorMessage));
      dispatch(setAchatsUpdating(false));

      return { success: false, error: errorMessage };
    }
  };
};

export const deleteAchatThunk = (id) => {
  return async (dispatch) => {
    dispatch(setAchatsDeleting(true));
    dispatch(clearAchatsDeleteError());

    try {
      const data = await deleteAchat(id);
      await dispatch(fetchAchats());
      dispatch(setAchatsDeleting(false));

      return { success: true, data };
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Erreur lors de la suppression de l'achat.";

      dispatch(setAchatsDeleteError(errorMessage));
      dispatch(setAchatsDeleting(false));

      return { success: false, error: errorMessage };
    }
  };
};

export const receiveAchatThunk = (id, itemIndexes = []) => {
  return async (dispatch) => {
    dispatch(setAchatsReceiving(true));
    dispatch(clearAchatsReceiveError());

    try {
      const data = await receiveAchat(id, itemIndexes);
      await dispatch(fetchAchats());
      dispatch(setAchatsReceiving(false));

      return { success: true, data };
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Erreur lors de la reception de l'achat.";

      dispatch(setAchatsReceiveError(errorMessage));
      dispatch(setAchatsReceiving(false));

      return { success: false, error: errorMessage };
    }
  };
};

function AchatsReducer(state = initialState, action) {
  switch (action.type) {
    case SET_ACHATS:
      return { ...state, items: action.payload };
    case SET_ACHATS_LOADING:
      return { ...state, loading: action.payload };
    case SET_ACHATS_ERROR:
      return { ...state, error: action.payload };
    case CLEAR_ACHATS_ERROR:
      return { ...state, error: null };
    case SET_ACHATS_CREATING:
      return { ...state, creating: action.payload };
    case SET_ACHATS_CREATE_ERROR:
      return { ...state, createError: action.payload };
    case CLEAR_ACHATS_CREATE_ERROR:
      return { ...state, createError: null };
    case SET_ACHATS_UPDATING:
      return { ...state, updating: action.payload };
    case SET_ACHATS_UPDATE_ERROR:
      return { ...state, updateError: action.payload };
    case CLEAR_ACHATS_UPDATE_ERROR:
      return { ...state, updateError: null };
    case SET_ACHATS_DELETING:
      return { ...state, deleting: action.payload };
    case SET_ACHATS_DELETE_ERROR:
      return { ...state, deleteError: action.payload };
    case CLEAR_ACHATS_DELETE_ERROR:
      return { ...state, deleteError: null };
    case SET_ACHATS_RECEIVING:
      return { ...state, receiving: action.payload };
    case SET_ACHATS_RECEIVE_ERROR:
      return { ...state, receiveError: action.payload };
    case CLEAR_ACHATS_RECEIVE_ERROR:
      return { ...state, receiveError: null };
    default:
      return state;
  }
}

export default AchatsReducer;
