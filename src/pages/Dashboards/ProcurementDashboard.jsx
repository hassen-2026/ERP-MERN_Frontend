import React, { useEffect, useMemo, useState } from "react";
import { Card, Progress, Row, Col, Statistic, Tag } from "antd";
import {
  LineChartWidget,
  BarChartWidget,
  PieChartWidget,
  DashboardStatsGrid,
  MapChartWidget,
} from "../../components/DashboardLayout";
import LoadingSpinner from "../../components/molecules/LoadingSpinner/LoadingSpinner";
import Alert from "../../components/atoms/alert/Alert";
import DashboardChartsSection from "../../components/organisms/DashboardChartsSection/DashboardChartsSection";
import DashboardKPIsSection from "../../components/organisms/DashboardKPIsSection/DashboardKPIsSection";
import DashboardBudgetSection from "../../components/organisms/DashboardBudgetSection/DashboardBudgetSection";
import { useProcurementDashboard } from "../../redux/hooks/useDashboard";
import { getPurchasesLocations } from "../../services/dashboardApi";
import { useProcurementBudget } from "../../redux/hooks/useBudget";
import { PERIOD_OPTIONS } from "../../utils/chartAggregation";
import "./ProcurementDashboard.css";

export default function ProcurementDashboard() {
  // Redux - Dashboard data
  const {
    dashboardData: stats,
    loading: dashboardLoading,
    error: dashboardError,
    chartData,
    chartLoading: chartsLoading,
    chartError: chartsError,
    fetchData: fetchDashboardData,
    fetchCharts: fetchChartData,
    clearError: clearDashboardError,
  } = useProcurementDashboard();

  // Redux - Budget cache
  const { budget: reduxBudget, fetchBudgets } = useProcurementBudget();

  const [chartPeriod, setChartPeriod] = useState("month");
  const [purchaseLocations, setPurchaseLocations] = useState([]);
  const loading = dashboardLoading || chartsLoading;
  const error = dashboardError || chartsError;

  useEffect(() => {
    fetchDashboardData();
    fetchBudgets();
  }, []);

  useEffect(() => {
    fetchChartData(chartPeriod);
    fetchBudgets();
    (async () => {
      try {
        const locs = await getPurchasesLocations();
        setPurchaseLocations(locs || []);
      } catch (e) {}
    })();
  }, [chartPeriod]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchDashboardData();
      fetchChartData(chartPeriod);
      fetchBudgets();
      (async () => {
        try {
          const locs = await getPurchasesLocations();
          setPurchaseLocations(locs || []);
        } catch (e) {}
      })();
    }, 30000);

    return () => clearInterval(interval);
  }, [chartPeriod]);

  const dashboardStats = useMemo(() => [
    {
      title: "Achats totaux",
      value: Math.floor(stats.totalPurchases),
      suffix: " TND",
      color: "#1890ff",
    },
    {
      title: "Fournisseurs actifs",
      value: stats.supplierCount,
      color: "#52c41a",
    },
    {
      title: "Produits en stock faible",
      value: stats.lowStockProducts,
      color: "#faad14",
    },
    {
      title: "Achats en attente de réception",
      value: stats.totalAchats,
      color: "#184f87",
    },
  ], [stats]);

  // Monthly spending
  const spendingData = chartData.spendingData;

  // Top products
  const productData = chartData.productData;

  // Top suppliers
  const supplierData = chartData.supplierData;

  // Purchase by category
  const categoryData = chartData.categoryData;

  const categoryColors = ["#1890ff", "#52c41a", "#faad14", "#eb2f96"];

  // PO status
  const poStatusData = chartData.poStatusData;

  // Budget - Priorité Redux > API
  const procurementBudget = reduxBudget || chartData.procurementBudget;

  // Calculate real spent amount from current month spending data
  const currentMonthSpending = spendingData && spendingData.length > 0 ? spendingData[spendingData.length - 1].spent : 0;
  const actualSpent = currentMonthSpending || 0;
  const totalBudgetAmount = procurementBudget?.totalBudget || 0;
  const availableAmount = Math.max(totalBudgetAmount - actualSpent, 0);
  const percentageUsed = totalBudgetAmount > 0 ? Math.round((actualSpent / totalBudgetAmount) * 100) : 0;

  return (
    <div className="procurement-dashboard">
      {loading && <LoadingSpinner size="large" tip="Chargement du tableau de bord Achats..." />}
      {error && <Alert type="error" message={error} showIcon />}

      <DashboardStatsGrid stats={dashboardStats} />

      {/* Budget Widget */}
      {procurementBudget && (
        <DashboardBudgetSection
          title="Budget Achats"
          summaryTitle="Budget Achats Mois Courant"
          summaryItems={[
            {
              label: "Alloué",
              value: `${totalBudgetAmount?.toLocaleString()} TND`,
            },
            {
              label: "Dépensé",
              value: `${actualSpent?.toLocaleString()} TND`,
              valueStyle: { color: "#ff4d4f" },
            },
            {
              label: "Disponible",
              value: `${availableAmount?.toLocaleString()} TND`,
              valueStyle: { color: availableAmount < 0 ? "#ff4d4f" : "#52c41a" },
            },
          ]}
          progressTitle="Utilisation"
          progressPercent={percentageUsed}
          progressFormat={(percent) => `${percent}%`}
          progressStrokeColor={
            percentageUsed >= 100
              ? "#ff4d4f"
              : percentageUsed >= 80
              ? "#faad14"
              : "#52c41a"
          }
          progressType="circle"
          statusTitle="Status"
          statusColor={
            percentageUsed >= 100
              ? "red"
              : percentageUsed >= 80
              ? "orange"
              : "green"
          }
          statusLabel={
            percentageUsed >= 100
              ? "Dépassé"
              : percentageUsed >= 80
              ? "En alerte"
              : "Normal"
          }
          statusDescription={
            procurementBudget?.status === "DRAFT"
              ? "En brouillon"
              : procurementBudget?.status === "APPROVED"
              ? "Approuvé"
              : procurementBudget?.status === "ACTIVE"
              ? "Actif"
              : "Fermé"
          }
        />
      )}

      <DashboardChartsSection
        charts={[
          {
            span: 12,
            component: (
              <LineChartWidget
                title="Depenses mensuelles vs budget"
                data={spendingData}
                lines={[
                  { key: "budget", label: "Budget", color: "#184f87" },
                  { key: "spent", label: "Achats", color: "#faad14" },
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
                title="Achats par fournisseur"
                data={supplierData}
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
                title="Achats par categorie"
                data={categoryData}
                colors={categoryColors}
                height={300}
              />
            ),
          },
          {
            span: 12,
            component: (
              <BarChartWidget
                title="Top 10 produits achetés par montant total"
                data={productData}
                barColor="#1890ff"
                dataKey="value"
                xAxis="name"
                height={300}
                xAxisTickInterval={0}
                xAxisTickAngle={-35}
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
              <MapChartWidget title="Carte des achats (par fournisseur)" locations={purchaseLocations} height={420} countLabel="Achats" />
            ),
          },
        ]}
      />

    </div>
  );
}
