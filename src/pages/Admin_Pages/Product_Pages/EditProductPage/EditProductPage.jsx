import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import TemplateSelector from "../../../../templates/TemplateSelector/TemplateSelector";
import EntityForm from "../../../../components/organisms/EntityForm/EntityForm";
import { EDIT_PRODUCT_PAGE_DEFAULTS } from "../defaults/editProductPage_default";
import { fetchProducts, updateProductThunk } from "../../../../redux/reducers/ProductsReducer";
import { fetchCategoriesThunk } from "../../../../redux/reducers/CategoriesReducer";
import "./EditProductPage.css";

function EditProductPage(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    shellProps,
    notFoundMessage,
    loadingMessage,
    addProductProps,
  } = { ...EDIT_PRODUCT_PAGE_DEFAULTS, ...props };

  const productsState = useSelector((state) => state.products);
  const categoriesState = useSelector((state) => state.categories);
  const categories = categoriesState?.items || [];

  const resolveSelectedCategory = (categoryId) => categories.find((category) => String(category.id) === String(categoryId)) || null;

  useEffect(() => {
    if (!productsState?.items?.length && !productsState?.loading) {
      dispatch(fetchProducts());
    }
    if (!categoriesState?.items?.length && !categoriesState?.loading) {
      dispatch(fetchCategoriesThunk());
    }
  }, [dispatch, productsState?.items?.length, productsState?.loading]);

  const product = useMemo(
    () => productsState?.items?.find((item) => String(item.id) === String(id)) || null,
    [id, productsState?.items],
  );

  const categoryOptions = useMemo(() => {
    return categories.map((c) => ({
      label: c.name,
      value: c.id,
      tvaRate: c.tvaRate,
    }));
  }, [categories]);

  const initialValues = useMemo(() => {
    if (!product) {
      return null;
    }

    return {
      name: product.name,
      reference: product.reference,
      description: product.description,
      category: product.categoryId,
      buyPrice: String(product.buyPriceValue ?? ""),
      buyPriceTTC: `${Number(product.buyPriceTTC || 0).toLocaleString("fr-TN", { style: "currency", currency: "TND" })}`,
      sellPrice: String(product.sellPriceValue ?? ""),
      sellPriceTTC: `${Number(product.sellPriceTTC || 0).toLocaleString("fr-TN", { style: "currency", currency: "TND" })}`,
      tvaRate: `${(product.tvaRate * 100).toFixed(2)}%`,
      minThreshold: String(product.minThreshold ?? "0"),
      stockQuantity: String(product.stockQuantity ?? ""),
      image: "",
    };
  }, [product]);

  const handleSave = async (formValues) => {
    const selectedCategory = resolveSelectedCategory(formValues?.category);
    const payload = {
      ...formValues,
      categoryId: selectedCategory?.id || formValues?.category,
      category: selectedCategory?.name || formValues?.category,
      categorie: selectedCategory?.name || formValues?.category,
    };

    const result = await dispatch(updateProductThunk(id, payload));

    if (result?.success) {
      navigate("/inventory", { state: { successMessage: "Produit modifie avec succes!" } });
    }
  };

  const handleCancel = () => {
    navigate(`/product/${id}`);
  };

  return (
    <TemplateSelector {...shellProps}>
      {productsState?.loading ? <div className="p-card p-product-page__state">{loadingMessage}</div> : null}
      {!productsState?.loading && !product ? <div className="p-card p-product-page__state">{notFoundMessage}</div> : null}
      {product ? (
        <EntityForm
          {...addProductProps}
          categoryOptions={categoryOptions}
          initialValues={initialValues}
          onSave={handleSave}
          onCancel={handleCancel}
          saveLoading={productsState?.updating}
          saveError={productsState?.updateError}
        />
      ) : null}
    </TemplateSelector>
  );
}

export default EditProductPage;


