import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import TemplateSelector from "../../../../templates/TemplateSelector/TemplateSelector";
import EntityForm from "../../../../components/organisms/EntityForm/EntityForm";
import { ADD_SUPPLIER_PAGE_DEFAULTS } from "../defaults/addSupplierPage_default";
import { createSupplierThunk } from "../../../../redux/reducers/SuppliersReducer";
import "../../../../components/organisms/EntityForm/EntityForm.css";
function AddSupplierPage(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { templateProps, addSupplierProps } = { ...ADD_SUPPLIER_PAGE_DEFAULTS, ...props };
  const { shellProps } = templateProps;
  const suppliersState = useSelector((state) => state.suppliers || {});

  const handleSave = async (formValues) => {
    const result = await dispatch(createSupplierThunk(formValues));

    if (result?.success) {
      navigate("/suppliers");
    }
  };

  const handleCancel = () => {
    navigate("/suppliers");
  };

  return (
    <TemplateSelector {...shellProps}>
      <EntityForm
        {...addSupplierProps}
        onSave={handleSave}
        onCancel={handleCancel}
        saveLoading={suppliersState?.creating}
        saveError={suppliersState?.createError}
      />
    </TemplateSelector>
  );
}

export default AddSupplierPage;

