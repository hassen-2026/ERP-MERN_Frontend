import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import TemplateSelector from "../../../../templates/TemplateSelector/TemplateSelector";
import Button from "../../../../components/atoms/button/Button";
import PageHeader from "../../../../components/organisms/PageHeader/PageHeader";
import Overview from "../../../../components/organisms/Overview/Overview";
import { PURCHASE_DETAIL_PAGE_DEFAULTS } from "../defaults/purchaseDetailPage_default";
import { fetchAchats, receiveAchatThunk } from "../../../../redux/reducers/AchatsReducer";
import "../../Supplier_Pages/SupplierDetailPage/SupplierDetailPage.css";

function PurchaseDetailPage(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedLineIndexes, setSelectedLineIndexes] = useState([]);
  const [receiveQuantities, setReceiveQuantities] = useState({});

  const { shellProps, notFoundMessage } = { ...PURCHASE_DETAIL_PAGE_DEFAULTS, ...props };

  const achatsState = useSelector((state) => state.achats || {});
  const roleFromStore = useSelector((state) => state.user?.user?.role || state.user?.user?.type || "USER");
  const normalizedRole = String(roleFromStore || "USER").trim().toUpperCase();
  const canEditPurchase = ["ADMIN", "PROCUREMENT_MANAGER"].includes(normalizedRole);

  useEffect(() => {
    if (!achatsState?.items?.length && !achatsState?.loading) {
      dispatch(fetchAchats());
    }
  }, [achatsState?.items?.length, achatsState?.loading, dispatch]);

  const achat = useMemo(
    () => (achatsState?.items || []).find((item) => String(item.id) === String(id)) || null,
    [achatsState?.items, id],
  );

  useEffect(() => {
    setSelectedLineIndexes([]);
  }, [achat?.id, achat?.status]);

  function HeaderSelectAll() {
    const ref = useRef(null);
    const selectableIndexes = (achat?.items || [])
      .map((it, idx) => ({ it, idx }))
      .filter(({ it }) => !(achat?.status === "RECEIVED" || it?.status === "RECEIVED"))
      .map(({ idx }) => idx);

    const totalSelectable = selectableIndexes.length;
    const selectedCount = selectedLineIndexes.filter((i) => selectableIndexes.includes(i)).length;

    useEffect(() => {
      if (ref.current) {
        ref.current.indeterminate = selectedCount > 0 && selectedCount < totalSelectable;
      }
    }, [selectedCount, totalSelectable]);

    const checked = totalSelectable > 0 && selectedCount === totalSelectable;

    const handleChange = (event) => {
      const { checked } = event.target;
      if (checked) {
        setSelectedLineIndexes(selectableIndexes);
        setReceiveQuantities((prev) => {
          const next = { ...prev };
          selectableIndexes.forEach((i) => {
            const pending = Number(achat?.items?.[i]?.pendingQuantity || 0);
            if (!next[i]) next[i] = pending;
          });
          return next;
        });
      } else {
        setSelectedLineIndexes([]);
        setReceiveQuantities((prev) => {
          const next = { ...prev };
          selectableIndexes.forEach((i) => { delete next[i]; });
          return next;
        });
      }
    };

    return (
      <input
        type="checkbox"
        ref={ref}
        checked={checked}
        disabled={totalSelectable === 0}
        onChange={handleChange}
      />
    );
  }

  const headerActions = [
    ...(canEditPurchase
      ? [{
          id: "edit-achat",
          label: "Modifier",
          className: "p-supplier-toolbar-btn p-supplier-toolbar-btn--add",
          onClick: () => navigate(`/achats/${id}/edit`),
        }]
      : []),
    {
      id: "back-achats",
      label: "Retour",
      className: "p-supplier-toolbar-btn",
      onClick: () => navigate("/achats"),
    },
  ];

  const itemColumns = [
    {
      key: "selected",
      header: (
        <HeaderSelectAll />
      ),
      render: (item, rowIndex) => (
        <input
          type="checkbox"
          checked={selectedLineIndexes.includes(rowIndex)}
          disabled={achat?.status === "RECEIVED" || item?.status === "RECEIVED"}
          onChange={(event) => {
            const { checked } = event.target;
            setSelectedLineIndexes((prev) => {
              if (checked) {
                setReceiveQuantities((prevQ) => ({ ...prevQ, [rowIndex]: Number(item?.pendingQuantity || 0) }));
                return [...new Set([...prev, rowIndex])];
              }
              setReceiveQuantities((prevQ) => { const next = { ...prevQ }; delete next[rowIndex]; return next; });
              return prev.filter((index) => index !== rowIndex);
            });
          }}
        />
      ),
    },
    {
      key: "toReceive",
      header: "A recevoir",
      render: (item, rowIndex) => {
        const disabled = achat?.status === "RECEIVED" || item?.status === "RECEIVED";
        const pending = Number(item?.pendingQuantity || 0);
        const value = receiveQuantities[rowIndex] !== undefined ? receiveQuantities[rowIndex] : pending;

        return (
          <input
            type="number"
            min={0}
            max={pending}
            value={value}
            disabled={disabled || !selectedLineIndexes.includes(rowIndex)}
            onChange={(e) => {
              const next = Number(e.target.value || 0);
              setReceiveQuantities((prev) => ({ ...prev, [rowIndex]: next }));
            }}
            className="p-receive-input"
          />
        );
      },
    },
    { key: "productName", header: "Produit" },
    { key: "quantity", header: "Quantite" },
    { key: "receivedQuantity", header: "Recu" },
    { key: "pendingQuantity", header: "Restant" },
    { key: "unitCostDisplay", header: "Cout unitaire" },
    { key: "lineTotalDisplay", header: "Total ligne" },
    { key: "statusLabel", header: "Statut" },
  ];

  const infoRows = [
    { label: "Numero", value: achat?.purchaseNumber || "-" },
    { label: "Fournisseur", value: achat?.supplierName || "-" },
    { label: "Statut", value: achat?.statusLabel || "-" },
    { label: "Date", value: achat?.date || "-" },
    { label: "Cree par", value: achat?.createdByName || "-" },
    { label: "Source OCR", value: achat?.ocrSource || "-" },
    { label: "Montant total", value: achat?.totalAmount || "-" },
    { label: "Cree le", value: achat?.createdAt || "-" },
    { label: "Modifie le", value: achat?.updatedAt || "-" },
  ];

  const handleReceive = async () => {
    if (!achat || achat.status === "RECEIVED" || selectedLineIndexes.length === 0) {
      return;
    }

    const confirmed = window.confirm(
      `Réceptionner ${selectedLineIndexes.length} ligne(s) de l'achat ${achat.purchaseNumber} ?`
    );

    if (!confirmed) {
      return;
    }

    const itemsPayload = selectedLineIndexes
      .map((idx) => {
        const pending = Number(achat?.items?.[idx]?.pendingQuantity || 0);
        const requested = Number(receiveQuantities[idx] || pending);
        const toReceive = Math.max(0, Math.min(requested, pending));
        return { index: idx, receivedQuantity: toReceive };
      })
      .filter((it) => Number(it.receivedQuantity) > 0);

    const result = await dispatch(receiveAchatThunk(achat.id, { items: itemsPayload }));
    if (result?.success) {
      setSelectedLineIndexes([]);
    }
  };

  const canReceiveSelection = achat && achat.status !== "RECEIVED" && selectedLineIndexes.length > 0;

  return (
    <TemplateSelector {...shellProps}>
      <div className="p-supplier-page">
        <PageHeader
          title={achat?.purchaseNumber || "Detail Achat"}
          subtitle={achat?.supplierName || ""}
          actions={headerActions}
          containerClassName="p-supplier-page__header"
          titleClassName="p-supplier-page__title"
          subtitleClassName="p-supplier-page__subtitle"
          actionsClassName="p-supplier-page__header-actions"
          defaultActionVariant="secondary"
        />

        {!achatsState?.loading && !achat ? (
          <div className="p-card p-supplier-page__state">{notFoundMessage}</div>
        ) : null}

        {achat ? (
          <Overview
            item={achat}
            itemSectionTitle="Informations achat"
            movementsSectionTitle="Lignes d'achat"
            infoRows={infoRows}
            movements={achat.items || []}
            movementsLoading={Boolean(achatsState?.loading)}
            movementsError={achatsState?.error || ""}
            loadingText="Chargement des lignes..."
            emptyMovementsText="Aucune ligne d'achat disponible."
            movementColumns={itemColumns}
            movementLimit={Number.MAX_SAFE_INTEGER}
            movementsTableClassName="p-table"
            movementsTableStateClassName="p-supplier-page__state"
            movementsTableErrorClassName="p-supplier-page__state--error"
            getMovementKey={(item, index) => item?.id ?? index}
            infoExtraContent={(
              <div className="p-form-actions">
                <Button
                  variant="success"
                  customClassName="p-action-btn p-action-btn--success"
                  onClick={handleReceive}
                  disabled={!canReceiveSelection || achatsState?.receiving}
                >
                  Réceptionner la sélection
                </Button>
                <Button
                  variant="secondary"
                  customClassName="p-action-btn"
                  onClick={() => setSelectedLineIndexes([])}
                  disabled={selectedLineIndexes.length === 0}
                >
                  Réinitialiser
                </Button>
              </div>
            )}
          />
        ) : null}
      </div>
    </TemplateSelector>
  );
}

export default PurchaseDetailPage;
