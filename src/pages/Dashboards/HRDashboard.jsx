import React, { useEffect, useMemo, useState } from "react";
import {
  BarChartWidget,
  MultiLineChartWidget,
  LineChartWidget,
  PieChartWidget,
  DashboardStatsGrid,
} from "../../components/DashboardLayout";
import LoadingSpinner from "../../components/molecules/LoadingSpinner/LoadingSpinner";
import Alert from "../../components/atoms/alert/Alert";
import DashboardChartsSection from "../../components/organisms/DashboardChartsSection/DashboardChartsSection";
import DashboardKPIsSection from "../../components/organisms/DashboardKPIsSection/DashboardKPIsSection";
import apiClient from "../../services/apiClient";
import "./HRDashboard.css";

export default function HRDashboard() {
  const [summary, setSummary] = useState(null);
  const [monthlySeries, setMonthlySeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadHrDashboard = async () => {
      try {
        setLoading(true);
        setError(null);

        const months = Array.from({ length: 6 }, (_value, index) => {
          const monthDate = new Date();
          monthDate.setMonth(monthDate.getMonth() - (5 - index));
          monthDate.setDate(1);
          return monthDate;
        });

        const [summaryResponse, ...monthlyResponses] = await Promise.all([
          apiClient.get("/hr/summary"),
          ...months.map((monthDate) =>
            apiClient.get("/hr/reports/monthly", {
              params: { month: monthDate.toISOString() },
            })
          ),
        ]);

        if (!isMounted) return;

        setSummary(summaryResponse.data || {});
        setMonthlySeries(
          monthlyResponses.map((response, index) => {
            const monthDate = months[index];
            return {
              month: monthDate.toLocaleString("fr-FR", { month: "short" }),
              newEmployees: response.data?.newEmployees || 0,
              leaveApproved: response.data?.leaveApproved || 0,
              trainingsCompleted: response.data?.trainingsCompleted || 0,
              payrollPaid: response.data?.payrollPaid || 0,
              evaluationsCompleted: response.data?.evaluationsCompleted || 0,
              candidatesHired: response.data?.candidatesHired || 0,
            };
          })
        );
      } catch (fetchError) {
        if (!isMounted) return;
        setError(fetchError?.response?.data?.message || "Impossible de charger le tableau de bord RH.");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadHrDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  const dashboardStats = useMemo(() => [
    {
      title: "Employes totaux",
      value: summary?.employeeCount ?? "-",
      color: "#184f87",
    },
    {
      title: "Conges en attente",
      value: summary?.pendingLeaves ?? "-",
      color: "#faad14",
    },
    {
      title: "Recrutements en cours",
      value: summary?.candidatesOpen ?? "-",
      color: "#eb2f96",
    },
    {
      title: "Contrats actifs",
      value: summary?.activeContracts ?? "-",
      color: "#52c41a",
    },
  ], [summary]);

  const activityBreakdown = useMemo(() => {
    if (!summary) return [];

    return [
      { name: "Employes", value: summary.employeeCount || 0 },
      { name: "Contrats", value: summary.activeContracts || 0 },
      { name: "Conges", value: summary.pendingLeaves || 0 },
      { name: "Recrutement", value: summary.candidatesOpen || 0 },
      { name: "Formation", value: summary.trainingsPlanned || 0 },
    ];
  }, [summary]);

  const activityColors = ["#184f87", "#1890ff", "#faad14", "#eb2f96", "#52c41a"];

  const operationalData = useMemo(() => {
    if (!summary) return [];

    return [
      { metric: "Departements", count: summary.departmentsCount || 0 },
      { metric: "Postes", count: summary.positionsCount || 0 },
      { metric: "Contrats expirants", count: summary.expiringContracts || 0 },
      { metric: "Documents expirants", count: summary.expiringDocuments || 0 },
      { metric: "Paies ce mois", count: summary.payrollsThisMonth || 0 },
    ];
  }, [summary]);

  return (
    <div className="hr-dashboard">
      {/* MOLECULE: LoadingSpinner - Replaces Ant Design Spin */}
      {loading && <LoadingSpinner size="large" tip="Chargement du tableau de bord RH..." />}

      {/* ATOM: Alert - Replaces Ant Design Alert */}
      {error && <Alert type="error" message={error} showIcon />}

      {/* MOLECULE: DashboardStatsGrid - Stats KPI cards */}
      <DashboardStatsGrid stats={dashboardStats} />

      {/* ORGANISM: DashboardChartsSection - Encapsulates Row/Col for charts */}
      <DashboardChartsSection
        charts={[
          {
            span: 12,
            component: (
              <MultiLineChartWidget
                title="Activite RH mensuelle"
                data={monthlySeries}
                xAxis="month"
                lines={[
                  { key: "newEmployees", color: "#184f87" },
                  { key: "trainingsCompleted", color: "#52c41a" },
                  { key: "candidatesHired", color: "#eb2f96" },
                ]}
                height={300}
              />
            ),
          },
          {
            span: 12,
            component: (
              <BarChartWidget
                title="Vue operationnelle"
                data={operationalData}
                dataKey="count"
                xAxis="metric"
                height={300}
              />
            ),
          },
        ]}
      />

      {/* ORGANISM: DashboardChartsSection - Workload & Structure */}
      <DashboardChartsSection
        charts={[
          {
            span: 12,
            component: (
              <PieChartWidget
                title="Repartition de la charge RH"
                data={activityBreakdown}
                colors={activityColors}
                height={300}
              />
            ),
          },
          {
            span: 12,
            component: (
              <BarChartWidget
                title="Apercu de la structure RH"
                data={operationalData}
                dataKey="count"
                xAxis="metric"
                height={300}
              />
            ),
          },
        ]}
      />

      {/* ORGANISM: DashboardChartsSection - Recruitment */}
      <DashboardChartsSection
        charts={[
          {
            span: 24,
            component: (
              <LineChartWidget
                title="Rapport RH mensuel"
                data={monthlySeries}
                dataKey="payrollPaid"
                xAxis="month"
                height={300}
              />
            ),
          },
        ]}
      />

      {/* ORGANISM: DashboardKPIsSection - KPI metrics */}
      <DashboardKPIsSection
        kpis={[
          {
            label: "Satisfaction des employes",
            value: "Donnees en attente",
          },
          {
            label: "Heures de formation / employe",
            value: summary?.trainingsPlanned ?? "-",
          },
          {
            label: "Taux de rotation annuel",
            value: "Donnees en attente",
          },
          {
            label: "Delai moyen de recrutement",
            value: "Donnees en attente",
          },
        ]}
      />
    </div>
  );
}
