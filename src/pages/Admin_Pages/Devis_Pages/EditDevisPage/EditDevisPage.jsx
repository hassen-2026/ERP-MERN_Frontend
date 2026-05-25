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
import { fetchDevis, updateDevisThunk } from "../../../../redux/reducers/DevisReducer";

const buildCommandeNumber = () => {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const hh = String(now.getHours()).padStart(2, "0");
  const mi = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");

  return `CMD-${yyyy}${mm}${dd}-${hh}${mi}${ss}`;
};

function EditDevisPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const clientsState = useSelector((state) => state.clients || {});
  const productsState = useSelector((state) => state.products || {});
  const devisState = useSelector((state) => state.devis || {});

  useEffect(() => {
    if (!clientsState.items.length && !clientsState.loading) dispatch(fetchClients());
    if (!productsState.items.length && !productsState.loading) dispatch(fetchProducts());
    if (!devisState.items.length && !devisState.loading) dispatch(fetchDevis());
  }, [clientsState.items.length, clientsState.loading, devisState.items.length, devisState.loading, dispatch, productsState.items.length, productsState.loading]);

  const devis = useMemo(() => devisState.items.find((item) => String(item.id) === String(id)) || null, [devisState.items, id]);
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
  const isConverted = Boolean(devis?.commandeId);

  const metaFields = [
    { key: "clientId", label: "Client", type: "select", placeholder: "Sélectionner un client", options: clientOptions },
    { key: "date", label: "Date", inputType: "date" },
    { key: "status", label: "Statut", type: "select", options: [ { label: "Brouillon", value: "DRAFT" }, { label: "Envoye", value: "SENT" }, { label: "Accepte", value: "ACCEPTED" }, { label: "Refusé", value: "REJECTED" } ] },
    { key: "file", label: "Fichier", placeholder: "URL ou nom du fichier" },
  ];

  const buildInitialState = (metaFields, initialValues, linePriceFieldName) => {
    const state = {};
    metaFields.forEach((field) => { state[field.key] = initialValues?.[field.key] ?? field.defaultValue ?? ""; });
    state.items = Array.isArray(initialValues?.items) && initialValues.items.length > 0
      ? initialValues.items.map((item) => ({ productId: item?.productId || "", quantity: String(item?.quantity ?? "1"), [linePriceFieldName]: String(item?.[linePriceFieldName] ?? item?.unitPrice ?? item?.unitCost ?? "0") }))
      : [{ productId: "", quantity: "1", unitPrice: "0" }];
    return state;
  };

  const [formValues, setFormValues] = useState(() => buildInitialState(metaFields, devis ? { clientId: devis.clientId, status: devis.status, date: devis.dateIso ? String(devis.dateIso).slice(0,10) : "", file: devis.file, items: devis.items } : null, "unitPrice"));

  useEffect(() => { if (devis) setFormValues(buildInitialState(metaFields, { clientId: devis.clientId, status: devis.status, date: devis.dateIso ? String(devis.dateIso).slice(0,10) : "", file: devis.file, items: devis.items }, "unitPrice")); }, [devis]);

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
    const normalizedPayload = {
      clientId: formValues.clientId,
      date: formValues.date,
      status: formValues.status,
      file: formValues.file,
      items: formValues.items.map((item) => ({ productId: String(item.productId || "").trim(), quantity: Number(item.quantity), unitPrice: Number(item.unitPrice) })).filter((it) => it.productId && Number.isFinite(it.quantity) && it.quantity > 0),
    };

    // maintain commandeNumber generation logic
    const normalizedWithCommande = {
      ...normalizedPayload,
      commandeNumber: String(normalizedPayload?.commandeNumber || "").trim() || (String(normalizedPayload?.status || "").toUpperCase() === "ACCEPTED" ? buildCommandeNumber() : undefined),
    };

    const result = await dispatch(updateDevisThunk(id, normalizedWithCommande));
    if (result?.success) navigate("/devis", { state: { successMessage: "Devis mis à jour avec succès." } });
  };

  const handleSave = async (payload) => {
    const normalizedPayload = {
      ...payload,
      commandeNumber:
        String(payload?.commandeNumber || "").trim() ||
        (String(payload?.status || "").toUpperCase() === "ACCEPTED" ? buildCommandeNumber() : undefined),
    };

    const result = await dispatch(updateDevisThunk(id, normalizedPayload));
    if (result?.success) {
      navigate("/devis", { state: { successMessage: "Devis mis à jour avec succès." } });
    }
  };

  return (
    <TemplateSelector>
      <div className="p-product-page">
      <div className="p-document-page__titlebar">
        <h2 className="p-document-page__title">Modifier un devis</h2>
      </div>

      {!devisState.loading && !devis ? <div className="p-card p-product-page__state">Devis introuvable.</div> : null}

      {devis && isConverted ? (
        <div className="p-card p-product-page__state">
          Ce devis a déjà été converti en commande. Le backend interdit la modification du client, des lignes et du total.
        </div>
      ) : null}

      {devis && !isConverted ? (
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
              onCancel={() => navigate("/devis")}
              saveLoading={devisState?.updating}
            />
          </div>
        </>
      ) : null}
      </div>
    </TemplateSelector>
  );
}

export default EditDevisPage;