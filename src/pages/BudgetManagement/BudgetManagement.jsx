import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { PlusOutlined } from "@ant-design/icons";

import TemplateSelector from "../../templates/TemplateSelector/TemplateSelector";
import Alert from "../../components/atoms/alert/Alert";
import StatCard from "../../components/molecules/StatCard/StatCard";
import PageHeader from "../../components/organisms/PageHeader/PageHeader";
import FilterForm from "../../components/organisms/FilterForm/FilterForm";
import MainDataTable from "../../components/organisms/MainDataTable/MainDataTable";
import BudgetDetailsModal from "../../components/organisms/BudgetDetailsModal/BudgetDetailsModal";
import { useAllBudgets, useBudgetOperations } from "../../redux/hooks/useBudget";
import { BUDGET_PAGE_DEFAULTS } from "./defaults/budgetPage_default";
import "../Admin_Pages/Product_Pages/ProductPage/ProductPage.css";
import "./BudgetManagement.css";

const BUDGET_STATUSES = [
  { label: "Brouillon", value: "DRAFT", color: "default" },
  { label: "Approuvé", value: "APPROVED", color: "blue" },
  { label: "Actif", value: "ACTIVE", color: "green" },
  { label: "Fermé", value: "CLOSED", color: "orange" },
  { label: "Dépassé", value: "EXCEEDED", color: "red" },
];

