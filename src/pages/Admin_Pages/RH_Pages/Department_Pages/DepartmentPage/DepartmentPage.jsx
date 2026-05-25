import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PlusOutlined, EyeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import TemplateSelector from "../../../../../templates/TemplateSelector/TemplateSelector";
import StatCard from "../../../../../components/molecules/StatCard/StatCard";
import FilterForm from "../../../../../components/organisms/FilterForm/FilterForm";
import MainDataTable from "../../../../../components/organisms/MainDataTable/MainDataTable";
import PageHeader from "../../../../../components/organisms/PageHeader/PageHeader";
import {
  deleteHrDepartmentThunk,
  fetchHrDepartments,
} from "../../../../../redux/reducers/HrReducer";
import "../../../Supplier_Pages/SupplierPage/SupplierPage.css";

function DepartmentPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const departmentState = useSelector((state) => state.hr?.departments || {});
  const departments = departmentState.items || [];
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    dispatch(fetchHrDepartments());
  }, [dispatch]);

  const headerActions = [
    {
      id: "add-department",
      label: "+ Ajouter Departement",
      className: "p-supplier-toolbar-btn p-supplier-toolbar-btn--add",
      icon: <PlusOutlined />,
      onClick: () => navigate("/rh/departments/add"),
    },
  ];

  const filteredDepartments = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase();
    if (!normalizedSearch) return departments;

    return departments.filter((department) => {
      const haystack = [department.name, department.code, department.description].join(" ").toLowerCase();
      return haystack.includes(normalizedSearch);
    });
  }, [departments, searchValue]);

  const stats = useMemo(() => {
    const total = departments.length;
    const active = departments.filter((department) => department.isActive).length;
    const inactive = departments.filter((department) => !department.isActive).length;

    return [
      {
        value: total,
        label: "Departements",
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
        value: inactive,
        label: "Inactifs",
        containerClassName: "p-stat-card",
        defaultValueClassName: "p-stat-card__value",
        defaultLabelClassName: "p-stat-card__label",
      },
    ];
  }, [departments]);

  const columns = [
    {
      key: "image",
      header: "Image",
      render: (department) => (
        department.imageUrl ? (
          <img
            src={department.imageUrl}
            alt={department.name || "Departement"}
            style={{ width: 40, height: 40, borderRadius: 8, objectFit: "cover" }}
            loading="lazy"
          />
        ) : (
          <div style={{ width: 40, height: 40, borderRadius: 8, background: "#f2f2f2", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {String(department.name || "D").charAt(0)}
          </div>
        )
      ),
    },
    { key: "name", header: "Nom" },
    { key: "code", header: "Code" },
    { key: "description", header: "Description" },
    { key: "managerName", header: "Responsable" },
    {
      key: "isActive",
      header: "Statut",
      render: (row) => (row.isActive ? "Actif" : "Inactif"),
    },
  ];

  return (
    <TemplateSelector>
      <div className="p-supplier-page">
        <PageHeader
          title="Gestion RH - Departements"
          subtitle="Organisez la structure departementale de votre entreprise."
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
          fields={[
            {
              type: "input",
              id: "department-search",
              label: "Rechercher",
              placeholder: "Nom, code, description...",
              value: searchValue,
              onChange: (event) => setSearchValue(event.target.value),
            },
          ]}
          sectionClassName="p-card p-supplier-page__filters"
          gridClassName="p-supplier-page__filters-grid"
          fieldClassName="p-supplier-page__field"
          controlClassName="p-supplier-page__control"
          labelClassName="p-field__label"
        />

        <MainDataTable
          title="Liste des departements"
          rows={filteredDepartments}
          columns={columns}
          getActions={(department) => [
            {
              id: `detail-${department.id}`,
              label: "Detail",
              icon: <EyeOutlined />,
              variant: "primary",
              onClick: () => navigate(`/rh/departments/${department.id}/detail`),
            },
            {
              id: `edit-${department.id}`,
              kind: "edit",
              onClick: () => navigate(`/rh/departments/${department.id}/edit`),
            },
            {
              id: `delete-${department.id}`,
              kind: "delete",
              onClick: async () => {
                if (!window.confirm(`Supprimer le departement ${department.name} ?`)) return;
                await dispatch(deleteHrDepartmentThunk(department.id));
              },
            },
          ]}
          loading={Boolean(departmentState.loading)}
          error={departmentState.error || ""}
          loadingMessage="Chargement des departements..."
          emptyMessage="Aucun departement disponible."
          tableClassName="o-movements__table p-table p-supplier-page__table"
          getRowKey={(department, index) => department?.id ?? index}
        />
      </div>
    </TemplateSelector>
  );
}

export default DepartmentPage;
