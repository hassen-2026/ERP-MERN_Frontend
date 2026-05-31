import {
  getSalesManagerDashboardData,
  getSalesManagerChartData,
  getProcurementDashboardData,
  getProcurementChartData,
  getSalesCategoryData,
  getSalesProductData,
  getDevisFunnelData,
  getDevisConversionData,
  getLogisticsDashboardData,
  getLogisticsChartData,
} from "../../services/dashboardApi";

// ============ ACTION TYPES ============
export const SET_SALES_DASHBOARD_DATA = "SET_SALES_DASHBOARD_DATA";
export const SET_SALES_DASHBOARD_LOADING = "SET_SALES_DASHBOARD_LOADING";
export const SET_SALES_DASHBOARD_ERROR = "SET_SALES_DASHBOARD_ERROR";
export const CLEAR_SALES_DASHBOARD_ERROR = "CLEAR_SALES_DASHBOARD_ERROR";

export const SET_SALES_CHART_DATA = "SET_SALES_CHART_DATA";
export const SET_SALES_CHART_LOADING = "SET_SALES_CHART_LOADING";
export const SET_SALES_CHART_ERROR = "SET_SALES_CHART_ERROR";
export const SET_SALES_CATEGORY_DATA = "SET_SALES_CATEGORY_DATA";
export const SET_SALES_CATEGORY_LOADING = "SET_SALES_CATEGORY_LOADING";
export const SET_SALES_CATEGORY_ERROR = "SET_SALES_CATEGORY_ERROR";
export const SET_SALES_PRODUCT_DATA = "SET_SALES_PRODUCT_DATA";
export const SET_SALES_PRODUCT_LOADING = "SET_SALES_PRODUCT_LOADING";
export const SET_SALES_PRODUCT_ERROR = "SET_SALES_PRODUCT_ERROR";
export const SET_DEVIS_FUNNEL_DATA = "SET_DEVIS_FUNNEL_DATA";
export const SET_DEVIS_FUNNEL_LOADING = "SET_DEVIS_FUNNEL_LOADING";
export const SET_DEVIS_FUNNEL_ERROR = "SET_DEVIS_FUNNEL_ERROR";
export const SET_DEVIS_CONVERSION_DATA = "SET_DEVIS_CONVERSION_DATA";
export const SET_DEVIS_CONVERSION_LOADING = "SET_DEVIS_CONVERSION_LOADING";
export const SET_DEVIS_CONVERSION_ERROR = "SET_DEVIS_CONVERSION_ERROR";

export const SET_PROCUREMENT_DASHBOARD_DATA = "SET_PROCUREMENT_DASHBOARD_DATA";
export const SET_PROCUREMENT_DASHBOARD_LOADING = "SET_PROCUREMENT_DASHBOARD_LOADING";
export const SET_PROCUREMENT_DASHBOARD_ERROR = "SET_PROCUREMENT_DASHBOARD_ERROR";
export const CLEAR_PROCUREMENT_DASHBOARD_ERROR = "CLEAR_PROCUREMENT_DASHBOARD_ERROR";

export const SET_PROCUREMENT_CHART_DATA = "SET_PROCUREMENT_CHART_DATA";
export const SET_PROCUREMENT_CHART_LOADING = "SET_PROCUREMENT_CHART_LOADING";
export const SET_PROCUREMENT_CHART_ERROR = "SET_PROCUREMENT_CHART_ERROR";

export const SET_LOGISTICS_DASHBOARD_DATA = "SET_LOGISTICS_DASHBOARD_DATA";
export const SET_LOGISTICS_DASHBOARD_LOADING = "SET_LOGISTICS_DASHBOARD_LOADING";
export const SET_LOGISTICS_DASHBOARD_ERROR = "SET_LOGISTICS_DASHBOARD_ERROR";
export const CLEAR_LOGISTICS_DASHBOARD_ERROR = "CLEAR_LOGISTICS_DASHBOARD_ERROR";

export const SET_LOGISTICS_CHART_DATA = "SET_LOGISTICS_CHART_DATA";
export const SET_LOGISTICS_CHART_LOADING = "SET_LOGISTICS_CHART_LOADING";
export const SET_LOGISTICS_CHART_ERROR = "SET_LOGISTICS_CHART_ERROR";

