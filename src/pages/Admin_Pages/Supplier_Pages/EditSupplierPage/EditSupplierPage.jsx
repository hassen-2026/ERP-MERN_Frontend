import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import TemplateSelector from "../../../../templates/TemplateSelector/TemplateSelector";
import EntityForm from "../../../../components/organisms/EntityForm/EntityForm";
import { EDIT_SUPPLIER_PAGE_DEFAULTS } from "../defaults/editSupplierPage_default";
import { fetchSuppliers, updateSupplierThunk } from "../../../../redux/reducers/SuppliersReducer";
import "../../../../components/organisms/EntityForm/EntityForm.css";

function EditSupplierPage(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    shellProps,
    notFoundMessage,
    loadingMessage,
    addSupplierProps,
  } = { ...EDIT_SUPPLIER_PAGE_DEFAULTS, ...props };

  const suppliersState = useSelector((state) => state.suppliers || {});

  useEffect(() => {
    if (!suppliersState?.items?.length && !suppliersState?.loading) {
      dispatch(fetchSuppliers());
    }
  }, [dispatch, suppliersState?.items?.length, suppliersState?.loading]);

  const supplier = useMemo(
    () => (suppliersState?.items || []).find((item) => String(item.id) === String(id)) || null,
    [id, suppliersState?.items],
  );

  const initialValues = useMemo(() => {
    if (!supplier) {
      return null;
    }

    return {
      firstName: supplier.firstName || "",
      lastName: supplier.lastName || "",
      email: supplier.email && supplier.email !== "-" ? supplier.email : "",
      phone: supplier.phone && supplier.phone !== "-" ? supplier.phone : "",
      matriculeFiscale: supplier.matriculeFiscale && supplier.matriculeFiscale !== "-" ? supplier.matriculeFiscale : "",
      country: supplier.country && supplier.country !== "-" ? supplier.country : "",
      city: supplier.city && supplier.city !== "-" ? supplier.city : "",
      address: supplier.address && supplier.address !== "-" ? supplier.address : "",
      imageUrl: supplier.imageUrl || "",
    };
  }, [supplier]);

  const handleSave = async (formValues) => {
    const result = await dispatch(updateSupplierThunk(id, formValues));

    if (result?.success) {
      navigate("/suppliers");
    }
  };

  const handleCancel = () => {
    navigate("/suppliers");
  };

  return (
    <TemplateSelector {...shellProps}>
      {suppliersState?.loading ? <div className="p-card p-product-page__state">{loadingMessage}</div> : null}
      {!suppliersState?.loading && !supplier ? <div className="p-card p-product-page__state">{notFoundMessage}</div> : null}
      {supplier ? (
        <EntityForm
          {...addSupplierProps}
          initialValues={initialValues}
          onSave={handleSave}
          onCancel={handleCancel}
          saveLoading={suppliersState?.updating}
          saveError={suppliersState?.updateError}
        />
      ) : null}
    </TemplateSelector>
  );
}

export default EditSupplierPage;

