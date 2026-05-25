import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import TemplateSelector from "../../../../templates/TemplateSelector/TemplateSelector";
import DocumentMetaForm from "../../../../components/organisms/DocumentMetaForm/DocumentMetaForm";
import ProductCatalog from "../../../../components/organisms/ProductCatalog/ProductCatalog";
import DocumentLines from "../../../../components/organisms/DocumentLines/DocumentLines";
import { buildProductsById, computeCommercialTotals } from "../../../../utils/commercialTotals";
import { getCurrencyRates } from "../../../../services/currencyRateApi";
import { ADD_PURCHASE_PAGE_DEFAULTS } from "../defaults/addPurchasePage_default";
import { createAchatThunk } from "../../../../redux/reducers/AchatsReducer";
import { fetchSuppliers } from "../../../../redux/reducers/SuppliersReducer";
import { fetchProducts } from "../../../../redux/reducers/ProductsReducer";

const buildPurchaseNumber = () => {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const hh = String(now.getHours()).padStart(2, "0");
  const mi = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");

  return `ACH-${yyyy}${mm}${dd}-${hh}${mi}${ss}`;
};

const buildInitialFormState = (metaFields, initialValues, linePriceFieldName) => {
  const state = {};

  metaFields.forEach((field) => {
    state[field.key] = initialValues?.[field.key] ?? field.defaultValue ?? "";
  });

  state.items = Array.isArray(initialValues?.items) && initialValues.items.length > 0
    ? initialValues.items.map((item) => ({
        productId: item?.productId || item?.product || "",
        quantity: String(item?.quantity ?? "1"),
        [linePriceFieldName]: String(item?.[linePriceFieldName] ?? item?.unitPrice ?? item?.unitCost ?? "0"),
      }))
    : [{ productId: "", quantity: "1", unitCost: "0" }];

  return state;
};

