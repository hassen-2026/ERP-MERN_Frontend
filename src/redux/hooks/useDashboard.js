import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSalesDashboardData,
  fetchSalesChartData,
  fetchSalesCategoryData,
  fetchSalesProductData,
  fetchDevisFunnelData,
  fetchDevisConversionData,
  fetchProcurementDashboardData,
  fetchProcurementChartData,
  clearSalesDashboardError,
  clearProcurementDashboardError,
} from "../reducers/DashboardReducer";

export const useSalesDashboard = () => {
  const dispatch = useDispatch();
  const dashboardData = useSelector((state) => state.dashboards.salesDashboardData);
  const loading = useSelector((state) => state.dashboards.salesDashboardLoading);
  const error = useSelector((state) => state.dashboards.salesDashboardError);
  const chartData = useSelector((state) => state.dashboards.salesChartData);
  const chartLoading = useSelector((state) => state.dashboards.salesChartLoading);
  const chartError = useSelector((state) => state.dashboards.salesChartError);
  const salesCategoryData = useSelector((state) => state.dashboards.salesCategoryData);
  const salesCategoryLoading = useSelector((state) => state.dashboards.salesCategoryLoading);
  const salesCategoryError = useSelector((state) => state.dashboards.salesCategoryError);
  const salesProductData = useSelector((state) => state.dashboards.salesProductData);
  const salesProductLoading = useSelector((state) => state.dashboards.salesProductLoading);
  const salesProductError = useSelector((state) => state.dashboards.salesProductError);
  const devisFunnelData = useSelector((state) => state.dashboards.devisFunnelData);
  const devisFunnelLoading = useSelector((state) => state.dashboards.devisFunnelLoading);
  const devisFunnelError = useSelector((state) => state.dashboards.devisFunnelError);
  const devisConversionData = useSelector((state) => state.dashboards.devisConversionData);
  const devisConversionLoading = useSelector((state) => state.dashboards.devisConversionLoading);
  const devisConversionError = useSelector((state) => state.dashboards.devisConversionError);
  const chartPeriod = useSelector((state) => state.dashboards.salesChartPeriod);

  const fetchData = useCallback(() => dispatch(fetchSalesDashboardData()), [dispatch]);
  const fetchCharts = useCallback((period) => dispatch(fetchSalesChartData(period)), [dispatch]);
  const fetchCategories = useCallback(() => dispatch(fetchSalesCategoryData()), [dispatch]);
  const fetchProducts = useCallback(() => dispatch(fetchSalesProductData()), [dispatch]);
  const fetchDevisFunnel = useCallback((period) => dispatch(fetchDevisFunnelData(period)), [dispatch]);
  const fetchDevisConversion = useCallback((period) => dispatch(fetchDevisConversionData(period)), [dispatch]);
  const clearError = useCallback(() => dispatch(clearSalesDashboardError()), [dispatch]);

  return {
    dashboardData,
    loading,
    error,
    chartData,
    chartLoading,
    chartError,
    salesCategoryData,
    salesCategoryLoading,
    salesCategoryError,
    salesProductData,
    salesProductLoading,
    salesProductError,
    devisFunnelData,
    devisFunnelLoading,
    devisFunnelError,
    devisConversionData,
    devisConversionLoading,
    devisConversionError,
    chartPeriod,
    fetchData,
    fetchCharts,
    fetchCategories,
    fetchProducts,
    fetchDevisFunnel,
    fetchDevisConversion,
    clearError,
  };
};

export const useProcurementDashboard = () => {
  const dispatch = useDispatch();
  const dashboardData = useSelector((state) => state.dashboards.procurementDashboardData);
  const loading = useSelector((state) => state.dashboards.procurementDashboardLoading);
  const error = useSelector((state) => state.dashboards.procurementDashboardError);
  const chartData = useSelector((state) => state.dashboards.procurementChartData);
  const chartLoading = useSelector((state) => state.dashboards.procurementChartLoading);
  const chartError = useSelector((state) => state.dashboards.procurementChartError);
  const chartPeriod = useSelector((state) => state.dashboards.procurementChartPeriod);

  const fetchData = useCallback(() => dispatch(fetchProcurementDashboardData()), [dispatch]);
  const fetchCharts = useCallback((period) => dispatch(fetchProcurementChartData(period)), [dispatch]);
  const clearError = useCallback(() => dispatch(clearProcurementDashboardError()), [dispatch]);

  return {
    dashboardData,
    loading,
    error,
    chartData,
    chartLoading,
    chartError,
    chartPeriod,
    fetchData,
    fetchCharts,
    clearError,
  };
};
