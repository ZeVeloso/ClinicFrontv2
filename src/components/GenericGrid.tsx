import * as React from "react";
import {
  DataGrid,
  GridColDef,
  GridRowsProp,
  DataGridProps,
} from "@mui/x-data-grid";

interface GenericGridProps {
  columns: GridColDef[];
  rows: GridRowsProp;
  onRowAction?: (id: string, action: string) => void;
  gridProps?: Partial<DataGridProps>; // Allow additional DataGrid props
}

const GenericGrid: React.FC<GenericGridProps> = ({
  columns,
  rows,
  gridProps,
}) => {
  const getRowClassName = React.useCallback(
    (params: { indexRelativeToCurrentPage: number }) =>
      params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd",
    []
  );

  return (
    <DataGrid
      rows={rows}
      columns={columns}
      autoHeight
      getRowClassName={getRowClassName}
      initialState={{
        pagination: { paginationModel: { pageSize: 20 } },
      }}
      pageSizeOptions={[5, 10, 20, 50]}
      density="compact"
      disableMultipleRowSelection
      disableRowSelectionOnClick
      slotProps={{
        filterPanel: {
          filterFormProps: {
            logicOperatorInputProps: {
              variant: "outlined",
              size: "small",
            },
            columnInputProps: {
              variant: "outlined",
              size: "small",
              sx: { mt: "auto" },
            },
            operatorInputProps: {
              variant: "outlined",
              size: "small",
              sx: { mt: "auto" },
            },
            valueInputProps: {
              InputComponentProps: {
                variant: "outlined",
                size: "small",
              },
            },
          },
        },
      }}
      {...gridProps} // Spread additional props for extendability
    />
  );
};

export default GenericGrid;
