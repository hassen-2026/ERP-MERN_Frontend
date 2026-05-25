import React, { useState } from "react";
import Button from "../../atoms/button/Button";
import Input from "../../atoms/input/Input";
import Select from "../../atoms/select/Select";
import { PlusOutlined, DeleteOutlined, SaveOutlined, CloseOutlined } from "@ant-design/icons";
import "./DocumentLines.css";

function DocumentLines({
  items = [],
  productsOptions = [],
  totals = null,
  onChangeItem = () => {},
  onAddRow = () => {},
  onRemoveRow = () => {},
  linePriceFieldName = "unitPrice",
  linePriceHeaderLabel = "Prix",
  productColumnLabel = "Produit",
  quantityColumnLabel = "Quantite",
  totalColumnLabel = "Sous-total",
  addLineLabel = "Ajouter ligne",
  title = "Lignes",
  onSave,
  onCancel,
  saveLoading,
  submitLabel = "Enregistrer",
  cancelLabel = "Annuler",
  currencyCode = "TND",
}) {
  const formatMoney = (value) => {
    const amount = Number(value) || 0;
    const resolvedCurrency = String(currencyCode || "TND").toUpperCase();

    try {
      return new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: resolvedCurrency,
        minimumFractionDigits: 3,
        maximumFractionDigits: 3,
      }).format(amount);
    } catch (error) {
      return `${amount.toFixed(3)} ${resolvedCurrency}`;
    }
  };

  const totalAmount = items.reduce((sum, item) => sum + (Number(item.quantity) || 0) * (Number(item[linePriceFieldName]) || 0), 0);
  const [autoFilledIndex, setAutoFilledIndex] = useState(null);
  const showTotalsBreakdown =
    totals
    && Number.isFinite(Number(totals.totalHT))
    && Number.isFinite(Number(totals.tvaAmount))
    && Number.isFinite(Number(totals.totalTTC));

  return (
    <div className="p-document-lines">
      <div className="p-document-lines__head">
        <h4>{title}</h4>
        <Button variant="secondary" customClassName="p-document-lines__add" onClick={onAddRow}><PlusOutlined /><span>{addLineLabel}</span></Button>
      </div>

      <div className="p-document-lines__table-head">
        <span>{productColumnLabel}</span>
        <span>{quantityColumnLabel}</span>
        <span>{linePriceHeaderLabel}</span>
        <span>{totalColumnLabel}</span>
        <span />
      </div>

      <div className="p-document-lines__rows">
        {items.map((item, index) => (
          <div className="p-document-lines__row" key={`line-${index}`}>
            {
              // show only product name in the select label (remove reference)
            }
            <Select
              value={item.productId}
              options={(productsOptions || []).map((o) => ({ ...o, label: String(o.label || "").split(" (")[0] }))}
              onChange={(v) => {
                // set productId
                onChangeItem(index, "productId", v);
                // find product option and set the line price (unitCost/unitPrice)
                const opt = (productsOptions || []).find((o) => String(o.value) === String(v));
                const price = opt ? (opt.price ?? opt.sellPriceValue ?? opt.buyPriceValue ?? 0) : 0;
                onChangeItem(index, linePriceFieldName, String(Number(price) || 0));
                // highlight the price input briefly so user notices the auto-fill
                setAutoFilledIndex(index);
                setTimeout(() => setAutoFilledIndex((cur) => (cur === index ? null : cur)), 1200);
              }}
              customClassName="p-document-lines__control"
            />
            <Input type="number" value={item.quantity} onChange={(e) => onChangeItem(index, "quantity", e.target.value)} customClassName="p-document-lines__control" />
            <Input
              type="number"
              value={item[linePriceFieldName]}
              onChange={(e) => onChangeItem(index, linePriceFieldName, e.target.value)}
              customClassName={`p-document-lines__control ${autoFilledIndex === index ? "p-document-lines__control--auto" : ""}`}
            />
            <div className="p-document-lines__line-total">{formatMoney((Number(item.quantity) || 0) * (Number(item[linePriceFieldName]) || 0))}</div>
            <Button variant="danger" customClassName="p-document-lines__remove" onClick={() => onRemoveRow(index)}><DeleteOutlined /></Button>
          </div>
        ))}
      </div>

      <div className="p-document-lines__summary">
        {showTotalsBreakdown ? (
          <div className="p-document-lines__totals">
            <div className="p-document-lines__totals-row">
              <span>Montant HT</span>
              <strong>{formatMoney(totals.totalHT || 0)}</strong>
            </div>
            <div className="p-document-lines__totals-row">
              <span>TVA</span>
              <strong>{formatMoney(totals.tvaAmount || 0)}</strong>
            </div>
            <div className="p-document-lines__totals-row p-document-lines__totals-row--total">
              <span>Total TTC</span>
              <strong>{formatMoney(totals.totalTTC || 0)}</strong>
            </div>
          </div>
        ) : (
          <strong>Total: {formatMoney(totalAmount)}</strong>
        )}
        <div className="p-document-lines__actions">
          {typeof onSave === "function" ? (
            <Button variant="primary" customClassName="p-document-lines__save" onClick={onSave} disabled={saveLoading}><SaveOutlined /><span>{submitLabel}</span></Button>
          ) : null}
          {typeof onCancel === "function" ? (
            <Button variant="secondary" customClassName="p-document-lines__cancel" onClick={onCancel}><CloseOutlined /><span>{cancelLabel}</span></Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default DocumentLines;
