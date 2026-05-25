import { useMemo } from "react";
import Button from "../../atoms/button/Button";
import Input from "../../atoms/input/Input";
import Select from "../../atoms/select/Select";
import SelectableLinesTable from "../../molecules/SelectableLinesTable/SelectableLinesTable";
import "./LineSelectionForm.css";

function LineSelectionForm({
  title = "Formulaire de sélection",
  selectLabel = "Sélectionner",
  selectOptions = [],
  selectedId = "",
  onSelectChange = () => {},
  date = "",
  onDateChange = () => {},
  note = "",
  onNoteChange = () => {},
  lines = [],
  columns = [],
  selectedLineIds = [],
  onToggleLine = () => {},
  onSubmit = () => {},
  isLoading = false,
  error = "",
  emptyMessage = "Aucune ligne disponible.",
  linesTitle = "Lignes en attente",
  submitLabel = "Soumettre",
  submitDisabled = false,
  cancelLabel = "Annuler",
  onCancel = () => {},
  extraFilters = null,
  containerClassName = "p-supplier-page",
  cardClassName = "p-card p-detail-card",
}) {
  const selectOptionsFormatted = useMemo(
    () => selectOptions.map((item) => ({ value: item.id, label: item.label })),
    [selectOptions]
  );

  return (
    <div className={containerClassName}>
      <div className={cardClassName}>
        <h3 className="p-detail-card__title">{title}</h3>
        <div className="p-detail-card__body">
          {error ? <div className="p-product-page__state p-supplier-page__state--error">{error}</div> : null}

          <div className="p-product-page__filters-grid" style={{ marginBottom: 16 }}>
            <div className="p-supplier-page__field">
              <label className="p-field__label">{selectLabel}</label>
              <Select
                customClassName="p-supplier-page__control"
                value={selectedId || undefined}
                options={selectOptionsFormatted}
                placeholder="Sélectionner..."
                onChange={(value) => onSelectChange(String(value || ""))}
              />
            </div>

            <div className="p-supplier-page__field">
              <label className="p-field__label">Date</label>
              <Input
                type="date"
                customClassName="p-supplier-page__control"
                value={date}
                onChange={(e) => onDateChange(e.target.value)}
              />
            </div>

            <div className="p-supplier-page__field">
              <label className="p-field__label">Note</label>
              <Input
                type="text"
                customClassName="p-supplier-page__control"
                value={note}
                onChange={(e) => onNoteChange(e.target.value)}
                placeholder="Note interne"
              />
            </div>

            {extraFilters}
          </div>

          <SelectableLinesTable
            title={linesTitle}
            rows={lines}
            columns={columns}
            selectedLineIds={selectedLineIds}
            onToggleLine={onToggleLine}
            emptyMessage={emptyMessage}
            error={error}
            sectionClassName="p-card"
            tableClassName="p-table"
            stateRowClassName="p-data-table__state"
            errorRowClassName="p-data-table__state--error"
          />

          <div className="p-form-actions" style={{ marginTop: 16 }}>
            <Button
              variant="primary"
              customClassName="p-action-btn p-action-btn--info"
              onClick={onSubmit}
              disabled={submitDisabled || isLoading}
            >
              {isLoading ? "Traitement..." : submitLabel}
            </Button>
            <Button
              variant="danger"
              customClassName="p-action-btn p-action-btn--danger"
              onClick={onCancel}
            >
              {cancelLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LineSelectionForm;
