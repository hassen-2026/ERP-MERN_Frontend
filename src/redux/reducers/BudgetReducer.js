import {
  getAllBudgets,
  getMyBudgets,
  getCurrentMonthBudgets,
  getBudgetById,
  createBudget,
  updateBudget,
  approveBudget,
  deleteBudget,
  getBudgetAnalytics,
} from "../../services/budgetApi";

// ============ ACTION TYPES ============
export const SET_BUDGETS = "SET_BUDGETS";
export const SET_BUDGETS_LOADING = "SET_BUDGETS_LOADING";
export const SET_BUDGETS_ERROR = "SET_BUDGETS_ERROR";
export const CLEAR_BUDGETS_ERROR = "CLEAR_BUDGETS_ERROR";

export const SET_MY_BUDGETS = "SET_MY_BUDGETS";
export const SET_MY_BUDGETS_LOADING = "SET_MY_BUDGETS_LOADING";
export const SET_MY_BUDGETS_ERROR = "SET_MY_BUDGETS_ERROR";
export const CLEAR_MY_BUDGETS_ERROR = "CLEAR_MY_BUDGETS_ERROR";

export const SET_CURRENT_MONTH_BUDGETS = "SET_CURRENT_MONTH_BUDGETS";
export const SET_CURRENT_MONTH_BUDGETS_LOADING = "SET_CURRENT_MONTH_BUDGETS_LOADING";
export const SET_CURRENT_MONTH_BUDGETS_ERROR = "SET_CURRENT_MONTH_BUDGETS_ERROR";

export const SET_BUDGET_DETAIL = "SET_BUDGET_DETAIL";
export const SET_BUDGET_DETAIL_LOADING = "SET_BUDGET_DETAIL_LOADING";
export const SET_BUDGET_DETAIL_ERROR = "SET_BUDGET_DETAIL_ERROR";

export const SET_BUDGET_ANALYTICS = "SET_BUDGET_ANALYTICS";
export const SET_BUDGET_ANALYTICS_LOADING = "SET_BUDGET_ANALYTICS_LOADING";
export const SET_BUDGET_ANALYTICS_ERROR = "SET_BUDGET_ANALYTICS_ERROR";

export const SET_BUDGET_CREATING = "SET_BUDGET_CREATING";
export const SET_BUDGET_CREATE_ERROR = "SET_BUDGET_CREATE_ERROR";
export const CLEAR_BUDGET_CREATE_ERROR = "CLEAR_BUDGET_CREATE_ERROR";

export const SET_BUDGET_UPDATING = "SET_BUDGET_UPDATING";
export const SET_BUDGET_UPDATE_ERROR = "SET_BUDGET_UPDATE_ERROR";
export const CLEAR_BUDGET_UPDATE_ERROR = "CLEAR_BUDGET_UPDATE_ERROR";

export const SET_BUDGET_APPROVING = "SET_BUDGET_APPROVING";
export const SET_BUDGET_APPROVE_ERROR = "SET_BUDGET_APPROVE_ERROR";
export const CLEAR_BUDGET_APPROVE_ERROR = "CLEAR_BUDGET_APPROVE_ERROR";

export const SET_BUDGET_DELETING = "SET_BUDGET_DELETING";
export const SET_BUDGET_DELETE_ERROR = "SET_BUDGET_DELETE_ERROR";
export const CLEAR_BUDGET_DELETE_ERROR = "CLEAR_BUDGET_DELETE_ERROR";

export const UPDATE_BUDGET_SPENT = "UPDATE_BUDGET_SPENT";

// ============ INITIAL STATE ============
export const initialState = {
  // All budgets (admin view)
  allBudgets: [],
  allBudgetsLoading: false,
  allBudgetsError: null,

  // User's budgets (filtered by role)
  myBudgets: [],
  myBudgetsLoading: false,
  myBudgetsError: null,

  // Current month budgets
  currentMonthBudgets: [],
  currentMonthBudgetsLoading: false,
  currentMonthBudgetsError: null,

  // Selected budget detail
  selectedBudget: null,
  selectedBudgetLoading: false,
  selectedBudgetError: null,

  // Analytics
  analytics: [],
  analyticsLoading: false,
  analyticsError: null,

  // Operations
  creating: false,
  createError: null,
  updating: false,
  updateError: null,
  approving: false,
  approveError: null,
  deleting: false,
  deleteError: null,
};

