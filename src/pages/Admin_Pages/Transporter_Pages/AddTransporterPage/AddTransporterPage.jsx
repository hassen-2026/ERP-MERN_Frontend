import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import TemplateSelector from "../../../../templates/TemplateSelector/TemplateSelector";
import EntityForm from "../../../../components/organisms/EntityForm/EntityForm";
import { createTransporterThunk } from "../../../../redux/reducers/TransportersReducer";
import "../../../../components/organisms/EntityForm/EntityForm.css";

function AddTransporterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const transportersState = useSelector((state) => state.transporters || {});

  const handleSave = async (payload) => {
    const result = await dispatch(createTransporterThunk(payload));
    if (result?.success) {
      navigate("/transporters", { state: { successMessage: "Transporteur ajouté avec succès." } });
    }
  };

  return (
    <TemplateSelector>
      <EntityForm
        formTitle="Ajouter un transporteur"
        fields={{
          name: { label: "Nom", placeholder: "Nom transporteur", type: "input", inputType: "text", defaultValue: "" },
          plateNumber: { label: "Immatriculation", placeholder: "AA-000-AA", type: "input", inputType: "text", defaultValue: "" },
          cin: { label: "CIN", placeholder: "CIN", type: "input", inputType: "text", defaultValue: "" },
          photoProfile: { label: "Photo (URL)", placeholder: "https://...", type: "input", inputType: "text", defaultValue: "" },
        }}
        fieldOrder={["name", "plateNumber", "cin", "photoProfile"]}
        actionLabels={{ save: "Enregistrer", cancel: "Annuler" }}
        onSave={handleSave}
        onCancel={() => navigate("/transporters")}
        saveLoading={transportersState.creating}
        saveError={transportersState.createError}
      />
    </TemplateSelector>
  );
}

export default AddTransporterPage;

