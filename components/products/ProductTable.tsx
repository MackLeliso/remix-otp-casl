import * as React from "react";
import Box from "@mui/material/Box";
import { GridColumns, DataGrid } from "@mui/x-data-grid";

const columns: GridColumns = [
  {
    field: "name",
    headerName: "Name",
    headerAlign: "center",
    width: 140,
  },
  {
    field: "description",
    headerName: "Desciption",
    headerAlign: "center",
    width: 140,
  },
];

const rows = [
  {
    id: 1,
    first: "Jane",
    last: "Carter",
  },
  {
    id: 2,
    first: "Jack",
    last: "Smith",
  },
  {
    id: 3,
    first: "Gill",
    last: "Martin",
  },
];

export default function ProductTable({ products }: any) {
  const [page, setPage] = React.useState(0);
  console.log(page);

  return (
    <Box
      sx={{
        height: 300,
        width: "100%",
        "& .super-app-theme--header": {
          backgroundColor: "rgba(255, 7, 0, 0.55)",
        },
      }}
    >
      <DataGrid
        rows={products?.map((product: any) => ({
          id: product.id,
          name: product.name,
          description: product.description,
        }))}
        columns={columns}
        page={page}
        onPageChange={(newPage) => setPage(newPage)}
        pageSize={5}
        rowsPerPageOptions={[5]}
        pagination
      />
    </Box>
  );
}
