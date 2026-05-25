import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../services/categoryApi";
import { API_BASE_URL } from "../../services/apiClient";

export const SET_CATEGORIES = "SET_CATEGORIES";
export const SET_CATEGORIES_LOADING = "SET_CATEGORIES_LOADING";
export const SET_CATEGORIES_ERROR = "SET_CATEGORIES_ERROR";
export const CLEAR_CATEGORIES_ERROR = "CLEAR_CATEGORIES_ERROR";
export const SET_CATEGORIES_CREATING = "SET_CATEGORIES_CREATING";
export const SET_CATEGORIES_CREATE_ERROR = "SET_CATEGORIES_CREATE_ERROR";
export const CLEAR_CATEGORIES_CREATE_ERROR = "CLEAR_CATEGORIES_CREATE_ERROR";
export const SET_CATEGORIES_UPDATING = "SET_CATEGORIES_UPDATING";
export const SET_CATEGORIES_UPDATE_ERROR = "SET_CATEGORIES_UPDATE_ERROR";
export const CLEAR_CATEGORIES_UPDATE_ERROR = "CLEAR_CATEGORIES_UPDATE_ERROR";
export const SET_CATEGORIES_DELETING = "SET_CATEGORIES_DELETING";
export const SET_CATEGORIES_DELETE_ERROR = "SET_CATEGORIES_DELETE_ERROR";
export const CLEAR_CATEGORIES_DELETE_ERROR = "CLEAR_CATEGORIES_DELETE_ERROR";

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

export const setCategories = (items) => ({ type: SET_CATEGORIES, payload: items });
export const setCategoriesLoading = (loading) => ({ type: SET_CATEGORIES_LOADING, payload: loading });
export const setCategoriesError = (error) => ({ type: SET_CATEGORIES_ERROR, payload: error });
export const clearCategoriesError = () => ({ type: CLEAR_CATEGORIES_ERROR });
export const setCategoriesCreating = (creating) => ({ type: SET_CATEGORIES_CREATING, payload: creating });
export const setCategoriesCreateError = (error) => ({ type: SET_CATEGORIES_CREATE_ERROR, payload: error });
export const clearCategoriesCreateError = () => ({ type: CLEAR_CATEGORIES_CREATE_ERROR });
export const setCategoriesUpdating = (updating) => ({ type: SET_CATEGORIES_UPDATING, payload: updating });
export const setCategoriesUpdateError = (error) => ({ type: SET_CATEGORIES_UPDATE_ERROR, payload: error });
export const clearCategoriesUpdateError = () => ({ type: CLEAR_CATEGORIES_UPDATE_ERROR });
export const setCategoriesDeleting = (deleting) => ({ type: SET_CATEGORIES_DELETING, payload: deleting });
export const setCategoriesDeleteError = (error) => ({ type: SET_CATEGORIES_DELETE_ERROR, payload: error });
export const clearCategoriesDeleteError = () => ({ type: CLEAR_CATEGORIES_DELETE_ERROR });

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

const formatCategory = (category, index) => {
  const imageUrl = resolveImageUrl(category?.imageUrl || category?.image || "");
  return {
    id: category?.id ?? category?._id ?? `${index + 1}`,
    imageUrl,
    avatar: imageUrl || category?.name?.charAt(0).toUpperCase() || "C",
    name: category?.name || "-",
    description: category?.description || "",
    tvaRate: Number(category?.tvaRate ?? 0.19),
    isActive: category?.isActive !== false,
    createdAt: category?.createdAt ? new Date(category.createdAt).toLocaleString("fr-FR") : "-",
    updatedAt: category?.updatedAt ? new Date(category.updatedAt).toLocaleString("fr-FR") : "-",
  };
};

