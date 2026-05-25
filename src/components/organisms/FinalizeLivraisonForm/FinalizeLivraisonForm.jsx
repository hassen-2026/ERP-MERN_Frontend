import { useMemo } from "react";
import Button from "../../atoms/button/Button";
import SelectField from "../../molecules/SelectField/SelectField";
import "./FinalizeLivraisonForm.css";

function FinalizeLivraisonForm(props) {
  const {
    title = "Finaliser la livraison",
    error = "",
    transporterLabel = "Transporteur",
    transporterId = "",
    transporterOptions = [],
    onTransporterChange = () => {},
    onSubmit = () => {},
    submitLabel = "Affecter transporteur et livrer",
    loadingLabel = "Livraison...",
    isLoading = false,
    submitDisabled = false,
    idPrefix = "livraison-detail",
  } = props;

  const normalizedOptions = useMemo(
    () => transporterOptions.map((item) => ({ value: item.value ?? item.id, label: item.label })),
    [transporterOptions]
  );

  return (
    <section className="o-finalize-livraison-form p-card">
      <h4 className="o-finalize-livraison-form__title">{title}</h4>

      {error ? <div className="p-product-page__state p-supplier-page__state--error o-finalize-livraison-form__error">{error}</div> : null}

      <div className="o-finalize-livraison-form__fields">
        <SelectField
          id={`${idPrefix}-transporter`}
          label={transporterLabel}
          value={transporterId}
          placeholder="Sélectionner..."
          options={normalizedOptions}
          onChange={(value) => onTransporterChange(String(value || ""))}
          containerClassName="o-finalize-livraison-form__field"
          defaultLabelClassName="p-field__label"
          selectClassName="p-supplier-page__control"
        />
      </div>

      <div className="p-form-actions o-finalize-livraison-form__actions">
        <Button
          variant="primary"
          customClassName="p-action-btn p-action-btn--info"
          onClick={onSubmit}
          disabled={submitDisabled || isLoading}
        >
          {isLoading ? loadingLabel : submitLabel}
        </Button>
      </div>
    </section>
  );
}

export default FinalizeLivraisonForm;