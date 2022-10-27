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
import { Button, Modal, TextField } from "@mui/material";
import { Add, Delete, Edit } from "@mui/icons-material";
import { useSnackbar } from "notistack";
import ProductModal from "./ProductModal";

// product table components
export default function ProductTable({
  products,
  totalCount,
  submit,
  categories,
  category,
  user,
  actionData,
  message,
}: any) {
  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(3);
  const [filter, setFilter] = React.useState();
  const [sort, setSort] = React.useState();
  const [rows, setRows] = React.useState(products);
  const [form, setForm] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

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
      const id = uuid();
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
  React.useEffect(() => {
    actionData?.message
      ? enqueueSnackbar(actionData?.message, {
          disableWindowBlurListener: true,
          variant: "success",
          preventDuplicate: true,
        })
      : null;
  }, [actionData?.message]);
  React.useEffect(() => {
    message
      ? message.status === 200
        ? enqueueSnackbar(message?.message, {
            variant: "success",
            preventDuplicate: true,
          })
        : enqueueSnackbar(message?.message, {
            variant: "error",
            preventDuplicate: true,
          })
      : null;
  }, [message?.status === 200]);
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

  const handleEditClick = (row) => async () => {
    setForm(row);
    handleOpen();
    // <ProductModal />;
  };
  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id: GridRowId) => async () => {
    submit({ deletePID: id }, { replace: false });
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
      field: "picture",
      headerName: "Picture",
      width: 140,
      editable: true,
    },
    {
      field: "price",
      headerName: "Price",
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
      getActions: ({ row }) => {
        const { id, canDelete } = row;
        return [
          <GridActionsCellItem
            icon={<Edit />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(row)}
            color="inherit"
          />,
          <>
            {canDelete ? (
              <GridActionsCellItem
                icon={<Delete color="error" />}
                label="Delete"
                onClick={handleDeleteClick(id)}
                color="inherit"
              />
            ) : (
              <GridActionsCellItem
                disabled
                icon={<Delete />}
                label="Delete"
                onClick={handleDeleteClick(id)}
                color="inherit"
              />
            )}
          </>,
        ];
      },
    },
  ];
  return (
    <Box
      sx={{
        height: 600,
        width: "95%",
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
      <Box>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <ProductModal
            form={form}
            actionData={actionData}
            categories={categories}
          >
            <Button type="submit" color="primary" variant="contained">
              submit
            </Button>
          </ProductModal>
        </Modal>

        <Button color="primary" startIcon={<Add />} onClick={handleOpen}>
          Add product
        </Button>
      </Box>
      <DataGrid
        components={{ Toolbar: GridToolbar }}
        rows={products}
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
        // components={{
        //   Toolbar: EditToolbar,
        // }}
        componentsProps={{
          toolbar: { setRows, setRowModesModel },
        }}
        experimentalFeatures={{ newEditingApi: true }}
      />
    </Box>
  );
}
