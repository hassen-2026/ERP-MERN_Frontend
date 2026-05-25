import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { UploadOutlined } from "@ant-design/icons";

import DashboardTemplate from "../../../../templates/TemplateAdmin/TemplateAdmin";
import Button from "../../../../components/atoms/button/Button";
import { extractFactureInvoiceOcr, createFacture } from "../../../../services/factureApi";
import { fetchClients } from "../../../../redux/reducers/ClientReducer";
import "../../Supplier_Pages/SupplierDetailPage/SupplierDetailPage.css";

const EMPTY_RESULT = {
  invoiceNumber: "",
  invoiceDate: "",
  clientName: "",
  totalHt: null,
  totalTax: null,
  totalTtc: null,
  source: "",
  provider: "",
  rawText: "",
  clientId: "",
};

const EMPTY_LINE = {
  description: "",
  quantity: 1,
  unitPrice: 0,
};

function FactureOcrPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const providerRef = useRef("mindee");
  const clientsState = useSelector((state) => state.clients || {});

  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [result, setResult] = useState(EMPTY_RESULT);
  const [formData, setFormData] = useState(EMPTY_RESULT);
  const [lineItems, setLineItems] = useState([]);
  const [activeProvider, setActiveProvider] = useState("mindee");

  useEffect(() => {
    if (!clientsState.items.length && !clientsState.loading) {
      dispatch(fetchClients());
    }
  }, [dispatch, clientsState.items.length, clientsState.loading]);

  const clientOptions = useMemo(
    () =>
      (clientsState.items || []).map((client) => ({
        value: client.id,
        label: client.nom || client.fullName,
        searchLabel: `${client.nom || client.fullName} ${client.email || ""}`.toLowerCase(),
      })),
    [clientsState.items],
  );

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

  const handleFormFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLineChange = (index, field, value) => {
    setLineItems((prev) => prev.map((line, i) => (i === index ? { ...line, [field]: value } : line)));
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
      const data = await extractFactureInvoiceOcr(file, providerRef.current);
      const fields = data?.fields || {};
      const clientName = String(fields?.clientName?.value || fields?.supplierName?.value || "").trim();
      const normalizedClient = clientName.toLowerCase();
      const matchedClient = normalizedClient
        ? clientOptions.find((item) => item.searchLabel.includes(normalizedClient))
        : null;

      const computedResult = {
        invoiceNumber: String(fields?.invoiceNumber?.value || "").trim(),
        invoiceDate: String(fields?.invoiceDate?.value || "").trim(),
        clientName: clientName,
        totalHt: Number.isFinite(fields?.totalHt?.value) ? fields.totalHt.value : null,
        totalTax: Number.isFinite(fields?.totalTax?.value) ? fields.totalTax.value : null,
        totalTtc: Number.isFinite(fields?.totalTtc?.value) ? fields.totalTtc.value : null,
        source: String(data?.source || ""),
        provider: String(data?.provider || providerRef.current),
        rawText: String(data?.rawText || ""),
        clientId: matchedClient?.value || "",
      };

      const suggestedLines = Array.isArray(data?.items) && data.items.length
        ? data.items.map((item) => ({
          description: item.description || "",
          quantity: Number(item.quantity) || 1,
          unitPrice: Number(item.unitPrice) || 0,
        }))
        : [{ ...EMPTY_LINE }];

      setResult(computedResult);
      setFormData(computedResult);
      setLineItems(suggestedLines);
      setSuccessMessage(`Extraction ${computedResult.provider || "ocr"} terminée. Corrigez les données puis cliquez sur Valider la facture OCR.`);
    } catch (requestError) {
      setError(requestError?.response?.data?.message || requestError?.message || "Erreur extraction OCR");
      setResult(EMPTY_RESULT);
      setFormData(EMPTY_RESULT);
      setLineItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleValidateFacture = async () => {
    setCreating(true);
    setError("");
    setSuccessMessage("");

    try {
      if (!formData.clientId) {
        throw new Error("Veuillez sélectionner un client");
      }

      if (!formData.invoiceNumber) {
        throw new Error("Le numéro de facture est requis");
      }

      const payload = {
        invoiceNumber: formData.invoiceNumber,
        date: formData.invoiceDate || new Date().toISOString().split("T")[0],
        clientId: formData.clientId,
        totalAmountTTC: toNumber(formData.totalTtc) || 0,
        paymentStatus: "UNPAID",
        file: `OCR-${providerRef.current}-${Date.now()}`,
        items: lineItems
          .filter((line) => line.description && Number(line.quantity) > 0)
          .map((line) => ({
            productName: line.description,
            quantity: Number(line.quantity),
            unitPrice: Number(line.unitPrice) || 0,
            lineTotal: (Number(line.quantity) || 1) * (Number(line.unitPrice) || 0),
          })),
      };

      await createFacture(payload);

      setSuccessMessage(`Facture ${formData.invoiceNumber} créée avec succès.`);

      navigate("/factures", {
        state: {
          successMessage: `Facture ${formData.invoiceNumber} créée automatiquement par OCR.`,
        },
      });
    } catch (requestError) {
      setError(requestError?.response?.data?.message || requestError?.message || "Erreur de création facture");
    } finally {
      setCreating(false);
    }
  };

  return (
    <DashboardTemplate>
      <div className="p-supplier-page">
        <div className="p-card p-detail-card">
          <h3 className="p-detail-card__title">Extraction OCR facture client</h3>
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
                customClassName="p-action-btn p-action-btn--info"
                onClick={() => openFilePicker("mindee")}
                disabled={loading || creating}
              >
                <UploadOutlined />
                <span>{loading && activeProvider === "mindee" ? "Extraction Mindee..." : "Tester Mindee"}</span>
              </Button>

              <Button
                customClassName="p-action-btn p-action-btn--warning"
                onClick={() => openFilePicker("tesseract")}
                disabled={loading || creating}
              >
                <UploadOutlined />
                <span>{loading && activeProvider === "tesseract" ? "Extraction Tesseract..." : "Tester Tesseract"}</span>
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
              <div className="p-supplier-page__field">
                <label className="p-field__label">Numero facture</label>
                <input
                  className="p-supplier-page__control"
                  value={formData.invoiceNumber}
                  onChange={(e) => handleFormFieldChange("invoiceNumber", e.target.value)}
                  placeholder="Ex: FAC-2026-001"
                />
              </div>

              <div className="p-supplier-page__field">
                <label className="p-field__label">Date facture</label>
                <input
                  className="p-supplier-page__control"
                  type="date"
                  value={formData.invoiceDate}
                  onChange={(e) => handleFormFieldChange("invoiceDate", e.target.value)}
                />
              </div>

              <div className="p-supplier-page__field">
                <label className="p-field__label">Client détecté</label>
                <select
                  className="p-supplier-page__control"
                  value={formData.clientId}
                  onChange={(e) => handleFormFieldChange("clientId", e.target.value)}
                >
                  <option value="">-- Sélectionner un client --</option>
                  {clientOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-supplier-page__field">
                <label className="p-field__label">Montant HT</label>
                <input
                  className="p-supplier-page__control"
                  value={formData.totalHt ?? ""}
                  onChange={(e) => handleFormFieldChange("totalHt", e.target.value)}
                  placeholder="0.00"
                />
              </div>

              <div className="p-supplier-page__field">
                <label className="p-field__label">TVA</label>
                <input
                  className="p-supplier-page__control"
                  value={formData.totalTax ?? ""}
                  onChange={(e) => handleFormFieldChange("totalTax", e.target.value)}
                  placeholder="0.00"
                />
              </div>

              <div className="p-supplier-page__field">
                <label className="p-field__label">Montant TTC</label>
                <input
                  className="p-supplier-page__control"
                  value={formData.totalTtc ?? ""}
                  onChange={(e) => handleFormFieldChange("totalTtc", e.target.value)}
                  placeholder="0.00"
                />
              </div>
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
                  <div className="p-supplier-page__field">
                    <label className="p-field__label">Description</label>
                    <input
                      className="p-supplier-page__control"
                      value={line.description}
                      onChange={(e) => handleLineChange(index, "description", e.target.value)}
                      placeholder="Description produit/service"
                    />
                  </div>

                  <div className="p-supplier-page__field">
                    <label className="p-field__label">Quantité</label>
                    <input
                      className="p-supplier-page__control"
                      type="number"
                      min="0"
                      step="1"
                      value={line.quantity}
                      onChange={(e) => handleLineChange(index, "quantity", e.target.value)}
                    />
                  </div>

                  <div className="p-supplier-page__field">
                    <label className="p-field__label">Prix unitaire</label>
                    <input
                      className="p-supplier-page__control"
                      type="number"
                      min="0"
                      step="0.01"
                      value={line.unitPrice}
                      onChange={(e) => handleLineChange(index, "unitPrice", e.target.value)}
                    />
                  </div>

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
                onClick={handleValidateFacture}
                disabled={loading || creating || !formData.rawText}
              >
                <span>{creating ? "Création en cours..." : "Valider la facture OCR"}</span>
              </Button>

              <Button
                customClassName="p-action-btn p-action-btn--info"
                onClick={() => navigate("/factures")}
                disabled={loading || creating}
              >
                <span>Annuler</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardTemplate>
  );
}

export default FactureOcrPage;
