import { createProduct, getProducts, updateProduct } from "../../services/productApi";
import { API_BASE_URL } from "../../services/apiClient";

export const SET_PRODUCTS = "SET_PRODUCTS";
export const SET_PRODUCTS_LOADING = "SET_PRODUCTS_LOADING";
export const SET_PRODUCTS_ERROR = "SET_PRODUCTS_ERROR";
export const CLEAR_PRODUCTS_ERROR = "CLEAR_PRODUCTS_ERROR";
export const SET_PRODUCTS_CREATING = "SET_PRODUCTS_CREATING";
export const SET_PRODUCTS_CREATE_ERROR = "SET_PRODUCTS_CREATE_ERROR";
export const CLEAR_PRODUCTS_CREATE_ERROR = "CLEAR_PRODUCTS_CREATE_ERROR";
export const SET_PRODUCTS_UPDATING = "SET_PRODUCTS_UPDATING";
export const SET_PRODUCTS_UPDATE_ERROR = "SET_PRODUCTS_UPDATE_ERROR";
export const CLEAR_PRODUCTS_UPDATE_ERROR = "CLEAR_PRODUCTS_UPDATE_ERROR";

export const initialState = {
  items: [],
  loading: false,
  error: null,
  creating: false,
  createError: null,
  updating: false,
  updateError: null,
};

export const setProducts = (items) => ({ type: SET_PRODUCTS, payload: items });
export const setProductsLoading = (loading) => ({ type: SET_PRODUCTS_LOADING, payload: loading });
export const setProductsError = (error) => ({ type: SET_PRODUCTS_ERROR, payload: error });
export const clearProductsError = () => ({ type: CLEAR_PRODUCTS_ERROR });
export const setProductsCreating = (creating) => ({ type: SET_PRODUCTS_CREATING, payload: creating });
export const setProductsCreateError = (error) => ({ type: SET_PRODUCTS_CREATE_ERROR, payload: error });
export const clearProductsCreateError = () => ({ type: CLEAR_PRODUCTS_CREATE_ERROR });
export const setProductsUpdating = (updating) => ({ type: SET_PRODUCTS_UPDATING, payload: updating });
export const setProductsUpdateError = (error) => ({ type: SET_PRODUCTS_UPDATE_ERROR, payload: error });
export const clearProductsUpdateError = () => ({ type: CLEAR_PRODUCTS_UPDATE_ERROR });

const getProductList = (data) => {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.data)) {
    return data.data;
  }

  if (Array.isArray(data?.items)) {
    return data.items;
  }

  if (Array.isArray(data?.products)) {
    return data.products;
  }

  if (Array.isArray(data?.results)) {
    return data.results;
  }

  return [];
};

const formatMoney = (value) => {
  if (value === null || value === undefined || value === "") {
    return { display: "-", numeric: 0 };
  }

  const numericValue = Number(String(value).replace(/[^\d.-]/g, ""));

  return {
    display: `${value}`,
    numeric: Number.isFinite(numericValue) ? numericValue : 0,
  };
};

const formatStockValue = (product) => {
  const quantity = product?.stockQuantity ?? product?.quantity ?? product?.stock ?? product?.inventory;
  const unit = product?.stockUnit ?? product?.unit ?? product?.baseUnit ?? "";

  if (quantity === null || quantity === undefined || quantity === "") {
    return "-";
  }

  return `${quantity}${unit ? ` ${unit}` : ""}`;
};

const formatDateTime = (value) => {
  if (!value) {
    return "-";
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return String(value);
  }

  return parsedDate.toLocaleString("fr-FR");
};

const resolveStockStatus = (product) => {
  const rawQuantity = Number(product?.stockQuantity ?? product?.quantity ?? product?.stock);
  const threshold = Number(product?.minThreshold ?? product?.lowStockThreshold ?? 0);

  if (Number.isFinite(rawQuantity)) {
    if (rawQuantity <= 0) {
      return "danger";
    }

    if (Number.isFinite(threshold) && rawQuantity <= threshold) {
      return "warning";
    }

    return "success";
  }

  const stockText = String(product?.stockStatus || product?.status || "").toLowerCase();

  if (stockText.includes("out") || stockText.includes("rupture") || stockText.includes("danger")) {
    return "danger";
  }

  if (stockText.includes("low") || stockText.includes("warning")) {
    return "warning";
  }

  return "success";
};

