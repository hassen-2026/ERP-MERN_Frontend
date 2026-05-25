import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import DashboardTemplate from "../../../../templates/TemplateAdmin/TemplateAdmin";
import Select from "../../../../components/atoms/select/Select";
import LineSelectionForm from "../../../../components/organisms/LineSelectionForm/LineSelectionForm";
import { fetchBonCommandes } from "../../../../redux/reducers/BonCommandeReducer";
import { fetchClients } from "../../../../redux/reducers/ClientReducer";
import { fetchCommandes } from "../../../../redux/reducers/CommandeReducer";
import { createFacture } from "../../../../services/factureApi";
import "../../Supplier_Pages/SupplierDetailPage/SupplierDetailPage.css";

function AddFacturePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const bonCommandesState = useSelector((state) => state.bonCommandes || {});
  const clientsState = useSelector((state) => state.clients || {});
  const commandesState = useSelector((state) => state.commandes || {});

  const [note, setNote] = useState("");
  const [date, setDate] = useState("");
  const [clientId, setClientId] = useState("");
  const [selectedBonIds, setSelectedBonIds] = useState([]);
  const [selectedLineIds, setSelectedLineIds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!bonCommandesState.items.length && !bonCommandesState.loading) {
      dispatch(fetchBonCommandes());
    }
  }, [dispatch, bonCommandesState.items.length, bonCommandesState.loading]);

  useEffect(() => {
    if (!clientsState.items.length && !clientsState.loading) {
      dispatch(fetchClients());
    }
  }, [dispatch, clientsState.items.length, clientsState.loading]);

  useEffect(() => {
    if (!commandesState.items.length && !commandesState.loading) {
      dispatch(fetchCommandes());
    }
  }, [dispatch, commandesState.items.length, commandesState.loading]);

  const clientOptions = useMemo(
    () =>
      (clientsState.items || []).map((item) => ({
        id: String(item.id),
        label: item.nom || item.fullName || `Client ${item.id}`,
      })),
    [clientsState.items]
  );

  const commandesById = useMemo(() => {
    const map = new Map();
    (commandesState.items || []).forEach((item) => {
      map.set(String(item.id), item);
    });
    return map;
  }, [commandesState.items]);

  const bonOptions = useMemo(
    () =>
      (bonCommandesState.items || [])
        .filter((item) => item.status !== "DELIVERED" && item.status !== "CANCELLED")
        .filter((item) => {
          if (!clientId) return false;

          const directClientId =
            item?.clientId ||
            item?.client?._id ||
            item?.client?.id ||
            item?.commande?.client?._id ||
            item?.commande?.client?.id;

          if (directClientId && String(directClientId) === String(clientId)) return true;

          const commandeLinked = commandesById.get(String(item.commandeId || ""));
          return String(commandeLinked?.clientId || "") === String(clientId);
        })
        .map((item) => ({
          value: String(item.id),
          label: `${item.bonNumber}`,
        })),
    [bonCommandesState.items, clientId, commandesById]
  );

  const selectedBons = useMemo(
    () =>
      (bonCommandesState.items || []).filter((item) =>
        selectedBonIds.includes(String(item.id))
      ),
    [bonCommandesState.items, selectedBonIds]
  );

  const pendingLines = useMemo(
    () => {
      const aggregated = [];

      selectedBons.forEach((bon) => {
        (bon.lines || []).forEach((line) => {
          if (Number(line.remainingQuantity || 0) <= 0) return;
          if (String(line.status || "PENDING").toUpperCase() === "DELIVERED") return;

          aggregated.push({
            ...line,
            bonNumber: bon.bonNumber,
          });
        });
      });

      return aggregated;
    },
    [selectedBons]
  );

  useEffect(() => {
    if (!clientId) {
      setSelectedBonIds([]);
      setSelectedLineIds([]);
      return;
    }

    setSelectedBonIds((prev) => {
      const allowed = new Set(bonOptions.map((opt) => String(opt.value)));
      return prev.filter((id) => allowed.has(String(id)));
    });
  }, [clientId, bonOptions]);

  useEffect(() => {
    const ids = pendingLines.map((line) => String(line.id));
    setSelectedLineIds(ids);
  }, [selectedBonIds, pendingLines]);

  const toggleLine = (lineId) => {
    const normalizedId = String(lineId);
    setSelectedLineIds((prev) => (prev.includes(normalizedId) ? prev.filter((id) => id !== normalizedId) : [...prev, normalizedId]));
  };

  const pendingLinesColumns = useMemo(
    () => [
      {
        key: "bon",
        title: "Bon",
        render: (row) => row.bonNumber || "-",
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
    []
  );

  const handleSubmit = async () => {
    if (!clientId) {
      setError("Veuillez sélectionner un client.");
      return;
    }

    if (!selectedBonIds.length) {
      setError("Veuillez sélectionner au moins un bon de commande.");
      return;
    }

    if (!selectedLineIds.length) {
      setError("Veuillez sélectionner au moins une ligne.");
      return;
    }

    const selectedLines = pendingLines.filter((line) => selectedLineIds.includes(String(line.id)));

    const factureItems = selectedLines
      .map((line) => ({
        productId: line.productId,
        quantity: Number(line.remainingQuantity || 0),
        unitPrice: Number(line.unitPrice || 0),
        lineTotal: Number(line.remainingQuantity || 0) * Number(line.unitPrice || 0),
      }))
      .filter((item) => item.productId && item.quantity > 0);

    if (!factureItems.length) {
      setError("Aucune ligne valide pour créer la facture.");
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const now = new Date();
      const yyyymmdd = now.toISOString().slice(0, 10).replace(/-/g, "");
      const invoiceNumber = `FAC-${yyyymmdd}-${String(now.getTime()).slice(-6)}`;
      const totalAmountTTC = factureItems.reduce((sum, item) => sum + item.lineTotal, 0);

      const payload = {
        invoiceNumber,
        date: date || new Date().toISOString().slice(0, 10),
        items: factureItems,
        totalAmountTTC,
        paymentStatus: "UNPAID",
        clientId,
        bonCommandeIds: selectedBonIds,
        bonCommandeLineIds: selectedLineIds,
        notes: note || "",
      };

      await createFacture(payload);
      await dispatch(fetchBonCommandes());
      navigate("/factures", { state: { successMessage: "Facture créée avec succès." } });
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Erreur lors de la création de la facture");
    } finally {
      setIsLoading(false);
    }
  };

  const extraFilters = (
    <div className="p-supplier-page__field">
      <label className="p-field__label">Bons de commande</label>
      <Select
        mode="multiple"
        customClassName="p-supplier-page__control"
        value={selectedBonIds}
        options={bonOptions}
        placeholder={clientId ? "Sélectionner les bons..." : "Sélectionnez d'abord un client"}
        onChange={(values) => setSelectedBonIds(Array.isArray(values) ? values.map(String) : [])}
        disabled={!clientId}
        allowClear
      />
    </div>
  );

  return (
    <DashboardTemplate>
      <div style={{ marginBottom: 16 }}>
        <button 
          type="button" 
          className="p-action-btn p-action-btn--success" 
          onClick={() => navigate("/factures/ocr")}
          style={{ marginBottom: 12 }}
        >
          📄 Extraction OCR facture
        </button>
      </div>
      <LineSelectionForm
        title="Créer une facture depuis plusieurs bons de commande"
        selectLabel="Client"
        selectOptions={clientOptions}
        selectedId={clientId}
        onSelectChange={setClientId}
        date={date}
        onDateChange={setDate}
        note={note}
        onNoteChange={setNote}
        extraFilters={extraFilters}
        lines={pendingLines}
        columns={pendingLinesColumns}
        selectedLineIds={selectedLineIds}
        onToggleLine={toggleLine}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        error={error}
        emptyMessage={clientId ? "Aucune ligne disponible pour les bons sélectionnés." : "Sélectionnez un client puis des bons de commande."}
        linesTitle="Lignes des bons sélectionnés"
        submitLabel={isLoading ? "Création..." : "Créer la facture"}
        submitDisabled={!clientId || selectedBonIds.length === 0 || selectedLineIds.length === 0 || isLoading}
        onCancel={() => navigate("/factures")}
      />
    </DashboardTemplate>
  );
}

export default AddFacturePage;
