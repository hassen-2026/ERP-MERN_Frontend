import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import DashboardTemplate from "../../../../templates/TemplateAdmin/TemplateAdmin";
import EntityForm from "../../../../components/organisms/EntityForm/EntityForm";
import {
  fetchFactureById,
  updateFactureThunk,
} from "../../../../redux/reducers/FactureReducer";
import "../../../../components/organisms/EntityForm/EntityForm.css";

function EditFacturePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const factureState = useSelector((state) => state.facture || {});

  useEffect(() => {
    if (id) dispatch(fetchFactureById(id));
  }, [dispatch, id]);

  const facture =
    String(factureState.current?.id || "") === String(id)
      ? factureState.current
      : null;

  const handleSave = async (payload) => {
    const normalizedPayload = {
      date: payload?.date || undefined,
      paymentStatus: String(payload?.paymentStatus || "UNPAID").toUpperCase(),
      file: String(payload?.file || "").trim(),
    };

    const result = await dispatch(updateFactureThunk(id, normalizedPayload));
    if (result?.success) {
      navigate("/factures", {
        state: { successMessage: "Facture mise a jour avec succes." },
      });
    }
  };

  return (
    <DashboardTemplate>
      {!factureState.currentLoading && !facture ? (
        <div className="p-card p-product-page__state">
          {factureState.currentError || "Facture introuvable."}
        </div>
      ) : null}

      {facture ? (
        <EntityForm
          formTitle={`Modifier ${facture.invoiceNumber}`}
          fields={{
            date: {
              label: "Date",
              placeholder: "Date facture",
              type: "input",
              inputType: "date",
              defaultValue: facture.dateIso ? String(facture.dateIso).slice(0, 10) : "",
            },
            paymentStatus: {
              label: "Statut paiement",
              type: "select",
              options: [
                { label: "Impayee", value: "UNPAID" },
                { label: "Partiellement payee", value: "PARTIAL" },
                { label: "Payee", value: "PAID" },
                { label: "Annulee", value: "CANCELLED" },
              ],
              defaultValue: facture.paymentStatus || "UNPAID",
            },
            file: {
              label: "Fichier",
              placeholder: "URL ou reference du fichier",
              type: "input",
              inputType: "text",
              defaultValue: facture.file || "",
            },
          }}
          fieldOrder={["date", "paymentStatus", "file"]}
          initialValues={{
            date: facture.dateIso ? String(facture.dateIso).slice(0, 10) : "",
            paymentStatus: facture.paymentStatus || "UNPAID",
            file: facture.file || "",
          }}
          actionLabels={{ save: "Mettre a jour", cancel: "Annuler" }}
          onSave={handleSave}
          onCancel={() => navigate(`/factures/${id}`)}
          saveLoading={factureState.updating}
          saveError={factureState.updateError}
        />
      ) : null}
    </DashboardTemplate>
  );
}

export default EditFacturePage;
