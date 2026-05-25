import { useMemo } from "react";
import {
  CheckOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
} from "@ant-design/icons";

import ActionButtonsGroup from "../../molecules/ActionButtonsGroup/ActionButtonsGroup";
import DataTable from "../../molecules/DataTable/DataTable";

const ACTION_KIND_DEFAULTS = {
  view: {
    label: "Voir",
    icon: <EyeOutlined />,
    variant: "primary",
    className: "p-action-btn m-action-buttons__btn m-action-buttons__btn--view",
  },
  detail: {
    label: "Detail",
    icon: <EyeOutlined />,
    variant: "primary",
    className: "p-action-btn m-action-buttons__btn m-action-buttons__btn--view",
  },
  edit: {
    label: "Modifier",
    icon: <EditOutlined />,
    variant: "warning",
    className: "p-action-btn m-action-buttons__btn m-action-buttons__btn--edit",
  },
  delete: {
    label: "Supprimer",
    icon: <DeleteOutlined />,
    variant: "danger",
    className: "p-action-btn m-action-buttons__btn m-action-buttons__btn--delete",
  },
  receive: {
    label: "Recu",
    icon: <CheckOutlined />,
    variant: "success",
    className: "p-action-btn m-action-buttons__btn m-action-buttons__btn--receive",
  },
};

function resolveAction(action, row, index) {
  const defaults = ACTION_KIND_DEFAULTS[action.kind] || {};
  const disabled = typeof action.disabled === "function" ? action.disabled(row) : Boolean(action.disabled);

  return {
    id: action.id || `${action.kind || "action"}-${index}`,
    label: action.label || defaults.label || "Action",
    icon: action.icon !== undefined ? action.icon : defaults.icon,
    variant: action.variant || defaults.variant || "primary",
    className: `${defaults.className || "p-action-btn m-action-buttons__btn"} ${action.className || ""}`.trim(),
    disabled,
    onClick: () => {
      if (typeof action.onClick === "function") {
        action.onClick(row);
      }
    },
  };
}

function MainDataTable(props) {
  const {
    title,
    rows,
    columns,
    loading,
    error,
    loadingMessage,
    emptyMessage,
    sectionClassName,
    titleClassName,
    tableClassName,
    stateRowClassName,
    errorRowClassName,
    getRowKey,
    getActions,
    actionColumnHeader,
    actionGroupClassName,
    actionColumnWidth,
    fixActionColumn,
  } = props;

  const resolvedColumns = useMemo(() => {
    if (typeof getActions !== "function") {
      return columns;
    }

    const actionColumn = {
      key: "actions",
      header: actionColumnHeader || "Actions",
      width: Number(actionColumnWidth) || 360,
      fixed: fixActionColumn ? "right" : undefined,
      onCell: () => ({ style: { whiteSpace: "nowrap" } }),
      render: (row) => {
        const resolvedActions = (getActions(row) || []).map((action, index) => resolveAction(action, row, index));

        return (
          <ActionButtonsGroup
            actions={resolvedActions}
            containerClassName={actionGroupClassName || "p-actions m-action-buttons"}
          />
        );
      },
    };

    return [...columns, actionColumn];
  }, [actionColumnHeader, actionColumnWidth, actionGroupClassName, columns, fixActionColumn, getActions]);

  return (
    <DataTable
      title={title}
      rows={rows}
      columns={resolvedColumns}
      loading={loading}
      error={error}
      loadingMessage={loadingMessage}
      emptyMessage={emptyMessage}
      sectionClassName={sectionClassName || "o-movements"}
      titleClassName={titleClassName || "o-movements__title"}
      tableClassName={tableClassName || "o-movements__table p-table"}
      stateRowClassName={stateRowClassName || "p-data-table__state"}
      errorRowClassName={errorRowClassName || "p-data-table__state--error"}
      getRowKey={getRowKey}
    />
  );
}

export default MainDataTable;
