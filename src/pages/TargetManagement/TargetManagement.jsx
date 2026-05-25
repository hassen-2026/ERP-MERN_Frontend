import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PlusOutlined } from "@ant-design/icons";

import TemplateSelector from "../../templates/TemplateSelector/TemplateSelector";
import Alert from "../../components/atoms/alert/Alert";
import StatCard from "../../components/molecules/StatCard/StatCard";
import PageHeader from "../../components/organisms/PageHeader/PageHeader";
import FilterForm from "../../components/organisms/FilterForm/FilterForm";
import MainDataTable from "../../components/organisms/MainDataTable/MainDataTable";
import TargetDetailsModal from "../../components/organisms/TargetDetailsModal/TargetDetailsModal";
import { TARGET_PAGE_DEFAULTS } from "./defaults/targetPage_default";
import { getAllTargets, deleteTarget } from "../../services/targetApi";
import "../Admin_Pages/Product_Pages/ProductPage/ProductPage.css";
import "./TargetManagement.css";

const TARGET_STATUSES = [
  { label: "Brouillon", value: "DRAFT", color: "default" },
  { label: "Actif", value: "ACTIVE", color: "blue" },
  { label: "Atteint", value: "ACHIEVED", color: "green" },
  { label: "Manqué", value: "MISSED", color: "red" },
];

