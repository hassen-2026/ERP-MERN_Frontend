import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { UploadOutlined } from "@ant-design/icons";

import DashboardTemplate from "../../../../templates/TemplateAdmin/TemplateAdmin";
import Button from "../../../../components/atoms/button/Button";
import InputField from "../../../../components/molecules/InputField/InputField";
import SelectField from "../../../../components/molecules/SelectField/SelectField";
import { extractAchatInvoiceOcr } from "../../../../services/achatApi";
import { createAchat, getAchats } from "../../../../services/achatApi";
import { createProduct, getProducts } from "../../../../services/productApi";
import { createSupplier } from "../../../../services/supplierApi";
import { getCurrencyRates } from "../../../../services/currencyRateApi";
import { fetchSuppliers } from "../../../../redux/reducers/SuppliersReducer";
import "../../Supplier_Pages/SupplierDetailPage/SupplierDetailPage.css";

const DEFAULT_CODES = ["TND", "EUR", "USD", "GBP", "CHF", "CAD"];

const normalizeCurrencyCode = (value) => {
  const normalized = String(value || "").trim().toUpperCase();
  if (normalized === "€") return "EUR";
  if (normalized === "$") return "USD";
  if (!normalized) return "TND";
  return normalized;
};

const EMPTY_RESULT = {
  numeroFacture: "",
  dateFacture: "",
  fournisseur: "",
  devise: "TND",
  tauxChange: 1,
  montantHT: null,
  montantTVA: null,
  montantTTC: null,
  source: "",
  provider: "",
  rawText: "",
  supplierId: "",
};

const EMPTY_LINE = {
  name: "",
  quantity: 1,
  unitCost: 0,
  lineTotal: 0,
};

const toFiniteNumber = (value, fallback = 0) => {
  const parsed = Number(String(value ?? "").replace(/\s/g, "").replace(/,/g, "."));
  return Number.isFinite(parsed) ? parsed : fallback;
};

const normalizeOcrLineItem = (line = {}) => {
  const name = String(line?.name || line?.designation || line?.description || "").trim();
  const quantity = toFiniteNumber(line?.quantity, 0);
  const rawUnitPrice = line?.unitCost ?? line?.unitPrice;
  const rawAmount = line?.lineTotal ?? line?.amount;
  let unitCost = toFiniteNumber(rawUnitPrice, 0);
  let lineTotal = toFiniteNumber(rawAmount, 0);

  if (!lineTotal && quantity > 0 && unitCost > 0) {
    lineTotal = Number((quantity * unitCost).toFixed(2));
  }

  if (!unitCost && quantity > 0 && lineTotal > 0) {
    unitCost = Number((lineTotal / quantity).toFixed(3));
  }

  return {
    name,
    quantity,
    unitCost,
    lineTotal,
  };
};

function PurchaseOcrPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const providerRef = useRef("textract");
  const suppliersState = useSelector((state) => state.suppliers || {});

  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [result, setResult] = useState(EMPTY_RESULT);
  const [formData, setFormData] = useState(EMPTY_RESULT);
  const [lineItems, setLineItems] = useState([]);
  const [activeProvider, setActiveProvider] = useState("textract");
  const [currencyRatesMap, setCurrencyRatesMap] = useState({ TND: 1 });

  useEffect(() => {
    if (!suppliersState.items.length && !suppliersState.loading) {
      dispatch(fetchSuppliers());
    }
  }, [dispatch, suppliersState.items.length, suppliersState.loading]);

  useEffect(() => {
    (async () => {
      try {
        const rates = await getCurrencyRates();
        const map = { TND: 1 };
        (Array.isArray(rates) ? rates : []).forEach((item) => {
          const code = normalizeCurrencyCode(item?.currencyCode);
          const rateValue = Number(item?.rateToTnd || 0);
          if (!code || !Number.isFinite(rateValue) || rateValue <= 0) return;
          if (item?.isActive === false) return;
          map[code] = rateValue;
        });
        setCurrencyRatesMap(map);
      } catch (_error) {
        setCurrencyRatesMap({ TND: 1 });
      }
    })();
  }, []);

  const supplierOptions = useMemo(
    () =>
      (suppliersState.items || []).map((supplier) => ({
        value: supplier.id,
        label: supplier.fullName,
        searchLabel: `${supplier.fullName} ${supplier.email}`.toLowerCase(),
      })),
    [suppliersState.items],
  );

  const currencyOptions = useMemo(() => {
    const merged = new Set([...DEFAULT_CODES, ...Object.keys(currencyRatesMap || {})]);
    return Array.from(merged)
      .map((code) => normalizeCurrencyCode(code))
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b))
      .map((code) => ({ label: code, value: code }));
  }, [currencyRatesMap]);

  const openFilePicker = (provider = "mindee") => {
    providerRef.current = provider;
    setActiveProvider(provider);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  const toNumber = (value) => {
    if (value === null || value === undefined || value === "") return null;
    const parsed = Number(String(value).replace(/\s/g, "").replace(/,/g, "."));
    return Number.isFinite(parsed) ? parsed : null;
  };

  const resolveExchangeRate = (currencyCode) => {
    const code = normalizeCurrencyCode(currencyCode);
    if (code === "TND") return 1;
    return Number(currencyRatesMap?.[code] || 0);
  };

  const makeReference = (name, index) => {
    const base = String(name || "PRODUIT")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^A-Za-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .toUpperCase()
      .slice(0, 18) || "PRODUIT";

    const suffix = String(index + 1).padStart(3, "0");
    return `OCR-${base}-${suffix}`;
  };

  const splitSupplierName = (supplierName) => {
    const cleaned = String(supplierName || "").replace(/\s+/g, " ").trim();
    if (!cleaned) {
      return { firstName: "Fournisseur", lastName: "OCR" };
    }

    const parts = cleaned.split(" ");
    if (parts.length === 1) {
      return { firstName: parts[0], lastName: "OCR" };
    }

    return {
      firstName: parts.slice(0, -1).join(" "),
      lastName: parts.slice(-1).join(" "),
    };
  };

  const buildSupplierMatricule = (supplierName) => {
    const normalized = String(supplierName || "FOURNISSEUR")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^A-Za-z0-9]+/g, "")
      .toUpperCase()
      .slice(0, 10) || "FOURNISSEUR";

    return `OCR-${normalized}-${Date.now()}`;
  };

  const extractSupplierContactInfo = (rawText) => {
    const text = String(rawText || "");
    const emailMatch = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
    const phoneMatch = text.match(/(?:\+?216\s?)?(?:\d[\s.-]?){7,12}\d/);
    const vatMatch = text.match(/(?:MF|Matricule\s*Fiscal|MatriculeFiscale|TVA)\s*[:#-]?\s*([A-Z0-9\-\/.]{5,})/i);

    return {
      email: emailMatch?.[0] || "",
      phone: phoneMatch?.[0]?.replace(/\s+/g, " ").trim() || "",
      matriculeFiscale: vatMatch?.[1]?.trim() || "",
    };
  };

  const detectCountryFromText = (rawText) => {
    const text = String(rawText || "").toUpperCase();
    const countryPatterns = [
      { code: "TN", names: ["TUNISIE", "TUNISIA", "TUNIS"] },
      { code: "FR", names: ["FRANCE"] },
      { code: "IT", names: ["ITALIE", "ITALY"] },
      { code: "DE", names: ["ALLEMAGNE", "GERMANY"] },
      { code: "ES", names: ["ESPAGNE", "SPAIN"] },
      { code: "US", names: ["USA", "UNITED STATES", "ETATS-UNIS", "ETATS UNIS"] },
      { code: "GB", names: ["UNITED KINGDOM", "UK", "ROYAUME-UNI"] },
      { code: "MA", names: ["MAROC", "MOROCCO"] },
      { code: "DZ", names: ["ALGERIE", "ALGERIA"] },
      { code: "AE", names: ["EMIRATS", "UAE", "UNITED ARAB EMIRATES"] },
    ];

    for (const country of countryPatterns) {
      if (country.names.some((name) => text.includes(name))) {
        return country.code === "TN" ? "Tunisie" : country.code === "FR" ? "France" : country.code === "IT" ? "Italie" : country.code === "DE" ? "Allemagne" : country.code === "ES" ? "Espagne" : country.code === "US" ? "États-Unis" : country.code === "GB" ? "Royaume-Uni" : country.code === "MA" ? "Maroc" : country.code === "DZ" ? "Algérie" : country.code === "AE" ? "Émirats arabes unis" : country.code;
      }
    }

    return "Tunisie";
  };

  const extractSupplierAddress = (rawText, supplierName) => {
    const lines = String(rawText || "")
      .split(/\n+/)
      .map((line) => line.replace(/\s+/g, " ").trim())
      .filter(Boolean);

    const headerIndex = supplierName
      ? lines.findIndex((line) => line.toLowerCase().includes(String(supplierName).trim().toLowerCase()))
      : -1;

    const skipPatterns = /(@|https?:|www\.|\b(?:tel|t?el|phone|téléphone|telephone|fax|mf|matricule|tva|ice|rc|siret|email|e-mail|facture|invoice|client|fournisseur)\b)/i;
    const countryLine = /\b(tunisie|tunisia|france|italie|italy|algerie|algérie|algeria|maroc|morocco|espagne|spain|allemagne|germany|usa|états-unis|etats-unis|united states|u\.?k\.?|royaume-uni|united kingdom|uae|emirats|emirats arabes unis)\b/i;
    const postalLine = /\b\d{4,5}\b/;

    const candidateLines = headerIndex >= 0 ? lines.slice(headerIndex + 1, headerIndex + 6) : lines.slice(0, 6);
    const addressParts = [];

    for (const line of candidateLines) {
      if (skipPatterns.test(line)) continue;
      if (countryLine.test(line)) continue;

      const normalizedLine = line.replace(/\s*[,;]\s*/g, ", ").trim();
      if (!normalizedLine) continue;

      addressParts.push(normalizedLine);

      if (postalLine.test(normalizedLine) && addressParts.length >= 2) {
        break;
      }

      if (addressParts.length >= 3) {
        break;
      }
    }

    return addressParts.join(", ").trim();
  };

  const inferSupplierFromOcr = (ocrResult) => {
    const supplierName = String(ocrResult?.fournisseur || "").replace(/\s+/g, " ").trim();
    const contactInfo = extractSupplierContactInfo(ocrResult?.rawText || "");
    const nameParts = splitSupplierName(supplierName || "Fournisseur OCR");
    const address = extractSupplierAddress(ocrResult?.rawText || "", supplierName || "");
    const country = detectCountryFromText(ocrResult?.rawText || "");

    return {
      firstName: nameParts.firstName,
      lastName: nameParts.lastName,
      email: contactInfo.email,
      phone: contactInfo.phone,
      address,
      country,
      city: "",
      matriculeFiscale: contactInfo.matriculeFiscale || buildSupplierMatricule(supplierName || "Fournisseur OCR"),
      displayName: supplierName || "Fournisseur OCR",
    };
  };

  const extractProductLines = (rawText, invoiceTotals) => {
    const lines = String(rawText || "")
      .split(/\n+/)
      .map((line) => line.trim())
      .filter(Boolean);

    const blocked = /(total|ttc|ht|tva|facture|invoice|date|fournisseur|supplier|net a payer)/i;

    const parsed = [];

    for (const line of lines) {
      if (blocked.test(line)) continue;

      const match = line.match(/^(.*?)[\s|;]{1,}(\d+(?:[.,]\d+)?)\s+(\d+(?:[.,]\d+)?)\s+(\d+(?:[.,]\d+)?)$/i);
      if (!match) continue;

      const name = String(match[1] || "").replace(/\s{2,}/g, " ").trim();
      if (!name || name.length < 3) continue;

      const quantity = toNumber(match[2]) || 0;
      const unitCost = toNumber(match[3]) || 0;
      const lineTotal = toNumber(match[4]) || quantity * unitCost;

      if (quantity <= 0 || unitCost < 0) continue;

      parsed.push({ name, quantity, unitCost, lineTotal });
    }

    if (parsed.length) {
      return parsed;
    }

    const fallbackPrice = Number.isFinite(invoiceTotals?.montantHT)
      ? invoiceTotals.montantHT
      : Number.isFinite(invoiceTotals?.montantTTC)
        ? invoiceTotals.montantTTC
        : 0;

    if (fallbackPrice > 0) {
      return [
        {
          name: "Produit OCR facture",
          quantity: 1,
          unitCost: fallbackPrice,
          lineTotal: fallbackPrice,
        },
      ];
    }

    return [];
  };

  const buildUniquePurchaseNumber = async () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    const base = `ACH-${year}${month}${day}`;
    const achats = await getAchats();
    const existing = new Set((Array.isArray(achats) ? achats : (achats?.items || achats?.data || []))
      .map((item) => String(item?.purchaseNumber || "").trim())
      .filter(Boolean));

    if (!existing.has(base)) return base;

    let attempt = 1;
    while (existing.has(`${base}-${attempt}`)) {
      attempt += 1;
    }

    return `${base}-${attempt}`;
  };

  const autoCreatePurchase = async (ocrResult) => {
    const currencyCode = normalizeCurrencyCode(ocrResult.devise);
    const exchangeRateToTnd = resolveExchangeRate(currencyCode);
    if (exchangeRateToTnd <= 0) {
      throw new Error("Taux de change introuvable pour cette devise. Configurez-le depuis la page Taux de change.");
    }

    const supplierGuess = inferSupplierFromOcr(ocrResult);
    const detectedSupplier = String(supplierGuess.displayName || "").trim().toLowerCase();
    const matchedSupplier = detectedSupplier
      ? supplierOptions.find((item) => item.searchLabel.includes(detectedSupplier))
      : null;

    let supplierId = matchedSupplier?.value || "";
    let supplierCreated = false;

    if (!supplierId) {
      const createdSupplier = await createSupplier({
        firstName: supplierGuess.firstName,
        lastName: supplierGuess.lastName,
        matriculeFiscale: supplierGuess.matriculeFiscale,
        email: supplierGuess.email,
        phone: supplierGuess.phone,
        address: supplierGuess.address,
        country: supplierGuess.country,
        city: supplierGuess.city,
      });

      supplierId = String(createdSupplier?.id || createdSupplier?._id || "").trim();
      if (!supplierId) {
        throw new Error("Achat non créé: fournisseur détecté mais création fournisseur échouée.");
      }
      supplierCreated = true;
    }

    const extractedLines = (Array.isArray(ocrResult.lines) ? ocrResult.lines : [])
      .map((line) => normalizeOcrLineItem(line))
      .filter((line) => line.name && line.quantity > 0 && line.unitCost >= 0);

    const computedLines = extractedLines.length
      ? extractedLines
      : extractProductLines(ocrResult.rawText, {
        montantHT: ocrResult.montantHT,
        montantTTC: ocrResult.montantTTC,
      });

    if (!computedLines.length) {
      throw new Error("Achat non créé: aucun produit exploitable détecté.");
    }

    const existingProducts = await getProducts();
    const productsList = Array.isArray(existingProducts)
      ? existingProducts
      : (existingProducts?.items || existingProducts?.data || []);

    const byName = new Map(
      productsList
        .filter((product) => product?.name)
        .map((product) => [String(product.name).trim().toLowerCase(), product]),
    );

    const achatItems = [];

    for (let index = 0; index < computedLines.length; index += 1) {
      const line = computedLines[index];
      const normalizedName = String(line.name).trim().toLowerCase();
      let product = byName.get(normalizedName);

      if (!product) {
        const convertedUnitCost = Number((line.unitCost * exchangeRateToTnd).toFixed(3));
        const created = await createProduct({
          name: line.name,
          reference: makeReference(line.name, index),
          quantity: 0,
          prixHorsTva: convertedUnitCost,
          Tva: 0.19,
          prixTTC: Number((convertedUnitCost * 1.19).toFixed(2)),
          categorie: "OCR",
          description: "Produit créé automatiquement depuis extraction OCR facture fournisseur",
        });
        product = created;
        byName.set(normalizedName, created);
      }

      const productId = String(product?.id || product?._id || "").trim();
      if (!productId) continue;

      achatItems.push({
        productId,
        quantity: Number(line.quantity) || 1,
        unitCost: Number((Number(line.unitCost || 0) * exchangeRateToTnd).toFixed(3)),
      });
    }

    if (!achatItems.length) {
      throw new Error("Achat non créé: impossible de construire les lignes produits.");
    }

    const purchaseNumber = await buildUniquePurchaseNumber();

    const achatCreated = await createAchat({
      purchaseNumber,
      supplierId,
      status: "PENDING",
      date: ocrResult.dateFacture || undefined,
      ocrSource: [
        `OCR Source: ${ocrResult.source || "ocr"}`,
        `Devise: ${currencyCode}`,
        `Taux vers TND: ${exchangeRateToTnd}`,
        supplierGuess.displayName ? `Fournisseur OCR: ${supplierGuess.displayName}` : "",
        Number.isFinite(ocrResult.montantHT) ? `HT: ${ocrResult.montantHT}` : "",
        Number.isFinite(ocrResult.montantTVA) ? `TVA: ${ocrResult.montantTVA}` : "",
        Number.isFinite(ocrResult.montantTTC) ? `TTC: ${ocrResult.montantTTC}` : "",
      ].filter(Boolean).join(" | "),
      currencyCode,
      exchangeRateToTnd,
      originalCurrencyTotals: {
        totalHT: Number(ocrResult.montantHT) || 0,
        tvaAmount: Number(ocrResult.montantTVA) || 0,
        totalAmountTTC: Number(ocrResult.montantTTC) || 0,
      },
      items: achatItems,
    });

    const achatId = String(achatCreated?.id || achatCreated?._id || "").trim();
    if (!achatId) {
      throw new Error("Achat créé mais identifiant introuvable pour validation automatique.");
    }

      return { purchaseNumber, itemsCount: achatItems.length, supplierCreated };
  };

  const handleFormFieldChange = (field, value) => {
    setFormData((prev) => {
      if (field === "devise") {
        const normalizedCurrency = normalizeCurrencyCode(value);
        return {
          ...prev,
          devise: normalizedCurrency,
          tauxChange: resolveExchangeRate(normalizedCurrency),
        };
      }

      return { ...prev, [field]: value };
    });
  };

  const handleLineChange = (index, field, value) => {
    setLineItems((prev) => prev.map((line, i) => {
      if (i !== index) return line;

      const nextLine = { ...line, [field]: value };
      const quantity = toFiniteNumber(nextLine.quantity, 0);
      const unitCost = toFiniteNumber(nextLine.unitCost, 0);

      return {
        ...nextLine,
        quantity,
        unitCost,
        lineTotal: quantity > 0 && unitCost > 0 ? Number((quantity * unitCost).toFixed(2)) : 0,
      };
    }));
  };

  const addLine = () => {
    setLineItems((prev) => [...prev, { ...EMPTY_LINE }]);
  };

  const removeLine = (index) => {
    setLineItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFileChange = async (event) => {
    const file = event?.target?.files?.[0];
    if (!file) return;

    setLoading(true);
    setCreating(false);
    setError("");
    setSuccessMessage("");

    try {
      const data = await extractAchatInvoiceOcr(file, providerRef.current);
      const fields = data?.fields || {};
      const supplierName = String(fields?.fournisseur?.value || "").trim();
      const normalizedSupplier = supplierName.toLowerCase();
      const matchedSupplier = normalizedSupplier
        ? supplierOptions.find((item) => item.searchLabel.includes(normalizedSupplier))
        : null;

      const computedResult = {
        numeroFacture: String(fields?.numeroFacture?.value || "").trim(),
        dateFacture: String(fields?.dateFacture?.value || "").trim(),
        fournisseur: supplierName,
        devise: normalizeCurrencyCode(fields?.devise?.value || "TND"),
        tauxChange: resolveExchangeRate(normalizeCurrencyCode(fields?.devise?.value || "TND")),
        montantHT: Number.isFinite(fields?.montantHT?.value) ? fields.montantHT.value : null,
        montantTVA: Number.isFinite(fields?.montantTVA?.value) ? fields.montantTVA.value : null,
        montantTTC: Number.isFinite(fields?.montantTTC?.value) ? fields.montantTTC.value : null,
        source: String(data?.source || ""),
        provider: String(data?.provider || providerRef.current),
        rawText: String(data?.rawText || ""),
        supplierId: matchedSupplier?.value || "",
      };

      const normalizedSuggestedLines = (Array.isArray(data?.lines) ? data.lines : [])
        .map((line) => normalizeOcrLineItem(line))
        .filter((line) => line.name && line.quantity > 0 && line.unitCost >= 0);

      const suggestedLines = normalizedSuggestedLines.length
        ? normalizedSuggestedLines
        : extractProductLines(computedResult.rawText, {
          montantHT: computedResult.montantHT,
          montantTTC: computedResult.montantTTC,
        });

      setResult(computedResult);
      setFormData(computedResult);
      setLineItems(suggestedLines.length ? suggestedLines : [{ ...EMPTY_LINE }]);
      setSuccessMessage(`Extraction ${computedResult.provider || "ocr"} terminée. Corrigez les données puis cliquez sur Valider l'achat OCR.`);
    } catch (requestError) {
      setError(requestError?.response?.data?.message || requestError?.message || "Erreur extraction OCR");
      setResult(EMPTY_RESULT);
      setFormData(EMPTY_RESULT);
      setLineItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleValidatePurchase = async () => {
    setCreating(true);
    setError("");
    setSuccessMessage("");

    try {
      const payload = {
        ...formData,
        montantHT: toNumber(formData.montantHT),
        montantTVA: toNumber(formData.montantTVA),
        montantTTC: toNumber(formData.montantTTC),
        lines: lineItems,
      };

      const creation = await autoCreatePurchase(payload);
      setSuccessMessage(
        creation.supplierCreated
          ? `Fournisseur créé puis achat ${creation.purchaseNumber} validé automatiquement (${creation.itemsCount} ligne(s)).`
          : `Achat ${creation.purchaseNumber} validé automatiquement (${creation.itemsCount} ligne(s)).`,
      );

      navigate("/achats", {
        state: {
          successMessage: creation.supplierCreated
            ? `Nouveau fournisseur créé et achat ${creation.purchaseNumber} validé automatiquement par OCR.`
            : `Achat ${creation.purchaseNumber} validé automatiquement par OCR.`,
        },
      });
    } catch (requestError) {
      setError(requestError?.response?.data?.message || requestError?.message || "Erreur de validation OCR");
    } finally {
      setCreating(false);
    }
  };

  return (
    <DashboardTemplate>
      <div className="p-supplier-page">
        <div className="p-card p-detail-card">
          <h3 className="p-detail-card__title">Extraction OCR facture fournisseur</h3>
          <div className="p-detail-card__body">
            <div className="p-form-actions" style={{ marginBottom: 16 }}>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,image/*"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
              <Button
                customClassName="p-action-btn p-action-btn--warning"
                onClick={() => openFilePicker("mindee")}
                disabled={loading || creating}
              >
                <UploadOutlined />
                <span>{loading && activeProvider === "mindee" ? "Extraction Mindee..." : "Tester Mindee"}</span>
              </Button>

              <Button
                customClassName="p-action-btn p-action-btn--info"
                onClick={() => openFilePicker("textract")}
                disabled={loading || creating}
              >
                <UploadOutlined />
                <span>{loading && activeProvider === "textract" ? "Extraction Textract..." : "Tester Textract"}</span>
              </Button>

              <Button
                customClassName="p-action-btn p-action-btn--success"
                onClick={() => openFilePicker("openai")}
                disabled={loading || creating}
              >
                <UploadOutlined />
                <span>{loading && activeProvider === "openai" ? "Extraction OpenAI..." : "Tester OpenAI"}</span>
              </Button>
            </div>

            <div className="p-supplier-page__control" style={{ marginBottom: 12 }}>
              Méthode active: {formData.provider || activeProvider}
            </div>

            {successMessage ? <div className="p-product-page__state">{successMessage}</div> : null}

            {error ? <div className="p-product-page__state p-supplier-page__state--error">{error}</div> : null}

            <div className="p-product-page__filters-grid" style={{ marginBottom: 16 }}>
              <InputField
                id="ocr-numero-facture"
                label="Numero facture"
                value={formData.numeroFacture}
                onChange={(e) => handleFormFieldChange("numeroFacture", e.target.value)}
                placeholder="Ex: FAC-2026-001"
                customClassName="p-supplier-page__field"
                inputClassName="p-supplier-page__control"
                labelClassName="p-field__label"
              />

              <InputField
                id="ocr-date-facture"
                label="Date facture"
                value={formData.dateFacture}
                onChange={(e) => handleFormFieldChange("dateFacture", e.target.value)}
                placeholder="YYYY-MM-DD"
                customClassName="p-supplier-page__field"
                inputClassName="p-supplier-page__control"
                labelClassName="p-field__label"
              />

              <InputField
                id="ocr-fournisseur-detecte"
                label="Fournisseur détecté"
                value={formData.fournisseur}
                onChange={(e) => handleFormFieldChange("fournisseur", e.target.value)}
                placeholder="Nom fournisseur"
                customClassName="p-supplier-page__field"
                inputClassName="p-supplier-page__control"
                labelClassName="p-field__label"
              />

              <InputField
                id="ocr-montant-ht"
                label="Montant HT"
                value={formData.montantHT ?? ""}
                onChange={(e) => handleFormFieldChange("montantHT", e.target.value)}
                placeholder="0.00"
                customClassName="p-supplier-page__field"
                inputClassName="p-supplier-page__control"
                labelClassName="p-field__label"
              />

              <SelectField
                id="ocr-devise-facture"
                label="Devise facture"
                value={formData.devise ?? "TND"}
                options={currencyOptions}
                onChange={(value) => handleFormFieldChange("devise", normalizeCurrencyCode(value || "TND"))}
                containerClassName="p-supplier-page__field"
                selectClassName="p-supplier-page__control"
                defaultLabelClassName="p-field__label"
              />

              <InputField
                id="ocr-taux-change"
                label="Taux vers TND (parametres)"
                inputType="number"
                value={formData.tauxChange ?? ""}
                placeholder="Configure via page Taux de change"
                customClassName="p-supplier-page__field"
                inputClassName="p-supplier-page__control"
                labelClassName="p-field__label"
                inputProps={{ min: 0, step: 0.0001, disabled: true }}
              />

              <InputField
                id="ocr-montant-tva"
                label="TVA"
                value={formData.montantTVA ?? ""}
                onChange={(e) => handleFormFieldChange("montantTVA", e.target.value)}
                placeholder="0.00"
                customClassName="p-supplier-page__field"
                inputClassName="p-supplier-page__control"
                labelClassName="p-field__label"
              />

              <InputField
                id="ocr-montant-ttc"
                label="Montant TTC"
                value={formData.montantTTC ?? ""}
                onChange={(e) => handleFormFieldChange("montantTTC", e.target.value)}
                placeholder="0.00"
                customClassName="p-supplier-page__field"
                inputClassName="p-supplier-page__control"
                labelClassName="p-field__label"
              />
            </div>

            <div className="p-supplier-page__field" style={{ marginBottom: 16 }}>
              <div className="p-form-actions" style={{ justifyContent: "space-between" }}>
                <label className="p-field__label" style={{ margin: 0 }}>Lignes produits</label>
                <Button
                  customClassName="p-action-btn p-action-btn--info"
                  onClick={addLine}
                  disabled={loading || creating}
                >
                  <span>Ajouter ligne</span>
                </Button>
              </div>

              {lineItems.length ? lineItems.map((line, index) => (
                <div key={`ocr-line-${index}`} className="p-product-page__filters-grid" style={{ marginBottom: 10 }}>
                  <InputField
                    id={`ocr-line-name-${index}`}
                    label="Produit"
                    value={line.name}
                    onChange={(e) => handleLineChange(index, "name", e.target.value)}
                    placeholder="Nom produit"
                    customClassName="p-supplier-page__field"
                    inputClassName="p-supplier-page__control"
                    labelClassName="p-field__label"
                  />

                  <InputField
                    id={`ocr-line-quantity-${index}`}
                    label="Quantité"
                    inputType="number"
                    value={line.quantity}
                    onChange={(e) => handleLineChange(index, "quantity", e.target.value)}
                    customClassName="p-supplier-page__field"
                    inputClassName="p-supplier-page__control"
                    labelClassName="p-field__label"
                    inputProps={{ min: 0, step: 1 }}
                  />

                  <InputField
                    id={`ocr-line-unit-cost-${index}`}
                    label="Prix unitaire"
                    inputType="number"
                    value={line.unitCost}
                    onChange={(e) => handleLineChange(index, "unitCost", e.target.value)}
                    customClassName="p-supplier-page__field"
                    inputClassName="p-supplier-page__control"
                    labelClassName="p-field__label"
                    inputProps={{ min: 0, step: 0.01 }}
                  />

                  <InputField
                    id={`ocr-line-total-${index}`}
                    label="Montant ligne"
                    inputType="number"
                    value={line.lineTotal ?? 0}
                    readOnly
                    customClassName="p-supplier-page__field"
                    inputClassName="p-supplier-page__control"
                    labelClassName="p-field__label"
                    inputProps={{ min: 0, step: 0.01 }}
                  />

                  <div className="p-supplier-page__field" style={{ display: "flex", alignItems: "flex-end" }}>
                    <Button
                      customClassName="p-action-btn p-action-btn--warning"
                      onClick={() => removeLine(index)}
                      disabled={loading || creating}
                    >
                      <span>Supprimer</span>
                    </Button>
                  </div>
                </div>
              )) : <div className="p-supplier-page__control">Aucune ligne détectée</div>}
            </div>

            <div className="p-supplier-page__field">
              <label className="p-field__label">Texte OCR brut</label>
              <textarea
                className="p-supplier-page__control"
                rows={12}
                value={formData.rawText}
                onChange={(e) => handleFormFieldChange("rawText", e.target.value)}
                placeholder="Le texte OCR apparaitra ici..."
              />
            </div>

            <div className="p-form-actions" style={{ marginTop: 16 }}>
              <Button
                customClassName="p-action-btn p-action-btn--success"
                onClick={handleValidatePurchase}
                disabled={loading || creating || !formData.rawText}
              >
                <span>{creating ? "Validation en cours..." : "Valider l'achat OCR"}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardTemplate>
  );
}

export default PurchaseOcrPage;