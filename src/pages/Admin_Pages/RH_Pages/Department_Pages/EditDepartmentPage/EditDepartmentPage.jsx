import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import TemplateSelector from "../../../../../templates/TemplateSelector/TemplateSelector";
import EntityForm from "../../../../../components/organisms/EntityForm/EntityForm";
import {
  fetchHrDepartments,
  updateHrDepartmentThunk,
} from "../../../../../redux/reducers/HrReducer";
import "../../../../../components/organisms/EntityForm/EntityForm.css";

function EditDepartmentPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const departmentState = useSelector((state) => state.hr?.departments || {});

  useEffect(() => {
    if (!departmentState.items?.length && !departmentState.loading) {
      dispatch(fetchHrDepartments());
    }
  }, [dispatch, departmentState.items?.length, departmentState.loading]);

  const department = useMemo(
    () => departmentState.items.find((item) => String(item.id) === String(id)) || null,
    [departmentState.items, id],
  );

  const handleSave = async (formValues) => {
    const result = await dispatch(updateHrDepartmentThunk(id, formValues));

    if (result?.success) {
      navigate("/rh/departments", { state: { successMessage: "Departement mis a jour avec succes." } });
    }
  };

  return (
    <TemplateSelector>
      {!departmentState.loading && !department ? (
        <div className="p-card p-product-page__state">Departement introuvable.</div>
      ) : null}

      {department ? (
        <EntityForm
          formTitle="Modifier un departement"
          fields={{
            image: { label: "Image", placeholder: "Image", type: "input", inputType: "file", defaultValue: null },
            name: { label: "Nom", placeholder: "Nom du departement", type: "input", inputType: "text", defaultValue: department.name || "" },
            code: { label: "Code", placeholder: "RH, FIN, IT...", type: "input", inputType: "text", defaultValue: department.code || "" },
            description: { label: "Description", placeholder: "Description", type: "input", inputType: "text", defaultValue: department.description || "" },
            isActive: {
              label: "Statut",
              placeholder: "Selectionner un statut",
              type: "select",
              options: [
                { label: "Actif", value: true },
                { label: "Inactif", value: false },
              ],
              defaultValue: department.isActive,
            },
          }}
          initialValues={{
            name: department.name,
            code: department.code,
            description: department.description === "-" ? "" : department.description,
            isActive: department.isActive,
          }}
          fieldOrder={["image", "name", "code", "description", "isActive"]}
          actionLabels={{ save: "Mettre a jour", cancel: "Annuler" }}
          onSave={handleSave}
          onCancel={() => navigate("/rh/departments")}
          saveLoading={departmentState.updating}
          saveError={departmentState.updateError}
        />
      ) : null}
    </TemplateSelector>
  );
}

export default EditDepartmentPage;


