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
import { getLogisticsDashboardData } from "../../services/dashboardApi";
import "./LogisticsDashboard.css";

export default function LogisticsDashboard() {
  const [stats, setStats] = useState({
    totalDeliveries: 0,
    deliveredCount: 0,
    pendingCount: 0,
    activeTransporters: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getLogisticsDashboardData();
        setStats(data);
      } catch (err) {
        console.error("Error loading logistics dashboard:", err);
        setError("Impossible de charger le tableau de bord.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

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
      title: "Transporteurs actifs",
      value: stats.activeTransporters,
      color: "#184f87",
    },
  ], [stats]);

  // Monthly deliveries
  const deliveryData = [
    { month: "Janv", shipped: 245, delivered: 238, delayed: 7 },
    { month: "Fevr", shipped: 268, delivered: 263, delayed: 5 },
    { month: "Mars", shipped: 235, delivered: 230, delayed: 5 },
    { month: "Avr", shipped: 302, delivered: 298, delayed: 4 },
    { month: "Mai", shipped: 285, delivered: 282, delayed: 3 },
    { month: "Juin", shipped: 325, delivered: 320, delayed: 5 },
  ];

  // Delivery by region
  const regionData = [
    { region: "Nord", deliveries: 385, cost: 12500 },
    { region: "Sud", deliveries: 428, cost: 14200 },
    { region: "Est", deliveries: 352, cost: 11800 },
    { region: "Ouest", deliveries: 298, cost: 9900 },
    { region: "Centre", deliveries: 242, cost: 8100 },
  ];

  // Shipment status
  const statusData = [
    { status: "En transit", value: 85 },
    { status: "En attente de collecte", value: 28 },
    { status: "En cours de livraison", value: 32 },
  ];

  const statusColors = ["#1890ff", "#faad14", "#52c41a"];

  // Cost by transport mode
  const transportData = [
    { mode: "Route", cost: 28000, deliveries: 352 },
    { mode: "Air", cost: 18500, deliveries: 95 },
    { mode: "Mer", cost: 12000, deliveries: 65 },
    { mode: "Rail", cost: 8200, deliveries: 58 },
  ];

  // Warehouse inventory
  const warehouseData = [
    { warehouse: "Entrepot A", capacity: 85, items: 4250 },
    { warehouse: "Entrepot B", capacity: 92, items: 4600 },
    { warehouse: "Entrepot C", capacity: 65, items: 3900 },
    { warehouse: "Entrepot D", capacity: 78, items: 4100 },
  ];

  return (
    <div className="logistics-dashboard">
      {loading && <LoadingSpinner size="large" tip="Chargement du tableau de bord Logistique..." />}
      {error && <Alert type="error" message={error} showIcon />}

      <DashboardStatsGrid stats={dashboardStats} />

      <DashboardChartsSection
        charts={[
          {
            span: 12,
            component: (
              <LineChartWidget
                title="Evolution mensuelle des expeditions"
                data={deliveryData}
                dataKey="delivered"
                xAxis="month"
                height={300}
              />
            ),
          },
          {
            span: 12,
            component: (
              <BarChartWidget
                title="Livraisons par region"
                data={regionData}
                dataKey="deliveries"
                xAxis="region"
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
                title="Statut actuel des expeditions"
                data={statusData}
                colors={statusColors}
                height={300}
              />
            ),
          },
          {
            span: 12,
            component: (
              <BarChartWidget
                title="Cout par mode de transport"
                data={transportData}
                dataKey="cost"
                xAxis="mode"
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
              <BarChartWidget
                title="Utilisation de la capacite des entrepots"
                data={warehouseData}
                dataKey="capacity"
                xAxis="warehouse"
                height={300}
              />
            ),
          },
        ]}
      />

      <DashboardKPIsSection
        kpis={[
          { label: "Taux de livraison a temps", value: "96.2%" },
          { label: "Cout moyen / livraison", value: "$125" },
          { label: "Efficacite de la flotte", value: "4.2 / 5.0" },
          { label: "Taux de retour", value: "2.8%" },
        ]}
      />
    </div>
  );
}
