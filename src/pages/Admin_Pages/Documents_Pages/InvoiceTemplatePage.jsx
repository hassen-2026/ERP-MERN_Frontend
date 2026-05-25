import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import { fetchCommandes } from "../../../redux/reducers/CommandeReducer";
import { fetchFactureById } from "../../../redux/reducers/FactureReducer";
import "./DocumentTemplates.css";

function InvoiceTemplatePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const commandesState = useSelector((state) => state.commandes || {});
  const factureState = useSelector((state) => state.facture || {});

  useEffect(() => {
    if (!commandesState.items.length && !commandesState.loading) {
      dispatch(fetchCommandes());
    }
  }, [commandesState.items.length, commandesState.loading, dispatch]);

  const commande = useMemo(
    () => commandesState.items.find((item) => String(item.id) === String(id)) || null,
    [commandesState.items, id],
  );

  useEffect(() => {
    const factureId = commande?.factureId;
    if (!factureId || factureState.currentLoading) return;
    if (String(factureState.current?.id || "") === String(factureId)) return;
    dispatch(fetchFactureById(factureId));
  }, [commande?.factureId, dispatch, factureState.current?.id, factureState.currentLoading]);

  const facture = useMemo(() => {
    if (!commande?.factureId) return null;
    if (String(factureState.current?.id || "") !== String(commande.factureId)) return null;
    return factureState.current;
  }, [commande?.factureId, factureState.current]);

  const subTotal = Number(facture?.subTotal || 0);
  const tvaAmount = Number(facture?.tvaAmount || 0);
  const totalTtc = Number(facture?.totalAmountTTC || subTotal + tvaAmount);

  return (
    <div className="p-doc-page">
      <div className="p-doc-page__toolbar">
        <div className="p-doc-page__toolbar-left">
          <button className="p-doc-btn" type="button" onClick={() => navigate(-1)}>
            Retour
          </button>
          <span className="p-doc-page__badge">Facture</span>
        </div>
        <div className="p-doc-page__actions">
          <button className="p-doc-btn p-doc-btn--primary" type="button" onClick={() => window.print()}>
            Imprimer / PDF
          </button>
        </div>
      </div>

      {!commandesState.loading && !commande ? (
        <div className="p-doc-state">Commande introuvable.</div>
      ) : commande && !commande.factureId ? (
        <div className="p-doc-state">Aucune facture n'est liée à cette commande.</div>
      ) : factureState.currentError ? (
        <div className="p-doc-state">{factureState.currentError}</div>
      ) : factureState.currentLoading || !facture ? (
        <div className="p-doc-state">Chargement de la facture...</div>
      ) : (
        <article className="p-doc-paper">
          <header className="p-doc-paper__head">
            <div>
              <h1 className="p-doc-paper__title">Facture</h1>
              <p className="p-doc-paper__subtitle">Document de facturation client.</p>
            </div>
            <div className="p-doc-paper__meta">
              <div className="p-doc-kv">
                <span className="p-doc-kv__label">Numero facture</span>
                <span className="p-doc-kv__value">{facture.invoiceNumber || "PROVISOIRE"}</span>
              </div>
              <div className="p-doc-kv">
                <span className="p-doc-kv__label">Commande</span>
                <span className="p-doc-kv__value">{facture.commandeNumber || commande?.commandeNumber || "-"}</span>
              </div>
              <div className="p-doc-kv">
                <span className="p-doc-kv__label">Date</span>
                <span className="p-doc-kv__value">{facture.date || "-"}</span>
              </div>
            </div>
          </header>

          <section className="p-doc-paper__body">
            <div className="p-doc-section">
              <h2 className="p-doc-section__title">Client et gestion</h2>
              <div className="p-doc-grid-2">
                <div className="p-doc-card">
                  <p className="p-doc-card__line"><strong>Client:</strong> {facture.clientName || "-"}</p>
                  <p className="p-doc-card__line"><strong>Statut facture:</strong> {facture.paymentStatusLabel || "-"}</p>
                </div>
                <div className="p-doc-card">
                  <p className="p-doc-card__line"><strong>Geree par:</strong> {facture.createdByName || "-"}</p>
                  <p className="p-doc-card__line"><strong>Transporteur:</strong> {facture.transporterName || "-"}</p>
                </div>
              </div>
            </div>

            <div className="p-doc-section">
              <h2 className="p-doc-section__title">Lignes de facturation</h2>
              {Array.isArray(facture?.items) && facture.items.length ? (
                <table className="p-doc-table">
                  <thead>
                    <tr>
                      <th>Produit</th>
                      <th>Quantite</th>
                      <th>Prix U.</th>
                      <th className="p-doc-table__right">Montant</th>
                    </tr>
                  </thead>
                  <tbody>
                    {facture.items.map((item) => (
                      <tr key={item.id}>
                        <td>{item.productName || "Produit"}</td>
                        <td>{item.quantity ?? 0}</td>
                        <td>{Number(item.unitPrice || 0).toLocaleString("fr-TN", { style: "currency", currency: "TND" })}</td>
                        <td className="p-doc-table__right">{Number(item.lineTotal || 0).toLocaleString("fr-TN", { style: "currency", currency: "TND" })}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={3} className="p-doc-table__right">Sous-total</td>
                      <td className="p-doc-table__right">{subTotal.toLocaleString("fr-TN", { style: "currency", currency: "TND" })}</td>
                    </tr>
                    <tr>
                      <td colSpan={3} className="p-doc-table__right">TVA</td>
                      <td className="p-doc-table__right">{tvaAmount.toLocaleString("fr-TN", { style: "currency", currency: "TND" })}</td>
                    </tr>
                    <tr>
                      <td colSpan={3} className="p-doc-table__right p-doc-total">Total TTC</td>
                      <td className="p-doc-table__right p-doc-total">{totalTtc.toLocaleString("fr-TN", { style: "currency", currency: "TND" })}</td>
                    </tr>
                  </tfoot>
                </table>
              ) : (
                <p className="p-doc-empty">Aucune ligne de commande disponible.</p>
              )}
            </div>
          </section>
        </article>
      )}
    </div>
  );
}

export default InvoiceTemplatePage;