export const fetchCategoriesThunk = () => {
  return async (dispatch) => {
    dispatch(setCategoriesLoading(true));
    dispatch(clearCategoriesError());

    try {
      const data = await fetchCategories();
      const items = Array.isArray(data) ? data.map((category, index) => formatCategory(category, index)) : [];
      dispatch(setCategories(items));
      dispatch(setCategoriesLoading(false));

      return { success: true, items };
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Erreur lors du chargement des catégories.";
      dispatch(setCategoriesError(errorMessage));
      dispatch(setCategoriesLoading(false));

      return { success: false, error: errorMessage };
    }
  };
};

export const createCategoryThunk = (payload) => {
  return async (dispatch) => {
    dispatch(setCategoriesCreating(true));
    dispatch(clearCategoriesCreateError());

    try {
      const data = await createCategory({
        name: payload?.name?.trim() || "",
        description: payload?.description?.trim() || "",
        tvaRate: Number(payload?.tvaRate) || 0.19,
        isActive: payload?.isActive !== false,
        image: payload?.image instanceof File ? payload.image : null,
      });

      await dispatch(fetchCategoriesThunk());
      dispatch(setCategoriesCreating(false));

      return { success: true, data };
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Erreur lors de la création de la catégorie.";
      dispatch(setCategoriesCreateError(errorMessage));
      dispatch(setCategoriesCreating(false));

      return { success: false, error: errorMessage };
    }
  };
};

export const updateCategoryThunk = (categoryId, payload) => {
  return async (dispatch) => {
    dispatch(setCategoriesUpdating(true));
    dispatch(clearCategoriesUpdateError());

    try {
      const data = await updateCategory(categoryId, {
        name: payload?.name?.trim(),
        description: payload?.description?.trim(),
        tvaRate: payload?.tvaRate !== undefined ? Number(payload.tvaRate) : undefined,
        isActive: payload?.isActive,
        image: payload?.image instanceof File ? payload.image : null,
      });

      await dispatch(fetchCategoriesThunk());
      dispatch(setCategoriesUpdating(false));

      return { success: true, data };
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Erreur lors de la mise à jour de la catégorie.";
      dispatch(setCategoriesUpdateError(errorMessage));
      dispatch(setCategoriesUpdating(false));

      return { success: false, error: errorMessage };
    }
  };
};

export const deleteCategoryThunk = (categoryId) => {
  return async (dispatch) => {
    dispatch(setCategoriesDeleting(true));
    dispatch(clearCategoriesDeleteError());

    try {
      await deleteCategory(categoryId);
      await dispatch(fetchCategoriesThunk());
      dispatch(setCategoriesDeleting(false));

      return { success: true };
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Erreur lors de la suppression de la catégorie.";
      dispatch(setCategoriesDeleteError(errorMessage));
      dispatch(setCategoriesDeleting(false));

      return { success: false, error: errorMessage };
    }
  };
};

export default function CategoriesReducer(state = initialState, action) {
  switch (action.type) {
    case SET_CATEGORIES:
      return { ...state, items: action.payload };

    case SET_CATEGORIES_LOADING:
      return { ...state, loading: action.payload };

    case SET_CATEGORIES_ERROR:
      return { ...state, error: action.payload };

    case CLEAR_CATEGORIES_ERROR:
      return { ...state, error: null };

    case SET_CATEGORIES_CREATING:
      return { ...state, creating: action.payload };

    case SET_CATEGORIES_CREATE_ERROR:
      return { ...state, createError: action.payload };

    case CLEAR_CATEGORIES_CREATE_ERROR:
      return { ...state, createError: null };

    case SET_CATEGORIES_UPDATING:
      return { ...state, updating: action.payload };

    case SET_CATEGORIES_UPDATE_ERROR:
      return { ...state, updateError: action.payload };

    case CLEAR_CATEGORIES_UPDATE_ERROR:
      return { ...state, updateError: null };

    case SET_CATEGORIES_DELETING:
      return { ...state, deleting: action.payload };

    case SET_CATEGORIES_DELETE_ERROR:
      return { ...state, deleteError: action.payload };

    case CLEAR_CATEGORIES_DELETE_ERROR:
      return { ...state, deleteError: null };

    default:
      return state;
  }
}
