import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import DashboardTemplate from "../../../../templates/TemplateAdmin/TemplateAdmin";
import PageHeader from "../../../../components/organisms/PageHeader/PageHeader";
import TotalsCard from "../../../../components/organisms/TotalsCard/TotalsCard";
import ProductInfoItem from "../../../../components/molecules/ProductInfoItem/ProductInfoItem";
import DataTable from "../../../../components/molecules/DataTable/DataTable";
import { fetchCommandes } from "../../../../redux/reducers/CommandeReducer";
import "../../Supplier_Pages/SupplierDetailPage/SupplierDetailPage.css";
import "./CommandeDetailPage.css";

function CommandeDetailPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const commandesState = useSelector((state) => state.commandes || {});

  useEffect(() => {
    if (!commandesState?.items?.length && !commandesState?.loading) {
      dispatch(fetchCommandes());
    }
  }, [commandesState?.items?.length, commandesState?.loading, dispatch]);

  const commande = useMemo(
    () => (commandesState?.items || []).find((item) => String(item.id) === String(id)) || null,
    [commandesState?.items, id],
  );

  const statusBadgeClass =
    commande?.status === "DELIVERED"
      ? "p-pill--stock"
      : commande?.status === "CANCELLED"
        ? "p-pill--danger"
        : "p-pill--warning";

  const handleExportPdf = () => {
    // TODO: Implémenter l'export PDF
    console.log("Export PDF pour commande:", commande?.id);
  };

  const handleDelete = () => {
    // TODO: Implémenter la suppression de la commande
    console.log("Suppression de la commande:", commande?.id);
  };

  const totalAmountTTC = Number(commande?.totalAmountTTC ?? commande?.totalAmountValue ?? 0) || 0;
  const totalHT = Number(commande?.totalHT ?? 0) || 0;
  const tvaAmount = Number(commande?.tvaAmount ?? Math.max(0, totalAmountTTC - totalHT)) || 0;

  const headerActions = [
    {
      id: "create-bon-commande",
      label: "Créer Bon de commande",
      className: "p-supplier-toolbar-btn p-supplier-toolbar-btn--excel",
      onClick: () => navigate("/bon-commandes/add", { state: { commandeId: id } }),
    },
    {
      id: "edit-commande",
      label: "Modifier",
      className: "p-supplier-toolbar-btn p-supplier-toolbar-btn--add",
      onClick: () => navigate(`/commandes/${id}/edit`),
    },
    {
      id: "back-commandes",
      label: "Retour",
      className: "p-supplier-toolbar-btn",
      onClick: () => navigate("/commandes"),
    },
  ];

  const itemColumns = [
    { key: "productName", header: "Produit" },
    { key: "orderedQuantity", header: "Qté commandée" },
    { key: "deliveredQuantity", header: "Qté livrée" },
    { key: "pendingQuantity", header: "Qté restante" },
    {
      key: "unitPrice",
      header: "Prix unitaire",
      render: (item) => Number(item?.unitPrice || 0).toLocaleString("fr-TN", { style: "currency", currency: "TND" }),
    },
    {
      key: "lineTotal",
      header: "Total ligne",
      render: (item) => Number(item?.lineTotal || 0).toLocaleString("fr-TN", { style: "currency", currency: "TND" }),
    },
    {
      key: "statusLabel",
      header: "Statut item",
      render: (item) => <span className={`p-pill ${item?.status === "DELIVERED" ? "p-pill--stock" : "p-pill--warning"}`.trim()}>{item?.statusLabel || "-"}</span>,
    },
    { key: "deliveredAt", header: "Livré le" },
    { key: "deliveredByName", header: "Livré par" },
  ];

  const deliveredItemsCount = (commande?.items || []).filter((item) => item?.status === "DELIVERED").length;

  const infoRows = [
    { label: "N° Commande", value: commande?.commandeNumber || "-" },
    { label: "Date", value: commande?.date || "-" },
    { label: "Client", value: commande?.clientName || "-" },
    {
      label: "Statut",
      value: commande ? <span className={`p-pill ${statusBadgeClass}`.trim()}>{commande.statusLabel}</span> : "-",
    },
    { label: "Créée par", value: commande?.managedByName || "-" },
    { label: "Lignes", value: commande?.itemsCount ?? 0 },
    { label: "Items livrés", value: deliveredItemsCount },
    { label: "Total TTC", value: commande?.totalAmountDisplay || "-" },
    { label: "Facture", value: commande?.factureNumber || "-" },
    { label: "Statut facture", value: commande?.factureStatus || "-" },
    { label: "Stock appliqué", value: commande?.stockApplied ? "Oui" : "Non" },
    { label: "Créée le", value: commande?.createdAt || "-" },
    { label: "Modifiée le", value: commande?.updatedAt || "-" },
  ];

  return (
    <DashboardTemplate>
      <div className="p-supplier-page">
        <PageHeader
          title={commande ? `Détail commande ${commande.commandeNumber || commande.id}` : "Détail commande"}
          subtitle={commande?.clientName || ""}
          actions={headerActions}
          containerClassName="p-supplier-page__header"
          titleClassName="p-supplier-page__title"
          subtitleClassName="p-supplier-page__subtitle"
          actionsClassName="p-supplier-page__header-actions"
          defaultActionVariant="secondary"
        />

        {!commandesState?.loading && !commande ? (
          <div className="p-card p-supplier-page__state">Commande introuvable.</div>
        ) : null}

        {commande ? (
          <>
            {/* Nouvelle layout: gauche détails + droite totaux */}
            <div className="p-commande-detail__top-section">
              {/* Section gauche: détails */}
              <article className="p-commande-detail__card p-commande-detail__info-card">
                <h3 className="p-commande-detail__card-title">Informations commande</h3>
                <div className="p-commande-detail__info-rows">
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
                exportLoading={commandesState?.loading}
                deleteLoading={commandesState?.loading}
                cardClassName="p-commande-detail__totals-card"
              />
            </div>

            {/* Section en dessous: table des articles */}
            <article className="p-commande-detail__card p-commande-detail__lines-card">
              <h3 className="p-commande-detail__card-title">Articles de la commande</h3>
              <div className="p-commande-detail__table-container">
                <DataTable
                  rows={commande.items || []}
                  columns={itemColumns}
                  loading={Boolean(commandesState?.loading)}
                  error={commandesState?.error || ""}
                  loadingMessage="Chargement des articles..."
                  emptyMessage="Aucune ligne de commande disponible."
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

export default CommandeDetailPage;
