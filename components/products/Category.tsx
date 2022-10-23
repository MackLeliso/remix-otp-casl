import { Box, Grid } from "@mui/material";
import { Link } from "@remix-run/react";

//  product category  component
export default function Category({ categories }: any) {
  return (
    <Box bgcolor="whitesmoke" p={5} borderRadius={1} m={5}>
      {categories?.map((category: any) => (
        <Box
          width={150}
          color="whitesmoke"
          textAlign="center"
          fontWeight="bold"
          bgcolor="darkcyan"
          borderRadius={1}
          margin="12px"
          padding="12px"
          sx={{
            ":hover": {
              bgcolor: "darkgrey",
              color: "darkcyan",
              transition: ".5s",
            },
          }}
        >
          <Link
            style={{
              textDecoration: "none",
              alignSelf: "auto",
            }}
            to={`?category=${category.name}`}
          >
            {category.name}
          </Link>
        </Box>
      ))}
    </Box>
  );
}
