import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import DashboardTemplate from "../../../../../templates/TemplateAdmin/TemplateAdmin";
import PageHeader from "../../../../../components/organisms/PageHeader/PageHeader";
import Overview from "../../../../../components/organisms/Overview/Overview";
import { fetchHrContracts, fetchHrLeaves } from "../../../../../redux/reducers/HrReducer";
import "../../../Supplier_Pages/SupplierDetailPage/SupplierDetailPage.css";

function LeaveDetailPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const hrState = useSelector((state) => state.hr || {});
  const leaveState = hrState.leaves || {};
  const contractState = hrState.contracts || {};
  const leaves = leaveState.items || [];
  const contracts = contractState.items || [];

  useEffect(() => {
    if (!leaves.length && !leaveState.loading) {
      dispatch(fetchHrLeaves());
    }
    if (!contracts.length && !contractState.loading) {
      dispatch(fetchHrContracts());
    }
  }, [contractState.loading, contracts.length, dispatch, leaveState.loading, leaves.length]);

  const leave = useMemo(() => leaves.find((l) => String(l.id) === String(id)) || null, [leaves, id]);
  const employeeLeaves = useMemo(
    () => leaves.filter((item) => String(item.employeeId) === String(leave?.employeeId || "") && String(item.id) !== String(id)),
    [id, leave?.employeeId, leaves],
  );
  const employeeContracts = useMemo(
    () => contracts.filter((item) => String(item.employeeId) === String(leave?.employeeId || "")),
    [contracts, leave?.employeeId],
  );

  const leaveColumns = [
    { key: "leaveType", header: "Type" },
    { key: "startDate", header: "Début" },
    { key: "endDate", header: "Fin" },
    { key: "totalDays", header: "Jours" },
    {
      key: "statusLabel",
      header: "Statut",
      render: (row) => (
        <span
          className={`p-pill ${row?.status === "APPROVED" ? "p-pill--stock" : row?.status === "PENDING" ? "p-pill--warning" : "p-pill--danger"}`.trim()}
        >
          {row?.statusLabel || row?.status || "-"}
        </span>
      ),
    },
  ];

  const contractColumns = [
    { key: "contractType", header: "Type" },
    { key: "startDate", header: "Début" },
    { key: "endDate", header: "Fin" },
    {
      key: "salaryBase",
      header: "Salaire",
      render: (row) => Number(row?.salaryBase || 0).toLocaleString("fr-FR", { style: "currency", currency: "TND" }),
    },
    {
      key: "statusLabel",
      header: "Statut",
      render: (row) => (
        <span
          className={`p-pill ${row?.status === "ACTIVE" ? "p-pill--stock" : row?.status === "DRAFT" ? "p-pill--category" : "p-pill--danger"}`.trim()}
        >
          {row?.statusLabel || "-"}
        </span>
      ),
    },
  ];

  const headerActions = [
    {
      id: "back-leaves",
      label: "Retour",
      className: "p-supplier-toolbar-btn",
      onClick: () => navigate("/rh/leaves"),
    },
  ];

  const infoRows = [
    { label: "Employe", value: leave?.employeeName || "-" },
    { label: "Type de Conge", value: leave?.leaveType || "-" },
    { label: "Statut", value: leave?.statusLabel || "-" },
    { label: "Date de Debut", value: leave?.startDate || "-" },
    { label: "Date de Fin", value: leave?.endDate || "-" },
    { label: "Nombre de Jours", value: leave?.totalDays || "-" },
    { label: "Motif / Raison", value: leave?.reason || "-" },
    { label: "Commentaire Decision", value: leave?.decisionComment || "-" },
    { label: "Demande par", value: leave?.requestedByName || "-" },
    { label: "Approuve par", value: leave?.approvedByName || "-" },
    { label: "Cree le", value: leave?.createdAt || "-" },
  ];

  const tableSections = [
    {
      title: "Autres congés du même employé",
      rows: employeeLeaves,
      columns: leaveColumns,
      loading: Boolean(leaveState.loading),
      error: leaveState.error || "",
      loadingMessage: "Chargement des congés...",
      emptyMessage: "Aucun autre congé trouvé pour cet employé.",
      sectionClassName: "p-table",
      tableClassName: "p-table",
      stateRowClassName: "p-supplier-page__state",
      errorRowClassName: "p-supplier-page__state--error",
      getRowKey: (row, index) => row?.id ?? index,
    },
    {
      title: "Contrats de l'employé",
      rows: employeeContracts,
      columns: contractColumns,
      loading: Boolean(contractState.loading),
      error: contractState.error || "",
      loadingMessage: "Chargement des contrats...",
      emptyMessage: "Aucun contrat trouvé pour cet employé.",
      sectionClassName: "p-table",
      tableClassName: "p-table",
      stateRowClassName: "p-supplier-page__state",
      errorRowClassName: "p-supplier-page__state--error",
      getRowKey: (row, index) => row?.id ?? index,
    },
  ];

  return (
    <DashboardTemplate>
      <div className="p-supplier-page">
        <PageHeader
          title={`Demande de Conge - ${leave?.employeeName || "Detail Conge"}`}
          subtitle={leave?.leaveType || ""}
          actions={headerActions}
          containerClassName="p-supplier-page__header"
          titleClassName="p-supplier-page__title"
          subtitleClassName="p-supplier-page__subtitle"
          actionsClassName="p-supplier-page__header-actions"
          defaultActionVariant="secondary"
        />

        {!leaveState?.loading && !leave ? (
          <div className="p-card p-supplier-page__state">Demande de conge non trouvee</div>
        ) : null}

        {leave ? (
          <Overview
            item={leave}
            itemSectionTitle="Détails de la demande de congé"
            infoRows={infoRows}
            tableSections={tableSections}
            movementsContainerClassName="p-overview__movements-container"
          />
        ) : null}
      </div>
    </DashboardTemplate>
  );
}

export default LeaveDetailPage;