function AddPurchasePage(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { templateProps } = { ...ADD_PURCHASE_PAGE_DEFAULTS, ...props };
  const { shellProps } = templateProps;

  const achatsState = useSelector((state) => state.achats || {});
  const suppliersState = useSelector((state) => state.suppliers || {});
  const productsState = useSelector((state) => state.products || {});

  const initialValues = useMemo(() => {
    const fromOcr = location.state?.ocrPrefill;

    if (!fromOcr) {
      return {
        purchaseNumber: buildPurchaseNumber(),
        date: "",
        supplierId: "",
        currencyCode: "TND",
        status: "PENDING",
        ocrSource: "",
        items: [],
      };
    }

    return {
      purchaseNumber: String(fromOcr.purchaseNumber || buildPurchaseNumber()).trim(),
      date: String(fromOcr.date || "").trim(),
      supplierId: String(fromOcr.supplierId || "").trim(),
      currencyCode: String(fromOcr.currencyCode || "TND").trim().toUpperCase(),
      status: "PENDING",
      ocrSource: String(fromOcr.ocrSource || "").trim(),
      items: [],
    };
  }, [location.state]);

  const [currencyCode, setCurrencyCode] = useState(initialValues.currencyCode || "TND");
  const [currencyRatesMap, setCurrencyRatesMap] = useState({ TND: 1 });

  useEffect(() => {
    if (!suppliersState?.items?.length && !suppliersState?.loading) {
      dispatch(fetchSuppliers());
    }

    if (!productsState?.items?.length && !productsState?.loading) {
      dispatch(fetchProducts());
    }
  }, [dispatch, productsState?.items?.length, productsState?.loading, suppliersState?.items?.length, suppliersState?.loading]);

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
          if (!code || !Number.isFinite(rateValue) || rateValue <= 0 || item?.isActive === false) {
            return;
          }
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

  const suppliersOptions = useMemo(
    () => (suppliersState?.items || []).map((supplier) => ({ label: `${supplier.fullName} (${supplier.email})`, value: supplier.id })),
    [suppliersState?.items],
  );

  const productsOptions = useMemo(
    () => (productsState?.items || []).map((product) => ({
      label: `${product.name} (${product.reference})`,
      value: product.id,
      category: product.category,
      price: convertFromTnd(product.buyPriceValue),
      tvaRate: product.tvaRate,
      stockQuantity: product.stockQuantity,
      stock: product.stockQuantity,
      avatar: product.avatar,
      imageUrl: product.imageUrl,
    })),
    [productsState?.items, selectedRate],
  );

  const productsById = useMemo(() => buildProductsById(productsState?.items || []), [productsState?.items]);

  const [formValues, setFormValues] = useState(() => buildInitialFormState([
    { key: "purchaseNumber" },
    { key: "supplierId" },
    { key: "currencyCode", defaultValue: "TND" },
    { key: "date" },
    { key: "status" },
    { key: "ocrSource" },
  ], initialValues, "unitCost"));

  useEffect(() => {
    setFormValues(buildInitialFormState([
      { key: "purchaseNumber" },
      { key: "supplierId" },
      { key: "currencyCode", defaultValue: "TND" },
      { key: "date" },
      { key: "status" },
      { key: "ocrSource" },
    ], initialValues, "unitCost"));
  }, [initialValues]);

  const totals = useMemo(() => computeCommercialTotals(formValues.items, { priceFieldName: "unitCost", productsById }), [formValues.items, productsById]);

  const handleSave = async (payload) => {
    const result = await dispatch(createAchatThunk(payload));
    if (result?.success) {
      navigate("/achats", { state: { successMessage: "Achat ajoute avec succes!" } });
    }
  };

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
          unitCost: convertCurrency(item.unitCost, previousRate, nextRate),
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
    setFormValues((prev) => ({ ...prev, items: [...prev.items, { productId: "", quantity: "1", unitCost: "0" }] }));
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

      return {
        ...prev,
        items: [...prev.items, { productId, quantity: "1", unitCost: String(Number(product.price) || 0) }],
      };
    });
  };

  const submit = () => {
    const normalizedItems = formValues.items
      .map((item) => ({ productId: String(item.productId || "").trim(), quantity: Number(item.quantity), unitCost: Number(item.unitCost) }))
      .filter((item) => item.productId && Number.isFinite(item.quantity) && item.quantity > 0);

    handleSave({
      purchaseNumber: formValues.purchaseNumber,
      supplierId: formValues.supplierId,
      date: formValues.date,
      status: formValues.status,
      ocrSource: formValues.ocrSource,
      currencyCode,
      exchangeRateToTnd: selectedRate,
      originalCurrencyTotals: totals,
      items: normalizedItems.map((item) => ({ ...item, unitCost: convertToTnd(item.unitCost) })),
    });
  };

  return (
    <TemplateSelector {...shellProps}>
      <div className="p-product-page">
        <div className="p-document-page__titlebar">
          <h2 className="p-document-page__title">Ajouter un achat</h2>
        </div>

        <div className="p-document-page-actions" style={{ marginBottom: 12 }}>
          <button type="button" className="p-action-btn p-action-btn--info" onClick={() => navigate("/achats/ocr")}>OCR facture fournisseur</button>
        </div>

        <DocumentMetaForm
          metaFields={[
            { key: "purchaseNumber", label: "N° Achat", placeholder: "ACH-20260430-120000", readOnly: true },
            { key: "supplierId", label: "Fournisseur", type: "select", placeholder: "Sélectionner un fournisseur", options: suppliersOptions },
            { key: "currencyCode", label: "Monnaie", type: "select", options: currencyOptions },
            { key: "date", label: "Date", inputType: "date" },
            { key: "status", label: "Statut", type: "select", options: [
              { label: "En attente", value: "PENDING" },
              { label: "Recu", value: "RECEIVED" },
              { label: "Annule", value: "CANCELLED" },
            ] },
            { key: "ocrSource", label: "Notes", placeholder: "Notes d'achat" },
          ]}
          values={formValues}
          onChange={handleFieldChange}
        />

        <div className="p-document-form__workspace">
          <ProductCatalog
            productsOptions={productsOptions}
            onAddProduct={addProductToCart}
            title="Catalogue produits"
            emptyText="Aucun produit trouve."
            currencyCode={currencyCode}
          />

          <DocumentLines
            items={formValues.items}
            productsOptions={productsOptions}
            totals={totals}
            onChangeItem={handleItemChange}
            onAddRow={addItemRow}
            onRemoveRow={removeItemRow}
            linePriceFieldName="unitCost"
            linePriceHeaderLabel={`Prix unit. (${currencyCode})`}
            title="Lignes d'achat"
            onSave={submit}
            onCancel={() => navigate("/achats")}
            saveLoading={achatsState?.creating}
            submitLabel="Enregistrer"
            currencyCode={currencyCode}
          />
        </div>
      </div>
    </TemplateSelector>
  );
}

export default AddPurchasePage;
