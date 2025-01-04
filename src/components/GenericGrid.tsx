import * as React from "react";
import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid";

interface GenericGridProps {
  columns: GridColDef[];
  rows: GridRowsProp;
  onRowAction?: (id: number, action: string) => void;
}

const GenericGrid: React.FC<GenericGridProps> = ({
  columns,
  rows,
  onRowAction,
}) => {
  const handleRowAction = (id: number, action: string) => {
    if (onRowAction) {
      onRowAction(id, action);
    }
  };

  return (
    <DataGrid
      rows={rows}
      columns={columns}
      getRowClassName={(params) =>
        params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
      }
      initialState={{
        pagination: { paginationModel: { pageSize: 20 } },
      }}
      pageSizeOptions={[10, 20, 50]}
      disableColumnResize
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
    />
  );
};

export default GenericGrid;
