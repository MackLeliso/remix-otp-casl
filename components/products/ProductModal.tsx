import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { Form } from "@remix-run/react";
export default function ProductModal({ form, actionData, categories }: any) {
  console.log("form", form);
  return (
    <>
      <Form method="post">
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          borderRadius={1}
          sx={{
            position: "absolute",
            width: "60%",
            transform: "translate(43%, 40%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
          gap={2}
        >
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Create Product
          </Typography>
          {form ? <input hidden={true} name="id" value={form.id} /> : null}
          <TextField
            id="filled-hidden-label-small"
            placeholder="Name"
            name="name"
            variant="filled"
            defaultValue={actionData?.field?.name || form?.name}
          />
          <Typography variant="subtitle2" color="error">
            {actionData?.fieldErrors?.name}
          </Typography>
          <TextField
            id="filled-hidden-label-small"
            placeholder="Desciption "
            name="description"
            variant="filled"
            defaultValue={actionData?.field?.description || form?.description}
          />
          <Typography variant="subtitle2" color="error">
            {actionData?.fieldErrors?.description}
          </Typography>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Category</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="categorie"
              label="Category"
              name="categoryId"
            >
              {categories?.map((cat: any) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            id="filled-hidden-label-small"
            placeholder="Price"
            name="price"
            variant="filled"
            defaultValue={actionData?.field?.price || form?.price}
          />
          <Typography variant="subtitle2" color="error">
            {actionData?.fieldErrors?.price}
          </Typography>
          <Button type="submit" color="primary" variant="contained">
            submit
          </Button>{" "}
        </Box>
      </Form>
    </>
  );
}
