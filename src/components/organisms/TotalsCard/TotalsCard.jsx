import { DeleteOutlined, FilePdfOutlined } from "@ant-design/icons";
import Button from "../../atoms/button/Button";
import "./TotalsCard.css";

/**
 * Organism: TotalsCard
 * Affiche les totaux avec actions (export PDF, suppression)
 * Réutilisable pour BonCommande, Commande, Facture, Livraison, etc.
 */
function TotalsCard({
  totalAmount = 0,
  totalHT = null,
  tvaAmount = null,
  totalTTC = null,
  currency = "DT",
  onExportPdf = () => {},
  onDelete = () => {},
  exportLoading = false,
  deleteLoading = false,
  cardClassName = "",
  titleClassName = "",
  amountClassName = "",
  actionsClassName = "",
  actionButtonClassName = "",
}) {
  const showBreakdown =
    Number.isFinite(Number(totalHT))
    && Number.isFinite(Number(tvaAmount))
    && Number.isFinite(Number(totalTTC));

  const formatMoney = (value) => Number(value || 0).toLocaleString("fr-FR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

  return (
    <article className={`p-totaux-card ${cardClassName}`.trim()}>
      <div className="p-totaux-card__header">
        <span className="p-totaux-card__icon">💰</span>
        <h3 className={`p-totaux-card__title ${titleClassName}`.trim()}>Totaux</h3>
      </div>

      <div className="p-totaux-card__body">
        <div className="p-totaux-card__amount-section">
          {showBreakdown ? (
            <div className="p-totaux-card__breakdown">
              <div className="p-totaux-card__breakdown-row">
                <label className="p-totaux-card__label">Montant HT:</label>
                <div className={`p-totaux-card__amount ${amountClassName}`.trim()}>
                  {formatMoney(totalHT)} <span className="p-totaux-card__currency">{currency}</span>
                </div>
              </div>
              <div className="p-totaux-card__breakdown-row">
                <label className="p-totaux-card__label">TVA:</label>
                <div className={`p-totaux-card__amount ${amountClassName}`.trim()}>
                  {formatMoney(tvaAmount)} <span className="p-totaux-card__currency">{currency}</span>
                </div>
              </div>
              <div className="p-totaux-card__breakdown-row p-totaux-card__breakdown-row--total">
                <label className="p-totaux-card__label">Total TTC:</label>
                <div className={`p-totaux-card__amount ${amountClassName}`.trim()}>
                  {formatMoney(totalTTC)} <span className="p-totaux-card__currency">{currency}</span>
                </div>
              </div>
            </div>
          ) : (
            <>
              <label className="p-totaux-card__label">Montant Total:</label>
              <div className={`p-totaux-card__amount ${amountClassName}`.trim()}>
                {formatMoney(totalAmount)} <span className="p-totaux-card__currency">{currency}</span>
              </div>
            </>
          )}
        </div>

        <div className={`p-totaux-card__actions ${actionsClassName}`.trim()}>
          <Button
            customClassName={`p-totaux-card__action-btn p-totaux-card__action-btn--export ${actionButtonClassName}`.trim()}
            onClick={onExportPdf}
            disabled={exportLoading}
          >
            <FilePdfOutlined />
            <span>Exporter PDF</span>
          </Button>
          <Button
            customClassName={`p-totaux-card__action-btn p-totaux-card__action-btn--delete ${actionButtonClassName}`.trim()}
            onClick={onDelete}
            disabled={deleteLoading}
          >
            <DeleteOutlined />
            <span>Supprimer</span>
          </Button>
        </div>
      </div>
    </article>
  );
}

export default TotalsCard;
