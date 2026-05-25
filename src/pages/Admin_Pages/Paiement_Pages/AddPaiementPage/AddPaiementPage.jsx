import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import DashboardTemplate from "../../../../templates/TemplateAdmin/TemplateAdmin";
import EntityForm from "../../../../components/organisms/EntityForm/EntityForm";
import { fetchFactures } from "../../../../redux/reducers/FactureReducer";
import { createPaiementThunk } from "../../../../redux/reducers/PaiementReducer";

function AddPaiementPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const facturesState = useSelector((state) => state.facture || {});
  const paiementsState = useSelector((state) => state.paiements || {});
  const sourceFactureId = location.state?.factureId || "";
  const sourceAmount = Number(location.state?.amount);

  useEffect(() => {
    if (!facturesState.items.length && !facturesState.listLoading) {
      dispatch(fetchFactures());
    }
  }, [dispatch, facturesState.items.length, facturesState.listLoading]);

  const factureOptions = useMemo(
    () =>
      (facturesState.items || []).map((facture) => ({
        label: `${facture.invoiceNumber} - ${facture.clientName}`,
        value: facture.id,
        totalAmountTTC: Number(facture.totalAmountTTC) || 0,
        paymentStatus: facture.paymentStatus,
      })),
    [facturesState.items],
  );

  const suggestedAmount = useMemo(() => {
    if (Number.isFinite(sourceAmount) && sourceAmount > 0) return sourceAmount;
    if (!sourceFactureId) return 0;

    const selectedFacture = (facturesState.items || []).find(
      (facture) => String(facture.id || "") === String(sourceFactureId),
    );

    return Number(selectedFacture?.totalAmountTTC) || 0;
  }, [facturesState.items, sourceAmount, sourceFactureId]);

  const handleSave = async (formValues) => {
    const result = await dispatch(createPaiementThunk(formValues));
    if (result?.success) {
      navigate("/paiements", { state: { successMessage: "Paiement ajoute avec succes." } });
    }
  };

  return (
    <DashboardTemplate>
      <EntityForm
        formTitle="Ajouter un paiement"
        fields={{
          date: {
            label: "Date",
            placeholder: "Date du paiement",
            type: "input",
            inputType: "date",
            defaultValue: "",
          },
          amount: {
            label: "Montant",
            placeholder: "0",
            type: "input",
            inputType: "number",
            defaultValue: "0",
          },
          paymentMethod: {
            label: "Methode",
            type: "select",
            options: [
              { label: "Cash", value: "CASH" },
              { label: "Carte", value: "CARD" },
              { label: "Virement", value: "BANK_TRANSFER" },
              { label: "Mobile money", value: "MOBILE_MONEY" },
              { label: "Autre", value: "OTHER" },
            ],
            defaultValue: "OTHER",
          },
          factureId: {
            label: "Facture",
            type: "select",
            options: factureOptions,
            defaultValue: sourceFactureId,
          },
          note: {
            label: "Note",
            placeholder: "Commentaire",
            type: "input",
            inputType: "text",
            defaultValue: "",
          },
        }}
        fieldOrder={["date", "amount", "paymentMethod", "factureId", "note"]}
        initialValues={{
          date: "",
          amount: String(suggestedAmount || 0),
          paymentMethod: "OTHER",
          factureId: sourceFactureId,
          note: "",
        }}
        actionLabels={{ save: "Enregistrer", cancel: "Annuler" }}
        onSave={handleSave}
        onCancel={() => navigate("/paiements")}
        saveLoading={paiementsState.creating}
        saveError={paiementsState.createError}
      />
    </DashboardTemplate>
  );
}

export default AddPaiementPage;
