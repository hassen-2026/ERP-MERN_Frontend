import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PlusOutlined } from "@ant-design/icons";

import TemplateSelector from "../../../../templates/TemplateSelector/TemplateSelector";
import FilterForm from "../../../../components/organisms/FilterForm/FilterForm";
import MainDataTable from "../../../../components/organisms/MainDataTable/MainDataTable";
import PageHeader from "../../../../components/organisms/PageHeader/PageHeader";
import { fetchTransporters, deleteTransporterThunk } from "../../../../redux/reducers/TransportersReducer";
import "../../Supplier_Pages/SupplierPage/SupplierPage.css";

function TransporterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const transportersState = useSelector((state) => state.transporters || {});
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    dispatch(fetchTransporters());
  }, [dispatch]);

  const rows = transportersState.items || [];

  const filteredRows = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase();
    if (!normalizedSearch) return rows;

    return rows.filter((item) => [item.name, item.plateNumber, item.cin].join(" ").toLowerCase().includes(normalizedSearch));
  }, [rows, searchValue]);

  const columns = [
    { key: "name", header: "Nom" },
    { key: "plateNumber", header: "Immatriculation" },
    { key: "cin", header: "CIN" },
    { key: "createdAt", header: "Créé le" },
  ];

  const filterFields = [
    {
      type: "input",
      id: "transporter-search",
      label: "Rechercher",
      placeholder: "Nom, plaque, CIN...",
      value: searchValue,
      onChange: (event) => setSearchValue(event.target.value),
    },
  ];

  const headerActions = [
    {
      id: "add-transporter",
      label: "+ Ajouter Transporteur",
      className: "p-supplier-toolbar-btn p-supplier-toolbar-btn--add",
      icon: <PlusOutlined />,
      onClick: () => navigate("/transporters/add"),
    },
  ];

  return (
    <TemplateSelector>
      <div className="p-supplier-page">
        <PageHeader
          title="Gestion des Transporteurs"
          subtitle="Gérez les transporteurs utilisés pour les livraisons."
          actions={headerActions}
          containerClassName="p-supplier-page__header"
          titleClassName="p-supplier-page__title"
          subtitleClassName="p-supplier-page__subtitle"
          actionsClassName="p-supplier-page__header-actions"
          defaultActionVariant="secondary"
        />

        <FilterForm
          fields={filterFields}
          sectionClassName="p-card p-supplier-page__filters"
          gridClassName="p-supplier-page__filters-grid"
          fieldClassName="p-supplier-page__field"
          controlClassName="p-supplier-page__control"
          labelClassName="p-field__label"
        />

        <MainDataTable
          title="Liste des transporteurs"
          rows={filteredRows}
          columns={columns}
          getActions={(row) => [
            {
              id: `edit-${row.id}`,
              kind: "edit",
              onClick: () => navigate(`/transporters/${row.id}/edit`),
            },
            {
              id: `delete-${row.id}`,
              kind: "delete",
              onClick: async () => {
                if (!window.confirm(`Supprimer le transporteur ${row.name} ?`)) return;
                await dispatch(deleteTransporterThunk(row.id));
              },
            },
          ]}
          loading={Boolean(transportersState.loading)}
          error={transportersState.error || ""}
          loadingMessage="Chargement des transporteurs..."
          emptyMessage="Aucun transporteur disponible."
          sectionClassName="o-movements"
          titleClassName="o-movements__title"
          tableClassName="o-movements__table p-table p-supplier-page__table"
          stateRowClassName="p-data-table__state"
          errorRowClassName="p-data-table__state--error"
          getRowKey={(row, index) => row?.id ?? index}
        />
      </div>
    </TemplateSelector>
  );
}

export default TransporterPage;
