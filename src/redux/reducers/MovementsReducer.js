import { getMovements } from "../../services/movementApi";

export const SET_MOVEMENTS = "SET_MOVEMENTS";
export const SET_MOVEMENTS_LOADING = "SET_MOVEMENTS_LOADING";
export const SET_MOVEMENTS_ERROR = "SET_MOVEMENTS_ERROR";
export const CLEAR_MOVEMENTS_ERROR = "CLEAR_MOVEMENTS_ERROR";

export const initialState = {
  rows: [],
  loading: false,
  error: null,
};

export const setMovements = (rows) => ({ type: SET_MOVEMENTS, payload: rows });
export const setMovementsLoading = (loading) => ({ type: SET_MOVEMENTS_LOADING, payload: loading });
export const setMovementsError = (error) => ({ type: SET_MOVEMENTS_ERROR, payload: error });
export const clearMovementsError = () => ({ type: CLEAR_MOVEMENTS_ERROR });

const getMovementList = (data) => {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.data)) {
    return data.data;
  }

  if (Array.isArray(data?.items)) {
    return data.items;
  }

  if (Array.isArray(data?.movements)) {
    return data.movements;
  }

  if (Array.isArray(data?.results)) {
    return data.results;
  }

  return [];
};

const formatMovementDate = (movement) => {
  const rawDate = movement?.date || movement?.createdAt || movement?.created_at || movement?.timestamp;

  if (!rawDate) {
    return "-";
  }

  const parsedDate = new Date(rawDate);

  if (Number.isNaN(parsedDate.getTime())) {
    return String(rawDate);
  }

  return parsedDate.toLocaleString("fr-FR");
};

const formatMovementType = (movement) => {
  const rawType = movement?.type || movement?.movementType || movement?.movement_type || movement?.direction;

  if (!rawType) {
    return "-";
  }

  const normalizedType = String(rawType).toLowerCase();

  if (normalizedType.includes("sell") || normalizedType.includes("sale") || normalizedType.includes("vente")) {
    return "Vente";
  }

  if (normalizedType.includes("buy") || normalizedType.includes("purchase") || normalizedType.includes("achat")) {
    return "Achat";
  }

  return String(rawType);
};

const formatMovementRow = (movement, index) => ({
  product:
    movement?.product?.name ||
    movement?.productName ||
    movement?.product ||
    movement?.article?.name ||
    movement?.article ||
    "-",
  type: formatMovementType(movement),
  qty: String(movement?.qty ?? movement?.quantity ?? movement?.amount ?? movement?.value ?? "-"),
  reference:
    movement?.reference ||
    movement?.ref ||
    movement?.code ||
    movement?.movementRef ||
    movement?.id ||
    `${index + 1}`,
  date: formatMovementDate(movement),
});

export const fetchMovements = (params = {}) => {
  return async (dispatch) => {
    dispatch(setMovementsLoading(true));
    dispatch(clearMovementsError());

    try {
      const data = await getMovements(params);
      const rows = getMovementList(data).map(formatMovementRow);

      dispatch(setMovements(rows));
      dispatch(setMovementsLoading(false));

      return { success: true, rows };
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Erreur lors du chargement des mouvements.";

      dispatch(setMovementsError(errorMessage));
      dispatch(setMovementsLoading(false));

      return { success: false, error: errorMessage };
    }
  };
};

function MovementsReducer(state = initialState, action) {
  switch (action.type) {
    case SET_MOVEMENTS:
      return { ...state, rows: action.payload };
    case SET_MOVEMENTS_LOADING:
      return { ...state, loading: action.payload };
    case SET_MOVEMENTS_ERROR:
      return { ...state, error: action.payload };
    case CLEAR_MOVEMENTS_ERROR:
      return { ...state, error: null };
    default:
      return state;
  }
}

export default MovementsReducer;