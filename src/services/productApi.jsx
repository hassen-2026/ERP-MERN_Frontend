import apiClient from "./apiClient";

const PRODUCT_ROUTE = "/products";

const appendIfDefined = (formData, key, value) => {
  if (value === undefined || value === null) return;
  formData.append(key, value);
};

const normalizeNumber = (value, fallback = 0) => {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }

  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : fallback;
};

const normalizeProductPayload = (payload = {}) => {
  const purchasePriceHT = normalizeNumber(
    payload?.purchasePriceHT ?? payload?.buyPrice ?? payload?.prixHorsTva ?? payload?.purchasePrice ?? payload?.costPrice,
    0,
  );
  const salePriceCandidate = payload?.salePriceHT ?? payload?.sellPrice ?? payload?.unitPrice ?? payload?.salePrice;
  const salePriceTTC = payload?.prixTTC ?? payload?.salePriceTTC ?? payload?.sellPriceTTC;
  const salePriceHT = salePriceCandidate !== undefined
    ? normalizeNumber(salePriceCandidate, 0)
    : salePriceTTC !== undefined
      ? normalizeNumber(salePriceTTC, 0) / 1.19
      : purchasePriceHT;

  return {
    name: payload?.name,
    reference: payload?.reference,
    quantity: normalizeNumber(payload?.quantity ?? payload?.stockQuantity, 0),
    minThreshold: normalizeNumber(payload?.minThreshold ?? payload?.lowStockThreshold, 0),
    purchasePriceHT,
    salePriceHT,
    categorie: payload?.categorie ?? payload?.category,
    categoryId: payload?.categoryId,
    description: payload?.description,
    imageUrl: typeof payload?.imageUrl === "string" ? payload.imageUrl : (typeof payload?.image === "string" ? payload.image : ""),
    imagePublicId: payload?.imagePublicId,
    image: payload?.image instanceof File ? payload.image : null,
  };
};

const buildProductFormData = (payload = {}) => {
  const normalizedPayload = normalizeProductPayload(payload);
  const formData = new FormData();

  appendIfDefined(formData, "name", normalizedPayload?.name);
  appendIfDefined(formData, "reference", normalizedPayload?.reference);
  appendIfDefined(formData, "quantity", normalizedPayload?.quantity);
  appendIfDefined(formData, "minThreshold", normalizedPayload?.minThreshold);
  appendIfDefined(formData, "purchasePriceHT", normalizedPayload?.purchasePriceHT);
  appendIfDefined(formData, "salePriceHT", normalizedPayload?.salePriceHT);
  appendIfDefined(formData, "categorie", normalizedPayload?.categorie);
  appendIfDefined(formData, "categoryId", normalizedPayload?.categoryId);
  appendIfDefined(formData, "description", normalizedPayload?.description);

  if (typeof normalizedPayload?.imageUrl === "string") {
    appendIfDefined(formData, "imageUrl", normalizedPayload.imageUrl);
  }

  if (normalizedPayload?.image instanceof File) {
    formData.append("image", normalizedPayload.image);
  }

  return formData;
};

export const getProducts = async (params = {}) => {
  const response = await apiClient.get(PRODUCT_ROUTE, { params });
  return response.data;
};

export const getProductById = async (id) => {
  const response = await apiClient.get(`${PRODUCT_ROUTE}/${id}`);
  return response.data;
};

export const createProduct = async (payload) => {
  const normalizedPayload = normalizeProductPayload(payload);
  const hasImageFile = Boolean(normalizedPayload?.image instanceof File);
  const requestPayload = hasImageFile ? buildProductFormData(normalizedPayload) : normalizedPayload;

  const response = await apiClient.post(PRODUCT_ROUTE, requestPayload, {
    headers: hasImageFile ? { "Content-Type": "multipart/form-data" } : undefined,
  });
  return response.data;
};

export const updateProduct = async (id, payload) => {
  const normalizedPayload = normalizeProductPayload(payload);
  const hasImageFile = Boolean(normalizedPayload?.image instanceof File);
  const requestPayload = hasImageFile ? buildProductFormData(normalizedPayload) : normalizedPayload;

  const response = await apiClient.put(`${PRODUCT_ROUTE}/${id}`, requestPayload, {
    headers: hasImageFile ? { "Content-Type": "multipart/form-data" } : undefined,
  });
  return response.data;
};

export const patchProduct = async (id, payload) => {
  const response = await apiClient.patch(`${PRODUCT_ROUTE}/${id}`, payload);
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await apiClient.delete(`${PRODUCT_ROUTE}/${id}`);
  return response.data;
};

export const getProductStock = async (id) => {
  const response = await apiClient.get(`${PRODUCT_ROUTE}/${id}/stock`);
  return response.data;
};

export const productApi = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  patchProduct,
  deleteProduct,
  getProductStock,
};

export default productApi;
