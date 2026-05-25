import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAllBudgets,
  fetchMyBudgets,
  fetchCurrentMonthBudgets,
  fetchBudgetDetail,
  fetchBudgetAnalytics,
  createNewBudget,
  updateExistingBudget,
  approveBudgetAction,
  deleteBudgetAction,
  clearBudgetsError,
  clearMyBudgetsError,
  clearBudgetCreateError,
  clearBudgetUpdateError,
  clearBudgetApproveError,
  clearBudgetDeleteError,
} from '../reducers/BudgetReducer';

/**
 * Hook pour accéder à tous les budgets (admin)
 */
export const useAllBudgets = () => {
  const dispatch = useDispatch();
  const { allBudgets, allBudgetsLoading, allBudgetsError } = useSelector(
    (state) => state.budgets
  );

  const fetchBudgets = useCallback((params) => dispatch(fetchAllBudgets(params)), [dispatch]);
  const clearError = useCallback(() => dispatch(clearBudgetsError()), [dispatch]);

  return {
    budgets: allBudgets,
    loading: allBudgetsLoading,
    error: allBudgetsError,
    fetchBudgets,
    clearError,
  };
};

/**
 * Hook pour accéder aux budgets de l'utilisateur
 */
export const useMyBudgets = () => {
  const dispatch = useDispatch();
  const { myBudgets, myBudgetsLoading, myBudgetsError } = useSelector(
    (state) => state.budgets
  );

  const fetchBudgets = useCallback((params) => dispatch(fetchMyBudgets(params)), [dispatch]);
  const clearError = useCallback(() => dispatch(clearMyBudgetsError()), [dispatch]);

  return {
    budgets: myBudgets,
    loading: myBudgetsLoading,
    error: myBudgetsError,
    fetchBudgets,
    clearError,
  };
};

/**
 * Hook pour accéder aux budgets du mois courant
 */
export const useCurrentMonthBudgets = () => {
  const dispatch = useDispatch();
  const { currentMonthBudgets, currentMonthBudgetsLoading, currentMonthBudgetsError } =
    useSelector((state) => state.budgets);

  const fetchBudgets = useCallback(() => dispatch(fetchCurrentMonthBudgets()), [dispatch]);

  return {
    budgets: currentMonthBudgets,
    loading: currentMonthBudgetsLoading,
    error: currentMonthBudgetsError,
    fetchBudgets,
  };
};

/**
 * Hook pour accéder au détail d'un budget
 */
export const useBudgetDetail = () => {
  const dispatch = useDispatch();
  const { selectedBudget, selectedBudgetLoading, selectedBudgetError } = useSelector(
    (state) => state.budgets
  );

  const fetchBudget = useCallback((budgetId) => dispatch(fetchBudgetDetail(budgetId)), [dispatch]);

  return {
    budget: selectedBudget,
    loading: selectedBudgetLoading,
    error: selectedBudgetError,
    fetchBudget,
  };
};

/**
 * Hook pour accéder aux analytics budgétaires
 */
export const useBudgetAnalytics = () => {
  const dispatch = useDispatch();
  const { analytics, analyticsLoading, analyticsError } = useSelector(
    (state) => state.budgets
  );

  const fetchAnalytics = useCallback((year) => dispatch(fetchBudgetAnalytics(year)), [dispatch]);

  return {
    analytics,
    loading: analyticsLoading,
    error: analyticsError,
    fetchAnalytics,
  };
};

/**
 * Hook pour les opérations sur les budgets
 */
export const useBudgetOperations = () => {
  const dispatch = useDispatch();
  const { creating, createError, updating, updateError, approving, approveError, deleting, deleteError } =
    useSelector((state) => state.budgets);

  const createBudget = useCallback((data) => dispatch(createNewBudget(data)), [dispatch]);
  const clearCreateError = useCallback(() => dispatch(clearBudgetCreateError()), [dispatch]);
  const updateBudget = useCallback((id, data) => dispatch(updateExistingBudget(id, data)), [dispatch]);
  const clearUpdateError = useCallback(() => dispatch(clearBudgetUpdateError()), [dispatch]);
  const approveBudget = useCallback((id) => dispatch(approveBudgetAction(id)), [dispatch]);
  const clearApproveError = useCallback(() => dispatch(clearBudgetApproveError()), [dispatch]);
  const deleteBudget = useCallback((id) => dispatch(deleteBudgetAction(id)), [dispatch]);
  const clearDeleteError = useCallback(() => dispatch(clearBudgetDeleteError()), [dispatch]);

  return {
    // Create
    creating,
    createError,
    createBudget,
    clearCreateError,

    // Update
    updating,
    updateError,
    updateBudget,
    clearUpdateError,

    // Approve
    approving,
    approveError,
    approveBudget,
    clearApproveError,

    // Delete
    deleting,
    deleteError,
    deleteBudget,
    clearDeleteError,
  };
};

/**
 * Hook pour accéder au budget d'achats du mois courant
 */
export const useProcurementBudget = () => {
  const dispatch = useDispatch();
  const currentMonthBudgets = useSelector((state) => state.budgets.currentMonthBudgets);
  const fetchBudgets = useCallback(() => dispatch(fetchCurrentMonthBudgets()), [dispatch]);

  const procurementBudget = currentMonthBudgets[0] || null;

  return {
    budget: procurementBudget,
    fetchBudgets,
  };
};

export default {
  useAllBudgets,
  useMyBudgets,
  useCurrentMonthBudgets,
  useBudgetDetail,
  useBudgetAnalytics,
  useBudgetOperations,
  useProcurementBudget,
};
