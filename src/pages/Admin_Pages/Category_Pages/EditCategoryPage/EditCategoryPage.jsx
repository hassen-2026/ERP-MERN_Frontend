import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import TemplateSelector from "../../../../templates/TemplateSelector/TemplateSelector";
import { updateCategoryThunk } from "../../../../redux/reducers/CategoriesReducer";
import { fetchCategoryById } from "../../../../services/categoryApi";
import { useNavigate, useParams } from "react-router-dom";
import EntityForm from "../../../../components/organisms/EntityForm/EntityForm";
import PageHeader from "../../../../components/organisms/PageHeader/PageHeader";

function EditCategoryPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchCategoryById(id);
        setCategory(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleSave = async (payload) => {
    await dispatch(updateCategoryThunk(id, payload));
    navigate("/categories");
  };

  if (loading) return (
    <TemplateSelector title="Éditer catégorie">
      <div className="p-page">Chargement...</div>
    </TemplateSelector>
  );

  if (!category) return (
    <TemplateSelector title="Éditer catégorie">
      <div className="p-page">Catégorie introuvable</div>
    </TemplateSelector>
  );

  return (
    <TemplateSelector title="Éditer catégorie">
      <div className="p-page">
        <PageHeader title={`Éditer : ${category.name}`} actions={[]} />

        <EntityForm
          formTitle={`Éditer : ${category.name}`}
          fields={{
            name: { label: "Nom", placeholder: "Nom de la catégorie", type: "input", inputType: "text", defaultValue: "" },
            description: { label: "Description", placeholder: "Description", type: "input", inputType: "text", defaultValue: "" },
            image: { label: "Image", placeholder: "Sélectionnez une image", type: "input", inputType: "file", defaultValue: "" },
            tvaRate: { label: "TVA (ex: 0.19)", placeholder: "0.19", type: "input", inputType: "number", defaultValue: 0.19 },
            isActive: { label: "Actif", placeholder: "Actif", type: "select", options: [ { label: "Oui", value: true }, { label: "Non", value: false } ], defaultValue: true },
          }}
          fieldOrder={["name", "description", "image", "tvaRate", "isActive"]}
          initialValues={category}
          onSave={handleSave}
          onCancel={() => navigate("/categories")}
          saveLoading={false}
          saveError={null}
        />
      </div>
    </TemplateSelector>
  );
}

export default EditCategoryPage;

