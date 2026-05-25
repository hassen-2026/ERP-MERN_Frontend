import { useEffect, useState } from "react";
import { CloseOutlined, SaveOutlined } from "@ant-design/icons";
import Button from "../../atoms/button/Button";
import InputField from "../../molecules/InputField/InputField";
import SelectField from "../../molecules/SelectField/SelectField";
import { ENTITY_FORM_DEFAULTS } from "../defaults/addProduct_default";
import "./EntityForm.css";

/**
 * Composant formulaire générique et paramétrable
 * Peut être utilisé pour ajouter/éditer: produits, clients, fournisseurs, achats, ventes...
 * 
 * Configuration via ADD_PRODUCT_DEFAULTS ou props personnalisées
 */
function EntityForm(props) {
  const {
    formTitle,
    fields: fieldsConfig = {},
    fieldOrder = [],
    categoryOptions = [],
    actionLabels,
    initialValues,
    customClassName,
    stackClassName,
    saveButtonClassName,
    cancelButtonClassName,
    onSave,
    onCancel,
    saveLoading,
    saveError,
  } = { ...ENTITY_FORM_DEFAULTS, ...props };

  // Initialiser les valeurs du formulaire basé sur fieldsConfig
  const getInitialFormValues = () => {
    const values = {};
    Object.keys(fieldsConfig).forEach((fieldName) => {
      values[fieldName] = initialValues?.[fieldName] ?? fieldsConfig[fieldName].defaultValue ?? "";
    });
    return values;
  };

  const [formValues, setFormValues] = useState(getInitialFormValues());
  const [fieldErrors, setFieldErrors] = useState({});

  const normalizeNumber = (value, fallback = 0) => {
    if (value === null || value === undefined || value === "") {
      return fallback;
    }

    const numericValue = Number(value);
    return Number.isFinite(numericValue) ? numericValue : fallback;
  };

  const formatCurrency = (value) => Number(normalizeNumber(value, 0)).toLocaleString("fr-FR", {
    style: "currency",
    currency: "TND",
  });

  const resolveSelectedCategory = () => {
    const selectedCategoryValue = formValues?.category;

    return categoryOptions.find((option) => String(option?.value ?? option?.id ?? "") === String(selectedCategoryValue ?? "")) || null;
  };

  const resolveTvaRate = () => {
    const selectedCategory = resolveSelectedCategory();
    const candidateRate = selectedCategory?.tvaRate ?? selectedCategory?.taxRate ?? selectedCategory?.rate ?? 0;
    const numericRate = normalizeNumber(candidateRate, 0);

    return numericRate > 1 ? numericRate / 100 : numericRate;
  };

  const getDisplayValue = (fieldName) => {
    const tvaRate = resolveTvaRate();
    const purchasePriceHT = normalizeNumber(formValues?.buyPrice, 0);
    const salePriceHT = normalizeNumber(formValues?.sellPrice, 0);

    if (fieldName === "tvaRate") {
      return `${(tvaRate * 100).toFixed(2)}%`;
    }

    if (fieldName === "buyPriceTTC") {
      return formatCurrency(purchasePriceHT * (1 + tvaRate));
    }

    if (fieldName === "sellPriceTTC") {
      return formatCurrency(salePriceHT * (1 + tvaRate));
    }

    return formValues?.[fieldName];
  };

  useEffect(() => {
    setFormValues(getInitialFormValues());
    setFieldErrors({});
  }, [initialValues, fieldsConfig]);

  const handleChange = (fieldName) => (event) => {
    const value = event?.target?.value ?? event;

    // Gestion spéciale pour les fichiers
    if (event?.target?.type === "file") {
      const file = event?.target?.files?.[0] || null;
      setFormValues((prev) => ({ ...prev, [fieldName]: file }));
      return;
    }

    setFormValues((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleSave = () => {
    const nextErrors = {};

    Object.entries(fieldsConfig).forEach(([fieldName, fieldConfig]) => {
      if (!fieldConfig?.required) {
        return;
      }

      const currentValue = formValues?.[fieldName];
      const isEmpty = currentValue === null || currentValue === undefined || currentValue === "";

      if (isEmpty) {
        nextErrors[fieldName] = "Champ obligatoire.";
      }
    });

    setFieldErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    if (typeof onSave === "function") {
      onSave(formValues);
    }
  };

  /**
   * Render un champ basé sur sa configuration
   */
  const renderField = (fieldName) => {
    const fieldConfig = fieldsConfig[fieldName];
    if (!fieldConfig) return null;

    const fieldValue = fieldConfig.type === "display" ? getDisplayValue(fieldName) : formValues[fieldName];
    const fieldId = `field-${fieldName}`;

    // Champ display (lecture seule)
    if (fieldConfig.type === "display") {
      return (
        <div key={fieldName} className="p-field">
          <label className="p-field__label">
            {fieldConfig.label}
            {fieldConfig.required ? " *" : ""}
          </label>
          <div className="p-field__display-value">{fieldValue || fieldConfig.defaultValue || "-"}</div>
        </div>
      );
    }

    // Champ input
    if (fieldConfig.type === "input") {
      const isFileInput = fieldConfig.inputType === "file";

      return (
        <InputField
          key={fieldName}
          id={fieldId}
          label={fieldConfig.label}
          placeholder={fieldConfig.placeholder}
          inputType={fieldConfig.inputType || "text"}
          value={isFileInput ? undefined : fieldValue}
          defaultValue={isFileInput ? undefined : fieldConfig.defaultValue}
          required={fieldConfig.required}
          onChange={handleChange(fieldName)}
          customClassName="p-field"
          labelClassName="p-field__label"
          errorClassName="p-field__error"
          error={fieldErrors[fieldName] || ""}
        />
      );
    }

    // Champ select
    if (fieldConfig.type === "select") {
      return (
        <SelectField
          key={fieldName}
          id={fieldId}
          label={fieldConfig.label}
          placeholder={fieldConfig.placeholder}
          options={fieldConfig.options || []}
          value={fieldValue}
          required={fieldConfig.required}
          onChange={handleChange(fieldName)}
          containerClassName="p-field"
          defaultLabelClassName="p-field__label"
          errorClassName="p-field__error"
          error={fieldErrors[fieldName] || ""}
        />
      );
    }

    return null;
  };

  return (
    <section className={`p-form-card ${customClassName}`.trim()}>
      <h3 className="p-form-card__title">{formTitle}</h3>
      {saveError ? <div className="p-field__error p-form-card__error">{saveError}</div> : null}
      <div className={`p-page__stack ${stackClassName}`.trim()}>
        {/* Render les champs dans l'ordre défini */}
        {fieldOrder && fieldOrder.length > 0
          ? fieldOrder.map((fieldName) => renderField(fieldName))
          : Object.keys(fieldsConfig).map((fieldName) => renderField(fieldName))}

        <div className="p-form-actions p-form-actions--centered">
          <Button customClassName={saveButtonClassName} onClick={handleSave} disabled={saveLoading}>
            <SaveOutlined />
            <span>{actionLabels.save}</span>
          </Button>
          <Button customClassName={cancelButtonClassName} onClick={onCancel}>
            <CloseOutlined />
            <span>{actionLabels.cancel}</span>
          </Button>
        </div>
      </div>
    </section>
  );
}

export default EntityForm;
