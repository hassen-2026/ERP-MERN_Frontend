import React, { useEffect, useMemo, useState } from "react";
import {
  BarChartWidget,
  LineChartWidget,
  MultiLineChartWidget,
  PieChartWidget,
  DashboardStatsGrid,
} from "../../components/DashboardLayout";
import LoadingSpinner from "../../components/molecules/LoadingSpinner/LoadingSpinner";
import Alert from "../../components/atoms/alert/Alert";
import DashboardChartsSection from "../../components/organisms/DashboardChartsSection/DashboardChartsSection";
import DashboardKPIsSection from "../../components/organisms/DashboardKPIsSection/DashboardKPIsSection";
import { getAdminDashboardData, getAdminChartData } from "../../services/dashboardApi";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeEmployees: 0,
    totalOrders: 0,
    revenue: 0,
  });
  const [chartData, setChartData] = useState({
    revenueData: [],
    departmentData: [],
    targetData: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [dashboardStats, charts] = await Promise.all([
          getAdminDashboardData(),
          getAdminChartData(),
        ]);
        setStats(dashboardStats);
        setChartData(charts);
      } catch (err) {
        console.error("Error loading admin dashboard:", err);
        setError("Impossible de charger le tableau de bord.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Mock data - in production, fetch from API
  const dashboardStats = useMemo(() => [
    {
      title: "Utilisateurs totaux",
      value: stats.totalUsers,
      color: "#184f87",
    },
    {
      title: "Employes actifs",
      value: stats.activeEmployees,
      color: "#52c41a",
    },
    {
      title: "Commandes totales",
      value: stats.totalOrders,
      color: "#faad14",
    },
    {
      title: "Chiffre d'affaires",
      value: Math.floor(stats.revenue),
      suffix: " DT",
      color: "#eb2f96",
    },
  ], [stats]);

  // User distribution by role
  const roleDistribution = [
    { name: "Administrateur", value: 12 },
    { name: "Manager", value: 45 },
    { name: "Responsable commercial", value: 120 },
    { name: "Responsable RH", value: 85 },
    { name: "Responsable financier", value: 65 },
    { name: "Responsable achats", value: 55 },
    { name: "Responsable logistique", value: 75 },
    { name: "Utilisateurs standards", value: Math.max(0, stats.totalUsers - 432) },
  ];

  const roleColors = [
    "#184f87",
    "#1890ff",
    "#52c41a",
    "#faad14",
    "#eb2f96",
    "#13c2c2",
    "#722ed1",
    "#fa541c",
  ];

  // Orders status
  const orderStatusData = [
    { status: "En attente", count: Math.floor(stats.totalOrders * 0.1) },
    { status: "En cours", count: Math.floor(stats.totalOrders * 0.2) },
    { status: "Expediees", count: Math.floor(stats.totalOrders * 0.4) },
    { status: "Livrees", count: Math.floor(stats.totalOrders * 0.3) },
  ];

  const statusColors = ["#faad14", "#1890ff", "#52c41a", "#184f87"];

  return (
    <div className="admin-dashboard">
      {loading && <LoadingSpinner size="large" tip="Chargement du tableau de bord Administrateur..." />}
      {error && <Alert type="error" message={error} showIcon />}

      <DashboardStatsGrid stats={dashboardStats} />

      <DashboardChartsSection
        charts={[
          {
            span: 12,
            component: (
              <LineChartWidget
                title="Evolution du chiffre d'affaires vs depenses"
                data={chartData.revenueData.length > 0 ? chartData.revenueData : [
                  { month: "Janv", revenue: 45000, expenses: 32000 },
                  { month: "Fevr", revenue: 52000, expenses: 35000 },
                  { month: "Mars", revenue: 48000, expenses: 33000 },
                  { month: "Avr", revenue: 61000, expenses: 40000 },
                  { month: "Mai", revenue: 55000, expenses: 38000 },
                  { month: "Juin", revenue: 67000, expenses: 42000 },
                ]}
                dataKey="revenue"
                xAxis="month"
                height={300}
              />
            ),
          },
          {
            span: 12,
            component: (
              <BarChartWidget
                title="Performance des departements"
                data={chartData.departmentData.length > 0 ? chartData.departmentData : [
                  { dept: "Ventes", employees: 120, revenue: 450000 },
                  { dept: "HR", employees: 85, revenue: 85000 },
                  { dept: "Finance", employees: 65, revenue: 95000 },
                  { dept: "Achats", employees: 55, revenue: 125000 },
                  { dept: "Logistique", employees: 75, revenue: 185000 },
                  { dept: "IT", employees: 45, revenue: 65000 },
                ]}
                dataKey="revenue"
                xAxis="dept"
                height={300}
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
              <MultiLineChartWidget
                title="Objectifs vs réalisé"
                data={chartData.targetData}
                xAxis="month"
                lines={[
                  { key: "targetValue", color: "#184f87" },
                  { key: "actualValue", color: "#52c41a" },
                ]}
                height={320}
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
                title="Repartition des utilisateurs par role"
                data={roleDistribution}
                colors={roleColors}
                height={300}
              />
            ),
          },
          {
            span: 12,
            component: (
              <PieChartWidget
                title="Commandes par statut"
                data={orderStatusData}
                colors={statusColors}
                height={300}
              />
            ),
          },
        ]}
      />

      <DashboardKPIsSection
        kpis={[
          { label: "Transactions totales", value: stats.totalOrders },
          { label: "Sessions actives", value: Math.floor(stats.activeEmployees * 2) },
          { label: "Disponibilite systeme", value: "99.8%" },
          { label: "Derniere sauvegarde", value: "Aujourd'hui 14:30" },
        ]}
      />
    </div>
  );
}

