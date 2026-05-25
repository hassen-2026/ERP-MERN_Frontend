import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { FileTextOutlined } from "@ant-design/icons";

import TemplateSelector from "../../../../templates/TemplateSelector/TemplateSelector";
import Alert from "../../../../components/atoms/alert/Alert";
import StatCard from "../../../../components/molecules/StatCard/StatCard";
import FilterForm from "../../../../components/organisms/FilterForm/FilterForm";
import MainDataTable from "../../../../components/organisms/MainDataTable/MainDataTable";
import PageHeader from "../../../../components/organisms/PageHeader/PageHeader";
import {
  deleteFactureThunk,
  fetchFactures,
} from "../../../../redux/reducers/FactureReducer";
import { PlusOutlined } from "@ant-design/icons";
import "../../Supplier_Pages/SupplierPage/SupplierPage.css";

function FacturePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const facturesState = useSelector((state) => state.facture || {});
  const [searchValue, setSearchValue] = useState("");
  const [statusValue, setStatusValue] = useState("all");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    dispatch(fetchFactures());
  }, [dispatch]);

  useEffect(() => {
    const incomingMessage = location.state?.successMessage;
    if (!incomingMessage) return;

    setSuccessMessage(incomingMessage);
    navigate(location.pathname, { replace: true, state: {} });

    const timeoutId = setTimeout(() => setSuccessMessage(""), 4000);
    return () => clearTimeout(timeoutId);
  }, [location.pathname, location.state, navigate]);

  const rows = facturesState.items || [];

  const filteredRows = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase();

    return rows.filter((row) => {
      const matchesSearch =
        !normalizedSearch ||
        [row.invoiceNumber, row.clientName, row.commandeNumber, row.createdByName]
          .join(" ")
          .toLowerCase()
          .includes(normalizedSearch);
      const matchesStatus = statusValue === "all" || row.paymentStatus === statusValue;
      return matchesSearch && matchesStatus;
    });
  }, [rows, searchValue, statusValue]);

  const stats = useMemo(
    () => [
      {
        value: rows.length,
        label: "Factures",
        containerClassName: "p-stat-card",
        defaultValueClassName: "p-stat-card__value",
        defaultLabelClassName: "p-stat-card__label",
      },
      {
        value: rows.filter((row) => row.paymentStatus === "UNPAID").length,
        label: "Impayees",
        containerClassName: "p-stat-card",
        defaultValueClassName: "p-stat-card__value",
        defaultLabelClassName: "p-stat-card__label",
      },
      {
        value: rows.filter((row) => row.paymentStatus === "PAID").length,
        label: "Payees",
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
      id: "facture-search",
      label: "Rechercher",
      placeholder: "Numero, client, commande...",
      value: searchValue,
      onChange: (event) => setSearchValue(event.target.value),
    },
    {
      type: "select",
      id: "facture-status",
      label: "Statut paiement",
      value: statusValue,
      options: [
        { label: "Tous", value: "all" },
        { label: "Impayee", value: "UNPAID" },
        { label: "Partielle", value: "PARTIAL" },
        { label: "Payee", value: "PAID" },
        { label: "Annulee", value: "CANCELLED" },
      ],
      onChange: (value) => setStatusValue(value),
    },
  ];

  const headerActions = [
    {
      id: "add-facture",
      label: "+ Ajouter Facture",
      className: "p-supplier-toolbar-btn p-supplier-toolbar-btn--add",
      icon: <PlusOutlined />,
      onClick: () => navigate("/factures/add"),
    },
  ];

  const columns = [
    { key: "invoiceNumber", header: "Numero" },
    { key: "date", header: "Date" },
    { key: "clientName", header: "Client" },
    { key: "commandeNumber", header: "Commande" },
    {
      key: "paymentStatusLabel",
      header: "Paiement",
      render: (row) => (
        <span
          className={`p-pill ${
            row.paymentStatus === "PAID"
              ? "p-pill--stock"
              : row.paymentStatus === "CANCELLED"
                ? "p-pill--danger"
                : "p-pill--warning"
          }`.trim()}
        >
          {row.paymentStatusLabel}
        </span>
      ),
    },
    {
      key: "subTotal",
      header: "HT",
      render: (row) => Number(row.subTotal || 0).toLocaleString("fr-FR", {
        style: "currency",
        currency: "TND",
      }),
    },
    {
      key: "tvaAmount",
      header: "TVA",
      render: (row) => Number(row.tvaAmount || 0).toLocaleString("fr-FR", {
        style: "currency",
        currency: "TND",
      }),
    },
    {
      key: "totalAmountTTC",
      header: "TTC",
      render: (row) =>
        Number(row.totalAmountTTC || 0).toLocaleString("fr-FR", {
          style: "currency",
          currency: "TND",
        }),
    },
  ];

  return (
    <TemplateSelector>
      <div className="p-supplier-page">
        <PageHeader
          title="Gestion des Factures"
          subtitle="Suivi des factures generes depuis les commandes livrees."
          actions={headerActions}
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
          title="Liste des factures"
          rows={filteredRows}
          columns={columns}
          getActions={(row) => [
            {
              id: `detail-${row.id}`,
              kind: "detail",
              label: "Detail",
              onClick: () => navigate(`/factures/${row.id}`),
            },
            {
              id: `edit-${row.id}`,
              kind: "edit",
              onClick: () => navigate(`/factures/${row.id}/edit`),
            },
            {
              id: `template-${row.id}`,
              label: "Template",
              icon: <FileTextOutlined />,
              variant: "secondary",
              className: "m-action-buttons__btn",
              disabled: !row.commandeId,
              onClick: () => row.commandeId && navigate(`/commandes/${row.commandeId}/facture-template`),
            },
            {
              id: `payment-${row.id}`,
              label: "Paiement",
              icon: <PlusOutlined />,
              variant: "secondary",
              className: "m-action-buttons__btn",
              onClick: () =>
                navigate("/paiements/add", {
                  state: {
                    factureId: row.id,
                    amount: Number(row.totalAmountTTC) || 0,
                    invoiceNumber: row.invoiceNumber,
                  },
                }),
            },
            {
              id: `delete-${row.id}`,
              kind: "delete",
              disabled: Boolean(facturesState.deleting),
              onClick: async () => {
                if (!window.confirm(`Supprimer la facture ${row.invoiceNumber} ?`)) return;
                await dispatch(deleteFactureThunk(row.id));
              },
            },
          ]}
          loading={Boolean(facturesState.listLoading)}
          error={facturesState.listError || facturesState.deleteError || ""}
          loadingMessage="Chargement des factures..."
          emptyMessage="Aucune facture disponible."
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

export default FacturePage;