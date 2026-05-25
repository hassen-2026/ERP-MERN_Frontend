import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import DashboardTemplate from "../../../../templates/TemplateAdmin/TemplateAdmin";
import StatCard from "../../../../components/molecules/StatCard/StatCard";
import MainDataTable from "../../../../components/organisms/MainDataTable/MainDataTable";
import PageHeader from "../../../../components/organisms/PageHeader/PageHeader";
import { fetchHrAlertsThunk, fetchHrMonthlyReportThunk, fetchHrSummaryThunk } from "../../../../redux/reducers/HrReducer";
import "../../Supplier_Pages/SupplierPage/SupplierPage.css";

const toTableRows = (value) => {
  if (Array.isArray(value)) return value;
  if (value && typeof value === "object") return Object.entries(value).map(([key, entryValue]) => ({ key, label: key, value: typeof entryValue === "object" ? JSON.stringify(entryValue) : entryValue }));
  return [];
};

function RHInsightsPage() {
  const dispatch = useDispatch();
  const insights = useSelector((state) => state.hr?.insights || {});

  useEffect(() => {
    dispatch(fetchHrSummaryThunk());
    dispatch(fetchHrAlertsThunk());
    dispatch(fetchHrMonthlyReportThunk());
  }, [dispatch]);

  const summaryStats = useMemo(() => {
    const summary = insights.summary || {};
    return [
      { value: summary.totalEmployees ?? 0, label: "Employés", containerClassName: "p-stat-card", defaultValueClassName: "p-stat-card__value", defaultLabelClassName: "p-stat-card__label" },
      { value: summary.activeContracts ?? 0, label: "Contrats actifs", containerClassName: "p-stat-card", defaultValueClassName: "p-stat-card__value", defaultLabelClassName: "p-stat-card__label" },
      { value: summary.openAlerts ?? 0, label: "Alertes", containerClassName: "p-stat-card", defaultValueClassName: "p-stat-card__value", defaultLabelClassName: "p-stat-card__label" },
      { value: summary.pendingRecruitment ?? 0, label: "Recrutement", containerClassName: "p-stat-card", defaultValueClassName: "p-stat-card__value", defaultLabelClassName: "p-stat-card__label" },
    ];
  }, [insights.summary]);

  const alertsRows = useMemo(() => toTableRows(insights.alerts), [insights.alerts]);
  const reportRows = useMemo(() => toTableRows(insights.monthlyReport), [insights.monthlyReport]);

  const alertsColumns = [
    { key: "type", header: "Type" },
    { key: "label", header: "Libellé" },
    { key: "value", header: "Valeur" },
  ];

  const reportColumns = [
    { key: "key", header: "Indicateur" },
    { key: "label", header: "Libellé" },
    { key: "value", header: "Valeur" },
  ];

  return (
    <DashboardTemplate>
      <div className="p-supplier-page">
        <PageHeader title="RH - Pilotage" subtitle="Synthèse, alertes et reporting mensuel." containerClassName="p-supplier-page__header" titleClassName="p-supplier-page__title" subtitleClassName="p-supplier-page__subtitle" />

        <section className="p-dashboard__stats">
          {summaryStats.map((stat) => <StatCard key={`${stat.label}-${stat.value}`} {...stat} />)}
        </section>

        <MainDataTable
          title="Alertes RH"
          rows={alertsRows}
          columns={alertsColumns}
          loading={Boolean(insights.loading)}
          error={insights.error || ""}
          loadingMessage="Chargement des alertes..."
          emptyMessage="Aucune alerte disponible."
          tableClassName="o-movements__table p-table p-supplier-page__table"
          getRowKey={(row, index) => row?.key ?? index}
        />

        <MainDataTable
          title="Reporting mensuel"
          rows={reportRows}
          columns={reportColumns}
          loading={Boolean(insights.loading)}
          error={insights.error || ""}
          loadingMessage="Chargement du reporting..."
          emptyMessage="Aucun reporting disponible."
          tableClassName="o-movements__table p-table p-supplier-page__table"
          getRowKey={(row, index) => row?.key ?? index}
        />
      </div>
    </DashboardTemplate>
  );
}

export default RHInsightsPage;
