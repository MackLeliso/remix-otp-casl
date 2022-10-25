import * as React from "react";
import Box from "@mui/material/Box";
import {
  GridColumns,
  DataGrid,
  GridToolbar,
  GridActionsCellItem,
  GridRowsProp,
  GridRowModesModel,
  GridRowModes,
  GridToolbarContainer,
  GridRowParams,
  MuiEvent,
  GridEventListener,
  GridRowId,
  GridRowModel,
} from "@mui/x-data-grid";
import { Form } from "@remix-run/react";
import { Button, TextField } from "@mui/material";
import { Add, Cancel, Delete, Edit, Save } from "@mui/icons-material";
import { db } from "~/utils/db.server";
import { deleteProduct, updateProduct } from "~/utils/product.server";
import { string } from "zod";

// columns of the grid

// product table components
export default function ProductTable({
  products,
  totalCount,
  submit,
  category,
}: any) {
  console.log("product table component", products);
  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(2);
  const [filter, setFilter] = React.useState();
  const [sort, setSort] = React.useState();
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
    {}
  );
  const [rowCountState, setRowCountState] = React.useState(totalCount || 0);

  interface EditToolbarProps {
    setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
    setRowModesModel: (
      newModel: (oldModel: GridRowModesModel) => GridRowModesModel
    ) => void;
  }
  function EditToolbar(props: EditToolbarProps) {
    const { setRows, setRowModesModel } = props;

    const handleClick = () => {
      const id = "id";
      setRows((oldRows) => [
        ...oldRows,
        { id, name: "", age: "", isNew: true },
      ]);
      setRowModesModel((oldModel) => ({
        ...oldModel,
        [id]: { mode: GridRowModes.Edit, fieldToFocus: "name" },
      }));
    };

    return (
      <GridToolbarContainer>
        <Button color="primary" startIcon={<Add />} onClick={handleClick}>
          Add record
        </Button>
      </GridToolbarContainer>
    );
  }
  // console.log("roe", rows);

  console.log("rowModesModel", rowModesModel);

  React.useMemo(
    () => ({
      page,
      pageSize,
      category,
      filter,
      sort,
    }),
    [page, pageSize, category, filter, sort]
  );
  React.useEffect(() => {
    setRowCountState((prevRowCountState: any) =>
      totalCount !== undefined ? totalCount : prevRowCountState
    );
  }, [totalCount, setRowCountState]);

  React.useEffect(() => {
    submit({ category: category[0] || "", offset: page, limit: pageSize });
  }, [page, pageSize]);
  React.useEffect(() => {
    submit(filter ? filter?.items[0] : null);
  }, [filter]);
  React.useEffect(() => {
    submit(sort ? sort[0] : null);
  }, [sort]);

  const handleRowEditStart = (
    params: GridRowParams,
    event: MuiEvent<React.SyntheticEvent>
  ) => {
    event.defaultMuiPrevented = true;
  };

  const handleRowEditStop: GridEventListener<"rowEditStop"> = (
    params,
    event
  ) => {
    event.defaultMuiPrevented = true;
  };

  const handleEditClick = (id: any) => async () => {
    console.log("edit", id);
    // React.useEffect(() => {
    //   return await updateProduct(id);
    // }, [id]);
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id: GridRowId) => async () => {
    console.log("delete", id);
    // React.useEffect(() => {
    const resp = await deleteProduct(id);
    console.log(resp);
    return resp;
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = products.find((row: any) => row.id === id);
    if (editedRow!.isNew) {
      setRows(products.filter((row: any) => row.id !== id));
    }
  };

  const processRowUpdate = (newRow: GridRowModel) => {
    const updatedRow = { ...newRow, isNew: false };
    setRows(
      products.map((row: any) => (row.id === newRow.id ? updatedRow : row))
    );
    return updatedRow;
  };
  const columns: GridColumns = [
    {
      field: "name",
      headerName: "Name",
      width: 140,
      editable: true,
    },
    {
      field: "description",
      headerName: "Desciption",
      width: 140,
      editable: true,
    },
    {
      field: "createdAt",
      headerName: "Date Created",
      width: 180,
      editable: true,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<Save />}
              label="Save"
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<Cancel />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<Edit />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<Delete />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <Box
      sx={{
        height: 350,
        width: "100%",
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        bgcolor: "whitesmoke",
        borderRadius: "5px",
        mt: "30px",
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
        components={{ Toolbar: GridToolbar }}
        rows={products?.map((product: any) => ({
          id: product?.id,
          name: product?.name,
          description: product?.description,
          createdAt: product?.createdAt,
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
        filterMode="server"
        onFilterModelChange={(newFilter) => setFilter(newFilter)}
        sortingMode="server"
        onSortModelChange={(newSort) => setSort(newSort)}
        // initialState={initialState}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={(newModel) => setRowModesModel(newModel)}
        onRowEditStart={handleRowEditStart}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        components={{
          Toolbar: EditToolbar,
        }}
        // componentsProps={{
        //   toolbar: { setRows, setRowModesModel },
        // }}
        experimentalFeatures={{ newEditingApi: true }}
      />
    </Box>
  );
}
