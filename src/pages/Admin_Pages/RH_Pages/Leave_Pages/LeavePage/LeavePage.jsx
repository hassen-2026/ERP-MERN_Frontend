import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PlusOutlined, EyeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import DashboardTemplate from "../../../../../templates/TemplateAdmin/TemplateAdmin";
import StatCard from "../../../../../components/molecules/StatCard/StatCard";
import FilterForm from "../../../../../components/organisms/FilterForm/FilterForm";
import MainDataTable from "../../../../../components/organisms/MainDataTable/MainDataTable";
import PageHeader from "../../../../../components/organisms/PageHeader/PageHeader";
import {
  approveHrLeaveThunk,
  cancelHrLeaveThunk,
  fetchHrLeaves,
  rejectHrLeaveThunk,
} from "../../../../../redux/reducers/HrReducer";
import "../../../Supplier_Pages/SupplierPage/SupplierPage.css";

function LeavePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const leaveState = useSelector((state) => state.hr?.leaves || {});
  const leaves = leaveState.items || [];
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    dispatch(fetchHrLeaves());
  }, [dispatch]);

  const filteredLeaves = useMemo(() => {
    if (!statusFilter) return leaves;
    return leaves.filter((leave) => leave.status === statusFilter);
  }, [leaves, statusFilter]);

  const stats = useMemo(() => {
    const total = leaves.length;
    const pending = leaves.filter((leave) => leave.status === "PENDING").length;
    const approved = leaves.filter((leave) => leave.status === "APPROVED").length;

    return [
      {
        value: total,
        label: "Demandes",
        containerClassName: "p-stat-card",
        defaultValueClassName: "p-stat-card__value",
        defaultLabelClassName: "p-stat-card__label",
      },
      {
        value: pending,
        label: "En attente",
        containerClassName: "p-stat-card",
        defaultValueClassName: "p-stat-card__value",
        defaultLabelClassName: "p-stat-card__label",
      },
      {
        value: approved,
        label: "Approuvees",
        containerClassName: "p-stat-card",
        defaultValueClassName: "p-stat-card__value",
        defaultLabelClassName: "p-stat-card__label",
      },
    ];
  }, [leaves]);

  const columns = [
    { key: "employeeName", header: "Employe" },
    { key: "leaveType", header: "Type" },
    {
      key: "status",
      header: "Statut",
      render: (leave) => {
        const statusClass =
          leave.status === "APPROVED"
            ? "p-pill--stock"
            : leave.status === "PENDING"
              ? "p-pill--warning"
              : leave.status === "REJECTED"
                ? "p-pill--danger"
                : leave.status === "CANCELLED"
                  ? "p-pill--default"
                  : "p-pill--default";
        return <span className={`p-pill ${statusClass}`.trim()}>{leave.statusLabel || leave.status}</span>;
      },
    },
    { key: "startDate", header: "Debut" },
    { key: "endDate", header: "Fin" },
    { key: "totalDays", header: "Jours" },
    { key: "reason", header: "Motif" },
  ];

  return (
    <DashboardTemplate>
      <div className="p-supplier-page">
        <PageHeader
          title="Gestion RH - Conges"
          subtitle="Validez, rejetez ou suivez les demandes de conges."
          actions={[
            {
              id: "add-leave",
              label: "+ Ajouter Demande",
              className: "p-supplier-toolbar-btn p-supplier-toolbar-btn--add",
              icon: <PlusOutlined />,
              onClick: () => navigate("/rh/leaves/add"),
            },
          ]}
          containerClassName="p-supplier-page__header"
          titleClassName="p-supplier-page__title"
          subtitleClassName="p-supplier-page__subtitle"
          actionsClassName="p-supplier-page__header-actions"
          defaultActionVariant="secondary"
        />

        <section className="p-dashboard__stats">
          {stats.map((stat) => (
            <StatCard key={`${stat.label}-${stat.value}`} {...stat} />
          ))}
        </section>

        <FilterForm
          fields={[
            {
              type: "select",
              id: "leave-status",
              label: "Statut",
              value: statusFilter || undefined,
              placeholder: "Tous les statuts",
              options: [
                { label: "En attente", value: "PENDING" },
                { label: "Approuve", value: "APPROVED" },
                { label: "Rejete", value: "REJECTED" },
                { label: "Annule", value: "CANCELLED" },
              ],
              onChange: (value) => setStatusFilter(value || ""),
            },
          ]}
          sectionClassName="p-card p-supplier-page__filters"
          gridClassName="p-supplier-page__filters-grid"
          fieldClassName="p-supplier-page__field"
          controlClassName="p-supplier-page__control"
          labelClassName="p-field__label"
        />

        <MainDataTable
          title="Liste des demandes de conges"
          rows={filteredLeaves}
          columns={columns}
          getActions={(leave) => {
            const actions = [];

            // Bouton détail pour toutes les demandes
            actions.push({
              id: `detail-${leave.id}`,
              label: "Détail",
              icon: <EyeOutlined />,
              variant: "primary",
              onClick: async () => {
                // Navigate to detail page or open modal
                navigate(`/rh/leaves/${leave.id}/detail`);
              },
            });

            if (leave.status === "PENDING") {
              actions.push(
                {
                  id: `approve-${leave.id}`,
                  label: "Approuver",
                  variant: "success",
                  className: "m-action-buttons__btn--receive",
                  onClick: async () => {
                    await dispatch(approveHrLeaveThunk(leave.id));
                  },
                },
                {
                  id: `reject-${leave.id}`,
                  label: "Rejeter",
                  variant: "warning",
                  className: "m-action-buttons__btn--edit",
                  onClick: async () => {
                    await dispatch(rejectHrLeaveThunk(leave.id));
                  },
                },
                {
                  id: `cancel-${leave.id}`,
                  kind: "delete",
                  label: "Annuler",
                  onClick: async () => {
                    await dispatch(cancelHrLeaveThunk(leave.id));
                  },
                },
              );
            }

            return actions;
          }}
          loading={Boolean(leaveState.loading || leaveState.processing)}
          error={leaveState.error || leaveState.processError || ""}
          loadingMessage="Chargement des conges..."
          emptyMessage="Aucune demande de conge disponible."
          tableClassName="o-movements__table p-table p-supplier-page__table"
          getRowKey={(leave, index) => leave?.id ?? index}
        />
      </div>
    </DashboardTemplate>
  );
}

export default LeavePage;
