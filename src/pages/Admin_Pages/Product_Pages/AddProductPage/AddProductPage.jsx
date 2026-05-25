
import EntityForm from "../../../../components/organisms/EntityForm/EntityForm";
import { useEffect } from "react";
import { ADD_PRODUCT_PAGE_DEFAULTS } from "../defaults/addProductPage_default";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createProductThunk } from "../../../../redux/reducers/ProductsReducer";
import "./AddProductPage.css";
import TemplateSelector from "../../../../templates/TemplateSelector/TemplateSelector";
import { fetchCategoriesThunk } from "../../../../redux/reducers/CategoriesReducer";

function AddProductPage(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { templateProps, addProductProps } = { ...ADD_PRODUCT_PAGE_DEFAULTS, ...props };
  const { shellProps } = templateProps;
  const productsState = useSelector((state) => state.products);
  const categoriesState = useSelector((state) => state.categories);
  const categories = categoriesState?.items || [];

  const resolveSelectedCategory = (categoryId) => categories.find((category) => String(category.id) === String(categoryId)) || null;

  const handleSave = async (formValues) => {
    const selectedCategory = resolveSelectedCategory(formValues?.category);
    const payload = {
      ...formValues,
      categoryId: selectedCategory?.id || formValues?.category,
      category: selectedCategory?.name || formValues?.category,
      categorie: selectedCategory?.name || formValues?.category,
    };

    const result = await dispatch(createProductThunk(payload));

    if (result?.success) {
      navigate("/inventory", { state: { successMessage: "Produit ajouté avec succès !" } });
    }
  };

  const handleCancel = () => {
    navigate("/inventory");
  };

  useEffect(() => {
    if (!categoriesState?.items?.length && !categoriesState?.loading) {
      dispatch(fetchCategoriesThunk());
    }
  }, [dispatch, categoriesState?.items?.length, categoriesState?.loading]);

  const categoryOptions = categories.map((c) => ({
    label: c.name,
    value: c.id,
    tvaRate: c.tvaRate,
  }));

  return (
    <TemplateSelector {...shellProps}>
      <EntityForm
        {...addProductProps}
        categoryOptions={categoryOptions}
        onSave={handleSave}
        initialValues={{}}
        fields={{
          ...addProductProps.fields,
          category: { ...addProductProps.fields.category, options: categoryOptions },
        }}
        onCancel={handleCancel}
        saveLoading={productsState?.creating}
        saveError={productsState?.createError}
      />
    </TemplateSelector>
  );
}

export default AddProductPage;

