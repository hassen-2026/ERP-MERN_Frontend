import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import DashboardTemplate from "../../../../../templates/TemplateAdmin/TemplateAdmin";
import PageHeader from "../../../../../components/organisms/PageHeader/PageHeader";
import Overview from "../../../../../components/organisms/Overview/Overview";
import { fetchHrDepartments, fetchHrEmployees, fetchHrPositions } from "../../../../../redux/reducers/HrReducer";
import "../../../Supplier_Pages/SupplierDetailPage/SupplierDetailPage.css";

function DepartmentDetailPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const hrState = useSelector((state) => state.hr || {});
  const departments = hrState.departments?.items || [];
  const employees = hrState.employees?.items || [];
  const positions = hrState.positions?.items || [];

  useEffect(() => {
    if (!departments.length) {
      dispatch(fetchHrDepartments());
    }
    if (!employees.length) {
      dispatch(fetchHrEmployees());
    }
    if (!positions.length) {
      dispatch(fetchHrPositions());
    }
  }, [departments.length, dispatch, employees.length, positions.length]);

  const department = useMemo(() => departments.find((d) => String(d.id) === String(id)) || null, [departments, id]);

  const departmentEmployees = useMemo(() => employees.filter((e) => String(e.departmentId) === String(id)), [employees, id]);
  const departmentPositions = useMemo(() => positions.filter((position) => String(position.departmentId) === String(id)), [id, positions]);

  const employeeColumns = [
    { key: "employeeCode", header: "Code" },
    { key: "fullName", header: "Nom" },
    { key: "positionName", header: "Poste" },
    { key: "hireDate", header: "Embauche" },
    {
      key: "statusLabel",
      header: "Statut",
      render: (row) => (
        <span
          className={`p-pill ${row?.status === "ACTIVE" ? "p-pill--stock" : row?.status === "ON_LEAVE" ? "p-pill--warning" : "p-pill--danger"}`.trim()}
        >
          {row?.statusLabel || "-"}
        </span>
      ),
    },
  ];

  const positionColumns = [
    { key: "title", header: "Titre" },
    { key: "level", header: "Niveau" },
    { key: "description", header: "Description" },
    {
      key: "isActive",
      header: "Statut",
      render: (row) => <span className={`p-pill ${row?.isActive ? "p-pill--stock" : "p-pill--danger"}`.trim()}>{row?.isActive ? "Actif" : "Inactif"}</span>,
    },
  ];

  const headerActions = [
    {
      id: "edit-department",
      label: "Modifier",
      className: "p-supplier-toolbar-btn p-supplier-toolbar-btn--add",
      onClick: () => navigate(`/rh/departments/${id}/edit`),
    },
    {
      id: "back-departments",
      label: "Retour",
      className: "p-supplier-toolbar-btn",
      onClick: () => navigate("/rh/departments"),
    },
  ];

  const infoRows = [
    { label: "Nom", value: department?.name || "-" },
    { label: "Code", value: department?.code || "-" },
    { label: "Description", value: department?.description || "-" },
    { label: "Manager", value: department?.managerName || "-" },
    { label: "Nombre d'Employes", value: departmentEmployees.length },
    { label: "Nombre de Postes", value: departmentPositions.length },
    { label: "Etat", value: department?.isActive ? "Actif" : "Inactif" },
    { label: "Cree le", value: department?.createdAt || "-" },
  ];

  const tableSections = [
    {
      title: "Employés du département",
      rows: departmentEmployees,
      columns: employeeColumns,
      loading: Boolean(hrState.employees?.loading),
      error: hrState.employees?.error || "",
      loadingMessage: "Chargement des employés...",
      emptyMessage: "Aucun employé rattaché à ce département.",
      sectionClassName: "p-table",
      tableClassName: "p-table",
      stateRowClassName: "p-supplier-page__state",
      errorRowClassName: "p-supplier-page__state--error",
      getRowKey: (row, index) => row?.id ?? index,
    },
    {
      title: "Postes du département",
      rows: departmentPositions,
      columns: positionColumns,
      loading: Boolean(hrState.positions?.loading),
      error: hrState.positions?.error || "",
      loadingMessage: "Chargement des postes...",
      emptyMessage: "Aucun poste rattaché à ce département.",
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
          title={`Departement - ${department?.name || "Detail Departement"}`}
          subtitle={department?.code || ""}
          actions={headerActions}
          containerClassName="p-supplier-page__header"
          titleClassName="p-supplier-page__title"
          subtitleClassName="p-supplier-page__subtitle"
          actionsClassName="p-supplier-page__header-actions"
          defaultActionVariant="secondary"
        />

        {!hrState.departments?.loading && !department ? (
          <div className="p-card p-supplier-page__state">Departement non trouve</div>
        ) : null}

        {department ? (
          <Overview
            item={department}
            itemSectionTitle="Informations département"
            infoRows={infoRows}
            tableSections={tableSections}
            movementsContainerClassName="p-overview__movements-container"
          />
        ) : null}
      </div>
    </DashboardTemplate>
  );
}

export default DepartmentDetailPage;
