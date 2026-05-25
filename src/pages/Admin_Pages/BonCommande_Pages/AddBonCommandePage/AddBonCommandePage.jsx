import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import DashboardTemplate from "../../../../templates/TemplateAdmin/TemplateAdmin";
import Input from "../../../../components/atoms/input/Input";
import LineSelectionForm from "../../../../components/organisms/LineSelectionForm/LineSelectionForm";
import { fetchCommandes } from "../../../../redux/reducers/CommandeReducer";
import { fetchBonCommandes } from "../../../../redux/reducers/BonCommandeReducer";
import { createBonCommandeThunk } from "../../../../redux/reducers/BonCommandeReducer";
import "../../Supplier_Pages/SupplierDetailPage/SupplierDetailPage.css";

function AddBonCommandePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const commandesState = useSelector((state) => state.commandes || {});
  const bonCommandesState = useSelector((state) => state.bonCommandes || {});
  const bonState = useSelector((state) => state.bonCommandes || {});

  const presetCommandeId = location.state?.commandeId ? String(location.state.commandeId) : "";

  const [commandeId, setCommandeId] = useState(presetCommandeId);
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");
  const [lineQuantities, setLineQuantities] = useState({});
  const [selectedLineIds, setSelectedLineIds] = useState([]);

  useEffect(() => {
    if (!commandesState.items.length && !commandesState.loading) {
      dispatch(fetchCommandes());
    }
  }, [dispatch, commandesState.items.length, commandesState.loading]);

  useEffect(() => {
    if (!bonCommandesState.items.length && !bonCommandesState.loading) {
      dispatch(fetchBonCommandes());
    }
  }, [dispatch, bonCommandesState.items.length, bonCommandesState.loading]);

  const commandeOptions = useMemo(
    () =>
      (commandesState.items || [])
        .filter((item) => item.status !== "CANCELLED")
        .map((item) => ({
          id: String(item.id),
          label: `${item.commandeNumber} - ${item.clientName}`,
        })),
    [commandesState.items]
  );

  const selectedCommande = useMemo(
    () => (commandesState.items || []).find((item) => String(item.id) === String(commandeId)) || null,
    [commandesState.items, commandeId]
  );

  const pendingItems = useMemo(() => {
    if (!selectedCommande) return [];

    const allocatedByCommandeItemId = (bonCommandesState.items || []).reduce((accumulator, bonCommande) => {
      for (const line of bonCommande.lines || []) {
        const commandeItemId = String(line.commandeItemId || line.commandeItemId || line.commandeItem || "").trim();
        if (!commandeItemId) continue;
        if (String(line.status || "PENDING").toUpperCase() === "DELIVERED") continue;
        accumulator[commandeItemId] = (accumulator[commandeItemId] || 0) + Number(line.remainingQuantity || 0);
      }
      return accumulator;
    }, {});

    return (selectedCommande.items || [])
      .map((item) => {
        const pendingQuantity = Number(
          item.pendingQuantity !== undefined
            ? item.pendingQuantity
            : (Number(item.quantity || 0) - Number(item.deliveredQuantity || 0))
        );
        const allocatedPending = Number(allocatedByCommandeItemId[String(item.id)] || 0);
        const allocatableQuantity = Math.max(pendingQuantity - allocatedPending, 0);

        return {
          id: String(item.id),
          productName: item.productName,
          productReference: item.productReference,
          orderedQuantity: Number(item.orderedQuantity || item.quantity || 0),
          deliveredQuantity: Number(item.deliveredQuantity || 0),
          pendingQuantity,
          allocatedPending,
          allocatableQuantity,
          unitPrice: Number(item.unitPrice || 0),
        };
      })
      .filter((item) => item.allocatableQuantity > 0);
  }, [bonCommandesState.items, selectedCommande]);

  const pendingItemsColumns = useMemo(
    () => [
      { key: "productName", title: "Produit", dataIndex: "productName" },
      {
        key: "productReference",
        title: "Référence",
        render: (row) => row.productReference || "-",
      },
      { key: "orderedQuantity", title: "Qté commandée", dataIndex: "orderedQuantity" },
      { key: "deliveredQuantity", title: "Qté livrée", dataIndex: "deliveredQuantity" },
      { key: "allocatableQuantity", title: "Qté disponible", dataIndex: "allocatableQuantity" },
      {
        key: "selectedQuantity",
        title: "Qté à mettre dans le bon",
        render: (row) => (
          <Input
            type="number"
            customClassName="p-supplier-page__control"
            value={lineQuantities[row.id] ?? ""}
            min={1}
            max={row.allocatableQuantity}
            onChange={(event) => handleQuantityChange(row.id, event.target.value)}
          />
        ),
      },
    ],
    [lineQuantities, selectedLineIds]
  );

  const hasInvalidQuantity = useMemo(
    () =>
      pendingItems.some((item) => {
        if (!selectedLineIds.includes(String(item.id))) return false;
        const quantity = Number(lineQuantities[item.id]);
        return !Number.isFinite(quantity) || quantity <= 0 || quantity > item.allocatableQuantity;
      }),
    [lineQuantities, pendingItems, selectedLineIds]
  );

  useEffect(() => {
    const nextQuantities = {};
    for (const item of pendingItems) {
      nextQuantities[item.id] = String(item.allocatableQuantity);
    }
    setLineQuantities(nextQuantities);
    // Initialize selected lines to all pending items
    const ids = pendingItems.map((line) => String(line.id));
    setSelectedLineIds(ids);
  }, [commandeId, pendingItems]);

  const toggleLine = (lineId) => {
    const normalizedId = String(lineId);
    setSelectedLineIds((prev) => (prev.includes(normalizedId) ? prev.filter((id) => id !== normalizedId) : [...prev, normalizedId]));
  };

  const handleQuantityChange = (itemId, value) => {
    setLineQuantities((prev) => ({ ...prev, [itemId]: value }));
  };

  const handleSubmit = async () => {
    const lines = pendingItems
      .filter((item) => selectedLineIds.includes(String(item.id)))
      .map((item) => {
        const quantity = Number(lineQuantities[item.id]);
        if (!Number.isFinite(quantity) || quantity <= 0 || quantity > item.allocatableQuantity) return null;
        return {
          commandeItemId: item.id,
          quantity,
        };
      })
      .filter(Boolean);

    const result = await dispatch(
      createBonCommandeThunk({
        commandeId,
        date: date || undefined,
        note,
        lines,
      })
    );

    if (result?.success) {
      await dispatch(fetchCommandes());
      navigate("/bon-commandes", { state: { successMessage: "Bon de commande créé avec succès." } });
    }
  };

  return (
    <DashboardTemplate>
      <LineSelectionForm
        title="Créer un bon de commande"
        selectLabel="Commande"
        selectOptions={commandeOptions}
        selectedId={commandeId}
        onSelectChange={setCommandeId}
        date={date}
        onDateChange={setDate}
        note={note}
        onNoteChange={setNote}
        lines={pendingItems}
        columns={pendingItemsColumns}
        selectedLineIds={selectedLineIds}
        onToggleLine={toggleLine}
        onSubmit={handleSubmit}
        isLoading={bonState.creating}
        error={bonState.createError}
        emptyMessage="Aucune ligne en attente pour cette commande."
        linesTitle="Lignes du bon de commande"
        submitLabel={bonState.creating ? "Création..." : "Créer le bon"}
        submitDisabled={!commandeId || selectedLineIds.length === 0 || hasInvalidQuantity}
        onCancel={() => navigate("/bon-commandes")}
      />
    </DashboardTemplate>
  );
}

export default AddBonCommandePage;
