import apiClient from "./apiClient";

const BUDGET_ROUTE = "/budgets";

// ============ GET REQUESTS ============

/**
 * Récupère tous les budgets (admin uniquement)
 */
export const getAllBudgets = async (params = {}) => {
  try {
    const response = await apiClient.get(BUDGET_ROUTE, { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching all budgets:", error);
    throw error;
  }
};

/**
 * Récupère les budgets accessibles à l'utilisateur selon son rôle
 */
export const getMyBudgets = async (params = {}) => {
  try {
    const response = await apiClient.get(`${BUDGET_ROUTE}/my`, { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching my budgets:", error);
    throw error;
  }
};

/**
 * Récupère les budgets du mois courant
 */
export const getCurrentMonthBudgets = async () => {
  try {
    const response = await apiClient.get(`${BUDGET_ROUTE}/current-month`);
    return response.data;
  } catch (error) {
    console.error("Error fetching current month budgets:", error);
    throw error;
  }
};

/**
 * Récupère un budget par ID
 */
export const getBudgetById = async (id) => {
  try {
    const response = await apiClient.get(`${BUDGET_ROUTE}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching budget:", error);
    throw error;
  }
};

/**
 * Récupère les analytics budgétaires
 */
export const getBudgetAnalytics = async (year = null) => {
  try {
    const params = year ? { year } : {};
    const response = await apiClient.get(`${BUDGET_ROUTE}/analytics/summary`, { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching budget analytics:", error);
    throw error;
  }
};

// ============ POST REQUESTS ============

/**
 * Crée un nouveau budget
 */
export const createBudget = async (budgetData) => {
  try {
    const response = await apiClient.post(BUDGET_ROUTE, budgetData);
    return response.data;
  } catch (error) {
    console.error("Error creating budget:", error);
    throw error;
  }
};

/**
 * Approuve un budget
 */
export const approveBudget = async (budgetId) => {
  try {
    const response = await apiClient.post(`${BUDGET_ROUTE}/${budgetId}/approve`);
    return response.data;
  } catch (error) {
    console.error("Error approving budget:", error);
    throw error;
  }
};

/**
 * Met à jour le montant dépensé d'un budget
 * (appelé automatiquement lors d'un achat)
 */
export const updateBudgetSpent = async (budgetId, amount, operation = "add") => {
  try {
    const response = await apiClient.post(`${BUDGET_ROUTE}/${budgetId}/update-spent`, {
      amount,
      operation,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating budget spent:", error);
    throw error;
  }
};

// ============ PUT REQUESTS ============

/**
 * Met à jour un budget
 */
export const updateBudget = async (budgetId, budgetData) => {
  try {
    const response = await apiClient.put(`${BUDGET_ROUTE}/${budgetId}`, budgetData);
    return response.data;
  } catch (error) {
    console.error("Error updating budget:", error);
    throw error;
  }
};

// ============ DELETE REQUESTS ============

/**
 * Supprime un budget
 */
export const deleteBudget = async (budgetId) => {
  try {
    const response = await apiClient.delete(`${BUDGET_ROUTE}/${budgetId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting budget:", error);
    throw error;
  }
};

// ============ HELPER FUNCTIONS ============

/**
 * Récupère le budget d'achats du mois courant
 */
export const getProcurementBudget = async () => {
  try {
    const response = await apiClient.get(`${BUDGET_ROUTE}/my`, {
    });
    const budgets = response.data?.data || [];
    return budgets.length > 0 ? budgets[0] : null;
  } catch (error) {
    console.error("Error fetching procurement budget:", error);
    return null;
  }
};

/**
 * Formate les informations d'un budget pour affichage
 */
export const formatBudgetInfo = (budget) => {
  if (!budget) return null;

  return {
    ...budget,
    percentageUsed: budget.percentageUsed || 0,
    available: budget.available || 0,
    remaining: (budget.totalBudget - budget.spent - budget.reserved) || 0,
    warningText: budget.isExceeded
      ? "Budget dépassé"
      : budget.isWarning
      ? "Attention : Budget presque épuisé"
      : "Budget normal",
  };
};

export const budgetApi = {
  getAllBudgets,
  getMyBudgets,
  getCurrentMonthBudgets,
  getBudgetById,
  getBudgetAnalytics,
  createBudget,
  approveBudget,
  updateBudgetSpent,
  updateBudget,
  deleteBudget,
  getProcurementBudget,
  formatBudgetInfo,
};

export default budgetApi;
