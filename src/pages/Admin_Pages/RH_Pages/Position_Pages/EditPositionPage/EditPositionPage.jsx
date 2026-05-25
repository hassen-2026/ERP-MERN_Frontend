import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import DashboardTemplate from "../../../../../templates/TemplateAdmin/TemplateAdmin";
import EntityForm from "../../../../../components/organisms/EntityForm/EntityForm";
import {
  fetchHrDepartments,
  fetchHrPositions,
  updateHrPositionThunk,
} from "../../../../../redux/reducers/HrReducer";
import "../../../../../components/organisms/EntityForm/EntityForm.css";

function EditPositionPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const positionState = useSelector((state) => state.hr?.positions || {});
  const departmentState = useSelector((state) => state.hr?.departments || {});
  const positions = positionState.items || [];
  const departments = departmentState.items || [];

  useEffect(() => {
    if (!positions.length && !positionState.loading) {
      dispatch(fetchHrPositions());
    }
    dispatch(fetchHrDepartments());
  }, [dispatch, positions.length, positionState.loading]);

  const departmentOptions = useMemo(
    () => departments.map((item) => ({ label: item.name, value: item.id })),
    [departments],
  );

  const position = useMemo(
    () => positions.find((item) => String(item.id) === String(id)) || null,
    [positions, id],
  );

  const handleSave = async (formValues) => {
    const result = await dispatch(updateHrPositionThunk(id, formValues));

    if (result?.success) {
      navigate("/rh/positions", { state: { successMessage: "Poste mis a jour avec succes." } });
    }
  };

  return (
    <DashboardTemplate>
      {!positionState.loading && !position ? (
        <div className="p-card p-product-page__state">Poste introuvable.</div>
      ) : null}

      {position ? (
        <EntityForm
          formTitle="Modifier un poste"
          fields={{
            title: { label: "Intitule", placeholder: "Intitule du poste", type: "input", inputType: "text", defaultValue: position.title || "" },
            level: { label: "Niveau", placeholder: "Junior, Senior...", type: "input", inputType: "text", defaultValue: position.level || "" },
            departmentId: {
              label: "Departement",
              placeholder: "Selectionner un departement",
              type: "select",
              options: departmentOptions,
              defaultValue: position.departmentId || undefined,
            },
            description: {
              label: "Description",
              placeholder: "Description du poste",
              type: "input",
              inputType: "text",
              defaultValue: position.description === "-" ? "" : position.description,
            },
            isActive: {
              label: "Statut",
              placeholder: "Selectionner un statut",
              type: "select",
              options: [
                { label: "Actif", value: true },
                { label: "Inactif", value: false },
              ],
              defaultValue: position.isActive,
            },
          }}
          initialValues={{
            title: position.title,
            level: position.level === "-" ? "" : position.level,
            departmentId: position.departmentId,
            description: position.description === "-" ? "" : position.description,
            isActive: position.isActive,
          }}
          fieldOrder={["title", "level", "departmentId", "description", "isActive"]}
          actionLabels={{ save: "Mettre a jour", cancel: "Annuler" }}
          onSave={handleSave}
          onCancel={() => navigate("/rh/positions")}
          saveLoading={positionState.updating}
          saveError={positionState.updateError}
        />
      ) : null}
    </DashboardTemplate>
  );
}

export default EditPositionPage;

