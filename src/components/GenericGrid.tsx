import * as React from "react";
import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid";

interface GenericGridProps {
  columns: GridColDef[];
  rows: GridRowsProp;
  onRowAction?: (id: string, action: string) => void;
}

const GenericGrid: React.FC<GenericGridProps> = ({ columns, rows }) => {
  return (
    <DataGrid
      rows={rows}
      columns={columns}
      autoHeight
      getRowClassName={(params) =>
        params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
      }
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
    />
  );
};

export default GenericGrid;
