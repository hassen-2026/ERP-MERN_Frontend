import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import TemplateSelector from "../../../../templates/TemplateSelector/TemplateSelector";
import EntityForm from "../../../../components/organisms/EntityForm/EntityForm";
import { fetchTransporters, updateTransporterThunk } from "../../../../redux/reducers/TransportersReducer";
import "../../../../components/organisms/EntityForm/EntityForm.css";

function EditTransporterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const transportersState = useSelector((state) => state.transporters || {});

  useEffect(() => {
    if (!transportersState.items.length && !transportersState.loading) {
      dispatch(fetchTransporters());
    }
  }, [dispatch, transportersState.items.length, transportersState.loading]);

  const transporter = useMemo(
    () => transportersState.items.find((item) => String(item.id) === String(id)) || null,
    [transportersState.items, id],
  );

  const handleSave = async (payload) => {
    const result = await dispatch(updateTransporterThunk(id, payload));
    if (result?.success) {
      navigate("/transporters", { state: { successMessage: "Transporteur mis à jour avec succès." } });
    }
  };

  return (
    <TemplateSelector>
      {!transportersState.loading && !transporter ? <div className="p-card p-product-page__state">Transporteur introuvable.</div> : null}

      {transporter ? (
        <EntityForm
          formTitle="Modifier un transporteur"
          fields={{
            name: { label: "Nom", placeholder: "Nom transporteur", type: "input", inputType: "text", defaultValue: transporter.name || "" },
            plateNumber: { label: "Immatriculation", placeholder: "AA-000-AA", type: "input", inputType: "text", defaultValue: transporter.plateNumber || "" },
            cin: { label: "CIN", placeholder: "CIN", type: "input", inputType: "text", defaultValue: transporter.cin || "" },
            photoProfile: { label: "Photo (URL)", placeholder: "https://...", type: "input", inputType: "text", defaultValue: transporter.photoProfile || "" },
          }}
          fieldOrder={["name", "plateNumber", "cin", "photoProfile"]}
          initialValues={{
            name: transporter.name,
            plateNumber: transporter.plateNumber === "-" ? "" : transporter.plateNumber,
            cin: transporter.cin === "-" ? "" : transporter.cin,
            photoProfile: transporter.photoProfile,
          }}
          actionLabels={{ save: "Mettre à jour", cancel: "Annuler" }}
          onSave={handleSave}
          onCancel={() => navigate("/transporters")}
          saveLoading={transportersState.updating}
          saveError={transportersState.updateError}
        />
      ) : null}
    </TemplateSelector>
  );
}

export default EditTransporterPage;

