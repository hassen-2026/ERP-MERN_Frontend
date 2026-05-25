import { useEffect, useMemo, useState } from "react";
import { Table } from "antd";
import PaginationControls from "../PaginationControls/PaginationControls";
import { DATA_TABLE_DEFAULTS } from "../defaults/dataTable_default";
import "./DataTable.css";

function DataTable(props) {
  const {
    title,
    rows,
    columns,
    loading,
    error,
    enablePagination,
    initialPage,
    initialPageSize,
    pageSizeOptions,
    loadingMessage,
    emptyMessage,
    sectionClassName,
    titleClassName,
    tableClassName,
    stateRowClassName,
    errorRowClassName,
    getRowKey,
  } = {
    ...DATA_TABLE_DEFAULTS,
    ...props,
  };

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  useEffect(() => {
    setCurrentPage(initialPage);
  }, [initialPage]);

  useEffect(() => {
    setPageSize(initialPageSize);
  }, [initialPageSize]);

  const antdColumns = columns.map((column, index) => {
    const normalizedColumn = { ...column };
    const derivedKey = normalizedColumn.key || normalizedColumn.dataIndex || `col-${index}`;

    if (!normalizedColumn.title && normalizedColumn.header) {
      normalizedColumn.title = normalizedColumn.header;
    }

    if (!normalizedColumn.dataIndex && normalizedColumn.key) {
      normalizedColumn.dataIndex = normalizedColumn.key;
    }

    if (typeof column.render === "function") {
      normalizedColumn.render = (value, record, rowIndex) => column.render(record, rowIndex, value);
    }

    normalizedColumn.key = derivedKey;
    delete normalizedColumn.header;

    return normalizedColumn;
  });

  const locale = {
    emptyText: error ? (
      <div className={`${stateRowClassName} ${errorRowClassName}`.trim()}>{error}</div>
    ) : (
      <div className={stateRowClassName}>{emptyMessage}</div>
    ),
  };

  const loadingConfig = loading
    ? {
      spinning: true,
      tip: loadingMessage,
    }
    : false;

  const totalItems = Array.isArray(rows) ? rows.length : 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedRows = useMemo(() => {
    if (!enablePagination) {
      return rows;
    }

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    return rows.slice(startIndex, endIndex);
  }, [currentPage, enablePagination, pageSize, rows]);

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = totalItems === 0 ? 0 : Math.min(currentPage * pageSize, totalItems);

  const shouldRenderPagination = enablePagination && !loading && totalItems > 0;

  const handlePageChange = (page) => {
    const safePage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(safePage);
  };

  const handlePageSizeChange = (nextPageSize) => {
    setPageSize(nextPageSize);
    setCurrentPage(1);
  };

  return (
    <section className={sectionClassName}>
      {title ? <h3 className={titleClassName}>{title}</h3> : null}
      <Table
        className={tableClassName}
        columns={antdColumns}
        dataSource={paginatedRows}
        rowKey={getRowKey}
        loading={loadingConfig}
        locale={locale}
        scroll={{ x: "max-content" }}
        pagination={false}
      />
      {shouldRenderPagination ? (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          pageSizeOptions={pageSizeOptions}
          totalItems={totalItems}
          startItem={startItem}
          endItem={endItem}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      ) : null}
    </section>
  );
}

export default DataTable;