// ============ ACTION CREATORS ============
export const setBudgets = (budgets) => ({ type: SET_BUDGETS, payload: budgets });
export const setBudgetsLoading = (loading) => ({ type: SET_BUDGETS_LOADING, payload: loading });
export const setBudgetsError = (error) => ({ type: SET_BUDGETS_ERROR, payload: error });
export const clearBudgetsError = () => ({ type: CLEAR_BUDGETS_ERROR });

export const setMyBudgets = (budgets) => ({ type: SET_MY_BUDGETS, payload: budgets });
export const setMyBudgetsLoading = (loading) => ({ type: SET_MY_BUDGETS_LOADING, payload: loading });
export const setMyBudgetsError = (error) => ({ type: SET_MY_BUDGETS_ERROR, payload: error });
export const clearMyBudgetsError = () => ({ type: CLEAR_MY_BUDGETS_ERROR });

export const setCurrentMonthBudgets = (budgets) => ({ type: SET_CURRENT_MONTH_BUDGETS, payload: budgets });
export const setCurrentMonthBudgetsLoading = (loading) => ({ type: SET_CURRENT_MONTH_BUDGETS_LOADING, payload: loading });
export const setCurrentMonthBudgetsError = (error) => ({ type: SET_CURRENT_MONTH_BUDGETS_ERROR, payload: error });

export const setBudgetDetail = (budget) => ({ type: SET_BUDGET_DETAIL, payload: budget });
export const setBudgetDetailLoading = (loading) => ({ type: SET_BUDGET_DETAIL_LOADING, payload: loading });
export const setBudgetDetailError = (error) => ({ type: SET_BUDGET_DETAIL_ERROR, payload: error });

export const setBudgetAnalytics = (analytics) => ({ type: SET_BUDGET_ANALYTICS, payload: analytics });
export const setBudgetAnalyticsLoading = (loading) => ({ type: SET_BUDGET_ANALYTICS_LOADING, payload: loading });
export const setBudgetAnalyticsError = (error) => ({ type: SET_BUDGET_ANALYTICS_ERROR, payload: error });

export const setBudgetCreating = (creating) => ({ type: SET_BUDGET_CREATING, payload: creating });
export const setBudgetCreateError = (error) => ({ type: SET_BUDGET_CREATE_ERROR, payload: error });
export const clearBudgetCreateError = () => ({ type: CLEAR_BUDGET_CREATE_ERROR });

export const setBudgetUpdating = (updating) => ({ type: SET_BUDGET_UPDATING, payload: updating });
export const setBudgetUpdateError = (error) => ({ type: SET_BUDGET_UPDATE_ERROR, payload: error });
export const clearBudgetUpdateError = () => ({ type: CLEAR_BUDGET_UPDATE_ERROR });

export const setBudgetApproving = (approving) => ({ type: SET_BUDGET_APPROVING, payload: approving });
export const setBudgetApproveError = (error) => ({ type: SET_BUDGET_APPROVE_ERROR, payload: error });
export const clearBudgetApproveError = () => ({ type: CLEAR_BUDGET_APPROVE_ERROR });

export const setBudgetDeleting = (deleting) => ({ type: SET_BUDGET_DELETING, payload: deleting });
export const setBudgetDeleteError = (error) => ({ type: SET_BUDGET_DELETE_ERROR, payload: error });
export const clearBudgetDeleteError = () => ({ type: CLEAR_BUDGET_DELETE_ERROR });

export const updateBudgetSpent = (budgetId, amount) => ({
  type: UPDATE_BUDGET_SPENT,
  payload: { budgetId, amount },
});

// ============ ASYNC THUNKS ============

/**
 * Charge tous les budgets (admin)
 */
export const fetchAllBudgets = (params = {}) => async (dispatch) => {
  try {
    dispatch(setBudgetsLoading(true));
    dispatch(clearBudgetsError());
    const response = await getAllBudgets(params);
    // Response structure: { data: budgets, pagination: {...} }
    const budgets = response.data || [];
    dispatch(setBudgets(budgets));
    return budgets;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || "Erreur lors du chargement";
    dispatch(setBudgetsError(errorMessage));
    throw error;
  } finally {
    dispatch(setBudgetsLoading(false));
  }
};

