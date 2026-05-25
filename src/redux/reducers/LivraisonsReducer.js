import {
  assignLivraisonTransporter,
  createLivraison,
  getLivraisons,
} from "../../services/livraisonApi";

export const SET_LIVRAISONS = "SET_LIVRAISONS";
export const SET_LIVRAISONS_LOADING = "SET_LIVRAISONS_LOADING";
export const SET_LIVRAISONS_ERROR = "SET_LIVRAISONS_ERROR";
export const CLEAR_LIVRAISONS_ERROR = "CLEAR_LIVRAISONS_ERROR";
export const SET_LIVRAISONS_CREATING = "SET_LIVRAISONS_CREATING";
export const SET_LIVRAISONS_CREATE_ERROR = "SET_LIVRAISONS_CREATE_ERROR";
export const CLEAR_LIVRAISONS_CREATE_ERROR = "CLEAR_LIVRAISONS_CREATE_ERROR";
export const SET_LIVRAISONS_DELIVERING = "SET_LIVRAISONS_DELIVERING";
export const SET_LIVRAISONS_DELIVER_ERROR = "SET_LIVRAISONS_DELIVER_ERROR";
export const CLEAR_LIVRAISONS_DELIVER_ERROR = "CLEAR_LIVRAISONS_DELIVER_ERROR";

export const initialState = {
  items: [],
  loading: false,
  error: null,
  creating: false,
  createError: null,
  delivering: false,
  deliverError: null,
};

const getLivraisonList = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.livraisons)) return data.livraisons;
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
  const normalized = String(status || "PLANNED").toUpperCase();
  const labelMap = {
    PLANNED: "Planifiée",
    DELIVERED: "Livrée",
    CANCELLED: "Annulée",
  };
  return { value: normalized, label: labelMap[normalized] || normalized };
};

