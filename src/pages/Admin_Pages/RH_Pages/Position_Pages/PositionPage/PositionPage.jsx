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
  deleteHrPositionThunk,
  fetchHrDepartments,
  fetchHrPositions,
} from "../../../../../redux/reducers/HrReducer";
import "../../../Supplier_Pages/SupplierPage/SupplierPage.css";

function PositionPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const positionState = useSelector((state) => state.hr?.positions || {});
  const positions = positionState.items || [];

  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    dispatch(fetchHrPositions());
    dispatch(fetchHrDepartments());
  }, [dispatch]);

  const filteredPositions = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase();

    return positions.filter((position) => {
      const matchesStatus = !statusFilter || (statusFilter === "ACTIVE" ? position.isActive : !position.isActive);
      if (!matchesStatus) return false;

      if (!normalizedSearch) return true;

      const haystack = [position.title, position.level, position.departmentName, position.description].join(" ").toLowerCase();
      return haystack.includes(normalizedSearch);
    });
  }, [positions, searchValue, statusFilter]);

  const stats = useMemo(() => {
    const total = positions.length;
    const active = positions.filter((position) => position.isActive).length;
    const inactive = positions.filter((position) => !position.isActive).length;

    return [
      {
        value: total,
        label: "Postes",
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
  }, [positions]);

  const filterFields = [
    {
      type: "input",
      id: "position-search",
      label: "Rechercher",
      placeholder: "Intitule, niveau, departement...",
      value: searchValue,
      onChange: (event) => setSearchValue(event.target.value),
    },
    {
      type: "select",
      id: "position-status",
      label: "Statut",
      value: statusFilter || undefined,
      placeholder: "Tous les statuts",
      options: [
        { label: "Actif", value: "ACTIVE" },
        { label: "Inactif", value: "INACTIVE" },
      ],
      onChange: (value) => setStatusFilter(value || ""),
    },
  ];

  const columns = [
    { key: "title", header: "Intitule" },
    { key: "level", header: "Niveau" },
    { key: "departmentName", header: "Departement" },
    { key: "description", header: "Description" },
    {
      key: "isActive",
      header: "Statut",
      render: (row) => (row.isActive ? "Actif" : "Inactif"),
    },
  ];

  return (
    <DashboardTemplate>
      <div className="p-supplier-page">
        <PageHeader
          title="Gestion RH - Postes"
          subtitle="Administrez les postes et leur rattachement aux departements."
          actions={[
            {
              id: "add-position",
              label: "+ Ajouter Poste",
              className: "p-supplier-toolbar-btn p-supplier-toolbar-btn--add",
              icon: <PlusOutlined />,
              onClick: () => navigate("/rh/positions/add"),
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
          fields={filterFields}
          sectionClassName="p-card p-supplier-page__filters"
          gridClassName="p-supplier-page__filters-grid"
          fieldClassName="p-supplier-page__field"
          controlClassName="p-supplier-page__control"
          labelClassName="p-field__label"
        />

        <MainDataTable
          title="Liste des postes"
          rows={filteredPositions}
          columns={columns}
          getActions={(position) => [
            {
              id: `detail-${position.id}`,
              label: "Detail",
              icon: <EyeOutlined />,
              variant: "primary",
              onClick: () => navigate(`/rh/positions/${position.id}/detail`),
            },
            {
              id: `edit-${position.id}`,
              kind: "edit",
              onClick: () => navigate(`/rh/positions/${position.id}/edit`),
            },
            {
              id: `delete-${position.id}`,
              kind: "delete",
              onClick: async () => {
                if (!window.confirm(`Supprimer le poste ${position.title} ?`)) return;
                await dispatch(deleteHrPositionThunk(position.id));
              },
            },
          ]}
          loading={Boolean(positionState.loading)}
          error={positionState.error || positionState.deleteError || ""}
          loadingMessage="Chargement des postes..."
          emptyMessage="Aucun poste disponible."
          tableClassName="o-movements__table p-table p-supplier-page__table"
          getRowKey={(position, index) => position?.id ?? index}
        />
      </div>
    </DashboardTemplate>
  );
}

export default PositionPage;
