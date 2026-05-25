import React, { useEffect, useMemo, useState } from "react";
import {
  LineChartWidget,
  BarChartWidget,
  PieChartWidget,
  DashboardStatsGrid,
  MapChartWidget,
} from "../../components/DashboardLayout";
import LoadingSpinner from "../../components/molecules/LoadingSpinner/LoadingSpinner";
import Alert from "../../components/atoms/alert/Alert";
import DashboardBudgetSection from "../../components/organisms/DashboardBudgetSection/DashboardBudgetSection";
import DashboardChartsSection from "../../components/organisms/DashboardChartsSection/DashboardChartsSection";
import DashboardKPIsSection from "../../components/organisms/DashboardKPIsSection/DashboardKPIsSection";
import { useSalesDashboard } from "../../redux/hooks/useDashboard";
import { getSalesLocations } from "../../services/dashboardApi";
import { PERIOD_OPTIONS } from "../../utils/chartAggregation";
import "./SalesManagerDashboard.css";

export default function SalesManagerDashboard() {
  const {
    dashboardData: stats,
    loading: dashboardLoading,
    error: dashboardError,
    chartData: salesChartData,
    chartLoading: chartsLoading,
    chartError: chartsError,
    salesCategoryData,
    salesCategoryLoading,
    salesProductData,
    salesProductLoading,
    devisConversionData,
    devisConversionLoading,
    fetchData: fetchDashboardData,
    fetchCharts: fetchChartData,
    fetchCategories,
    fetchProducts,
    fetchDevisConversion,
    clearError: clearDashboardError,
  } = useSalesDashboard();

  const [chartPeriod, setChartPeriod] = useState("month");
  const [salesLocations, setSalesLocations] = useState([]);
  const loading = dashboardLoading || chartsLoading || devisConversionLoading;
  const error = dashboardError || chartsError;

  useEffect(() => {
    fetchDashboardData();
    fetchChartData(chartPeriod);
    fetchCategories();
    fetchProducts();
    fetchDevisConversion(chartPeriod);
    // fetch sales locations for map
    (async () => {
      try {
        const locs = await getSalesLocations();
        setSalesLocations(locs || []);
      } catch (e) {}
    })();
  }, []);

  useEffect(() => {
    fetchChartData(chartPeriod);
    fetchCategories();
    fetchProducts();
    fetchDevisConversion(chartPeriod);
    (async () => {
      try {
        const locs = await getSalesLocations();
        setSalesLocations(locs || []);
      } catch (e) {}
    })();
  }, [chartPeriod]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchDashboardData();
      fetchChartData(chartPeriod);
      fetchCategories();
      fetchProducts();
      fetchDevisConversion(chartPeriod);
      (async () => {
        try {
          const locs = await getSalesLocations();
          setSalesLocations(locs || []);
        } catch (e) {}
      })();
    }, 30000);

    return () => clearInterval(interval);
  }, [chartPeriod]);

  // Debug: log dashboard data and chart series after load to trace zeros
  useEffect(() => {
    if (!loading) {
      try {
        console.debug("[SalesManagerDashboard] dashboard stats:", stats);
        console.debug("[SalesManagerDashboard] salesChartData:", salesChartData);
      } catch (e) {
       
      }
    }
  }, [loading, stats, salesChartData]);

  const dashboardStats = useMemo(() => {
    // Derive KPI values from multiple possible sources to avoid zeros when
    // backend field names vary or arrays are present instead of aggregates.
    const commandes = (stats && stats.commandes) || (stats && stats.commandesData) || [];
    const clients = (stats && stats.clients) || (stats && stats.clientsData) || [];
    const devis = (stats && stats.devis) || (stats && stats.quotes) || (stats && stats.devisData) || [];
    const bonCommandes = (stats && stats.bonCommandes) || (stats && stats.purchaseOrders) || (stats && stats.bonCommandesData) || [];

    // Attempt to compute total revenue from multiple sources: explicit aggregate
    // field, commandes array, or as a last resort from the salesChartData series.
    const chartSalesTotal = Array.isArray(salesChartData)
      ? salesChartData.reduce((sum, p) => sum + Number(((p && (p.sales || p.actual)) || 0)), 0)
      : 0;

    let totalRevenue = Math.floor(
      (stats && stats.totalRevenue) ||
        (Array.isArray(commandes) ? commandes.reduce((s, c) => s + (c.totalAmount || c.montantTotal || c.total || 0), 0) : 0)
    );

    if ((!totalRevenue || totalRevenue === 0) && chartSalesTotal > 0) {
      totalRevenue = Math.floor(chartSalesTotal);
    }

    // Total devis envoyés with fallback
    let totalQuotesSent = (stats && stats.totalQuotesSent) || (Array.isArray(devis) ? devis.length : 0);
    const chartTotalDevis = Array.isArray(devis) ? devis.length : 0;
    if ((!totalQuotesSent || totalQuotesSent === 0) && chartTotalDevis > 0) {
      totalQuotesSent = chartTotalDevis;
    }

    // Devis en attente (envoyés) with fallback
    let quotesSentCount = (stats && stats.quotesSentCount) || (Array.isArray(devis) ? devis.filter((d) => {
      const s = String(((d && (d.status || d.state)) || "")).toUpperCase();
      return s === "SENT" || s === "ENVOYE" || s === "ENVOYÉ" || s.includes("SENT") || s.includes("ENVOY");
    }).length : 0);
    if ((!quotesSentCount || quotesSentCount === 0) && chartTotalDevis > 0) {
      quotesSentCount = (Array.isArray(devis) ? devis.filter((d) => {
        const s = String(((d && (d.status || d.state)) || "")).toUpperCase();
        return s === "SENT" || s === "ENVOYE" || s === "ENVOYÉ" || s.includes("SENT") || s.includes("ENVOY");
      }).length : 0);
    }

    // Commandes totales with fallback
    let totalOrders = (stats && stats.totalOrders) || (Array.isArray(commandes) ? commandes.length : 0);
    if ((!totalOrders || totalOrders === 0) && Array.isArray(commandes) && commandes.length > 0) {
      totalOrders = commandes.length;
    }

    // Total bons de commande with fallback
    let totalPurchaseOrders = (stats && stats.totalPurchaseOrders) || (Array.isArray(bonCommandes) ? bonCommandes.length : 0);
    if ((!totalPurchaseOrders || totalPurchaseOrders === 0) && Array.isArray(bonCommandes) && bonCommandes.length > 0) {
      totalPurchaseOrders = bonCommandes.length;
    }

    // Bons de commande livrés with fallback
    let purchaseOrdersDelivered = (stats && stats.purchaseOrdersDelivered) || (Array.isArray(bonCommandes) ? bonCommandes.filter((b) => {
      const s = String(((b && b.status) || "")).toUpperCase();
      return (
        s === "DELIVERED" ||
        s === "RECEIVED" ||
        s === "RECU" ||
        s.includes("DELIVER") ||
        s.includes("RECEIV") ||
        s.includes("LIVR")
      );
    }).length : 0);
    if ((!purchaseOrdersDelivered || purchaseOrdersDelivered === 0) && Array.isArray(bonCommandes) && bonCommandes.length > 0) {
      purchaseOrdersDelivered = bonCommandes.filter((b) => {
        const s = String(((b && b.status) || "")).toUpperCase();
        return (
          s === "DELIVERED" ||
          s === "RECEIVED" ||
          s === "RECU" ||
          s.includes("DELIVER") ||
          s.includes("RECEIV") ||
          s.includes("LIVR")
        );
      }).length;
    }

    // Bons de commande en attente with fallback
    let purchaseOrdersPending = (stats && stats.purchaseOrdersPending) || (Array.isArray(bonCommandes) ? bonCommandes.filter((b) => {
      const s = String(((b && b.status) || "")).toUpperCase();
      const isDelivered = (
        s === "DELIVERED" ||
        s === "RECEIVED" ||
        s === "RECU" ||
        s.includes("DELIVER") ||
        s.includes("RECEIV") ||
        s.includes("LIVR")
      );
      return !isDelivered && s !== "CANCELLED";
    }).length : 0);
    if ((!purchaseOrdersPending || purchaseOrdersPending === 0) && Array.isArray(bonCommandes) && bonCommandes.length > 0) {
      purchaseOrdersPending = bonCommandes.filter((b) => {
        const s = String(((b && b.status) || "")).toUpperCase();
        const isDelivered = (
          s === "DELIVERED" ||
          s === "RECEIVED" ||
          s === "RECU" ||
          s.includes("DELIVER") ||
          s.includes("RECEIV") ||
          s.includes("LIVR")
        );
        return !isDelivered && s !== "CANCELLED";
      }).length;
    }

    // Clients actifs with fallback
    let activeClients = (stats && stats.activeClients) || (Array.isArray(clients) ? clients.length : 0);
    if ((!activeClients || activeClients === 0) && Array.isArray(clients) && clients.length > 0) {
      activeClients = clients.length;
    }

    return [
      { title: "CA (ventes livrées)", value: totalRevenue, suffix: " TND", color: "#52c41a" },
      { title: "Total devis envoyés", value: totalQuotesSent, color: "#1890ff" },
      { title: "Devis en attente (envoyés)", value: quotesSentCount, color: "#13c2c2" },
      { title: "Commandes totales", value: totalOrders, color: "#722ed1" },
      { title: "Total bons de commande", value: totalPurchaseOrders, color: "#1890ff" },
      { title: "Bons de commande livrés", value: purchaseOrdersDelivered, color: "#52c41a" },
      { title: "Bons de commande en attente", value: purchaseOrdersPending, color: "#fa541c" },
      { title: "Clients actifs", value: activeClients, color: "#faad14" },
    ];
  }, [stats]);

  const clientSalesData = stats.clientSalesData || [];
  const salesObjectiveSummary = useMemo(() => {
    if (!Array.isArray(salesChartData) || salesChartData.length === 0) {
      return { objective: 0, actual: 0 };
    }

    return salesChartData.reduce(
      (accumulator, point) => ({
        objective: accumulator.objective + Number(((point && point.objective) || 0)),
        actual: accumulator.actual + Number(((point && (point.sales || point.actual)) || 0)),
      }),
      { objective: 0, actual: 0 }
    );
  }, [salesChartData]);

  const salesObjectivePercent = salesObjectiveSummary.objective > 0
    ? Math.round((salesObjectiveSummary.actual / salesObjectiveSummary.objective) * 100)
    : 0;
  const salesObjectiveRemaining = Math.max(salesObjectiveSummary.objective - salesObjectiveSummary.actual, 0);

  const devisConversionSeries = devisConversionData?.data || [];

  return (
    <div className="sales-manager-dashboard">
      {/* MOLECULE: LoadingSpinner */}
      {loading && <LoadingSpinner size="large" tip="Chargement du tableau de bord Ventes..." />}

      {/* ATOM: Alert */}
      {error && <Alert type="error" message={error} showIcon />}

      {/* MOLECULE: DashboardStatsGrid */}
      <DashboardStatsGrid stats={dashboardStats} />

      <DashboardBudgetSection
        title="Objectif commercial"
        summaryTitle="Performance du période courant"
        summaryItems={[
          {
            label: "Objectif",
              value: `${Math.floor(salesObjectiveSummary.objective).toLocaleString("fr-TN")} TND`,
          },
          {
            label: "Réalisé",
              value: `${Math.floor(salesObjectiveSummary.actual).toLocaleString("fr-TN")} TND`,
            valueStyle: { color: "#52c41a" },
          },
          {
            label: "Reste à faire",
            value: `${Math.floor(salesObjectiveRemaining).toLocaleString("fr-TN")} TND`,
            valueStyle: { color: salesObjectiveRemaining > 0 ? "#faad14" : "#52c41a" },
          },
        ]}
        progressTitle="Avancement"
        progressPercent={salesObjectivePercent}
        progressFormat={(percent) => `${percent}%`}
        progressStrokeColor={
          salesObjectivePercent >= 100
            ? "#52c41a"
            : salesObjectivePercent >= 80
            ? "#faad14"
            : "#1890ff"
        }
        progressType="circle"
        statusTitle="Statut"
        statusColor={
          salesObjectivePercent >= 100
            ? "green"
            : salesObjectivePercent >= 80
            ? "orange"
            : "blue"
        }
        statusLabel={
          salesObjectivePercent >= 100
            ? "Objectif atteint"
            : salesObjectivePercent >= 80
            ? "En bonne voie"
            : "À surveiller"
        }
        statusDescription={
          salesObjectivePercent >= 100
            ? "Le chiffre d'affaires a atteint ou dépassé l'objectif sur la période affichée."
            : "Les montants et le pourcentage correspondent à la somme sur toute la période affichée ."
        }
      />

      {/* ORGANISM: DashboardChartsSection - Sales Trend */}
      <DashboardChartsSection
        charts={[
          {
            span: 12,
            component: (
              <LineChartWidget
                title="Performance commerciale vs objectif"
                data={salesChartData}
                lines={[
                  { key: "objective", label: "Objectif", color: "#184f87" },
                  { key: "sales", label: "Ventes", color: "#faad14" },
                ]}
                xAxis="name"
                height={300}
                selectOptions={PERIOD_OPTIONS}
                selectValue={chartPeriod}
                onSelectChange={setChartPeriod}
              />
            ),
          },
          {
            span: 12,
            component: (
              <BarChartWidget
                title="Top produits par chiffre d'affaire"
                data={salesProductData && salesProductData.length > 0 ? salesProductData : clientSalesData}
                dataKey="value"
                xAxis="name"
                height={300}
                barColor="#1890ff"
              />
            ),
          },
        ]}
      />

      {/* ORGANISM: DashboardChartsSection - Devis Analytics */}
      <DashboardChartsSection
        charts={[
          {
            span: 12,
            component: (
              <PieChartWidget
                title="Ventes par catégorie"
                data={salesCategoryData}
                colors={["#1890ff", "#52c41a", "#faad14", "#eb2f96"]}
                height={300}
              />
            ),
          },
          {
            span: 12,
            component: (
              <BarChartWidget
                title="Chiffre d'affaires par client"
                data={clientSalesData}
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
              <BarChartWidget
                title="Devis par mois"
                data={devisConversionSeries}
                bars={[
                  { key: "sent", label: "Envoyé", color: "#1890ff" },
                  { key: "accepted", label: "Accepté", color: "#52c41a" },
                  { key: "rejected", label: "Refusé", color: "#ff4d4f" },
                ]}
                xAxis="name"
                height={320}
              />
            ),
          },
        ]}
      />
      <DashboardChartsSection
        charts={[
          {
            span: 24,
            component: (
              <MapChartWidget title="Carte des ventes (par adresse client)" locations={salesLocations} height={420} countLabel="Commandes" />
            ),
          },
        ]}
      />

      {/* ORGANISM: DashboardKPIsSection */}
      <DashboardKPIsSection
        kpis={[
          { label: "Devis envoyés", value: devisConversionData?.summary?.sentCount || 0 },
          { label: "Devis acceptés", value: devisConversionData?.summary?.acceptedCount || 0 },
          { label: "Devis refusés", value: devisConversionData?.summary?.rejectedCount || 0 },
          { label: "Taux d'acceptation", value: `${devisConversionData?.summary?.acceptanceRate || 0}%` },
        ]}
      />
    </div>
  );
}
