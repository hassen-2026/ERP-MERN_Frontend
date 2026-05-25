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
import { getManagerDashboardData } from "../../services/dashboardApi";
import "./ManagerDashboard.css";

export default function ManagerDashboard() {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    activeEmployees: 0,
    departmentCount: 0,
    performanceScore: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getManagerDashboardData();
        setStats(data);
      } catch (err) {
        console.error("Error loading manager dashboard:", err);
        setError("Impossible de charger le tableau de bord.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const dashboardStats = useMemo(() => [
    {
      title: "Employes totaux",
      value: stats.totalEmployees,
      color: "#1890ff",
    },
    {
      title: "Employes actifs",
      value: stats.activeEmployees,
      color: "#52c41a",
    },
    {
      title: "Departements",
      value: stats.departmentCount,
      color: "#faad14",
    },
    {
      title: "Score de performance",
      value: stats.performanceScore,
      suffix: "%",
      color: "#184f87",
    },

  ], []);

  // Monthly performance
  const performanceData = [
    { month: "Janv", target: 40000, actual: 38000, growth: -5 },
    { month: "Fevr", target: 42000, actual: 42500, growth: 1.2 },
    { month: "Mars", target: 40000, actual: 39200, growth: -2 },
    { month: "Avr", target: 45000, actual: 48000, growth: 6.7 },
    { month: "Mai", target: 45000, actual: 44100, growth: -2 },
    { month: "Juin", target: 48000, actual: 52200, growth: 8.75 },
  ];

  // Department breakdown
  const departmentData = [
    { dept: "Ventes", members: 22, productivity: 85 },
    { dept: "Operations", members: 12, productivity: 78 },
    { dept: "Support", members: 11, productivity: 82 },
  ];

  // Project status
  const projectStatusData = [
    { status: "Termine", value: 12 },
    { status: "En cours", value: 18 },
    { status: "En attente", value: 6 },
  ];

  const statusColors = ["#52c41a", "#1890ff", "#faad14"];

  // Team performance
  const teamData = [
    { member: "Haute performance", count: 12 },
    { member: "Performance moyenne", count: 28 },
    { member: "Besoin de support", count: 5 },
  ];

  const performanceColors = ["#52c41a", "#1890ff", "#faad14"];

  // Monthly revenue
  const revenueData = [
    { month: "Janv", revenue: 85000, expenses: 62000 },
    { month: "Fevr", revenue: 92000, expenses: 65000 },
    { month: "Mars", revenue: 88000, expenses: 63000 },
    { month: "Avr", revenue: 105000, expenses: 68000 },
    { month: "Mai", revenue: 98000, expenses: 67000 },
    { month: "Juin", revenue: 112000, expenses: 70000 },
  ];

  return (
    <div className="manager-dashboard">
      {/* MOLECULE: LoadingSpinner */}
      {loading && <LoadingSpinner size="large" tip="Chargement du tableau de bord Manager..." />}

      {/* ATOM: Alert */}
      {error && <Alert type="error" message={error} showIcon />}

      {/* MOLECULE: DashboardStatsGrid */}
      <DashboardStatsGrid stats={dashboardStats} />

      {/* ORGANISM: DashboardChartsSection - Performance & Revenue */}
      <DashboardChartsSection
        charts={[
          {
            span: 12,
            component: (
              <LineChartWidget
                title="Performance vs objectif"
                data={performanceData}
                dataKey="actual"
                xAxis="month"
                height={300}
              />
            ),
          },
          {
            span: 12,
            component: (
              <BarChartWidget
                title="Evolution mensuelle du chiffre d'affaires"
                data={revenueData}
                dataKey="revenue"
                xAxis="month"
                height={300}
              />
            ),
          },
        ]}
      />

      {/* ORGANISM: DashboardChartsSection - Project & Team Status */}
      <DashboardChartsSection
        charts={[
          {
            span: 12,
            component: (
              <PieChartWidget
                title="Apercu du statut des projets"
                data={projectStatusData}
                colors={statusColors}
                height={300}
              />
            ),
          },
          {
            span: 12,
            component: (
              <PieChartWidget
                title="Niveau de performance de l'equipe"
                data={teamData}
                colors={performanceColors}
                height={300}
              />
            ),
          },
        ]}
      />

      {/* ORGANISM: DashboardChartsSection - Department Breakdown */}
      <DashboardChartsSection
        charts={[
          {
            span: 24,
            component: (
              <BarChartWidget
                title="Productivite par departement"
                data={departmentData}
                dataKey="productivity"
                xAxis="dept"
                height={300}
              />
            ),
          },
        ]}
      />

      {/* ORGANISM: DashboardKPIsSection */}
      <DashboardKPIsSection
        kpis={[
          { label: "Temps moyen de reponse", value: "2.4 h" },
          { label: "Satisfaction client", value: "4.5 / 5.0" },
          { label: "Croissance annuelle", value: "↑ 24.5%" },
        ]}
      />
    </div>
  );
}
