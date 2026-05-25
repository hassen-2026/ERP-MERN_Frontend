import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PlusOutlined, EyeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import TemplateSelector from "../../../../../templates/TemplateSelector/TemplateSelector";
import StatCard from "../../../../../components/molecules/StatCard/StatCard";
import FilterForm from "../../../../../components/organisms/FilterForm/FilterForm";
import MainDataTable from "../../../../../components/organisms/MainDataTable/MainDataTable";
import PageHeader from "../../../../../components/organisms/PageHeader/PageHeader";
import { deleteHrEvaluationThunk, fetchHrEvaluations, fetchHrEmployees } from "../../../../../redux/reducers/HrReducer";
import "../../../Supplier_Pages/SupplierPage/SupplierPage.css";

function EvaluationPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const evaluationState = useSelector((state) => state.hr?.evaluations || {});
  const employeeState = useSelector((state) => state.hr?.employees || {});
  const evaluations = evaluationState.items || [];
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    dispatch(fetchHrEvaluations());
    if (!employeeState.items?.length && !employeeState.loading) dispatch(fetchHrEmployees());
  }, [dispatch, employeeState.items?.length, employeeState.loading]);

  const filteredEvaluations = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase();
    return evaluations.filter((evaluation) => {
      if (statusFilter && evaluation.status !== statusFilter) return false;
      if (!normalizedSearch) return true;
      const haystack = [evaluation.employeeName, evaluation.periodLabel, evaluation.statusLabel, evaluation.summary].join(" ").toLowerCase();
      return haystack.includes(normalizedSearch);
    });
  }, [evaluations, searchValue, statusFilter]);

  const stats = useMemo(() => [
    { value: evaluations.length, label: "Évaluations", containerClassName: "p-stat-card", defaultValueClassName: "p-stat-card__value", defaultLabelClassName: "p-stat-card__label" },
    { value: evaluations.filter((item) => Number(item.overallScore || 0) >= 80).length, label: "Très bonnes", containerClassName: "p-stat-card", defaultValueClassName: "p-stat-card__value", defaultLabelClassName: "p-stat-card__label" },
    { value: evaluations.filter((item) => item.status === "PENDING").length, label: "En attente", containerClassName: "p-stat-card", defaultValueClassName: "p-stat-card__value", defaultLabelClassName: "p-stat-card__label" },
  ], [evaluations]);

  const columns = [
    { key: "employeeName", header: "Employé" },
    { key: "periodLabel", header: "Période" },
    { key: "overallScore", header: "Score" },
    { key: "technicalScore", header: "Technique" },
    { key: "behaviorScore", header: "Comportement" },
    { key: "goalScore", header: "Objectifs" },
    { key: "statusLabel", header: "Statut" },
  ];

  return (
    <TemplateSelector>
      <div className="p-supplier-page">
        <PageHeader
          title="Gestion RH - Évaluations"
          subtitle="Suivi des performances et des objectifs."
          actions={[{ id: "add-evaluation", label: "+ Ajouter Évaluation", className: "p-supplier-toolbar-btn p-supplier-toolbar-btn--add", icon: <PlusOutlined />, onClick: () => navigate("/rh/evaluations/add") }]}
          containerClassName="p-supplier-page__header"
          titleClassName="p-supplier-page__title"
          subtitleClassName="p-supplier-page__subtitle"
          actionsClassName="p-supplier-page__header-actions"
          defaultActionVariant="secondary"
        />

        <section className="p-dashboard__stats">
          {stats.map((stat) => <StatCard key={`${stat.label}-${stat.value}`} {...stat} />)}
        </section>

        <FilterForm
          fields={[
            { type: "input", id: "evaluation-search", label: "Rechercher", placeholder: "Employé, période, résumé...", value: searchValue, onChange: (event) => setSearchValue(event.target.value) },
            { type: "select", id: "evaluation-status", label: "Statut", value: statusFilter || undefined, placeholder: "Tous les statuts", options: [{ label: "Brouillon", value: "DRAFT" }, { label: "En attente", value: "PENDING" }, { label: "Validée", value: "APPROVED" }, { label: "Rejetée", value: "REJECTED" }], onChange: (value) => setStatusFilter(value || "") },
          ]}
          sectionClassName="p-card p-supplier-page__filters"
          gridClassName="p-supplier-page__filters-grid"
          fieldClassName="p-supplier-page__field"
          controlClassName="p-supplier-page__control"
          labelClassName="p-field__label"
        />

        <MainDataTable
          title="Liste des évaluations"
          rows={filteredEvaluations}
          columns={columns}
          getActions={(evaluation) => [
            { id: `detail-${evaluation.id}`, label: "Détail", icon: <EyeOutlined />, variant: "primary", onClick: () => navigate(`/rh/evaluations/${evaluation.id}/detail`) },
            { id: `edit-${evaluation.id}`, kind: "edit", onClick: () => navigate(`/rh/evaluations/${evaluation.id}/edit`) },
            { id: `delete-${evaluation.id}`, kind: "delete", onClick: async () => { if (!window.confirm(`Supprimer l'évaluation de ${evaluation.employeeName} ?`)) return; await dispatch(deleteHrEvaluationThunk(evaluation.id)); } },
          ]}
          loading={Boolean(evaluationState.loading)}
          error={evaluationState.error || evaluationState.deleteError || ""}
          loadingMessage="Chargement des évaluations..."
          emptyMessage="Aucune évaluation disponible."
          tableClassName="o-movements__table p-table p-supplier-page__table"
          getRowKey={(row, index) => row?.id ?? index}
        />
      </div>
    </TemplateSelector>
  );
}

export default EvaluationPage;