// ============ INITIAL STATE ============
export const initialState = {
  // Sales Dashboard
  salesDashboardData: {
    totalRevenue: 0,
    totalOrders: 0,
    activeClients: 0,
    averageOrderValue: 0,
    clientSalesData: [],
    commandes: [],
    clients: [],
  },
  salesDashboardLoading: false,
  salesDashboardError: null,

  salesChartData: [],
  salesChartLoading: false,
  salesChartError: null,
  salesChartPeriod: "month",
  salesCategoryData: [],
  salesCategoryLoading: false,
  salesCategoryError: null,
  salesProductData: [],
  salesProductLoading: false,
  salesProductError: null,
  devisFunnelData: { data: [], summary: {} },
  devisFunnelLoading: false,
  devisFunnelError: null,
  devisConversionData: { data: [], summary: {} },
  devisConversionLoading: false,
  devisConversionError: null,

  // Procurement Dashboard
  procurementDashboardData: {
    totalPurchases: 0,
    supplierCount: 0,
    lowStockProducts: 0,
    totalAchats: 0,
    achats: [],
    suppliers: [],
    products: [],
  },
  procurementDashboardLoading: false,
  procurementDashboardError: null,

  procurementChartData: {
    spendingData: [],
    supplierData: [],
    productData: [],
    categoryData: [],
    poStatusData: [],
    procurementBudget: null,
  },
  procurementChartLoading: false,
  procurementChartError: null,
  procurementChartPeriod: "month",
  // Logistics Dashboard
  logisticsDashboardData: {
    totalDeliveries: 0,
    deliveredCount: 0,
    pendingCount: 0,
    cancelledCount: 0,
    activeTransporters: 0,
    lowStockProducts: 0,
    totalProducts: 0,
    totalStock: 0,
    totalMovements: 0,
    incomingQuantity: 0,
    outgoingQuantity: 0,
  },
  logisticsDashboardLoading: false,
  logisticsDashboardError: null,
  logisticsChartData: {
    movementTrendData: [],
    deliveryStatusData: [],
    movementDirectionData: [],
    transporterData: [],
    stockRiskData: [],
  },
  logisticsChartLoading: false,
  logisticsChartError: null,
  logisticsChartPeriod: "month",
};

// ============ ACTION CREATORS ============
export const setSalesDashboardData = (data) => ({ type: SET_SALES_DASHBOARD_DATA, payload: data });
export const setSalesDashboardLoading = (loading) => ({ type: SET_SALES_DASHBOARD_LOADING, payload: loading });
export const setSalesDashboardError = (error) => ({ type: SET_SALES_DASHBOARD_ERROR, payload: error });
export const clearSalesDashboardError = () => ({ type: CLEAR_SALES_DASHBOARD_ERROR });

export const setSalesChartData = (data) => ({ type: SET_SALES_CHART_DATA, payload: data });
export const setSalesChartLoading = (loading) => ({ type: SET_SALES_CHART_LOADING, payload: loading });
export const setSalesChartError = (error) => ({ type: SET_SALES_CHART_ERROR, payload: error });
export const setSalesCategoryData = (data) => ({ type: SET_SALES_CATEGORY_DATA, payload: data });
export const setSalesCategoryLoading = (loading) => ({ type: SET_SALES_CATEGORY_LOADING, payload: loading });
export const setSalesCategoryError = (error) => ({ type: SET_SALES_CATEGORY_ERROR, payload: error });
export const setSalesProductData = (data) => ({ type: SET_SALES_PRODUCT_DATA, payload: data });
export const setSalesProductLoading = (loading) => ({ type: SET_SALES_PRODUCT_LOADING, payload: loading });
export const setSalesProductError = (error) => ({ type: SET_SALES_PRODUCT_ERROR, payload: error });
export const setDevisFunnelData = (data) => ({ type: SET_DEVIS_FUNNEL_DATA, payload: data });
export const setDevisFunnelLoading = (loading) => ({ type: SET_DEVIS_FUNNEL_LOADING, payload: loading });
export const setDevisFunnelError = (error) => ({ type: SET_DEVIS_FUNNEL_ERROR, payload: error });
export const setDevisConversionData = (data) => ({ type: SET_DEVIS_CONVERSION_DATA, payload: data });
export const setDevisConversionLoading = (loading) => ({ type: SET_DEVIS_CONVERSION_LOADING, payload: loading });
export const setDevisConversionError = (error) => ({ type: SET_DEVIS_CONVERSION_ERROR, payload: error });

export const setProcurementDashboardData = (data) => ({ type: SET_PROCUREMENT_DASHBOARD_DATA, payload: data });
export const setProcurementDashboardLoading = (loading) => ({ type: SET_PROCUREMENT_DASHBOARD_LOADING, payload: loading });
export const setProcurementDashboardError = (error) => ({ type: SET_PROCUREMENT_DASHBOARD_ERROR, payload: error });
export const clearProcurementDashboardError = () => ({ type: CLEAR_PROCUREMENT_DASHBOARD_ERROR });

