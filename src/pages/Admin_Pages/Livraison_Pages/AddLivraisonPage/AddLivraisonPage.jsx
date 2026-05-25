import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import TemplateSelector from "../../../../templates/TemplateSelector/TemplateSelector";
import LineSelectionForm from "../../../../components/organisms/LineSelectionForm/LineSelectionForm";
import { fetchBonCommandes } from "../../../../redux/reducers/BonCommandeReducer";
import { createLivraisonThunk } from "../../../../redux/reducers/LivraisonsReducer";
import "../../Supplier_Pages/SupplierDetailPage/SupplierDetailPage.css";

function AddLivraisonPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const bonCommandesState = useSelector((state) => state.bonCommandes || {});
  const livraisonsState = useSelector((state) => state.livraisons || {});

  const presetBonCommandeId = location.state?.bonCommandeId ? String(location.state.bonCommandeId) : "";

  const [note, setNote] = useState("");
  const [date, setDate] = useState("");
  const [bonCommandeId, setBonCommandeId] = useState(presetBonCommandeId);
  const [selectedLineIds, setSelectedLineIds] = useState([]);

  useEffect(() => {
    if (!bonCommandesState.items.length && !bonCommandesState.loading) {
      dispatch(fetchBonCommandes());
    }
  }, [dispatch, bonCommandesState.items.length, bonCommandesState.loading]);

  const bonOptions = useMemo(
    () =>
      (bonCommandesState.items || [])
        .filter((item) => item.status !== "DELIVERED" && item.status !== "CANCELLED")
        .map((item) => ({
          id: String(item.id),
          label: `${item.bonNumber} (${item.commandeNumber})`,
        })),
    [bonCommandesState.items]
  );

  useEffect(() => {
    if (!presetBonCommandeId) return;
    setBonCommandeId(presetBonCommandeId);
  }, [presetBonCommandeId]);

  const selectedBon = useMemo(
    () => (bonCommandesState.items || []).find((item) => String(item.id) === String(bonCommandeId)) || null,
    [bonCommandesState.items, bonCommandeId]
  );

  const pendingLines = useMemo(
    () =>
      (selectedBon?.lines || []).filter(
        (line) => Number(line.remainingQuantity || 0) > 0 && String(line.status || "PENDING").toUpperCase() !== "DELIVERED"
      ),
    [selectedBon]
  );

  useEffect(() => {
    const ids = pendingLines.map((line) => String(line.id));
    setSelectedLineIds(ids);
  }, [bonCommandeId, pendingLines]);

  const toggleLine = (lineId) => {
    const normalizedId = String(lineId);
    setSelectedLineIds((prev) => (prev.includes(normalizedId) ? prev.filter((id) => id !== normalizedId) : [...prev, normalizedId]));
  };

  const pendingLinesColumns = useMemo(
    () => [
      {
        key: "bon",
        title: "Bon",
        render: () => selectedBon?.bonNumber || "-",
      },
      { key: "productName", title: "Produit", dataIndex: "productName" },
      { key: "requestedQuantity", title: "Qté demandée", dataIndex: "requestedQuantity" },
      { key: "deliveredQuantity", title: "Qté livrée", dataIndex: "deliveredQuantity" },
      { key: "remainingQuantity", title: "Qté restante", dataIndex: "remainingQuantity" },
      {
        key: "unitPrice",
        title: "Prix",
        render: (row) => Number(row.unitPrice || 0).toLocaleString("fr-TN", { style: "currency", currency: "TND" }),
      },
      {
        key: "total",
        title: "Total",
        render: (row) => Number((row.remainingQuantity || 0) * (row.unitPrice || 0)).toLocaleString("fr-TN", { style: "currency", currency: "TND" }),
      },
      { key: "statusLabel", title: "Statut", dataIndex: "statusLabel" },
    ],
    [selectedBon, selectedLineIds]
  );

  const handleSubmit = async () => {
    const payload = {
      bonCommandeId,
      bonCommandeLineIds: selectedLineIds,
      note,
      date: date || undefined,
    };

    const result = await dispatch(createLivraisonThunk(payload));
    if (result?.success) {
      await dispatch(fetchBonCommandes());
      navigate("/livraisons", { state: { successMessage: "Livraison planifiée avec succès." } });
    }
  };

  return (
    <TemplateSelector>
      <LineSelectionForm
        title="Planifier une livraison depuis un bon de commande"
        selectLabel="Bon de commande"
        selectOptions={bonOptions}
        selectedId={bonCommandeId}
        onSelectChange={setBonCommandeId}
        date={date}
        onDateChange={setDate}
        note={note}
        onNoteChange={setNote}
        lines={pendingLines}
        columns={pendingLinesColumns}
        selectedLineIds={selectedLineIds}
        onToggleLine={toggleLine}
        onSubmit={handleSubmit}
        isLoading={livraisonsState.creating}
        error={livraisonsState.createError}
        emptyMessage="Aucune ligne en attente pour ce bon de commande."
        linesTitle="Lignes du bon"
        submitLabel={livraisonsState.creating ? "Création..." : "Planifier la livraison"}
        submitDisabled={!bonCommandeId || selectedLineIds.length === 0}
        onCancel={() => navigate("/livraisons")}
      />
    </TemplateSelector>
  );
}

export default AddLivraisonPage;