export default function BudgetManagement() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    shellProps,
    title,
    subtitle,
    filters,
    statsClassName,
    statCardProps,
  } = BUDGET_PAGE_DEFAULTS;

  const { budgets, loading, error, fetchBudgets } = useAllBudgets();
  const {
    approveBudget,
    deleteBudget,
    approving,
    deleting,
  } = useBudgetOperations();

  const [successMessage, setSuccessMessage] = useState("");
  const [searchValue, setSearchValue] = useState(filters.search.value);
  const [statusValue, setStatusValue] = useState(filters.status);
  const [detailsModal, setDetailsModal] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState(null);

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  useEffect(() => {
    const incomingMessage = location.state?.successMessage;
    if (!incomingMessage) return;

    setSuccessMessage(incomingMessage);
    navigate(location.pathname, { replace: true, state: {} });

    const timeoutId = setTimeout(() => setSuccessMessage(""), 4000);
    return () => clearTimeout(timeoutId);
  }, [location.pathname, location.state, navigate]);

  const filteredBudgets = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase();

    return [...(budgets || [])]
      .filter((budget) => {
        const matchesSearch =
          !normalizedSearch ||
          [
            budget.name,
            budget.description,
            budget.notes,
            budget.createdBy?.firstName,
            budget.createdBy?.lastName,
          ]
            .join(" ")
            .toLowerCase()
            .includes(normalizedSearch);

        const matchesStatus = statusValue === "all" || !statusValue || budget.status === statusValue;

          return matchesSearch && matchesStatus;
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }, [budgets, searchValue, statusValue]);

  const handleApproveBudget = async (budgetId) => {
    try {
      await approveBudget(budgetId);
      fetchBudgets();
    } catch (err) {
      return err;
    }
  };

  const handleDeleteBudget = async (budgetId) => {
    try {
      await deleteBudget(budgetId);
      fetchBudgets();
    } catch (err) {
      return err;
    }
  };

  const headerActions = [
    {
      id: "add-budget",
      label: "+ Nouveau Budget",
      className: "p-product-toolbar-btn p-product-toolbar-btn--add",
      icon: <PlusOutlined />,
      onClick: () => navigate("/budgets/add"),
    },
  ];

  const columns = [
    { key: "name", header: "Nom" },
    { key: "period", header: "Période", render: (row) => `${row.month}/${row.year}` },
    { key: "totalBudget", header: "Budget", render: (row) => `${Number(row.totalBudget || 0).toLocaleString("fr-TN")} DT` },
    { key: "spent", header: "Dépensé", render: (row) => `${Number(row.spent || 0).toLocaleString("fr-TN")} DT` },
    {
      key: "percentageUsed",
      header: "Utilisé",
      render: (row) => {
        const percentage = row.percentageUsed || 0;
        const color = percentage >= 100 ? "#ff4d4f" : percentage >= (row.warningThreshold || 80) ? "#faad14" : "#52c41a";
        return (
          <div className="p-budget-page__progress-cell">
            <div className="p-budget-page__progress-bar" style={{ backgroundColor: `${color}33` }}>
              <span style={{ width: `${Math.min(percentage, 100)}%`, backgroundColor: color }} />
            </div>
            <span className="p-budget-page__progress-value">{percentage}%</span>
          </div>
        );
      },
    },
    {
      key: "available",
      header: "Disponible",
      render: (row) => (
        <span className={Number(row.available || 0) < 0 ? "p-budget-page__negative" : "p-budget-page__positive"}>
          {Number(row.available || 0).toLocaleString("fr-TN")} DT
        </span>
      ),
    },
    {
      key: "status",
      header: "Statut",
      render: (row) => {
        const statusConfig = BUDGET_STATUSES.find((item) => item.value === row.status) || {};
        return <span className={`p-pill ${statusConfig.color ? `p-pill--${statusConfig.color}` : ""}`.trim()}>{statusConfig.label || row.status}</span>;
      },
    },
  ];

  const stats = useMemo(() => ([
    { value: (budgets || []).length, label: "Budgets", ...statCardProps },
    { value: (budgets || []).filter((budget) => budget.status !== "DRAFT").length, label: "Approuvés", ...statCardProps },
    { value: (budgets || []).filter((budget) => budget.isExceeded).length, label: "Dépassés", ...statCardProps },
    { value: (budgets || []).filter((budget) => budget.isWarning).length, label: "En alerte", ...statCardProps },
  ]), [budgets, statCardProps]);

  const filterFields = useMemo(() => ([
    {
      type: "input",
      id: "budget-search",
      label: "Rechercher",
      placeholder: filters.search.placeholder,
      value: searchValue,
      onChange: (event) => setSearchValue(event.target.value),
    },
    {
      type: "select",
      id: "budget-status",
      label: "Statut",
      value: statusValue,
      options: [{ label: "Tous", value: "all" }, ...BUDGET_STATUSES.map((item) => ({ label: item.label, value: item.value }))],
      onChange: (value) => setStatusValue(value),
    },
  ]), [filters.search.placeholder, searchValue, statusValue]);

  return (
    <TemplateSelector {...shellProps}>
      <div className="p-budget-page">
        {error && <Alert type="error" message={error} showIcon />}
        {successMessage ? (
          <Alert
            type="success"
            message={successMessage}
            showIcon
            closable
            onClose={() => setSuccessMessage("")}
            customClassName="p-budget-page__success-alert"
          />
        ) : null}

        <PageHeader
          title={title}
          subtitle={subtitle}
          actions={headerActions}
          containerClassName="p-budget-page__header"
          titleClassName="p-budget-page__title"
          subtitleClassName="p-budget-page__subtitle"
          actionsClassName="p-budget-page__header-actions"
          defaultActionVariant="secondary"
        />

        <section className={`p-dashboard__stats ${statsClassName}`.trim()}>
          {stats.map((stat) => (
            <StatCard key={`${stat.label}-${stat.value}`} {...stat} />
          ))}
        </section>

        <FilterForm
          fields={filterFields}
          sectionClassName="p-card p-budget-page__filters"
          gridClassName="p-budget-page__filters-grid"
          fieldClassName="p-budget-page__field"
          controlClassName="p-budget-page__control"
          labelClassName="p-field__label"
        />

        <MainDataTable
          title="Liste des budgets"
          rows={filteredBudgets}
          columns={columns}
          loading={loading}
          error={error || ''}
          loadingMessage="Chargement des budgets..."
          emptyMessage="Aucun budget disponible."
          sectionClassName="o-movements"
          titleClassName="o-movements__title"
          tableClassName="o-movements__table p-table p-budget-page__table"
          stateRowClassName="p-data-table__state"
          errorRowClassName="p-data-table__state--error"
          getActions={(row) => [
            {
              id: `view-${row._id}`,
              kind: "view",
              onClick: () => {
                setSelectedBudget(row);
                setDetailsModal(true);
              },
            },
            {
              id: `edit-${row._id}`,
              kind: "edit",
              disabled: row.status !== "DRAFT",
              onClick: () => navigate(`/budgets/${row._id}/edit`),
            },
            {
              id: `approve-${row._id}`,
              kind: "receive",
              label: "Approuver",
              disabled: row.status !== "DRAFT" || approving,
              onClick: () => handleApproveBudget(row._id),
            },
            {
              id: `delete-${row._id}`,
              kind: "delete",
              disabled: row.status !== "DRAFT" || deleting,
              onClick: () => handleDeleteBudget(row._id),
            },
          ]}
          getRowKey={(row, index) => row?._id ?? index}
        />

        <BudgetDetailsModal
          open={detailsModal}
          budget={selectedBudget}
          statuses={BUDGET_STATUSES}
          onClose={() => setDetailsModal(false)}
        />
      </div>
    </TemplateSelector>
  );
}