function TargetManagement() {
  const navigate = useNavigate();
  const location = useLocation();
  const { shellProps, title, subtitle, filters, statsClassName, statCardProps } = TARGET_PAGE_DEFAULTS;

  const [targets, setTargets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [searchValue, setSearchValue] = useState(filters.search.value);
  const [statusValue, setStatusValue] = useState(filters.status);
  const [detailsModal, setDetailsModal] = useState(false);
  const [selectedTarget, setSelectedTarget] = useState(null);

  const fetchTargets = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getAllTargets();
      setTargets(Array.isArray(response?.data) ? response.data : Array.isArray(response) ? response : []);
    } catch (fetchError) {
      setError(fetchError?.response?.data?.message || fetchError.message || "Impossible de charger les objectifs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTargets();
  }, []);

  useEffect(() => {
    const incomingMessage = location.state?.successMessage;
    if (!incomingMessage) return;

    setSuccessMessage(incomingMessage);
    navigate(location.pathname, { replace: true, state: {} });

    const timeoutId = setTimeout(() => setSuccessMessage(""), 4000);
    return () => clearTimeout(timeoutId);
  }, [location.pathname, location.state, navigate]);

  const filteredTargets = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase();

    return [...targets]
      .filter((target) => {
        const matchesSearch =
          !normalizedSearch ||
          [target.name, target.description, target.notes, target.department?.name]
            .join(" ")
            .toLowerCase()
            .includes(normalizedSearch);

        const matchesStatus = statusValue === "all" || !statusValue || target.status === statusValue;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [targets, searchValue, statusValue]);

  const stats = useMemo(() => ([
    { value: targets.length, label: "Objectifs", ...statCardProps },
    { value: targets.filter((target) => target.status !== "DRAFT").length, label: "Actifs", ...statCardProps },
    { value: targets.filter((target) => target.status === "ACHIEVED").length, label: "Atteints", ...statCardProps },
    { value: targets.filter((target) => target.isWarning).length, label: "En alerte", ...statCardProps },
  ]), [statCardProps, targets]);

  const headerActions = [
    {
      id: "add-target",
      label: "+ Nouvel Objectif",
      className: "p-target-toolbar-btn p-target-toolbar-btn--add",
      icon: <PlusOutlined />,
      onClick: () => navigate("/objectifs/add"),
    },
  ];

  const filterFields = useMemo(() => ([
    {
      type: "input",
      id: "target-search",
      label: "Rechercher",
      placeholder: filters.search.placeholder,
      value: searchValue,
      onChange: (event) => setSearchValue(event.target.value),
    },
    {
      type: "select",
      id: "target-status",
      label: "Statut",
      value: statusValue,
      options: [{ label: "Tous", value: "all" }, ...TARGET_STATUSES.map((item) => ({ label: item.label, value: item.value }))],
      onChange: (value) => setStatusValue(value),
    },
  ]), [filters.search.placeholder, searchValue, statusValue]);

  const columns = [
    { key: "name", header: "Nom" },
    { key: "period", header: "Période", render: (row) => `${row.month}/${row.year}` },
    { key: "targetValue", header: "Objectif", render: (row) => `${Number(row.targetValue || 0).toLocaleString("fr-TN")} DT` },
    { key: "actualValue", header: "Réalisé", render: (row) => `${Number(row.actualValue || 0).toLocaleString("fr-TN")} DT` },
    {
      key: "progressPercentage",
      header: "Progression",
      render: (row) => {
        const progress = row.progressPercentage || 0;
        const color = progress >= 100 ? "#52c41a" : progress >= (row.warningThreshold || 80) ? "#faad14" : "#184f87";

        return (
          <div className="p-target-page__progress-cell">
            <div className="p-target-page__progress-bar" style={{ backgroundColor: `${color}33` }}>
              <span style={{ width: `${Math.min(progress, 100)}%`, backgroundColor: color }} />
            </div>
            <span className="p-target-page__progress-value">{progress}%</span>
          </div>
        );
      },
    },
    {
      key: "status",
      header: "Statut",
      render: (row) => {
        const statusConfig = TARGET_STATUSES.find((item) => item.value === row.status) || {};
        return <span className={`p-pill ${statusConfig.color ? `p-pill--${statusConfig.color}` : ""}`.trim()}>{statusConfig.label || row.status}</span>;
      },
    },
  ];

  return (
    <TemplateSelector {...shellProps}>
      <div className="p-target-page">
        {error ? <Alert type="error" message={error} showIcon /> : null}
        {successMessage ? <Alert type="success" message={successMessage} showIcon closable onClose={() => setSuccessMessage("")} customClassName="p-target-page__success-alert" /> : null}

        <PageHeader
          title={title}
          subtitle={subtitle}
          actions={headerActions}
          containerClassName="p-target-page__header"
          titleClassName="p-target-page__title"
          subtitleClassName="p-target-page__subtitle"
          actionsClassName="p-target-page__header-actions"
          defaultActionVariant="secondary"
        />

        <section className={`p-dashboard__stats ${statsClassName}`.trim()}>
          {stats.map((stat) => (
            <StatCard key={`${stat.label}-${stat.value}`} {...stat} />
          ))}
        </section>

        <FilterForm
          fields={filterFields}
          sectionClassName="p-card p-target-page__filters"
          gridClassName="p-target-page__filters-grid"
          fieldClassName="p-target-page__field"
          controlClassName="p-target-page__control"
          labelClassName="p-field__label"
        />

        <MainDataTable
          title="Liste des objectifs"
          rows={filteredTargets}
          columns={columns}
          loading={loading}
          error={error || ""}
          loadingMessage="Chargement des objectifs..."
          emptyMessage="Aucun objectif disponible."
          sectionClassName="o-movements"
          titleClassName="o-movements__title"
          tableClassName="o-movements__table p-table p-target-page__table"
          stateRowClassName="p-data-table__state"
          errorRowClassName="p-data-table__state--error"
          getActions={(row) => [
            {
              id: `view-${row._id}`,
              kind: "view",
              onClick: () => {
                setSelectedTarget(row);
                setDetailsModal(true);
              },
            },
            {
              id: `edit-${row._id}`,
              kind: "edit",
              disabled: row.status === "ACHIEVED",
                onClick: () => navigate(`/objectifs/${row._id}/edit`),
            },
            {
              id: `delete-${row._id}`,
              kind: "delete",
              onClick: async () => {
                if (!window.confirm(`Supprimer l'objectif ${row.name} ?`)) return;
                await deleteTarget(row._id);
                fetchTargets();
              },
            },
          ]}
          getRowKey={(row, index) => row?._id ?? index}
        />

        <TargetDetailsModal
          open={detailsModal}
          target={selectedTarget}
          statuses={TARGET_STATUSES}
          onClose={() => setDetailsModal(false)}
        />
      </div>
    </TemplateSelector>
  );
}

export default TargetManagement;