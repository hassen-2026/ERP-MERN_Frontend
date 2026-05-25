import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import TemplateSelector from "../../../../../templates/TemplateSelector/TemplateSelector";
import EntityForm from "../../../../../components/organisms/EntityForm/EntityForm";
import {
  createHrEmployeeThunk,
  fetchHrDepartments,
  fetchHrPositions,
} from "../../../../../redux/reducers/HrReducer";
import "../../../../../components/organisms/EntityForm/EntityForm.css";

function AddEmployeePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const hrState = useSelector((state) => state.hr || {});
  const employeeState = hrState.employees || {};
  const departments = hrState.departments?.items || [];
  const positions = hrState.positions?.items || [];

  useEffect(() => {
    dispatch(fetchHrDepartments());
    dispatch(fetchHrPositions());
  }, [dispatch]);

  const departmentOptions = useMemo(
    () => departments.map((item) => ({ label: item.name, value: item.id })),
    [departments],
  );

  const positionOptions = useMemo(
    () => positions.map((item) => ({ label: `${item.title}${item.level && item.level !== "-" ? ` (${item.level})` : ""}`, value: item.id })),
    [positions],
  );

  const handleSave = async (formValues) => {
    const result = await dispatch(createHrEmployeeThunk(formValues));
    if (result?.success) {
      navigate("/rh/employees", { state: { successMessage: "Employe ajoute avec succes." } });
    }
  };

  return (
    <TemplateSelector>
      <EntityForm
        formTitle="Ajouter un employe"
        fields={{
          image: { label: "Photo", placeholder: "Photo", type: "input", inputType: "file", defaultValue: null },
          cin: { label: "CIN", placeholder: "Numero CIN", type: "input", inputType: "text", defaultValue: "" },
          firstName: { label: "Prenom", placeholder: "Prenom", type: "input", inputType: "text", defaultValue: "" },
          lastName: { label: "Nom", placeholder: "Nom", type: "input", inputType: "text", defaultValue: "" },
          gender: {
            label: "Genre",
            placeholder: "Selectionner un genre",
            type: "select",
            options: [
              { label: "Homme", value: "MALE" },
              { label: "Femme", value: "FEMALE" },
         
            ],
            defaultValue: "",
          },
          birthDate: {
            label: "Date de naissance",
            placeholder: "Date de naissance",
            type: "input",
            inputType: "date",
            defaultValue: "",
          },
          nationality: { label: "Nationalite", placeholder: "Nationalite", type: "input", inputType: "text", defaultValue: "" },
          email: { label: "Email", placeholder: "email@entreprise.com", type: "input", inputType: "text", defaultValue: "" },
          phone: { label: "Telephone", placeholder: "+216 ...", type: "input", inputType: "text", defaultValue: "" },
          status: {
            label: "Statut",
            placeholder: "Selectionner un statut",
            type: "select",
            options: [
              { label: "Actif", value: "ACTIVE" },
              { label: "Inactif", value: "INACTIVE" },
              { label: "En conge", value: "ON_LEAVE" },
              { label: "Termine", value: "TERMINATED" },
            ],
            defaultValue: "ACTIVE",
          },
          contractType: {
            label: "Type contrat",
            placeholder: "Selectionner un type",
            type: "select",
            options: [
              { label: "CDI", value: "CDI" },
              { label: "CDD", value: "CDD" },
              { label: "Stage", value: "STAGE" },
              { label: "Interim", value: "INTERIM" },
              { label: "Freelance", value: "FREELANCE" },
            ],
            defaultValue: "CDI",
          },
          departmentId: {
            label: "Departement",
            placeholder: "Selectionner un departement",
            type: "select",
            options: departmentOptions,
            defaultValue: undefined,
          },
          positionId: {
            label: "Poste",
            placeholder: "Selectionner un poste",
            type: "select",
            options: positionOptions,
            defaultValue: undefined,
          },
          hireDate: {
            label: "Date embauche",
            placeholder: "Date embauche",
            type: "input",
            inputType: "date",
            defaultValue: "",
          },
        }}
        fieldOrder={[
          "image",
          "cin",
          "firstName",
          "lastName",
          "gender",
          "birthDate",
          "nationality",
          "email",
          "phone",
          "status",
          "contractType",
          "departmentId",
          "positionId",
          "hireDate",
        ]}
        actionLabels={{ save: "Enregistrer", cancel: "Annuler" }}
        onSave={handleSave}
        onCancel={() => navigate("/rh/employees")}
        saveLoading={employeeState.creating}
        saveError={employeeState.createError}
      />
    </TemplateSelector>
  );
}

export default AddEmployeePage;


