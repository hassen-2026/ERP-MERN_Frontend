import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import TemplateSelector from "../../../../../templates/TemplateSelector/TemplateSelector";
import PageHeader from "../../../../../components/organisms/PageHeader/PageHeader";
import Overview from "../../../../../components/organisms/Overview/Overview";
import { fetchHrContracts, fetchHrEmployees, fetchHrLeaves } from "../../../../../redux/reducers/HrReducer";
import "../../../Supplier_Pages/SupplierDetailPage/SupplierDetailPage.css";

function EmployeeDetailPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const hrState = useSelector((state) => state.hr || {});
  const employeeState = hrState.employees || {};
  const contractState = hrState.contracts || {};
  const leaveState = hrState.leaves || {};
  const employees = employeeState.items || [];
  const contracts = contractState.items || [];
  const leaves = leaveState.items || [];

  useEffect(() => {
    if (!employees.length && !employeeState.loading) {
      dispatch(fetchHrEmployees());
    }
    if (!contracts.length && !contractState.loading) {
      dispatch(fetchHrContracts());
    }
    if (!leaves.length && !leaveState.loading) {
      dispatch(fetchHrLeaves());
    }
  }, [contracts.length, contractState.loading, dispatch, employeeState.loading, employees.length, leaveState.loading, leaves.length]);

  const employee = useMemo(() => employees.find((e) => String(e.id) === String(id)) || null, [employees, id]);
  const employeeContracts = useMemo(
    () => contracts.filter((contract) => String(contract.employeeId) === String(id)),
    [contracts, id],
  );
  const employeeLeaves = useMemo(
    () => leaves.filter((leave) => String(leave.employeeId) === String(id)),
    [id, leaves],
  );

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

  const headerActions = [
    {
      id: "edit-employee",
      label: "Modifier",
      className: "p-supplier-toolbar-btn p-supplier-toolbar-btn--add",
      onClick: () => navigate(`/rh/employees/${id}/edit`),
    },
    {
      id: "back-employees",
      label: "Retour",
      className: "p-supplier-toolbar-btn",
      onClick: () => navigate("/rh/employees"),
    },
  ];

  const infoRows = [
    { label: "Code Employe", value: employee?.employeeCode || "-" },
    { label: "CIN", value: employee?.cin || "-" },
    { label: "Nom Complet", value: employee?.fullName || "-" },
    { label: "Genre", value: employee?.gender || "-" },
    { label: "Date de Naissance", value: employee?.birthDate || "-" },
    { label: "Nationalite", value: employee?.nationality || "-" },
    { label: "Email", value: employee?.email || "-" },
    { label: "Telephone", value: employee?.phone || "-" },
    { label: "Departement", value: employee?.departmentName || "-" },
    { label: "Poste", value: employee?.positionName || "-" },
    { label: "Manager", value: employee?.managerName || "-" },
    { label: "Statut", value: employee?.statusLabel || "-" },
    { label: "Date d'Embauche", value: employee?.hireDate || "-" },
    { label: "Cree le", value: employee?.createdAt || "-" },
  ];

  const tableSections = [
    {
      title: "Contrats de l'employé",
      rows: employeeContracts,
      columns: contractColumns,
      loading: Boolean(contractState.loading),
      error: contractState.error || "",
      loadingMessage: "Chargement des contrats...",
      emptyMessage: "Aucun contrat associé à cet employé.",
      sectionClassName: "p-table",
      tableClassName: "p-table",
      stateRowClassName: "p-supplier-page__state",
      errorRowClassName: "p-supplier-page__state--error",
      getRowKey: (row, index) => row?.id ?? index,
    },
    {
      title: "Congés de l'employé",
      rows: employeeLeaves,
      columns: leaveColumns,
      loading: Boolean(leaveState.loading),
      error: leaveState.error || "",
      loadingMessage: "Chargement des congés...",
      emptyMessage: "Aucun congé associé à cet employé.",
      sectionClassName: "p-table",
      tableClassName: "p-table",
      stateRowClassName: "p-supplier-page__state",
      errorRowClassName: "p-supplier-page__state--error",
      getRowKey: (row, index) => row?.id ?? index,
    },
  ];

  const profileImage = employee?.imageUrl ? (
    <img
      src={employee.imageUrl}
      alt={employee.fullName || "Employe"}
      style={{ width: 150, height: 150, borderRadius: "8px", objectFit: "cover" }}
    />
  ) : (
    <div style={{ width: 150, height: 150, borderRadius: "8px", background: "#f2f2f2", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48 }}>
      {String(employee?.fullName || "E").charAt(0)}
    </div>
  );

  return (
    <TemplateSelector>
      <div className="p-supplier-page">
        <PageHeader
          title={employee?.fullName || "Detail Employe"}
          subtitle={employee?.email || ""}
          actions={headerActions}
          containerClassName="p-supplier-page__header"
          titleClassName="p-supplier-page__title"
          subtitleClassName="p-supplier-page__subtitle"
          actionsClassName="p-supplier-page__header-actions"
          defaultActionVariant="secondary"
        />

        {!employeeState?.loading && !employee ? (
          <div className="p-card p-supplier-page__state">Employe non trouve</div>
        ) : null}

        {employee ? (
          <Overview
            item={employee}
            itemSectionTitle="Informations employé"
            infoRows={infoRows}
            infoExtraContent={profileImage ? <div style={{ marginTop: "12px" }}>{profileImage}</div> : null}
            tableSections={tableSections}
            movementsContainerClassName="p-overview__movements-container"
          />
        ) : null}
      </div>
    </TemplateSelector>
  );
}

export default EmployeeDetailPage;
