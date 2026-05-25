import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import TemplateSelector from "../../templates/TemplateSelector/TemplateSelector";
import PageHeader from "../../components/organisms/PageHeader/PageHeader";
import MovementsTable from "../../components/organisms/MovementsTable/MovementsTable";
import { fetchMovements } from "../../redux/reducers/MovementsReducer";

function StockMovementsPage() {
  const dispatch = useDispatch();
  const movementsState = useSelector((state) => state.movements);

  useEffect(() => {
    dispatch(fetchMovements());
  }, [dispatch]);

  return (
    <TemplateSelector>
      <PageHeader
        title="Mouvements Stock"
        subtitle="Suivi des entrées et sorties de stock"
      />
      <MovementsTable
        rows={movementsState?.rows || []}
        loading={movementsState?.loading}
        error={movementsState?.error}
      />
    </TemplateSelector>
  );
}

export default StockMovementsPage;
