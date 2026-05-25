import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import TemplateSelector from "../../../../../templates/TemplateSelector/TemplateSelector";
import EntityForm from "../../../../../components/organisms/EntityForm/EntityForm";
import { createHrDepartmentThunk } from "../../../../../redux/reducers/HrReducer";
import "../../../../../components/organisms/EntityForm/EntityForm.css";

function AddDepartmentPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const departmentState = useSelector((state) => state.hr?.departments || {});

  const handleSave = async (formValues) => {
    const result = await dispatch(createHrDepartmentThunk(formValues));

    if (result?.success) {
      navigate("/rh/departments", { state: { successMessage: "Departement ajoute avec succes." } });
    }
  };

  return (
    <TemplateSelector>
      <EntityForm
        formTitle="Ajouter un departement"
        fields={{
          image: { label: "Image", placeholder: "Image", type: "input", inputType: "file", defaultValue: null },
          name: { label: "Nom", placeholder: "Nom du departement", type: "input", inputType: "text", defaultValue: "" },
          code: { label: "Code", placeholder: "RH, FIN, IT...", type: "input", inputType: "text", defaultValue: "" },
          description: { label: "Description", placeholder: "Description", type: "input", inputType: "text", defaultValue: "" },
          isActive: {
            label: "Statut",
            placeholder: "Selectionner un statut",
            type: "select",
            options: [
              { label: "Actif", value: true },
              { label: "Inactif", value: false },
            ],
            defaultValue: true,
          },
        }}
        fieldOrder={["image", "name", "code", "description", "isActive"]}
        actionLabels={{ save: "Enregistrer", cancel: "Annuler" }}
        onSave={handleSave}
        onCancel={() => navigate("/rh/departments")}
        saveLoading={departmentState.creating}
        saveError={departmentState.createError}
      />
    </TemplateSelector>
  );
}

export default AddDepartmentPage;


