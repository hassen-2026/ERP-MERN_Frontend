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
import { getUserDashboardData } from "../../services/dashboardApi";
import "./UserDashboard.css";

export default function UserDashboard() {
  const [stats, setStats] = useState({
    myTasks: 0,
    completedTasks: 0,
    teamMembers: 0,
    performance: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getUserDashboardData();
        setStats(data);
      } catch (err) {
        console.error("Error loading user dashboard:", err);
        setError("Impossible de charger le tableau de bord.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const dashboardStats = useMemo(() => [
    {
      title: "Mes taches",
      value: stats.myTasks,
      color: "#1890ff",
    },
    {
      title: "Terminees",
      value: stats.completedTasks,
      color: "#52c41a",
    },
    {
      title: "Membres de l'equipe",
      value: stats.teamMembers,
      color: "#184f87",
    },
    {
      title: "Performance",
      value: stats.performance,
      suffix: "%",
      color: "#faad14",
    },
  ], [stats]);

  // Monthly activity
  const activityData = [
    { month: "Janv", tasks: 8, completed: 6, inProgress: 2 },
    { month: "Fevr", tasks: 10, completed: 9, inProgress: 1 },
    { month: "Mars", tasks: 9, completed: 8, inProgress: 1 },
    { month: "Avr", tasks: 12, completed: 10, inProgress: 2 },
    { month: "Mai", tasks: 11, completed: 10, inProgress: 1 },
    { month: "Juin", tasks: 13, completed: 12, inProgress: 1 },
  ];

  // Task distribution
  const taskData = [
    { category: "Conception", count: 15 },
    { category: "Developpement", count: 22 },
    { category: "Tests", count: 18 },
    { category: "Documentation", count: 8 },
  ];

  const taskColors = ["#1890ff", "#52c41a", "#faad14", "#722ed1"];

  // Priority breakdown
  const priorityData = [
    { priority: "Haute", value: 8 },
    { priority: "Moyenne", value: 28 },
    { priority: "Basse", value: 12 },
  ];

  const priorityColors = ["#eb2f96", "#faad14", "#52c41a"];

  // Productivity trend
  const productivityData = [
    { week: "Semaine 1", productivity: 78 },
    { week: "Semaine 2", productivity: 82 },
    { week: "Semaine 3", productivity: 85 },
    { week: "Semaine 4", productivity: 88 },
  ];

  return (
    <div className="user-dashboard">
      {loading && <LoadingSpinner size="large" tip="Chargement de votre tableau de bord..." />}
      {error && <Alert type="error" message={error} showIcon />}

      <DashboardStatsGrid stats={dashboardStats} />

      <DashboardChartsSection
        charts={[
          {
            span: 12,
            component: (
              <LineChartWidget
                title="Activite mensuelle des taches"
                data={activityData}
                dataKey="completed"
                xAxis="month"
                height={300}
              />
            ),
          },
          {
            span: 12,
            component: (
              <LineChartWidget
                title="Evolution hebdomadaire de la productivite"
                data={productivityData}
                dataKey="productivity"
                xAxis="week"
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
                title="Taches par categorie"
                data={taskData}
                colors={taskColors}
                height={300}
              />
            ),
          },
          {
            span: 12,
            component: (
              <PieChartWidget
                title="Taches par priorite"
                data={priorityData}
                colors={priorityColors}
                height={300}
              />
            ),
          },
        ]}
      />

      <DashboardKPIsSection
        kpis={[
          { label: "Taches cette semaine", value: "5 / 6" },
          { label: "Temps moyen de completion", value: "2.3 jours" },
          { label: "Evaluation globale", value: "4.6 / 5.0 ⭐" },
        ]}
      />
    </div>
  );
}
