import * as React from "react";
import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid";
import { Box, CircularProgress } from "@mui/material";

interface CustomizedDataGridProps {
  rows: GridRowsProp; // Rows passed as prop
  columns: GridColDef[]; // Columns passed as prop
  loading: boolean; // Loading state passed as prop
  error: string; // Error state passed as prop
}

const CustomizedDataGrid: React.FC<CustomizedDataGridProps> = ({
  rows,
  columns,
  loading,
  error,
}) => {
  if (loading) {
    return <CircularProgress />; // Show loading spinner while fetching data
  }

  if (error) {
    return <div>{error}</div>; // Show error message if fetching fails
  }

  return (
    <Box sx={{ height: 400, width: "100%" }}>
      <DataGrid
        autoHeight
        checkboxSelection
        rows={rows}
        columns={columns}
        getRowClassName={(params) =>
          params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
        }
        initialState={{
          pagination: { paginationModel: { pageSize: 20 } },
        }}
        pageSizeOptions={[10, 20, 50]} // Pagination options
        disableColumnResize
        density="compact" // Compact density
      />
    </Box>
  );
};

export default CustomizedDataGrid;
