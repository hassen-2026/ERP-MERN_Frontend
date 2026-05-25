import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import DashboardTemplate from "../../../../templates/TemplateAdmin/TemplateAdmin";
import PageHeader from "../../../../components/organisms/PageHeader/PageHeader";
import Overview from "../../../../components/organisms/Overview/Overview";
import TotalsCard from "../../../../components/organisms/TotalsCard/TotalsCard";
import ProductInfoItem from "../../../../components/molecules/ProductInfoItem/ProductInfoItem";
import DataTable from "../../../../components/molecules/DataTable/DataTable";
import Input from "../../../../components/atoms/input/Input";
import Button from "../../../../components/atoms/button/Button";
import {
  fetchBonCommandes,
  updateBonCommandeLineQuantityThunk,
} from "../../../../redux/reducers/BonCommandeReducer";
import "../../Supplier_Pages/SupplierDetailPage/SupplierDetailPage.css";
import "./BonCommandeDetailPage.css";

function BonCommandeDetailPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const bonState = useSelector((state) => state.bonCommandes || {});

  const [editingLineId, setEditingLineId] = useState("");
  const [editingQuantity, setEditingQuantity] = useState("");

  useEffect(() => {
    if (!bonState.items.length && !bonState.loading) {
      dispatch(fetchBonCommandes());
    }
  }, [dispatch, bonState.items.length, bonState.loading]);

  const bonCommande = useMemo(
    () => (bonState.items || []).find((item) => String(item.id) === String(id)) || null,
    [bonState.items, id]
  );

  const handleExportPdf = () => {
    // TODO: Implémenter l'export PDF
    console.log("Export PDF pour bon:", bonCommande?.id);
  };

  const handleDelete = () => {
    // TODO: Implémenter la suppression du bon
    console.log("Suppression du bon:", bonCommande?.id);
  };

  const totalHT = Number(bonCommande?.totalHT ?? 0) || 0;
  const tvaAmount = Number(bonCommande?.tvaAmount ?? 0) || 0;
  const totalAmountTTC = Number(bonCommande?.totalAmountTTC ?? totalHT + tvaAmount) || 0;

  const infoRows = [
    { label: "N° Bon", value: bonCommande?.bonNumber || "-" },
    { label: "Date", value: bonCommande?.date || "-" },
    { label: "Statut", value: bonCommande?.statusLabel || "-" },
    { label: "Commande", value: bonCommande?.commandeNumber || "-" },
    { label: "Lignes", value: bonCommande?.lineCount ?? 0 },
    { label: "Lignes restantes", value: bonCommande?.remainingLinesCount ?? 0 },
    { label: "Qté demandée", value: bonCommande?.totalRequested ?? 0 },
    { label: "Qté livrée", value: bonCommande?.totalDelivered ?? 0 },
    { label: "Note", value: bonCommande?.note || "-" },
    { label: "Créé par", value: bonCommande?.createdByName || "-" },
    { label: "Créé le", value: bonCommande?.createdAt || "-" },
  ];

  const lineColumns = [
    { key: "productName", header: "Produit" },
    { key: "productReference", header: "Référence" },
    { key: "requestedQuantity", header: "Qté demandée" },
    { key: "deliveredQuantity", header: "Qté livrée" },
    { key: "remainingQuantity", header: "Qté restante" },
    {
      key: "unitPrice",
      header: "Prix unitaire",
      render: (line) => Number(line.unitPrice || 0).toLocaleString("fr-TN", { style: "currency", currency: "TND" }),
    },
    {
      key: "statusLabel",
      header: "Statut",
      render: (line) => (
        <span className={`p-pill ${line.status === "DELIVERED" ? "p-pill--stock" : "p-pill--warning"}`.trim()}>
          {line.statusLabel}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Modifier quantité",
      render: (line) => {
        const isEditing = editingLineId === line.id;
        const isDisabled = bonCommande?.status === "DELIVERED" || bonCommande?.status === "CANCELLED";

        return (
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <Input
              type="number"
              min={line.deliveredQuantity}
              customClassName="p-supplier-page__control"
              style={{ minWidth: 84 }}
              value={isEditing ? editingQuantity : line.requestedQuantity}
              disabled={isDisabled}
              onFocus={() => {
                setEditingLineId(line.id);
                setEditingQuantity(String(line.requestedQuantity));
              }}
              onChange={(event) => {
                setEditingLineId(line.id);
                setEditingQuantity(event.target.value);
              }}
            />
            <Button
              customClassName="p-action-btn p-action-btn--info"
              disabled={isDisabled || bonState.updating || !isEditing}
              onClick={async () => {
                const quantity = Number(editingQuantity);
                if (!Number.isFinite(quantity) || quantity <= 0) return;
                await dispatch(updateBonCommandeLineQuantityThunk(bonCommande.id, line.id, quantity));
                setEditingLineId("");
                setEditingQuantity("");
              }}
            >
              Valider
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <DashboardTemplate>
      <div className="p-supplier-page">
        <PageHeader
          title={bonCommande ? `Détail ${bonCommande.bonNumber}` : "Détail bon de commande"}
          subtitle={bonCommande?.commandeNumber || ""}
          actions={[
            {
              id: "deliver-from-bon",
              label: "Créer livraison depuis ce bon",
              className: "p-supplier-toolbar-btn p-supplier-toolbar-btn--excel",
              onClick: () => navigate("/livraisons/add", { state: { bonCommandeId: id } }),
            },
            {
              id: "back-bons",
              label: "Retour",
              className: "p-supplier-toolbar-btn",
              onClick: () => navigate("/bon-commandes"),
            },
          ]}
          containerClassName="p-supplier-page__header"
          titleClassName="p-supplier-page__title"
          subtitleClassName="p-supplier-page__subtitle"
          actionsClassName="p-supplier-page__header-actions"
          defaultActionVariant="secondary"
        />

        {!bonState.loading && !bonCommande ? (
          <div className="p-card p-supplier-page__state">Bon de commande introuvable.</div>
        ) : null}

        {bonState.updateError ? (
          <div className="p-card p-supplier-page__state p-supplier-page__state--error">{bonState.updateError}</div>
        ) : null}

        {bonCommande ? (
          <>
            {/* Nouvelle layout: gauche détails + droite totaux */}
            <div className="p-bon-commande-detail__top-section">
              {/* Section gauche: détails */}
              <article className="p-bon-commande-detail__card p-bon-commande-detail__info-card">
                <h3 className="p-bon-commande-detail__card-title">Informations bon de commande</h3>
                <div className="p-bon-commande-detail__info-rows">
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
                exportLoading={bonState.loading}
                deleteLoading={bonState.loading}
                cardClassName="p-bon-commande-detail__totals-card"
              />
            </div>

            {/* Section en dessous: table des lignes */}
            <article className="p-bon-commande-detail__card p-bon-commande-detail__lines-card">
              <h3 className="p-bon-commande-detail__card-title">Lignes du bon</h3>
              <div className="p-bon-commande-detail__table-container">
                <DataTable
                  rows={bonCommande.lines || []}
                  columns={lineColumns}
                  loading={Boolean(bonState.loading)}
                  error={bonState.error || ""}
                  loadingMessage="Chargement des lignes..."
                  emptyMessage="Aucune ligne pour ce bon de commande."
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

export default BonCommandeDetailPage;
