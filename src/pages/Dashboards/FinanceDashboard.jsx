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
import { getFinanceDashboardData } from "../../services/dashboardApi";
import "./FinanceDashboard.css";

export default function FinanceDashboard() {
  const [stats, setStats] = useState({
    totalInvoiced: 0,
    totalPaid: 0,
    totalExpenses: 0,
    netProfit: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getFinanceDashboardData();
        setStats(data);
      } catch (err) {
        console.error("Error loading finance dashboard:", err);
        setError("Impossible de charger le tableau de bord.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const dashboardStats = useMemo(() => [
    {
      title: "Total facture",
      value: Math.floor(stats.totalInvoiced),
      suffix: " TND",
      color: "#52c41a",
    },
    {
      title: "Total encaisse",
      value: Math.floor(stats.totalPaid),
      suffix: " TND",
      color: "#184f87",
    },
    {
      title: "Depenses totales",
      value: Math.floor(stats.totalExpenses),
      suffix: " TND",
      color: "#eb2f96",
    },
    {
      title: "Benefice net",
      value: Math.floor(stats.netProfit),
      suffix: " TND",
      color: "#faad14",
    },
  ], [stats]);

  // Monthly P&L
  const profitData = [
    { month: "Janv", revenue: 45000, expenses: 32000, profit: 13000 },
    { month: "Fevr", revenue: 52000, expenses: 35000, profit: 17000 },
    { month: "Mars", revenue: 48000, expenses: 33000, profit: 15000 },
    { month: "Avr", revenue: 61000, expenses: 40000, profit: 21000 },
    { month: "Mai", revenue: 55000, expenses: 38000, profit: 17000 },
    { month: "Juin", revenue: 67000, expenses: 42000, profit: 25000 },
  ];

  // Revenue by source
  const revenueSourceData = [
    { source: "Ventes produits", value: 285000 },
    { source: "Services", value: 145000 },
    { source: "Abonnements", value: 85000 },
    { source: "Autres", value: 27000 },
  ];

  const revenueColors = ["#52c41a", "#1890ff", "#faad14", "#722ed1"];

  // Expense breakdown
  const expenseData = [
    { category: "Salaires", value: 155000 },
    { category: "Operations", value: 95000 },
    { category: "Marketing", value: 45000 },
    { category: "Autres", value: 30000 },
  ];

  const expenseColors = ["#eb2f96", "#faad14", "#1890ff", "#666"];

  // Cash flow
  const cashFlowData = [
    { month: "Janv", inflow: 45000, outflow: 32000 },
    { month: "Fevr", inflow: 52000, outflow: 35000 },
    { month: "Mars", inflow: 48000, outflow: 33000 },
    { month: "Avr", inflow: 61000, outflow: 40000 },
    { month: "Mai", inflow: 55000, outflow: 38000 },
    { month: "Juin", inflow: 67000, outflow: 42000 },
  ];

  // Payment status
  const paymentData = [
    { status: "Encaisse", value: 325000 },
    { status: "En attente", value: 85000 },
    { status: "En retard", value: 12000 },
  ];

  const paymentColors = ["#52c41a", "#faad14", "#eb2f96"];

  return (
    <div className="finance-dashboard">
      {/* MOLECULE: LoadingSpinner */}
      {loading && <LoadingSpinner size="large" tip="Chargement du tableau de bord Finance..." />}

      {/* ATOM: Alert */}
      {error && <Alert type="error" message={error} showIcon />}

      {/* MOLECULE: DashboardStatsGrid */}
      <DashboardStatsGrid stats={dashboardStats} />

      {/* ORGANISM: DashboardChartsSection - P&L Trend */}
      <DashboardChartsSection
        charts={[
          {
            span: 12,
            component: (
              <LineChartWidget
                title="Evolution profits et pertes"
                data={profitData}
                dataKey="profit"
                xAxis="month"
                height={300}
              />
            ),
          },
          {
            span: 12,
            component: (
              <BarChartWidget
                title="Flux de tresorerie mensuel"
                data={cashFlowData}
                dataKey="inflow"
                xAxis="month"
                height={300}
              />
            ),
          },
        ]}
      />

      {/* ORGANISM: DashboardChartsSection - Revenue & Expenses */}
      <DashboardChartsSection
        charts={[
          {
            span: 12,
            component: (
              <PieChartWidget
                title="Repartition du chiffre d'affaires"
                data={revenueSourceData}
                colors={revenueColors}
                height={300}
              />
            ),
          },
          {
            span: 12,
            component: (
              <PieChartWidget
                title="Repartition des depenses"
                data={expenseData}
                colors={expenseColors}
                height={300}
              />
            ),
          },
        ]}
      />

      {/* ORGANISM: DashboardChartsSection - Payment Status */}
      <DashboardChartsSection
        charts={[
          {
            span: 12,
            component: (
              <PieChartWidget
                title="Statut des paiements de factures"
                data={paymentData}
                colors={paymentColors}
                height={300}
              />
            ),
          },
          {
            span: 12,
            component: (
              <div className="forecast-card">
                <h3>Previsions financieres</h3>
                <div className="forecast-item">
                  <span>CA previsionnel T3</span>
                  <strong>195,000 TND</strong>
                </div>
                <div className="forecast-item">
                  <span>Depenses previsionnelles T3</span>
                  <strong>120,000 TND</strong>
                </div>
                <div className="forecast-item">
                  <span>Croissance annuelle (est.)</span>
                  <strong style={{ color: "#52c41a" }}>↑ 18.5%</strong>
                </div>
              </div>
            ),
          },
        ]}
      />

      {/* ORGANISM: DashboardKPIsSection - Metrics */}
      <DashboardKPIsSection
        kpis={[
          { label: "Ratio de liquidite", value: "2.4" },
          { label: "Dette / Fonds propres", value: "0.65" },
          { label: "ROI", value: "28.4%" },
          { label: "Reserve de tresorerie", value: "185K TND" },
        ]}
      />
    </div>
  );
}
