import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import DashboardTemplate from "../../../../templates/TemplateAdmin/TemplateAdmin";
import PageHeader from "../../../../components/organisms/PageHeader/PageHeader";
import TotalsCard from "../../../../components/organisms/TotalsCard/TotalsCard";
import ProductInfoItem from "../../../../components/molecules/ProductInfoItem/ProductInfoItem";
import DataTable from "../../../../components/molecules/DataTable/DataTable";
import { fetchFactureById } from "../../../../redux/reducers/FactureReducer";
import { PlusOutlined } from "@ant-design/icons";
import "../../Supplier_Pages/SupplierDetailPage/SupplierDetailPage.css";
import "./FactureDetailPage.css";

function FactureDetailPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const factureState = useSelector((state) => state.facture || {});

  useEffect(() => {
    if (id) dispatch(fetchFactureById(id));
  }, [dispatch, id]);

  const facture =
    String(factureState.current?.id || "") === String(id)
      ? factureState.current
      : null;

  const handleExportPdf = () => {
    // TODO: Implémenter l'export PDF
    console.log("Export PDF pour facture:", facture?.id);
  };

  const handleDelete = () => {
    // TODO: Implémenter la suppression de la facture
    console.log("Suppression de la facture:", facture?.id);
  };

  const totalHT = Number(facture?.subTotal ?? 0) || 0;
  const tvaAmount = Number(facture?.tvaAmount ?? 0) || 0;
  const totalAmountTTC = Number(facture?.totalAmountTTC ?? totalHT + tvaAmount) || 0;

  const itemColumns = [
    { key: "productName", header: "Produit" },
    { key: "productReference", header: "Reference" },
    { key: "quantity", header: "Quantite" },
    {
      key: "unitPrice",
      header: "Prix unitaire",
      render: (item) =>
        Number(item.unitPrice || 0).toLocaleString("fr-FR", {
          style: "currency",
          currency: "TND",
        }),
    },
    {
      key: "lineTotal",
      header: "Total ligne",
      render: (item) =>
        Number(item.lineTotal || 0).toLocaleString("fr-FR", {
          style: "currency",
          currency: "TND",
        }),
    },
  ];

  const infoRows = [
    { label: "Numero facture", value: facture?.invoiceNumber || "-" },
    { label: "Date", value: facture?.date || "-" },
    { label: "Statut paiement", value: facture?.paymentStatusLabel || "-" },
    {
      label: "Total TTC",
      value: Number(facture?.totalAmountTTC || 0).toLocaleString("fr-FR", {
        style: "currency",
        currency: "TND",
      }),
    },
    { label: "Client", value: facture?.clientName || "-" },
    { label: "Telephone client", value: facture?.clientPhone || "-" },
    { label: "Adresse client", value: facture?.clientAddress || "-" },
    { label: "Commande", value: facture?.commandeNumber || "-" },
    { label: "Transporteur", value: facture?.transporterName || "-" },
    { label: "Plaque", value: facture?.transporterPlate || "-" },
    { label: "Creee par", value: facture?.createdByName || "-" },
  ];

  return (
    <DashboardTemplate>
      <div className="p-supplier-page">
        <PageHeader
          title={facture?.invoiceNumber || "Detail Facture"}
          subtitle={facture?.clientName || ""}
          actions={[
            {
              id: "back",
              label: "Retour",
              className: "p-supplier-toolbar-btn",
              onClick: () => navigate("/factures"),
            },
            {
              id: "edit",
              label: "Modifier",
              className: "p-supplier-toolbar-btn p-supplier-toolbar-btn--add",
              onClick: () => navigate(`/factures/${id}/edit`),
            },
            {
              id: "payment",
              label: "Paiement",
              className: "p-supplier-toolbar-btn p-supplier-toolbar-btn--add",
              icon: <PlusOutlined />,
              onClick: () =>
                navigate("/paiements/add", {
                  state: {
                    factureId: id,
                    amount: Number(facture?.totalAmountTTC) || 0,
                    invoiceNumber: facture?.invoiceNumber || "",
                  },
                }),
            },
          ]}
          containerClassName="p-supplier-page__header"
          titleClassName="p-supplier-page__title"
          subtitleClassName="p-supplier-page__subtitle"
          actionsClassName="p-supplier-page__header-actions"
          defaultActionVariant="secondary"
        />

        {!factureState.currentLoading && !facture ? (
          <div className="p-card p-supplier-page__state">
            {factureState.currentError || "Facture introuvable."}
          </div>
        ) : null}

        {facture ? (
          <>
            {/* Nouvelle layout: gauche détails + droite totaux */}
            <div className="p-facture-detail__top-section">
              {/* Section gauche: détails */}
              <article className="p-facture-detail__card p-facture-detail__info-card">
                <h3 className="p-facture-detail__card-title">Informations facture</h3>
                <div className="p-facture-detail__info-rows">
                  {infoRows.map((row) => (
                    <ProductInfoItem
                      key={row.label}
                      label={row.label}
                      value={row.value}
                      rowClassName="p-overview__info-row"
                      labelClassName="p-overview__info-label"
                      valueClassName="p-overview__info-value"
                    />
                  ))}
                </div>
              </article>

              {/* Section droite: totaux + actions */}
              <TotalsCard
                totalHT={totalHT}
                tvaAmount={tvaAmount}
                totalTTC={totalAmountTTC}
                currency="DT"
                onExportPdf={handleExportPdf}
                onDelete={handleDelete}
                exportLoading={factureState.currentLoading}
                deleteLoading={factureState.currentLoading}
                cardClassName="p-facture-detail__totals-card"
              />
            </div>

            {/* Section en dessous: table des lignes */}
            <article className="p-facture-detail__card p-facture-detail__lines-card">
              <h3 className="p-facture-detail__card-title">Lignes facture</h3>
              <div className="p-facture-detail__table-container">
                <DataTable
                  rows={facture.items || []}
                  columns={itemColumns}
                  loading={Boolean(factureState.currentLoading)}
                  error={factureState.currentError || ""}
                  loadingMessage="Chargement des lignes..."
                  emptyMessage="Aucune ligne de facture disponible."
                  tableClassName="p-table"
                  stateRowClassName="p-supplier-page__state"
                  errorRowClassName="p-supplier-page__state--error"
                  getRowKey={(item, index) => item?.id ?? index}
                />
              </div>
            </article>
          </>
        ) : null}
      </div>
    </DashboardTemplate>
  );
}

export default FactureDetailPage;