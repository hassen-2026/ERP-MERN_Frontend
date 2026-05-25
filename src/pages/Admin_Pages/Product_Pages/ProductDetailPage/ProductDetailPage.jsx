import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import TemplateSelector from "../../../../templates/TemplateSelector/TemplateSelector";
import PageHeader from "../../../../components/organisms/PageHeader/PageHeader";
import Overview from "../../../../components/organisms/Overview/Overview";
import { PRODUCT_DETAIL_PAGE_DEFAULTS } from "../defaults/productDetailPage_default";
import { fetchProducts } from "../../../../redux/reducers/ProductsReducer";
import { fetchMovements } from "../../../../redux/reducers/MovementsReducer";
import "./ProductDetailPage.css";

function ProductDetailPage(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { shellProps, notFoundMessage, infoRows } = { ...PRODUCT_DETAIL_PAGE_DEFAULTS, ...props };

  const productsState = useSelector((state) => state.products);
  const movementsState = useSelector((state) => state.movements);

  useEffect(() => {
    if (!productsState?.items?.length && !productsState?.loading) {
      dispatch(fetchProducts());
    }

    if (!movementsState?.rows?.length && !movementsState?.loading) {
      dispatch(fetchMovements());
    }
  }, [dispatch, movementsState?.loading, movementsState?.rows?.length, productsState?.items?.length, productsState?.loading]);

  const product = useMemo(
    () => productsState?.items?.find((item) => String(item.id) === String(id)) || null,
    [id, productsState?.items],
  );

  const productMovements = useMemo(() => {
    if (!product) {
      return [];
    }

    const normalizedName = String(product.name || "").toLowerCase();
    const normalizedRef = String(product.reference || "").toLowerCase();

    return (movementsState?.rows || []).filter((movement) => {
      const movementProduct = String(movement.product || "").toLowerCase();
      const movementReference = String(movement.reference || "").toLowerCase();

      return movementProduct.includes(normalizedName) || movementReference.includes(normalizedRef);
    });
  }, [movementsState?.rows, product]);

  const headerActions = [
    {
      id: "edit-product",
      label: "Modifier",
      className: "p-product-toolbar-btn p-product-toolbar-btn--bulk",
      onClick: () => navigate(`/product/${id}/edit`),
    },
    {
      id: "back-products",
      label: "Retour",
      className: "p-product-toolbar-btn",
      onClick: () => navigate("/inventory"),
    },
  ];

  return (
    <TemplateSelector {...shellProps}>
      <div className="p-product-page">
        <PageHeader
          title={product?.name || "Détail Produit"}
          subtitle={product?.reference || ""}
          actions={headerActions}
          containerClassName="p-product-page__header"
          titleClassName="p-product-page__title"
          subtitleClassName="p-product-page__subtitle"
          actionsClassName="p-product-page__header-actions"
          defaultActionVariant="secondary"
        />

        {!productsState?.loading && !product ? <div className="p-card p-product-page__state">{notFoundMessage}</div> : null}

        {product ? (
          <Overview
            item={product}
            itemSectionTitle="Informations du Produit"
            movementsSectionTitle="Mouvements Récents"
            infoRows={infoRows}
            movements={productMovements}
            movementsLoading={movementsState?.loading}
            movementsError={movementsState?.error}
          />
        ) : null}
      </div>
    </TemplateSelector>
  );
}

export default ProductDetailPage;