/**
 * Charge les budgets de l'utilisateur
 */
export const fetchMyBudgets = (params = {}) => async (dispatch) => {
  try {
    dispatch(setMyBudgetsLoading(true));
    dispatch(clearMyBudgetsError());
    const response = await getMyBudgets(params);
    // Response is array of budgets directly
    const budgets = Array.isArray(response) ? response : [];
    dispatch(setMyBudgets(budgets));
    return budgets;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || "Erreur lors du chargement";
    dispatch(setMyBudgetsError(errorMessage));
    throw error;
  } finally {
    dispatch(setMyBudgetsLoading(false));
  }
};

/**
 * Charge les budgets du mois courant
 */
export const fetchCurrentMonthBudgets = () => async (dispatch) => {
  try {
    dispatch(setCurrentMonthBudgetsLoading(true));
    const response = await getCurrentMonthBudgets();
    // Response is array of budgets directly
    const budgets = Array.isArray(response) ? response : [];
    dispatch(setCurrentMonthBudgets(budgets));
    return budgets;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || "Erreur lors du chargement";
    dispatch(setCurrentMonthBudgetsError(errorMessage));
    throw error;
  }
};

/**
 * Charge les détails d'un budget
 */
export const fetchBudgetDetail = (budgetId) => async (dispatch) => {
  try {
    dispatch(setBudgetDetailLoading(true));
    const response = await getBudgetById(budgetId);
    // Response is budget object directly
    const budget = response || null;
    dispatch(setBudgetDetail(budget));
    return budget;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || "Erreur lors du chargement";
    dispatch(setBudgetDetailError(errorMessage));
    throw error;
  }
};

/**
 * Charge les analytics budgétaires
 */
export const fetchBudgetAnalytics = (year = null) => async (dispatch) => {
  try {
    dispatch(setBudgetAnalyticsLoading(true));
    const response = await getBudgetAnalytics(year);
    // Response is array of analytics directly
    const analytics = Array.isArray(response) ? response : [];
    dispatch(setBudgetAnalytics(analytics));
    return analytics;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || "Erreur lors du chargement";
    dispatch(setBudgetAnalyticsError(errorMessage));
    throw error;
  }
};

/**
 * Crée un nouveau budget
 */
export const createNewBudget = (budgetData) => async (dispatch) => {
  try {
    dispatch(setBudgetCreating(true));
    dispatch(clearBudgetCreateError());
    const response = await createBudget(budgetData);
    // Response is budget object directly
    const newBudget = response || null;
    dispatch(setBudgetCreating(false));
    return newBudget;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || "Erreur de création";
    dispatch(setBudgetCreateError(errorMessage));
    dispatch(setBudgetCreating(false));
    throw error;
  }
};

/**
 * Met à jour un budget
 */
export const updateExistingBudget = (budgetId, budgetData) => async (dispatch) => {
  try {
    dispatch(setBudgetUpdating(true));
    dispatch(clearBudgetUpdateError());
    const response = await updateBudget(budgetId, budgetData);
    // Response is budget object directly
    const updatedBudget = response || null;
    dispatch(setBudgetUpdating(false));
    return updatedBudget;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || "Erreur de mise à jour";
    dispatch(setBudgetUpdateError(errorMessage));
    dispatch(setBudgetUpdating(false));
    throw error;
  }
};

/**
 * Approuve un budget
 */
export const approveBudgetAction = (budgetId) => async (dispatch) => {
  try {
    dispatch(setBudgetApproving(true));
    dispatch(clearBudgetApproveError());
    const response = await approveBudget(budgetId);
    // Response is budget object directly
    const approvedBudget = response || null;
    dispatch(setBudgetApproving(false));
    return approvedBudget;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || "Erreur d'approbation";
    dispatch(setBudgetApproveError(errorMessage));
    dispatch(setBudgetApproving(false));
    throw error;
  }
};

/**
 * Supprime un budget
 */
