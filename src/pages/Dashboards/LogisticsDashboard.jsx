import React, { useEffect, useMemo, useState } from "react";
import {
  BarChartWidget,
  LineChartWidget,
  PieChartWidget,
  DashboardStatsGrid,
} from "../../components/DashboardLayout";
import LoadingSpinner from "../../components/molecules/LoadingSpinner/LoadingSpinner";
import Alert from "../../components/atoms/alert/Alert";
import DashboardChartsSection from "../../components/organisms/DashboardChartsSection/DashboardChartsSection";
import DashboardKPIsSection from "../../components/organisms/DashboardKPIsSection/DashboardKPIsSection";
import StackedAreaWidget from "../../components/organisms/StackedAreaWidget/StackedAreaWidget";
import HeatmapCalendarWidget from "../../components/organisms/HeatmapCalendarWidget/HeatmapCalendarWidget";
import { useLogisticsDashboard } from "../../redux/hooks/useDashboard";
import { buildDualLineSeries, PERIOD_OPTIONS } from "../../utils/chartAggregation";
import "./LogisticsDashboard.css";

export default function LogisticsDashboard() {
  const {
    dashboardData: stats,
    loading,
    error,
    chartData,
    chartLoading: chartsLoading,
    chartError: chartsError,
    chartPeriod,
    fetchData,
    fetchCharts,
  } = useLogisticsDashboard();

  const [localChartPeriod, setLocalChartPeriod] = useState(chartPeriod || "month");
  const [selectedProductId, setSelectedProductId] = useState("all");

  useEffect(() => {
    fetchData();
    fetchCharts(localChartPeriod);
  }, []);

  useEffect(() => {
    fetchCharts(localChartPeriod);
  }, [localChartPeriod]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchData();
      fetchCharts(localChartPeriod);
    }, 30000);

    return () => clearInterval(interval);
  }, [localChartPeriod]);

  const movements = stats.movements || [];
  const incomingMovementsCount = movements.filter((movement) => String(movement.type || "").toLowerCase() === "in").length;
  const outgoingMovementsCount = movements.filter((movement) => String(movement.type || "").toLowerCase() === "out").length;

  const dashboardStats = useMemo(() => [
    {
      title: "Livraisons totales",
      value: stats.totalDeliveries,
      color: "#1890ff",
    },
    {
      title: "Livrees",
      value: stats.deliveredCount,
      color: "#52c41a",
    },
    {
      title: "En attente",
      value: stats.pendingCount,
      color: "#faad14",
    },
    {
      title: "Annulées",
      value: stats.cancelledCount,
      color: "#ff4d4f",
    },
    {
      title: "Transporteurs actifs",
      value: stats.activeTransporters,
      color: "#184f87",
    },
    {
      title: "Mouvements stock",
      value: stats.totalMovements,
      color: "#722ed1",
    },
    {
      title: "Nombre de mouvements entrants",
      value: incomingMovementsCount,
      color: "#31a354",
    },
    {
      title: "Nombre de mouvements sortants",
      value: outgoingMovementsCount,
      color: "#faad14",
    },
    {
      title: "Produits à surveiller",
      value: stats.lowStockProducts,
      color: "#fa541c",
    },
    {
      title: "Produits référencés",
      value: stats.totalProducts,
      color: "#13c2c2",
    },
    {
      title: "Stock total",
      value: stats.totalStock,
      color: "#52c41a",
    },
  ], [stats, incomingMovementsCount, outgoingMovementsCount]);

  const movementTrendData = chartData?.movementTrendData || [];
  const deliveryStatusData = chartData?.deliveryStatusData || [];
  const movementDirectionData = chartData?.movementDirectionData || [];
  const transporterData = chartData?.transporterData || [];
  const stockRiskData = chartData?.stockRiskData || [];
  const productOptions = useMemo(() => {
    const products = stats.products || [];

    return [
      { value: "all", label: "Tous les produits" },
      ...products.map((product) => ({
        value: String(product._id || product.id || ""),
        label: product.reference ? `${product.name || "Produit"} (${product.reference})` : (product.name || "Produit inconnu"),
      })).filter((item) => item.value),
    ];
  }, [stats.products]);

  const stackedMovementTrendData = useMemo(() => {
    const selectedProduct = String(selectedProductId || "all");
    const relevantMovements = selectedProduct === "all"
      ? movements
      : movements.filter((movement) => String(movement.product?._id || movement.product?.id || movement.product || movement.productId || "") === selectedProduct);

    return buildDualLineSeries({
      actualRecords: relevantMovements.filter((movement) => String(movement.type || "").toLowerCase() === "in"),
      objectiveRecords: relevantMovements.filter((movement) => String(movement.type || "").toLowerCase() === "out"),
      period: localChartPeriod,
      actualValueResolver: (movement) => Number(movement.quantity || 0),
      objectiveValueResolver: (movement) => Number(movement.quantity || 0),
    }).map((item) => ({
      name: item.name,
      incoming: item.actual,
      outgoing: item.objective,
    }));
  }, [movements, selectedProductId, localChartPeriod]);

  const productsStockData = useMemo(() => {
    const products = stats.products || [];

    return products
      .map((product) => ({
        name: product.name || product.reference || product.code || "Produit inconnu",
        value: Number(product.quantity || 0),
      }))
      .sort((left, right) => right.value - left.value)
      .slice(0, 10);
  }, [stats.products]);

  // Build heatmap values from movements (last 90 days)
  const heatmapValues = movements.map((m) => ({ date: m.createdAt || m.date || m.timestamp || m.createdAt, value: Number(m.quantity || 1) }));

  const deliveryRate = stats.totalDeliveries > 0 ? Math.round((stats.deliveredCount / stats.totalDeliveries) * 100) : 0;
  const stockAlertRate = stats.totalProducts > 0
    ? Math.round((stats.lowStockProducts / Math.max(stats.totalProducts, 1)) * 100)
    : 0;
  const averageStockPerProduct = stats.totalProducts > 0
    ? Math.round((stats.totalStock / Math.max(stats.totalProducts, 1)) * 10) / 10
    : 0;
  const movementColors = ["#1890ff", "#faad14"];

  return (
    <div className="logistics-dashboard">
      {(loading || chartsLoading) && <LoadingSpinner size="large" tip="Chargement du tableau de bord Stock..." />}
      {error && <Alert type="error" message={error} showIcon />}
      {chartsError && <Alert type="warning" message={chartsError} showIcon />}

      <DashboardStatsGrid stats={dashboardStats} />

      <DashboardChartsSection
        charts={[
           {
            span: 12,
            component: (
              <StackedAreaWidget
                title="Entrées vs Sorties (empilé)"
                data={stackedMovementTrendData}
                areas={[{ key: "incoming", color: "#31a354" }, { key: "outgoing", color: "#faad14" }]}
                xKey="name"
                height={320}
                selectOptions={productOptions}
                selectValue={selectedProductId}
                onSelectChange={setSelectedProductId}
                selectPlaceholder="Filtrer par produit"
              />
            ),
          },
         
          {
            span: 12,
            component: (
              <BarChartWidget
                title="Produits en stock"
                data={productsStockData}
                dataKey="value"
                xAxis="name"
                height={300}
              />
            ),
          },
        ]}
      />
   <DashboardChartsSection
        charts={[
          {
            span: 12,
            component: (
              <LineChartWidget
                title="Mouvements de stock"
                data={movementTrendData}
                lines={[
                  { key: "incoming", label: "Entrées", color: "#1890ff" },
                  { key: "outgoing", label: "Sorties", color: "#faad14" },
                ]}
                xAxis="name"
                height={300}
                selectOptions={PERIOD_OPTIONS}
                selectValue={localChartPeriod}
                onSelectChange={setLocalChartPeriod}
              />
            ),
          },
           {
            span: 12,
            component: (
              <BarChartWidget
                title="Produits à surveiller"
                data={stockRiskData}
                dataKey="value"
                xAxis="name"
                height={300}
              />
            ),
          },
          
        ]}
      />
      <DashboardChartsSection
        charts={[
          {
            span: 12,
            component: (
              <PieChartWidget
                title="Répartition des mouvements"
                data={movementDirectionData}
                colors={movementColors}
                height={300}
              />
            ),
          },
          {
            span: 12,
            component: (
              <BarChartWidget
                title="Transporteurs les plus actifs"
                data={transporterData}
                dataKey="value"
                xAxis="name"
                height={300}
              />
            ),
          },
        ]}
      />

   


      <DashboardKPIsSection
        kpis={[
          { label: "Taux de livraison", value: `${deliveryRate}%` },
          { label: "Produits à risque", value: `${stockAlertRate}%` },
          { label: "Stock moyen / produit", value: Number(averageStockPerProduct).toLocaleString("fr-FR") },
          { label: "Mouvements entrants", value: Number(incomingMovementsCount).toLocaleString("fr-FR") },
          { label: "Mouvements sortants", value: Number(outgoingMovementsCount).toLocaleString("fr-FR") },
        ]}
      />
    </div>
  );
}