const resolveImageUrl = (value) => {
  const rawValue = String(value || "").trim();
  if (!rawValue) return "";
  if (/^https?:\/\//i.test(rawValue)) return rawValue;

  const origin = API_BASE_URL.replace(/\/api\/?$/, "");
  const normalizedPath = rawValue.replace(/\\/g, "/");

  if (normalizedPath.startsWith("/")) {
    return `${origin}${normalizedPath}`;
  }

  return `${origin}/${normalizedPath}`;
};

const formatProduct = (product, index) => {
  const name = product?.name || product?.productName || product?.label || "Produit";
  const imageUrl = resolveImageUrl(product?.imageUrl || product?.image || "");
  const purchasePriceHT = product?.purchasePriceHT ?? product?.buyPrice ?? product?.purchasePrice ?? product?.costPrice ?? product?.prixHorsTva;
  const salePriceHT = product?.salePriceHT ?? product?.sellPrice ?? product?.unitPrice ?? product?.salePrice ?? product?.prixVenteHT;
  const tvaRate = product?.tvaRate ?? (product?.categoryId?.tvaRate || 0.19);
  const purchasePriceTTC = product?.purchasePriceTTC ?? (purchasePriceHT !== undefined ? Number((Number(purchasePriceHT) * (1 + tvaRate)).toFixed(2)) : 0);
  const salePriceTTC = product?.salePriceTTC ?? product?.prixTTC ?? (salePriceHT !== undefined ? Number((Number(salePriceHT) * (1 + tvaRate)).toFixed(2)) : 0);
  const categoryData = product?.categoryId || product?.category || {};
  const categoryName = categoryData?.name || product?.categoryName || product?.categorie || "-";
  const categoryTva = Number(categoryData?.tvaRate ?? tvaRate ?? 0.19);

  return {
    id: product?.id ?? product?._id ?? product?.code ?? `${index + 1}`,
    imageUrl,
    avatar: product?.avatar || imageUrl || name.charAt(0).toUpperCase(),
    reference: product?.reference || product?.ref || "-",
    name,
    description: product?.description || product?.details || product?.summary || "-",
    categoryName,
    category: categoryName,
    categoryId: categoryData?.id ?? categoryData?._id ?? product?.categoryId ?? product?.category ?? "",
    buyPrice: formatMoney(purchasePriceHT).display,
    buyPriceValue: formatMoney(purchasePriceHT).numeric,
    sellPrice: formatMoney(salePriceHT).display,
    sellPriceValue: formatMoney(salePriceHT).numeric,
    buyPriceTTC: formatMoney(purchasePriceTTC).numeric,
    sellPriceTTC: formatMoney(salePriceTTC).numeric,
    purchasePriceHT,
    salePriceHT,
    purchasePriceTTC,
    salePriceTTC,
    tvaRate: categoryTva,
    minThreshold: Number(product?.minThreshold ?? product?.lowStockThreshold ?? 0),
    stock: formatStockValue(product),
    stockQuantity: product?.stockQuantity ?? product?.quantity ?? product?.stock ?? product?.inventory ?? "",
    stockStatus: resolveStockStatus(product),
    baseUnit: product?.stockUnit ?? product?.unit ?? product?.baseUnit ?? "-",
    createdAt: formatDateTime(product?.createdAt ?? product?.created_at),
    updatedAt: formatDateTime(product?.updatedAt ?? product?.updated_at),
  };
};

const buildProductPayload = (payload) => {
  const purchasePriceInput = payload?.buyPrice ?? payload?.purchasePriceHT;
  const salePriceInput = payload?.sellPrice ?? payload?.salePriceHT ?? payload?.unitPrice;
  const purchasePriceHT = purchasePriceInput === null || purchasePriceInput === undefined || purchasePriceInput === ""
    ? 0
    : Number(purchasePriceInput) || 0;
  const salePriceHT = salePriceInput === null || salePriceInput === undefined || salePriceInput === ""
    ? 0
    : Number(salePriceInput) || 0;
  const salePriceTTC = Number((salePriceHT * 1.19).toFixed(2));

  return {
    name: payload?.name?.trim(),
    reference: payload?.reference?.trim()?.toUpperCase(),
    purchasePriceHT,
    salePriceHT,
    quantity: Number(payload?.stockQuantity) || 0,
    minThreshold: Number(payload?.minThreshold) || 0,
    categorie: payload?.category,
    categoryId: payload?.categoryId ?? payload?.category,
    description: payload?.description?.trim() || "",
    imageUrl: typeof payload?.image === "string" ? payload.image : (typeof payload?.imageUrl === "string" ? payload.imageUrl : ""),
    image: payload?.image instanceof File ? payload.image : null,
    prixHorsTva: purchasePriceHT,
    Tva: 0.19,
    prixTTC: salePriceTTC,
  };
};

export const fetchProducts = (params = {}) => {
  return async (dispatch) => {
    dispatch(setProductsLoading(true));
    dispatch(clearProductsError());

    try {
      const data = await getProducts(params);
      const items = getProductList(data).map(formatProduct);

      dispatch(setProducts(items));
      dispatch(setProductsLoading(false));

      return { success: true, items };
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Erreur lors du chargement des produits.";

      dispatch(setProductsError(errorMessage));
      dispatch(setProductsLoading(false));

      return { success: false, error: errorMessage };
    }
  };
};

export const createProductThunk = (payload) => {
  return async (dispatch) => {
    dispatch(setProductsCreating(true));
    dispatch(clearProductsCreateError());

    try {
      const requestPayload = buildProductPayload(payload);
      const data = await createProduct(requestPayload);
      await dispatch(fetchProducts());
      dispatch(setProductsCreating(false));

      return { success: true, data };
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Erreur lors de l'enregistrement du produit.";

      dispatch(setProductsCreateError(errorMessage));
      dispatch(setProductsCreating(false));

      return { success: false, error: errorMessage };
    }
  };
};

export const updateProductThunk = (id, payload) => {
  return async (dispatch) => {
    dispatch(setProductsUpdating(true));
    dispatch(clearProductsUpdateError());

    try {
      const requestPayload = buildProductPayload(payload);
      const data = await updateProduct(id, requestPayload);
      await dispatch(fetchProducts());
      dispatch(setProductsUpdating(false));

      return { success: true, data };
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Erreur lors de la mise a jour du produit.";

      dispatch(setProductsUpdateError(errorMessage));
      dispatch(setProductsUpdating(false));

      return { success: false, error: errorMessage };
    }
  };
};

function ProductsReducer(state = initialState, action) {
  switch (action.type) {
    case SET_PRODUCTS:
      return { ...state, items: action.payload };
    case SET_PRODUCTS_LOADING:
      return { ...state, loading: action.payload };
    case SET_PRODUCTS_ERROR:
      return { ...state, error: action.payload };
    case CLEAR_PRODUCTS_ERROR:
      return { ...state, error: null };
    case SET_PRODUCTS_CREATING:
      return { ...state, creating: action.payload };
    case SET_PRODUCTS_CREATE_ERROR:
      return { ...state, createError: action.payload };
    case CLEAR_PRODUCTS_CREATE_ERROR:
      return { ...state, createError: null };
    case SET_PRODUCTS_UPDATING:
      return { ...state, updating: action.payload };
    case SET_PRODUCTS_UPDATE_ERROR:
      return { ...state, updateError: action.payload };
    case CLEAR_PRODUCTS_UPDATE_ERROR:
      return { ...state, updateError: null };
    default:
      return state;
  }
}

export default ProductsReducer;