export const setProcurementChartData = (data) => ({ type: SET_PROCUREMENT_CHART_DATA, payload: data });
export const setProcurementChartLoading = (loading) => ({ type: SET_PROCUREMENT_CHART_LOADING, payload: loading });
export const setProcurementChartError = (error) => ({ type: SET_PROCUREMENT_CHART_ERROR, payload: error });

export const setLogisticsDashboardData = (data) => ({ type: SET_LOGISTICS_DASHBOARD_DATA, payload: data });
export const setLogisticsDashboardLoading = (loading) => ({ type: SET_LOGISTICS_DASHBOARD_LOADING, payload: loading });
export const setLogisticsDashboardError = (error) => ({ type: SET_LOGISTICS_DASHBOARD_ERROR, payload: error });
export const clearLogisticsDashboardError = () => ({ type: CLEAR_LOGISTICS_DASHBOARD_ERROR });

export const setLogisticsChartData = (data) => ({ type: SET_LOGISTICS_CHART_DATA, payload: data });
export const setLogisticsChartLoading = (loading) => ({ type: SET_LOGISTICS_CHART_LOADING, payload: loading });
export const setLogisticsChartError = (error) => ({ type: SET_LOGISTICS_CHART_ERROR, payload: error });

// ============ THUNK ACTIONS ============
export const fetchSalesDashboardData = () => async (dispatch) => {
  try {
    dispatch(setSalesDashboardLoading(true));
    dispatch(setSalesDashboardError(null));
    const data = await getSalesManagerDashboardData();
    dispatch(setSalesDashboardData(data));
  } catch (error) {
    dispatch(setSalesDashboardError(error.message));
  } finally {
    dispatch(setSalesDashboardLoading(false));
  }
};

export const fetchSalesChartData = (period = "month") => async (dispatch) => {
  try {
    dispatch(setSalesChartLoading(true));
    dispatch(setSalesChartError(null));
    const data = await getSalesManagerChartData(period);
    dispatch(setSalesChartData(data));
  } catch (error) {
    dispatch(setSalesChartError(error.message));
  } finally {
    dispatch(setSalesChartLoading(false));
  }
};

export const fetchSalesCategoryData = () => async (dispatch) => {
  try {
    dispatch(setSalesCategoryLoading(true));
    dispatch(setSalesCategoryError(null));
    const data = await getSalesCategoryData();
    dispatch(setSalesCategoryData(data));
  } catch (error) {
    dispatch(setSalesCategoryError(error.message));
  } finally {
    dispatch(setSalesCategoryLoading(false));
  }
};

export const fetchSalesProductData = () => async (dispatch) => {
  try {
    dispatch(setSalesProductLoading(true));
    dispatch(setSalesProductError(null));
    const data = await getSalesProductData();
    dispatch(setSalesProductData(data));
  } catch (error) {
    dispatch(setSalesProductError(error.message));
  } finally {
    dispatch(setSalesProductLoading(false));
  }
};

export const fetchDevisFunnelData = (period = "year") => async (dispatch) => {
  try {
    dispatch(setDevisFunnelLoading(true));
    dispatch(setDevisFunnelError(null));
    const data = await getDevisFunnelData(period);
    dispatch(setDevisFunnelData(data));
  } catch (error) {
    dispatch(setDevisFunnelError(error.message));
  } finally {
    dispatch(setDevisFunnelLoading(false));
  }
};

export const fetchDevisConversionData = (period = "year") => async (dispatch) => {
  try {
    dispatch(setDevisConversionLoading(true));
    dispatch(setDevisConversionError(null));
    const data = await getDevisConversionData(period);
    dispatch(setDevisConversionData(data));
  } catch (error) {
    dispatch(setDevisConversionError(error.message));
  } finally {
    dispatch(setDevisConversionLoading(false));
  }
};

export const fetchProcurementDashboardData = () => async (dispatch) => {
  try {
    dispatch(setProcurementDashboardLoading(true));
    dispatch(setProcurementDashboardError(null));
    const data = await getProcurementDashboardData();
    dispatch(setProcurementDashboardData(data));
  } catch (error) {
    dispatch(setProcurementDashboardError(error.message));
  } finally {
    dispatch(setProcurementDashboardLoading(false));
  }
};

export const fetchProcurementChartData = (period = "month") => async (dispatch) => {
  try {
    dispatch(setProcurementChartLoading(true));
    dispatch(setProcurementChartError(null));
    const data = await getProcurementChartData(period);
    dispatch(setProcurementChartData(data));
  } catch (error) {
    dispatch(setProcurementChartError(error.message));
  } finally {
    dispatch(setProcurementChartLoading(false));
  }
};

