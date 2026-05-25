import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import TemplateSelector from "../../../../templates/TemplateSelector/TemplateSelector";
import DocumentMetaForm from "../../../../components/organisms/DocumentMetaForm/DocumentMetaForm";
import ProductCatalog from "../../../../components/organisms/ProductCatalog/ProductCatalog";
import DocumentLines from "../../../../components/organisms/DocumentLines/DocumentLines";
import { buildProductsById, computeCommercialTotals } from "../../../../utils/commercialTotals";
import { EDIT_PURCHASE_PAGE_DEFAULTS } from "../defaults/editPurchasePage_default";
import { fetchProducts } from "../../../../redux/reducers/ProductsReducer";
import { fetchSuppliers } from "../../../../redux/reducers/SuppliersReducer";
import { fetchAchats, updateAchatThunk } from "../../../../redux/reducers/AchatsReducer";

function EditPurchasePage(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    shellProps,
    notFoundMessage,
    loadingMessage,
    formProps,
  } = { ...EDIT_PURCHASE_PAGE_DEFAULTS, ...props };

  const achatsState = useSelector((state) => state.achats || {});
  const suppliersState = useSelector((state) => state.suppliers || {});
  const productsState = useSelector((state) => state.products || {});

  useEffect(() => {
    if (!achatsState?.items?.length && !achatsState?.loading) {
      dispatch(fetchAchats());
    }

    if (!suppliersState?.items?.length && !suppliersState?.loading) {
      dispatch(fetchSuppliers());
    }

    if (!productsState?.items?.length && !productsState?.loading) {
      dispatch(fetchProducts());
    }
  }, [
    achatsState?.items?.length,
    achatsState?.loading,
    dispatch,
    productsState?.items?.length,
    productsState?.loading,
    suppliersState?.items?.length,
    suppliersState?.loading,
  ]);

  const achat = useMemo(
    () => (achatsState?.items || []).find((item) => String(item.id) === String(id)) || null,
    [achatsState?.items, id],
  );

  const initialValues = useMemo(() => {
    if (!achat) return null;
    const dateValue = achat?.dateIso ? new Date(achat.dateIso).toISOString().slice(0, 10) : "";
    return {
      purchaseNumber: achat.purchaseNumber || "",
      supplierId: achat.supplierId || "",
      status: achat.status || "PENDING",
      date: dateValue,
      ocrSource: achat.ocrSource || "",
      items: (achat.items || []).map((item) => ({ productId: item.productId, quantity: String(item.quantity), unitCost: String(item.unitCost) })),
    };
  }, [achat]);

  const buildInitialState = (metaFields, initialValues, linePriceFieldName) => {
    const state = {};
    metaFields.forEach((field) => { state[field.key] = initialValues?.[field.key] ?? field.defaultValue ?? ""; });
    state.items = Array.isArray(initialValues?.items) && initialValues.items.length > 0
      ? initialValues.items.map((item) => ({ productId: item?.productId || "", quantity: String(item?.quantity ?? "1"), [linePriceFieldName]: String(item?.[linePriceFieldName] ?? item?.unitPrice ?? item?.unitCost ?? "0") }))
      : [{ productId: "", quantity: "1", unitCost: "0" }];
    return state;
  };

  const [formValues, setFormValues] = useState(() => initialValues ? buildInitialState([
    { key: "purchaseNumber" }, { key: "supplierId" }, { key: "date" }, { key: "status" }, { key: "ocrSource" },
  ], initialValues, "unitCost") : null);

  useEffect(() => { if (initialValues) setFormValues(buildInitialState([{ key: "purchaseNumber" }, { key: "supplierId" }, { key: "date" }, { key: "status" }, { key: "ocrSource" }], initialValues, "unitCost")); }, [initialValues]);

  const handleFieldChange = (key, value) => setFormValues((prev) => ({ ...prev, [key]: value }));
  const handleItemChange = (index, key, value) => setFormValues((prev) => ({ ...prev, items: prev.items.map((it, i) => (i === index ? { ...it, [key]: value } : it)) }));
  const addItemRow = () => setFormValues((prev) => ({ ...prev, items: [...prev.items, { productId: "", quantity: "1", unitCost: "0" }] }));
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

      return { ...prev, items: [...prev.items, { productId, quantity: "1", unitCost: String(Number(product.price) || 0) }] };
    });
  };
  const removeItemRow = (index) => setFormValues((prev) => ({ ...prev, items: prev.items.length <= 1 ? prev.items : prev.items.filter((_, i) => i !== index) }));

  const handleSaveLocal = async () => {
    const normalizedItems = formValues.items.map((item) => ({ productId: String(item.productId || "").trim(), quantity: Number(item.quantity), unitCost: Number(item.unitCost) })).filter((it) => it.productId && Number.isFinite(it.quantity) && it.quantity > 0);
    const payload = { purchaseNumber: formValues.purchaseNumber, supplierId: formValues.supplierId, date: formValues.date, status: formValues.status, ocrSource: formValues.ocrSource, items: normalizedItems };
    const result = await dispatch(updateAchatThunk(id, payload));
    if (result?.success) navigate("/achats", { state: { successMessage: "Achat modifie avec succes!" } });
  };

  const suppliersOptions = useMemo(
    () =>
      (suppliersState?.items || []).map((supplier) => ({
        label: `${supplier.fullName} (${supplier.email})`,
        value: supplier.id,
      })),
    [suppliersState?.items],
  );

  const productsOptions = useMemo(
    () =>
      (productsState?.items || []).map((product) => ({
        label: `${product.name} (${product.reference})`,
        value: product.id,
        category: product.category,
        price: product.buyPriceValue,
        tvaRate: product.tvaRate,
        stockQuantity: product.stockQuantity,
        stock: product.stockQuantity,
        avatar: product.avatar,
      })),
    [productsState?.items],
  );
  const productsById = useMemo(() => buildProductsById(productsState?.items || []), [productsState?.items]);
  const totals = useMemo(() => computeCommercialTotals(formValues?.items || [], { priceFieldName: "unitCost", productsById }), [formValues?.items, productsById]);

  const handleSave = async (formValues) => {
    const result = await dispatch(updateAchatThunk(id, formValues));

    if (result?.success) {
      navigate("/achats", { state: { successMessage: "Achat modifie avec succes!" } });
    }
  };

  return (
    <TemplateSelector {...shellProps}>
      <div className="p-product-page">
        <div className="p-document-page__titlebar">
          <h2 className="p-document-page__title">Modifier un achat</h2>
        </div>
        {achatsState?.loading ? <div className="p-card p-product-page__state">{loadingMessage}</div> : null}
        {!achatsState?.loading && !achat ? <div className="p-card p-product-page__state">{notFoundMessage}</div> : null}
        {achat && formValues ? (
          <>
          <DocumentMetaForm
            metaFields={[
              { key: "purchaseNumber", label: "N° Achat", placeholder: "ACH-20260430-120000", readOnly: true },
              { key: "supplierId", label: "Fournisseur", type: "select", placeholder: "Sélectionner un fournisseur", options: suppliersOptions },
              { key: "date", label: "Date", inputType: "date" },
              { key: "status", label: "Statut", type: "select", options: [ { label: "En attente", value: "PENDING" }, { label: "Recu", value: "RECEIVED" }, { label: "Annule", value: "CANCELLED" } ] },
              { key: "ocrSource", label: "Notes", placeholder: "Notes d'achat" },
            ]}
            values={formValues}
            onChange={handleFieldChange}
          />

          <div className="p-document-form__workspace">
            <ProductCatalog productsOptions={productsOptions} onAddProduct={addProductToCart} title="Catalogue produits" emptyText="Aucun produit trouve." />

            <DocumentLines
              items={formValues.items}
              productsOptions={productsOptions}
              totals={totals}
              onChangeItem={handleItemChange}
              onAddRow={addItemRow}
              onRemoveRow={removeItemRow}
              linePriceFieldName="unitCost"
              linePriceHeaderLabel="Prix unit."
              title="Lignes d'achat"
              onSave={handleSaveLocal}
              onCancel={() => navigate(`/achats/${id}`)}
              saveLoading={achatsState?.updating}
            />
          </div>
          </>
        ) : null}
      </div>
    </TemplateSelector>
  );
}

export default EditPurchasePage;
