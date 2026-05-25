import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { PlusOutlined, SwapOutlined, DownloadOutlined } from "@ant-design/icons";

import TemplateSelector from "../../../../templates/TemplateSelector/TemplateSelector";
import Alert from "../../../../components/atoms/alert/Alert";
import StatCard from "../../../../components/molecules/StatCard/StatCard";
import FilterForm from "../../../../components/organisms/FilterForm/FilterForm";
import MainDataTable from "../../../../components/organisms/MainDataTable/MainDataTable";
import PageHeader from "../../../../components/organisms/PageHeader/PageHeader";
import { fetchDevis, deleteDevisThunk, updateDevisThunk } from "../../../../redux/reducers/DevisReducer";
import { downloadDevisPdf } from "../../../../services/devisApi";
import "../../Product_Pages/ProductPage/ProductPage.css";

function DevisPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const devisState = useSelector((state) => state.devis || {});
  const [searchValue, setSearchValue] = useState("");
  const [statusValue, setStatusValue] = useState("all");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => { dispatch(fetchDevis()); }, [dispatch]);

  useEffect(() => {
    const incomingMessage = location.state?.successMessage;
    if (!incomingMessage) return;
    setSuccessMessage(incomingMessage);
    navigate(location.pathname, { replace: true, state: {} });
    const timeoutId = setTimeout(() => setSuccessMessage(""), 4000);
    return () => clearTimeout(timeoutId);
  }, [location.pathname, location.state, navigate]);

  const devis = devisState.items || [];

  const headerActions = [
    {
      id: "add-devis",
      label: "+ Ajouter Devis",
      className: "p-product-toolbar-btn p-product-toolbar-btn--add",
      icon: <PlusOutlined />,
      onClick: () => navigate("/devis/add"),
    },
  ];

  const filteredDevis = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase();

    return devis.filter((item) => {
      const matchesSearch = !normalizedSearch || [item.quoteNumber, item.clientName, item.createdByName].join(" ").toLowerCase().includes(normalizedSearch);
      const matchesStatus = statusValue === "all" || item.status === statusValue;
      return matchesSearch && matchesStatus;
    });
  }, [devis, searchValue, statusValue]);

  const stats = useMemo(() => [
    { value: devis.length, label: "Devis", containerClassName: "p-stat-card", defaultValueClassName: "p-stat-card__value", defaultLabelClassName: "p-stat-card__label" },
    { value: devis.filter((item) => item.status === "ACCEPTED").length, label: "Acceptés", containerClassName: "p-stat-card", defaultValueClassName: "p-stat-card__value", defaultLabelClassName: "p-stat-card__label" },
    { value: devis.filter((item) => item.status === "REJECTED").length, label: "Refusés", containerClassName: "p-stat-card", defaultValueClassName: "p-stat-card__value", defaultLabelClassName: "p-stat-card__label" },
  ], [devis]);

  const filterFields = [
    { type: "input", id: "devis-search", label: "Rechercher", placeholder: "Numéro, client, créateur...", value: searchValue, onChange: (event) => setSearchValue(event.target.value) },
    {
      type: "select",
      id: "devis-status",
      label: "Statut",
      value: statusValue,
      options: [
        { label: "Tous", value: "all" },
        { label: "Brouillon", value: "DRAFT" },
        { label: "Envoyé", value: "SENT" },
        { label: "Accepté", value: "ACCEPTED" },
        { label: "Refusé", value: "REJECTED" },
      ],
      onChange: (value) => setStatusValue(value),
    },
  ];

  const columns = [
    { key: "quoteNumber", header: "Numéro" },
    { key: "clientName", header: "Client" },
    {
      key: "statusLabel",
      header: "Statut",
      render: (row) => <span className={`p-pill ${row.status === "ACCEPTED" ? "p-pill--stock" : row.status === "REJECTED" ? "p-pill--danger" : "p-pill--warning"}`.trim()}>{row.statusLabel}</span>,
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
    { key: "createdByName", header: "Créé par" },
  ];

  return (
    <TemplateSelector>
      <div className="p-product-page">
        <PageHeader
          title="Gestion des Devis"
          subtitle="Suivez les devis et leur conversion vers la commande."
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
          title="Liste des devis"
          rows={filteredDevis}
          columns={columns}
          getActions={(row) => [
            {
              id: `download-pdf-${row.id}`,
              label: "PDF",
              icon: <DownloadOutlined />,
              variant: "info",
              className: "m-action-buttons__btn--download",
              disabled: devisState.updating,
              onClick: async () => {
                try {
                  const blob = await downloadDevisPdf(row.id);
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `devis-${row.quoteNumber}.pdf`;
                  document.body.appendChild(a);
                  a.click();
                  window.URL.revokeObjectURL(url);
                  document.body.removeChild(a);
                } catch (error) {
                  console.error("Erreur lors du téléchargement du PDF:", error);
                  alert("Erreur lors du téléchargement du PDF");
                }
              },
            },
            {
              id: `convert-${row.id}`,
              label: "Accepté",
              icon: <SwapOutlined />,
              variant: "success",
              className: "m-action-buttons__btn--receive",
              disabled: row.status === "ACCEPTED" || row.status === "REJECTED" || devisState.updating,
              onClick: async () => {
                if (!window.confirm(`Marquer le devis ${row.quoteNumber} comme accepté ?`)) return;

                const payload = {
                  clientId: row.clientId,
                  status: "ACCEPTED",
                  date: row.dateIso || undefined,
                  file: row.file || "",
                  items: row.items || [],
                };

                const result = await dispatch(updateDevisThunk(row.id, payload));
                if (result?.success) {
                  setSuccessMessage(`Devis ${row.quoteNumber} marqué comme accepté avec succès.`);
                }
              },
            },
            {
              id: `edit-${row.id}`,
              kind: "edit",
              onClick: () => navigate(`/devis/${row.id}/edit`),
            },
            {
              id: `delete-${row.id}`,
              kind: "delete",
              onClick: async () => {
                if (!window.confirm(`Supprimer le devis ${row.quoteNumber} ?`)) return;
                await dispatch(deleteDevisThunk(row.id));
              },
            },
          ]}
          loading={Boolean(devisState.loading)}
          error={devisState.error || ""}
          loadingMessage="Chargement des devis..."
          emptyMessage="Aucun devis disponible."
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

export default DevisPage;