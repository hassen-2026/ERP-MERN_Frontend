import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FileTextOutlined, PlusOutlined } from "@ant-design/icons";

import TemplateSelector from "../../../../templates/TemplateSelector/TemplateSelector";
import FilterForm from "../../../../components/organisms/FilterForm/FilterForm";
import MainDataTable from "../../../../components/organisms/MainDataTable/MainDataTable";
import PageHeader from "../../../../components/organisms/PageHeader/PageHeader";
import { fetchLivraisons } from "../../../../redux/reducers/LivraisonsReducer";
import "../../Supplier_Pages/SupplierPage/SupplierPage.css";

function LivraisonPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const livraisonsState = useSelector((state) => state.livraisons || {});
  const [searchValue, setSearchValue] = useState("");
  const [statusValue, setStatusValue] = useState("all");

  useEffect(() => {
    dispatch(fetchLivraisons());
  }, [dispatch]);

  const rows = livraisonsState.items || [];

  const filteredRows = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase();
    return rows.filter((row) => {
      const matchesSearch =
        !normalizedSearch ||
        [row.deliveryNumber, row.transporterName, row.createdByName, row.note].join(" ").toLowerCase().includes(normalizedSearch);
      const matchesStatus = statusValue === "all" || row.status === statusValue;
      return matchesSearch && matchesStatus;
    });
  }, [rows, searchValue, statusValue]);

  const columns = [
    { key: "deliveryNumber", header: "Numéro" },
    { key: "date", header: "Date" },
    { key: "bonCommandeNumber", header: "Bon de commande" },
    { key: "transporterName", header: "Transporteur" },
    {
      key: "statusLabel",
      header: "Statut",
      render: (row) => <span className={`p-pill ${row.status === "DELIVERED" ? "p-pill--stock" : row.status === "CANCELLED" ? "p-pill--danger" : "p-pill--warning"}`.trim()}>{row.statusLabel}</span>,
    },
    { key: "commandeCount", header: "Commandes" },
    { key: "itemCount", header: "Items" },
    {
      key: "totalHT",
      header: "HT",
      render: (row) => Number(row.totalHT || 0).toLocaleString("fr-TN", { style: "currency", currency: "TND" }),
    },
    {
      key: "tvaAmount",
      header: "TVA",
      render: (row) => Number(row.tvaAmount || 0).toLocaleString("fr-TN", { style: "currency", currency: "TND" }),
    },
    { key: "totalAmountDisplay", header: "TTC" },
  ];

  const headerActions = [
    {
      id: "add-livraison",
      label: "+ Ajouter Livraison",
      className: "p-supplier-toolbar-btn p-supplier-toolbar-btn--add",
      icon: <PlusOutlined />,
      onClick: () => navigate("/livraisons/add"),
    },
  ];

  const filterFields = [
    {
      type: "input",
      id: "livraison-search",
      label: "Rechercher",
      placeholder: "Numéro, transporteur, créateur...",
      value: searchValue,
      onChange: (event) => setSearchValue(event.target.value),
    },
    {
      type: "select",
      id: "livraison-status",
      label: "Statut",
      value: statusValue,
      options: [
        { label: "Tous", value: "all" },
        { label: "Planifiée", value: "PLANNED" },
        { label: "Livrée", value: "DELIVERED" },
        { label: "Annulée", value: "CANCELLED" },
      ],
      onChange: (value) => setStatusValue(value),
    },
  ];

  return (
    <TemplateSelector>
      <div className="p-supplier-page">
        <PageHeader
          title="Gestion des Livraisons"
          subtitle="Livraison par items de commande."
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
          gridClassName="p-product-page__filters-grid"
          fieldClassName="p-supplier-page__field"
          controlClassName="p-supplier-page__control"
          labelClassName="p-field__label"
        />

        <MainDataTable
          title="Liste des livraisons"
          rows={filteredRows}
          columns={columns}
          getActions={(row) => [
            {
              id: `detail-${row.id}`,
              kind: "detail",
              label: "Détail",
              onClick: () => navigate(`/livraisons/${row.id}`),
            },
            {
              id: `bl-template-${row.id}`,
              label: "Template Bon",
              icon: <FileTextOutlined />,
              variant: "secondary",
              className: "m-action-buttons__btn",
              onClick: () => navigate(`/livraisons/${row.id}/bon-template`),
            },
          ]}
          loading={Boolean(livraisonsState.loading)}
          error={livraisonsState.error || ""}
          loadingMessage="Chargement des livraisons..."
          emptyMessage="Aucune livraison disponible."
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

export default LivraisonPage;
