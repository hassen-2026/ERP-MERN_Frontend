import Button from "../../atoms/button/Button";
import Select from "../../atoms/select/Select";
import { PAGINATION_CONTROLS_DEFAULTS } from "../defaults/paginationControls_default";
import "./PaginationControls.css";

function buildVisiblePages(currentPage, totalPages) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, idx) => idx + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, 5, "dots-right", totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [1, "dots-left", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, "dots-left", currentPage - 1, currentPage, currentPage + 1, "dots-right", totalPages];
}

function PaginationControls(props) {
  const {
    currentPage,
    totalPages,
    pageSize,
    pageSizeOptions,
    totalItems,
    startItem,
    endItem,
    onPageChange,
    onPageSizeChange,
    customClassName,
  } = {
    ...PAGINATION_CONTROLS_DEFAULTS,
    ...props,
  };

  if (totalItems <= 0) {
    return null;
  }

  const pages = buildVisiblePages(currentPage, totalPages);

  return (
    <div className={`m-pagination ${customClassName}`.trim()}>
      <div className="m-pagination__meta">
        {startItem}-{endItem} sur {totalItems} resultats
      </div>

      <div className="m-pagination__controls">
        <Select
          value={pageSize}
          options={pageSizeOptions.map((option) => ({
            label: `${option} / page`,
            value: option,
          }))}
          customClassName="m-pagination__size"
          onChange={(value) => onPageSizeChange(Number(value))}
        />

        <div className="m-pagination__pages">
          <Button
            variant="ghost"
            customClassName="m-pagination__btn"
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            Prec
          </Button>

          {pages.map((page) => {
            if (typeof page === "string") {
              return (
                <span key={page} className="m-pagination__dots" aria-hidden="true">
                  ...
                </span>
              );
            }

            const isActive = page === currentPage;

            return (
              <Button
                key={page}
                variant="ghost"
                customClassName={`m-pagination__btn ${isActive ? "m-pagination__btn--active" : ""}`.trim()}
                onClick={() => onPageChange(page)}
              >
                {page}
              </Button>
            );
          })}

          <Button
            variant="ghost"
            customClassName="m-pagination__btn"
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          >
            Suiv
          </Button>
        </div>
      </div>
    </div>
  );
}

export default PaginationControls;