const computeTotalsFromLines = (lines) => {
  let totalHT = 0;
  let tvaAmount = 0;

  (lines || []).forEach((line) => {
    const quantity = Number(line?.deliveredQuantity ?? line?.requestedQuantity ?? 0);
    const unitPrice = Number(line?.unitPrice || 0);
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

const formatLivraison = (item, index) => {
  const status = normalizeStatus(item?.status);
  const commandes = Array.isArray(item?.commandes) ? item.commandes : [];
  const commandeItems = Array.isArray(item?.commandeItems) ? item.commandeItems : [];
  const bonCommandeLines = Array.isArray(item?.bonCommandeLines) ? item.bonCommandeLines : [];
  const effectiveLines = bonCommandeLines.length
    ? bonCommandeLines.map((line) => ({
        id: line?.id ?? line?._id,
        commandeItem: line?.commandeItem,
        requestedQuantity: Number(line?.requestedQuantity || 0),
        deliveredQuantity: Number(line?.deliveredQuantity || 0),
        remainingQuantity: Number(line?.remainingQuantity || 0),
        status: line?.status,
      }))
    : commandeItems.map((ci) => ({
        id: ci?.id ?? ci?._id,
        commandeItem: ci,
        requestedQuantity: Number(ci?.quantity || 0),
        deliveredQuantity: Number(ci?.quantity || 0),
        remainingQuantity: 0,
        status: ci?.status,
      }));
  const totals = computeTotalsFromLines(effectiveLines);
  const totalHT = Number(item?.totalHT ?? totals.totalHT) || 0;
  const tvaAmount = Number(item?.tvaAmount ?? totals.tvaAmount) || 0;
  const totalAmountTTC = Number(item?.totalAmountTTC ?? item?.totalAmount ?? totals.totalAmountTTC) || 0;

  return {
    id: item?.id ?? item?._id ?? `${index + 1}`,
    deliveryNumber: item?.deliveryNumber || "-",
    date: formatDateTime(item?.date),
    dateIso: item?.date || null,
    status: status.value,
    statusLabel: status.label,
    transporterId: item?.transporter?._id ?? item?.transporter?.id ?? item?.transporter,
    transporterName: item?.transporter?.name || "-",
    transporterPlate: item?.transporter?.plateNumber || "-",
    bonCommandeId: item?.bonCommande?._id ?? item?.bonCommande?.id ?? item?.bonCommande ?? null,
    bonCommandeNumber: item?.bonCommande?.bonNumber || "-",
    commandeCount: commandes.length,
    itemCount: effectiveLines.length,
    note: item?.note || "",
    createdByName: `${item?.createdBy?.firstName || ""} ${item?.createdBy?.lastName || ""}`.trim() || item?.createdBy?.email || "-",
    commandes,
    commandeItems: effectiveLines.map((line, ciIndex) => {
      const ci = line.commandeItem || {};
      const quantity = Number(line.deliveredQuantity || line.requestedQuantity || 0);

      return {
        id: line.id ?? ci?.id ?? ci?._id ?? `${ciIndex + 1}`,
        commandeId: ci?.commande?._id ?? ci?.commande?.id ?? ci?.commande,
        commandeNumber: ci?.commande?.commandeNumber || "-",
        commandeStatus: ci?.commande?.status || "-",
        productName: ci?.product?.name || ci?.product?.reference || "Produit",
        productReference: ci?.product?.reference || "-",
        quantity,
        requestedQuantity: Number(line.requestedQuantity || 0),
        deliveredQuantity: Number(line.deliveredQuantity || quantity),
        remainingQuantity: Number(line.remainingQuantity || 0),
        unitPrice: Number(ci?.unitPrice) || 0,
        lineTotal: quantity * (Number(ci?.unitPrice) || 0),
        status: String(line.status || ci?.status || "-").toUpperCase(),
        deliveredAt: ci?.deliveredAt ? formatDateTime(ci?.deliveredAt) : "-",
        deliveredByName:
          `${ci?.deliveredBy?.firstName || ""} ${ci?.deliveredBy?.lastName || ""}`.trim() ||
          ci?.deliveredBy?.email ||
          "-",
      };
    }),
    totalHT,
    tvaAmount,
    totalAmountTTC,
    totalAmountDisplay: totalAmountTTC.toLocaleString("fr-TN", { style: "currency", currency: "TND" }),
    createdAt: formatDateTime(item?.createdAt),
    updatedAt: formatDateTime(item?.updatedAt),
  };
};

const buildLivraisonPayload = (payload) => {
  const bonCommandeLineIds = Array.isArray(payload?.bonCommandeLineIds)
    ? payload.bonCommandeLineIds.map((id) => String(id || "").trim()).filter(Boolean)
    : [];

  return {
    date: payload?.date || undefined,
    bonCommandeId: String(payload?.bonCommandeId || "").trim() || undefined,
    bonCommandeLineIds,
    note: String(payload?.note || "").trim(),
  };
};

export const setLivraisons = (items) => ({ type: SET_LIVRAISONS, payload: items });
export const setLivraisonsLoading = (loading) => ({ type: SET_LIVRAISONS_LOADING, payload: loading });
export const setLivraisonsError = (error) => ({ type: SET_LIVRAISONS_ERROR, payload: error });
export const clearLivraisonsError = () => ({ type: CLEAR_LIVRAISONS_ERROR });
export const setLivraisonsCreating = (creating) => ({ type: SET_LIVRAISONS_CREATING, payload: creating });
export const setLivraisonsCreateError = (error) => ({ type: SET_LIVRAISONS_CREATE_ERROR, payload: error });
export const clearLivraisonsCreateError = () => ({ type: CLEAR_LIVRAISONS_CREATE_ERROR });
export const setLivraisonsDelivering = (delivering) => ({ type: SET_LIVRAISONS_DELIVERING, payload: delivering });
export const setLivraisonsDeliverError = (error) => ({ type: SET_LIVRAISONS_DELIVER_ERROR, payload: error });
export const clearLivraisonsDeliverError = () => ({ type: CLEAR_LIVRAISONS_DELIVER_ERROR });

export const fetchLivraisons = (params = {}) => {
  return async (dispatch) => {
    dispatch(setLivraisonsLoading(true));
    dispatch(clearLivraisonsError());

    try {
      const data = await getLivraisons(params);
      const items = getLivraisonList(data).map(formatLivraison);
      dispatch(setLivraisons(items));
      dispatch(setLivraisonsLoading(false));
      return { success: true, items };
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Erreur lors du chargement des livraisons.";
      dispatch(setLivraisonsError(errorMessage));
      dispatch(setLivraisonsLoading(false));
      return { success: false, error: errorMessage };
    }
  };
};

export const createLivraisonThunk = (payload) => {
  return async (dispatch) => {
    dispatch(setLivraisonsCreating(true));
    dispatch(clearLivraisonsCreateError());

    try {
      const data = await createLivraison(buildLivraisonPayload(payload));
      await dispatch(fetchLivraisons());
      dispatch(setLivraisonsCreating(false));
      return { success: true, data };
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Erreur lors de la création de la livraison.";
      dispatch(setLivraisonsCreateError(errorMessage));
      dispatch(setLivraisonsCreating(false));
      return { success: false, error: errorMessage };
    }
  };
};

export const assignLivraisonTransporterThunk = (livraisonId, transporterId) => {
  return async (dispatch) => {
    dispatch(setLivraisonsDelivering(true));
    dispatch(clearLivraisonsDeliverError());

    try {
      const data = await assignLivraisonTransporter(livraisonId, {
        transporterId: String(transporterId || "").trim(),
      });
      await dispatch(fetchLivraisons());
      dispatch(setLivraisonsDelivering(false));
      return { success: true, data };
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Erreur lors de la livraison avec transporteur.";
      dispatch(setLivraisonsDeliverError(errorMessage));
      dispatch(setLivraisonsDelivering(false));
      return { success: false, error: errorMessage };
    }
  };
};

function LivraisonsReducer(state = initialState, action) {
  switch (action.type) {
    case SET_LIVRAISONS:
      return { ...state, items: action.payload };
    case SET_LIVRAISONS_LOADING:
      return { ...state, loading: action.payload };
    case SET_LIVRAISONS_ERROR:
      return { ...state, error: action.payload };
    case CLEAR_LIVRAISONS_ERROR:
      return { ...state, error: null };
    case SET_LIVRAISONS_CREATING:
      return { ...state, creating: action.payload };
    case SET_LIVRAISONS_CREATE_ERROR:
      return { ...state, createError: action.payload };
    case CLEAR_LIVRAISONS_CREATE_ERROR:
      return { ...state, createError: null };
    case SET_LIVRAISONS_DELIVERING:
      return { ...state, delivering: action.payload };
    case SET_LIVRAISONS_DELIVER_ERROR:
      return { ...state, deliverError: action.payload };
    case CLEAR_LIVRAISONS_DELIVER_ERROR:
      return { ...state, deliverError: null };
    default:
      return state;
  }
}

export default LivraisonsReducer;
