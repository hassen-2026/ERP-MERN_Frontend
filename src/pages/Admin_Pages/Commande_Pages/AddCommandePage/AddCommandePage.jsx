import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import DashboardTemplate from "../../../../templates/TemplateAdmin/TemplateAdmin";
import DocumentMetaForm from "../../../../components/organisms/DocumentMetaForm/DocumentMetaForm";
import ProductCatalog from "../../../../components/organisms/ProductCatalog/ProductCatalog";
import DocumentLines from "../../../../components/organisms/DocumentLines/DocumentLines";
import { buildProductsById, computeCommercialTotals } from "../../../../utils/commercialTotals";
import { getCurrencyRates } from "../../../../services/currencyRateApi";
import { fetchClients } from "../../../../redux/reducers/ClientReducer";
import { fetchProducts } from "../../../../redux/reducers/ProductsReducer";
import { createCommandeThunk } from "../../../../redux/reducers/CommandeReducer";

const buildInitialFormState = (metaFields, initialValues, linePriceFieldName) => {
  const state = {};

  metaFields.forEach((field) => {
    state[field.key] = initialValues?.[field.key] ?? field.defaultValue ?? "";
  });

  state.items = Array.isArray(initialValues?.items) && initialValues.items.length > 0
    ? initialValues.items.map((item) => ({
        productId: item?.productId || "",
        quantity: String(item?.quantity ?? "1"),
        [linePriceFieldName]: String(item?.[linePriceFieldName] ?? item?.unitPrice ?? item?.unitCost ?? "0"),
      }))
    : [{ productId: "", quantity: "1", unitPrice: "0" }];

  return state;
};

function AddCommandePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const clientsState = useSelector((state) => state.clients || {});
  const productsState = useSelector((state) => state.products || {});
  const commandesState = useSelector((state) => state.commandes || {});
  const sourceDevis = location.state?.sourceDevis || null;

  const initialValues = useMemo(() => {
    if (!sourceDevis) {
      return {
        clientId: "",
        currencyCode: "TND",
        status: "DRAFT",
        date: "",
        items: [],
      };
    }

    return {
      clientId: sourceDevis.clientId,
      currencyCode: String(sourceDevis.currencyCode || "TND").trim().toUpperCase(),
      status: "CONFIRMED",
      date: sourceDevis.dateIso ? String(sourceDevis.dateIso).slice(0, 10) : "",
      items: Array.isArray(sourceDevis.items)
        ? sourceDevis.items.map((item) => ({
            productId: item.productId,
            quantity: String(item.quantity),
            unitPrice: String(item.unitPrice),
          }))
        : [],
    };
  }, [sourceDevis]);

  const [currencyCode, setCurrencyCode] = useState(initialValues.currencyCode || "TND");
  const [currencyRatesMap, setCurrencyRatesMap] = useState({ TND: 1 });

  useEffect(() => {
    if (!(clientsState.items || []).length && !clientsState.loading) dispatch(fetchClients());
    if (!(productsState.items || []).length && !productsState.loading) dispatch(fetchProducts());
  }, [clientsState.items, clientsState.loading, dispatch, productsState.items, productsState.loading]);

  useEffect(() => {
    setCurrencyCode(String(initialValues.currencyCode || "TND").trim().toUpperCase());
  }, [initialValues.currencyCode]);

  useEffect(() => {
    (async () => {
      try {
        const rates = await getCurrencyRates();
        const nextMap = { TND: 1 };
        (Array.isArray(rates) ? rates : []).forEach((item) => {
          const code = String(item?.currencyCode || "").trim().toUpperCase();
          const rateValue = Number(item?.rateToTnd || 0);
          if (!code || !Number.isFinite(rateValue) || rateValue <= 0 || item?.isActive === false) return;
          nextMap[code] = rateValue;
        });
        setCurrencyRatesMap(nextMap);
      } catch (_error) {
        setCurrencyRatesMap({ TND: 1 });
      }
    })();
  }, []);

  const selectedRate = useMemo(() => Number(currencyRatesMap[currencyCode] || 1), [currencyCode, currencyRatesMap]);
  const currencyOptions = useMemo(() => Object.keys(currencyRatesMap).sort().map((code) => ({ label: code, value: code })), [currencyRatesMap]);
  const clientOptions = useMemo(() => (clientsState.items || []).map((client) => ({ label: client.fullName || client.nom, value: client.id })), [clientsState.items]);

  const convertCurrency = (amount, fromRate, toRate) => {
    const numericAmount = Number(amount || 0);
    const numericFromRate = Number(fromRate || 1);
    const numericToRate = Number(toRate || 1);
    if (!Number.isFinite(numericAmount) || !Number.isFinite(numericFromRate) || !Number.isFinite(numericToRate) || numericFromRate <= 0 || numericToRate <= 0) {
      return 0;
    }
    return Number(((numericAmount * numericFromRate) / numericToRate).toFixed(3));
  };

  const convertToTnd = (amount) => convertCurrency(amount, selectedRate, 1);
  const convertFromTnd = (amount) => convertCurrency(amount, 1, selectedRate);

  const productOptions = useMemo(
    () => (productsState.items || []).map((product) => ({
      label: `${product.name} (${product.reference})`,
      value: product.id,
      category: product.category,
      price: convertFromTnd(product.sellPriceValue),
      tvaRate: product.tvaRate,
      stockQuantity: product.stockQuantity,
      stock: product.stockQuantity,
      avatar: product.avatar,
      imageUrl: product.imageUrl,
    })),
    [productsState.items, selectedRate],
  );
  const productsById = useMemo(() => buildProductsById(productsState.items || []), [productsState.items]);

  const [formValues, setFormValues] = useState(() => buildInitialFormState([
    { key: "clientId" },
    { key: "currencyCode", defaultValue: "TND" },
    { key: "date" },
    { key: "status" },
  ], initialValues, "unitPrice"));

  useEffect(() => {
    setFormValues(buildInitialFormState([
      { key: "clientId" },
      { key: "currencyCode", defaultValue: "TND" },
      { key: "date" },
      { key: "status" },
    ], initialValues, "unitPrice"));
  }, [initialValues]);

  const totals = useMemo(() => computeCommercialTotals(formValues.items, { priceFieldName: "unitPrice", productsById }), [formValues.items, productsById]);

  const handleFieldChange = (key, value) => {
    if (key === "currencyCode") {
      const nextCurrency = String(value || "TND").trim().toUpperCase();
      const previousRate = Number(currencyRatesMap[String(formValues.currencyCode || "TND").trim().toUpperCase()] || 1);
      const nextRate = Number(currencyRatesMap[nextCurrency] || 1);

      setCurrencyCode(nextCurrency);
      setFormValues((prev) => ({
        ...prev,
        currencyCode: nextCurrency,
        items: prev.items.map((item) => ({
          ...item,
          unitPrice: convertCurrency(item.unitPrice, previousRate, nextRate),
        })),
      }));
      return;
    }

    setFormValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleItemChange = (index, key, value) => {
    setFormValues((prev) => ({
      ...prev,
      items: prev.items.map((item, itemIndex) => (itemIndex === index ? { ...item, [key]: value } : item)),
    }));
  };

  const addItemRow = () => {
    setFormValues((prev) => ({ ...prev, items: [...prev.items, { productId: "", quantity: "1", unitPrice: "0" }] }));
  };

  const removeItemRow = (index) => {
    setFormValues((prev) => ({
      ...prev,
      items: prev.items.length <= 1 ? prev.items : prev.items.filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const addProductToCart = (product) => {
    if (!product?.value) return;
    const productId = String(product.value);

    setFormValues((prev) => {
      const existingIndex = prev.items.findIndex((item) => String(item.productId) === productId);
      if (existingIndex >= 0) {
        return {
          ...prev,
          items: prev.items.map((item, index) => (
            index === existingIndex
              ? { ...item, quantity: String((Number(item.quantity) || 0) + 1) }
              : item
          )),
        };
      }

      return { ...prev, items: [...prev.items, { productId, quantity: "1", unitPrice: String(Number(product.price) || 0) }] };
    });
  };

  const handleSave = async (payload) => {
    const result = await dispatch(createCommandeThunk(payload));
    if (result?.success) {
      navigate("/commandes", { state: { successMessage: "Commande ajoutée avec succès." } });
    }
  };

  const submit = () => {
    const normalizedItems = formValues.items
      .map((item) => ({ productId: String(item.productId || "").trim(), quantity: Number(item.quantity), unitPrice: Number(item.unitPrice) }))
      .filter((item) => item.productId && Number.isFinite(item.quantity) && item.quantity > 0);

    handleSave({
      clientId: formValues.clientId,
      date: formValues.date,
      status: formValues.status,
      currencyCode,
      exchangeRateToTnd: selectedRate,
      originalCurrencyTotals: totals,
      items: normalizedItems.map((item) => ({ ...item, unitPrice: convertToTnd(item.unitPrice) })),
    });
  };

  return (
    <DashboardTemplate>
      <div className="p-product-page">
        <div className="p-document-page__titlebar">
          <h2 className="p-document-page__title">Ajouter une commande</h2>
        </div>

        <DocumentMetaForm
          metaFields={[
            { key: "clientId", label: "Client", type: "select", placeholder: "Sélectionner un client", options: clientOptions },
            { key: "currencyCode", label: "Monnaie", type: "select", options: currencyOptions },
            { key: "date", label: "Date", inputType: "date" },
            { key: "status", label: "Statut", type: "select", options: [
              { label: "Brouillon", value: "DRAFT" },
              { label: "Confirmée", value: "CONFIRMED" },
              { label: "Annulée", value: "CANCELLED" },
            ] },
          ]}
          values={formValues}
          onChange={handleFieldChange}
        />

        <div className="p-document-form__workspace">
          <ProductCatalog
            productsOptions={productOptions}
            onAddProduct={addProductToCart}
            title="Catalogue produits"
            emptyText="Aucun produit trouve."
            currencyCode={currencyCode}
          />

          <DocumentLines
            items={formValues.items}
            productsOptions={productOptions}
            totals={totals}
            onChangeItem={handleItemChange}
            onAddRow={addItemRow}
            onRemoveRow={removeItemRow}
            linePriceFieldName="unitPrice"
            linePriceHeaderLabel={`Prix unitaire (${currencyCode})`}
            title="Lignes"
            onSave={submit}
            onCancel={() => navigate("/commandes")}
            saveLoading={commandesState?.creating}
            currencyCode={currencyCode}
          />
        </div>
      </div>
    </DashboardTemplate>
  );
}

export default AddCommandePage;
