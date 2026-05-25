import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import DashboardTemplate from "../../../../../templates/TemplateAdmin/TemplateAdmin";
import EntityForm from "../../../../../components/organisms/EntityForm/EntityForm";
import {
  createHrPositionThunk,
  fetchHrDepartments,
} from "../../../../../redux/reducers/HrReducer";
import "../../../../../components/organisms/EntityForm/EntityForm.css";

function AddPositionPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const departmentState = useSelector((state) => state.hr?.departments || {});
  const positionState = useSelector((state) => state.hr?.positions || {});
  const departments = departmentState.items || [];

  useEffect(() => {
    dispatch(fetchHrDepartments());
  }, [dispatch]);

  const departmentOptions = useMemo(
    () => departments.map((item) => ({ label: item.name, value: item.id })),
    [departments],
  );

  const handleSave = async (formValues) => {
    const result = await dispatch(createHrPositionThunk(formValues));

    if (result?.success) {
      navigate("/rh/positions", { state: { successMessage: "Poste ajoute avec succes." } });
    }
  };

  return (
    <DashboardTemplate>
      <EntityForm
        formTitle="Ajouter un poste"
        fields={{
          title: { label: "Intitule", placeholder: "Intitule du poste", type: "input", inputType: "text", defaultValue: "" },
          level: { label: "Niveau", placeholder: "Junior, Senior...", type: "input", inputType: "text", defaultValue: "" },
          departmentId: {
            label: "Departement",
            placeholder: "Selectionner un departement",
            type: "select",
            options: departmentOptions,
            defaultValue: undefined,
          },
          description: { label: "Description", placeholder: "Description du poste", type: "input", inputType: "text", defaultValue: "" },
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
        fieldOrder={["title", "level", "departmentId", "description", "isActive"]}
        actionLabels={{ save: "Enregistrer", cancel: "Annuler" }}
        onSave={handleSave}
        onCancel={() => navigate("/rh/positions")}
        saveLoading={positionState.creating}
        saveError={positionState.createError}
      />
    </DashboardTemplate>
  );
}

export default AddPositionPage;

