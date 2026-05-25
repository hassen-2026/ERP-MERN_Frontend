import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PlusOutlined, EyeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import TemplateSelector from "../../../../../templates/TemplateSelector/TemplateSelector";
import StatCard from "../../../../../components/molecules/StatCard/StatCard";
import FilterForm from "../../../../../components/organisms/FilterForm/FilterForm";
import MainDataTable from "../../../../../components/organisms/MainDataTable/MainDataTable";
import PageHeader from "../../../../../components/organisms/PageHeader/PageHeader";
import { deleteHrTrainingThunk, fetchHrTrainings } from "../../../../../redux/reducers/HrReducer";
import "../../../Supplier_Pages/SupplierPage/SupplierPage.css";

function TrainingPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const trainingState = useSelector((state) => state.hr?.trainings || {});
  const trainings = trainingState.items || [];
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    dispatch(fetchHrTrainings());
  }, [dispatch]);

  const filteredTrainings = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase();
    return trainings.filter((training) => {
      if (statusFilter && training.status !== statusFilter) return false;
      if (!normalizedSearch) return true;
      const haystack = [training.title, training.provider, training.statusLabel, training.summary].join(" ").toLowerCase();
      return haystack.includes(normalizedSearch);
    });
  }, [trainings, searchValue, statusFilter]);

  const stats = useMemo(() => [
    { value: trainings.length, label: "Formations", containerClassName: "p-stat-card", defaultValueClassName: "p-stat-card__value", defaultLabelClassName: "p-stat-card__label" },
    { value: trainings.filter((item) => item.status === "PLANNED").length, label: "Planifiées", containerClassName: "p-stat-card", defaultValueClassName: "p-stat-card__value", defaultLabelClassName: "p-stat-card__label" },
    { value: trainings.filter((item) => item.status === "COMPLETED").length, label: "Terminées", containerClassName: "p-stat-card", defaultValueClassName: "p-stat-card__value", defaultLabelClassName: "p-stat-card__label" },
  ], [trainings]);

  const columns = [
    { key: "title", header: "Formation" },
    { key: "provider", header: "Organisme" },
    { key: "startDate", header: "Début" },
    { key: "endDate", header: "Fin" },
    { key: "participantsCount", header: "Participants" },
    { key: "budget", header: "Budget" },
    { key: "statusLabel", header: "Statut" },
  ];

  return (
    <TemplateSelector>
      <div className="p-supplier-page">
        <PageHeader
          title="Gestion RH - Formations"
          subtitle="Planification et suivi des programmes de formation."
          actions={[{ id: "add-training", label: "+ Ajouter Formation", className: "p-supplier-toolbar-btn p-supplier-toolbar-btn--add", icon: <PlusOutlined />, onClick: () => navigate("/rh/trainings/add") }]}
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
            { type: "input", id: "training-search", label: "Rechercher", placeholder: "Titre, organisme, résumé...", value: searchValue, onChange: (event) => setSearchValue(event.target.value) },
            { type: "select", id: "training-status", label: "Statut", value: statusFilter || undefined, placeholder: "Tous les statuts", options: [{ label: "Planifiée", value: "PLANNED" }, { label: "En cours", value: "IN_PROGRESS" }, { label: "Terminée", value: "COMPLETED" }, { label: "Annulée", value: "CANCELLED" }], onChange: (value) => setStatusFilter(value || "") },
          ]}
          sectionClassName="p-card p-supplier-page__filters"
          gridClassName="p-supplier-page__filters-grid"
          fieldClassName="p-supplier-page__field"
          controlClassName="p-supplier-page__control"
          labelClassName="p-field__label"
        />

        <MainDataTable
          title="Liste des formations"
          rows={filteredTrainings}
          columns={columns}
          getActions={(training) => [
            { id: `detail-${training.id}`, label: "Détail", icon: <EyeOutlined />, variant: "primary", onClick: () => navigate(`/rh/trainings/${training.id}/detail`) },
            { id: `edit-${training.id}`, kind: "edit", onClick: () => navigate(`/rh/trainings/${training.id}/edit`) },
            { id: `delete-${training.id}`, kind: "delete", onClick: async () => { if (!window.confirm(`Supprimer la formation ${training.title} ?`)) return; await dispatch(deleteHrTrainingThunk(training.id)); } },
          ]}
          loading={Boolean(trainingState.loading)}
          error={trainingState.error || trainingState.deleteError || ""}
          loadingMessage="Chargement des formations..."
          emptyMessage="Aucune formation disponible."
          tableClassName="o-movements__table p-table p-supplier-page__table"
          getRowKey={(row, index) => row?.id ?? index}
        />
      </div>
    </TemplateSelector>
  );
}

export default TrainingPage;
