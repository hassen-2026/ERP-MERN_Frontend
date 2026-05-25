import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { FileTextOutlined, PlusOutlined } from "@ant-design/icons";

import TemplateSelector from "../../../../templates/TemplateSelector/TemplateSelector";
import Alert from "../../../../components/atoms/alert/Alert";
import StatCard from "../../../../components/molecules/StatCard/StatCard";
import FilterForm from "../../../../components/organisms/FilterForm/FilterForm";
import MainDataTable from "../../../../components/organisms/MainDataTable/MainDataTable";
import PageHeader from "../../../../components/organisms/PageHeader/PageHeader";
import { fetchCommandes, deleteCommandeThunk } from "../../../../redux/reducers/CommandeReducer";
import "../../Product_Pages/ProductPage/ProductPage.css";

function CommandePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const commandesState = useSelector((state) => state.commandes || {});
  const [searchValue, setSearchValue] = useState("");
  const [statusValue, setStatusValue] = useState("all");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => { dispatch(fetchCommandes()); }, [dispatch]);

  useEffect(() => {
    const incomingMessage = location.state?.successMessage;
    if (!incomingMessage) return;
    setSuccessMessage(incomingMessage);
    navigate(location.pathname, { replace: true, state: {} });
    const timeoutId = setTimeout(() => setSuccessMessage(""), 4000);
    return () => clearTimeout(timeoutId);
  }, [location.pathname, location.state, navigate]);

  const commandes = commandesState.items || [];

  const headerActions = [
    {
      id: "add-commande",
      label: "+ Ajouter Commande",
      className: "p-product-toolbar-btn p-product-toolbar-btn--add",
      icon: <PlusOutlined />,
      onClick: () => navigate("/commandes/add"),
    },
  ];

  const filteredCommandes = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase();

    return commandes.filter((item) => {
      const matchesSearch = !normalizedSearch || [item.commandeNumber, item.clientName, item.managedByName, item.factureNumber].join(" ").toLowerCase().includes(normalizedSearch);
      const matchesStatus = statusValue === "all" || item.status === statusValue;
      return matchesSearch && matchesStatus;
    });
  }, [commandes, searchValue, statusValue]);

  const stats = useMemo(() => [
    { value: commandes.length, label: "Commandes", containerClassName: "p-stat-card", defaultValueClassName: "p-stat-card__value", defaultLabelClassName: "p-stat-card__label" },
    { value: commandes.filter((item) => item.status === "PARTIALLY_DELIVERED").length, label: "Partiellement livrées", containerClassName: "p-stat-card", defaultValueClassName: "p-stat-card__value", defaultLabelClassName: "p-stat-card__label" },
    { value: commandes.filter((item) => item.status === "DELIVERED").length, label: "Livrées", containerClassName: "p-stat-card", defaultValueClassName: "p-stat-card__value", defaultLabelClassName: "p-stat-card__label" },
    { value: commandes.filter((item) => item.stockApplied).length, label: "Stock appliqué", containerClassName: "p-stat-card", defaultValueClassName: "p-stat-card__value", defaultLabelClassName: "p-stat-card__label" },
  ], [commandes]);

  const filterFields = [
    { type: "input", id: "commande-search", label: "Rechercher", placeholder: "Client, créateur, facture...", value: searchValue, onChange: (event) => setSearchValue(event.target.value) },
    {
      type: "select",
      id: "commande-status",
      label: "Statut",
      value: statusValue,
      options: [
        { label: "Tous", value: "all" },
        { label: "Brouillon", value: "DRAFT" },
        { label: "Confirmée", value: "CONFIRMED" },
        { label: "Partiellement livrée", value: "PARTIALLY_DELIVERED" },
        { label: "Livrée", value: "DELIVERED" },
        { label: "Annulée", value: "CANCELLED" },
      ],
      onChange: (value) => setStatusValue(value),
    },
  ];

  const columns = [
    { key: "commandeNumber", header: "N° Commande" },
    { key: "date", header: "Date" },
    { key: "clientName", header: "Client" },
    {
      key: "statusLabel",
      header: "Statut",
      render: (row) => <span className={`p-pill ${row.status === "DELIVERED" ? "p-pill--stock" : row.status === "CANCELLED" ? "p-pill--danger" : "p-pill--warning"}`.trim()}>{row.statusLabel}</span>,
    },
    { key: "itemsCount", header: "Lignes" },
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
    { key: "factureNumber", header: "Facture" },
  ];

  return (
    <TemplateSelector>
      <div className="p-product-page">
        <PageHeader
          title="Gestion des Commandes"
          subtitle="Pilotez les commandes et leur impact sur le stock."
          actions={headerActions}
          containerClassName="p-product-page__header"
          titleClassName="p-product-page__title"
          subtitleClassName="p-product-page__subtitle"
          actionsClassName="p-product-page__header-actions"
          defaultActionVariant="secondary"
        />

        {successMessage ? <Alert customClassName="p-product-page__success-alert" message={successMessage} type="success" showIcon closable onClose={() => setSuccessMessage("")} /> : null}

        <section className="p-dashboard__stats">
          {stats.map((stat) => <StatCard key={`${stat.label}-${stat.value}`} {...stat} />)}
        </section>

        <FilterForm
          fields={filterFields}
          sectionClassName="p-card p-product-page__filters"
          gridClassName="p-product-page__filters-grid"
          fieldClassName="p-product-page__field"
          controlClassName="p-product-page__control"
          labelClassName="p-field__label"
        />

        <MainDataTable
          title="Liste des commandes"
          rows={filteredCommandes}
          columns={columns}
          getActions={(row) => [
            {
              id: `detail-${row.id}`,
              kind: "detail",
              label: "Détail",
              onClick: () => navigate(`/commandes/${row.id}`),
            },
            {
              id: `edit-${row.id}`,
              kind: "edit",
              disabled: row.stockApplied || Boolean(row.factureNumber && row.factureNumber !== "-"),
              onClick: () => navigate(`/commandes/${row.id}/edit`),
            },
            {
              id: `invoice-template-${row.id}`,
              label: "Template Facture",
              icon: <FileTextOutlined />,
              variant: "secondary",
              className: "m-action-buttons__btn",
              onClick: () => navigate(`/commandes/${row.id}/facture-template`),
            },
            {
              id: `delete-${row.id}`,
              kind: "delete",
              onClick: async () => {
                if (!window.confirm(`Supprimer la commande du ${row.date} ?`)) return;
                await dispatch(deleteCommandeThunk(row.id));
              },
            },
          ]}
          loading={Boolean(commandesState.loading)}
          error={commandesState.error || ""}
          loadingMessage="Chargement des commandes..."
          emptyMessage="Aucune commande disponible."
          sectionClassName="o-movements"
          titleClassName="o-movements__title"
          tableClassName="o-movements__table p-table p-product-page__table"
          stateRowClassName="p-data-table__state"
          errorRowClassName="p-data-table__state--error"
          getRowKey={(row, index) => row?.id ?? index}
        />
      </div>
    </TemplateSelector>
  );
}

export default CommandePage;