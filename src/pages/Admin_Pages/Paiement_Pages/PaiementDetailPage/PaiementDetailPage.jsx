import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import DashboardTemplate from "../../../../templates/TemplateAdmin/TemplateAdmin";
import PageHeader from "../../../../components/organisms/PageHeader/PageHeader";
import ProductInfoItem from "../../../../components/molecules/ProductInfoItem/ProductInfoItem";
import "./PaiementDetailPage.css";
import { fetchPaiementById } from "../../../../redux/reducers/PaiementReducer";
import "../../Supplier_Pages/SupplierDetailPage/SupplierDetailPage.css";

function PaiementDetailPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const paiementsState = useSelector((state) => state.paiements || {});

  useEffect(() => {
    if (id) dispatch(fetchPaiementById(id));
  }, [dispatch, id]);

  const paiement =
    String(paiementsState.current?.id || "") === String(id)
      ? paiementsState.current
      : null;

  const infoRows = [
    { label: "Date", value: paiement?.date || "-" },
    { label: "Montant", value: paiement?.amountDisplay || "-" },
    { label: "Type", value: paiement?.typeLabel || "-" },
    { label: "Methode", value: paiement?.paymentMethodLabel || "-" },
    { label: "Facture", value: paiement?.factureNumber || "-" },
    { label: "Total facture", value: paiement?.factureTotalAmountTTCDisplay || "-" },
    { label: "Montant payé", value: paiement?.facturePaidAmountDisplay || "-" },
    { label: "Montant impayé", value: paiement?.factureUnpaidAmountDisplay || "-" },
    { label: "Statut facture", value: paiement?.facturePaymentStatus || "-" },
    { label: "Cree par", value: paiement?.createdByName || "-" },
    { label: "Note", value: paiement?.note || "-" },
  ];

  return (
    <DashboardTemplate>
      <div className="p-supplier-page">
        <PageHeader
          title={paiement?.date || "Detail Paiement"}
          subtitle={paiement?.factureNumber || ""}
          actions={[
            {
              id: "back",
              label: "Retour",
              className: "p-supplier-toolbar-btn",
              onClick: () => navigate("/paiements"),
            },
          ]}
          containerClassName="p-supplier-page__header"
          titleClassName="p-supplier-page__title"
          subtitleClassName="p-supplier-page__subtitle"
          actionsClassName="p-supplier-page__header-actions"
          defaultActionVariant="secondary"
        />

        {!paiementsState.currentLoading && !paiement ? (
          <div className="p-card p-supplier-page__state">
            {paiementsState.currentError || "Paiement introuvable."}
          </div>
        ) : null}

        {paiement ? (
          <>
            <article className="p-paiement-detail__card">
              <h3 className="p-paiement-detail__card-title">Informations paiement</h3>
              <div className="p-paiement-detail__info-rows">
                <ProductInfoItem
                  label="Détails paiement"
                  value={(
                    <div>
                      <div><strong>Montant:</strong> {paiement?.amountDisplay || '-'} </div>
                      <div><strong>Type:</strong> {paiement?.typeLabel || '-'} </div>
                      <div><strong>Méthode:</strong> {paiement?.paymentMethodLabel || '-'} </div>
                      <div><strong>Facture:</strong> {paiement?.factureNumber || '-'} </div>
                      {paiement?.note ? <div><strong>Note:</strong> {paiement.note}</div> : null}
                    </div>
                  )}
                  rowClassName="p-paiement-fullwidth"
                  labelClassName="p-overview__info-label"
                  valueClassName="p-overview__info-value"
                />
              </div>
            </article>
          </>
        ) : null}
      </div>
    </DashboardTemplate>
  );
}

export default PaiementDetailPage;