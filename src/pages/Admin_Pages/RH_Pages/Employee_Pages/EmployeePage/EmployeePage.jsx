import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PlusOutlined, EyeOutlined, CalendarOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import TemplateSelector from "../../../../../templates/TemplateSelector/TemplateSelector";
import StatCard from "../../../../../components/molecules/StatCard/StatCard";
import FilterForm from "../../../../../components/organisms/FilterForm/FilterForm";
import MainDataTable from "../../../../../components/organisms/MainDataTable/MainDataTable";
import PageHeader from "../../../../../components/organisms/PageHeader/PageHeader";
import {
  deleteHrEmployeeThunk,
  fetchHrDepartments,
  fetchHrEmployees,
  fetchHrPositions,
} from "../../../../../redux/reducers/HrReducer";
import "../../../Supplier_Pages/SupplierPage/SupplierPage.css";

function EmployeePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const hrState = useSelector((state) => state.hr || {});
  const employeeState = hrState.employees || {};
  const employees = employeeState.items || [];

  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    dispatch(fetchHrEmployees());
    dispatch(fetchHrDepartments());
    dispatch(fetchHrPositions());
  }, [dispatch]);

  const headerActions = [
    {
      id: "add-employee",
      label: "+ Ajouter Employe",
      className: "p-supplier-toolbar-btn p-supplier-toolbar-btn--add",
      icon: <PlusOutlined />,
      onClick: () => navigate("/rh/employees/add"),
    },
  ];

  const filteredEmployees = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase();

    return employees.filter((employee) => {
      const matchesStatus = !statusFilter || employee.status === statusFilter;
      if (!matchesStatus) return false;

      if (!normalizedSearch) return true;

      const haystack = [
        employee.employeeCode,
        employee.cin,
        employee.fullName,
        employee.nationality,
        employee.email,
        employee.phone,
        employee.departmentName,
        employee.positionName,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedSearch);
    });
  }, [employees, searchValue, statusFilter]);

  const stats = useMemo(() => {
    const total = employees.length;
    const active = employees.filter((employee) => employee.status === "ACTIVE").length;
    const onLeave = employees.filter((employee) => employee.status === "ON_LEAVE").length;

    return [
      {
        value: total,
        label: "Employes",
        containerClassName: "p-stat-card",
        defaultValueClassName: "p-stat-card__value",
        defaultLabelClassName: "p-stat-card__label",
      },
      {
        value: active,
        label: "Actifs",
        containerClassName: "p-stat-card",
        defaultValueClassName: "p-stat-card__value",
        defaultLabelClassName: "p-stat-card__label",
      },
      {
        value: onLeave,
        label: "En conge",
        containerClassName: "p-stat-card",
        defaultValueClassName: "p-stat-card__value",
        defaultLabelClassName: "p-stat-card__label",
      },
    ];
  }, [employees]);

  const filterFields = [
    {
      type: "input",
      id: "employee-search",
      label: "Rechercher",
      placeholder: "Nom, email, code employe...",
      value: searchValue,
      onChange: (event) => setSearchValue(event.target.value),
    },
    {
      type: "select",
      id: "employee-status",
      label: "Statut",
      value: statusFilter || undefined,
      placeholder: "Tous les statuts",
      options: [
        { label: "Actif", value: "ACTIVE" },
        { label: "Inactif", value: "INACTIVE" },
        { label: "En conge", value: "ON_LEAVE" },
        { label: "Termine", value: "TERMINATED" },
      ],
      onChange: (value) => setStatusFilter(value || ""),
    },
  ];

  const columns = [
    {
      key: "image",
      header: "Image",
      render: (employee) => (
        employee.imageUrl ? (
          <img
            src={employee.imageUrl}
            alt={employee.fullName || "Employe"}
            style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover" }}
            loading="lazy"
          />
        ) : (
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#f2f2f2", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {String(employee.fullName || "E").charAt(0)}
          </div>
        )
      ),
    },
    { key: "employeeCode", header: "Code" },
    { key: "cin", header: "CIN" },
    { key: "fullName", header: "Nom" },
    { key: "gender", header: "Genre" },
    { key: "birthDate", header: "Date naissance" },
    { key: "nationality", header: "Nationalite" },
    { key: "email", header: "Email" },
    { key: "phone", header: "Telephone" },
    { key: "departmentName", header: "Departement" },
    { key: "positionName", header: "Poste" },
    {
      key: "status",
      header: "Statut",
      render: (employee) => {
        const statusClass =
          employee.status === "ACTIVE"
            ? "p-pill--stock"
            : employee.status === "INACTIVE"
              ? "p-pill--danger"
              : employee.status === "ON_LEAVE"
                ? "p-pill--warning"
                : "p-pill--default";
        return <span className={`p-pill ${statusClass}`.trim()}>{employee.statusLabel || employee.status}</span>;
      },
    },
    { key: "hireDate", header: "Date embauche" },
  ];

  return (
    <TemplateSelector>
      <div className="p-supplier-page">
        <PageHeader
          title="Gestion RH - Employes"
          subtitle="Gerez les employes, leur statut et leur rattachement organisationnel."
          actions={headerActions}
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
          fields={filterFields}
          sectionClassName="p-card p-supplier-page__filters"
          gridClassName="p-supplier-page__filters-grid"
          fieldClassName="p-supplier-page__field"
          controlClassName="p-supplier-page__control"
          labelClassName="p-field__label"
        />

        <MainDataTable
          title="Liste des employes"
          rows={filteredEmployees}
          columns={columns}
          getActions={(employee) => [
            {
              id: `detail-${employee.id}`,
              label: "Detail",
              icon: <EyeOutlined />,
              variant: "primary",
              onClick: () => navigate(`/rh/employees/${employee.id}/detail`),
            },
              {
                id: `attendances-${employee.id}`,
                label: "Presences",
                icon: <CalendarOutlined />,
                variant: "secondary",
                onClick: () => navigate(`/rh/employees/${employee.id}/attendances`),
              },
              {
                id: `add-attendance-${employee.id}`,
                label: "+ Presence",
                variant: "secondary",
                onClick: () => navigate(`/rh/employees/${employee.id}/attendance/add`),
              },
            {
              id: `edit-${employee.id}`,
              kind: "edit",
              onClick: () => navigate(`/rh/employees/${employee.id}/edit`),
            },
            {
              id: `delete-${employee.id}`,
              kind: "delete",
              onClick: async () => {
                if (!window.confirm(`Supprimer l'employe ${employee.fullName} ?`)) return;
                await dispatch(deleteHrEmployeeThunk(employee.id));
              },
            },
          ]}
          loading={Boolean(employeeState.loading)}
          error={employeeState.error || ""}
          loadingMessage="Chargement des employes..."
          emptyMessage="Aucun employe disponible."
          tableClassName="o-movements__table p-table p-supplier-page__table"
          getRowKey={(employee, index) => employee?.id ?? index}
        />
      </div>
    </TemplateSelector>
  );
}

export default EmployeePage;