export const deleteBudgetAction = (budgetId) => async (dispatch) => {
  try {
    dispatch(setBudgetDeleting(true));
    dispatch(clearBudgetDeleteError());
    await deleteBudget(budgetId);
    dispatch(setBudgetDeleting(false));
    return true;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || "Erreur de suppression";
    dispatch(setBudgetDeleteError(errorMessage));
    dispatch(setBudgetDeleting(false));
    throw error;
  }
};

// ============ REDUCER ============
const BudgetReducer = (state = initialState, action) => {
  switch (action.type) {
    // All Budgets
    case SET_BUDGETS:
      return { ...state, allBudgets: action.payload };
    case SET_BUDGETS_LOADING:
      return { ...state, allBudgetsLoading: action.payload };
    case SET_BUDGETS_ERROR:
      return { ...state, allBudgetsError: action.payload };
    case CLEAR_BUDGETS_ERROR:
      return { ...state, allBudgetsError: null };

    // My Budgets
    case SET_MY_BUDGETS:
      return { ...state, myBudgets: action.payload };
    case SET_MY_BUDGETS_LOADING:
      return { ...state, myBudgetsLoading: action.payload };
    case SET_MY_BUDGETS_ERROR:
      return { ...state, myBudgetsError: action.payload };
    case CLEAR_MY_BUDGETS_ERROR:
      return { ...state, myBudgetsError: null };

    // Current Month Budgets
    case SET_CURRENT_MONTH_BUDGETS:
      return { ...state, currentMonthBudgets: action.payload };
    case SET_CURRENT_MONTH_BUDGETS_LOADING:
      return { ...state, currentMonthBudgetsLoading: action.payload };
    case SET_CURRENT_MONTH_BUDGETS_ERROR:
      return { ...state, currentMonthBudgetsError: action.payload };

    // Budget Detail
    case SET_BUDGET_DETAIL:
      return { ...state, selectedBudget: action.payload };
    case SET_BUDGET_DETAIL_LOADING:
      return { ...state, selectedBudgetLoading: action.payload };
    case SET_BUDGET_DETAIL_ERROR:
      return { ...state, selectedBudgetError: action.payload };

    // Analytics
    case SET_BUDGET_ANALYTICS:
      return { ...state, analytics: action.payload };
    case SET_BUDGET_ANALYTICS_LOADING:
      return { ...state, analyticsLoading: action.payload };
    case SET_BUDGET_ANALYTICS_ERROR:
      return { ...state, analyticsError: action.payload };

    // Operations
    case SET_BUDGET_CREATING:
      return { ...state, creating: action.payload };
    case SET_BUDGET_CREATE_ERROR:
      return { ...state, createError: action.payload };
    case CLEAR_BUDGET_CREATE_ERROR:
      return { ...state, createError: null };

    case SET_BUDGET_UPDATING:
      return { ...state, updating: action.payload };
    case SET_BUDGET_UPDATE_ERROR:
      return { ...state, updateError: action.payload };
    case CLEAR_BUDGET_UPDATE_ERROR:
      return { ...state, updateError: null };

    case SET_BUDGET_APPROVING:
      return { ...state, approving: action.payload };
    case SET_BUDGET_APPROVE_ERROR:
      return { ...state, approveError: action.payload };
    case CLEAR_BUDGET_APPROVE_ERROR:
      return { ...state, approveError: null };

    case SET_BUDGET_DELETING:
      return { ...state, deleting: action.payload };
    case SET_BUDGET_DELETE_ERROR:
      return { ...state, deleteError: action.payload };
    case CLEAR_BUDGET_DELETE_ERROR:
      return { ...state, deleteError: null };

    // Update spent amount
    case UPDATE_BUDGET_SPENT:
      return {
        ...state,
        myBudgets: state.myBudgets.map((b) =>
          b._id === action.payload.budgetId
            ? { ...b, spent: (b.spent || 0) + action.payload.amount }
            : b
        ),
        currentMonthBudgets: state.currentMonthBudgets.map((b) =>
          b._id === action.payload.budgetId
            ? { ...b, spent: (b.spent || 0) + action.payload.amount }
            : b
        ),
      };

    default:
      return state;
  }
};

export default BudgetReducer;
