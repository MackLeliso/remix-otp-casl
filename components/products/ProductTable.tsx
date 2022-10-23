import * as React from "react";
import Box from "@mui/material/Box";
import { GridColumns, DataGrid } from "@mui/x-data-grid";
import { Form } from "@remix-run/react";
import { TextField } from "@mui/material";

// columns of the grid
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

// product table components
export default function ProductTable({ products, totalCount, submit }: any) {
  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(2);
  const queryOptions = React.useMemo(
    () => ({
      page,
      pageSize,
    }),
    [page, pageSize]
  );
  const [rowCountState, setRowCountState] = React.useState(totalCount || 0);
  React.useEffect(() => {
    setRowCountState((prevRowCountState: any) =>
      totalCount !== undefined ? totalCount : prevRowCountState
    );
  }, [totalCount, setRowCountState]);

  React.useEffect(() => {
    submit({ offset: page, limit: pageSize });
  }, [page, pageSize]);

  return (
    <Box
      sx={{
        height: 350,
        width: "100%",
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <Form method="get" onChange={(e) => submit(e.currentTarget)}>
        <TextField
          sx={{
            display: "flex",
            alignItems: "flex-end",
            padding: "20px",
          }}
          name="search"
          variant="standard"
          placeholder="Search"
        />
      </Form>
      <DataGrid
        rows={products?.map((product: any) => ({
          id: product.id,
          name: product.name,
          description: product.description,
        }))}
        columns={columns}
        rowCount={rowCountState}
        rowsPerPageOptions={[2, 3, 5]}
        paginationMode="server"
        pagination
        page={page}
        pageSize={pageSize}
        onPageChange={(newPage) => setPage(newPage)}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        // initialState={initialState}
      />
    </Box>
  );
}
