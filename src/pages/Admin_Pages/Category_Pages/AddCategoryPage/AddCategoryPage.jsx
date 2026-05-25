import React, { useState } from "react";
import { useDispatch } from "react-redux";
import TemplateSelector from "../../../../templates/TemplateSelector/TemplateSelector";
import { createCategoryThunk } from "../../../../redux/reducers/CategoriesReducer";
import { useNavigate } from "react-router-dom";
import EntityForm from "../../../../components/organisms/EntityForm/EntityForm";
import "./AddCategoryPage.css";

function AddCategoryPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleSave = async (payload) => {
    await dispatch(createCategoryThunk(payload));
    navigate("/categories");
  };

  return (
    <TemplateSelector>
      <div className="p-add-category-layout">

        <EntityForm
          formTitle="Nouvelle catégorie"
          fields={{
            name: { label: "Nom", placeholder: "Nom de la catégorie", type: "input", inputType: "text", defaultValue: "" },
            description: { label: "Description", placeholder: "Description", type: "input", inputType: "text", defaultValue: "" },
            image: { label: "Image", placeholder: "Sélectionnez une image", type: "input", inputType: "file", defaultValue: "" },
            tvaRate: { label: "TVA (ex: 0.19)", placeholder: "0.19", type: "input", inputType: "number", defaultValue: 0.19 },
            isActive: { label: "Actif", placeholder: "Actif", type: "select", options: [ { label: "Oui", value: true }, { label: "Non", value: false } ], defaultValue: true },
          }}
          fieldOrder={["name", "description", "image", "tvaRate", "isActive"]}
          onSave={handleSave}
          onCancel={() => navigate("/categories")}
        />
      </div>
    </TemplateSelector>
  );
}

export default AddCategoryPage;

