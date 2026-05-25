import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import { fetchLivraisons } from "../../../redux/reducers/LivraisonsReducer";
import "./DocumentTemplates.css";

function DeliveryNoteTemplatePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const livraisonsState = useSelector((state) => state.livraisons || {});

  useEffect(() => {
    if (!livraisonsState.items.length && !livraisonsState.loading) {
      dispatch(fetchLivraisons());
    }
  }, [dispatch, livraisonsState.items.length, livraisonsState.loading]);

  const livraison = useMemo(
    () => livraisonsState.items.find((item) => String(item.id) === String(id)) || null,
    [livraisonsState.items, id],
  );

  const totalAmount = useMemo(
    () => (Array.isArray(livraison?.commandeItems)
      ? livraison.commandeItems.reduce((sum, item) => sum + Number(item.lineTotal || 0), 0)
      : 0),
    [livraison?.commandeItems],
  );

  return (
    <div className="p-doc-page">
      <div className="p-doc-page__toolbar">
        <div className="p-doc-page__toolbar-left">
          <button className="p-doc-btn" type="button" onClick={() => navigate(-1)}>
            Retour
          </button>
          <span className="p-doc-page__badge">Bon de livraison</span>
        </div>
        <div className="p-doc-page__actions">
          <button className="p-doc-btn p-doc-btn--primary" type="button" onClick={() => window.print()}>
            Imprimer / PDF
          </button>
        </div>
      </div>

      {!livraisonsState.loading && !livraison ? (
        <div className="p-doc-state">Livraison introuvable.</div>
      ) : (
        <article className="p-doc-paper">
          <header className="p-doc-paper__head">
            <div>
              <h1 className="p-doc-paper__title">Bon de Livraison</h1>
              <p className="p-doc-paper__subtitle">Document de suivi de remise des articles commandes.</p>
            </div>
            <div className="p-doc-paper__meta">
              <div className="p-doc-kv">
                <span className="p-doc-kv__label">Numero</span>
                <span className="p-doc-kv__value">{livraison?.deliveryNumber || "-"}</span>
              </div>
              <div className="p-doc-kv">
                <span className="p-doc-kv__label">Date</span>
                <span className="p-doc-kv__value">{livraison?.date || "-"}</span>
              </div>
              <div className="p-doc-kv">
                <span className="p-doc-kv__label">Statut</span>
                <span className="p-doc-kv__value">{livraison?.statusLabel || "-"}</span>
              </div>
              <div className="p-doc-kv">
                <span className="p-doc-kv__label">Bon de commande</span>
                <span className="p-doc-kv__value">{livraison?.bonCommandeNumber || "-"}</span>
              </div>
            </div>
          </header>

          <section className="p-doc-paper__body">
            <div className="p-doc-section">
              <h2 className="p-doc-section__title">Transport</h2>
              <div className="p-doc-grid-2">
                <div className="p-doc-card">
                  <p className="p-doc-card__line"><strong>Transporteur:</strong> {livraison?.transporterName || "-"}</p>
                  <p className="p-doc-card__line"><strong>Plaque:</strong> {livraison?.transporterPlate || "-"}</p>
                </div>
                <div className="p-doc-card">
                  <p className="p-doc-card__line"><strong>Commandes:</strong> {livraison?.commandeCount ?? 0}</p>
                  <p className="p-doc-card__line"><strong>Items:</strong> {livraison?.itemCount ?? 0}</p>
                  <p className="p-doc-card__line"><strong>Somme totale:</strong> {totalAmount.toLocaleString("fr-TN", { style: "currency", currency: "TND" })}</p>
                </div>
              </div>
            </div>

            <div className="p-doc-section">
              <h2 className="p-doc-section__title">Details des articles livres</h2>
              {Array.isArray(livraison?.commandeItems) && livraison.commandeItems.length ? (
                <table className="p-doc-table">
                  <thead>
                    <tr>
                      <th>Produit</th>
                      <th>Reference</th>
                      <th>Qte Bon</th>
                      <th>Qte Livree</th>
                      <th>Prix U.</th>
                      <th className="p-doc-table__right">Total ligne</th>
                    </tr>
                  </thead>
                  <tbody>
                    {livraison.commandeItems.map((item) => (
                      <tr key={item.id}>
                        <td>{item.productName || "-"}</td>
                        <td>{item.productReference || "-"}</td>
                        <td>{item.requestedQuantity ?? item.quantity ?? 0}</td>
                        <td>{item.deliveredQuantity ?? item.quantity ?? 0}</td>
                        <td>{Number(item.unitPrice || 0).toLocaleString("fr-TN", { style: "currency", currency: "TND" })}</td>
                        <td className="p-doc-table__right">{Number(item.lineTotal || 0).toLocaleString("fr-TN", { style: "currency", currency: "TND" })}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={5} className="p-doc-table__right p-doc-total">Total général</td>
                      <td className="p-doc-table__right p-doc-total">{totalAmount.toLocaleString("fr-TN", { style: "currency", currency: "TND" })}</td>
                    </tr>
                  </tfoot>
                </table>
              ) : (
                <p className="p-doc-empty">Aucun article associe a cette livraison.</p>
              )}
            </div>

            {livraison?.note ? (
              <div className="p-doc-section">
                <h2 className="p-doc-section__title">Note</h2>
                <p className="p-doc-note">{livraison.note}</p>
              </div>
            ) : null}

            <div className="p-doc-section p-doc-signatures">
              <h2 className="p-doc-section__title">Signatures</h2>
              <div className="p-doc-signatures__grid">
                <div className="p-doc-signature-card">
                  <p className="p-doc-signature-card__title">Signature client</p>
                  <p className="p-doc-signature-card__hint">Nom, cachet et signature</p>
                  <div className="p-doc-signature-line" />
                </div>
                <div className="p-doc-signature-card">
                  <p className="p-doc-signature-card__title">Signature transporteur</p>
                  <p className="p-doc-signature-card__hint">Nom et signature</p>
                  <div className="p-doc-signature-line" />
                </div>
              </div>
            </div>
          </section>
        </article>
      )}
    </div>
  );
}

export default DeliveryNoteTemplatePage;