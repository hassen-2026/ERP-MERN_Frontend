import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { PlusOutlined } from "@ant-design/icons";

import DashboardTemplate from "../../../../templates/TemplateAdmin/TemplateAdmin";
import Alert from "../../../../components/atoms/alert/Alert";
import StatCard from "../../../../components/molecules/StatCard/StatCard";
import FilterForm from "../../../../components/organisms/FilterForm/FilterForm";
import MainDataTable from "../../../../components/organisms/MainDataTable/MainDataTable";
import PageHeader from "../../../../components/organisms/PageHeader/PageHeader";
import { deletePaiementThunk, fetchPaiements } from "../../../../redux/reducers/PaiementReducer";
import "../../Supplier_Pages/SupplierPage/SupplierPage.css";

function PaiementPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const paiementsState = useSelector((state) => state.paiements || {});
  const [searchValue, setSearchValue] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    dispatch(fetchPaiements());
  }, [dispatch]);

  useEffect(() => {
    const incomingMessage = location.state?.successMessage;
    if (!incomingMessage) return;

    setSuccessMessage(incomingMessage);
    navigate(location.pathname, { replace: true, state: {} });

    const timeoutId = setTimeout(() => setSuccessMessage(""), 4000);
    return () => clearTimeout(timeoutId);
  }, [location.pathname, location.state, navigate]);

  const rows = paiementsState.items || [];

  const filteredRows = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase();

    return rows.filter((row) => {
      const matchesSearch =
        !normalizedSearch ||
        [row.factureNumber, row.createdByName, row.note]
          .join(" ")
          .toLowerCase()
          .includes(normalizedSearch);
      return matchesSearch;
    });
  }, [rows, searchValue]);

  const stats = useMemo(
    () => [
      {
        value: rows.length,
        label: "Paiements",
        containerClassName: "p-stat-card",
        defaultValueClassName: "p-stat-card__value",
        defaultLabelClassName: "p-stat-card__label",
      },
      {
        value: rows.reduce((sum, row) => sum + (Number(row.amount) || 0), 0).toLocaleString("fr-FR", {
          style: "currency",
          currency: "TND",
        }),
        label: "Total encaissé",
        containerClassName: "p-stat-card",
        defaultValueClassName: "p-stat-card__value",
        defaultLabelClassName: "p-stat-card__label",
      },
      {
        value: new Set(rows.map((row) => row.factureId).filter(Boolean)).size,
        label: "Factures réglées",
        containerClassName: "p-stat-card",
        defaultValueClassName: "p-stat-card__value",
        defaultLabelClassName: "p-stat-card__label",
      },
    ],
    [rows],
  );

  const filterFields = [
    {
      type: "input",
      id: "paiement-search",
      label: "Rechercher",
      placeholder: "Facture, auteur, note...",
      value: searchValue,
      onChange: (event) => setSearchValue(event.target.value),
    },
  ];

  const columns = [
    { key: "date", header: "Date" },
    {
      key: "amountDisplay",
      header: "Montant payé",
      render: (row) => row.amountDisplay,
    },
    {
      key: "typeLabel",
      header: "Type",
      render: (row) => (
        <span className={`p-pill ${row.type === "INCOMING" ? "p-pill--stock" : "p-pill--danger"}`.trim()}>
          {row.typeLabel}
        </span>
      ),
    },
    { key: "paymentMethodLabel", header: "Methode" },
    { key: "factureNumber", header: "Facture" },
    { key: "facturePaidAmountDisplay", header: "Total payé facture" },
    { key: "factureUnpaidAmountDisplay", header: "Montant impayé" },
    { key: "createdByName", header: "Cree par" },
  ];

  return (
    <DashboardTemplate>
      <div className="p-supplier-page">
        <PageHeader
          title="Gestion des Paiements"
          subtitle="Suivi des paiements clients lies aux factures."
          actions={[
            {
              id: "add-paiement",
              label: "+ Ajouter Paiement",
              className: "p-supplier-toolbar-btn p-supplier-toolbar-btn--add",
              icon: <PlusOutlined />,
              onClick: () => navigate("/paiements/add"),
            },
          ]}
          containerClassName="p-supplier-page__header"
          titleClassName="p-supplier-page__title"
          subtitleClassName="p-supplier-page__subtitle"
          actionsClassName="p-supplier-page__header-actions"
          defaultActionVariant="secondary"
        />

        {successMessage ? (
          <Alert
            customClassName="p-product-page__success-alert"
            message={successMessage}
            type="success"
            showIcon
            closable
            onClose={() => setSuccessMessage("")}
          />
        ) : null}

        <section className="p-dashboard__stats">
          {stats.map((stat) => (
            <StatCard key={`${stat.label}-${stat.value}`} {...stat} />
          ))}
        </section>

        <FilterForm
          fields={filterFields}
          sectionClassName="p-card p-supplier-page__filters"
          gridClassName="p-product-page__filters-grid"
          fieldClassName="p-supplier-page__field"
          controlClassName="p-supplier-page__control"
          labelClassName="p-field__label"
        />

        <MainDataTable
          title="Liste des paiements"
          rows={filteredRows}
          columns={columns}
          getActions={(row) => [
            {
              id: `detail-${row.id}`,
              kind: "detail",
              onClick: () => navigate(`/paiements/${row.id}`),
            },
            {
              id: `delete-${row.id}`,
              kind: "delete",
              disabled: Boolean(paiementsState.deleting),
              onClick: async () => {
                if (!window.confirm(`Supprimer le paiement du ${row.date} ?`)) return;
                await dispatch(deletePaiementThunk(row.id));
              },
            },
          ]}
          loading={Boolean(paiementsState.loading)}
          error={paiementsState.error || paiementsState.deleteError || ""}
          loadingMessage="Chargement des paiements..."
          emptyMessage="Aucun paiement disponible."
          sectionClassName="o-movements"
          titleClassName="o-movements__title"
          tableClassName="o-movements__table p-table p-supplier-page__table"
          stateRowClassName="p-data-table__state"
          errorRowClassName="p-data-table__state--error"
          getRowKey={(row, index) => row?.id ?? index}
        />
      </div>
    </DashboardTemplate>
  );
}

export default PaiementPage;