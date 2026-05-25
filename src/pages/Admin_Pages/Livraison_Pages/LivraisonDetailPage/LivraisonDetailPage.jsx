import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import TemplateSelector from "../../../../templates/TemplateSelector/TemplateSelector";
import PageHeader from "../../../../components/organisms/PageHeader/PageHeader";
import Overview from "../../../../components/organisms/Overview/Overview";
import TotalsCard from "../../../../components/organisms/TotalsCard/TotalsCard";
import FinalizeLivraisonForm from "../../../../components/organisms/FinalizeLivraisonForm/FinalizeLivraisonForm";
import {
  assignLivraisonTransporterThunk,
  fetchLivraisons,
} from "../../../../redux/reducers/LivraisonsReducer";
import { fetchTransporters } from "../../../../redux/reducers/TransportersReducer";
import "../../Supplier_Pages/SupplierDetailPage/SupplierDetailPage.css";

function LivraisonDetailPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const livraisonsState = useSelector((state) => state.livraisons || {});
  const transportersState = useSelector((state) => state.transporters || {});
  const [transporterId, setTransporterId] = useState("");

  useEffect(() => {
    if (!livraisonsState.items.length && !livraisonsState.loading) {
      dispatch(fetchLivraisons());
    }
  }, [dispatch, livraisonsState.items.length, livraisonsState.loading]);

  useEffect(() => {
    if (!transportersState.items.length && !transportersState.loading) {
      dispatch(fetchTransporters());
    }
  }, [dispatch, transportersState.items.length, transportersState.loading]);

  const livraison = useMemo(
    () => livraisonsState.items.find((item) => String(item.id) === String(id)) || null,
    [livraisonsState.items, id],
  );
  const totalHT = Number(livraison?.totalHT ?? 0) || 0;
  const tvaAmount = Number(livraison?.tvaAmount ?? 0) || 0;
  const totalAmountTTC = Number(livraison?.totalAmountTTC ?? totalHT + tvaAmount) || 0;

  const transporterOptions = useMemo(
    () => (transportersState.items || []).map((item) => ({ id: String(item.id), label: `${item.name} (${item.plateNumber})` })),
    [transportersState.items],
  );

  const handleAssignTransporter = async () => {
    if (!livraison || !transporterId) return;
    const result = await dispatch(assignLivraisonTransporterThunk(livraison.id, transporterId));
    if (result?.success) {
      setTransporterId("");
    }
  };

  const itemColumns = [
    { key: "commandeNumber", header: "Commande" },
    { key: "productName", header: "Produit" },
    { key: "productReference", header: "Référence" },
    { key: "requestedQuantity", header: "Qté bon" },
    { key: "deliveredQuantity", header: "Qté livrée" },
    { key: "remainingQuantity", header: "Qté restante" },
    {
      key: "unitPrice",
      header: "Prix unitaire",
      render: (item) => Number(item.unitPrice || 0).toLocaleString("fr-TN", { style: "currency", currency: "TND" }),
    },
    {
      key: "lineTotal",
      header: "Total ligne",
      render: (item) => Number(item.lineTotal || 0).toLocaleString("fr-TN", { style: "currency", currency: "TND" }),
    },
    { key: "status", header: "Statut" },
    { key: "deliveredAt", header: "Livré le" },
    { key: "deliveredByName", header: "Livré par" },
  ];

  const infoRows = [
    { label: "Numéro", value: livraison?.deliveryNumber || "-" },
    { label: "Date", value: livraison?.date || "-" },
    { label: "Statut", value: livraison?.statusLabel || "-" },
    { label: "Bon de commande", value: livraison?.bonCommandeNumber || "-" },
    { label: "Transporteur", value: livraison?.transporterName || "-" },
    { label: "Plaque", value: livraison?.transporterPlate || "-" },
    { label: "Commandes", value: livraison?.commandeCount ?? 0 },
    { label: "Items", value: livraison?.itemCount ?? 0 },
    { label: "Note", value: livraison?.note || "-" },
    { label: "Créée par", value: livraison?.createdByName || "-" },
    { label: "Créée le", value: livraison?.createdAt || "-" },
  ];

  return (
    <TemplateSelector>
      <div className="p-supplier-page">
        <PageHeader
          title={livraison?.deliveryNumber || "Détail Livraison"}
          subtitle={livraison?.transporterName || ""}
          actions={[{ id: "back", label: "Retour", className: "p-supplier-toolbar-btn", onClick: () => navigate("/livraisons") }]}
          containerClassName="p-supplier-page__header"
          titleClassName="p-supplier-page__title"
          subtitleClassName="p-supplier-page__subtitle"
          actionsClassName="p-supplier-page__header-actions"
          defaultActionVariant="secondary"
        />

        {!livraisonsState.loading && !livraison ? <div className="p-card p-supplier-page__state">Livraison introuvable.</div> : null}

        {livraison?.status === "PLANNED" ? (
          <FinalizeLivraisonForm
            error={livraisonsState.deliverError || ""}
            transporterId={transporterId}
            transporterOptions={transporterOptions}
            onTransporterChange={setTransporterId}
            onSubmit={handleAssignTransporter}
            isLoading={livraisonsState.delivering}
            submitDisabled={!transporterId}
          />
        ) : null}

        {livraison ? (
          <>
            <Overview
              item={livraison}
              itemSectionTitle="Informations livraison"
              movementsSectionTitle="Items livrés"
              infoRows={infoRows}
              movements={livraison.commandeItems || []}
              movementsLoading={Boolean(livraisonsState.loading)}
              movementsError={livraisonsState.error || ""}
              loadingText="Chargement des items..."
              emptyMovementsText="Aucun item lié à cette livraison."
              movementColumns={itemColumns}
              movementLimit={Number.MAX_SAFE_INTEGER}
              movementsTableClassName="p-table"
              movementsTableStateClassName="p-supplier-page__state"
              movementsTableErrorClassName="p-supplier-page__state--error"
              getMovementKey={(item, index) => item?.id ?? index}
            />
            <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-end" }}>
              <TotalsCard
                totalHT={totalHT}
                tvaAmount={tvaAmount}
                totalTTC={totalAmountTTC}
                currency="DT"
                exportLoading={Boolean(livraisonsState.loading)}
                deleteLoading={Boolean(livraisonsState.loading)}
                cardClassName="p-livraison-detail__totals-card"
              />
            </div>
          </>
        ) : null}
      </div>
    </TemplateSelector>
  );
}

export default LivraisonDetailPage;
