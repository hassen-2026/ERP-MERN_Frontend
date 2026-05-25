import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import DashboardTemplate from "../../../../templates/TemplateAdmin/TemplateAdmin";
import EntityForm from "../../../../components/organisms/EntityForm/EntityForm";
import { createClientThunk } from "../../../../redux/reducers/ClientReducer";
import "../../../../components/organisms/EntityForm/EntityForm.css";

function AddClientPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const clientsState = useSelector((state) => state.clients || {});

  const handleSave = async (formValues) => {
    const result = await dispatch(createClientThunk(formValues));

    if (result?.success) {
      navigate("/clients", { state: { successMessage: "Client ajouté avec succès." } });
    }
  };

  return (
    <DashboardTemplate>
      <EntityForm
        formTitle="Ajouter un client"
        fields={{
          nom: { label: "Nom", placeholder: "Nom du client", type: "input", inputType: "text", defaultValue: "" },
          email: { label: "Email", placeholder: "email@example.com", type: "input", inputType: "email", defaultValue: "" },
          telephone: { label: "Téléphone", placeholder: "Téléphone", type: "input", inputType: "text", defaultValue: "" },
          adresse: { label: "Adresse", placeholder: "Adresse", type: "input", inputType: "text", defaultValue: "" },
        }}
        fieldOrder={["nom", "email", "telephone", "adresse"]}
        actionLabels={{ save: "Enregistrer", cancel: "Annuler" }}
        onSave={handleSave}
        onCancel={() => navigate("/clients")}
        saveLoading={clientsState.creating}
        saveError={clientsState.createError}
      />
    </DashboardTemplate>
  );
}

export default AddClientPage;
