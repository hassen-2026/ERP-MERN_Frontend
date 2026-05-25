import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { FileTextOutlined, PlusOutlined } from "@ant-design/icons";

import DashboardTemplate from "../../../../templates/TemplateAdmin/TemplateAdmin";
import Alert from "../../../../components/atoms/alert/Alert";
import StatCard from "../../../../components/molecules/StatCard/StatCard";
import FilterForm from "../../../../components/organisms/FilterForm/FilterForm";
import MainDataTable from "../../../../components/organisms/MainDataTable/MainDataTable";
import PageHeader from "../../../../components/organisms/PageHeader/PageHeader";
import { fetchClients, deleteClientThunk } from "../../../../redux/reducers/ClientReducer";
import "../../Supplier_Pages/SupplierPage/SupplierPage.css";

function ClientPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const clientsState = useSelector((state) => state.clients || {});
  const clients = clientsState.items || [];
  const [searchValue, setSearchValue] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    dispatch(fetchClients());
  }, [dispatch]);

  useEffect(() => {
    const incomingMessage = location.state?.successMessage;

    if (!incomingMessage) return;

    setSuccessMessage(incomingMessage);
    navigate(location.pathname, { replace: true, state: {} });

    const timeoutId = setTimeout(() => setSuccessMessage(""), 4000);
    return () => clearTimeout(timeoutId);
  }, [location.pathname, location.state, navigate]);

  const headerActions = [
    {
      id: "add-client",
      label: "+ Ajouter Client",
      className: "p-supplier-toolbar-btn p-supplier-toolbar-btn--add",
      icon: <PlusOutlined />,
      onClick: () => navigate("/clients/add"),
    },
  ];

  const filteredClients = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase();

    if (!normalizedSearch) return clients;

    return clients.filter((client) => {
      const haystack = [client.nom, client.telephone, client.adresse].join(" ").toLowerCase();
      return haystack.includes(normalizedSearch);
    });
  }, [clients, searchValue]);

  const stats = useMemo(() => [
    { value: clients.length, label: "Clients", containerClassName: "p-stat-card", defaultValueClassName: "p-stat-card__value", defaultLabelClassName: "p-stat-card__label" },
    { value: new Set(clients.map((client) => client.address).filter(Boolean)).size, label: "Villes", containerClassName: "p-stat-card", defaultValueClassName: "p-stat-card__value", defaultLabelClassName: "p-stat-card__label" },
    { value: new Set(clients.map((client) => client.phone).filter(Boolean)).size, label: "Contacts uniques", containerClassName: "p-stat-card", defaultValueClassName: "p-stat-card__value", defaultLabelClassName: "p-stat-card__label" },
  ], [clients]);

  const filterFields = [
    {
      type: "input",
      id: "client-search",
      label: "Rechercher",
      placeholder: "Nom, téléphone, adresse...",
      value: searchValue,
      onChange: (event) => setSearchValue(event.target.value),
    },
  ];

  const columns = [
    { key: "nom", header: "Nom" },
    { key: "telephone", header: "Téléphone" },
    { key: "adresse", header: "Adresse" },
    { key: "createdAt", header: "Créé le" },
  ];

  return (
    <DashboardTemplate>
      <div className="p-supplier-page">
        <PageHeader
          title="Gestion des Clients"
          subtitle="Consultez les clients et gérez leur fiche rapidement."
          actions={headerActions}
          containerClassName="p-supplier-page__header"
          titleClassName="p-supplier-page__title"
          subtitleClassName="p-supplier-page__subtitle"
          actionsClassName="p-supplier-page__header-actions"
          defaultActionVariant="secondary"
        />

        {successMessage ? <Alert customClassName="p-product-page__success-alert" message={successMessage} type="success" showIcon closable onClose={() => setSuccessMessage("")} /> : null}

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
          title="Liste des clients"
          rows={filteredClients}
          columns={columns}
          getActions={(client) => [
            {
              id: `devis-${client.id}`,
              label: "Devis",
              icon: <FileTextOutlined />,
              variant: "warning",
              className: "m-action-buttons__btn--edit",
              onClick: () => navigate("/devis/add", { state: { sourceClient: client } }),
            },
            {
              id: `edit-${client.id}`,
              kind: "edit",
              onClick: () => navigate(`/clients/${client.id}/edit`),
            },
            {
              id: `delete-${client.id}`,
              kind: "delete",
              onClick: async () => {
                if (!window.confirm(`Supprimer le client ${client.nom} ?`)) return;
                await dispatch(deleteClientThunk(client.id));
              },
            },
          ]}
          loading={Boolean(clientsState.loading)}
          error={clientsState.error || ""}
          loadingMessage="Chargement des clients..."
          emptyMessage="Aucun client disponible."
          sectionClassName="o-movements"
          titleClassName="o-movements__title"
          tableClassName="o-movements__table p-table p-supplier-page__table"
          stateRowClassName="p-data-table__state"
          errorRowClassName="p-data-table__state--error"
          getRowKey={(client, index) => client?.id ?? index}
        />
      </div>
    </DashboardTemplate>
  );
}

export default ClientPage;