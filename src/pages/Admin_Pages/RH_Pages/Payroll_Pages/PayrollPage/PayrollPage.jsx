import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PlusOutlined, EyeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import DashboardTemplate from "../../../../../templates/TemplateAdmin/TemplateAdmin";
import StatCard from "../../../../../components/molecules/StatCard/StatCard";
import FilterForm from "../../../../../components/organisms/FilterForm/FilterForm";
import MainDataTable from "../../../../../components/organisms/MainDataTable/MainDataTable";
import PageHeader from "../../../../../components/organisms/PageHeader/PageHeader";
import { deleteHrPayrollThunk, fetchHrPayrolls } from "../../../../../redux/reducers/HrReducer";
import "../../../Supplier_Pages/SupplierPage/SupplierPage.css";

function PayrollPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const payrollState = useSelector((state) => state.hr?.payrolls || {});
  const payrolls = payrollState.items || [];
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    dispatch(fetchHrPayrolls());
  }, [dispatch]);

  const filteredPayrolls = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase();
    return payrolls.filter((payroll) => {
      if (statusFilter && payroll.status !== statusFilter) return false;
      if (!normalizedSearch) return true;
      const haystack = [payroll.employeeName, payroll.periodLabel, payroll.statusLabel].join(" ").toLowerCase();
      return haystack.includes(normalizedSearch);
    });
  }, [payrolls, searchValue, statusFilter]);

  const stats = useMemo(() => [
    { value: payrolls.length, label: "Paies", containerClassName: "p-stat-card", defaultValueClassName: "p-stat-card__value", defaultLabelClassName: "p-stat-card__label" },
    { value: payrolls.filter((item) => item.status === "PAID").length, label: "Payées", containerClassName: "p-stat-card", defaultValueClassName: "p-stat-card__value", defaultLabelClassName: "p-stat-card__label" },
    { value: payrolls.filter((item) => item.status === "PENDING").length, label: "En attente", containerClassName: "p-stat-card", defaultValueClassName: "p-stat-card__value", defaultLabelClassName: "p-stat-card__label" },
  ], [payrolls]);

  const columns = [
    { key: "employeeName", header: "Employé" },
    { key: "periodLabel", header: "Période" },
    { key: "grossSalary", header: "Brut" },
    { key: "deductions", header: "Retenues" },
    { key: "netSalary", header: "Net" },
    { key: "statusLabel", header: "Statut" },
  ];

  return (
    <DashboardTemplate>
      <div className="p-supplier-page">
        <PageHeader
          title="Gestion RH - Paie"
          subtitle="Préparation et suivi des bulletins de paie."
          actions={[{ id: "add-payroll", label: "+ Ajouter Paie", className: "p-supplier-toolbar-btn p-supplier-toolbar-btn--add", icon: <PlusOutlined />, onClick: () => navigate("/rh/payrolls/add") }]}
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
            { type: "input", id: "payroll-search", label: "Rechercher", placeholder: "Employé, période...", value: searchValue, onChange: (event) => setSearchValue(event.target.value) },
            { type: "select", id: "payroll-status", label: "Statut", value: statusFilter || undefined, placeholder: "Tous les statuts", options: [{ label: "Brouillon", value: "DRAFT" }, { label: "En attente", value: "PENDING" }, { label: "Payée", value: "PAID" }, { label: "Bloquée", value: "BLOCKED" }], onChange: (value) => setStatusFilter(value || "") },
          ]}
          sectionClassName="p-card p-supplier-page__filters"
          gridClassName="p-supplier-page__filters-grid"
          fieldClassName="p-supplier-page__field"
          controlClassName="p-supplier-page__control"
          labelClassName="p-field__label"
        />

        <MainDataTable
          title="Liste des paies"
          rows={filteredPayrolls}
          columns={columns}
          getActions={(payroll) => [
            { id: `detail-${payroll.id}`, label: "Détail", icon: <EyeOutlined />, variant: "primary", onClick: () => navigate(`/rh/payrolls/${payroll.id}/detail`) },
            { id: `edit-${payroll.id}`, kind: "edit", onClick: () => navigate(`/rh/payrolls/${payroll.id}/edit`) },
            { id: `delete-${payroll.id}`, kind: "delete", onClick: async () => { if (!window.confirm(`Supprimer la paie de ${payroll.employeeName} ?`)) return; await dispatch(deleteHrPayrollThunk(payroll.id)); } },
          ]}
          loading={Boolean(payrollState.loading)}
          error={payrollState.error || payrollState.deleteError || ""}
          loadingMessage="Chargement des paies..."
          emptyMessage="Aucune paie disponible."
          tableClassName="o-movements__table p-table p-supplier-page__table"
          getRowKey={(row, index) => row?.id ?? index}
        />
      </div>
    </DashboardTemplate>
  );
}

export default PayrollPage;
