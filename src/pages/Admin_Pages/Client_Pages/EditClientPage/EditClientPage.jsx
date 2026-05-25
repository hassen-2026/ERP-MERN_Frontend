import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import DashboardTemplate from "../../../../templates/TemplateAdmin/TemplateAdmin";
import EntityForm from "../../../../components/organisms/EntityForm/EntityForm";
import { fetchClients, updateClientThunk } from "../../../../redux/reducers/ClientReducer";
import "../../../../components/organisms/EntityForm/EntityForm.css";

function EditClientPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const clientsState = useSelector((state) => state.clients || {});

  useEffect(() => {
    if (!clientsState.items.length && !clientsState.loading) {
      dispatch(fetchClients());
    }
  }, [clientsState.items.length, clientsState.loading, dispatch]);

  const client = useMemo(
    () => clientsState.items.find((item) => String(item.id) === String(id)) || null,
    [clientsState.items, id],
  );

  const handleSave = async (formValues) => {
    const result = await dispatch(updateClientThunk(id, formValues));

    if (result?.success) {
      navigate("/clients", { state: { successMessage: "Client mis à jour avec succès." } });
    }
  };

  return (
    <DashboardTemplate>
      {!clientsState.loading && !client ? (
        <div className="p-card p-product-page__state">Client introuvable.</div>
      ) : null}

      {client ? (
        <EntityForm
          formTitle="Modifier un client"
          fields={{
            nom: { label: "Nom", placeholder: "Nom du client", type: "input", inputType: "text", defaultValue: client.nom || "" },
            email: { label: "Email", placeholder: "email@example.com", type: "input", inputType: "email", defaultValue: client.email || "" },
            telephone: { label: "Téléphone", placeholder: "Téléphone", type: "input", inputType: "text", defaultValue: client.telephone || "" },
            adresse: { label: "Adresse", placeholder: "Adresse", type: "input", inputType: "text", defaultValue: client.adresse || "" },
          }}
          fieldOrder={["nom", "email", "telephone", "adresse"]}
          initialValues={{ nom: client.nom, email: client.email, telephone: client.telephone, adresse: client.adresse }}
          actionLabels={{ save: "Mettre à jour", cancel: "Annuler" }}
          onSave={handleSave}
          onCancel={() => navigate("/clients")}
          saveLoading={clientsState.updating}
          saveError={clientsState.updateError}
        />
      ) : null}
    </DashboardTemplate>
  );
}

export default EditClientPage;
