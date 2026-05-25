import apiClient from "./apiClient";

/**
 * Fetch all categories
 */
export const fetchCategories = async () => {
  try {
    const response = await apiClient.get("/categories");
    return response.data || [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

/**
 * Fetch a single category by ID
 */
export const fetchCategoryById = async (categoryId) => {
  try {
    const response = await apiClient.get(`/categories/${categoryId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching category ${categoryId}:`, error);
    throw error;
  }
};

/**
 * Build FormData payload for category (handles image file)
 */
const buildCategoryFormData = (payload) => {
  const formData = new FormData();
  formData.append("name", payload?.name?.trim() || "");
  formData.append("description", payload?.description?.trim() || "");
  formData.append("tvaRate", Number(payload?.tvaRate) || 0.19);
  formData.append("isActive", payload?.isActive !== false);

  if (payload?.image instanceof File) {
    formData.append("image", payload.image);
  }

  return formData;
};

/**
 * Create a new category
 */
export const createCategory = async (payload) => {
  try {
    const hasImage = payload?.image instanceof File;
    const requestPayload = hasImage ? buildCategoryFormData(payload) : {
      name: payload?.name?.trim() || "",
      description: payload?.description?.trim() || "",
      tvaRate: Number(payload?.tvaRate) || 0.19,
      isActive: payload?.isActive !== false,
    };

    const config = hasImage ? { headers: { "Content-Type": "multipart/form-data" } } : {};
    const response = await apiClient.post("/categories", requestPayload, config);
    return response.data;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
};

/**
 * Update a category
 */
export const updateCategory = async (categoryId, payload) => {
  try {
    const hasImage = payload?.image instanceof File;
    const requestPayload = hasImage ? buildCategoryFormData(payload) : {
      name: payload?.name?.trim(),
      description: payload?.description?.trim(),
      tvaRate: payload?.tvaRate !== undefined ? Number(payload.tvaRate) : undefined,
      isActive: payload?.isActive,
    };

    const config = hasImage ? { headers: { "Content-Type": "multipart/form-data" } } : {};
    const response = await apiClient.put(`/categories/${categoryId}`, requestPayload, config);
    return response.data;
  } catch (error) {
    console.error(`Error updating category ${categoryId}:`, error);
    throw error;
  }
};

/**
 * Delete a category
 */
export const deleteCategory = async (categoryId) => {
  try {
    const response = await apiClient.delete(`/categories/${categoryId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting category ${categoryId}:`, error);
    throw error;
  }
};

export default {
  fetchCategories,
  fetchCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