export const fetchLogisticsDashboardData = () => async (dispatch) => {
  try {
    dispatch(setLogisticsDashboardLoading(true));
    dispatch(setLogisticsDashboardError(null));
    const data = await getLogisticsDashboardData();
    dispatch(setLogisticsDashboardData(data));
  } catch (error) {
    dispatch(setLogisticsDashboardError(error.message));
  } finally {
    dispatch(setLogisticsDashboardLoading(false));
  }
};

export const fetchLogisticsChartData = (period = "month") => async (dispatch) => {
  try {
    dispatch(setLogisticsChartLoading(true));
    dispatch(setLogisticsChartError(null));
    const data = await getLogisticsChartData(period);
    dispatch(setLogisticsChartData(data));
  } catch (error) {
    dispatch(setLogisticsChartError(error.message));
  } finally {
    dispatch(setLogisticsChartLoading(false));
  }
};

// ============ REDUCER ============
const DashboardReducer = (state = initialState, action) => {
  switch (action.type) {
    // Sales Dashboard
    case SET_SALES_DASHBOARD_DATA:
      return { ...state, salesDashboardData: action.payload };
    case SET_SALES_DASHBOARD_LOADING:
      return { ...state, salesDashboardLoading: action.payload };
    case SET_SALES_DASHBOARD_ERROR:
      return { ...state, salesDashboardError: action.payload };
    case CLEAR_SALES_DASHBOARD_ERROR:
      return { ...state, salesDashboardError: null };

    case SET_SALES_CHART_DATA:
      return { ...state, salesChartData: action.payload };
    case SET_SALES_CHART_LOADING:
      return { ...state, salesChartLoading: action.payload };
    case SET_SALES_CHART_ERROR:
      return { ...state, salesChartError: action.payload };
    case SET_SALES_CATEGORY_DATA:
      return { ...state, salesCategoryData: action.payload };
    case SET_SALES_CATEGORY_LOADING:
      return { ...state, salesCategoryLoading: action.payload };
    case SET_SALES_CATEGORY_ERROR:
      return { ...state, salesCategoryError: action.payload };
    case SET_SALES_PRODUCT_DATA:
      return { ...state, salesProductData: action.payload };
    case SET_SALES_PRODUCT_LOADING:
      return { ...state, salesProductLoading: action.payload };
    case SET_SALES_PRODUCT_ERROR:
      return { ...state, salesProductError: action.payload };
    case SET_DEVIS_FUNNEL_DATA:
      return { ...state, devisFunnelData: action.payload };
    case SET_DEVIS_FUNNEL_LOADING:
      return { ...state, devisFunnelLoading: action.payload };
    case SET_DEVIS_FUNNEL_ERROR:
      return { ...state, devisFunnelError: action.payload };
    case SET_DEVIS_CONVERSION_DATA:
      return { ...state, devisConversionData: action.payload };
    case SET_DEVIS_CONVERSION_LOADING:
      return { ...state, devisConversionLoading: action.payload };
    case SET_DEVIS_CONVERSION_ERROR:
      return { ...state, devisConversionError: action.payload };

    // Procurement Dashboard
    case SET_PROCUREMENT_DASHBOARD_DATA:
      return { ...state, procurementDashboardData: action.payload };
    case SET_PROCUREMENT_DASHBOARD_LOADING:
      return { ...state, procurementDashboardLoading: action.payload };
    case SET_PROCUREMENT_DASHBOARD_ERROR:
      return { ...state, procurementDashboardError: action.payload };
    case CLEAR_PROCUREMENT_DASHBOARD_ERROR:
      return { ...state, procurementDashboardError: null };

    case SET_PROCUREMENT_CHART_DATA:
      return { ...state, procurementChartData: action.payload };
    case SET_PROCUREMENT_CHART_LOADING:
      return { ...state, procurementChartLoading: action.payload };
    case SET_PROCUREMENT_CHART_ERROR:
      return { ...state, procurementChartError: action.payload };

    // Logistics Dashboard
    case SET_LOGISTICS_DASHBOARD_DATA:
      return { ...state, logisticsDashboardData: action.payload };
    case SET_LOGISTICS_DASHBOARD_LOADING:
      return { ...state, logisticsDashboardLoading: action.payload };
    case SET_LOGISTICS_DASHBOARD_ERROR:
      return { ...state, logisticsDashboardError: action.payload };
    case CLEAR_LOGISTICS_DASHBOARD_ERROR:
      return { ...state, logisticsDashboardError: null };

    case SET_LOGISTICS_CHART_DATA:
      return { ...state, logisticsChartData: action.payload };
    case SET_LOGISTICS_CHART_LOADING:
      return { ...state, logisticsChartLoading: action.payload };
    case SET_LOGISTICS_CHART_ERROR:
      return { ...state, logisticsChartError: action.payload };

    default:
      return state;
  }
};

export default DashboardReducer;
