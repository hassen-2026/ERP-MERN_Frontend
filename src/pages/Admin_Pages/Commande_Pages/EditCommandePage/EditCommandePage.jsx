import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import TemplateSelector from "../../../../templates/TemplateSelector/TemplateSelector";
import DocumentMetaForm from "../../../../components/organisms/DocumentMetaForm/DocumentMetaForm";
import ProductCatalog from "../../../../components/organisms/ProductCatalog/ProductCatalog";
import DocumentLines from "../../../../components/organisms/DocumentLines/DocumentLines";
import { buildProductsById, computeCommercialTotals } from "../../../../utils/commercialTotals";
import { fetchClients } from "../../../../redux/reducers/ClientReducer";
import { fetchProducts } from "../../../../redux/reducers/ProductsReducer";
import { fetchCommandes, updateCommandeThunk } from "../../../../redux/reducers/CommandeReducer";

function EditCommandePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const clientsState = useSelector((state) => state.clients || {});
  const productsState = useSelector((state) => state.products || {});
  const commandesState = useSelector((state) => state.commandes || {});

  useEffect(() => {
    if (!clientsState.items.length && !clientsState.loading) dispatch(fetchClients());
    if (!productsState.items.length && !productsState.loading) dispatch(fetchProducts());
    if (!commandesState.items.length && !commandesState.loading) dispatch(fetchCommandes());
  }, [clientsState.items.length, clientsState.loading, commandesState.items.length, commandesState.loading, dispatch, productsState.items.length, productsState.loading]);

  const commande = useMemo(() => commandesState.items.find((item) => String(item.id) === String(id)) || null, [commandesState.items, id]);
  const clientOptions = useMemo(() => clientsState.items.map((client) => ({ label: client.fullName || client.nom, value: client.id })), [clientsState.items]);
  const productOptions = useMemo(
    () =>
      productsState.items.map((product) => ({
        label: `${product.name} (${product.reference})`,
        value: product.id,
        category: product.category,
        price: product.sellPriceValue,
        tvaRate: product.tvaRate,
        stockQuantity: product.stockQuantity,
        stock: product.stockQuantity,
        avatar: product.avatar,
        imageUrl: product.imageUrl,
      })),
    [productsState.items],
  );
  const productsById = useMemo(() => buildProductsById(productsState.items || []), [productsState.items]);
  const totals = useMemo(() => computeCommercialTotals(formValues?.items || [], { priceFieldName: "unitPrice", productsById }), [formValues?.items, productsById]);
  const isLocked = Boolean(commande?.stockApplied || (commande?.factureNumber && commande.factureNumber !== "-"));

  const metaFields = [
    { key: "clientId", label: "Client", type: "select", placeholder: "Sélectionner un client", options: clientOptions },
    { key: "date", label: "Date", inputType: "date" },
    { key: "status", label: "Statut", type: "select", options: [ { label: "Brouillon", value: "DRAFT" }, { label: "Confirmée", value: "CONFIRMED" }, { label: "Annulée", value: "CANCELLED" } ] },
  ];

  const buildInitialState = (metaFields, initialValues, linePriceFieldName) => {
    const state = {};
    metaFields.forEach((field) => { state[field.key] = initialValues?.[field.key] ?? field.defaultValue ?? ""; });
    state.items = Array.isArray(initialValues?.items) && initialValues.items.length > 0
      ? initialValues.items.map((item) => ({ productId: item?.productId || "", quantity: String(item?.quantity ?? "1"), [linePriceFieldName]: String(item?.[linePriceFieldName] ?? item?.unitPrice ?? item?.unitCost ?? "0") }))
      : [{ productId: "", quantity: "1", unitPrice: "0" }];
    return state;
  };

  const [formValues, setFormValues] = useState(() => buildInitialState(metaFields, commande ? { clientId: commande.clientId, status: commande.status, date: commande.dateIso ? String(commande.dateIso).slice(0,10) : "", items: commande.items } : null, "unitPrice"));

  useEffect(() => { if (commande) setFormValues(buildInitialState(metaFields, { clientId: commande.clientId, status: commande.status, date: commande.dateIso ? String(commande.dateIso).slice(0,10) : "", items: commande.items }, "unitPrice")); }, [commande]);

  const handleFieldChange = (key, value) => setFormValues((prev) => ({ ...prev, [key]: value }));
  const handleItemChange = (index, key, value) => setFormValues((prev) => ({ ...prev, items: prev.items.map((it, i) => (i === index ? { ...it, [key]: value } : it)) }));
  const addItemRow = () => setFormValues((prev) => ({ ...prev, items: [...prev.items, { productId: "", quantity: "1", unitPrice: "0" }] }));
  const addProductToCart = (product) => {
    if (!product?.value) return;
    const productId = String(product.value);
    setFormValues((prev) => {
      const existing = prev.items.findIndex((it) => String(it.productId) === productId);
      if (existing >= 0) {
        return {
          ...prev,
          items: prev.items.map((it, i) => (i === existing ? { ...it, quantity: String((Number(it.quantity) || 0) + 1) } : it)),
        };
      }

      return { ...prev, items: [...prev.items, { productId, quantity: "1", unitPrice: String(Number(product.price) || 0) }] };
    });
  };
  const removeItemRow = (index) => setFormValues((prev) => ({ ...prev, items: prev.items.length <= 1 ? prev.items : prev.items.filter((_, i) => i !== index) }));

  const handleSaveLocal = async () => {
    const payload = { clientId: formValues.clientId, date: formValues.date, status: formValues.status, items: formValues.items.map((item) => ({ productId: String(item.productId || "").trim(), quantity: Number(item.quantity), unitPrice: Number(item.unitPrice) })).filter((it) => it.productId && Number.isFinite(it.quantity) && it.quantity > 0) };
    const result = await dispatch(updateCommandeThunk(id, payload));
    if (result?.success) navigate("/commandes", { state: { successMessage: "Commande mise à jour avec succès." } });
  };

  const handleSave = async (payload) => {
    const result = await dispatch(updateCommandeThunk(id, payload));
    if (result?.success) {
      navigate("/commandes", { state: { successMessage: "Commande mise à jour avec succès." } });
    }
  };

  return (
    <TemplateSelector>
      <div className="p-product-page">
      <div className="p-document-page__titlebar">
        <h2 className="p-document-page__title">Modifier une commande</h2>
      </div>

      {!commandesState.loading && !commande ? <div className="p-card p-product-page__state">Commande introuvable.</div> : null}

      {commande && isLocked ? (
        <div className="p-card p-product-page__state">
          Cette commande a déjà démarré sa livraison par items ou a généré une facture. Le backend limite sa modification.
        </div>
      ) : null}

      {commande && !isLocked ? (
        <>
          <DocumentMetaForm
            metaFields={metaFields}
            values={formValues}
            onChange={handleFieldChange}
          />

          <div className="p-document-form__workspace">
            <ProductCatalog productsOptions={productOptions} onAddProduct={addProductToCart} title="Catalogue produits" emptyText="Aucun produit trouve." />

            <DocumentLines
              items={formValues.items}
              productsOptions={productOptions}
              totals={totals}
              onChangeItem={handleItemChange}
              onAddRow={addItemRow}
              onRemoveRow={removeItemRow}
              linePriceFieldName="unitPrice"
              linePriceHeaderLabel="Prix unitaire"
              title="Lignes"
              onSave={handleSaveLocal}
              onCancel={() => navigate("/commandes")}
              saveLoading={commandesState?.updating}
            />
          </div>
        </>
      ) : null}
      </div>
    </TemplateSelector>
  );
}

export default EditCommandePage;